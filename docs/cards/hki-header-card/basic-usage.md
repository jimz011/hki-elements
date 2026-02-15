# Basic Usage

### Minimal Example

```yaml
type: custom:hki-header-card
title: Welcome Home
subtitle: Have a great day!
```

### With Background

```yaml
type: custom:hki-header-card
title: Living Room
subtitle: Relax and enjoy
background: /local/images/living-room.jpg
height_vh: 35
blend_enabled: true
```

### With Top Bar Weather

```yaml
type: custom:hki-header-card
title: Home Dashboard
subtitle: "{{ now().strftime('%A, %B %d') }}"

top_bar:
  enabled: true

top_bar_right:
  type: weather
  weather:
    entity: weather.home
    show_icon: true
    show_temperature: true
    show_condition: true
```

---

# Configuration Structure

The card uses a **nested configuration structure** organized into logical groups:

```yaml
type: custom:hki-header-card

# Text content
title: "My Title"
subtitle: "Subtitle text"
text_align: left

# Background
background: /local/image.jpg
background_color: ""
background_size: cover
height_vh: 35
blend_enabled: true

# Typography
font_family: inherit
title_size_px: 36
subtitle_size_px: 15

# Top bar settings
top_bar:
  enabled: true
  offset_y: 15
  padding_x: 0

# Global info styling (applies to all slots)
info:
  size_px: 12
  weight: medium
  pill: true
  pill_background: rgba(0,0,0,0.25)

# Slot configuration
top_bar_left:
  type: weather
  weather:
    entity: weather.home
  actions:
    tap_action:
      action: more-info

top_bar_center:
  type: datetime
  datetime:
    show_time: true

top_bar_right:
  type: button
  button:
    icon: mdi:lightbulb
    label: Lights
  actions:
    tap_action:
      action: toggle

# Person entities
persons:
  enabled: true
  entities:
    - entity: person.john
    - entity: person.jane
```
