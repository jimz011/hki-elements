# Custom Popups

The Custom Popup feature lets you embed any Home Assistant card inside an HKI popup, triggered directly from a header card slot or person action. Instead of navigating away or opening a plain more-info dialog, the popup displays your own card — making it ideal for remote controls, media players, custom dashboards, or any other content you want quick access to from the header.

---

## How it works

When an action's type is set to `hki-more-info` and a `custom_popup_card` is provided, tapping (or holding) the slot opens an HKI popup frame whose content area is filled by your card.

The popup includes a close button and a background-click-to-close handler. The header area (name and state text) is fully customisable per action and supports Jinja2 templates.

The embedded card receives live `hass` updates, so entity states inside it stay real-time while the popup is open.

---

## Configuration

Popup options are set **directly on the action object** (tap_action, hold_action, or double_tap_action) for any slot or person. There is no separate top-level block.

```yaml
tap_action:
  action: hki-more-info
  custom_popup_card:
    type: <card-type>
    # ... card config
  popup_name: ""                     # Optional header name (supports Jinja2)
  popup_state: ""                    # Optional header state text (supports Jinja2)
  popup_border_radius: 16            # Border radius in px (default: 16)
  popup_width: auto                  # auto | default | custom
  popup_width_custom: 400            # Width in px, used when popup_width: custom
  popup_height: auto                 # auto | default | custom
  popup_height_custom: 600           # Height in px, used when popup_height: custom
  popup_open_animation: scale        # Entrance animation (see values below)
  popup_close_animation: scale       # Exit animation (see values below)
  popup_animation_duration: 300      # Animation duration in milliseconds
  popup_blur_enabled: true           # Blur the backdrop (portal) behind the popup
  popup_blur_amount: 10              # Backdrop blur amount in px
  popup_card_blur_enabled: true      # Frosted-glass blur on the popup card itself
  popup_card_blur_amount: 40         # Card blur amount in px
```

| Key | Type | Default | Description |
|---|---|---|---|
| `action` | `string` | — | Must be `hki-more-info` to trigger the popup |
| `custom_popup_card` | `map` | — | Full card configuration, identical to Lovelace card syntax |
| `popup_name` | `string` | "" | Header name — supports Jinja2 templates |
| `popup_state` | `string` | "" | Header state text — supports Jinja2 templates |
| `popup_border_radius` | `number` | `16` | Popup container border radius (px) |
| `popup_width` | `string` | `auto` | `auto` (responsive), `default` (400px), or `custom` |
| `popup_width_custom` | `number` | `400` | Width in px, used only when `popup_width: custom` |
| `popup_height` | `string` | `auto` | `auto` (responsive), `default` (600px), or `custom` |
| `popup_height_custom` | `number` | `600` | Height in px, used only when `popup_height: custom` |
| `popup_open_animation` | `string` | `scale` | Available options: `none`, `fade`, `scale`, `zoom`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `flip`, `bounce`, `rotate`, `drop`, `swing` |
| `popup_close_animation` | `string` | `scale` | Same options as `popup_open_animation` (falls back to `popup_open_animation` if unset) |
| `popup_animation_duration` | `number` | `300` | Animation duration in milliseconds |
| `popup_blur_enabled` | `boolean` | `true` | Blur the page backdrop behind the popup |
| `popup_blur_amount` | `number` | `10` | Backdrop blur amount (px), used when `popup_blur_enabled: true` |
| `popup_card_blur_enabled` | `boolean` | `true` | Apply a frosted-glass blur to the popup card itself |
| `popup_card_blur_amount` | `number` | `40` | Card blur amount (px), used when `popup_card_blur_enabled: true` |

---

## Examples

### Slot with a markdown card

```yaml
top_bar_left_tap_action:
  action: hki-more-info
  popup_name: Info
  custom_popup_card:
    type: markdown
    content: "## Hello\nThis is a custom popup."
```

### Slot with an entities card

```yaml
top_bar_right_tap_action:
  action: hki-more-info
  popup_name: Living Room
  popup_width: 380px
  custom_popup_card:
    type: entities
    title: Living Room
    entities:
      - light.living_room_main
      - light.living_room_floor_lamp
      - switch.living_room_fan
```

### Slot with a custom media player card

```yaml
top_bar_left_hold_action:
  action: hki-more-info
  popup_name: TV
  popup_open_animation: slide-up
  custom_popup_card:
    type: custom:mini-media-player
    entity: media_player.living_room_tv
    artwork: cover
```

### Slot with a vertical stack

```yaml
top_bar_right_tap_action:
  action: hki-more-info
  popup_name: Climate
  popup_blur_enabled: false
  custom_popup_card:
    type: vertical-stack
    cards:
      - type: thermostat
        entity: climate.living_room
      - type: entities
        entities:
          - sensor.living_room_temperature
          - sensor.living_room_humidity
```

### Person with a Jinja2 header

```yaml
persons_entities:
  - entity: person.jimmy
    tap_action:
      action: hki-more-info
      popup_name: "{{ state_attr('person.jimmy', 'friendly_name') }}"
      popup_state: "{{ states('person.jimmy') | title }}"
      custom_popup_card:
        type: map
        entities:
          - person.jimmy
```

---

## Visual editor

The popup options appear inline inside the action editor whenever `HKI Popup` is selected as the action type.

1. Open the slot or person you want to configure
2. Set the action to **HKI Popup**
3. Fill in the **Popup Header** fields (name and state — both optional, both support Jinja2)
4. Adjust **Popup Appearance** (border radius, width, animation, blur)
5. Use the **Popup Card** editor to configure the embedded card

---
