# Examples

### Example 1: Basic Setup

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
```

### Example 2: Full Configuration

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
distribution_entity: sensor.postnl_distribution
title: PostNL Tracking
days_back: 60
show_header: true
show_delivered: true
show_sent: true
show_animation: true
show_placeholder: true
header_color: "#ff6b00"
header_text_color: "#ffffff"
layout_order:
  - header
  - animation
  - tabs
  - list
```

### Example 3: Minimal Clean Look

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
title: Deliveries
show_animation: false
show_placeholder: false
show_sent: false
days_back: 7
header_color: "var(--primary-color)"
header_text_color: "var(--text-primary-color)"
```

### Example 4: Custom Branding

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
title: My Packages
logo_path: /local/images/my-logo.png
van_path: /local/images/delivery-truck.gif
placeholder_image: /local/images/delivery-banner.jpg
header_color: "#2196f3"
header_text_color: "#ffffff"
```

### Example 5: Only In-Transit Packages

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
title: Active Deliveries
show_delivered: false
show_sent: false
show_placeholder: false
layout_order:
  - header
  - list
```

### Example 6: Reordered Layout

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
distribution_entity: sensor.postnl_distribution
title: Package Tracking
layout_order:
  - animation
  - tabs
  - list
  - header
```
