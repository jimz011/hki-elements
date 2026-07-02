# Tips & Tricks

## Choosing the Right PostNL Type

The card supports three PostNL variants. Use the table below to pick the right one.

| Situation | Use type |
| --------- | -------- |
| Fresh install, ha-postnl ≥ 4.0.0 | `postnl_v4` |
| Existing install, ha-postnl ≤ 3.x | `postnl` |
| Using arjenbos/ha-postnl | `postnl_legacy` |

!!! tip
    If you upgrade from peternijssen/ha-postnl v3.x to v4.x, change `type: postnl` to `type: postnl_v4` in the card configuration. Your sensor entity IDs stay the same — only the card type needs to change.

---

## Sensors Without a Username Prefix

Some PostNL setups create sensors without a username prefix, for example `sensor.postnl_incoming_parcels` instead of `sensor.john_postnl_incoming_parcels`. In this case, leave the `user` field empty:

```yaml
carriers:
  - type: postnl_v4
    user: ""
```

The editor's auto-detection also handles this case automatically.

---

## Limiting the History Period

Use `days_back` to control how far back delivered parcels are shown. A shorter period keeps the Delivered tab manageable.

```yaml
days_back: 7   # Show only the last 7 days
```

---

## Hiding Unused Tabs

If you do not use DHL or DPD, or do not send parcels, you can hide the tabs you don't need:

```yaml
show_sent: false
show_letters: false
```

---

## Using PHU Carrier Icons

If you have [custom-brand-icons](https://github.com/elax46/custom-brand-icons) installed via HACS, the card automatically uses branded carrier icons (`phu:postnl`, `phu:dhl`, `phu:dpd`). No configuration is needed — icons are resolved at render time.

---

## Multiple Cards for Different Purposes

Consider using two separate cards: one focused on active deliveries and one showing history.

```yaml
# Active deliveries card
type: custom:hki-parcels-card
title: Onderweg
show_delivered: false
show_sent: false
show_letters: false
carriers:
  - type: postnl_v4
    user: my_account

# History card
type: custom:hki-parcels-card
title: Ontvangen
show_delivered: true
show_sent: true
days_back: 30
show_animation: false
show_placeholder: false
carriers:
  - type: postnl_v4
    user: my_account
```

---

## Colour Theming

Use CSS variables for colours that automatically adapt to your Home Assistant theme:

```yaml
header_color: "var(--primary-color)"
header_text_color: "var(--text-primary-color)"
```

Or use explicit hex values for a fixed colour scheme:

```yaml
header_color: "#1a1a2e"
header_text_color: "#e0e0e0"
```

---

## Reordering Card Sections

Change the visual order of the header, animation, tabs and list sections:

```yaml
layout_order:
  - animation
  - header
  - tabs
  - list
```
