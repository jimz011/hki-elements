# Configuration

## Card Options

These options apply to the card as a whole.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `title` | string | `Parcels` | Title shown in the card header |
| `days_back` | number | `90` | How many days to show delivered parcels |
| `show_delivered` | boolean | `true` | Show the "Bezorgd" (Delivered) tab |
| `show_sent` | boolean | `true` | Show the "Verzonden" (Sent) tab |
| `show_letters` | boolean | `true` | Show the "Post" (Letters) tab (PostNL only) |
| `show_animation` | boolean | `true` | Show the van animation when a parcel is selected |
| `show_header` | boolean | `true` | Show the header with title and statistics |
| `show_placeholder` | boolean | `true` | Show the background image when no parcel is selected |
| `header_color` | string | `var(--card-background-color)` | Header background colour |
| `header_text_color` | string | `var(--primary-text-color)` | Header text colour |
| `placeholder_image` | string | _(built-in)_ | URL to a custom background image |
| `layout_order` | list | `[header, animation, tabs, list]` | Order of the card sections |
| `carriers` | list | — | **Required.** List of carrier configurations (see below) |

---

## Carrier Options

Each entry in the `carriers` list supports the following options.

### Common Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `type` | string | — | **Required.** Carrier type (see [Carrier Types](#carrier-types)) |
| `user` | string | `""` | Account part of the sensor name (omit for prefix-free sensors) |
| `name` | string | _(carrier label)_ | Display name for this carrier |
| `icon` | string | _(carrier icon)_ | Icon for this carrier (`mdi:` or `phu:` prefix) |
| `color` | string | _(carrier colour)_ | Accent colour for this carrier |
| `logo_path` | string | _(carrier logo)_ | URL to a custom logo image |
| `van_path` | string | _(carrier van GIF)_ | URL to a custom van animation |
| `banner_path` | string | _(carrier banner)_ | URL to a custom banner image |
| `show_tracking_link` | boolean | `true` | Show the "Open Tracking" button in the detail panel |

### Sensor Overrides

Normally the card generates sensor entity IDs automatically from `type` and `user`. Use these only if your sensor names differ.

| Option | Type | Description |
| ------ | ---- | ----------- |
| `entity_incoming` | string | Sensor for incoming parcels in transit |
| `entity_delivered` | string | Sensor for delivered incoming parcels |
| `entity_outgoing` | string | Sensor for outgoing parcels in transit |
| `entity_outgoing_delivered` | string | Sensor for delivered outgoing parcels |
| `entity_letters` | string | Sensor for PostNL letterbox mail (PostNL only) |

### PostNL Legacy (arjenbos) Options

When `type: postnl_legacy` these options apply instead.

| Option | Type | Description |
| ------ | ---- | ----------- |
| `entity` | string | **Required.** Combined PostNL delivery sensor |
| `distribution_entity` | string | Optional. PostNL distribution (sent) sensor |

---

## Carrier Types

| Type | Label in editor | Integration | Letters |
| ---- | --------------- | ----------- | ------- |
| `postnl_v4` | PostNL (peternijssen v4.x) | peternijssen/ha-postnl ≥ 4.0.0 | ✅ |
| `postnl` | PostNL (peternijssen v3.x) | peternijssen/ha-postnl ≤ 3.x | ✅ |
| `dhl` | DHL | peternijssen/ha-dhl-nl | — |
| `dpd` | DPD | peternijssen/ha-dpd | — |
| `postnl_legacy` | PostNL (arjenbos) | arjenbos/ha-postnl | — |
| `custom` | Custom | any | — |

!!! tip "Which PostNL type should I use?"
    Use `postnl_v4` for new installations or if you have updated to peternijssen/ha-postnl 4.0.0 or later.
    Use `postnl` if you are still on version 3.x.
    Use `postnl_legacy` only for the arjenbos/ha-postnl integration.

---

## Full Configuration Example

```yaml
type: custom:hki-parcels-card
title: Parcels
days_back: 90
show_delivered: true
show_sent: true
show_letters: true
show_animation: true
show_header: true
show_placeholder: true
header_color: ""
header_text_color: ""
placeholder_image: ""
layout_order:
  - header
  - animation
  - tabs
  - list
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    icon: phu:postnl
    color: "#ed8c00"
    logo_path: ""
    van_path: ""
    banner_path: ""
    show_tracking_link: true
    # Optional sensor overrides — normally not needed:
    entity_incoming: sensor.my_account_postnl_incoming_parcels
    entity_delivered: sensor.my_account_postnl_delivered_parcels
    entity_outgoing: sensor.my_account_postnl_outgoing_parcels
    entity_outgoing_delivered: sensor.my_account_postnl_outgoing_delivered_parcels
    entity_letters: sensor.my_account_postnl_letters
  - type: dhl
    user: my_account
  - type: dpd
    user: my_account
```
