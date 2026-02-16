# Examples

### Example 1: Simple Light Control

```yaml
type: custom:hki-button-card
entity: light.living_room
icon: mdi:floor-lamp
name: Living Room
tap_action:
  action: toggle
hold_action:
  action: hki-more-info
```

### Example 2: Custom Styled Button

```yaml
type: custom:hki-button-card
entity: light.bedroom
icon: mdi:bed
name: Master Bedroom
card_layout: square

styles:
  card:
    color: rgba(63, 81, 181, 0.2)
    border_radius: 20
    border_width: 2
    border_style: solid
    border_color: rgba(63, 81, 181, 0.5)
  
  icon:
    color: "#3f51b5"
    size: 35
    circle:
      bg: rgba(63, 81, 181, 0.1)
  
  typography:
    name:
      color: "#3f51b5"
      size: 14
      weight: bold
```

### Example 3: Google Default Layout

```yaml
type: custom:hki-button-card
entity: light.kitchen
card_layout: google_default
icon: mdi:silverware-fork-knife
name: Kitchen Lights
```

### Example 4: HKI Tile with Slider

```yaml
type: custom:hki-button-card
entity: light.office
card_layout: hki_tile
icon: mdi:desk-lamp
name: Office

styles:
  tile:
    show_slider: true
    height: 120
    slider_fill_color: "#ff9800"
    slider_track_color: rgba(255, 152, 0, 0.2)
```

### Example 5: Badge Layout

```yaml
type: custom:hki-button-card
entity: light.hallway
card_layout: badge
icon: mdi:ceiling-light

styles:
  badge_card:
    size: 50
    border_width: 2
    border_color: var(--primary-color)
```

### Example 6: Climate Control

```yaml
type: custom:hki-button-card
entity: climate.living_room
icon: mdi:thermostat
name: Living Room Climate
hold_action:
  action: hki-more-info

climate:
  current_temperature_entity: sensor.living_room_temperature
  humidity_entity: sensor.living_room_humidity
  show_gradient: true
  show_plus_minus: true
  temp_step: 0.5
  use_circular_slider: false
```

### Example 7: Lock with Contact Sensor

```yaml
type: custom:hki-button-card
entity: lock.front_door
icon: mdi:door
name: Front Door
tap_action:
  action: toggle
hold_action:
  action: hki-more-info

lock:
  contact_sensor_entity: binary_sensor.front_door_contact
  contact_sensor_label: Door Status
```

### Example 8: Advanced Popup Configuration

```yaml
type: custom:hki-button-card
entity: light.living_room
icon: mdi:lightbulb
name: Living Room
hold_action:
  action: hki-more-info

hki_popup:
  blur_enabled: true
  blur_amount: 15
  card_blur_enabled: true
  card_blur_amount: 30
  border_radius: 20
  width: custom
  width_custom: 450
  default_view: color
  show_favorites: true
  show_presets: true
  show_effects: true
  
  button:
    bg: rgba(var(--rgb-primary-color), 0.1)
    radius: 16
    border_width: 1
    border_color: rgba(var(--rgb-primary-color), 0.3)
  
  highlight:
    color: var(--primary-color)
    opacity: 0.3
    radius: 16
    border_width: 2
    border_color: var(--primary-color)
```

### Example 9: Template-Based Dynamic Content

```yaml
type: custom:hki-button-card
entity: light.living_room
icon: >-
  {% if is_state('light.living_room', 'on') %}
    mdi:lightbulb-on
  {% else %}
    mdi:lightbulb-off
  {% endif %}
name: >-
  Living Room ({{ state_attr('light.living_room', 'brightness') | int }}%)
label: >-
  {% if is_state('light.living_room', 'on') %}
    On for {{ relative_time(states.light.living_room.last_changed) }}
  {% else %}
    Off
  {% endif %}

styles:
  icon:
    color: >-
      {% if is_state('light.living_room', 'on') %}
        #ffa500
      {% else %}
        #808080
      {% endif %}
```

### Example 10: Entity Picture

```yaml
type: custom:hki-button-card
entity: person.john
use_entity_picture: true
name: John
state_label: "{{ states('person.john') | title }}"
tap_action:
  action: more-info
```
