# Examples
These are just examples and not even close to what this card can do, but this should at least help you get started.

### Example 1: User's Configuration (Time-Based Greeting)

```yaml
type: custom:hki-header-card
title: |-
  {% set time = states('sensor.time') %}
  {% if '00:00' < time < '06:00' %}
    Good Night
  {% elif '06:00' < time < '12:00' %}
    Good Morning 
  {% elif '12:00' < time < '18:00' %}
    Good Afternoon
  {% else %}
    Good Evening
  {% endif %}
subtitle: "{{ user }}"

background: radial-gradient(circle,rgba(207, 0, 96, 1) 0%, rgba(0, 0, 0, 1) 80%);
height_vh: 35
min_height: 215
max_height: 255

badges_gap: 30
badges_fixed: true

top_bar:
  enabled: true

top_bar_left:
  type: custom
  offset_x: 0
  custom:
    card:
      type: custom:hki-notification-card
      use_header_styling: true
      show_background: false
      show_empty: true
      display_mode: ticker
      animation: bounce
      direction: right
      time_format: "24"
      entity: sensor.hki_notify_main
      popup_width: auto
      popup_height: auto

top_bar_center:
  type: none

top_bar_right:
  type: weather
  weather:
    entity: weather.openweathermap
    icon_color_mode: state
    animate_icon: none
  actions:
    hold_action:
      action: url
      url_path: https://support.carmo.nl
    double_tap_action:
      action: url
      url_path: https://carmo.nl

persons:
  enabled: true
  stack_order: ascending
  entities:
    - entity: person.stephanie
      tap_action:
        action: more-info
      hold_action:
        action: toggle
      double_tap_action:
        action: none
    - entity: person.jimmy
      tap_action:
        action: more-info
      hold_action:
        action: none
      double_tap_action:
        action: none
    - entity: person.tala
      tap_action:
        action: more-info
      hold_action:
        action: none
      double_tap_action:
        action: none
    - entity: person.kenzi
      tap_action:
        action: more-info
      hold_action:
        action: none
      double_tap_action:
        action: none
```

### Example 2: Control Dashboard with Buttons

```yaml
type: custom:hki-header-card
title: Smart Home
subtitle: Quick Controls

background: /local/images/dashboard.jpg
height_vh: 40

top_bar:
  enabled: true

top_bar_left:
  type: button
  button:
    icon: mdi:lightbulb
    label: Lights
  actions:
    tap_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          title: All Lights
          size: wide
          content:
            type: light

top_bar_center:
  type: datetime
  datetime:
    show_time: true
    show_date: true
    time_format: h:mm A
    date_format: MMMM DD

top_bar_right:
  type: button
  button:
    icon: mdi:thermostat
    label: Climate
  actions:
    tap_action:
      action: navigate
      navigation_path: /lovelace/climate

info:
  pill: true
  pill_background: rgba(0,0,0,0.4)
  pill_blur: 10
  pill_padding_x: 16
  pill_radius: 20
```

### Example 3: Weather Dashboard

```yaml
type: custom:hki-header-card
title: "{{ states('sensor.greeting') }}"
subtitle: "{{ now().strftime('%A, %B %d, %Y') }}"

background: /local/images/weather.jpg
background_size: cover
background_position: center
height_vh: 45

top_bar:
  enabled: true
  offset_y: 10

top_bar_left:
  type: datetime
  datetime:
    show_time: true
    show_date: false
    show_day: false
    time_format: h:mm A

top_bar_right:
  type: weather
  weather:
    entity: weather.home
    show_icon: true
    show_temperature: true
    show_condition: true
    show_humidity: true
    show_wind: true
    colored_icons: true
    animate_icon: pulse

info:
  pill: true
  pill_background: rgba(0,0,0,0.3)
  pill_blur: 15
  size_px: 14

persons:
  enabled: true
  align: right
  size: 45
  spacing: -10
  dynamic_order: true
  entities:
    - entity: person.john
    - entity: person.jane
```

### Example 4: Minimal Mobile Header

```yaml
type: custom:hki-header-card
title: Dashboard

background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)
height_vh: 20
min_height: 120
max_height: 150

title_color: white
title_size_px: 28
title_offset_y: 50
text_align: center

top_bar:
  enabled: false

card_border_radius_bottom: 20px
card_box_shadow: 0 4px 12px rgba(0,0,0,0.15)
```

### Example 5: Per-Slot Styling Override

```yaml
type: custom:hki-header-card
title: Custom Styling

top_bar:
  enabled: true

# Global defaults
info:
  size_px: 12
  weight: medium
  pill: true

# Left slot with custom styling
top_bar_left:
  type: datetime
  styling:
    size_px: 16
    weight: bold
    color: "#ff6b6b"
    pill: true
    pill_background: rgba(255,107,107,0.2)
  datetime:
    show_time: true

# Center uses global styling
top_bar_center:
  type: weather
  weather:
    entity: weather.home

# Right slot with different custom styling
top_bar_right:
  type: datetime
  styling:
    size_px: 14
    weight: light
    pill: false
  datetime:
    show_date: true
```

### Example 6: Multiple Weather Slots

```yaml
type: custom:hki-header-card
title: Weather Comparison

top_bar:
  enabled: true

# Current location weather
top_bar_left:
  type: weather
  weather:
    entity: weather.home
    show_icon: true
    show_temperature: true

# Vacation home weather
top_bar_right:
  type: weather
  weather:
    entity: weather.vacation_home
    show_icon: false
    show_temperature: true
    show_condition: true
```
