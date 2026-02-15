# Examples

### Example 1: Simple Bottom Navigation

```yaml
type: custom:hki-navigation-card
position: bottom-center

bottom_bar_settings:
  enabled: true
  full_width: true
  height: 70

horizontal:
  columns: 5
  buttons:
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
    - icon: mdi:lightbulb
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
    - icon: mdi:thermostat
      tap_action:
        action: navigate
        navigation_path: /lovelace/climate
    - icon: mdi:cctv
      tap_action:
        action: navigate
        navigation_path: /lovelace/security
    - icon: mdi:cog
      tap_action:
        action: navigate
        navigation_path: /lovelace/settings
```

### Example 2: Pill Buttons with Labels

```yaml
type: custom:hki-navigation-card
position: bottom-right
button_size: 55
gap: 8

button_defaults:
  button_type: pill
  label:
    font_size: 11
    font_weight: 600

horizontal:
  columns: 3
  buttons:
    - icon: mdi:lightbulb
      label: Lights
      pill_width: 100
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
    - icon: mdi:fan
      label: Climate
      pill_width: 110
      tap_action:
        action: navigate
        navigation_path: /lovelace/climate
    - icon: mdi:shield-home
      label: Security
      pill_width: 115
      tap_action:
        action: navigate
        navigation_path: /lovelace/security
```

### Example 3: Menu Button with Toggleable Groups

```yaml
type: custom:hki-navigation-card
position: bottom-right
button_size: 60

base:
  button:
    icon: mdi:menu
    tooltip: "Main Menu"
    tap_action:
      action: toggle-group
      target: horizontal
      mode: toggle

horizontal:
  enabled: false                   # Hidden by default
  columns: 4
  buttons:
    - icon: mdi:home
      label: Home
      button_type: icon_label_below
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
    - icon: mdi:lightbulb
      label: Lights
      button_type: icon_label_below
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
    - icon: mdi:thermostat
      label: Climate
      button_type: icon_label_below
      tap_action:
        action: navigate
        navigation_path: /lovelace/climate
    - icon: mdi:cog
      label: Settings
      button_type: icon_label_below
      tap_action:
        action: navigate
        navigation_path: /lovelace/settings
```

### Example 4: Quick Toggle Buttons

```yaml
type: custom:hki-navigation-card
position: middle-right
button_size: 50
vertical_gap: 10

vertical:
  enabled: true
  rows: 5
  buttons:
    - icon: mdi:lightbulb
      entity: light.living_room
      icon_color: "#ff9800"
      tap_action:
        action: toggle
        entity: light.living_room
      hold_action:
        action: more-info
        entity: light.living_room
        
    - icon: mdi:fan
      entity: fan.bedroom
      icon_color: "#03a9f4"
      tap_action:
        action: toggle
        entity: fan.bedroom
      hold_action:
        action: more-info
        entity: fan.bedroom
        
    - icon: mdi:lock
      entity: lock.front_door
      icon_color: "#f44336"
      tap_action:
        action: toggle
        entity: lock.front_door
      hold_action:
        action: more-info
        entity: lock.front_door
```

### Example 5: Conditional Button Visibility

```yaml
type: custom:hki-navigation-card
position: bottom-center

horizontal:
  buttons:
    # Always visible
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
    
    # Only show when lights are on
    - icon: mdi:lightbulb
      conditions_mode: all
      conditions:
        - type: entity
          entity: light.living_room
          operator: equals
          state: "on"
      tap_action:
        action: toggle
        entity: light.living_room
    
    # Only show to admin user
    - icon: mdi:cog
      conditions:
        - type: user
          user:
            - admin_user_id
      tap_action:
        action: navigate
        navigation_path: /lovelace/admin
    
    # Only show on wide screens
    - icon: mdi:desktop-classic
      conditions:
        - type: screen
          operator: above
          value: 1024
      tap_action:
        action: navigate
        navigation_path: /lovelace/dashboard
```

### Example 6: Template-Based Dynamic Buttons

```yaml
type: custom:hki-navigation-card
position: bottom-right

horizontal:
  buttons:
    - icon: >-
        {% if is_state('light.living_room', 'on') %}
          mdi:lightbulb-on
        {% else %}
          mdi:lightbulb-off
        {% endif %}
      label: >-
        {{ state_attr('light.living_room', 'brightness') | int }}%
      tooltip: >-
        Living Room: {{ states('light.living_room') }}
      icon_color: >-
        {% if is_state('light.living_room', 'on') %}
          #ffa500
        {% else %}
          #808080
        {% endif %}
      tap_action:
        action: toggle
        entity: light.living_room
```

### Example 7: Custom Styled Buttons

```yaml
type: custom:hki-navigation-card
position: bottom-right
button_size: 55
gap: 12

button_defaults:
  style:
    border_radius: 16
    border_width: 2
    border_style: solid
    box_shadow: 0 4px 12px rgba(0,0,0,0.3)
  label:
    font_size: 10
    font_weight: 700
    text_transform: uppercase

horizontal:
  buttons:
    - icon: mdi:lightbulb
      label: Lights
      button_type: icon_label_below
      background: rgba(255,152,0,0.2)
      border_color: rgba(255,152,0,0.5)
      icon_color: "#ff9800"
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
        
    - icon: mdi:fan
      label: Climate
      button_type: icon_label_below
      background: rgba(3,169,244,0.2)
      border_color: rgba(3,169,244,0.5)
      icon_color: "#03a9f4"
      tap_action:
        action: navigate
        navigation_path: /lovelace/climate
```
