# It’s Anomaly Legacy — Game Design Report

**Status:** Design reference for the companion hub and future playable prototypes. Civilization modeling is in progress. Mechanics below describe design intent unless labeled as proposed.

## 1. One project, two design foundations

**Rise of the Kings** supplies the ancient foundation: the climb from market vendor to ruler, competing pharaohs, settlement building, royal houses, councils, succession, tombs, and relics. Preserve its identity as the historical foundation and a possible in-world discovery or Easter egg. It serves as the ancient opening of the Story campaign. Chapter naming remains open.

**Gold Dynasty** expands the playable civilization into a modern coastal world. Ancient royal institutions, architecture, monuments, bloodlines, and mysteries shape a contemporary society with ports, nightlife, industry, entertainment, government, crime, and luxury. A modern character can build a career without entering the royal storyline. **It’s Anomaly Legacy** connects these design foundations through the history players create and what later generations find.

The first world uses fictional geography inspired by Dubai, Abu Dhabi, Cairo, Giza, and ancient Egyptian landscapes. Target three distinct, connected worlds across the trilogy. Each has an aspirational playable scale around 1.5 times the GTA VI reference. The benchmark area and final dimensions remain open. Count playable water separately and prioritize density. The Duat space-jail concept remains a future-era entry point with booking-photo character creation. The Story campaign runs from the ancient opening into modern Gold Dynasty within one game. The structure of later titles remains open.

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

**Open design decisions:** the structure of later titles, dynasty stability and decline, succession and inheritance, pace of technological change, boundaries between single-player and shared history, rules for multiple sovereign territories, creator provider support and moderation, and production map size.

## 7. The civilization as the shared world

Treat the living civilization as the common game model. Government, businesses, venues, creator careers, property, and dynasties all act on the same version of the world. A creator booking can affect venue income and local reputation. A port closure can change prices and job offers. Consequential events from both can become part of a later era's history.

| Component | Responsibility |
| --- | --- |
| Game client | Displays the world and sends player actions to an authenticated game server |
| Authoritative world server | Validates actions, runs simulation rules, and tells connected players what changed |
| PostgreSQL | Stores current world state and durable history, including settlements, NPCs, rulers, laws, businesses, property, contracts, artifacts, and significant events |
| Private object storage | Holds world snapshots, backup exports, and approved media files. External videos and podcasts can be represented by links and moderation status |
| Companion site and phone links | Access authorized views or scoped submission endpoints through the server API |

Start with one studio-controlled cloud environment, a single test world, a managed PostgreSQL instance, and a private storage bucket. Give each world its own identity and scope reads and writes by world. Keep the database private to the service. Persist lasting state changes and related history together. Use snapshots, scheduled backups, and tested restores to recover a world. Keep account data and notification preferences access-controlled. Apply retention rules to temporary simulation data such as movement updates.

Prove the connection with one district. Book a creator event, confirm the venue and reputation records update, restart the world server, and verify the event and its effects are still there. Restore a snapshot into an isolated test world and check the same records. The history can later feed the Legacy Codex and era transitions as those rules are decided.

This cloud service runs and saves the world. Cloud play can connect to it the same way a local game client does. Provider, region, capacity, and operating budget are open. Status is architecture proposal.

## 8. Story and Online

**Proposed split:** Put Story and Online side by side on the main menu. Share the civilization model, districts, and gameplay rules where practical. Give each Story campaign its own private world state and each Online world its own shared state, save history, economy, and progression. Story runs on the player's pace. Online runs on the world's pace. The cloud can back up private Story saves and host shared Online worlds under separate world IDs and access rules.

### Story opening — from the outskirts to the capital

1. **Arrive at the market.** Begin on the outskirts of the ancient kingdom. Bring goods through the capital gate, meet a merchant, and earn a first stake.
2. **Follow the missing shipment.** A disrupted route raises prices. The player can help suppliers reopen trade, take a patron's offer, or negotiate a deal with a rival. Those choices build different relationships and give the player something to lose.
3. **Choose how to gain influence.** Trade, craft, politics, military service, or religious networks can lead toward ownership, public standing, or royal power. Becoming a ruler stays optional.
4. **Leave a record.** A business, decree, relic, family tie, or public dispute becomes a trace that a later Gold Dynasty protagonist can rediscover in the modern city. Exact succession and era-transition rules are open.

