# Troubleshooting

### Notifications Not Appearing

**Problem:** Service call succeeds but no notification shows

**Solutions:**
1. Verify sensor entity exists in Developer Tools → States
2. Check HKI Notification Card is configured with correct entity
3. Ensure card's `display_mode` is set (ticker, marquee, list, or button)

### Notifications Not Persisting

**Problem:** Notifications disappear after HA restart

**Solutions:**
1. Integration automatically saves state
2. Check Home Assistant has write permissions to `.storage/` folder
3. Verify no errors in Home Assistant logs

### Action Not Working

**Problem:** Tapping notification doesn't trigger action

**Solutions:**
1. Verify `action_type` matches the parameters provided
2. For `call-service`, check service exists and target is valid
3. For `navigate`, verify path is correct
4. Enable `confirm: true` to debug - you'll see what's being executed

### Multiple Sensors Not Working

**Problem:** Can't create multiple notification sensors

**Solution:**
Each integration instance creates one sensor. Add the integration multiple times with different names:
- Integration 1: Name "Main" → `sensor.hki_notify_main`
- Integration 2: Name "Kitchen" → `sensor.hki_notify_kitchen`

---

See the **HKI Notification Card Documentation** for card configuration options.

---
