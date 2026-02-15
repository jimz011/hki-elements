# Tips & Tricks

### Hiding Specific Elements

Hide any combination of elements:

```yaml
show_header: false        # Hide logo and title
show_animation: false     # Hide delivery animation
show_placeholder: false   # Hide placeholder banner
show_delivered: false     # Hide delivered tab
show_sent: false          # Hide sent tab
```

### Short History Period

Only show recently delivered packages:

```yaml
days_back: 7              # Show last 7 days only
```

### Custom Color Schemes

Match your Home Assistant theme:

```yaml
# Dark theme
header_color: "#1a1a1a"
header_text_color: "#ffffff"

# Light theme
header_color: "#f5f5f5"
header_text_color: "#000000"

# Accent color
header_color: "var(--primary-color)"
header_text_color: "var(--text-primary-color)"
```

### Entity Configuration

The PostNL integration creates these sensors:
- `sensor.postnl_delivery` - Incoming packages
- `sensor.postnl_distribution` - Outgoing packages

Make sure both are configured if you want to track sent packages:

```yaml
entity: sensor.postnl_delivery
distribution_entity: sensor.postnl_distribution
```

### Layout Customization

Use drag-and-drop in the visual editor to reorder:
1. Open card editor
2. Click on "Layout" section
3. Drag sections to reorder
4. Save changes

Or configure manually:

```yaml
layout_order:
  - animation  # Show animation first
  - tabs       # Then tabs
  - list       # Then package list
  - header     # Header at bottom
```

### No Packages Message

When no packages are in a category, the card shows:
- Package icon
- "Geen pakketten in deze categorie" message

### Package Details

Click any package to:
1. See expanded details
2. Trigger delivery animation (if enabled)
3. Access Track & Trace link

### Multiple Cards

Create multiple cards for different views:

```yaml
# Card 1: Active deliveries only
- type: custom:hki-postnl-card
  entity: sensor.postnl_delivery
  title: Active
  show_delivered: false
  show_sent: false

# Card 2: History only
- type: custom:hki-postnl-card
  entity: sensor.postnl_delivery
  title: History
  show_header: false
  show_animation: false
  layout_order:
    - tabs
    - list
```

### Visual Editor Features

The visual editor provides:
- Entity picker with autocomplete
- Color pickers for header colors
- Toggle switches for show/hide options
- Drag-and-drop layout ordering
- Real-time preview

### Performance Tips

For better performance:
- Limit `days_back` to only what you need (e.g., 30 days instead of 90)
- Disable `show_animation` if you don't use it
- Disable `show_placeholder` if you prefer clean look

### Integration Setup

If the card shows "Entiteit niet gevonden":
1. Install the [PostNL integration](https://github.com/arjenbos/ha-postnl)
2. Configure your PostNL account credentials
3. Wait for sensors to appear
4. Use entity ID in card configuration
