# Troubleshooting

**Entity shows as unavailable**
The underlying climate entity is unavailable. Check that your ESPHome device
is online in HA.

**Target humidity not updating**
The climate entity must report the humidity setpoint as `temperature` in its
attributes. Verify in Developer Tools → States.

**Current humidity not showing**
Either link a dedicated humidity sensor in step 3, or confirm your ESPHome
firmware reports `current_temperature` in the climate attributes (midea_dehum
uses this for the room humidity reading).

**Mode changes have no effect**
Confirm the mode names in your config exactly match the `preset_mode` values
the climate entity reports. These are case-sensitive. Check via Developer
Tools → States.

**A companion entity state is not updating**
Verify the entity ID you linked in step 3 exactly matches the entity ID as
shown in Developer Tools → States.

---
