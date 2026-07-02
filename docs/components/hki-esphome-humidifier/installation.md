# Installation

### Via HACS (custom repository)

1. Open HACS → **Integrations**
2. Click the three-dot menu → **Custom repositories**
3. Add `jimz011/hki-esphome-humidifier` and select category **Integration**
4. Install **HKI ESPHome Humidifier Converter**
5. Restart Home Assistant

### Manually

Copy the `hki_esphome_humidifier/` folder into your
`config/custom_components/` directory:

```
config/
  custom_components/
    hki_esphome_humidifier/
      __init__.py
      config_flow.py
      const.py
      humidifier.py
      manifest.json
      strings.json
      translations/
        en.json
```

Restart Home Assistant.

---
