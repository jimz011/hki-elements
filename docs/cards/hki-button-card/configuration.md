# Configuration

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

---

## Configuration Reference

### Core Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entity` | string | *required* | Entity ID to control |
| `icon` | string | (entity icon) | MDI icon - supports Jinja2 templates |
| `card_layout` | string | `square` | Layout: `square`, `badge`, `google_default`, `hki_tile` |
| `name` | string | (entity name) | Display name - supports Jinja2 templates |
| `state_label` | string | (entity state) | State text - supports Jinja2 templates |
| `label` | string | "" | Additional label - supports Jinja2 templates |
| `info_display` | string | (brightness %) | Info display text - supports Jinja2 templates |
| `use_entity_picture` | boolean | false | Use entity picture instead of icon |
| `entity_picture` | string | "" | Custom entity picture URL |

**Example:**
```yaml
entity: light.living_room
icon: mdi:floor-lamp
name: "{{ state_attr('light.living_room', 'friendly_name') }}"
state_label: "{{ states('light.living_room') | title }}"
label: >-
  {% if is_state('light.living_room', 'on') %}
    On for {{ relative_time(states.light.living_room.last_changed) }}
  {% endif %}
```

---

### Content Display

Control visibility of different elements:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show_name` | boolean | true | Show entity name |
| `show_state` | boolean | true | Show entity state |
| `show_label` | boolean | false | Show custom label |
| `show_info_display` | boolean | true | Show info display (brightness, etc.) |
| `show_icon` | boolean | true | Show icon |
| `show_icon_circle` | boolean | false | Show circle behind icon |
| `show_icon_badge` | boolean | false | Show badge on icon |
| `show_temp_badge` | boolean | false | Show temperature badge |
| `show_brightness` | boolean | true | Show brightness in info display |
| `show_scenes_button` | boolean | true | Show scenes button in popup |
| `show_individual_button` | boolean | true | Show individual controls in popup |
| `show_effects_button` | boolean | true | Show effects button in popup |

**Example:**
```yaml
show_name: true
show_state: true
show_label: false
show_info_display: true
show_icon: true
show_icon_circle: true
```

---

### Actions

Configure tap, hold, and double-tap actions:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tap_action` | object | {action: toggle} | Tap action configuration |
| `hold_action` | object | {action: hki-more-info} | Hold action configuration |
| `double_tap_action` | object | {action: none} | Double-tap action configuration |
| `icon_tap_action` | object | (uses tap_action) | Icon-specific tap action |
| `icon_hold_action` | object | (uses hold_action) | Icon-specific hold action |
| `icon_double_tap_action` | object | (uses double_tap_action) | Icon-specific double-tap action |

#### Action Types

**toggle** - Toggle entity on/off
```yaml
tap_action:
  action: toggle
```

**hki-more-info** - Open HKI popup with advanced controls
```yaml
hold_action:
  action: hki-more-info
```

**more-info** - Open Home Assistant more-info dialog
```yaml
tap_action:
  action: more-info
```

**navigate** - Navigate to a view
```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/lights
```

**url** - Open a URL
```yaml
tap_action:
  action: url
  url_path: https://www.home-assistant.io
```

**call-service** - Call a Home Assistant service
```yaml
tap_action:
  action: call-service
  service: light.turn_on
  service_data:
    entity_id: light.living_room
    brightness: 255
```

**fire-dom-event** - Fire a DOM event
```yaml
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: Light Control
      content:
        type: light
```

**none** - No action
```yaml
tap_action:
  action: none
```

---

### Styles

#### Card Styles

```yaml
styles:
  card:
    color: ""                    # Background color
    opacity: 1                   # Opacity (0-1)
    border_radius: 15            # Border radius (px)
    border_width: 0              # Border width (px)
    border_style: solid          # Border style
    border_color: ""             # Border color
    box_shadow: ""               # CSS box-shadow
```

#### Icon Styles

```yaml
styles:
  icon:
    color: ""                    # Icon color
    size: 30                     # Icon size (px)
    circle:
      bg: ""                     # Circle background color
      border_width: 0            # Circle border width (px)
      border_style: solid        # Circle border style
      border_color: ""           # Circle border color
```

#### Typography Styles

```yaml
styles:
  typography:
    name:
      color: ""                  # Name text color
      size: 13                   # Font size (px)
      weight: bold               # Font weight
      font_family: ""            # Font family
      font_custom: ""            # Custom font CSS
      text_align: left           # Text alignment
    
    state:
      color: ""
      size: 12
      weight: bold
      font_family: ""
      font_custom: ""
      text_align: left
    
    label:
      color: ""
      size: 12
      weight: normal
      font_family: ""
      font_custom: ""
      text_align: left
    
    info_display:
      color: ""                  # Info text color
      color_on: ""               # Color when entity on
      color_off: ""              # Color when entity off
      size: 12
      weight: bold
      font_family: ""
      font_custom: ""
      text_align: left
```

