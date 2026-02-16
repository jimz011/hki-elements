# Basic Usage

### Minimal Example

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
```

### Ticker with Animation

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: ticker
interval: 4
animation: slide
direction: right
show_icon: true
```

### Marquee in Header

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: marquee
use_header_styling: true
show_background: false
```

### Button with Badge

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: button
button_icon: mdi:bell
button_show_badge: true
button_badge_color: "#ff4444"
button_size: 50
```
