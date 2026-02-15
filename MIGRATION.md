# Migration Guide

## Moving from Individual HKI Cards to HKI Elements

This guide helps you migrate from individual HKI card installations to the unified HKI Elements bundle.

## Why Migrate?

- **Single installation**: Install all cards at once instead of managing five separate repositories
- **Single resource**: Only one JavaScript file to load, potentially faster page loads
- **Easier updates**: Update all cards together through one HACS update
- **No breaking changes**: All card types remain exactly the same

## Will My Dashboards Break?

**No!** Your existing dashboards will continue to work exactly as before because:

- Card type names remain unchanged (e.g., `hki-header-card` is still `hki-header-card`)
- All configuration options remain the same
- The bundled cards are identical to the individual versions

## Migration Steps

### Step 1: Check Your Current Setup

Before starting, identify which HKI cards you currently have installed:

Go to **HACS → Frontend** and look for:
- HKI Header Card
- HKI Button Card  
- HKI Navigation Card
- HKI Notification Card
- HKI PostNL Card

Also check **Settings → Dashboards → Resources** for entries like:
```
/hacsfiles/hki-header-card/hki-header-card.js
/hacsfiles/hki-button-card/hki-button-card.js
/hacsfiles/hki-navigation-card/hki-navigation-card.js
/hacsfiles/hki-notification-card/hki-notification-card.js
/hacsfiles/hki-postnl-card/hki-postnl-card.js
```

### Step 2: Install HKI Elements

#### Via HACS:
1. Go to **HACS → Frontend**
2. Click the **+** button
3. Search for **"HKI Elements"**
4. Click **Download**
5. Restart Home Assistant

#### Manually:
1. Download `hki-elements.js` from the [latest release](https://github.com/YOUR_USERNAME/hki-elements/releases)
2. Place it in your `/config/www/` folder
3. Go to **Settings → Dashboards → Resources**
4. Add a new resource:
   - URL: `/local/hki-elements.js`
   - Type: JavaScript Module
5. Restart Home Assistant

### Step 3: Verify Everything Works

After restarting:
1. Open one of your dashboards that uses HKI cards
2. Verify all cards display and function correctly
3. Check browser console (F12) for any errors

You should see the HKI Elements banner in the console:
```
 HKI-ELEMENTS  v1.0.0 
```

### Step 4: Remove Old Individual Cards

Once verified that everything works:

#### Remove from HACS:
1. Go to **HACS → Frontend**
2. For each individual HKI card:
   - Click on the card
   - Click the three dots (⋮) menu
   - Select **Remove**
   - Confirm removal

#### Remove Old Resources:
1. Go to **Settings → Dashboards → Resources**
2. Remove these old entries (if present):
   - `/hacsfiles/hki-header-card/hki-header-card.js`
   - `/hacsfiles/hki-button-card/hki-button-card.js`
   - `/hacsfiles/hki-navigation-card/hki-navigation-card.js`
   - `/hacsfiles/hki-notification-card/hki-notification-card.js`
   - `/hacsfiles/hki-postnl-card/hki-postnl-card.js`

3. Restart Home Assistant (optional, but recommended)

### Step 5: Enjoy!

You're now using the unified HKI Elements bundle! Future updates will update all cards at once.

## Rollback (If Needed)

If you encounter any issues, you can easily rollback:

1. Keep the old individual cards installed while testing HKI Elements
2. If there's a problem, simply remove the HKI Elements resource
3. Restart Home Assistant
4. Everything will revert to using the individual cards

## Side-by-Side Running (Temporary)

You can temporarily run both HKI Elements and individual cards:

- Both will coexist without conflicts
- The last loaded resource "wins" for each card type
- Resources are loaded in the order shown in Settings → Resources
- This is useful for testing before fully migrating

## FAQs

**Q: Do I need to change my dashboard YAML?**  
A: No! All card configurations remain exactly the same.

**Q: Can I uninstall individual cards immediately after installing HKI Elements?**  
A: Yes, but we recommend testing first to ensure everything works.

**Q: What happens to my custom card configurations?**  
A: Nothing changes. All configuration options are preserved.

**Q: Will my card editor still work?**  
A: Yes! All visual editors are included in the bundle.

**Q: Can I still use theme customizations?**  
A: Absolutely! All theming and customizations work exactly as before.

**Q: What if I only use some HKI cards?**  
A: That's fine! The bundle includes all cards, but you only use the ones you need. The file size is still reasonable.

**Q: How do I update HKI Elements?**  
A: Through HACS like any other frontend integration. You'll get a notification when updates are available.

## Need Help?

If you encounter issues during migration:

1. Check the browser console (F12) for errors
2. Verify resource URLs in Settings → Dashboards → Resources
3. Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. Open an issue on [GitHub](https://github.com/YOUR_USERNAME/hki-elements/issues)

## Contributing

Found an issue or have a suggestion? Please report it on our [GitHub repository](https://github.com/YOUR_USERNAME/hki-elements).
