# Examples

### Example 1: Ticker with Slide Animation

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: ticker
interval: 5
animation: slide
direction: right
animation_duration: 0.5
show_icon: true
alignment: left
font_size: 14
font_weight: Semi Bold
bg_color: rgba(0,0,0,0.7)
border_radius: 12
box_shadow: 0 4px 12px rgba(0,0,0,0.2)
```

### Example 2: Scrolling Marquee

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: marquee
auto_scroll: true
marquee_speed: 1
marquee_gap: 24
show_icon: true
icon_after: false
font_size: 13
text_color: var(--primary-text-color)
bg_color: rgba(var(--rgb-primary-color),0.1)
border_width: 0
full_width: true
```

### Example 3: Notification List

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: list
list_max_items: 4
show_list_timestamp: true
time_format: 12
show_icon: true
alignment: left
font_size: 13
bg_color: var(--card-background-color)
border_radius: 8
border_width: 1
border_color: var(--divider-color)
```

### Example 4: Icon Button with Badge

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: button
button_icon: mdi:bell-outline
button_size: 52
button_bg_color: rgba(var(--rgb-primary-color),0.15)
button_icon_color: var(--primary-color)
button_show_badge: true
button_badge_color: "#ff5252"
button_badge_text_color: "#ffffff"
popup_title: My Notifications
popup_width: custom
popup_width_custom: 450
```

### Example 5: Pill Button

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: button
button_icon: mdi:bell
button_label: Alerts
button_label_position: inside
button_pill_size: 13
button_pill_full_width: false
button_pill_bg_color: rgba(var(--rgb-accent-color),0.2)
button_pill_border_radius: 24
button_pill_border_width: 1
button_pill_border_color: var(--accent-color)
button_show_badge: true
button_pill_badge_position: inside
```

### Example 6: Header Card Integration

```yaml
type: custom:hki-header-card
title: Dashboard
# ... other header settings ...

top_bar_left:
  type: custom
  custom:
    card:
      type: custom:hki-notification-card
      entity: sensor.hki_notify_main
      display_mode: ticker
      use_header_styling: true
      show_background: false
      show_empty: false
      interval: 4
      animation: slide
      direction: right
```

### Example 7: Customized Appearance

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: ticker
interval: 4
animation: fade
show_icon: true
alignment: center
text_color: "#ffffff"
icon_color: "#4CAF50"
bg_color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
bg_opacity: 0.9
font_size: 15
font_weight: Bold
font_family: Montserrat, sans-serif
border_width: 0
border_radius: 16
box_shadow: 0 8px 24px rgba(0,0,0,0.3)
```

### Example 8: Minimal Clean Look

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: ticker
interval: 5
animation: fade
show_icon: false
show_background: false
alignment: center
font_size: 12
font_weight: Regular
text_color: var(--secondary-text-color)
show_empty: false
```