#### Badge Card Styles (for badge layout)

```yaml
styles:
  badge_card:
    bg: ""                       # Background color
    border_style: solid          # Border style
    border_width: 1              # Border width (px)
    border_color: ""             # Border color
    border_radius: 50            # Border radius (%)
    box_shadow: ""               # Box shadow
    circle: true                 # Force circular shape
    size: 40                     # Badge size (px)
    font_size: 12                # Font size (px)
    font_family: ""              # Font family
    font_weight: bold            # Font weight
```

#### Temperature Badge Styles

```yaml
styles:
  temp_badge:
    border_color: ""
    border_radius: 50
    border_style: solid
    border_width: 0
    box_shadow: ""
    font_custom: ""
    font_family: ""
    font_weight: bold
    size: 40                     # Badge size (px)
    font_size: 12                # Font size (px)
    text_color: ""
```

#### Tile Styles (for hki_tile layout)

```yaml
styles:
  tile:
    height: 120                  # Tile height (px)
    show_slider: true            # Show brightness slider
    slider_fill_color: ""        # Slider fill color
    slider_track_color: ""       # Slider track color
```

---

### Offsets

Fine-tune element positioning:

```yaml
offsets:
  name:
    x: -10                       # Horizontal offset (px)
    y: 17                        # Vertical offset (px)
  
  state:
    x: -10
    y: 10
  
  label:
    x: -10
    y: 11
  
  icon:
    x: -10
    y: -4
  
  icon_circle:
    x: 0
    y: 0
  
  icon_badge:
    x: 0
    y: 0
  
  info_display:
    x: 10                        # Info display (brightness)
    y: 10
  
  temp_badge:
    x: 10                        # Temperature badge
    y: -10
  
  badge_card:
    x: 0                         # Badge card offset
    y: 0
```

**Note:** Default offsets vary by `card_layout`. Each layout has optimized defaults.

---

### Climate Control

For climate entities (thermostats):

```yaml
climate:
  current_temperature_entity: sensor.living_room_temperature
  humidity_entity: sensor.living_room_humidity
  humidity_name: Humidity
  pressure_entity: sensor.barometric_pressure
  pressure_name: Pressure
  show_gradient: true            # Show temperature gradient
  show_plus_minus: true          # Show +/- buttons
  temp_step: 0.5                 # Temperature step size
  temperature_name: Temperature
  use_circular_slider: false     # Use circular slider
```

---

### Popup Settings

Configure the advanced popup (opened with `hki-more-info` action):

#### General Popup Settings

```yaml
hki_popup:
  blur_enabled: true             # Blur backdrop
  blur_amount: 10                # Backdrop blur amount (px)
  card_blur_enabled: true        # Blur popup card
  card_blur_amount: 40           # Card blur amount (px)
  card_opacity: 0.4              # Card background opacity
  border_radius: 16              # Popup border radius (px)
  width: auto                    # Width: auto, full, custom
  height: auto                   # Height: auto, full, custom
  width_custom: 400              # Custom width (px)
  height_custom: 600             # Custom height (px)
  default_view: brightness       # Default view: brightness, temperature, color
  default_section: ""            # Default section in popup
  show_favorites: true           # Show favorites section
  show_presets: true             # Show presets section
  show_effects: true             # Show effects section
  hide_button_text: false        # Hide button labels
  slider_radius: 12              # Slider border radius (px)
  time_format: auto              # Time format: auto, 12, 24
```

#### Popup Button Styling

```yaml
hki_popup:
  button:
    bg: ""                       # Button background
    opacity: 1                   # Button opacity
    radius: 12                   # Button border radius (px)
    text_color: ""               # Button text color
    border_width: 0              # Button border width (px)
    border_style: solid          # Button border style
    border_color: ""             # Button border color
```

#### Popup Highlight Styling

```yaml
hki_popup:
  highlight:
    color: ""                    # Highlight background
    opacity: 1                   # Highlight opacity
    radius: 12                   # Highlight border radius (px)
    text_color: ""               # Highlight text color
    border_width: 2              # Highlight border width (px)
    border_style: solid          # Highlight border style
    border_color: ""             # Highlight border color
    box_shadow: ""               # Highlight box shadow
```

#### Popup Label & Value Styling

```yaml
hki_popup:
  label:
    font_size: 16                # Label font size (px)
    font_weight: 400             # Label font weight
  
  value:
    font_size: 36                # Value font size (px)
    font_weight: 300             # Value font weight
```

---

### Lock Settings

For lock entities with contact sensors:

```yaml
lock:
  contact_sensor_entity: binary_sensor.front_door
  contact_sensor_label: Door Status
```
