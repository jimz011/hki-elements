# Home

The main landing view: greeting header, weather, notifications, and quick shortcuts. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Home
    path: home
    icon: mdi:home
    sections:
      - type: grid
        cards:
          - type: custom:hki-header-card
            title: |-
              {% set time = states('sensor.time') %}
              {% if '00:00' < time < '06:00' %}
                Good Night
              {% elif '06:00' < time < '12:00' %}
                Good Morning 
              {% elif '12:00' < time < '18:00' %}
                Good Afternoon
              {% else %}
                Good Evening
              {% endif %}
            subtitle: '{{ user }}'
            background: purple
            background_color: red
            height_vh: 35
            min_height: 215
            max_height: 255
            grid_options:
              columns: 48
            badges_gap: 48
            badges_fixed: true
            top_bar:
              enabled: true
            bottom_info:
              text_shadow: none
              icon_shadow: none
            top_bar_left:
              type: notifications
              offset_x: 0
              overflow: true
              custom:
                card:
                  type: custom:hki-notification-card
                  use_header_styling: true
                  show_background: false
                  show_empty: true
                  display_mode: ticker
                  animation: bounce
                  direction: right
                  time_format: '24'
                  entity: sensor.hki_notify_main
                  hki_popup:
                    open_animation: scale
                    close_animation: scale
                    width: auto
                    height: auto
            top_bar_right:
              type: weather
              weather:
                entity: weather.openweathermap
                icon_color_mode: state
                animate_icon: float
              actions:
                tap_action:
                  action: hki-more-info
                  entity: light.lights_keuken
              hki_popup:
                width: auto
                height: auto
                open_animation: scale
                close_animation: scale
                time_format: auto
                default_view: main
                default_section: last
                bottom_bar_align: spread
            bottom_bar_center:
              type: button
              align: start
              styling:
                weight: ''
                color: black
                text_shadow: ''
                pill: true
                pill_background: white
                pill_blur: '0'
              button:
                icon: mdi:ab-testing
                icon_animation: ''
                name: test
                state: jawel
                entity: light.eetkamer
                text_shadow: ''
                buttons:
                  - icon: mdi:ab-testing
                    name: test
                    state: jawel
                    badge_template: |-
                      {% set entities = [
                        'light.lights_eetkamer'
                      ] %}

                      {% set active_count = expand(entities) 
                        | selectattr('state', 'eq', 'on') 
                        | list | count %}

                      {% if active_count > 0 %}
                        {{ active_count }}
                      {% endif %}
                    entity: light.eetkamer
                    show_name: false
                    show_state: false
                    show_badge: true
                    badge_source: template
                    tap_action:
                      action: hki-more-info
                    hold_action:
                      action: hki-more-info
                    double_tap_action:
                      action: hki-more-info
                    popup:
                      default_section: last
                    style:
                      icon_shadow: none
                  - icon: mdi:abacus
                    entity: climate.badkamer
                    show_badge: false
                    tap_action:
                      action: none
                    hold_action:
                      action: none
                    double_tap_action:
                      action: none
              hki_popup:
                width: auto
                height: auto
                open_animation: scale
                close_animation: scale
                time_format: auto
                default_view: main
                default_section: last
                bottom_bar_align: spread
            persons:
              enabled: true
              stack_order: ascending
              entities:
                - entity: person.stephanie
                  tap_action:
                    action: hki-more-info
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                  popup:
                    use_entity_picture: true
                    custom_popup_enabled: false
                    width: auto
                    height: auto
                    open_animation: scale
                    close_animation: scale
                    time_format: auto
                    bottom_bar_entities:
                      - entity: sensor.sm_s928b_next_alarm
                        name: Next Alarm
                        tap_action:
                          action: none
                      - entity: sensor.sm_s928b_battery_level
                        name: Battery
                        tap_action:
                          action: none
                    bottom_bar_align: end
                    hide_bottom_bar: false
                    person_geocoded_entity: sensor.sm_s948b_geocoded_location
                - entity: person.jimmy
                  tap_action:
                    action: hki-more-info
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                  popup:
                    use_entity_picture: true
                    width: auto
                    height: auto
                    open_animation: scale
                    close_animation: scale
                    time_format: auto
                    bottom_bar_entities:
                      - entity: sensor.sm_f966b_battery_level
                        name: Battery
                    bottom_bar_align: end
                    hide_bottom_bar: false
                    person_geocoded_entity: sensor.sm_f966b_geocoded_location
                - entity: person.tala
                  tap_action:
                    action: more-info
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                  popup:
                    width: auto
                    height: auto
                    open_animation: scale
                    close_animation: scale
                    time_format: auto
                    bottom_bar_align: spread
                - entity: person.kenzi
                  tap_action:
                    action: more-info
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                  popup:
                    width: auto
                    height: auto
                    open_animation: scale
                    close_animation: scale
                    time_format: auto
                    bottom_bar_align: spread
        column_span: 4
      - type: grid
        cards:
          - type: heading
            heading_style: subtitle
            heading: Navigation
            icon: mdi:navigation
          - type: grid
            cards:
              - type: custom:button-card
                icon: mdi:lightning-bolt
                name: Energy
                label: Dashboard
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: energy
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
              - type: custom:button-card
                icon: mdi:map
                name: Find My
                label: Dashboard
                color: auto-no-temperature
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: find-my
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
              - type: custom:button-card
                icon: mdi:trash-can
                name: Waste
                label: Collection
                color: auto-no-temperature
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: waste
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
              - type: custom:button-card
                icon: phu:f1
                name: F1
                label: Monitor
                color: auto-no-temperature
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: f1
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
              - type: custom:button-card
                icon: mdi:alarm-light
                name: P2000
                label: Monitor
                color: auto-no-temperature
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: p2000
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
              - type: custom:button-card
                icon: phu:postnl
                name: Parcel
                label: Delivery
                color: auto-no-temperature
                size: 25%
                show_state: true
                show_label: true
                tap_action:
                  action: navigate
                  navigation_path: parcel
                hold_action:
                  action: none
                double_tap_action:
                  action: none
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s s" "l l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
      - type: grid
        cards:
          - type: custom:hki-navigation-card
            base:
              button:
                id: 4e8c1d57-1c4c-48cb-83a0-447264197745
                icon: mdi:cctv
                entity: input_boolean.kiosk_mode
                button_type: icon
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/security
                double_tap_action:
                  action: toggle
            horizontal:
              enabled: true
              columns: 6
              buttons:
                - id: b6cbacab-fcf7-41be-a009-6d9961181441
                  icon: mdi:floor-plan
                  entity: media_player.av_samsung_soundbar_q700b_2
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/rooms
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: db9ad615-b7df-4ae9-a702-15d538275a2b
                  icon: mdi:robot-vacuum
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/roborock
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: 7c964581-3872-42cb-be62-ffa4405854a7
                  icon: hue:bulb-group
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/lights
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: 7ccba97e-4783-4889-ad7b-889496226603
                  icon: mdi:thermostat-box
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/climate
                  hold_action:
                    action: none
                  double_tap_action:
                    action: navigate
                    navigation_path: /lovelace/view-123
            vertical:
              enabled: false
              rows: 6
              buttons:
                - id: e1fd568d-f004-44c3-9207-cf3458f8d84f
                  icon: mdi:cog
                  tooltip: Settings
                  label: Settings
                  button_type: pill
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /config
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: a6d82a96-ee76-4a12-bc43-8fbb46386171
                  icon: mdi:floor-plan
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
            center_spread: true
            bottom_bar_settings:
              enabled: false
              full_width: false
              height: 85
              bottom_offset: 0
              margin_left: 0
              margin_right: 0
              style:
                background: rgb(var(--rgb-card-background-color, 0,0,0))
                opacity: 0.85
                border_radius: 0
                border_width: 0
                border_style: solid
            button_defaults:
              style:
                opacity: 1
                border_radius: 100
                border_width: 0
                border_style: solid
                box_shadow: 0 8px 24px rgba(0, 0, 0, 0.35)
                box_shadow_hover: 0 10px 30px rgba(0, 0, 0, 0.42)
              label:
                font_size: 12
                font_weight: 600
                letter_spacing: 0
                text_transform: none
                background_opacity: 0.72
                padding_x: 10
                padding_y: 6
                border_radius: 999
                backdrop_blur: 8
                max_width: 220
          - type: tile
            entity: media_player.spotify_jimmy_jimz011
      - type: grid
        cards:
          - type: heading
            heading: New section
    header:
      layout: center
      badges_position: bottom
      badges_wrap: wrap
    cards: []
    badges: []
```
