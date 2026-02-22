# Configuration

## Setup via the UI (recommended)

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **HKI ESPHome Humidifier Converter**
3. Complete the three-step setup wizard:

### Step 1 — Core settings

| Field | Description |
|---|---|
| **ESPHome climate entity** | The climate entity created by your ESPHome component (required) |
| **Friendly name** | Name shown in the UI |
| **HVAC mode used when turning on** | Usually `dry` for midea_dehum |
| **Minimum target humidity** | Lowest setpoint allowed (default: 30) |
| **Maximum target humidity** | Highest setpoint allowed (default: 80) |

### Step 2 — Operating modes

Select which preset modes your device supports. The list is populated
automatically from the climate entity's `preset_modes` attribute. Deselect
any modes your specific device does not support or respond to.

### Step 3 — Optional companion entities

Link the additional entities created by ESPHome for this device. All fields
are optional — only link the ones that actually exist in your HA instance.

| Field | Entity type | ESPHome source |
|---|---|---|
| Current humidity sensor | `sensor` | External humidity sensor |
| Tank water level sensor | `sensor` | `sensor.tank_level` |
| PM2.5 sensor | `sensor` | `sensor.pm25` |
| Error code sensor | `sensor` | `sensor.error` |
| Bucket full | `binary_sensor` | `binary_sensor.bucket_full` |
| Clean filter | `binary_sensor` | `binary_sensor.clean_filter` |
| Defrosting | `binary_sensor` | `binary_sensor.defrost` |
| Ionizer switch | `switch` | `switch.ionizer` |
| Pump switch | `switch` | `switch.pump` |
| Sleep mode switch | `switch` | `switch.sleep_mode` |
| Beep on command | `switch` | `switch.beep_on_command` |

After initial setup you can revisit any of these options at any time via
**Settings → Devices & Services → HKI ESPHome Humidifier Converter → Configure**.

---

## Legacy YAML setup (still supported)

```yaml
humidifier:
  - platform: hki_esphome_humidifier
    name: "Midea Comfee Dehumidifier"
    climate_entity: climate.inventor_dehumidifier
    on_hvac_mode: dry
    min_humidity: 30
    max_humidity: 80
    modes:
      - "Cont"
      - "Smart"
      - "Dry"
    # Optional companion entities
    bucket_full_entity: binary_sensor.bucket_full
    clean_filter_entity: binary_sensor.clean_filter_request
    defrost_entity: binary_sensor.defrosting
    tank_level_entity: sensor.tank_water_level
    pm25_entity: sensor.pm2_5
    error_entity: sensor.error_code
    ionizer_entity: switch.ionizer
    pump_entity: switch.pump
    sleep_entity: switch.sleep_mode
    beep_entity: switch.beep_on_command
```
---
