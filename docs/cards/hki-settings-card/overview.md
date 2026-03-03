# HKI Settings Card

Global defaults editor for HKI cards. This card lets you define shared defaults once and have them automatically applied to other HKI cards when those fields are not explicitly set.

***NOTE: HKI cards are primarily built for the Home Assistant visual editor. YAML docs focus on practical usage and may not list every editor field.***

## Features

- Configure global defaults for `hki-button-card`, `hki-header-card`, `hki-navigation-card`, and shared popup styling.
- Defaults are stored in browser local storage and reused across dashboards on the same device/browser.
- Per-card values still take priority. Global defaults only fill missing values.
- Includes scoped reset actions (`button`, `header`, `navigation`, `popup`) and full reset.
- Designed for UI editor use, with grouped sections and template-friendly fields.
