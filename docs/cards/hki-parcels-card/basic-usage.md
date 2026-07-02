# Basic Usage

## Minimal Example

The quickest way to add the card is to specify a carrier type and account name. The card automatically generates all required sensor entity IDs.

```yaml
type: custom:hki-parcels-card
title: My Parcels
carriers:
  - type: postnl_v4
    user: my_account
```

The `user` field is the part of your sensor name before `_postnl_incoming_parcels`. For example, if your sensor is `sensor.john_postnl_incoming_parcels`, use `user: john`.

!!! tip
    If your sensors have no username prefix (e.g. `sensor.postnl_incoming_parcels`), leave `user` empty or omit it entirely.

---

## Multiple Carriers

```yaml
type: custom:hki-parcels-card
title: Parcels
carriers:
  - type: postnl_v4
    user: my_account
  - type: dhl
    user: my_account
  - type: dpd
    user: my_account
```

---

## PostNL with Letters

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: my_account
show_letters: true
```

---

## PostNL (arjenbos / legacy single-entity mode)

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_legacy
    entity: sensor.postnl_delivery
    distribution_entity: sensor.postnl_distribution
```

---

## Customized Appearance

```yaml
type: custom:hki-parcels-card
title: My Parcels
days_back: 30
header_color: "#1a1a2e"
header_text_color: "#ffffff"
show_animation: true
show_placeholder: true
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    color: "#ed8c00"
```
