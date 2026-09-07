# Parcel

Package/parcel tracking. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Parcel
    path: parcel
    icon: phu:postnl
    subview: true
    sections:
      - type: grid
        cards:
          - entity: sensor.postnl_delivery
            distribution_entity: sensor.postnl_distribution
            title: Jimmy
            days_back: 180
            show_delivered: true
            show_sent: true
            show_animation: true
            show_header: true
            show_placeholder: true
            logo_path: /local/images/postnl/postnl-logo.png
            van_path: /local/images/postnl/postnl-van.gif
            placeholder_image: /local/images/postnl/postnl-banner.jpg
            header_color: '#d0640b'
            header_text_color: '#ffffff'
            layout_order:
              - header
              - animation
              - tabs
              - list
            type: custom:hki-postnl-card
      - type: grid
        cards:
          - entity: sensor.postnl_delivery_2
            distribution_entity: sensor.postnl_distribution_2
            title: Stephanie
            days_back: 180
            show_delivered: true
            show_sent: true
            show_animation: true
            show_header: true
            show_placeholder: true
            logo_path: /local/images/postnl/postnl-logo.png
            van_path: /local/images/postnl/postnl-van.gif
            placeholder_image: /local/images/postnl/postnl-banner.jpg
            header_color: '#d0640b'
            header_text_color: '#ffffff'
            layout_order:
              - header
              - animation
              - tabs
              - list
            type: custom:hki-postnl-card
          - type: custom:hki-parcels-card
            title: Parcels
            days_back: 161
            show_delivered: true
            show_sent: true
            show_letters: true
            show_animation: true
            show_header: true
            show_placeholder: true
            header_color: ''
            header_text_color: ''
            placeholder_image: >-
              https://github.com/jonisnet/hki-parcels-card/blob/main/images/shared/dutch-parcels-2.png?raw=true
            carriers:
              - type: postnl_v4
                name: PostNL
                icon: phu:postnl
                color: '#ed8c00'
                schema: canonical
                logo_path: ''
                van_path: ''
                banner_path: ''
                user: s_vanduuren5_hotmail_nl
                entity_incoming: sensor.postnl_s_vanduuren5_hotmail_nl_incoming_parcels
                entity_delivered: sensor.postnl_s_vanduuren5_hotmail_nl_delivered_parcels
                entity_outgoing: sensor.postnl_s_vanduuren5_hotmail_nl_outgoing_parcels
                entity_outgoing_delivered: >-
                  sensor.postnl_s_vanduuren5_hotmail_nl_outgoing_delivered_parcels
                entity_letters: sensor.postnl_s_vanduuren5_hotmail_nl_letters
              - type: postnl_v4
                name: PostNL
                icon: phu:postnl
                color: '#ed8c00'
                schema: canonical
                logo_path: ''
                van_path: ''
                banner_path: ''
                user: jimzz_outlook_com
                entity_incoming: sensor.postnl_jimzz_outlook_com_incoming_parcels
                entity_delivered: sensor.postnl_jimzz_outlook_com_delivered_parcels
                entity_outgoing: sensor.postnl_jimzz_outlook_com_outgoing_parcels
                entity_outgoing_delivered: sensor.postnl_jimzz_outlook_com_outgoing_delivered_parcels
                entity_letters: sensor.postnl_jimzz_outlook_com_letters
              - type: dhl
                name: DHL
                icon: phu:dhl
                color: '#ffcc00'
                schema: canonical
                logo_path: ''
                van_path: ''
                banner_path: ''
                user: jimz_live_nl
                entity_incoming: sensor.dhl_jimz_live_nl_incoming_parcels
                entity_delivered: sensor.dhl_jimz_live_nl_delivered_parcels
                entity_outgoing: sensor.dhl_jimz_live_nl_outgoing_parcels
                entity_outgoing_delivered: sensor.dhl_jimz_live_nl_outgoing_delivered_parcels
                entity_letters: ''
              - type: dpd
                name: DPD
                icon: phu:dpd
                color: '#dc0032'
                schema: canonical
                logo_path: ''
                van_path: ''
                banner_path: ''
                user: jimmyjimz011_gmail_com
                entity_incoming: sensor.dpd_jimmyjimz011_gmail_com_incoming_parcels
                entity_delivered: sensor.dpd_jimmyjimz011_gmail_com_delivered_parcels
                entity_outgoing: sensor.dpd_jimmyjimz011_gmail_com_outgoing_parcels
                entity_outgoing_delivered: sensor.dpd_jimmyjimz011_gmail_com_outgoing_delivered_parcels
                entity_letters: ''
            show_tracking_link: true
            layout_order:
              - header
              - animation
              - tabs
              - list
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
        title: Parcel
        subtitle: Send & Delivery
        background: >-
          https://www.myparcel.nl/app/uploads/MyContracts-landingspagina-1-768x420-690x0-c-default.png
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
    badges:
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.postnl_delivery
        show_entity_picture: false
        icon: phu:postnl
        name: Jimmy
        tap_action:
          action: none
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.postnl_delivery_2
        show_entity_picture: false
        icon: phu:postnl
        tap_action:
          action: none
        name: Stephanie
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: sensor.dhl_pakketten
        show_entity_picture: false
        icon: phu:dhl
        tap_action:
          action: none
        name: DHL
        state_content: state
```
