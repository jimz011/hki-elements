# Basic Usage

### Minimal Example

```yaml
type: custom:hki-navigation-card
horizontal:
  buttons:
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
    - icon: mdi:lightbulb
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
```

### With Bottom Bar

```yaml
type: custom:hki-navigation-card
position: bottom-center

bottom_bar_settings:
  enabled: true
  full_width: true
  height: 70

horizontal:
  buttons:
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
```

### With Vertical Buttons

```yaml
type: custom:hki-navigation-card
position: bottom-right

horizontal:
  enabled: false

vertical:
  enabled: true
  rows: 5
  buttons:
    - icon: mdi:lightbulb
      tap_action:
        action: toggle
        entity: light.living_room
    - icon: mdi:fan
      tap_action:
        action: toggle
        entity: fan.bedroom
```
