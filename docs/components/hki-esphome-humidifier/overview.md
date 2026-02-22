# Features

A Home Assistant custom component that converts an ESPHome `climate` entity
(as produced by `midea_dehum` and similar custom ESPHome components) into a
proper `humidifier` / `dehumidifier` entity — installable and configurable
entirely through the Home Assistant UI.

---

## Why does this exist?

- ESPHome has no native `humidifier` domain yet
- Home Assistant does not support a template humidifier
- The `midea_dehum` ESPHome component exposes the device as a `climate` entity,
  even though it is a dehumidifier
- This custom component bridges that gap with zero changes required to your
  ESPHome firmware

---

## How it works

This component subscribes to state changes on your underlying climate entity
and any optional companion entities (sensors, binary sensors, switches) and
mirrors everything through the humidifier domain. All commands are forwarded
back as standard HA service calls.

### Climate → Humidifier mapping

| Humidifier | Climate entity |
|---|---|
| `is_on` | `state != "off"` |
| `turn_on()` | `climate.set_hvac_mode(on_hvac_mode)` |
| `turn_off()` | `climate.set_hvac_mode("off")` |
| `target_humidity` | `attributes.temperature` |
| `set_humidity(n)` | `climate.set_temperature(n)` |
| `current_humidity` | `attributes.current_temperature` (or dedicated sensor) |
| `mode` | `attributes.preset_mode` |
| `set_mode(m)` | `climate.set_preset_mode(m)` |

### Companion entities surfaced as attributes

| Attribute | Source entity |
|---|---|
| `bucket_full` | Bucket Full binary sensor |
| `clean_filter` | Clean Filter binary sensor |
| `defrost` | Defrosting binary sensor |
| `tank_level` | Tank water level sensor |
| `pm25` | PM2.5 sensor |
| `error_code` | Error code sensor |
| `ionizer` | Ionizer switch |
| `pump` | Pump switch |
| `sleep_mode` | Sleep mode switch |
| `beep` | Beep on command switch |

---
