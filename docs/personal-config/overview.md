# Personal Config

This section is my own real Home Assistant dashboard, shared as-is for reference and inspiration — not a tutorial. It shows one way to combine the cards in this repo (mainly the [HKI Header Card](../cards/hki-header-card/overview.md), [HKI Button Card](../cards/hki-button-card/overview.md), and [HKI Notification Card](../cards/hki-notification-card/overview.md)) into a full dashboard.

Entity IDs, sensor names, automations, and integrations referenced throughout are specific to my own setup and will not work if pasted directly into yours — swap them for your own entities.

The dashboard is a single `views:` list; each page here is one view from that list, split out so you don't have to scroll through the entire file to find the part you're after.

## Views

- [Home](home.md) — the landing view
- [Security](security.md)
- **Rooms**:
    - [Rooms Hub](rooms-overview.md) — links out to each room subview below
    - [Living Room](rooms/living-room.md)
    - [Dining Room](rooms/dining-room.md)
    - [Kitchen](rooms/kitchen.md)
    - [Toilet](rooms/toilet.md)
    - [Hallway Downstairs](rooms/hallway-downstairs.md)
    - [Bedroom](rooms/bedroom.md)
    - [Office](rooms/office.md)
    - [Bathroom](rooms/bathroom.md)
    - [Walk-in-Closet](rooms/walk-in-closet.md)
    - [Hallway Upstairs](rooms/hallway-upstairs.md)
    - [Attic Front](rooms/attic-front.md)
    - [Attic Back](rooms/attic-back.md)
    - [Laundry Room](rooms/laundry-room.md)
    - [Front Yard](rooms/front-yard.md)
    - [Back Yard](rooms/back-yard.md)
    - [Garage](rooms/garage.md)
- [Energy](energy.md)
- [Find My](find-my.md)
- [Roborock](roborock.md)
- [Waste](waste.md)
- [F1](f1.md)
- [P2000](p2000.md)
- [Parcel](parcel.md)
- [Climate](climate.md)
- [Lights](lights.md)
- [Development](development.md) — my own scratch view for testing new card configs, not meant to be tidy
