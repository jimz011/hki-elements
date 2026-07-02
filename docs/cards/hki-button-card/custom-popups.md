# Custom Popups

The Custom Popup feature lets you embed any Home Assistant card inside the HKI Button Card popup frame. Instead of the built-in light/climate/switch controls, the popup will display your own card — making it ideal for remote controls, media players, custom dashboards, or any other use case that the built-in popup doesn't cover.

---

## How it works

When `custom_popup.enabled` is `true` and a card config is provided, tapping the button (or any action mapped to `hki-more-info`) opens the standard HKI popup frame — with its header (icon, entity name, state, timestamp), history button, and close button — but the content area is replaced entirely by your custom card.

The embedded card receives live `hass` updates, so entity states inside it stay real-time while the popup is open.

If the card type cannot be loaded, an error message is shown in its place.

---

## Configuration

```yaml
custom_popup:
  enabled: true
  card:
    type: <card-type>
    # ... card config
```

| Key | Type | Required | Description |
|---|---|---|---|
| `enabled` | `boolean` | Yes | Set to `true` to activate. When `false` or absent the built-in popup is used instead. |
| `card` | `map` | Yes | Full card configuration, identical to what you would put in a Lovelace card. |

---

## Examples

### Markdown card
```yaml
custom_popup:
  enabled: true
  card:
    type: markdown
    content: "## Hello\nThis is a custom popup."
```

### Entities card
```yaml
custom_popup:
  enabled: true
  card:
    type: entities
    title: Living Room
    entities:
      - light.living_room_main
      - light.living_room_floor_lamp
      - switch.living_room_fan
```

### Media player card (custom card)
```yaml
custom_popup:
  enabled: true
  card:
    type: custom:mini-media-player
    entity: media_player.living_room_tv
    artwork: cover
```

### Vertical stack with multiple cards
```yaml
custom_popup:
  enabled: true
  card:
    type: vertical-stack
    cards:
      - type: thermostat
        entity: climate.living_room
      - type: entities
        entities:
          - sensor.living_room_temperature
          - sensor.living_room_humidity
```

### Tile card
```yaml
custom_popup:
  enabled: true
  card:
    type: tile
    entity: vacuum.roomba
    features:
      - type: vacuum-commands
        commands:
          - start_pause
          - stop
          - locate
          - clean_spot
          - return_home
```

---

## What is preserved from the standard popup

Even with a custom card, the following are always present:

- **Header** — entity icon (with state color), friendly name, current state, and last-changed timestamp
- **History button** — switches the content area to the standard HKI entity timeline; tapping again returns to your card
- **Close button** — closes the popup
- **Background blur / backdrop** — follows your `hki_popup` blur settings
- **Popup dimensions** — respects `hki_popup.width`, `hki_popup.height`, and their `_custom` variants
- **Border radius** — respects `hki_popup.border_radius`
- **Background click to close** — clicking outside the popup frame closes it

---

## Popup container styling

The popup container itself is still controlled by the standard `hki_popup` options. These all apply normally alongside a custom card:

```yaml
hki_popup:
  border_radius: 20
  width: medium          # small | medium | large | full | custom
  height: auto           # auto | medium | large | full | custom
  blur_enabled: true
  blur_amount: 10
  card_blur_enabled: false
  card_opacity: 1.0
```

---

## Visual editor

The custom popup section is in the **Popup** tab of the visual editor.

1. Enable the **Enable Custom Popup** toggle
2. A YAML editor appears — enter your card configuration here
3. Save the card

The YAML editor uses the same format as the code editor. Standard Lovelace card syntax applies.

---

## Notes

- Any installed custom card (HACS or manual) can be used, as long as it is registered as a custom element before the popup opens.
- The card is re-created each time the popup is opened.
- `hass` is passed to the embedded card and kept in sync while the popup is open, so live state updates work.
- The `custom_popup` block takes priority over built-in popup types. If `enabled: true` and a `card` is present, the built-in popup for that domain (light, climate, etc.) is bypassed entirely.