### One game across two eras

Rise of the Kings opens the campaign. Gold Dynasty continues that same campaign in the modern city. The era transition should use the player's own history. For example, a deal that reopens a trade route in the ancient chapter could leave a family seal and a charter that the modern protagonist discovers during a dispute over the old market site. That discovery gives the modern chapter its own stakes and makes the ancient choices matter in play.

Use one Story campaign save across both eras. The length of the ancient opening, the modern protagonist's connection to the opening character, and the exact legacy rules remain open.

### Online entry and the shared world

The Duat space-jail intake remains the proposed separate future-era opening. Players create a character, complete the intake sequence, and enter a shared world where other players and NPCs shape the economy, careers, factions, and events. Final timeline placement remains open. The default proposal gives each mode independent money, property, ranks, and inventories. A later opt-in bridge could display read-only family symbols, records, or cosmetic recognition in a Legacy Codex without granting economic or political power.

**First test:** Use one district in two separate worlds. Resolve a supply disruption in Story, then change the same district through shared play Online. Reload both and verify each mode retains its own outcomes.

## 9. Online Easter eggs and mythical discoveries

**Design direction:** Give Online its own substantial collection of Easter eggs. Use hidden weapons and relics, mythical creatures, environmental mysteries, and hidden places that players can discover while exploring the shared civilization.

| Proposed discovery | How players find it | What discovery unlocks |
| --- | --- | --- |
| Sealed royal armory | Piece together three maker's marks from a market, a ruined watchtower, and a submerged shrine | A secret ceremonial weapon with a distinctive handling style tuned for shared play |
| River guardian | Follow tracks and local stories during a rare flood | A creature encounter that can be observed and recorded in the Legacy Codex |
| The Forgotten Pharaoh | Follow a fragmentary inscription and compare it with a second record found by another player | A hidden chamber, a lost chapter of local history, and credit for the discoverers |
| Shifting desert passage | Revisit a familiar landmark after a sandstorm changes the terrain | A temporary route to a relic site, with clues that can reappear during a later storm |

### Ghost Easter eggs

- **The drowned ferryman.** On foggy nights, a silent boat crosses the old harbor and vanishes beside a pier that no longer exists. Following it reveals a submerged memorial and the names of a missing crew.
- **The palace procession.** During an eclipse, ghostly figures cross an abandoned royal courtyard. Follow their route to find a sealed room and a record that challenges the official account of a ruler’s disappearance.
- **The voice on the radio.** An unused station briefly broadcasts an old emergency announcement. The location it names leads to a site where explorers can compare the broadcast with surviving records.

Let players witness these alone or compare clues with friends. Some sightings can stay unexplained. Others can unlock local history in the Legacy Codex. Rare conditions should recur so players have another chance to discover them.

### Desert folklore and alien Easter eggs

- **The Lamp Beneath the Dunes.** An Aladdin-inspired discovery drawn from the traditional folktale. A sandstorm exposes an old caravan marker. Follow its shadow at dusk to find a cave entrance behind a collapsed caravan shelter. Inside, a brass lamp rests in a hidden chamber. Picking it up and rubbing it releases the genie, an original jinn bound to the lamp. The jinn offers three favors. For example, a player could ask to find a lost caravan, learn the route to a hidden oasis, or recover an heirloom for a local family. Each favor opens a different small quest and leaves a distinct Codex record. Favors unlock finite quests and discoveries. Rewards stay in line with comparable Online quests, and each payout is recorded once per player account across reconnects and repeat visits. One of the three favors can instead be spent on a direct, substantial in-game cash wish. Tune the fixed payout to feel like a windfall, comparable to a valuable Online quest, and show it before the player confirms. Each account can claim this wish once. Record the favor spent and credit the payout together so reconnects and repeat visits cannot duplicate it. The other favors remain available for quests or discoveries. Use original characters, dialogue, and art.
- **The second shadow.** An unidentified craft passes over the dunes during a meteor shower. Players who track its shadow find a piece of material etched with a pattern also visible in an ancient observatory. Comparing the two points to a second site.
- **The signal beneath the salt flats.** At certain times an old radio picks up a repeating sequence. Follow it to a buried relay that briefly projects an unfamiliar star map. Its connection to the Duat can remain an open mystery.

### The Storm-Crowned Guardian

