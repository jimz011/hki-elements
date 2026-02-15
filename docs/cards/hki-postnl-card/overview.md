# HKI PostNL Card

A custom Home Assistant card for tracking PostNL packages with an interactive visual interface, delivery animations, and detailed shipment information.

***NOTE: HKI Cards were created for the visual editor in Home Assistant, it is possible that the documentation is not complete for all features. If you think this documentation is missing something or needs editing, please open an issue or create a PR with the changes.***

## Requirements

This card requires the **PostNL Integration** to be installed in Home Assistant:

**[arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl)** - Home Assistant PostNL integration

The integration creates sensors that track your PostNL packages automatically.

## Features

### 📦 Package Tracking
- **Real-time Updates** - Automatic updates when package status changes
- **Multiple Categories** - Separate tabs for packages in transit, delivered, and sent
- **Detailed Information** - Track & trace codes, delivery type, shipment type
- **Historical Tracking** - Configure how many days back to show delivered packages
- **Click-to-Expand** - Click any package to see detailed information

### 🎨 Visual Interface
- **Animated Delivery** - Shows a van animation indicating delivery progress when you select a package
- **Custom Branding** - Configurable PostNL logo and van images
- **Header Banner** - Optional placeholder image when no package is selected
- **Statistics** - Shows count of packages in transit and recently delivered
- **Color Themes** - Customizable header colors to match your Home Assistant theme

### 🔧 Customization
- **Toggle Elements** - Show/hide header, tabs, animation, and placeholder
- **Layout Reordering** - Drag-and-drop to rearrange header, animation, tabs, and list order
- **Flexible Configuration** - Support for both delivery and distribution (sent packages) entities
- **Visual Editor** - Easy configuration through Home Assistant UI



