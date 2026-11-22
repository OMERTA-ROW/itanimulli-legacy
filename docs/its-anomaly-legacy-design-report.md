# It’s Anomaly Legacy — Game Design Report

**Status:** Design reference for the companion hub and future playable prototypes. Civilization modeling is in progress. Mechanics below describe design intent unless labeled as proposed.

## 1. One project, two design foundations

**Rise of the Kings** supplies the ancient foundation: the climb from market vendor to ruler, competing pharaohs, settlement building, royal houses, councils, succession, tombs, and relics. Preserve its identity as the historical foundation and a possible in-world discovery or Easter egg. Its final title and chapter placement remain open.

**Gold Dynasty** expands the playable civilization into a modern coastal world. Ancient royal institutions, architecture, monuments, bloodlines, and mysteries shape a contemporary society with ports, nightlife, industry, entertainment, government, crime, and luxury. A modern character can build a career without entering the royal storyline. **It’s Anomaly Legacy** connects these design foundations through the history players create and what later generations find.

The first world uses fictional geography inspired by Dubai, Abu Dhabi, Cairo, Giza, and ancient Egyptian landscapes. Target three distinct, connected worlds across the trilogy. Each has an aspirational playable scale around 1.5 times the GTA VI reference. The benchmark area and final dimensions remain open. Count playable water separately and prioritize density. The Duat space-jail concept remains a future-era entry point with booking-photo character creation. Era order and the structure of later titles remain open.

## 2. The living civilization

| System | Player interaction | Consequence in the world |
| --- | --- | --- |
| Land and construction | Acquire land, commission modular designs, hire labor, build workshops, roads, irrigation, homes, palaces, and hidden spaces | Terrain, resources, upkeep, and transport determine what a settlement can sustain |
| Resource economy | Farm, fish, mine, refine gold, craft at a forge, store goods, and move shipments | Weather, disrupted routes, scarcity, and local demand change supply, jobs, and prices |
| Work and career | Start through local work, deals, or small contracts and grow into a business, government, entertainment, news, or public service | Relationships, equipment, and reputation open opportunities over time |
| Government and power | Form alliances, run councils, set laws and budgets, maintain institutions, command armies, and contest territory | Policy affects public trust and trade. Mobilization consumes wages and supplies. Multiple rulers can coexist |
| NPC society | Meet recurring characters with schedules, motives, memories, family ties, and competing ambitions | A contact can become a manager, rival, successor, or independent leader. Rumors depend on who saw what |
| Law and justice | Report events, gather fictional evidence, face investigation, and interact with police, courts, detention, and prison | Witnesses, news coverage, local laws, and faction influence change case and reputation outcomes |
| Health and ecology | Manage light hunger and thirst, injuries, recovery, and changing terrain or water conditions | Seasons, storms, scarcity, wildlife, and visibility alter travel and daily work without constant meter management |

Begin with one neighborhood where a job, delivery, shop, household, NPC routine, and public event can all affect one another. Use the same economy and event rules for player and NPC activity where practical. Preserve physical interaction with doors, vehicle latches, shop equipment, and other objects as an interaction goal. The wider vehicle scope covers classics, modern and electric cars, motorcycles, working vehicles, yachts and smaller craft, cruise ships, and aircraft. Beaches and oceans support swimming, diving, surfboards, parasailing, gliding, and discoverable shipwrecks or treasure. Determine which interiors and vehicles are playable through vertical-slice testing.

## 3. Dynasty mechanics and continuity

Gold Dynasty’s everyday mechanics create the material that legacy builds on. A player accumulates relationships, wealth, property, public reputation, laws, conflicts, crafted objects, and institutions by playing. Those systems determine what later characters have to work with.

| Created in play | Possible later expression |
| --- | --- |
| An heir, alliance, or trusted lieutenant | A successor, rival claim, inherited obligation, or rediscovered family tie |
| A shop, port, farm, law, or public institution | A working asset, successor organization, disputed holding, or ruin |
| A tomb, monument, inscription, or crafted relic | An archaeological site, public record, recovered object, or quest |
| A war, broken promise, or peace agreement | Changed borders, old enemies, competing histories, or a treaty with continuing effects |
| A stage career, broadcast, or well-known creator | A recording or fictional archive, venue history, fan community, or reputation tied to the era |

**Established direction:** account history and lineage persist across releases. A new protagonist can discover evidence of past lives. Death, succession, sealing, burial, and possible return are distinct. Another player killing a character does not transfer the character’s possessions to the killer. Returning as a legendary character does not automatically restore past political power or wealth.

