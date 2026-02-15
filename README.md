# HKI Elements

A collection of custom Home Assistant dashboard cards created by Jimmy.

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

## What's Included

This bundle includes five powerful custom cards:

1. **HKI Header Card** - Full-width customizable header with weather, time, and more
2. **HKI Button Card** - Highly customizable buttons with built-in popups and controls
3. **HKI Navigation Card** - Sleek navigation bar with floating action buttons
4. **HKI Notification Card** - Animated notification ticker with marquee scrolling
5. **HKI PostNL Card** - Track your PostNL packages

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the "+" button
4. Search for "HKI Elements"
5. Click "Download"
6. Restart Home Assistant

### Manual Installation

1. Download `hki-elements.js` from the [latest release](https://github.com/YOUR_USERNAME/hki-elements/releases)
2. Copy it to your `www` folder in your Home Assistant config directory
3. Add the following to your Lovelace resources (Settings → Dashboards → Resources):
   ```yaml
   url: /local/hki-elements.js
   type: module
   ```
4. Restart Home Assistant

## Usage

After installation, all five cards will be available in your Lovelace card picker:

- `type: hki-header-card`
- `type: hki-button-card`
- `type: hki-navigation-card`
- `type: hki-notification-card`
- `type: hki-postnl-card`

## Migration from Individual Cards

If you previously installed individual HKI cards, here's how to migrate:

### Option 1: Clean Migration (Recommended)

1. **Before installing HKI Elements**:
   - Note which individual cards you have installed
   - Your dashboard configurations will continue to work

2. **Install HKI Elements** via HACS or manually

3. **Remove old individual cards**:
   - Go to HACS → Frontend
   - Remove the individual HKI card repositories (e.g., "HKI Header Card", "HKI Button Card", etc.)
   - Remove the old resource entries from Settings → Dashboards → Resources
   
4. **That's it!** Your dashboards will continue working because the card types remain the same

### Option 2: Side-by-Side (Temporary)

You can run HKI Elements alongside individual cards temporarily:
- Both will work without conflicts
- Remove individual cards when ready
- No dashboard changes needed

## Documentation

For detailed documentation on each card, see:

- [HKI Header Card](docs/header-card.md)
- [HKI Button Card](docs/button-card.md)
- [HKI Navigation Card](docs/navigation-card.md)
- [HKI Notification Card](docs/notification-card.md)
- [HKI PostNL Card](docs/postnl-card.md)

Or visit the original repositories:
- [HKI Header Card](https://github.com/jimz011/hki-header-card)
- [HKI Button Card](https://github.com/jimz011/hki-button-card)
- [HKI Navigation Card](https://github.com/jimz011/hki-navigation-card)
- [HKI Notification Card](https://github.com/jimz011/hki-notification-card)

## Version

Current version: **1.0.0**

Individual card versions included:
- HKI Header Card: v2.0.5
- HKI Button Card: v1.0.6
- HKI Navigation Card: latest
- HKI Notification Card: latest
- HKI PostNL Card: v1.0.1

## Support

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/YOUR_USERNAME/hki-elements/issues).

## Credits

All cards created by [Jimmy](https://github.com/jimz011).

## License

MIT License - see individual card repositories for details.
