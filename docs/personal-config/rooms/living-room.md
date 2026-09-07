# Living Room

One of my per-room subviews, opened from the [Rooms](../rooms-overview.md) hub. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - title: Living Room
    header:
      layout: start
      badges_position: bottom
      badges_wrap: wrap
    sections:
      - type: grid
        cards:
          - type: custom:hki-header-card
            title: Living Room
            subtitle: >
              {% if is_state('media_player.android_tv_10_0_0_82', 'playing') %}
                TV: {{ states('media_player.android_tv_10_0_0_82') }}
              {% elif is_state('media_player.av_samsung_soundbar_q700b',
              'playing') %}
                Music: {{ state_attr('media_player.av_samsung_soundbar_q700b', 'media_artist') }} - {{ state_attr('media_player.av_samsung_soundbar_q700b', 'media_title') }}
              {% else %}
                No Media is Playing
              {% endif %}
            background: /local/images/rooms/livingroom.jpg
            height_vh: 35
            min_height: 215
            max_height: 270
            grid_options:
              columns: full
              rows: auto
            badges_offset_unpinned: 50
            badges_gap: 48
            badges_fixed: true
            top_bar:
              enabled: true
            bottom_bar:
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
            top_bar_right:
              type: weather
              overflow: true
              weather:
                entity: weather.openweathermap
                icon_color_mode: state
                animate_icon: float
              actions:
                tap_action:
                  action: more-info
                  entity: weather.buienradar
            bottom_bar_left:
              type: card
              custom:
                card:
                  type: vertical-stack
                  cards:
                    - type: horizontal-stack
                      cards:
                        - type: custom:hki-button-card
                          entity: camera.woonkamer_high_resolution_channel
                          card_layout: badge
                          show_name: false
                          hold_action:
                            action: none
                          tap_action:
                            action: hki-more-info
                          show_state: false
                          icon: mdi:cctv
                          styles:
                            card:
                              border_radius: 100px
                            icon:
                              size: 18
                            typography:
                              name:
                                weight: bold
                          custom_popup:
                            enabled: true
                            card:
                              type: vertical-stack
                              cards:
                                - type: custom:webrtc-camera
                                  ui: true
                                  muted: true
                                  streams:
                                    - url: woonkamer_hd
                                      name: HD
                                    - url: woonkamer_md
                                      name: MD
                                    - url: woonkamer_sd
                                      name: SD
                                  shortcuts:
                                    - name: Record
                                      icon: mdi:record-circle-outline
                                      service: switch.toggle
                                      service_data:
                                        entity_id: switch.woonkamer_privacy_mode
            bottom_bar_right:
              type: card
              overflow: true
              custom:
                card:
                  type: vertical-stack
                  cards:
                    - type: horizontal-stack
                      cards:
                        - type: custom:hki-button-card
                          hold_action:
                            action: none
                          card_layout: badge
                          entity: switch.klarstein_fireplace
                          show_state: false
                          show_name: false
                          tap_action:
                            action: hki-more-info
                          icon: |-
                            {% if is_state(config.entity, "on") %}
                              mdi:fireplace
                            {% else %}
                              mdi:fireplace-off
                            {% endif %}
                          styles:
                            icon:
                              color: >-
                                {% if states('sensor.open_haard_power') | float
                                > 10 %}
                                  orange
                                {% elif is_state(config.entity, "on") %}
                                  #4CAF50
                                {% endif %}
                          custom_popup:
                            enabled: true
                            card:
                              type: vertical-stack
                              cards:
                                - type: grid
                                  columns: 5
                                  cards:
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                      aspect_ratio: 1/1
                                      entity: scene.power_on
                                      icon: mdi:power
                                      name: Power
                                      tap_action:
                                        action: call-service
                                        service: scene.turn_on
                                        service_data:
                                          entity_id: scene.power_on
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                      aspect_ratio: 1/1
                                      entity: scene.minus
                                      icon: mdi:chevron-down-circle
                                      name: Down
                                      tap_action:
                                        action: call-service
                                        service: scene.turn_on
                                        service_data:
                                          entity_id: scene.minus
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                      aspect_ratio: 1/1
                                      entity: scene.plus
                                      icon: mdi:chevron-up-circle
                                      name: Up
                                      tap_action:
                                        action: call-service
                                        service: scene.turn_on
                                        service_data:
                                          entity_id: scene.plus
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                                - type: grid
                                  columns: 5
                                  cards:
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                                - type: grid
                                  columns: 5
                                  cards:
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                      aspect_ratio: 1/1
                                      entity: scene.ok
                                      icon: mdi:check-circle
                                      name: OK
                                      tap_action:
                                        action: call-service
                                        service: scene.turn_on
                                        service_data:
                                          entity_id: scene.ok
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                      aspect_ratio: 1/1
                                      entity: scene.mode
                                      icon: mdi:alpha-m-circle
                                      name: Mode
                                      tap_action:
                                        action: call-service
                                        service: scene.turn_on
                                        service_data:
                                          entity_id: scene.mode
                                    - type: custom:button-card
                                      styles:
                                        card:
                                          - box-shadow: none
                                          - background-color: transparent
                                          - border-style: none
                                      card_type: blank-card
                                      aspect_ratio: 1/1
                        - type: custom:hki-button-card
                          entity: cover.curtain_voor
                          card_layout: badge
                          show_name: false
                          show_state: false
                          icon: |-
                            {% if is_state(config.entity, "open") %}
                              mdi:curtains
                            {% else %}
                              mdi:curtains-closed
                            {% endif %}
                          tap_action:
                            action: hki-more-info
                          hki_popup:
                            blur_enabled: true
                            blur_amount: 10
                        - type: custom:hki-button-card
                          entity: cover.rolgordijn_woonkamer
                          card_layout: badge
                          show_name: false
                          show_state: false
                          tap_action:
                            action: hki-more-info
                          hki_popup:
                            blur_enabled: true
                        - type: custom:hki-button-card
                          entity: climate.woonkamer_keuken
                          card_layout: badge
                          show_name: false
                          state_label: >-
                            {{ state_attr('climate.woonkamer_keuken',
                            'current_temperature') }}°C
                          show_icon_circle: true
                          tap_action:
                            action: hki-more-info
                          icon: mdi:heating-coil
                          styles:
                            icon:
                              size: 18
                            typography:
                              name:
                                weight: bold
                            temp_badge:
                              border_style: none
                          climate:
                            show_plus_minus: true
                            use_circular_slider: true
                          hki_popup:
                            blur_enabled: true
                            blur_amount: 10
            persons:
              enabled: false
        column_span: 10
      - type: grid
        cards:
          - type: heading
            heading: Light Settings
            heading_style: subtitle
            icon: mdi:cogs
          - square: false
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: input_boolean.auto_lighting
                card_layout: hki_tile
                icon: mdi:auto-fix
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  icon:
                    'y': 12
                hki_popup:
                  hide_bottom_bar: true
                  hide_top_bar: true
                  show_close_button: true
                  close_on_action: false
              - type: custom:hki-button-card
                entity: group.adaptive_lighting
                card_layout: hki_tile
                name: Adaptive Lighting
                icon: mdi:google-circles-communities
                show_icon_badge: false
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  icon:
                    'y': 12
            columns: 2
      - type: grid
        cards:
          - type: heading
            heading: Lights
            heading_style: subtitle
            icon: mdi:lightbulb
            badges:
              - type: custom:hki-button-card
                entity: light.lights_woonkamer
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.woonkamer_voor
                icon: hue:bulb-spot-hung
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  name:
                    x: -10
                    'y': 17
                hki_popup:
                  close_animation: swing
              - type: custom:hki-button-card
                entity: light.woonkamer_achter
                icon: hue:bulb-spot-hung
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.tv_meubel_leds
                name: TV LEDs
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.rgbcw_light_strip
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.gordijnen_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.dressoir_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.bar_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.led_standing_lamp
                icon: phu:nanoleaf-floorlamp
                name: Standing LEDs
                hold_action:
                  action: none
                tap_action:
                  action: hki-more-info
                show_brightness: false
                show_info_display: false
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  name:
                    'y': 13
                custom_popup:
                  enabled: true
                  card:
                    type: vertical-stack
                    cards:
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_on
                            icon: mdi:power-on
                            name: 'ON'
                            tap_action:
                              action: call-service
                              service: light.turn_on
                              service_data:
                                entity_id: light.led_standing_lamp
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_off
                            icon: mdi:power-off
                            name: 'OFF'
                            tap_action:
                              action: call-service
                              service: light.turn_off
                              service_data:
                                entity_id: light.led_standing_lamp
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_auto
                            icon: mdi:lightbulb-auto
                            name: AUTO
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_auto
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_brightness_up
                            icon: mdi:weather-sunny
                            name: Brightness
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_brightness_up
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_speed_up
                            icon: mdi:rabbit
                            name: Speed
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_speed_up
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_preset_up
                            icon: mdi:menu-up
                            name: Preset
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_preset_up
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_brightness_down
                            icon: mdi:weather-night
                            name: Brightness
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_brightness_down
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_speed_down
                            icon: mdi:tortoise
                            name: Speed
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_speed_down
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_preset_down
                            icon: mdi:menu-down
                            name: Preset
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_preset_down
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_red
                            icon: mdi:alpha-r-box
                            name: RED
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_red
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_green
                            icon: mdi:alpha-g-box
                            name: GREEN
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_green
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_blue
                            icon: mdi:alpha-b-box
                            name: BLUE
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_blue
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_white
                            icon: mdi:alpha-w-box
                            name: WHITE
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_white
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_1
                            icon: mdi:music-note
                            name: Music 1
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_2
                            icon: mdi:music-circle
                            name: Music 2
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_2
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_3
                            icon: mdi:music-box
                            name: Music 3
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_3
        column_span: 1
      - type: grid
        cards:
          - type: custom:hki-navigation-card
            position: bottom-right
            offset_x: 12
            offset_y: 20
            button_size: 50
            gap: 12
            vertical_gap: 12
            z_index: 5
            base:
              button:
                id: 4e8c1d57-1c4c-48cb-83a0-447264197745
                icon: mdi:home
                tooltip: Home
                label: ''
                entity: input_boolean.kiosk_mode
                button_type: icon
                background: ''
                background_opacity: ''
                icon_color: ''
                label_style: {}
                pill_width: ''
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/home
                hold_action:
                  action: none
                double_tap_action:
                  action: toggle
            horizontal:
              enabled: true
              columns: 6
              buttons:
                - id: e1b058dd-45fb-4395-b48a-75dbfb98c0e8
                  icon: mdi:floor-plan
                  tooltip: ''
                  label: Rooms
                  entity: ''
                  button_type: ''
                  background: ''
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
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
                  label: ''
                  entity: ''
                  button_type: icon
                  background: DarkOrange
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
                  tap_action:
                    action: back
                    navigation_path: /lovelace/rooms
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
                  entity: ''
                  button_type: pill
                  background: ''
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
                  tap_action:
                    action: navigate
                    navigation_path: /config
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
            default_background: ''
            default_button_opacity: 1
            default_icon_color: ''
            button_box_shadow: 0 8px 24px rgba(0, 0, 0, 0.35)
            button_box_shadow_hover: 0 10px 30px rgba(0, 0, 0, 0.42)
            default_button_type: icon
            label_style:
              font_size: 12
              font_weight: 600
              letter_spacing: 0
              text_transform: none
              color: ''
              background: ''
              background_opacity: 0.72
              padding_x: 10
              padding_y: 6
              border_radius: 999
              backdrop_blur: 8
              max_width: 220
            pill_width: 0
            center_spread: false
            offset_x_mobile: null
            offset_x_tablet: null
            offset_x_desktop: null
            bottom_bar_enabled: false
            bottom_bar_height: 85
            bottom_bar_color: rgb(var(--rgb-card-background-color, 0,0,0))
            bottom_bar_opacity: 0.85
            bottom_bar_full_width: false
            bottom_bar_border_radius: 0
            bottom_bar_box_shadow: ''
            bottom_bar_bottom_offset: 0
            bottom_bar_margin_left: 0
            bottom_bar_margin_right: 0
            bottom_bar_border_width: 0
            bottom_bar_border_style: solid
            bottom_bar_border_color: ''
    badges: []
    type: sections
    max_columns: 10
    cards: []
    icon: mdi:sofa
    subview: true
    path: living-room
```
