# Basic Usage

### Minimal Example

```yaml
type: custom:hki-button-card
entity: light.living_room
```

### With Custom Icon and Name

```yaml
type: custom:hki-button-card
entity: light.bedroom
icon: mdi:bed
name: Master Bedroom
```

### With Popup Control

```yaml
type: custom:hki-button-card
entity: light.living_room
hold_action:
  action: hki-more-info
```

# Card Layouts

### Square (Default)
Traditional square button with flexible element positioning.

```yaml
type: custom:hki-button-card
entity: light.living_room
card_layout: square
```

**Best for:** General purpose entities, customizable layouts

---

### Badge
Compact circular badge matching Home Assistant's native badge style.

```yaml
type: custom:hki-button-card
entity: light.bedroom
card_layout: badge
```

**Best for:** Dashboard badges, compact displays, entity indicators

---

### Google Default
Google Home-inspired layout with refined spacing.

```yaml
type: custom:hki-button-card
entity: light.kitchen
card_layout: google_default
```

**Best for:** Modern dashboards, Google Home aesthetic

---

### HKI Tile
Modern tile layout with integrated brightness slider.

```yaml
type: custom:hki-button-card
entity: light.office
card_layout: hki_tile
styles:
  tile:
    show_slider: true
    height: 120
```

**Best for:** Light controls, entities with adjustable values

### Configuration Example
The card uses a **nested configuration structure** organized into logical groups:

```yaml
type: custom:hki-button-card
entity: light.living_room

# Core settings
name: Living Room
icon: mdi:floor-lamp
card_layout: square

# Visibility
show_name: true
show_state: true
show_icon: true
show_info_display: true

# Actions
tap_action:
  action: toggle
hold_action:
  action: hki-more-info

# Nested style groups
styles:
  card:
    color: ""
    opacity: 1
    border_radius: 15
    border_width: 0
    box_shadow: ""
  
  icon:
    color: ""
    size: 30
    circle:
      bg: ""
      border_width: 0
      border_style: solid
      border_color: ""
  
  typography:
    name:
      color: ""
      size: 13
      weight: bold
      font_family: ""
      text_align: left
    
    state:
      color: ""
      size: 12
      weight: bold
      font_family: ""
      text_align: left
    
    label:
      color: ""
      size: 12
      weight: normal
      font_family: ""
      text_align: left
    
    info_display:
      color: ""
      color_on: ""
      color_off: ""
      size: 12
      weight: bold
      font_family: ""
      text_align: left

# Nested offset groups
offsets:
  name:
    x: -10
    y: 17
  
  state:
    x: -10
    y: 10
  
  icon:
    x: -10
    y: -4
  
  info_display:
    x: 10
    y: 10

# Climate settings (for climate entities)
climate:
  current_temperature_entity: ""
  humidity_entity: ""
  pressure_entity: ""
  show_gradient: true
  show_plus_minus: true
  temp_step: 0.5
  use_circular_slider: false

# Popup configuration
hki_popup:
  blur_enabled: true
  blur_amount: 10
  card_blur_enabled: true
  card_blur_amount: 40
  card_opacity: 0.4
  border_radius: 16
  width: auto
  height: auto
  default_view: brightness
  show_favorites: true
  show_presets: true
  show_effects: true
  open_animation: scale
  close_animation: scale
  animation_duration: 300
  
  button:
    bg: ""
    opacity: 1
    radius: 12
    text_color: ""
    border_width: 0
    border_style: solid
    border_color: ""
  
  highlight:
    color: ""
    opacity: 1
    radius: 12
    text_color: ""
    border_width: 2
    border_style: solid
    border_color: ""
    box_shadow: ""

# Lock settings (for lock entities)
lock:
  contact_sensor_entity: ""
  contact_sensor_label: ""
```
