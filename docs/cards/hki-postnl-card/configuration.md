# Configuration

### Required Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entity` | string | *required* | PostNL delivery sensor entity ID |

**Example:**
```yaml
entity: sensor.postnl_delivery
```

---

### Display Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `distribution_entity` | string | "" | PostNL distribution (sent packages) sensor entity ID |
| `title` | string | `PostNL` | Card title shown in header |
| `days_back` | number | 90 | Number of days to keep delivered packages visible |
| `show_header` | boolean | true | Show/hide the header with logo and title |
| `show_delivered` | boolean | true | Show/hide the "Bezorgd" (Delivered) tab |
| `show_sent` | boolean | true | Show/hide the "Verzonden" (Sent) tab |
| `show_animation` | boolean | true | Show/hide delivery animation when package selected |
| `show_placeholder` | boolean | true | Show/hide placeholder image when no package selected |

**Example:**
```yaml
entity: sensor.postnl_delivery
distribution_entity: sensor.postnl_distribution
title: My Deliveries
days_back: 30
show_header: true
show_delivered: true
show_sent: true
show_animation: true
show_placeholder: true
```

---

### Visual Customization

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header_color` | string | `var(--card-background-color)` | Header background color (CSS color) |
| `header_text_color` | string | `var(--primary-text-color)` | Header text color (CSS color) |
| `placeholder_image` | string | (PostNL banner) | URL for placeholder/banner image |
| `logo_path` | string | (PostNL logo) | URL for PostNL logo image |
| `van_path` | string | (PostNL van GIF) | URL for delivery van animation image |

**Default Assets:**
- **Logo:** `https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-logo.png?raw=true`
- **Van:** `https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-van.gif?raw=true`
- **Banner:** `https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-banner.jpg?raw=true`

**Example:**
```yaml
header_color: "#ff6b00"
header_text_color: "#ffffff"
placeholder_image: /local/images/custom-banner.jpg
logo_path: /local/images/custom-logo.png
van_path: /local/images/custom-van.gif
```

---

### Layout Order

Control the order in which card sections appear.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout_order` | array | `['header', 'animation', 'tabs', 'list']` | Order of card sections |

**Available Sections:**
- `header` - Header with logo, title, and statistics
- `animation` - Delivery animation or placeholder image area
- `tabs` - Tab navigation (Onderweg, Bezorgd, Verzonden)
- `list` - Package list display

**Example:**
```yaml
# Put animation at the top
layout_order:
  - animation
  - header
  - tabs
  - list

# Minimal layout (no animation)
layout_order:
  - header
  - tabs
  - list
```

> **Note:** You can use the visual editor's drag-and-drop interface to reorder sections easily.

---

## Tab Categories

The card displays packages in three categories:

### Onderweg (In Transit)
- Shows packages currently being delivered
- Default active tab
- Displays delivery date/time
- Shows "Onderweg" status

### Bezorgd (Delivered)
- Shows recently delivered packages
- Limited by `days_back` setting (default: 90 days)
- Displays delivery date/time
- Shows "Bezorgd" status with checkmark

### Verzonden (Sent)
- Shows packages you've sent (requires `distribution_entity`)
- Only visible if `show_sent: true` and `distribution_entity` is configured
- Useful for tracking outgoing shipments

---

## Visual Elements

### Package Animation

When you click on a package, an animated delivery scene appears showing:
- A house emoji (delivery destination)
- A road line
- PostNL van that moves based on delivery status:
  - **25% position** - Package in transit
  - **75% position** - Package delivered
- Package name and status

### Package List

Each package shows:
- **Name** - Package description/name
- **Status Icon** - Truck icon (in transit) or checkmark (delivered)
- **Status Message** - Current delivery status
- **Date/Time** - Planned or actual delivery time
- **Expandable Details:**
  - Track & Trace code
  - Shipment type (Pakket or Brievenbuspakje)
  - Delivery type (Thuisbezorging or Afhaalpunt)
  - Link to PostNL Track & Trace

### Header Statistics

Shows quick overview:
- `X onderweg` - Packages in transit
- `X recent` - Recently delivered packages

---