An Online Easter egg inspired by the lightning-champion stories of Black Adam and Shazam. During a desert thunderstorm, lightning illuminates carvings on a ruined gate in sequence. Read them in order to open a temple chamber where an ancient guardian awakens. The guardian asks the player to carry a spark to the city's old beacon before the storm passes. Completing the trial lights the beacon for nearby players, records the discovery in the Legacy Codex, and awards a lightning-themed cosmetic. The guardian, costume, insignia, dialogue, and lore are original to It's Anomaly.

Mix permanent landmarks, rare weather-driven encounters, and clues that players can piece together over multiple sessions. Save individual and group discovery credit. Share discoveries through optional rumors and Codex records so explorers can choose how much to reveal. Repeatable access can keep rare discoveries playable after a server first. Test the impact of secret weapons on competitive balance.

For the first Online district, prototype one hidden weapon, one creature encounter, and one mystery that rewards sharing clues. Keep the exact Story transition between eras open for further discussion.

## 10. Inner-city ocean and mountain territory

Connect the existing three or four territories across the first world and add a distinct mountain territory on the far side of the desert. Keep the exact territory count and borders open.

**Inner-city ocean:** Bring a broad inlet of seawater into the city. Connect it to the open ocean through a navigable strait. Skyline waterfronts, beaches, and working ports face the inner water. Players can take a boat from an inner-city marina through the strait and out into open ocean. Give the inlet enough width and depth to feel like a sea inside the city.

**Recommended mountain profile:** Build a predominantly desert mountain range. Begin with dry foothills and red-rock canyons, climb through high passes, then reach a small, high summit zone with seasonal snow. The elevation transition keeps the range connected to the desert while giving the peak its own travel conditions, scenery, and discoveries. Preserve a fully dry range as an option while the world is being modeled.

### Mountain territory and future encounters

Reserve a large, explorable mountain territory beyond the desert, with multiple valleys, high passes, cavern networks, and a substantial snowy upper region. Give it room for travel routes, settlements, and later discoveries.

- **Yetis:** Early ideas include tracks in snowfields and rare sightings near high ridgelines.
- **Trolls:** Rocky ravines, caves, and old crossings give them distinct terrain.
- **Giants:** Remote basins and oversized ruins can hint at their presence before players encounter one.
- **Nephilim:** Reserve sites for a deeper lore thread, with possible traces in high ruins or sealed chambers. Keep their relationship to giants and the ancient civilization open for the founder to develop.

**Mountain wildlife in both modes:** Populate dry foothills with ibex and foxes, rocky cliffs with nesting raptors, and snowy upper valleys with cold-adapted wildlife. Give animals seasonal movement, shelter, and recognizable signs such as tracks and calls. In Story, a local guide might teach the player to read fresh tracks and find a pass. In Online, players can compare sightings and follow seasonal herds together. The final species list depends on the terrain and climate design.

Give Story and Online each a substantial share of the mountain discoveries. Story should offer satisfying encounters and lore within the campaign. Online should have discoveries of its own, including mysteries players can investigate together. Keep the placement of Yetis, trolls, giants, and Nephilim open, including whether selected creatures appear in both modes through different encounters.

Treat these as future encounter concepts. Exact habitats, behavior, story roles, and discovery conditions remain open while the terrain is modeled.

## 11. Carnivals, fairs, and theme parks

Add a permanent amusement park on the inner-city ocean with a playable Ferris wheel overlooking the strait, midway games, food stalls, live stages, and room for more rides. Connect it to the waterfront by boardwalk and ferry.

Traveling fairs can rotate through desert towns, city plazas, and mountain foothills as seasons change. Give each stop local food, games, performers, and prizes. In Story, a fair can host a character encounter or a local quest. Online, players can ride together, compete in midway games, sell food, or book a live set through the creator career. Treat locations, schedules, and ride selection as proposals while the map takes shape.

## 12. Celebrity society in the Gold Dynasty storyline

Use Dubai Bling as a tonal reference for luxury entrepreneurship, social circles, exclusive events, and rivalries that play out in public. Build original characters, businesses, venues, and plotlines for the modern campaign. Leave room to draw on additional celebrity-show concepts as the founder names them.

**Proposed storyline:** A waterfront launch brings together a fashion founder, a nightlife owner, a celebrity host, and a creator. The player enters through an invitation, a performance booking, or a production job. When two patrons claim credit for the same launch, the player can choose whose version to air, negotiate a joint appearance, or walk away. That choice changes who trusts them, which invitations and contracts they receive, and what the city's media says about them.

