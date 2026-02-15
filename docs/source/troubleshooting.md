# Troubleshooting

### Card shows "Entiteit niet gevonden"

**Cause:** PostNL integration not installed or entity doesn't exist

**Solution:**
1. Install [arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl) integration
2. Configure PostNL credentials in integration
3. Check Developer Tools → States for entity
4. Verify entity ID in card config

### No packages showing

**Cause:** No active packages or `days_back` limit too restrictive

**Solution:**
- Increase `days_back` value
- Check if PostNL integration is receiving data
- Verify sensor has package attributes

### Animation not showing

**Cause:** `show_animation: false` or no package selected

**Solution:**
- Set `show_animation: true`
- Click on a package to trigger animation

### Sent packages not showing

**Cause:** `distribution_entity` not configured

**Solution:**
```yaml
distribution_entity: sensor.postnl_distribution
show_sent: true
```

### Custom images not loading

**Cause:** Incorrect path or image not accessible

**Solution:**
- Use `/local/` prefix for files in `www` folder
- Use full URLs for external images
- Verify image exists and is accessible

---
