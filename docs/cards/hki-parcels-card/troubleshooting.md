# Troubleshooting

## "Entiteit niet gevonden" (Entity not found)

The card cannot find one or more sensor entities.

**Causes and solutions:**

1. The parcel integration is not installed — install the integration for your carrier and configure your account credentials.
2. The `user` field does not match your sensor prefix — check the actual sensor name in **Developer Tools → States** and adjust `user` accordingly.
3. The sensors have no username prefix — leave `user` empty (`user: ""`).
4. You selected the wrong PostNL type — if your sensor names include `postnl`, use `postnl_v4` (for ha-postnl ≥ 4.x) or `postnl` (for ha-postnl ≤ 3.x), not `postnl_legacy`.

---

## No Parcels Shown

The card loads but the parcel list is empty.

**Causes and solutions:**

1. `days_back` is too short — increase the value to show older delivered parcels.
2. The integration has not yet received data from the carrier — wait for the next update cycle or trigger a manual refresh.
3. The sensor exists but has no attributes — verify the integration is authenticated and the account has active parcels.

---

## Delivered Parcels Not Visible

Delivered parcels do not appear in the Bezorgd tab.

**Causes and solutions:**

1. `show_delivered` is set to `false` — enable it in the card options.
2. The parcels are older than `days_back` — increase the value.
3. Using `postnl_v4` type with an older ha-postnl version — ha-postnl ≥ 4.0.0 is required for `postnl_v4`. Use `postnl` for version 3.x.

---

## Sent Parcels Not Visible

The Verzonden tab is empty.

**Causes and solutions:**

1. `show_sent` is set to `false` — enable it.
2. The `entity_outgoing` sensor is not configured and cannot be derived automatically — verify the sensor exists in Developer Tools and add a manual override if needed.
3. For `postnl_legacy` — configure `distribution_entity` alongside `entity`.

---

## Letters Tab Not Visible or Empty

The Post tab does not appear or shows no letters.

**Causes and solutions:**

1. `show_letters` is set to `false` — enable it.
2. The carrier type is not PostNL — only `postnl_v4` and `postnl` support letters.
3. The `entity_letters` sensor does not exist — the letters sensor is created by ha-postnl when your account has letterbox mail. Verify it exists in Developer Tools.

---

## Letter Images Not Showing

Letters appear but no scan images are displayed.

**Causes and solutions:**

1. ha-postnl has not yet downloaded the images — images are fetched asynchronously and may take a few minutes after the letter data appears.
2. The letter only has a placeholder image — ha-postnl v4.x creates a placeholder `image.*` entity before the real scan is available. The card automatically skips placeholder entities; when the real image is available it will appear automatically.
3. The image entity is `unavailable` — the scan has not been received yet. Check the entity state in Developer Tools.

---

## Animation Not Showing

The van animation does not appear when a parcel is selected.

**Causes and solutions:**

1. `show_animation` is set to `false` — enable it.
2. No parcel is selected — click a parcel in the list to trigger the animation.

---

## Wrong Carrier Colour

All carriers show the same colour (orange).

This was a bug fixed in v1.0.5. Update to the latest version of the card.

---

## Card Shows Blank / White Screen

**Causes and solutions:**

1. The JavaScript file is not loaded — verify the resource is added in **Settings → Dashboards → Resources** and the path is correct.
2. A JavaScript error occurred — open the browser console (F12) and check for errors. Report any errors on the [issue tracker](https://github.com/jonisnet/hki-parcels-card/issues).
3. Clear your browser cache (Ctrl+Shift+R) and reload Home Assistant.
