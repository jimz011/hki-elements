# Basic Usage

### Minimal Example

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
```

### With Distribution (Sent Packages)

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
distribution_entity: sensor.postnl_distribution
title: My Packages
```

### Customized Appearance

```yaml
type: custom:hki-postnl-card
entity: sensor.postnl_delivery
title: PostNL Deliveries
days_back: 30
header_color: "#ff6b00"
header_text_color: "#ffffff"
show_animation: true
show_placeholder: true
```
