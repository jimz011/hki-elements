# Climate

Climate control overview. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Climate
    path: climate
    icon: mdi:thermostat-box
    subview: true
    sections:
      - type: grid
        cards:
          - type: heading
            icon: mdi:home-floor-g
            heading: Ground Floor
            heading_style: title
          - square: true
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: climate.woonkamer_keuken
                name: Vloerverwarming
                icon: mdi:heating-coil
                tap_action:
                  action: hki-more-info
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                climate:
                  show_plus_minus: true
                  use_circular_slider: false
                hki_popup:
                  border_radius: 25
                  blur_enabled: true
                  width: auto
                  height: auto
                  card_blur_enabled: true
                  card_opacity: 0.3
            columns: 3
      - type: grid
        cards:
          - type: heading
            icon: mdi:home-floor-l
            heading: First Floor
            heading_style: title
          - square: true
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: climate.badkamer
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
                icon_double_tap_action:
                  action: none
              - type: custom:hki-button-card
                entity: climate.floor_heater
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                name: Badkamer Vloer
                icon: mdi:heating-coil
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
              - type: custom:hki-button-card
                entity: climate.slaapkamer
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
              - type: custom:hki-button-card
                entity: climate.office
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
              - type: custom:hki-button-card
                entity: climate.walk_in_closet
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
            columns: 3
      - type: grid
        cards:
          - type: heading
            heading: Second Floor
            heading_style: title
            icon: mdi:home-floor-2
          - square: true
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: climate.zolder_voor
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
              - type: custom:hki-button-card
                entity: climate.zolder_achter
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
            columns: 3
      - type: grid
        cards:
          - type: heading
            heading: Cooling
            heading_style: title
            icon: mdi:air-conditioner
          - square: true
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: climate.airco
                icon_circle_border_style: solid
                icon_circle_border_width: '1'
                icon_circle_border_color: black
                icon: mdi:fan
                icon_animation: spin
                tap_action:
                  action: hki-more-info
                climate_show_plus_minus: true
                climate_use_circular_slider: false
            columns: 3
      - type: grid
        cards:
          - type: custom:hki-navigation-card
            base:
              button:
                id: 4e8c1d57-1c4c-48cb-83a0-447264197745
                icon: mdi:home
                tooltip: Home
                entity: input_boolean.kiosk_mode
                button_type: icon
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/home
                hold_action:
                  action: toggle-group
                  mode: toggle
                double_tap_action:
                  action: toggle
            horizontal:
              enabled: true
              columns: 6
              buttons:
                - id: e1b058dd-45fb-4395-b48a-75dbfb98c0e8
                  icon: mdi:floor-plan
                  label: Rooms
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/rooms
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: b6cbacab-fcf7-41be-a009-6d9961181441
                  icon: mdi:chevron-left
                  tooltip: Overview
                  button_type: icon
                  background: DarkOrange
                  conditions_mode: all
                  tap_action:
                    action: back
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
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
                    action: toggle-group
                    mode: toggle
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
                - id: 4322b937-2eb6-469b-9da8-cfe63087411c
                  icon: mdi:floor-plan
                  conditions_mode: all
                  tap_action:
                    action: navigate
                    navigation_path: /
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
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
    header:
      card:
        type: custom:hki-header-card
        title: Tado
        subtitle: Climate Control
        background: >-
          https://assets2.brandfolder.io/bf-boulder-prod/4pwvv34xr873ftwvkfj3hsbk/v/1113792991/original/xl_header_smart_thermostat_black_st_stand_lifestyle_0713_20.webp
        height_vh: 35
        min_height: 215
        max_height: 270
        badges_gap: 30
        top_bar:
          enabled: true
        top_bar_left:
          type: notifications
          offset_x: 0
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
              popup_width: auto
              popup_height: auto
              popup_open_animation: scale
              popup_close_animation: scale
        top_bar_center:
          type: none
        top_bar_right:
          type: weather
          weather:
            entity: weather.openweathermap
            show_humidity: false
            show_wind: false
            show_pressure: false
            icon_color_mode: state
            animate_icon: float
          actions:
            tap_action:
              action: more-info
              entity: weather.buienradar
        bottom_bar_left:
          type: none
        bottom_bar_center:
          type: card
          align: stretch
          custom:
            card:
              type: vertical-stack
              cards:
                - type: custom:mini-graph-card
                  card_mod:
                    style: |
                      ha-card {
                        background: none;
                        border-style: none;
                      }
                  entities:
                    - sensor.office_temperature
                  show:
                    name: false
                    icon: false
                    state: false
        bottom_bar_right:
          type: none
        persons:
          enabled: false
    badges:
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.average_temperature
        icon: mdi:thermometer
        show_entity_picture: false
        tap_action:
          action: fire-dom-event
          browser_mod:
            service: browser_mod.popup
            data:
              title: Temperature
              card_mod:
                style: |
                  ha-dialog {
                    --mdc-dialog-min-width: 90vw !important;
                    --mdc-dialog-max-width: 90vw !important;
                  }
                  @media (min-width: 800px) {
                    ha-dialog {
                      --mdc-dialog-min-width: 500px !important;
                      --mdc-dialog-max-width: 600px !important;
                    }
                  }
              content:
                type: custom:auto-entities
                card:
                  type: custom:layout-card
                  layout_type: vertical
                filter:
                  include:
                    - options:
                        type: custom:mini-graph-card
                        graph: line
                        detail: 2
                        hours_to_show: 24
                        entities:
                          - this.entity_id
                        color_thresholds:
                          - value: -10
                            color: '#2e004f'
                          - value: -8
                            color: '#4b0082'
                          - value: -6
                            color: '#6a0dad'
                          - value: -4
                            color: '#8a2be2'
                          - value: -2
                            color: '#4169e1'
                          - value: 0
                            color: '#0000ff'
                          - value: 2
                            color: '#1e90ff'
                          - value: 4
                            color: '#00bfff'
                          - value: 6
                            color: '#00ced1'
                          - value: 8
                            color: '#40e0d0'
                          - value: 10
                            color: '#00ffff'
                          - value: 12
                            color: '#00ff7f'
                          - value: 14
                            color: '#32cd32'
                          - value: 16
                            color: '#00ff00'
                          - value: 18
                            color: '#7fff00'
                          - value: 20
                            color: '#adff2f'
                          - value: 22
                            color: '#ffff00'
                          - value: 24
                            color: '#ffca00'
                          - value: 26
                            color: '#ffa500'
                          - value: 28
                            color: '#ff8c00'
                          - value: 30
                            color: '#ff4500'
                          - value: 32
                            color: '#ff0000'
                          - value: 34
                            color: '#dc143c'
                          - value: 36
                            color: '#b22222'
                          - value: 38
                            color: '#8b0000'
                          - value: 40
                            color: '#500000'
                      entity_id: sensor.*_temperature
                  exclude:
                    - options: {}
                      name: '*Door*'
                    - options: {}
                      name: '*Open*'
                    - options: {}
                      name: '*Vibration*'
                    - options: {}
                      name: '*Unraid*'
                    - options: {}
                      name: '*PV*'
                    - options: {}
                      name: '*Ultimate*'
                    - options: {}
                      name: '*Cube*'
                    - options: {}
                      name: '*USW*'
                    - options: {}
                      name: '*Window*'
                    - options: {}
                      name: '*Leak*'
                    - options: {}
                      name: '*Home*'
                    - options: {}
                      name: '*Smoke*'
                    - options: {}
                      name: '*Average*'
                    - options: {}
                      name: '*Tado*'
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.average_humidity
        icon: mdi:water-percent
        show_entity_picture: false
        tap_action:
          action: fire-dom-event
          browser_mod:
            service: browser_mod.popup
            data:
              title: Humidity
              card_mod:
                style: |
                  ha-dialog {
                    --mdc-dialog-min-width: 90vw !important;
                    --mdc-dialog-max-width: 90vw !important;
                  }
                  @media (min-width: 800px) {
                    ha-dialog {
                      --mdc-dialog-min-width: 500px !important;
                      --mdc-dialog-max-width: 600px !important;
                    }
                  }
              content:
                type: custom:auto-entities
                card:
                  type: custom:layout-card
                  layout_type: vertical
                filter:
                  include:
                    - options:
                        type: custom:mini-graph-card
                        graph: line
                        detail: 2
                        hours_to_show: 24
                        entities:
                          - this.entity_id
                        color_thresholds:
                          - value: 0
                            color: '#ff0000'
                          - value: 10
                            color: '#ff4500'
                          - value: 20
                            color: '#ffa500'
                          - value: 30
                            color: '#ffbf00'
                          - value: 35
                            color: '#ffff00'
                          - value: 40
                            color: '#adff2f'
                          - value: 45
                            color: '#00ff00'
                          - value: 50
                            color: '#00ff00'
                          - value: 55
                            color: '#00ff00'
                          - value: 60
                            color: '#32cd32'
                          - value: 65
                            color: '#00fa9a'
                          - value: 70
                            color: '#00ced1'
                          - value: 75
                            color: '#00bfff'
                          - value: 80
                            color: '#1e90ff'
                          - value: 85
                            color: '#4169e1'
                          - value: 90
                            color: '#0000ff'
                          - value: 95
                            color: '#4b0082'
                          - value: 100
                            color: '#2e004f'
                      entity_id: sensor.*_humidity
                  exclude:
                    - options: {}
                      name: '*Door*'
                    - options: {}
                      name: '*Open*'
                    - options: {}
                      name: '*Vibration*'
                    - options: {}
                      name: '*Unraid*'
                    - options: {}
                      name: '*PV*'
                    - options: {}
                      name: '*Ultimate*'
                    - options: {}
                      name: '*Cube*'
                    - options: {}
                      name: '*USW*'
                    - options: {}
                      name: '*Window*'
                    - options: {}
                      name: '*Leak*'
                    - options: {}
                      name: '*Home*'
                    - options: {}
                      name: '*Smoke*'
                    - options: {}
                      name: '*Average*'
                    - options: {}
                      name: '*Tado*'
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.average_air_pressure
        icon: mdi:gauge
        show_entity_picture: false
        name: Average Pressure
        tap_action:
          action: fire-dom-event
          browser_mod:
            service: browser_mod.popup
            data:
              title: Air Pressure
              card_mod:
                style: |
                  ha-dialog {
                    --mdc-dialog-min-width: 90vw !important;
                    --mdc-dialog-max-width: 90vw !important;
                  }
                  @media (min-width: 800px) {
                    ha-dialog {
                      --mdc-dialog-min-width: 500px !important;
                      --mdc-dialog-max-width: 600px !important;
                    }
                  }
              content:
                type: custom:auto-entities
                card:
                  type: custom:layout-card
                  layout_type: vertical
                filter:
                  include:
                    - options:
                        type: custom:mini-graph-card
                        graph: line
                        detail: 2
                        hours_to_show: 24
                        entities:
                          - this.entity_id
                        color_thresholds:
                          - value: 970
                            color: '#2e004f'
                          - value: 975
                            color: '#4b0082'
                          - value: 980
                            color: '#8a2be2'
                          - value: 985
                            color: '#0000ff'
                          - value: 990
                            color: '#1e90ff'
                          - value: 995
                            color: '#00bfff'
                          - value: 1000
                            color: '#00ced1'
                          - value: 1005
                            color: '#00fa9a'
                          - value: 1010
                            color: '#00ff00'
                          - value: 1015
                            color: '#adff2f'
                          - value: 1020
                            color: '#ffff00'
                          - value: 1025
                            color: '#ffbf00'
                          - value: 1030
                            color: '#ffa500'
                          - value: 1035
                            color: '#ff4500'
                          - value: 1040
                            color: '#ff0000'
                          - value: 1045
                            color: '#8b0000'
                      entity_id: sensor.*_pressure
                  exclude:
                    - options: {}
                      name: '*Door*'
                    - options: {}
                      name: '*Open*'
                    - options: {}
                      name: '*Vibration*'
                    - options: {}
                      name: '*Unraid*'
                    - options: {}
                      name: '*PV*'
                    - options: {}
                      name: '*Ultimate*'
                    - options: {}
                      name: '*Cube*'
                    - options: {}
                      name: '*USW*'
                    - options: {}
                      name: '*Window*'
                    - options: {}
                      name: '*Leak*'
                    - options: {}
                      name: '*Home*'
                    - options: {}
                      name: '*Smoke*'
                    - options: {}
                      name: '*Average*'
                    - options: {}
                      name: '*Tado*'
```