Use Bad Girls Club as a tonal reference for an original waterfront villa reality show with auditions, strong personalities, shifting friendships, confessionals, and a reunion. Players can audition as cast or join production through the creator career.

Tie the show to fictional ruling families. One house could own the villa, another could sponsor the season, and a younger relative could join the cast to build a public identity. During the reunion, a cast member can choose whether to back a roommate who challenged a sponsor's account of a public incident. That choice can change cast relationships, invitations from the houses, and future media contracts. The celebrity storyline extends into businesses, press, nightlife, and creator work across the city. Keep further show references and the final cast open.

### Entertainment networks and the ruling class

Use Zeus Network as a reference for a streaming outlet built around reality stars and reunions, Bravo for ensemble reality, E! for celebrity coverage, and Netflix for a broader streaming service that carries luxury reality programming. Create fictional networks and ownership structures for Gold Dynasty.

Give rival ruling houses different ties to entertainment. One owns a reality streamer that commissions the villa show. Another backs a prestige channel that carries fashion launches and society coverage. An independent outlet bids for interviews and creator-led podcasts. Networks can commission shows, offer exclusive deals, compete for distribution, and decide what gets promoted. Players can move between cast, host, producer, and independent creator roles through the existing creator career.

**Bring your own work:** A player can use their existing podcast setup, music tools, or video channel and paste a link to an authorized episode, track, or video through the in-game inbox or optional phone handoff. Use the link as a portfolio sample for an audition or as a submission for a specific interview, screening, or performance. A fictional network or ruling-house event can feature approved submissions through supported links or embeds. The creator keeps publishing through their existing tools.

**Camera crew and event coverage:** Add a playable camera operator role. A player can take a network assignment or cover an event for an independent creator, film fictional shows and ruling-house events, and submit selected in-game footage to the production. For example, a camera operator covers a palace gala and an independent podcast host pitches a companion interview with a link to an episode they already published.

**Story example:** Two outlets want the same reunion interview. A royal-backed streamer offers a better contract and access to the palace gala. The independent outlet offers more control over the finished episode. The network that airs it shapes which audience hears the story first, and the player's choice affects later contracts and relationships with the houses.

### Online creator income and network contracts

Place the bring-your-own-content link feature and creator contract progression in Online. Players can submit authorized links to existing music, podcasts, or videos via the inbox or optional phone handoff. Offer small recurring in-game income through bookings, production shifts, and repeat commissions. Track delivery history and public reputation so scouts can discover a player through a performance, an approved portfolio link, or word of mouth. A scout could approach the creator directly at a venue, gala, or other public event.

Major offers are rare. A fictional network or ruling-house entertainment company might offer a creator a contract worth $2 million in game currency to keep producing episodes, provide tracks, or grant limited rights to feature selected work. Show total value, up-front payment, milestone or recurring payments, deliverables, term, and exclusivity before acceptance. Let players negotiate or decline. Treat the figure as an illustrative payout subject to balancing, and keep in-game contract earnings separate from any external creator revenue. Give camera crews and producers paid assignments tied to the resulting shows and events.

### Spending, wealth, and neighborhood crime in Online

Make a major contract a meaningful gain with choices about where the money goes. A creator can bank the payout, rent studio time, hire a crew, lease a venue, or put a substantial share into buying and outfitting a studio. Show any expected delivery costs before signing and distinguish them from optional upgrades. Price premium property, equipment, and production at scales that can absorb part of a windfall. Leave room for savings and profit, especially when players already have equipment or choose a lean production. Tune prices and payouts together through playtesting.

Track a rolling neighborhood crime rate based on simulated incidents. Let it rise and cool over time, with visible effects on businesses, event staffing, and local news. For example, a venue in a district seeing more incidents might change its schedule or offer paid security shifts. Give players ways to respond through lawful community and business roles. Apply ordinary operating costs and any chosen security expense transparently, with crime pressure varying by place and time.

**Design references:** Gold Dynasty foundation and trilogy notes, Living Civilization gameplay and realism notes, cross-release account continuity concepts, Hidden Chronicles Easter egg notes, character creation and space-jail brief, and the Itanimulli Legacy companion README.
