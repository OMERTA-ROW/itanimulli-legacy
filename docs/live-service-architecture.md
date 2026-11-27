# It's Anomaly / Itanimulli Legacy — Live-Service Architecture Blueprint

Status: **Proposed design only**. This repository currently represents a web companion/pitch experience, not a production game. Nothing in this document asserts that game servers, payments, multiplayer, or cloud infrastructure are operational.

## Goals and boundaries
- Build a reusable foundation for persistent, multiplayer open-world gameplay across evolving eras and locations.
- Preserve player identity, lineage, ownership, artifacts and economy across sessions and future world expansions.
- Support regionally hosted low-latency simulation and rolling content/backend releases.
- Protect players and their data with server authority, least privilege, and auditable operations.
- **Non-goals for this PR:** provision cloud resources, enable autonomous deployments, implement gameplay networking, collect personal data, or activate an in-game cryptocurrency.

## Proposed logical topology

```text
PC / console / mobile / cloud-streaming clients
           |
CDN + edge DDoS mitigation + regional ingress
           |
Identity / session gateway / matchmaking
           |
Regional authoritative dedicated game-server fleets
   | zone simulation | interest management | transfer coordinator |
           |
Shared platform APIs (inventory, property, contracts, quests, social, NPC orchestration)
           |
Transactional datastore + append-only ledger + cache + event bus
           |
Telemetry, analytics, moderation and live-operations control plane
```

Control plane and data plane must be isolated. Clients must not write directly to the authoritative economy, ownership or world-state databases. Regions should own latency-sensitive simulation; globally shared services should be accessed asynchronously where possible, with explicit consistency rules.

## World simulation and continuity
1. Divide large world maps into bounded simulation zones and separately instanced interiors/events.
2. Give each entity a single authoritative owner at any moment; replicate only relevant nearby entities (interest management).
3. Prepare destination zones before a handoff; transfer entity authority with versioned snapshots, idempotent handoff tokens, acknowledgement and timeout recovery.
4. Persist durable player progress and property ownership separately from transient physics, traffic and crowd simulation.
5. Use deterministic identifiers and reconciliation for inventory, contracts, lineage and unique Scarab Seal artifacts.
6. Start with one playable district, not the full three-map scope. Benchmark active players per zone, entity count, tick rate, bandwidth and handoff latency before expansion.

## Deployment and rolling updates
- CI: lint, tests, type checks, dependency and secret scans, build provenance, signed artifacts, integration and load tests.
- Separate client assets, backend APIs and authoritative simulation releases. Use explicit protocol-version compatibility windows.
- Stage -> canary for new sessions -> progressive regional rollout -> stop new admissions to old fleets -> safe zone/session drain -> retire old version.
- For changes incompatible with live simulation state, require controlled transitions or reconnect; do not promise universal zero-interruption updates.
- Feature flags should be scoped by environment, region and cohort, with kill switches and audit history.
- Database migrations use expand/migrate/contract; rollback code only when the data schema remains compatible.
- Preserve append-only economy events across rollbacks. Never revert a ledger by restoring an older snapshot over confirmed transactions.
- Rollback triggers: elevated disconnects, p95 latency, server crash rate, failed transfers, economy reconciliation mismatches and authorization errors.
- Production deployments require authorized operator approval and a documented recovery runbook.

## Security and anti-cheat
- Authentication: OpenID Connect/OAuth 2.0 where applicable, MFA/passkeys for privileged users, short-lived tokens and session revocation.
- Encryption: TLS 1.3 for APIs; authenticated encryption and replay protection for realtime transport; managed keys and rotation.
- Network: DDoS filtering, rate limits, private service networks, restricted egress and workload identities.
- Access: role-based/attribute-based authorization, object-level access checks, least privilege and audited administrator actions.
- Player privacy: data minimization, retention/deletion workflows, encrypted backups, consent and jurisdictional compliance review.
- Server-authoritative movement, combat, cooldowns, currency, items and property transactions. Treat client telemetry as untrusted.
- Double-entry or equivalent balanced economy ledger with unique transaction IDs, idempotency and reconciliation; no direct client balance edits.
- Detect anomalous movement, item duplication, bots and suspicious economic activity with server-side signals; review high-impact enforcement and provide appeals.
- Never ship server credentials, private keys, anti-cheat detection thresholds or administrative endpoints to game clients.
- Threat-model account takeover, replay attacks, race conditions, inventory duplication, compromised moderators, bots and denial-of-service.

