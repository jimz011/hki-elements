# Basic Usage

### Minimal Example

```yaml
type: custom:hki-button-card
entity: light.living_room
```

### With Custom Icon and Name

```yaml
type: custom:hki-button-card
entity: light.bedroom
icon: mdi:bed
name: Master Bedroom
```

### With Popup Control

```yaml
type: custom:hki-button-card
entity: light.living_room
hold_action:
  action: hki-more-info
```

# Card Layouts

### Square (Default)
Traditional square button with flexible element positioning.

```yaml
type: custom:hki-button-card
entity: light.living_room
card_layout: square
```

**Best for:** General purpose entities, customizable layouts

---

### Badge
Compact circular badge matching Home Assistant's native badge style.

```yaml
type: custom:hki-button-card
entity: light.bedroom
card_layout: badge
```

**Best for:** Dashboard badges, compact displays, entity indicators

---

### Google Default
Google Home-inspired layout with refined spacing.

```yaml
type: custom:hki-button-card
entity: light.kitchen
card_layout: google_default
```

**Best for:** Modern dashboards, Google Home aesthetic

---

### HKI Tile
Modern tile layout with integrated brightness slider.

```yaml
type: custom:hki-button-card
entity: light.office
card_layout: hki_tile
styles:
  tile:
    show_slider: true
    height: 120
```

**Best for:** Light controls, entities with adjustable values
