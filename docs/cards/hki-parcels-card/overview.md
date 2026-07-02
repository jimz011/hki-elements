# HKI Parcels Card

A multi-carrier parcel tracking card for Home Assistant. Track parcels from PostNL, DHL and DPD in a single unified view, with support for letterbox mail images.

!!! note
    HKI Cards were created for the visual editor in Home Assistant. It is possible that the documentation is not complete for all features.

---

## Requirements

This card requires at least one parcel-tracking integration to be installed in Home Assistant.

| Carrier | Integration |
| ------- | ----------- |
| **PostNL** | [peternijssen/ha-postnl](https://github.com/peternijssen/ha-postnl) ≥ 4.0.0 (recommended) or [arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl) |
| **DHL** | [peternijssen/ha-dhl-nl](https://github.com/peternijssen/ha-dhl-nl) |
| **DPD** | [peternijssen/ha-dpd](https://github.com/peternijssen/ha-dpd) |

---

## Features

### 📦 Package Tracking

- **Multi-carrier** — PostNL, DHL and DPD side by side in a single card
- **Multiple accounts** — add the same carrier multiple times for different accounts
- **Automatic sensor names** — enter only the account name; the card builds all sensor entity IDs automatically
- **Separate tabs** — In Transit / Delivered / Sent / Letters
- **Historical tracking** — configure how many days back to show delivered parcels
- **Click-to-expand** — click any parcel to see barcode, delivery type, and a direct tracking link

### 💌 Letterbox Mail

- **PostNL letters** — a dedicated tab shows PostNL letterbox mail with scan images
- **Image matching** — letter images from `image.*` entities are automatically matched by mail item ID (works with ha-postnl v4.x naming changes)
- **Sections** — letters split into *Still to be delivered* and *Delivered*

### 🎨 Visual Interface

- **Animated delivery** — shows a van animation when a parcel is selected
- **Custom branding** — configurable logo, van image and banner per carrier
- **Header statistics** — shows count of parcels in transit and recently delivered
- **Carrier colours** — each carrier has its own accent colour (PostNL orange, DHL yellow, DPD red)

### 🔧 Customization

- **Toggle elements** — show/hide header, tabs, animation and placeholder per carrier
- **Layout reordering** — change the order of header, animation, tabs and list
- **Visual editor** — full configuration through the Home Assistant UI
- **PHU icons** — automatic carrier icons via [custom-brand-icons](https://github.com/elax46/custom-brand-icons) when installed