**Proposed implementation:** give durable identities to characters, estates, institutions, artifacts, and significant places. Record consequential events, such as a port charter, a disputed succession, or a tomb burial. Generate era transition snapshots from those events. Import a selected history safely, keep different playthroughs distinct, and make repeated imports deterministic and nonduplicating. A Legacy Codex can show lineage, provenance, and a distinction between historical evidence and in-world rumors. Scarab Seals can identify artifacts across eras.

**Example:** A player creates a port, builds reserves, delegates management, signs a trade agreement, and designates a successor. A later era could reveal a thriving port with a rival house at its head, or a ruined port with surviving charter records. The civilization model comes first. The timing, rules of inheritance, measures of institutional stability, and exact carryover criteria remain open.

## 4. Creator, music, podcast, and video careers

Make creator a playable career alongside musicians, actors, influencers, journalists, advertisers, and venue operators. Players discover opportunities through venues, contacts, studios, or the in-game phone. They can build an audience, book repeat appearances, and negotiate fictional contracts. Creator roles can interact with the city’s news, business, nightlife, and reputation systems.

| Path | Starts in the game | Optional real-phone step | In-game outcome |
| --- | --- | --- | --- |
| Musician | Accept a club gig or book a studio | Open a verified submission link for an original, rights-cleared track | Review status, stage booking, set list, attendance, and reputation |
| Video creator | Accept a screening, creator event, or channel feature | Submit a permitted YouTube video link | Approved feature in an in-game venue or feed, with an external watch link or permitted embed where supported |
| Podcast creator | Book a studio slot or accept a talk-show invitation | Submit an authorized episode link | Approved episode listing, interview, show booking, or in-game audience response |
| In-game-only creator | Use a fictional show format or licensed in-game material | Complete the flow in the in-game inbox | Earn in-game opportunities through the same career path |

**Phone handoff:** Trigger from the specific interaction, such as booking a show or selecting a venue’s submission option. Show the request in the in-game inbox. Offer a copyable link, a QR option, or an optional text to a verified number with explicit opt-in. The scoped, expiring link opens the matching submission on the player’s phone. A creator can paste a public video or podcast URL, or submit an authorized track through the appropriate form. After submission, the game inbox shows pending, approved, rejected, withdrawn, or unavailable status. Expired links can be reissued. Failed SMS delivery leaves the inbox path usable.

**Proposed publishing boundary:** Start with one provider and reviewer-only previews. Use provider-supported links or embeds. Keep platform accounts private and handle removed or private media gracefully. Require rights attestation and moderation before broad display. Treat in-game compensation, reputation, and sponsorship as fictional gameplay. External views, advertising revenue, and royalties remain governed by the creator’s platform. Live SMS, external provider integrations, and music ingestion require separate implementation and validation.

## 5. Economy, access, and distribution

- Build the in-game economy first. Currency, gold depositories, company ownership, contracts, trades, fees, and market simulation should be testable inside the game.
- Preserve the proposed Itanimulli Coin, community treasury, and real-value concepts as separate future decisions. Make the first prototype operate entirely with fictional assets.
- Cloud play is a target for supported computers, consoles, tablets, phones, and TVs. Evaluate a phone paired by QR as a controller and use the TV remote for basic navigation where supported.
- Keep direct studio distribution and platform publishing as roadmap work. Legacy’s existing repository is a companion and pitch hub. Use Concept or Demo labels for any features shown there.

## 6. Implementation sequence and acceptance

1. **Companion hub documentation.** Publish this design report and use it as the reference for future hub updates.
2. **Civilization slice.** Model a small lived-in district with homes, businesses, a market or waterfront, a venue, and NPC routines. Demonstrate a supply disruption changing prices, schedules, or offers. Keep NPC memories bounded and preserve event history through reload.
3. **Creator slice.** Prototype one venue opportunity and one submission card using sample media. Test the phone handoff, moderated approval, withdrawal, unavailable media, and inbox-only completion.
4. **Legacy slice.** Save one player-created institution, one successor, and one artifact. Advance to a sample later era and show the results in the Codex. Verify repeated import, separate playthroughs, and predictable recovery after a failed transition.
5. **Scale validation.** Measure NPC simulation, multiplayer persistence, streaming latency, interaction density, and water traversal before committing to map or platform targets.

**Open design decisions:** era and title structure, dynasty stability and decline, succession and inheritance, pace of technological change, boundaries between single-player and shared history, rules for multiple sovereign territories, creator provider support and moderation, and production map size.

**Design references:** Gold Dynasty foundation and trilogy notes, Living Civilization gameplay and realism notes, cross-release account continuity concepts, Hidden Chronicles Easter egg notes, character creation and space-jail brief, and the Itanimulli Legacy companion README.
