# Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the "+" button
4. Search for "HKI Elements"
5. Click "Download"
6. Restart Home Assistant

### Manual Installation

1. Download `hki-elements.js` from the [latest release](https://github.com/jimz011/hki-elements/releases)
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
