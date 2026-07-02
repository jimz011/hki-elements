# Examples

## PostNL Only — Minimal

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: my_account
```

---

## PostNL with Letters Tab

```yaml
type: custom:hki-parcels-card
title: PostNL
show_letters: true
carriers:
  - type: postnl_v4
    user: my_account
```

---

## PostNL + DHL + DPD

```yaml
type: custom:hki-parcels-card
title: Mijn Pakketjes
carriers:
  - type: postnl_v4
    user: my_account
  - type: dhl
    user: my_account
  - type: dpd
    user: my_account
```

---

## PostNL (arjenbos legacy mode)

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_legacy
    entity: sensor.postnl_delivery
    distribution_entity: sensor.postnl_distribution
```

---

## Active Deliveries Only (no history)

```yaml
type: custom:hki-parcels-card
title: Onderweg
show_delivered: false
show_sent: false
show_letters: false
carriers:
  - type: postnl_v4
    user: my_account
  - type: dhl
    user: my_account
```

---

## History Card (no animation, compact)

```yaml
type: custom:hki-parcels-card
title: Ontvangen
days_back: 14
show_animation: false
show_placeholder: false
show_header: true
carriers:
  - type: postnl_v4
    user: my_account
```

---

## Custom Appearance

```yaml
type: custom:hki-parcels-card
title: Pakketjes
header_color: "#1a1a2e"
header_text_color: "#ffffff"
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    color: "#ed8c00"
    logo_path: "https://example.com/my-logo.png"
    van_path: "https://example.com/my-van.gif"
```

---

## Sensors Without a Username Prefix

For setups where sensors are named `sensor.postnl_incoming_parcels` (no `<user>_` prefix):

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: ""
```

---

## Manual Sensor Override

When sensor entity IDs differ from the automatic pattern:

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: ""
    entity_incoming: sensor.postnl_parcels_inbound
    entity_delivered: sensor.postnl_parcels_delivered
    entity_letters: sensor.postnl_mail
```
