# Security

Camera feeds and security-related entities. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Security
    path: security
    icon: mdi:cctv
    sections:
      - type: grid
        cards:
          - type: heading
            icon: mdi:cctv
            heading: Camera's
            heading_style: subtitle
          - type: custom:webrtc-camera
            ui: true
            poster: /local/images/loading-screen-2.gif
            muted: true
            streams:
              - url: voordeur_hd
                name: HD
              - url: voordeur_md
                name: MD
              - url: voordeur_sd
                name: SD
            shortcuts:
              - name: Record
                icon: mdi:record-circle-outline
                service: switch.toggle
                service_data:
                  entity_id: switch.deurbel_voor_privacy_mode
          - type: custom:webrtc-camera
            ui: true
            poster: /local/images/loading-screen-2.gif
            muted: true
            streams:
              - url: poort_hd
                name: HD
              - url: poort_md
                name: MD
              - url: poort_sd
                name: SD
            shortcuts:
              - name: Record
                icon: mdi:record-circle-outline
                service: switch.toggle
                service_data:
                  entity_id: switch.deurbel_achter_privacy_mode
          - type: custom:webrtc-camera
            ui: true
            poster: /local/images/loading-screen-2.gif
            muted: true
            streams:
              - url: garage_hd
                name: HD
              - url: garage_md
                name: MD
              - url: garage_sd
                name: SD
            shortcuts:
              - name: Record
                icon: mdi:record-circle-outline
                service: switch.toggle
                service_data:
                  entity_id: switch.garage_privacy_mode
          - type: custom:webrtc-camera
            ui: true
            poster: /local/images/loading-screen-2.gif
            muted: true
            streams:
              - url: tuin_achter_hd
                name: HD
              - url: tuin_achter_md
                name: MD
              - url: tuin_achter_sd
                name: SD
            shortcuts:
              - name: Record
                icon: mdi:record-circle-outline
                service: switch.toggle
                service_data:
                  entity_id: switch.tuin_achter_privacy_mode
          - type: custom:webrtc-camera
            ui: true
            poster: /local/images/loading-screen-2.gif
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
        column_span: 4
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
    header:
      card:
        type: custom:hki-header-card
        title: Security
        subtitle: Dashboard
        background: https://ui.com/microsite/static/media/poster.569b29b5.jpg
        min_height: 215
        max_height: 270
        title_offset_y: 65
        subtitle_offset_y: 70
        badges_gap: 30
        badges_fixed: true
        top_bar_offset_y: 15
        top_bar_padding_x: 0
        top_bar_left: custom
        top_bar_right: weather
        top_bar_left_card:
          type: custom:hki-notification-card
          use_header_styling: true
          show_background: false
          show_empty: true
          display_mode: ticker
          animation: bounce
          direction: right
          time_format: '24'
          entity: sensor.hki_notify_main
        info_pill: true
        top_bar_left_offset_x: 0
        top_bar_right_weather_icon_color_mode: state
        top_bar_right_animate_icon: float
        top_bar_right_tap_action:
          action: more-info
          entity: weather.buienradar
        top_bar_right_weather_entity: weather.openweathermap
        top_bar_right_show_humidity: false
        top_bar_right_show_wind: false
        top_bar_right_show_pressure: false
      layout: center
      badges_position: bottom
      badges_wrap: wrap
```
