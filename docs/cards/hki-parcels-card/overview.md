# HKI Parcels Card

A multi-carrier parcel tracking card for Home Assistant, designed primarily for Dutch parcel delivery services. Track parcels from PostNL, DHL, DPD and GLS in a single unified view, with support for letterbox mail images.

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
| **GLS** | [peternijssen/ha-gls](https://github.com/peternijssen/ha-gls) |

!!! note
    GLS has no sender/account concept — you track parcels by tracking number and postal code, not a login. The card's `user` field maps to the hub's postal code (e.g. `1234ab`), and the Sent tab is not available for this carrier.

---

## Features

### 📦 Package Tracking

- **Multi-carrier** — PostNL, DHL, DPD and GLS side by side in a single card; add the same carrier multiple times for multiple accounts
- **Auto-populated on first add** — adding the card detects every installed carrier integration and pre-fills a fully configured entry for each account found, including a sensible `days_back` inferred from your existing delivered-parcel history. No YAML or manual setup required to get started.
- **Automatic sensor names** — the editor also fills in all sensor entity IDs automatically when you pick a carrier type and confirm the account, regardless of language (English/Dutch) or naming order
- **Separate tabs** — In Transit / Delivered / Sent / Letters, with Sent and Letters both split into *Still to be delivered* and *Delivered*
- **4-step delivery tracker** — selecting a parcel shows a labelled progress row (Registered · Sorting centre · Out for delivery · Delivered) with a carrier-branded illustration and the expected delivery window for the current step
- **Historical tracking** — configure how many days back to show delivered parcels
- **Click-to-expand** — click any parcel to see barcode, delivery type, and a direct tracking link

### 💌 Letterbox Mail

- **PostNL letters** — a dedicated tab shows PostNL letterbox mail with scan images
- **Image matching** — letter images from `image.*` entities are automatically matched by mail item ID (works with ha-postnl v4.x naming changes)
- **Sections** — letters split into *Still to be delivered* and *Delivered*

### 🎨 Visual Interface

- **Animated delivery** — shows a van animation when a parcel is selected
- **Dynamic combo banner** — with two or more carriers configured, the no-selection banner shows only the carriers you've actually set up, as full-width brand-coloured panels
- **Custom branding** — configurable logo, van image and banner per carrier
- **Header statistics** — shows count of parcels in transit and recently delivered
- **Carrier colours** — each carrier has its own accent colour (PostNL orange, DHL yellow, DPD red, GLS blue)

### 🔧 Customization

- **Toggle elements** — show/hide header, tabs, animation and placeholder per carrier
- **Layout reordering** — change the order of header, animation, tabs and list
- **Visual editor** — full configuration through the Home Assistant UI
- **PHU icons** — automatic carrier icons via [custom-brand-icons](https://github.com/elax46/custom-brand-icons) when installed
