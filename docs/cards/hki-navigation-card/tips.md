# Tips & Tricks

### Dynamic Icons Based on State

```yaml
icon: >-
  {% if is_state('sun.sun', 'above_horizon') %}
    mdi:weather-sunny
  {% else %}
    mdi:weather-night
  {% endif %}
```

### Color Icons Based on Entity State

```yaml
icon_color: >-
  {% if is_state('light.living_room', 'on') %}
    #ffa500
  {% else %}
    #808080
  {% endif %}
```

### Show Button Count in Label

```yaml
label: >-
  {{ states.light | selectattr('state', 'eq', 'on') | list | count }} on
```

### Responsive Button Sizes

Use responsive offsets for different screen sizes:

```yaml
offset_x_mobile: 8
offset_x_tablet: 12
offset_x_desktop: 16
button_size: 50
```

### Hide Base Button

Set the base button to transparent and no action to hide it:

```yaml
base:
  button:
    background: transparent
    icon_color: transparent
    tap_action:
      action: none
```

### Full-Width Bottom Bar

```yaml
bottom_bar_settings:
  enabled: true
  full_width: true
  height: 65
  style:
    background: var(--card-background-color)
    border_radius: 0
```

### Pill Button Auto-Width

Set `pill_width: 0` for automatic width based on content:

```yaml
button_type: pill
pill_width: 0
```

### Multiple Condition Logic

Use `conditions_mode: any` for OR logic:

```yaml
conditions_mode: any
conditions:
  - type: view
    view: [/lovelace/home]
  - type: view
    view: [/lovelace/dashboard]
```

### Entity State Color Coding

```yaml
background: >-
  {% if is_state('alarm_control_panel.home', 'armed_away') %}
    rgba(244,67,54,0.3)
  {% elif is_state('alarm_control_panel.home', 'armed_home') %}
    rgba(255,152,0,0.3)
  {% else %}
    rgba(76,175,80,0.3)
  {% endif %}
```

### Reserve Space for Fixed Layout

Prevent content from sliding under floating buttons:

```yaml
reserve_space: true
```

### Browser Mod Popups

```yaml
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: Light Control
      size: normal
      content:
        type: light
```