## Hosting shortlist and selection
| Approach | Fit | Tradeoff |
|---|---|---|
| AWS + Amazon GameLift Servers | Managed dedicated game fleets and regional session placement | AWS dependency and game-specific integration work |
| Azure + PlayFab Multiplayer Servers | Game-oriented hosting, identity/lobby ecosystem | Platform integration and regional cost evaluation |
| Kubernetes + Agones on GKE/EKS/AKS | Portable custom orchestration and deep fleet control | Higher operational staffing and reliability burden |

**Initial recommendation:** benchmark AWS GameLift Servers with a managed PostgreSQL-compatible transactional database, Redis-compatible ephemeral cache, object storage/CDN and centralized observability. Choose final provider only after latency tests from target player regions and realistic load/cost tests. Avoid multi-cloud as an initial requirement.

## Initial service-level objectives (targets, not measured results)
- Regional player-to-server p95 latency: <80 ms for appropriately located players.
- World simulation baseline: 20–30 ticks/s, with separate combat benchmark.
- Critical platform API availability: 99.95% monthly.
- Regional incident recovery-time objective: <=30 minutes.
- Persistent-state recovery-point objective: <=5 minutes, with stronger durability guarantees for confirmed ledger transactions.
- Compatible application rollback initiation: <=5 minutes.

Measure disconnects, server-frame time, queue duration, handoff failure rate, ledger reconciliation, cost per concurrent player and abuse false-positive rate.

## Phased implementation backlog
**Phase 0 — discovery:** choose engine/network stack, platform targets, target CCU and per-zone player density; build load/cost model and threat model.

**Phase 1 — vertical slice:** one authoritative district, authentication, a basic player profile, movement, inventory and local persistent state. Use infrastructure as code and a non-production environment.

**Phase 2 — persistence:** zone transfer, unique artifact IDs, property ownership, transaction ledger, snapshots and crash recovery.

**Phase 3 — operations:** regional fleets, metrics, tracing, canary releases, feature flags, anti-cheat evidence, moderation workflow and rollback drills.

**Phase 4 — closed alpha:** load and failure injection, privacy review, economy exploits testing, measured SLOs, regional latency validation and budget gates.

### Required acceptance criteria before production
- [ ] Target engine, supported devices, CCU and zone density documented
- [ ] Authoritative movement/combat and economy integration tests pass
- [ ] Replay, duplication and cross-zone handoff tests pass
- [ ] Canary deployment and rollback drill observed in staging
- [ ] Data backup/restore and ledger reconciliation tested
- [ ] Secrets, dependencies and container images scanned
- [ ] Access control, audit logs and privacy review approved
- [ ] Regional latency/load results and monthly cost estimate reviewed
- [ ] Operator approval required for live deployment

## Companion site integration (future work)
The current Lovable site may display this blueprint as a clearly marked **Concept / Proposed Architecture** section. Do not add fake server status, fabricated player counts, simulated security verification badges, or claims that the multiplayer backend is already live.

## Design decisions to resolve
1. Engine: Unreal Engine, Unity or custom?
2. First target: PC, console, mobile or cloud streaming?
3. Concurrent users: total peak CCU and simultaneous interacting players per district?
4. Persistent world: shared global economy with regional simulations, or separate regional economies?
5. Player data residency, moderation jurisdictions and budget ceiling?
6. How do the ancient-era legacy systems map into future-era progression without breaking ownership?
