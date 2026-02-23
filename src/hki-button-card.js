// HKI Button Card

(function() {
  const { LitElement, html, css } = window.HKI.getLit();
  const CARD_TYPE = "hki-button-card";
  const EDITOR_TAG = "hki-button-card-editor";

  // hvac_mode colors (what mode the thermostat is set to)
  const HVAC_COLORS = {
    heat: "darkorange", cool: "#1E90FF", heat_cool: "#4CAF50", auto: "#4CAF50",
    dry: "#FFC107", fan_only: "#9E9E9E", off: "#424242",
    // hvac_action colors (what the device is actually doing right now)
    idle: "#4CAF50", heating: "darkorange", cooling: "#1E90FF", fan: "#9E9E9E",
  };
  const HVAC_ICONS = {
    heat: "mdi:fire", cool: "mdi:snowflake", heat_cool: "mdi:autorenew", auto: "mdi:autorenew",
    dry: "mdi:water-percent", fan_only: "mdi:fan", off: "mdi:power"
  };

  // Template caching helpers
  function hashStr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
    return (h >>> 0).toString(16);
  }

  function cacheKey(raw, vars) {
    return `hkiTpl:${hashStr(raw + (vars ? JSON.stringify(vars) : ""))}`;
  }

  const COLOR_PRESETS = [
    { name: "Warm White", temp: 2700, color: "#FFE4B5" },
    { name: "Soft White", temp: 3000, color: "#FFECD2" },
    { name: "Neutral", temp: 4000, color: "#FFF5E6" },
    { name: "Cool White", temp: 5000, color: "#F5F5FF" },
    { name: "Daylight", temp: 6500, color: "#E8F0FF" },
    { name: "Red", rgb: [255, 0, 0], color: "#FF0000" },
    { name: "Orange", rgb: [255, 165, 0], color: "#FFA500" },
    { name: "Yellow", rgb: [255, 255, 0], color: "#FFFF00" },
    { name: "Green", rgb: [0, 255, 0], color: "#00FF00" },
    { name: "Cyan", rgb: [0, 255, 255], color: "#00FFFF" },
    { name: "Blue", rgb: [0, 0, 255], color: "#0000FF" },
    { name: "Purple", rgb: [128, 0, 128], color: "#800080" },
    { name: "Pink", rgb: [255, 105, 180], color: "#FF69B4" },
  ];

  // Convert HSV (H:0-360, S:0-100, V:0-100) to RGB array [r,g,b]
  const _hsvToRgb = (h, sPct, vPct = 100) => {
    const H = ((Number(h) % 360) + 360) % 360;
    const S = Math.max(0, Math.min(100, Number(sPct))) / 100;
    const V = Math.max(0, Math.min(100, Number(vPct))) / 100;

    const C = V * S;
    const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = V - C;

    let r = 0, g = 0, b = 0;
    if (H < 60) { r = C; g = X; b = 0; }
    else if (H < 120) { r = X; g = C; b = 0; }
    else if (H < 180) { r = 0; g = C; b = X; }
    else if (H < 240) { r = 0; g = X; b = C; }
    else if (H < 300) { r = X; g = 0; b = C; }
    else { r = C; g = 0; b = X; }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  };

  // Local favorites storage (per-entity)
  const __hkiFavKey = (entityId) => `hki_button_card_favorites::${entityId}`;
  const __hkiSeedFavorites = () => COLOR_PRESETS.map((p, i) => {
    const out = { id: `seed_${i}`, name: p.name, color: p.color };
    if (p.temp) {
      out.type = 'temp';
      out.kelvin = p.temp;
      out.color_temp = Math.round(1000000 / p.temp);
    } else if (p.rgb) {
      out.type = 'rgb';
      out.rgb_color = p.rgb;
    }

    return out;
  });


  // Ensure popup animation keyframes are injected once (shared across HKI cards)
  window.HKI?.ensurePopupAnimations?.();

  // Prevent background page scroll when any popup is open
    // Scroll locking is shared across HKI cards (implemented in _bundle-header.js)
  const __hkiLockScroll = () => window.HKI?.lockScroll?.();
  const __hkiUnlockScroll = () => window.HKI?.unlockScroll?.();

  



class HkiButtonCard extends LitElement {
    
    static getConfigElement() {
      // Guard: if editor failed to register for any reason, fall back to a minimal element.
      if (!customElements.get(EDITOR_TAG)) {
        const el = document.createElement("div");
        el.innerHTML = "HKI Button Card editor failed to load. Check browser console for errors.";
        return el;
      }
      return document.createElement(EDITOR_TAG);
    }

    static getStubConfig() {
      return {};
    }

    // ─── CONFIG FORMAT: FLAT (internal) ↔ NESTED (user YAML) ─────────────────
    // Each entry: [flatKey, ...nestedPathSegments]
    static _CONFIG_MAP = [
      // styles.card
      ['card_color',            'styles','card','color'],
      ['card_opacity',          'styles','card','opacity'],
      ['border_radius',         'styles','card','border_radius'],
      ['box_shadow',            'styles','card','box_shadow'],
      ['border_width',          'styles','card','border_width'],
      ['border_style',          'styles','card','border_style'],
      ['border_color',          'styles','card','border_color'],
      // styles.icon
      ['icon_color',            'styles','icon','color'],
      ['size_icon',             'styles','icon','size'],
      ['icon_circle_bg',        'styles','icon','circle','bg'],
      ['icon_circle_border_style','styles','icon','circle','border_style'],
      ['icon_circle_border_color','styles','icon','circle','border_color'],
      ['icon_circle_border_width','styles','icon','circle','border_width'],
      // styles.typography.name
      ['name_color',            'styles','typography','name','color'],
      ['name_font_family',      'styles','typography','name','font_family'],
      ['name_font_custom',      'styles','typography','name','font_custom'],
      ['name_font_weight',      'styles','typography','name','weight'],
      ['size_name',             'styles','typography','name','size'],
      ['name_text_align',       'styles','typography','name','text_align'],
      // styles.typography.state
      ['state_color',           'styles','typography','state','color'],
      ['state_font_family',     'styles','typography','state','font_family'],
      ['state_font_custom',     'styles','typography','state','font_custom'],
      ['state_font_weight',     'styles','typography','state','weight'],
      ['size_state',            'styles','typography','state','size'],
      ['state_text_align',      'styles','typography','state','text_align'],
      // styles.typography.label
      ['label_color',           'styles','typography','label','color'],
      ['label_font_family',     'styles','typography','label','font_family'],
      ['label_font_custom',     'styles','typography','label','font_custom'],
      ['label_font_weight',     'styles','typography','label','weight'],
      ['size_label',            'styles','typography','label','size'],
      ['label_text_align',      'styles','typography','label','text_align'],
      // styles.typography.info_display (formerly brightness_*)
      ['brightness_color',      'styles','typography','info_display','color'],
      ['brightness_color_on',   'styles','typography','info_display','color_on'],
      ['brightness_color_off',  'styles','typography','info_display','color_off'],
      ['brightness_font_family','styles','typography','info_display','font_family'],
      ['brightness_font_custom','styles','typography','info_display','font_custom'],
      ['brightness_font_weight','styles','typography','info_display','weight'],
      ['size_brightness',       'styles','typography','info_display','size'],
      ['brightness_text_align', 'styles','typography','info_display','text_align'],
      // offsets
      ['name_offset_x',         'offsets','name','x'],
      ['name_offset_y',         'offsets','name','y'],
      ['state_offset_x',        'offsets','state','x'],
      ['state_offset_y',        'offsets','state','y'],
      ['label_offset_x',        'offsets','label','x'],
      ['label_offset_y',        'offsets','label','y'],
      ['icon_offset_x',         'offsets','icon','x'],
      ['icon_offset_y',         'offsets','icon','y'],
      ['icon_circle_offset_x',  'offsets','icon_circle','x'],
      ['icon_circle_offset_y',  'offsets','icon_circle','y'],
      ['icon_badge_offset_x',   'offsets','icon_badge','x'],
      ['icon_badge_offset_y',   'offsets','icon_badge','y'],
      ['brightness_offset_x',   'offsets','info_display','x'],
      ['brightness_offset_y',   'offsets','info_display','y'],
      ['temp_badge_offset_x',   'offsets','temp_badge','x'],
      ['temp_badge_offset_y',   'offsets','temp_badge','y'],
      ['badge_offset_x',        'offsets','badge_card','x'],
      ['badge_offset_y',        'offsets','badge_card','y'],
      // badge card styling (badge layout outer appearance)
      ['badge_bg',              'styles','badge_card','bg'],
      ['badge_border_style',    'styles','badge_card','border_style'],
      ['badge_border_width',    'styles','badge_card','border_width'],
      ['badge_border_color',    'styles','badge_card','border_color'],
      ['badge_border_radius',   'styles','badge_card','border_radius'],
      ['badge_box_shadow',      'styles','badge_card','box_shadow'],
      ['badge_circle',          'styles','badge_card','circle'],
      ['badge_font_family',     'styles','badge_card','font_family'],
      ['badge_font_weight',     'styles','badge_card','font_weight'],
      ['badge_size',            'styles','badge_card','size'],
      ['size_badge',            'styles','badge_card','font_size'],
      // temp_badge styling
      ['temp_badge_border_color', 'styles','temp_badge','border_color'],
      ['temp_badge_border_radius','styles','temp_badge','border_radius'],
      ['temp_badge_border_style', 'styles','temp_badge','border_style'],
      ['temp_badge_border_width', 'styles','temp_badge','border_width'],
      ['temp_badge_box_shadow',   'styles','temp_badge','box_shadow'],
      ['temp_badge_font_custom',  'styles','temp_badge','font_custom'],
      ['temp_badge_font_family',  'styles','temp_badge','font_family'],
      ['temp_badge_font_weight',  'styles','temp_badge','font_weight'],
      ['temp_badge_size',         'styles','temp_badge','size'],
      ['temp_badge_text_color',   'styles','temp_badge','text_color'],
      ['size_temp_badge',         'styles','temp_badge','font_size'],
      // tile styling
      ['tile_height',             'styles','tile','height'],
      ['tile_slider_fill_color',  'styles','tile','slider_fill_color'],
      ['tile_slider_track_color', 'styles','tile','slider_track_color'],
      ['show_tile_slider',        'styles','tile','show_slider'],
      // climate
      ['climate_current_temperature_entity','climate','current_temperature_entity'],
      ['climate_humidity_entity',   'climate','humidity_entity'],
      ['climate_humidity_name',     'climate','humidity_name'],
      ['climate_pressure_entity',   'climate','pressure_entity'],
      ['climate_pressure_name',     'climate','pressure_name'],
      ['climate_show_gradient',     'climate','show_gradient'],
      ['climate_show_plus_minus',   'climate','show_plus_minus'],
      ['climate_temp_step',         'climate','temp_step'],
      ['climate_temperature_name',  'climate','temperature_name'],
      ['climate_use_circular_slider','climate','use_circular_slider'],
      ['climate_show_target_range',  'climate','show_target_range'],
      // humidifier
      ['humidifier_use_circular_slider','humidifier','use_circular_slider'],
      ['humidifier_show_plus_minus',    'humidifier','show_plus_minus'],
      ['humidifier_fan_entity',         'humidifier','fan_entity'],
      ['humidifier_show_gradient',      'humidifier','show_gradient'],
      ['humidifier_humidity_step',      'humidifier','humidity_step'],
      // hki_popup
      ['popup_border_radius',       'hki_popup','border_radius'],
      ['popup_button_bg',           'hki_popup','button','bg'],
      ['popup_button_border_color', 'hki_popup','button','border_color'],
      ['popup_button_border_style', 'hki_popup','button','border_style'],
      ['popup_button_border_width', 'hki_popup','button','border_width'],
      ['popup_button_opacity',      'hki_popup','button','opacity'],
      ['popup_button_radius',       'hki_popup','button','radius'],
      ['popup_button_text_color',   'hki_popup','button','text_color'],
      ['popup_hide_button_text',    'hki_popup','hide_button_text'],
      ['popup_highlight_border_color','hki_popup','highlight','border_color'],
      ['popup_highlight_border_style','hki_popup','highlight','border_style'],
      ['popup_highlight_border_width','hki_popup','highlight','border_width'],
      ['popup_highlight_box_shadow','hki_popup','highlight','box_shadow'],
      ['popup_highlight_color',     'hki_popup','highlight','color'],
      ['popup_highlight_opacity',   'hki_popup','highlight','opacity'],
      ['popup_highlight_radius',    'hki_popup','highlight','radius'],
      ['popup_highlight_text_color','hki_popup','highlight','text_color'],
      ['popup_label_font_size',     'hki_popup','label','font_size'],
      ['popup_label_font_weight',   'hki_popup','label','font_weight'],
      ['popup_show_effects',        'hki_popup','show_effects'],
      ['popup_show_favorites',      'hki_popup','show_favorites'],
      ['popup_show_presets',        'hki_popup','show_presets'],
      ['popup_slider_radius',       'hki_popup','slider_radius'],
      ['popup_time_format',         'hki_popup','time_format'],
      ['popup_value_font_size',     'hki_popup','value','font_size'],
      ['popup_value_font_weight',   'hki_popup','value','font_weight'],
      ['popup_blur_enabled',        'hki_popup','blur_enabled'],
      ['popup_blur_amount',         'hki_popup','blur_amount'],
      ['popup_border_radius',       'hki_popup','border_radius'],
      ['popup_width',               'hki_popup','width'],
      ['popup_height',              'hki_popup','height'],
      ['popup_width_custom',        'hki_popup','width_custom'],
      ['popup_height_custom',       'hki_popup','height_custom'],
      ['popup_card_blur_enabled',   'hki_popup','card_blur_enabled'],
      ['popup_card_blur_amount',    'hki_popup','card_blur_amount'],
      ['popup_card_opacity',        'hki_popup','card_opacity'],
      ['popup_default_view',        'hki_popup','default_view'],
      ['popup_default_section',     'hki_popup','default_section'],
      ['popup_open_animation',      'hki_popup','open_animation'],
      ['popup_close_animation',     'hki_popup','close_animation'],
      ['popup_animation_duration',  'hki_popup','animation_duration'],
      // custom popup
      ['custom_popup_enabled',      'custom_popup','enabled'],
      ['custom_popup_card',         'custom_popup','card'],
      // lock
      ['lock_contact_sensor_entity','lock','contact_sensor_entity'],
      ['lock_contact_sensor_label', 'lock','contact_sensor_label'],
    ];

    // All valid non-mapped root-level keys. Anything else (old/obsolete) gets stripped.
    static VALID_ROOT_KEYS = new Set([
      // Identity
      'type', 'entity', 'icon', 'card_layout',
      // Content
      'name', 'state_label', 'label', 'info_display',
      'use_entity_picture', 'entity_picture', 'entity_picture_override',
      // Actions
      'tap_action', 'hold_action', 'double_tap_action',
      'icon_tap_action', 'icon_hold_action', 'icon_double_tap_action',
      // Visibility
      'show_name', 'show_state', 'show_label', 'show_brightness',
      'show_info_display', 'show_icon', 'show_icon_circle', 'show_icon_badge',
      'show_temp_badge', 'show_tile_slider',
      'show_scenes_button', 'show_individual_button', 'show_effects_button',
      'show_popup_scenes', 'show_popup_effects',
      // Misc card settings
      'bar_border_radius', 'dynamic_bar_color',
      'icon_animation', 'icon_align', 'enable_icon_animation',
      // Custom popup
      'custom_popup',
      // Layout / canvas
      'element_order', 'element_grid', 'grid_rows', 'grid_columns',
      'use_canvas_layout', 'canvas_layout',
      'grid_cell_padding_px', 'grid_inset_percent', 'text_line_gap_px',
    ]);

    static _getNestedValue(obj, path) {
      let cur = obj;
      for (const key of path) {
        if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
        cur = cur[key];
      }
      return cur;
    }

    static _setNestedValue(obj, path, value) {
      let cur = obj;
      for (let i = 0; i < path.length - 1; i++) {
        if (typeof cur[path[i]] !== 'object' || cur[path[i]] === null) cur[path[i]] = {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
    }

    // Normalize any config format (old flat OR new nested) → flat internal keys.
    // Also strips obsolete/unknown keys that are not in the valid set.
    static _migrateFlatConfig(config) {
      if (!config || typeof config !== 'object') return config;
      const NESTED_SECTIONS = new Set(['styles','offsets','climate','humidifier','hki_popup','lock','custom_popup']);
      const MAPPED_FLAT_KEYS = new Set(HkiButtonCard._CONFIG_MAP.map(([k]) => k));
      const flat = {};
      // 1. Copy root-level keys that are in the valid whitelist (strips obsolete flat keys)
      for (const [k, v] of Object.entries(config)) {
        if (!NESTED_SECTIONS.has(k) && HkiButtonCard.VALID_ROOT_KEYS.has(k)) flat[k] = v;
      }
      // 2. Also copy root-level keys that are valid mapped flat keys (old flat format passthrough)
      for (const [k, v] of Object.entries(config)) {
        if (!NESTED_SECTIONS.has(k) && MAPPED_FLAT_KEYS.has(k)) flat[k] = v;
      }
      // 3. Extract nested keys via the map (new nested format; wins over old flat)
      for (const [flatKey, ...path] of HkiButtonCard._CONFIG_MAP) {
        const val = HkiButtonCard._getNestedValue(config, path);
        if (val !== undefined) flat[flatKey] = val;
      }
      return flat;
    }

    // Convert flat internal config → nested YAML format for user-facing output.
    static _serializeToNested(flat) {
      if (!flat || typeof flat !== 'object') return flat;
      const MAPPED_FLAT_KEYS = new Set(HkiButtonCard._CONFIG_MAP.map(([k]) => k));
      const nested = {};
      // 1. Root-level (non-mapped) keys stay at root
      for (const [k, v] of Object.entries(flat)) {
        if (!MAPPED_FLAT_KEYS.has(k)) nested[k] = v;
      }
      // 2. Mapped keys go to their nested paths
      for (const [flatKey, ...path] of HkiButtonCard._CONFIG_MAP) {
        if (Object.prototype.hasOwnProperty.call(flat, flatKey)) {
          HkiButtonCard._setNestedValue(nested, path, flat[flatKey]);
        }
      }
      return nested;
    }

    static get properties() {
      return {
        hass: {},
        _config: { state: true },
        _popupOpen: { state: true },
        _activeView: { state: true },
        _brightness: { state: true },
        _expandedEffects: { state: true }, 
        _tempMin: { state: true },
        _tempMax: { state: true },
        _step: { state: true }
      };
    }

    constructor() {
      super();
      this._paDomainCache = {};

      // Custom Popup YAML editor state (prevents re-serializing YAML while typing)
      this._customPopupYamlDraft = null;
      this._customPopupYamlFocused = false;
      this._customPopupYamlDebounce = null;
      this._popupOpen = false;
      this._popupPortal = null;
      this._activeView = 'brightness'; // brightness, temperature, color
      this._favoritesEditMode = false;
      this._lightFavorites = null;
      this._groupMemberModes = {};
      this._switchGroupMode = false;
      this._holdTimer = null;
      this._tapTimer = null;
      this._brightness = 100;
      this._hue = 0;
      this._saturation = 0; 
      this._isDragging = false;
      this._expandedEffects = false;
      this._tempMin = 7;
      this._tempMax = 35;
      this._step = 0.5;
    
      // Stage size measurement (used for stable placement inside parent grid cards)
      this._stageW = 0;
      this._stageH = 0;
      this._stageRO = null;
      
      // Template rendering system with caching
      this._tpl = {
        timer: 0,
        name: { raw: "", sig: "", seq: 0, unsub: null },
        state: { raw: "", sig: "", seq: 0, unsub: null },
        label: { raw: "", sig: "", seq: 0, unsub: null },
        info: { raw: "", sig: "", seq: 0, unsub: null },
        icon: { raw: "", sig: "", seq: 0, unsub: null },
        // Styling templates
        cardColor: { raw: "", sig: "", seq: 0, unsub: null },
        cardOpacity: { raw: "", sig: "", seq: 0, unsub: null },
        boxShadow: { raw: "", sig: "", seq: 0, unsub: null },
        borderColor: { raw: "", sig: "", seq: 0, unsub: null },
        borderWidth: { raw: "", sig: "", seq: 0, unsub: null },
        borderStyle: { raw: "", sig: "", seq: 0, unsub: null },
        borderRadius: { raw: "", sig: "", seq: 0, unsub: null },
        iconColor: { raw: "", sig: "", seq: 0, unsub: null },
        iconCircleBg: { raw: "", sig: "", seq: 0, unsub: null },
        iconCircleBorderColor: { raw: "", sig: "", seq: 0, unsub: null },
        iconCircleBorderWidth: { raw: "", sig: "", seq: 0, unsub: null },
        iconCircleBorderStyle: { raw: "", sig: "", seq: 0, unsub: null },
        badgeBg: { raw: "", sig: "", seq: 0, unsub: null },
        badgeBorderColor: { raw: "", sig: "", seq: 0, unsub: null },
        badgeBorderWidth: { raw: "", sig: "", seq: 0, unsub: null },
        badgeBorderStyle: { raw: "", sig: "", seq: 0, unsub: null },
        nameColor: { raw: "", sig: "", seq: 0, unsub: null },
        stateColor: { raw: "", sig: "", seq: 0, unsub: null },
        labelColor: { raw: "", sig: "", seq: 0, unsub: null },
        brightnessColor: { raw: "", sig: "", seq: 0, unsub: null },
        brightnessColorOn: { raw: "", sig: "", seq: 0, unsub: null },
        brightnessColorOff: { raw: "", sig: "", seq: 0, unsub: null },
        iconAnimation: { raw: "", sig: "", seq: 0, unsub: null }
      };
      this._renderedName = '';
      this._renderedState = '';
      this._renderedLabel = '';
      this._renderedInfo = '';
      this._renderedIcon = '';
      // Styling rendered values
      this._renderedCardColor = '';
      this._renderedCardOpacity = '';
      this._renderedBoxShadow = '';
      this._renderedBorderColor = '';
      this._renderedBorderWidth = '';
      this._renderedBorderStyle = '';
      this._renderedBorderRadius = '';
      this._renderedIconColor = '';
      this._renderedIconCircleBg = '';
      this._renderedIconCircleBorderColor = '';
      this._renderedIconCircleBorderWidth = '';
      this._renderedIconCircleBorderStyle = '';
      this._renderedBadgeBg = '';
      this._renderedBadgeBorderColor = '';
      this._renderedBadgeBorderWidth = '';
      this._renderedBadgeBorderStyle = '';
      this._renderedNameColor = '';
      this._renderedStateColor = '';
      this._renderedLabelColor = '';
      this._renderedBrightnessColor = '';
      this._renderedIconAnimation = '';
      this._hassReady = false;
      
      // Tile slider throttling
      this._sliderThrottleTimer = null;
      this._sliderPendingValue = null;
    }

    setConfig(config) {
      if (!config) throw new Error("Config is required");
      // Normalize: accept both old flat format and new nested YAML format.
      const flatConfig = HkiButtonCard._migrateFlatConfig(config);
            this._config = {
        show_name: true,
        show_state: true,
        show_info_display: true,
        show_brightness: true,
        show_scenes_button: true,
        show_individual_button: true,
        show_effects_button: true,
        show_popup_scenes: true,
        show_popup_effects: true,
        // Default actions
        tap_action: { action: 'toggle' },
        hold_action: { action: 'hki-more-info' },
        bar_border_radius: 40,
        dynamic_bar_color: true,
        popup_slider_radius: 12,
        popup_value_font_size: 36,
        popup_value_font_weight: 300,
        popup_label_font_size: 16,
        popup_label_font_weight: 400,
        popup_time_format: 'auto',
        // Default styling offsets/sizes (not written to YAML by editor unless user changes)
        brightness_font_weight: 'bold',
        name_offset_x: -10,
        state_offset_x: -10,
        label_offset_x: -10,
        icon_offset_x: -10,
        brightness_offset_x: 10,
        brightness_offset_y: 10,
        temp_badge_offset_x: 10,
        temp_badge_offset_y: -10,
        icon_offset_y: -4,
        label_offset_y: 11,
        state_offset_y: 10,
        name_offset_y: 17,
        name_font_weight: 'bold',
        state_font_weight: 'bold',
        size_name: 13,
        size_state: 12,
        size_label: -2,
        size_brightness: 12,
        size_icon: 30,
        temp_badge_size: 40,
        ...flatConfig,
      };
      // Use the flat (migrated) config for user-override checks below
      const __layout = (this._config.card_layout || 'square');
      const cfg = flatConfig;
      const __rawOffsetFields = [
        'name_offset_x','name_offset_y',
        'state_offset_x','state_offset_y',
        'label_offset_x','label_offset_y',
        'icon_offset_x','icon_offset_y',
        'icon_badge_offset_x','icon_badge_offset_y',
        'brightness_offset_x','brightness_offset_y',
        'temp_badge_offset_x','temp_badge_offset_y',
      ];

      if (__layout === 'badge') {
        // Badge default icon size should be smaller (HA-like)
        if (!Object.prototype.hasOwnProperty.call(cfg, 'size_icon')) this._config.size_icon = 20;

        // Badge defaults: match Home Assistant badge outline
        // Apply only when the user didn't set these explicitly.
        if (!Object.prototype.hasOwnProperty.call(cfg, 'badge_border_width')) this._config.badge_border_width = 1;
        if (!Object.prototype.hasOwnProperty.call(cfg, 'badge_border_style')) this._config.badge_border_style = 'solid';
        if (!Object.prototype.hasOwnProperty.call(cfg, 'badge_border_color')) this._config.badge_border_color = 'var(--divider-color)';
        // Raw offsets default to 0 (true origin)
        for (const f of __rawOffsetFields) {
          if (!Object.prototype.hasOwnProperty.call(cfg, f)) this._config[f] = 0;
        }
        // Badge does not support label/info display fields
        this._config.show_label = false;
        this._config.show_brightness = false;
        this._config.show_info_display = false;
      }


      if (__layout === 'google_default') {
        // Google Default: square-like layout with Google Home style spacing
        if (!Object.prototype.hasOwnProperty.call(cfg, 'double_tap_action')) this._config.double_tap_action = { action: "hki-more-info" };
        if (!Object.prototype.hasOwnProperty.call(cfg, 'border_radius')) this._config.border_radius = "35";

        // Typography defaults
        if (!Object.prototype.hasOwnProperty.call(cfg, 'size_name')) this._config.size_name = 14;
        if (!Object.prototype.hasOwnProperty.call(cfg, 'size_state')) this._config.size_state = 12;
        if (!Object.prototype.hasOwnProperty.call(cfg, 'state_font_weight')) this._config.state_font_weight = "normal";
        if (!Object.prototype.hasOwnProperty.call(cfg, 'name_font_weight')) this._config.name_font_weight = "bold";

        // Offsets (editor 0-point for Google Default)
        const __googleOffsetDefaults = {
          name_offset_x: 0, name_offset_y: -6,
          state_offset_x: 0, state_offset_y: -8,
          label_offset_x: 0, label_offset_y: -6,
          icon_offset_x: -10, icon_offset_y: -1,
          icon_badge_offset_x: 0, icon_badge_offset_y: 0,
          brightness_offset_x: 0, brightness_offset_y: 0,
          temp_badge_offset_x: 0, temp_badge_offset_y: 0,
        };
        for (const [k, v] of Object.entries(__googleOffsetDefaults)) {
          if (!Object.prototype.hasOwnProperty.call(cfg, k)) this._config[k] = v;
        }

        // Feature visibility: fixed off for this style
        if (!Object.prototype.hasOwnProperty.call(cfg, 'show_brightness')) this._config.show_brightness = false;
        this._config.show_icon_circle = false;
        this._config.show_icon_badge = false;
        this._config.show_info_display = false;
      }

      if (__layout === 'hki_tile') {
        // Tile default icon size
        if (!Object.prototype.hasOwnProperty.call(cfg, 'size_icon')) this._config.size_icon = 45;

        // Tile baseline offsets (editor 0-point)
        const __tileOffsetDefaults = {
          name_offset_x: 44, name_offset_y: -18,
          state_offset_x: 44, state_offset_y: -15,
          label_offset_x: 0, label_offset_y: 0,
          icon_offset_x: -17, icon_offset_y: 13,
          icon_badge_offset_x: 0, icon_badge_offset_y: 0,
          brightness_offset_x: 21, brightness_offset_y: 43,
          temp_badge_offset_x: 0, temp_badge_offset_y: 0,
        };
        for (const [k, v] of Object.entries(__tileOffsetDefaults)) {
          if (!Object.prototype.hasOwnProperty.call(cfg, k)) this._config[k] = v;
        }
        // Tile does not support label
        this._config.show_label = false;
      }
      
      // Domain-specific action defaults
      const domain = this._config.entity ? this._config.entity.split('.')[0] : '';
      if (domain === 'alarm_control_panel') {
        // Alarm entities: default tap to hki-more-info
        if (!Object.prototype.hasOwnProperty.call(cfg, 'tap_action')) {
          this._config.tap_action = { action: 'hki-more-info' };
        }
      }
      
      // Setup templates when config changes (use longer delay to debounce editor changes)
      if (this.hass) {
        this._scheduleTemplateSetup(80);
      }
      
      this.requestUpdate();
    

      // Ensure badge layout sizes to content inside HA stacks (avoids large gaps)
      this._applyHostLayoutSizing();
}

    connectedCallback() {
      super.connectedCallback();
      // Set up templates immediately when element connects (0ms = next tick)
      // This matches header card behavior for faster initial render
      if (this.hass && this._config) {
        this._scheduleTemplateSetup();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // Unsubscribe all templates
      if (this._tpl) {
        Object.keys(this._tpl).forEach(key => {
          if (key !== 'timer') {
            this._unsubscribeTemplate(key);
          }
        });
        if (this._tpl.timer) clearTimeout(this._tpl.timer);
      }
      // Disconnect stage resize observer
      if (this._stageRO) {
        try { this._stageRO.disconnect(); } catch (_) {}
        this._stageRO = null;
      }
      
      // Clear slider throttle timer
      if (this._sliderThrottleTimer) {
        clearTimeout(this._sliderThrottleTimer);
        this._sliderThrottleTimer = null;
      }

    }

    updated(changedProps) {

      // Keep host sizing in sync with layout (important for badge layout in stacks)
      this._applyHostLayoutSizing();

      // Ensure we have accurate stage dimensions for stable grid placement (especially inside parent type: grid cards).
      // We observe the ha-card (actual visible box) rather than the host element to avoid padding/overflow clipping issues.
      if (!this._stageRO && this.shadowRoot) {
        const _cardEl = this.shadowRoot.querySelector('ha-card');
        if (_cardEl && window.ResizeObserver) {
          this._stageRO = new ResizeObserver(() => {
            try {
              const r = _cardEl.getBoundingClientRect();
              const w = r.width || 0;
              const h = r.height || 0;
              if (w !== this._stageW || h !== this._stageH) {
                this._stageW = w;
                this._stageH = h;
                this.requestUpdate();
              }
            } catch (_) {}
          });
          try { this._stageRO.observe(_cardEl); } catch (_) {}
          try {
            const r0 = _cardEl.getBoundingClientRect();
            this._stageW = r0.width || 0;
            this._stageH = r0.height || 0;
          } catch (_) {}
        }
      }


      // Setup templates when hass changes
      if (changedProps.has("hass") && this.hass) {
        const nowReady = !!this.hass?.connection && typeof this.hass?.callWS === "function";
        if (nowReady && !this._hassReady) {
          // First time hass is ready - set up templates immediately (0ms)
          this._hassReady = true;
          this._scheduleTemplateSetup(0);
        } else {
          // Subsequent updates - can use default delay
          this._scheduleTemplateSetup?.();
        }
}
      
      // Logic for popup updates
      if (changedProps.has("hass")) {
        // Popup updates
        if (this._popupOpen) {
          if (this._isDragging) return;
          
          const oldHass = changedProps.get("hass");
          const trackedId = this._popupEntityId || this._config.entity;
          const oldEntity = trackedId ? oldHass?.states[trackedId] : null;
          const newEntity = trackedId ? this.hass?.states[trackedId] : null;
          
          // For locks, also check if contact sensor state has changed
          let shouldUpdate = false;
          if (this._getDomain() === 'lock' && this._config.lock_contact_sensor_entity) {
            const oldContactSensor = oldHass?.states[this._config.lock_contact_sensor_entity];
            const newContactSensor = this.hass?.states[this._config.lock_contact_sensor_entity];
            if (oldContactSensor?.state !== newContactSensor?.state) {
              shouldUpdate = true;
            }
          }
          
          
          // For switch popup group view: update if any member state/attrs changed, even if the group entity itself didn't.
          if (!shouldUpdate && this._popupType === 'switch' && this._activeView === 'group' && newEntity && Array.isArray(newEntity.attributes?.entity_id)) {
            const members = newEntity.attributes.entity_id || [];
            for (const mid of members) {
              const o = oldHass?.states?.[mid];
              const nn = this.hass?.states?.[mid];
              if ((o?.state !== nn?.state) || (JSON.stringify(o?.attributes) !== JSON.stringify(nn?.attributes))) {
                shouldUpdate = true;
                break;
              }
            }
          }
if (!shouldUpdate && oldEntity && newEntity && 
              oldEntity.state === newEntity.state &&
              JSON.stringify(oldEntity.attributes) === JSON.stringify(newEntity.attributes)) {
            return;
          }
          
          const activeEl = this._popupPortal ? this._popupPortal.querySelector(':focus') : null;
          const isDropdownFocused = activeEl && activeEl.tagName === 'SELECT';

          if (!isDropdownFocused) {
          // Custom popup: update embedded card with new hass
          if (this._popupType === 'custom') {
            // If this custom popup was opened without an entity, there is nothing to
            // diff/track in hass. Re-rendering the entire portal on every hass update
            // causes rapid rebuilds ("go crazy") and can prevent closing.
            // In that case, only forward the latest hass to the embedded card.
            if (!trackedId) {
              const cardContainer = this._popupPortal?.querySelector('#customCardContainer');
              const cardElement = cardContainer?.querySelector('*:not([style])');
              if (cardElement && cardElement.hass !== this.hass) {
                cardElement.hass = this.hass;
              }
              return;
            }

            const cardContainer = this._popupPortal?.querySelector('#customCardContainer');
            const cardElement = cardContainer?.querySelector('*:not([style])');
            if (cardElement && cardElement.hass !== this.hass) {
              cardElement.hass = this.hass;
            }
            // Still re-render to update header state/timestamp
            this._renderCustomPopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'climate') {
            this._renderClimatePopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'alarm_control_panel') {
            this._renderAlarmPopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'cover') {
            this._renderCoverPopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'humidifier') {
            this._renderHumidifierPopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'fan') {
            this._renderFanPopupPortal(newEntity);
            return;
          }
          if (this._popupType === 'switch' || this._getDomain() === 'switch' || this._getDomain() === 'input_boolean') {
            this._renderSwitchPopupPortal(newEntity);
            return;
          }
          if (this._getDomain() === 'lock') {
            this._renderLockPopupPortal(newEntity);
            return;
          }

            this._syncState();
            this._updateHeaderIcon();
            
            if (this._activeView === 'brightness') {
              this._updateBrightnessDisplay();
            } else if (this._activeView === 'temperature') {
              this._updateTemperatureDisplay();
            } else if (this._activeView === 'color') {
              this._updateColorDisplay();
            }

            // If we're in the group member list view, re-render it so per-member
            // brightness/state updates reflect immediately.
            try {
              const viewType = this._popupPortal?.querySelector('[data-view-type]')?.dataset?.viewType;
              const entityIsGroup = Array.isArray(newEntity?.attributes?.entity_id) && newEntity.attributes.entity_id.length > 0;
              if (viewType === 'individual' && entityIsGroup) {
                const content = this._popupPortal?.querySelector('.hki-light-popup-content');
                if (content) {
                  content.innerHTML = this._renderIndividualView();
                  this._setupContentHandlers(this._popupPortal);
                }
              }
            } catch (e) {}
          }
        }
      }
    }
    _isEditMode() {
      // Robust detection for Lovelace edit/preview containers (works for header badges too).
      try {
        const seen = new Set();
        const walk = (node) => {
          while (node) {
            if (seen.has(node)) break;
            seen.add(node);

            if (node.nodeType === 1) {
              const tag = (node.tagName || '').toUpperCase();
              if (
                tag === 'HUI-CARD-PREVIEW' ||
                tag === 'HUI-SECTION-PREVIEW' ||
                tag === 'HUI-VIEW-PREVIEW' ||
                tag === 'HUI-ENTITY-CARD-EDITOR' ||
                tag === 'HUI-CARD-EDITOR'
              ) return true;

              if (node.hasAttribute && (node.hasAttribute('edit-mode') || node.hasAttribute('data-edit-mode') || node.getAttribute('mode') === 'edit')) {
                return true;
              }
            }

            // Walk up through light DOM
            if (node.parentNode) {
              node = node.parentNode;
              continue;
            }

            // Walk up through shadow DOM
            const root = node.getRootNode && node.getRootNode();
            node = root && root.host ? root.host : null;
          }
          return false;
        };

        if (walk(this)) return true;

        // URL fallback
        const p = window?.location?.pathname || '';
        if (p.includes('/config/') || (p.includes('/lovelace/') && p.includes('edit'))) return true;
      } catch (e) {}
      return false;
    }



    /* --- HELPER METHODS --- */


    _applyHostLayoutSizing() {
      try {
        const layout = (this._config?.card_layout || 'square');
        // In HA stacks (e.g. horizontal-stack), children are flex: 1 by default, which makes
        // "badge" layout leave large gaps. Force the host itself to size to content for badges.
        if (layout === 'badge') {
          this.style.setProperty('flex', '0 0 auto', 'important');
          this.style.setProperty('width', 'fit-content');
          this.style.setProperty('max-width', '100%');
          // Avoid unintended stretching from min-width constraints
          this.style.setProperty('min-width', '0');
        } else {
          // Reset so other layouts behave normally
          this.style.removeProperty('flex');
          this.style.removeProperty('width');
          this.style.removeProperty('max-width');
          this.style.removeProperty('min-width');
        }
      } catch (_) {}
    }


    _getTempGradient() {
      return 'linear-gradient(to top, #00D9FF 0%, #00E5A0 25%, #DFFF00 50%, #FFB800 75%, #FF8C00 100%)';
    }

    _getTempStep() {
      // Prefer an explicit configured step. If none is set, use HKI default 0.5
      // (do NOT fall back to entity target_temp_step, because many entities expose 0.1
      // while HKI's intended default/UX is 0.5 unless configured otherwise).
      const raw = this._config?.climate_temp_step;
      if (raw === undefined || raw === null || raw === "") return 0.5;
      const step = Number(raw);
      return (Number.isFinite(step) && step > 0) ? step : 0.5;
    }

    _clampTemp(value) {
      // Keep values inside entity min/max, with a small rounding to avoid floating errors
      return Math.max(this._tempMin, Math.min(this._tempMax, Math.round(Number(value) * 10) / 10));
    }

    _roundToStep(value, step) {
      const s = Number(step);
      if (!Number.isFinite(s) || s <= 0) return Number(value);
      const v = Number(value);
      const rounded = Math.round(v / s) * s;
      // limit precision to avoid 20.0000000004 style artifacts
      return Math.round(rounded * 1000) / 1000;
    }

    _getTempPercentage(value) {
      return ((value - this._tempMin) / (this._tempMax - this._tempMin)) * 100;
    }

    _updateCircularSliderUI(portal, value, unit) {
      const percentage = this._getTempPercentage(value);
      const maxArcLength = 628.32 * 0.75;
      const arcLength = (percentage / 100) * maxArcLength;
      const startAngle = 135 * (Math.PI / 180);
      const arcAngle = (percentage / 100) * 270 * (Math.PI / 180);
      const totalAngle = startAngle + arcAngle;
      const thumbX = 140 + 100 * Math.cos(totalAngle);
      const thumbY = 140 + 100 * Math.sin(totalAngle);
      const valueSize = this._config.popup_value_font_size || 64;
      
      const progress = portal.querySelector('#circularProgress');
      const thumb = portal.querySelector('#circularThumb');
      const valueDisplay = portal.querySelector('#circularTempValue');
      
      if (progress) progress.setAttribute('stroke-dasharray', `${arcLength} 628.32`);
      if (thumb) {
        thumb.setAttribute('cx', thumbX);
        thumb.setAttribute('cy', thumbY);
      }
      if (valueDisplay) valueDisplay.innerHTML = `${value}<span style="font-size: ${valueSize / 2}px;">${unit}</span>`;
    }

    /* --- POPUP DISPLAY UPDATES --- */
    _updateBrightnessDisplay() {
      if (!this._popupPortal) return;
      const brightness = this._getBrightness();
      const fill = this._popupPortal.querySelector('.vertical-slider-fill');
      const thumb = this._popupPortal.querySelector('.vertical-slider-thumb');
      const valueDisplay = this._popupPortal.querySelector('.value-display');
      
      if (fill) {
        fill.style.height = brightness + '%';
        if (this._config.dynamic_bar_color) {
          const color = this._getCurrentColor();
          fill.style.background = color;
        }
      }
      // Clamp thumb position so it stays visible at 0% and 100%
      const thumbPos = brightness <= 0 ? '0px' : brightness >= 100 ? 'calc(100% - 6px)' : 'calc(' + brightness + '% - 6px)';
      if (thumb) thumb.style.bottom = thumbPos;
      if (valueDisplay) valueDisplay.innerHTML = brightness + '<span>%</span>';
    }

    _updateTemperatureDisplay() {
      if (!this._popupPortal) return;
      const entity = this._getEntity();
      if (this._getDomain() === 'climate') { this._renderClimatePopupPortal(entity); return; }
      if (!entity || !entity.attributes.color_temp) return;
      
      const range = this._tempMax - this._tempMin;
      const currentTempPct = 100 - (((this._currentTemp - this._tempMin) / range) * 100);
      const kelvin = Math.round(1000000 / this._currentTemp);
      
      const fill = this._popupPortal.querySelector('.vertical-slider-fill');
      const thumb = this._popupPortal.querySelector('.vertical-slider-thumb');
      const valueDisplay = this._popupPortal.querySelector('.value-display');
      
      if (fill) fill.style.height = currentTempPct + '%';
      // Clamp thumb position so it stays visible at 0% and 100%
      const thumbPos = currentTempPct <= 0 ? '0px' : currentTempPct >= 100 ? 'calc(100% - 6px)' : 'calc(' + currentTempPct + '% - 6px)';
      if (thumb) thumb.style.bottom = thumbPos;
      if (valueDisplay) valueDisplay.textContent = this._getTempName(kelvin);
    }

    _updateColorDisplay() {
      if (!this._popupPortal) return;
      const indicator = this._popupPortal.querySelector('#colorIndicator');
      if (!indicator) return;
      
      const colorWheel = this._popupPortal.querySelector('#colorWheel');
      if (!colorWheel) return;
      
      const rect = colorWheel.getBoundingClientRect();
      const r = rect.width / 2;
      
      const theta = (this._hue - 90) * (Math.PI / 180);
      const dist = (this._saturation / 100) * r;
      
      const x = r + (dist * Math.cos(theta));
      const y = r + (dist * Math.sin(theta));
      
      indicator.style.left = x + 'px';
      indicator.style.top = y + 'px';
      indicator.style.background = 'hsl(' + this._hue + ', ' + this._saturation + '%, 50%)';
      
      const colorNameEl = this._popupPortal.querySelector('.value-display');
      if (colorNameEl) {
        colorNameEl.textContent = this._getColorName(this._hue, this._saturation);
      }
    }

    _updateHeaderIcon() {
      if (!this._popupPortal) return;
      const headerIcon = this._popupPortal.querySelector('.hki-light-popup-title ha-icon, .hki-light-popup-title ha-state-icon');
      if (headerIcon) {
        headerIcon.style.color = this._getPopupIconColor(this._getCurrentColor());
      }
      const stateEl = this._popupPortal.querySelector('.hki-light-popup-state');
      if (stateEl) {
	        const entity = this._getEntity();
	        const isOn = this._isOn();
	        const isUnavailable = !!entity && String(entity.state || '').toLowerCase() === 'unavailable';
	        const isOnEffective = isUnavailable ? false : isOn;
        const brightness = this._getBrightness();
	        stateEl.textContent = this._getPopupHeaderState(isOnEffective ? brightness + '%' : 'Off');
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._closePopup();
    }

    _getDomain() {
      return this._config?.entity ? this._config.entity.split('.')[0] : '';
    }

    /**
     * Get localized state string using Home Assistant's translation system
     * Same approach as used in HKI Header Card for weather states
     */
    _getLocalizedState(state, domain) {
      if (!this.hass || !state) return state;
      
      // Get the entity object
      const entity = this.hass.states[this._config.entity];
      
      // Use HA's formatEntityState if available (same as header card)
      if (this.hass.formatEntityState && entity) {
        return this.hass.formatEntityState(entity);
      }
      
      // Fallback: title-case the state
      return String(state).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }

    /**
     * Get default icon for domain
     */
    _getDomainIcon(domain) {
      const iconMap = {
        'light': 'mdi:lightbulb',
        'switch': 'mdi:toggle-switch',
        'fan': 'mdi:fan',
        'cover': 'mdi:window-shutter',
        'lock': 'mdi:lock',
        'climate': 'mdi:thermostat',
        'alarm_control_panel': 'mdi:shield-home',
        'media_player': 'mdi:speaker',
        'vacuum': 'mdi:robot-vacuum',
        'camera': 'mdi:camera',
        'sensor': 'mdi:gauge',
        'binary_sensor': 'mdi:checkbox-marked-circle',
        'input_boolean': 'mdi:toggle-switch',
        'input_number': 'mdi:ray-vertex',
        'input_select': 'mdi:format-list-bulleted',
        'automation': 'mdi:robot',
        'script': 'mdi:script-text',
        'scene': 'mdi:palette',
        'remote': 'mdi:remote',
        'humidifier': 'mdi:air-humidifier',
      };
      return iconMap[domain] || 'mdi:gesture-tap-button';
    }

    /**
     * Return the resolved icon for popup headers.
     * Priority: configured icon (with template evaluation) → entity attribute icon → provided fallback
     */
    _getResolvedIcon(entity, fallback) {
      const cfgIcon = this._config.icon
        ? (this.renderTemplate('icon', this._config.icon) || '').toString().trim()
        : '';
      return cfgIcon || entity?.attributes?.icon || fallback || this._getDomainIcon(this._getDomain());
    }

    /**
     * Returns the display name for popup headers.
     * Priority: config name (template-resolved) → entity friendly_name → entity id
     */
    _getPopupName(entity) {
      if (this._config.name) {
        return this._isTemplate(this._config.name)
          ? (this._renderedName || entity?.attributes?.friendly_name || this._config.entity || '')
          : this._config.name;
      }
      return entity?.attributes?.friendly_name || this._config.entity || '';
    }

    /**
     * Returns the state string for popup headers.
     * If state_label is explicitly configured, it takes priority over the
     * domain-specific state string (e.g. brightness %, mode name, etc.).
     */
    _getPopupHeaderState(domainSpecificState) {
      if (this._config.state_label !== undefined && this._config.state_label !== '') {
        return this._isTemplate(this._config.state_label)
          ? (this._renderedState || domainSpecificState)
          : this._config.state_label;
      }
      return domainSpecificState;
    }

    /**
     * Returns the icon color to use in popup headers.
     * If icon_color is set in config it takes priority (template-aware).
     * Otherwise the domain-specific color (brightness-derived, state-based, etc.) is used.
     */
    _getPopupIconColor(domainColor) {
      if (this._config.icon_color) {
        const rendered = this.renderTemplate('iconColor', this._config.icon_color);
        if (rendered && rendered !== '[object Object]') return rendered;
      }
      return domainColor;
    }

    // Returns the best color for a climate entity by checking hvac_action first,
    // with smart temp-based inference when the action doesn't match reality.
    _getClimateColor(entity) {
      const action = entity?.attributes?.hvac_action;
      const mode = entity?.state;
      const currentTemp = entity?.attributes?.current_temperature;
      const targetTemp = entity?.attributes?.temperature;
      
      // Smart inference: if we have temp data, infer actual state from physics
      if (currentTemp !== undefined && targetTemp !== undefined) {
        // HEAT mode: simple logic
        if (mode === 'heat') {
          return targetTemp > currentTemp 
            ? (HVAC_COLORS.heating || 'darkorange')
            : (HVAC_COLORS.idle || '#4CAF50');
        }
        
        // COOL mode: simple logic
        if (mode === 'cool') {
          return targetTemp < currentTemp 
            ? (HVAC_COLORS.cooling || '#1E90FF')
            : (HVAC_COLORS.idle || '#4CAF50');
        }
        
        // AUTO/HEAT_COOL modes: more complex - need to check actual action
        if (mode === 'auto' || mode === 'heat_cool') {
          // Heating: target > current
          if (targetTemp > currentTemp) {
            return HVAC_COLORS.heating || 'darkorange';
          }
          // Cooling: target < current AND hvac_action confirms cooling
          if (targetTemp < currentTemp && action === 'cooling') {
            return HVAC_COLORS.cooling || '#1E90FF';
          }
          // Otherwise idle (target reached or not actively cooling)
          return HVAC_COLORS.idle || '#4CAF50';
        }
        
        // Other modes (fan_only, dry, etc.) - check if on
        if (mode !== 'off') {
          return HVAC_COLORS.idle || '#4CAF50';
        }
      }
      
      // Fallback to hvac_action if we have it and no temp data
      if (action && HVAC_COLORS[action] !== undefined) return HVAC_COLORS[action];
      // Final fallback to mode state
      return HVAC_COLORS?.[mode] || HVAC_COLORS?.off || 'var(--primary-color)';
    }
    
    _syncClimateState() {
      const entity = this._getEntity();
      if (!entity) return;
      const attrs = entity.attributes;
      this._tempMin = attrs.min_temp || 7;
      this._tempMax = attrs.max_temp || 35;
      this._step = this._getTempStep();
    }
    
    _getEntity() {
      if (!this.hass || !this._config.entity) return null;
      return this.hass.states[this._config.entity];
    }

    _isOn() {
      const entity = this._getEntity();
      if (!entity) return false;
      if (this._getDomain() === 'climate') return entity.state !== 'off';
      if (this._getDomain() === 'cover') return entity.state !== 'closed';
      if (this._getDomain() === 'alarm_control_panel') return entity.state !== 'disarmed';
      return entity.state === "on";
    }

    _getBrightness() {
      const entity = this._getEntity();
      if (entity && entity.attributes.brightness) {
        return Math.round((entity.attributes.brightness / 255) * 100);
      }
      return this._isOn() ? 100 : 0;
    }

    _getSliderValue() {
      // Get appropriate value for slider based on domain
      const entity = this._getEntity();
      if (!entity) return 0;

      const domain = this._getDomain();

      // Optimistic UI while dragging (and briefly after) so the slider feels realtime
      // even if HA/device state updates lag.
      const now = Date.now();
      const local = this._tileSliderValue;
      const localTs = this._tileSliderValueTs || 0;
      const useLocal = this._sliderDragging === true || (localTs && (now - localTs) < 800);
      if (useLocal && Number.isFinite(local)) return Math.round(local);
      
      if (domain === 'light') {
        // Light brightness (0-255 -> 0-100)
        if (entity.attributes.brightness) {
          return Math.round((entity.attributes.brightness / 255) * 100);
        }
        return this._isOn() ? 100 : 0;
      } else if (domain === 'media_player') {
        // Media player volume (0-1 -> 0-100)
        if (entity.attributes.volume_level !== undefined) {
          return Math.round(entity.attributes.volume_level * 100);
        }
        return 50;
      } else if (domain === 'fan') {
        // Fan percentage (0-100)
        if (entity.attributes.percentage !== undefined) {
          return Math.round(entity.attributes.percentage);
        }
        return this._isOn() ? 100 : 0;
      } else if (domain === 'cover') {
        // Cover position (0-100)
        if (entity.attributes.current_position !== undefined) {
          return Math.round(entity.attributes.current_position);
        }
        return 50;
      }
      
      return 0;
    }
    _sendSliderService(value, domain) {
      if (value === undefined || value === null || Number.isNaN(value)) return;

      if (domain === 'light') {
        this.hass.callService('light', 'turn_on', {
          entity_id: this._config.entity,
          brightness_pct: value
        });
      } else if (domain === 'media_player') {
        this.hass.callService('media_player', 'volume_set', {
          entity_id: this._config.entity,
          volume_level: value / 100
        });
      } else if (domain === 'fan') {
        this.hass.callService('fan', 'set_percentage', {
          entity_id: this._config.entity,
          percentage: value
        });
      } else if (domain === 'cover') {
        this.hass.callService('cover', 'set_cover_position', {
          entity_id: this._config.entity,
          position: value
        });
      }
    }

    _flushSliderUpdate(domain = this._getDomain()) {
      // Cancel any scheduled update and send the latest value immediately.
      if (this._sliderThrottleTimer) {
        clearTimeout(this._sliderThrottleTimer);
        this._sliderThrottleTimer = null;
      }
      const pending = this._sliderPendingValue;
      if (!pending || pending.value === undefined || pending.value === null) return;

      this._sendSliderService(pending.value, domain || pending.domain);
      this._sliderLastSentAt = Date.now();
      this._sliderLastSentValue = pending.value;
      this._sliderPendingValue = null;
    }

    _updateSliderDebounced(value, domain) {
  // HKI popup-style behavior:
  // - UI updates immediately (optimistic value handled elsewhere)
  // - Only send the command after the user stops moving the slider (debounce)
  // - Final value is flushed immediately on release via _flushSliderUpdate()
  const debounceMs = 200;

  this._sliderPendingValue = { value, domain };

  if (this._sliderThrottleTimer) {
    clearTimeout(this._sliderThrottleTimer);
    this._sliderThrottleTimer = null;
  }

  this._sliderThrottleTimer = setTimeout(() => {
    const pending = this._sliderPendingValue;
    this._sliderThrottleTimer = null;
    if (!pending || pending.value === undefined || pending.value === null) return;

    // Avoid resending identical values
    if (this._sliderLastSentValue === pending.value) return;

    this._sendSliderService(pending.value, pending.domain);
    this._sliderLastSentAt = Date.now();
    this._sliderLastSentValue = pending.value;

    // keep pending so release can still flush if needed; it'll be cleared there
  }, debounceMs);
}

_tileSliderClick(e) {
      // Prevent click from bubbling to card
      e.stopPropagation();
    }

    _tileSliderPointerDown(e) {
      // Track that we're dragging the slider (optimistic UI)
      this._sliderDragging = true;
      try {
        const v = parseInt(e?.target?.value, 10);
        if (!Number.isNaN(v)) {
          this._tileSliderValue = v;
          this._tileSliderValueTs = Date.now();
        }
      } catch (_) {}
      e.stopPropagation();
    }

    _tileSliderPointerMove(e) {
      // Only process if we're dragging
      if (!this._sliderDragging) return;
      e.stopPropagation();
    }

    _tileSliderPointerUp(e) {
      // Stop tracking drag
      this._sliderDragging = false;
      this._tileSliderLastSet = Date.now();

      // Ensure we flush the final value immediately (and cancel any scheduled trailing call)
      this._flushSliderUpdate(this._getDomain());

      // Keep optimistic value briefly while HA catches up
      this._tileSliderValueTs = Date.now();
      this.requestUpdate();
      e.stopPropagation();
    }

    _tileSliderInput(e, domain) {
      // Update value while dragging (optimistic UI)
      const value = parseInt(e.target.value, 10);
      if (!Number.isNaN(value)) {
        this._tileSliderValue = value;
        this._tileSliderValueTs = Date.now();
        // Update visuals immediately
        this.requestUpdate();
      }
      this._updateSliderDebounced(value, domain);
      e.stopPropagation();
    }

    _tileSliderChange(e, domain) {
      // Final value when released
      const value = parseInt(e.target.value, 10);
      if (!Number.isNaN(value)) {
        this._tileSliderValue = value;
        this._tileSliderLastSet = Date.now();
        this.requestUpdate();
      }
      this._updateSliderDebounced(value, domain);
      this._flushSliderUpdate(domain);
      e.stopPropagation();
    }

    async _renderTemplate(template) {
      if (!template || typeof template !== 'string') return template;
      // Check if it contains Jinja syntax
      if (!template.includes('{{') && !template.includes('{%')) return template;
      
      try {
        const result = await this.hass.callWS({
          type: 'render_template',
          template: template,
        });
        return result || template;
      } catch (err) {
        console.warn('Template rendering failed:', err);
        return template;
      }
    }

    // Get rendered template value or return plain value
    renderTemplate(key, fallback = '') {
      // For styling properties, use the rendered value from template subscription
      const rendered = this[`_rendered${key.charAt(0).toUpperCase() + key.slice(1)}`];
      // Return rendered value if it exists (could be empty string for templates that resolved to empty)
      // Otherwise return the fallback (plain value)
      return rendered !== undefined && rendered !== null ? rendered : fallback;
    }

    _isTemplate(str) {
      // Check if string contains Jinja2 template syntax
      return str && typeof str === 'string' && (str.includes('{{') || str.includes('{%'));
    }

    _buildTemplateVariables() {
      return { config: this._config ?? {} };
    }

    _setupTemplates() {
      if (!this.hass || !this._config) return;
      // Text templates
      this._setupTemplateKey("name", this._config.name || "");
      this._setupTemplateKey("state", this._config.state_label || "");
      this._setupTemplateKey("label", this._config.label || "");
      this._setupTemplateKey("info", this._config.info_display || "");
      this._setupTemplateKey("icon", this._config.icon || "");
      
      // Styling templates
      this._setupTemplateKey("cardColor", this._config.card_color || "");
      this._setupTemplateKey("cardOpacity", this._config.card_opacity || "");
      this._setupTemplateKey("boxShadow", this._config.box_shadow || "");
      this._setupTemplateKey("borderColor", this._config.border_color || "");
      this._setupTemplateKey("borderWidth", this._config.border_width || "");
      this._setupTemplateKey("borderStyle", this._config.border_style || "");
      this._setupTemplateKey("borderRadius", this._config.border_radius || "");
      this._setupTemplateKey("iconColor", this._config.icon_color || "");
      this._setupTemplateKey("iconCircleBg", this._config.icon_circle_bg || "");
      this._setupTemplateKey("iconCircleBorderColor", this._config.icon_circle_border_color || "");
      this._setupTemplateKey("iconCircleBorderWidth", this._config.icon_circle_border_width || "");
      this._setupTemplateKey("iconCircleBorderStyle", this._config.icon_circle_border_style || "");
      this._setupTemplateKey("badgeBg", this._config.badge_bg || "");
      this._setupTemplateKey("badgeBorderColor", this._config.badge_border_color || "");
      this._setupTemplateKey("badgeBorderWidth", this._config.badge_border_width || "");
      this._setupTemplateKey("badgeBorderStyle", this._config.badge_border_style || "");
      this._setupTemplateKey("nameColor", this._config.name_color || "");
      this._setupTemplateKey("stateColor", this._config.state_color || "");
      this._setupTemplateKey("labelColor", this._config.label_color || "");
      this._setupTemplateKey("brightnessColor", this._config.brightness_color || "");
      this._setupTemplateKey("brightnessColorOn", this._config.brightness_color_on || "");
      this._setupTemplateKey("brightnessColorOff", this._config.brightness_color_off || "");
      this._setupTemplateKey("iconAnimation", this._config.icon_animation || "");
    }

    _setupTemplateKey(key, raw) {
      const isTpl = this._isTemplate(raw);

      if (!isTpl) {
        this._unsubscribeTemplate(key);
        this._tpl[key].raw = raw;
        this._tpl[key].sig = "";
        this._setRendered(key, raw);
        return;
      }

      // Don't show raw template - keep previous value or empty until render completes
      // This prevents the flash of unrendered Jinja templates

      const vars = this._buildTemplateVariables();
      const sig = cacheKey(raw, vars);
      const state = this._tpl[key];

      this._unsubscribeTemplate(key);
      state.raw = raw;
      state.sig = sig;
      state.seq += 1;
      const seq = state.seq;

      const hadCache = this._applyCachedTemplate(key, sig);
      
      // If no cache was found, set to empty to avoid showing raw template
      if (!hadCache) {
        this._setRendered(key, "");
      }

      if (this.hass?.connection?.subscribeMessage) {
        this._subscribeTemplateImmediate(key, seq, raw, vars, sig);
      } else if (this.hass?.callWS && !hadCache) {
        this._renderTemplateOnce(key, seq, raw, vars, sig);
      }
    }

    _applyCachedTemplate(key, sig) {
      try {
        const cached = sessionStorage.getItem(sig);
        if (cached != null && cached !== "") {
          this._setRendered(key, cached);
          return true;
        }
      } catch (_) {}
      return false;
    }

    async _renderTemplateOnce(key, seq, raw, vars, sig) {
      if (!this.hass?.callWS) return;
      try {
        const res = await this.hass.callWS({
          type: "render_template",
          template: raw,
          variables: vars,
          strict: false,
        });
        if (this._tpl[key].seq !== seq) return;
        const text = res?.result == null ? "" : String(res.result);
        this._setRendered(key, text);
        this._storeTemplateCache(sig, text);
      } catch (err) {
        console.warn(`Template render failed for ${key}:`, err);
      }
    }

    async _subscribeTemplateImmediate(key, seq, raw, vars, sig) {
      if (!this.hass?.connection?.subscribeMessage) return;
      try {
        const unsub = await this.hass.connection.subscribeMessage(
          (msg) => this._onTemplateMsg(key, seq, sig, msg),
          { type: "render_template", template: raw, variables: vars, strict: false, report_errors: false }
        );
        const st = this._tpl[key];
        if (st.seq !== seq) { unsub?.(); return; }
        st.unsub = unsub;
      } catch (err) {
        console.warn(`Template subscription failed for ${key}:`, err);
        this._renderTemplateOnce(key, seq, raw, vars, sig);
      }
    }

    _onTemplateMsg(key, seq, sig, msg) {
      if (this._tpl[key].seq !== seq) return;
      if (msg?.error) { console.warn(`Template update error for ${key}:`, msg.error); return; }
      const text = msg?.result == null ? "" : String(msg.result);
      this._setRendered(key, text);
      this._storeTemplateCache(sig, text);
    }

    _storeTemplateCache(sig, value) {
      try { sessionStorage.setItem(sig, value); } catch (_) {}
    }

    _setRendered(key, value) {
      const v = value == null ? "" : String(value);
      const propName = `_rendered${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (this[propName] !== v) {
        this[propName] = v;
        this.requestUpdate();
      }
    }

    _unsubscribeTemplate(key) {
      const st = this._tpl[key];
      if (st?.unsub) { try { st.unsub(); } catch (_) {} }
      if (st) st.unsub = null;
    }

    _scheduleTemplateSetup(delayMs = 0) {
      // Debounce template setup to avoid too many subscriptions
      if (this._tpl.timer) clearTimeout(this._tpl.timer);
      this._tpl.timer = setTimeout(() => {
        this._setupTemplates();
        this._tpl.timer = null;
      }, Math.max(0, delayMs));
    }

    _rgbToHs(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0; 
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100];
    }

    _stateColorToken(domain, state, isActive) {
      // Uses HA’s built-in state/domain color rules via theme variables
      // Fallback chain per HA docs:
      // state-{domain}-{state}-color -> state-{domain}-{active|inactive}-color -> state-{active|inactive}-color
      const a = isActive ? 'active' : 'inactive';
      return `var(--state-${domain}-${state}-color, var(--state-${domain}-${a}-color, var(--state-${a}-color, var(--primary-text-color))))`;
    }

    _getCurrentColor() {
      const entity = this._getEntity();
      if (!entity) return (this._config.icon_color || 'var(--primary-text-color)');
    
      const domain = this._getDomain();
      const isActive = this._isOn(); // important: uses your domain-aware logic
    
      // --- Alarm: custom colors per state ---
      if (domain === 'alarm_control_panel') {
        const s = entity.state;
    
        // green = disarmed
        if (s === 'disarmed') return '#4CAF50';
    
        // orange = pending/arming
        if (s === 'pending' || s === 'arming') return '#FF9800';
    
        // red = armed (and triggered)
        if (s.startsWith('armed_') || s === 'triggered') return '#F44336';
    
        // fallback to HA token if some other state appears
        return this._stateColorToken(domain, s, isActive);
      }
    
      // --- Lights: keep your existing "actual light color" logic when active ---
      if (domain === 'light') {
        if (!isActive) return (this._config.icon_color || 'var(--primary-text-color)');
    
        const attrs = entity.attributes || {};
        if (attrs.rgb_color) return `rgb(${attrs.rgb_color.join(',')})`;
        if (attrs.hs_color) return `hsl(${attrs.hs_color[0]}, ${attrs.hs_color[1]}%, 50%)`;
        if (attrs.color_temp) {
          if (attrs.color_temp > 400) return '#FFD700';
          if (attrs.color_temp < 200) return '#E8F0FF';
          return '#FFF5E6';
        }
        // Default warm white for lights that are on but have no color info
        return '#FDB750';
      }
    
      // --- Climate: keep your HVAC palette when active (as you already do elsewhere) ---
      if (domain === 'climate') {
        if (!isActive) return (this._config.icon_color || 'var(--primary-text-color)');
        return (HVAC_COLORS?.[entity.state] || this._stateColorToken(domain, entity.state, true));
      }
    
      // --- Everything else (covers included): default to HA's built-in domain/state colors ---
      if (!isActive) return (this._config.icon_color || 'var(--primary-text-color)');
    }


    // Same as _getCurrentColor but for any given state object (e.g. group members)
    _getCurrentColorFromState(stateObj) {
      if (!stateObj || stateObj.state !== 'on') return null;
      const attrs = stateObj.attributes || {};
      if (Array.isArray(attrs.rgb_color)) return `rgb(${attrs.rgb_color.join(',')})`;
      if (Array.isArray(attrs.hs_color)) return `hsl(${attrs.hs_color[0]}, ${attrs.hs_color[1]}%, 50%)`;
      if (typeof attrs.color_temp === 'number') {
        // crude warm/cool approximation like the main icon
        if (attrs.color_temp > 400) return '#FFD700';
        if (attrs.color_temp < 200) return '#E8F0FF';
        return '#FFF5E6';
      }
      return '#FFD700';
    }

    _getEffectivePopupTimeFormat() {
      const opt = (this._config.popup_time_format || 'auto');
      if (opt === '12') return '12';
      if (opt === '24') return '24';

      const tf = this.hass?.locale?.time_format; // Home Assistant: 'am_pm' | '24' | 'language'
      if (tf === 'am_pm') return '12';
      if (tf === '24') return '24';
      return 'auto';
    }

    _formatHistoryTime(date) {
      const mode = this._getEffectivePopupTimeFormat();
      const base = { hour: '2-digit', minute: '2-digit' };
      if (mode === '12') return date.toLocaleTimeString([], { ...base, hour12: true });
      if (mode === '24') return date.toLocaleTimeString([], { ...base, hour12: false });
      return date.toLocaleTimeString([], base);
    }

    _syncState() {
      const entity = this._getEntity();
      if (!entity) return;
      const attrs = entity.attributes;

      if (attrs.min_mireds) this._tempMin = attrs.min_mireds;
      if (attrs.max_mireds) this._tempMax = attrs.max_mireds;
      if (attrs.color_temp) this._currentTemp = attrs.color_temp;
      
      if (attrs.hs_color && attrs.hs_color.length === 2) {
          this._hue = attrs.hs_color[0];
          this._saturation = attrs.hs_color[1];
      } else if (attrs.rgb_color && attrs.rgb_color.length === 3) {
          const [h, s] = this._rgbToHs(...attrs.rgb_color);
          this._hue = h;
          this._saturation = s;
      } else if (entity.state === 'on') {
          if (this._hue === 0 && this._saturation === 0) {
              this._hue = 30;
              this._saturation = 20;
          }
      }

      // Clear optimistic climate UI state once Home Assistant confirms it
      if (entity && entity.entity_id && entity.entity_id.startsWith('climate.')) {
        if (this._optimisticHvacMode != null && entity.state === this._optimisticHvacMode) {
          this._optimisticHvacMode = undefined;
        }
        const t = attrs.temperature;
        if (this._optimisticClimateTemp != null && typeof t === 'number' && Math.abs(t - this._optimisticClimateTemp) < 0.001) {
          this._optimisticClimateTemp = undefined;
        }
      }

    }

    /* --- ACTION HANDLING --- */
    _startHold(e, actionConfig) {
        // IMPORTANT (mobile): calling preventDefault() on touchstart will often
        // suppress the synthetic click event, which breaks tap_action (including
        // fire-dom-event) on phones.
        //
        // We only prevent default for mouse-based interactions (text selection).
        // For touch/pointer inputs we allow the browser to generate the click.
        const isTouch = !!(e.touches && e.touches.length) || e.pointerType === 'touch';
        if (!isTouch && e.cancelable) {
          e.preventDefault();
        }
        
        // Prevent hold-action from firing while the user is scrolling.
        // We cancel the hold if the pointer moves beyond a small threshold.
        const start = (e.touches && e.touches[0]) ? e.touches[0] : e;
        this._holdStartX = start.clientX;
        this._holdStartY = start.clientY;
        this._holdMoved = false;

        // Clear any previous listeners
        if (this._holdMoveListener) {
          window.removeEventListener('mousemove', this._holdMoveListener);
          window.removeEventListener('touchmove', this._holdMoveListener);
        }
        if (this._holdEndListener) {
          window.removeEventListener('mouseup', this._holdEndListener);
          window.removeEventListener('touchend', this._holdEndListener);
          window.removeEventListener('touchcancel', this._holdEndListener);
        }

        this._holdMoveListener = (ev) => {
          const p = (ev.touches && ev.touches[0]) ? ev.touches[0] : ev;
          const dx = Math.abs(p.clientX - this._holdStartX);
          const dy = Math.abs(p.clientY - this._holdStartY);
          if (dx > 10 || dy > 10) {
            this._holdMoved = true;
            // User is scrolling / moving: cancel hold and allow normal tap.
            this._clearHold({ resetFired: true });
          }
        };
        this._holdEndListener = () => {
          // Pointer released: always clear the timer.
          // NOTE: do NOT reset _holdFired here, otherwise a completed hold would
          // immediately allow the subsequent click/tap event to fire tap_action.
          this._clearHold({ resetFired: false });
          if (this._holdMoveListener) {
            window.removeEventListener('mousemove', this._holdMoveListener);
            window.removeEventListener('touchmove', this._holdMoveListener);
          }
          if (this._holdEndListener) {
            window.removeEventListener('mouseup', this._holdEndListener);
            window.removeEventListener('touchend', this._holdEndListener);
            window.removeEventListener('touchcancel', this._holdEndListener);
          }
        };
        window.addEventListener('mousemove', this._holdMoveListener, { passive: true });
        window.addEventListener('touchmove', this._holdMoveListener, { passive: true });
        window.addEventListener('mouseup', this._holdEndListener, { passive: true });
        window.addEventListener('touchend', this._holdEndListener, { passive: true });
        window.addEventListener('touchcancel', this._holdEndListener, { passive: true });

        // Start fresh for this interaction
        this._holdFired = false;

        this._holdTimer = setTimeout(() => {
          if (this._holdMoved) return;
          // Mark as fired *before* handling, so any downstream events can be gated.
          // Even if no hold_action is configured (or it's action: none), we still
          // treat it as a completed hold to suppress tap_action on release.
          this._holdFired = true;
          this._handleAction(actionConfig);
        }, 500); // 500ms hold threshold
    }

    _clearHold(opts = { resetFired: false }) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
      if (opts.resetFired) {
        this._holdFired = false;
      }
    }

    _inEditorPreview() {
      // Check if we're inside the card editor's preview area
      // Editor preview has specific parent elements we can detect
      let el = this;
      while (el) {
        if (el.classList && (el.classList.contains('element-preview') || el.classList.contains('card-config'))) {
          return true;
        }
        el = el.parentElement || el.getRootNode()?.host;
      }
      return false;
    }

    _handleDelayClick(tapAction, doubleTapAction) {
      // Prevent tap from firing if hold action already triggered
      if (this._holdFired) {
        this._holdFired = false;
        return;
      }
      
      // Resolve effective double tap action:
      // - If explicitly configured, honour it (including explicit 'none' to disable).
      // - If not configured at all (undefined), smart-default: hki-more-info for domains
      //   that support the HKI popup, otherwise treat as no double-tap.
      const effectiveDta = doubleTapAction !== undefined
        ? doubleTapAction
        : (this._supportsHkiPopup() ? { action: 'hki-more-info' } : null);

      // If no double tap action is configured (or set to none), fire immediately to keep it snappy
      if (!effectiveDta || effectiveDta.action === 'none') {
        this._handleAction(tapAction);
        return;
      }

      // Cross-platform double-tap handling (works on mobile too).
      // If a timer is running, this is the 2nd tap: cancel the pending single-tap
      // and immediately fire the double tap action.
      if (this._tapTimer) {
        clearTimeout(this._tapTimer);
        this._tapTimer = null;
        this._handleAction(effectiveDta);
        return;
      }

      // First tap: wait briefly for a potential second tap.
      this._tapTimer = setTimeout(() => {
        this._handleAction(tapAction);
        this._tapTimer = null;
      }, 250);
    }

    _handleAction(actionConfig) {
      // No action configured -> do nothing (avoid fallback attempts like more-info without entity)
      if (!actionConfig || !actionConfig.action || actionConfig.action === "none") return;
      // Prevent actions from running in editor preview mode
      if (this._inEditorPreview()) return;

      // ✅ NEW: fire-dom-event (like custom:button-card / core cards)
      // Fires `ll-custom` with the entire action config in `detail`.
      if (actionConfig.action === "fire-dom-event") {
        this.dispatchEvent(
          new CustomEvent("ll-custom", {
            bubbles: true,
            composed: true,
            detail: actionConfig,
          })
        );
        return;
      }

// HKI specific - custom popup
      if (actionConfig.action === "hki-more-info") {
        this._openPopup();
        return;
      }
    
      // Handle toggle action directly
      if (actionConfig.action === "toggle") {
        const domain = this._getDomain ? this._getDomain() : undefined;
        const entityId = this._config.entity;
        if (!entityId) return;

        // Climate: toggle OFF <-> last used HVAC mode
        if (domain === "climate") {
          const ent = this._getEntity && this._getEntity();
          const current = ent && ent.state;
          const key = `hki_climate_last_mode:${entityId}`;
    
          // If currently in a mode (not off): remember and turn off
          if (current && current !== "off") {
            try {
              localStorage.setItem(key, current);
            } catch (e) {}
            this.hass.callService("climate", "set_hvac_mode", {
              entity_id: entityId,
              hvac_mode: "off",
            });
            return;
          }
    
          // If currently off: restore last mode or fall back to first non-off hvac_mode
          let last = null;
          try {
            last = localStorage.getItem(key);
          } catch (e) {}
          const hvacModes =
            ent && ent.attributes && ent.attributes.hvac_modes
              ? ent.attributes.hvac_modes
              : [];
          const fallback =
            (Array.isArray(hvacModes)
              ? hvacModes.find((m) => m && m !== "off")
              : null) || "heat";
    
          this.hass.callService("climate", "set_hvac_mode", {
            entity_id: entityId,
            hvac_mode: last || fallback,
          });
          return;
        }
    
        // All other domains: HA generic toggle
        this.hass.callService("homeassistant", "toggle", { entity_id: entityId });
        return;
      }
    
      // ✅ NEW: Execute call-service directly (header-card style)
      // Expected shape:
      // { action: "call-service", service: "light.turn_on", service_data: {...} }
      if (actionConfig.action === "call-service" && actionConfig.service) {
        const [domain, service] = String(actionConfig.service).split(".");
        if (domain && service) {
          this.hass.callService(domain, service, actionConfig.service_data || {});
        }
        return;
      }
    
      // ✅ NEW: Execute perform-action directly (treat like a service call)
      // Expected shape:
      // { action: "perform-action", perform_action: "light.turn_on", data: {...}, target: {...} }
      if (actionConfig.action === "perform-action" && actionConfig.perform_action) {
        const [domain, service] = String(actionConfig.perform_action).split(".");
        if (domain && service) {
          const data = actionConfig.data || {};
          const target = actionConfig.target;
    
          // Some HA builds accept target as a 4th arg. If not, merge entity_id into data.
          try {
            this.hass.callService(domain, service, data, target);
          } catch (e) {
            const merged =
              target?.entity_id ? { ...data, entity_id: target.entity_id } : data;
            this.hass.callService(domain, service, merged);
          }
        }
        return;
      }
    
      // ✅ Handle more-info action - default to card's entity if none specified
      if (actionConfig.action === "more-info") {
        const entityId = actionConfig.entity || this._config.entity;
        if (entityId) {
          const event = new Event('hass-more-info', { bubbles: true, composed: true });
          event.detail = { entityId: entityId };
          this.dispatchEvent(event);
          return;
        }
      }
    
      // ✅ Handle navigate action directly
      if (actionConfig.action === "navigate") {
        if (actionConfig.navigation_path) {
          // Hash-based navigation (for Bubble Card)
          if (actionConfig.navigation_path.startsWith('#')) {
            window.location.hash = actionConfig.navigation_path.replace(/^#/, '');
            return;
          }
          // Regular HA navigation path
          window.history.pushState(null, '', actionConfig.navigation_path);
          const event = new Event('location-changed', { bubbles: true, composed: true });
          window.dispatchEvent(event);
          return;
        }
        // Fall through to dispatch event if no navigation_path specified
      }
    
      // ✅ Handle url action directly
      if (actionConfig.action === "url") {
        if (actionConfig.url_path) {
          window.open(actionConfig.url_path, '_blank');
          return;
        }
      }
    
      // For all other actions
      // ✅ Fire the standard Home Assistant action event properly
      this.dispatchEvent(
        new CustomEvent("hass-action", {
          bubbles: true,
          composed: true,
          detail: {
            config: actionConfig,
            action: actionConfig.action,
          },
        })
      );
    }

    _supportsHkiPopup() {
      // Allow HKI popup for any domain when Custom Popup is enabled,
      // because it doesn't depend on the entity domain. This also enables
      // dummy buttons (no entity) to open a Custom Popup.
      const customPopupEnabled = this._config?.custom_popup?.enabled || this._config?.custom_popup_enabled;
      const customPopupCard = this._config?.custom_popup?.card || this._config?.custom_popup_card;
      if (customPopupEnabled) return true; // card may be edited after enabling

      const domain = this._getDomain();
      return ['light', 'climate', 'alarm_control_panel', 'cover', 'humidifier', 'fan', 'switch', 'input_boolean', 'lock', 'group'].includes(domain);
    }

    _getPopupPortalStyle() {
      const blurEnabled = this._config.popup_blur_enabled !== false;
      const blurAmount = this._config.popup_blur_amount !== undefined ? Number(this._config.popup_blur_amount) : 10;
      const blur = blurEnabled && blurAmount > 0 
        ? `backdrop-filter: blur(${blurAmount}px); -webkit-backdrop-filter: blur(${blurAmount}px); will-change: backdrop-filter;` 
        : '';
      return `background: rgba(0,0,0,0.7); ${blur}`;
    }

    _getPopupCardStyle() {
      const cardBlurEnabled = this._config.popup_card_blur_enabled !== false;
      const cardBlurAmount = this._config.popup_card_blur_amount !== undefined ? Number(this._config.popup_card_blur_amount) : 40;
      let cardOpacity = this._config.popup_card_opacity !== undefined ? Number(this._config.popup_card_opacity) : 0.4;
      
      // For glass effect to be visible, we need transparency
      // If blur enabled but user explicitly sets opacity to 1, use 0.7 for more visible glass effect
      if (cardBlurEnabled && cardOpacity === 1) {
        cardOpacity = 0.7;
      }
      
      // Build background with proper opacity
      let bg;
      if (cardOpacity < 1 || cardBlurEnabled) {
        // Use rgba for transparency (needed for glass effect)
        bg = `background: rgba(28, 28, 28, ${cardOpacity});`;
      } else {
        // Fully opaque - use CSS variable
        bg = `background: var(--card-background-color, #1c1c1c);`;
      }
      
      // Add blur effect if enabled
      const blur = cardBlurEnabled && cardBlurAmount > 0
        ? `backdrop-filter: blur(${cardBlurAmount}px); -webkit-backdrop-filter: blur(${cardBlurAmount}px);`
        : '';
      
      return bg + (blur ? ' ' + blur : '');
    }

    _getPopupDimensions() {
      const widthCfg = this._config.popup_width || 'auto';
      const heightCfg = this._config.popup_height || 'auto';
      
      let width = '95vw; max-width: 500px';
      let height = '90vh; max-height: 800px';
      
      // Width handling
      if (widthCfg === 'auto') {
        width = '95vw; max-width: 500px';
      } else if (widthCfg === 'custom') {
        const customWidth = this._config.popup_width_custom ?? 400;
        width = `${customWidth}px`;
      } else if (widthCfg === 'default') {
        width = '90%; max-width: 400px';
      } else if (!isNaN(Number(widthCfg))) {
        // Legacy numeric value
        width = `${Number(widthCfg)}px`;
      }
      
      // Height handling
      if (heightCfg === 'auto') {
        height = '90vh; max-height: 800px';
      } else if (heightCfg === 'custom') {
        const customHeight = this._config.popup_height_custom ?? 600;
        height = `${customHeight}px`;
      } else if (heightCfg === 'default') {
        height = '600px';
      } else if (!isNaN(Number(heightCfg))) {
        // Legacy numeric value
        height = `${Number(heightCfg)}px`;
      }
      
      return { width, height };
    }

    _openPopup() {
      if (this._popupOpen) return;
      
      const domain = this._getDomain();
      const entity = this._getEntity();

      // Check for custom popup first (support both nested and flat formats)
      const customPopupEnabled = this._config.custom_popup?.enabled || this._config.custom_popup_enabled;
      const customPopupCard = this._config.custom_popup?.card || this._config.custom_popup_card;
      
      if (customPopupEnabled && customPopupCard) {
        this._popupOpen = true;
        __hkiLockScroll();
        this._activeView = 'main';
        this._renderCustomPopupPortal(entity);
        return;
      }

      // Special handling: group.* entities
      if (domain === 'group') {
        const members = entity && entity.attributes && Array.isArray(entity.attributes.entity_id)
          ? entity.attributes.entity_id
          : [];
        if (members.length) {
          const allowed = new Set(['switch', 'input_boolean']);
          const memberDomains = members.map((e) => (typeof e === 'string' ? e.split('.')[0] : '')).filter(Boolean);
          const allSwitchLike = memberDomains.length && memberDomains.every((d) => allowed.has(d));
          if (allSwitchLike) {
            this._popupOpen = true;
            __hkiLockScroll();
            this._activeView = 'main';
            // Open directly in group members view for group entities
            this._switchGroupMode = true;
            this._renderSwitchPopupPortal(entity);
            return;
          }
        }
        // If group isn't switch-like, fall back to native more-info
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId: this._config.entity };
        this.dispatchEvent(event);
        return;
      }

      // Check if we have HKI popup support for this domain
      const supportedDomains = ['light', 'climate', 'alarm_control_panel', 'cover', 'humidifier', 'fan', 'switch', 'input_boolean', 'lock', 'group'];
      if (!supportedDomains.includes(domain)) {
        // Fall back to native more-info for unsupported domains
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId: this._config.entity };
        this.dispatchEvent(event);
        return;
      }
      
      this._popupOpen = true;
      __hkiLockScroll();

      if (domain === 'climate') {
        // Climate default view = Heat (sliders)
        this._activeView = 'main';
        this._syncClimateState();
        this._renderClimatePopupPortal(entity);
        return;
      }

      if (domain === 'alarm_control_panel') {
        this._alarmHistoryOpen = false;
        this._alarmCodeInput = '';
        this._renderAlarmPopupPortal(entity);
        return;
      }

      if (domain === 'cover') {
        // Cover default view
        this._activeView = 'controls';
        this._coverEditMode = false;
        this._coverGroupMode = false;
        this._ensureCoverFavorites();
        this._renderCoverPopupPortal(entity);
        return;
      }

      if (domain === 'humidifier') {
        this._activeView = 'main';
        this._renderHumidifierPopupPortal(entity);
        return;
      }

      if (domain === 'group') {
        const members = entity?.attributes?.entity_id;
        const memberDomains = Array.isArray(members) ? members.map((id) => String(id || '').split('.')[0]) : [];
        const isSwitchLikeGroup = memberDomains.length > 0 && memberDomains.every((d) => d === 'switch' || d === 'input_boolean');
        if (isSwitchLikeGroup) {
          this._activeView = 'main';
          this._switchGroupMode = false;
          this._renderSwitchPopupPortal(entity);
          return;
        }
      }

      if (domain === 'switch' || domain === 'input_boolean') {
        this._activeView = 'main';
        this._switchGroupMode = false;
        this._renderSwitchPopupPortal(entity);
        return;
      }

      if (domain === 'lock') {
        this._activeView = 'main';
        this._renderLockPopupPortal(entity);
        return;
      }
      if (domain === 'fan') {
        this._activeView = 'main';
        this._renderFanPopupPortal(entity);
        return;
      }


      // Light default view
      this._activeView = 'brightness';
      this._brightness = this._getBrightness();
      this._expandedEffects = false;
      this._syncState();

      // Favorites
      this._favoritesEditMode = false;
      this._ensureLightFavorites();

      this._renderPopupPortal();
    }

    _closePopup() {
      const portal = this._popupPortal;
      if (!portal) return;

      const anim = this._config.popup_close_animation || 'scale';
      const dur = this._config.popup_animation_duration ?? 300;

      if (anim === 'none') {
        this._popupOpen = false;
        this._isDragging = false;
        this._expandedEffects = false;
        portal.remove();
        this._popupPortal = null;
        __hkiUnlockScroll();
        return;
      }

      const container = portal.querySelector('.hki-popup-container, .hki-light-popup-container');
      if (container) {
        container.style.animation = `${this._getCloseKeyframe(anim)} ${dur}ms ease forwards`;
        container.addEventListener('animationend', () => {
          this._popupOpen = false;
          this._isDragging = false;
          this._expandedEffects = false;
          portal.remove();
          this._popupPortal = null;
          __hkiUnlockScroll();
        }, { once: true });
      } else {
        this._popupOpen = false;
        this._isDragging = false;
        this._expandedEffects = false;
        portal.remove();
        this._popupPortal = null;
        __hkiUnlockScroll();
      }
    }

    _applyOpenAnimation(portal) {
      const anim = this._config.popup_open_animation || 'scale';
      if (anim === 'none') return;
      const dur = this._config.popup_animation_duration ?? 300;
      const container = portal.querySelector('.hki-popup-container, .hki-light-popup-container');
      if (container) {
        container.style.animation = `${this._getOpenKeyframe(anim)} ${dur}ms ease forwards`;
      }
    }

    _getOpenKeyframe(anim) {
      const map = {
        'fade':        'hki-anim-fade-in',
        'scale':       'hki-anim-scale-in',
        'slide-up':    'hki-anim-slide-up',
        'slide-down':  'hki-anim-slide-down',
        'slide-left':  'hki-anim-slide-left',
        'slide-right': 'hki-anim-slide-right',
        'flip':        'hki-anim-flip-in',
        'bounce':      'hki-anim-bounce-in',
        'zoom':        'hki-anim-zoom-in',
        'rotate':      'hki-anim-rotate-in',
        'drop':        'hki-anim-drop-in',
        'swing':       'hki-anim-swing-in',
      };

      return map[anim] || 'hki-anim-fade-in';
    }

    _getCloseKeyframe(anim) {
      const map = {
        'fade':        'hki-anim-fade-out',
        'scale':       'hki-anim-scale-out',
        'slide-up':    'hki-anim-slide-out-down',
        'slide-down':  'hki-anim-slide-out-up',
        'slide-left':  'hki-anim-slide-out-right',
        'slide-right': 'hki-anim-slide-out-left',
        'flip':        'hki-anim-flip-out',
        'bounce':      'hki-anim-scale-out',
        'zoom':        'hki-anim-zoom-out',
        'rotate':      'hki-anim-rotate-out',
        'drop':        'hki-anim-drop-out',
        'swing':       'hki-anim-swing-out',
      };

      return map[anim] || 'hki-anim-fade-out';
    }

    _getColorName(hue, saturation) {
      if (saturation < 5) return 'White';
      if (saturation < 15) return 'Light Gray';
      if (saturation < 25) return 'Pale ' + this._getHueName(hue);
      if (saturation < 40) return 'Light ' + this._getHueName(hue);
      if (saturation > 90) return 'Vivid ' + this._getHueName(hue);
      if (saturation > 75) return 'Bright ' + this._getHueName(hue);
      return this._getHueName(hue);
    }

    _getHueName(hue) {
      if (hue >= 0 && hue < 10) return 'Red';
      if (hue >= 10 && hue < 20) return 'Scarlet';
      if (hue >= 20 && hue < 35) return 'Orange Red';
      if (hue >= 35 && hue < 50) return 'Orange';
      if (hue >= 50 && hue < 60) return 'Gold';
      if (hue >= 60 && hue < 70) return 'Yellow';
      if (hue >= 70 && hue < 80) return 'Yellow Green';
      if (hue >= 80 && hue < 100) return 'Chartreuse';
      if (hue >= 100 && hue < 130) return 'Green';
      if (hue >= 130 && hue < 150) return 'Spring Green';
      if (hue >= 150 && hue < 170) return 'Cyan';
      if (hue >= 170 && hue < 190) return 'Turquoise';
      if (hue >= 190 && hue < 210) return 'Sky Blue';
      if (hue >= 210 && hue < 230) return 'Azure';
      if (hue >= 230 && hue < 250) return 'Blue';
      if (hue >= 250 && hue < 270) return 'Indigo';
      if (hue >= 270 && hue < 290) return 'Purple';
      if (hue >= 290 && hue < 310) return 'Violet';
      if (hue >= 310 && hue < 330) return 'Magenta';
      if (hue >= 330 && hue < 345) return 'Pink';
      if (hue >= 345) return 'Rose';
      return 'Red';
    }

    _getTempName(kelvin) {
      if (kelvin < 2000) return 'Candle';
      if (kelvin < 2500) return 'Very Warm';
      if (kelvin < 2900) return 'Warm White';
      if (kelvin < 3500) return 'Soft White';
      if (kelvin < 4500) return 'Neutral';
      if (kelvin < 5500) return 'Cool White';
      if (kelvin < 6500) return 'Daylight';
      return 'Cool Daylight';
    }

    _ensureLightFavorites() {
      try {
        const entityId = this._config?.entity;
        if (!entityId) return;
        if (Array.isArray(this._lightFavorites) && this._lightFavorites._for === entityId) return;

        const raw = localStorage.getItem(__hkiFavKey(entityId));
        let favs = null;
        if (raw) {
          try { favs = JSON.parse(raw); } catch (e) { favs = null; }
        }
        if (!Array.isArray(favs) || favs.length === 0) {
          favs = __hkiSeedFavorites();
          localStorage.setItem(__hkiFavKey(entityId), JSON.stringify(favs));
        }
        favs._for = entityId;
        this._lightFavorites = favs;
      } catch (e) {
        // fallback to seeded list in-memory
        const favs = __hkiSeedFavorites();
        favs._for = this._config?.entity;
        this._lightFavorites = favs;
      }
    }

    _saveLightFavorites() {
      try {
        const entityId = this._config?.entity;
        if (!entityId || !Array.isArray(this._lightFavorites)) return;
        const toSave = this._lightFavorites.filter(f => f && typeof f === 'object' && f.id);
        localStorage.setItem(__hkiFavKey(entityId), JSON.stringify(toSave));
        toSave._for = entityId;
        this._lightFavorites = toSave;
      } catch (e) {}
    }

    _formatAttrLabel(attrKey) {
      if (!attrKey) return '';
      return String(attrKey)
        .replace(/_/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }


    _ensurePopupDialogStyles() {
      if (document.getElementById('hki-dialog-styles')) return;
      const st = document.createElement('style');
      st.id = 'hki-dialog-styles';
      st.textContent = `
        .hki-dialog-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:10001;display:flex;align-items:center;justify-content:center;}
        .hki-dialog{width:92%;max-width:360px;background:var(--card-background-color,#1c1c1c);border-radius:16px;box-shadow:0 10px 38px rgba(0,0,0,0.45);overflow:hidden;border:1px solid var(--divider-color, rgba(255,255,255,0.06));}
        .hki-dialog-h{padding:14px 16px;font-weight:600;font-size:14px;color:var(--primary-text-color);border-bottom:1px solid var(--divider-color, rgba(255,255,255,0.06));}
        .hki-dialog-b{padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
        .hki-dialog-b p{margin:0;color:var(--primary-text-color);opacity:0.8;font-size:13px;line-height:1.3;}
        .hki-dialog-in{width:100%;box-sizing:border-box;background:var(--secondary-background-color, rgba(255,255,255,0.06));border:1px solid var(--divider-color, rgba(255,255,255,0.10));border-radius:12px;color:var(--primary-text-color);padding:10px 12px;font-size:14px;outline:none;}
        .hki-dialog-f{padding:12px 16px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--divider-color, rgba(255,255,255,0.06));}
        .hki-dialog-btn{height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--divider-color, rgba(255,255,255,0.12));background:var(--secondary-background-color, rgba(255,255,255,0.06));color:var(--primary-text-color);cursor:pointer;}
        .hki-dialog-btn.primary{background:var(--primary-color, rgba(255,255,255,0.14));color:var(--text-primary-color, var(--primary-text-color));}
      `;
      document.head.appendChild(st);
    }

    _promptText(title, defaultValue = '', opts = {}) {
      this._ensurePopupDialogStyles();
      const { message = '', okText = 'OK', cancelText = 'Skip', placeholder = '' } = opts;
      return new Promise((resolve) => {
        const bd = document.createElement('div');
        bd.className = 'hki-dialog-backdrop';
        bd.innerHTML = `
          <div class="hki-dialog" role="dialog" aria-modal="true">
            <div class="hki-dialog-h">${title}</div>
            <div class="hki-dialog-b">
              ${message ? `<p>${message}</p>` : ''}
              <input class="hki-dialog-in" id="hkiDlgIn" placeholder="${placeholder}" />
            </div>
            <div class="hki-dialog-f">
              <button class="hki-dialog-btn" id="hkiDlgCancel">${cancelText}</button>
              <button class="hki-dialog-btn primary" id="hkiDlgOk">${okText}</button>
            </div>
          </div>`;
        document.body.appendChild(bd);
        const input = bd.querySelector('#hkiDlgIn');
        if (input) {
          input.value = String(defaultValue ?? '');
          setTimeout(() => input.focus(), 0);
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') bd.querySelector('#hkiDlgOk')?.click();
            if (e.key === 'Escape') bd.querySelector('#hkiDlgCancel')?.click();
          });
        }
        const cleanup = (val) => {
          bd.remove();
          resolve(val);
        };
        // Clicking outside the dialog is a true cancel (return null)
        bd.addEventListener('click', (e) => { if (e.target === bd) cleanup(null); });
        // "Skip" should not cancel the operation; it means "use empty/default"
        bd.querySelector('#hkiDlgCancel')?.addEventListener('click', () => cleanup(''));
        bd.querySelector('#hkiDlgOk')?.addEventListener('click', () => cleanup(input ? input.value : ''));
      });
    }

    _promptYesNo(title, message, opts = {}) {
      this._ensurePopupDialogStyles();
      const { yesText = 'Yes', noText = 'Skip' } = opts;
      return new Promise((resolve) => {
        const bd = document.createElement('div');
        bd.className = 'hki-dialog-backdrop';
        bd.innerHTML = `
          <div class="hki-dialog" role="dialog" aria-modal="true">
            <div class="hki-dialog-h">${title}</div>
            <div class="hki-dialog-b"><p>${message}</p></div>
            <div class="hki-dialog-f">
              <button class="hki-dialog-btn" id="hkiDlgNo">${noText}</button>
              <button class="hki-dialog-btn primary" id="hkiDlgYes">${yesText}</button>
            </div>
          </div>`;
        document.body.appendChild(bd);
        const cleanup = (val) => { bd.remove(); resolve(val); };
        bd.addEventListener('click', (e) => { if (e.target === bd) cleanup(false); });
        bd.querySelector('#hkiDlgNo')?.addEventListener('click', () => cleanup(false));
        bd.querySelector('#hkiDlgYes')?.addEventListener('click', () => cleanup(true));
      });
    }

    _renderFavoritesView() {
      this._ensureLightFavorites();
      const favs = Array.isArray(this._lightFavorites) ? this._lightFavorites : [];
      // Note: edit button is rendered in a sticky header so it never scrolls with the grid.
      let html = `
        <div class="favorites-view" data-view-type="scenes">
          <div class="favorites-sticky-header">
            <button class="favorites-edit-btn" id="favoritesEditBtn">
              <ha-icon icon="${this._favoritesEditMode ? 'mdi:check' : 'mdi:pencil'}"></ha-icon>
              <span>${this._favoritesEditMode ? 'Done' : 'Edit'}</span>
            </button>
          </div>
          <div class="presets-container favorites-grid">
      `;

      favs.forEach((fav, idx) => {
        const color = fav.color || (fav.rgb_color ? `rgb(${fav.rgb_color.join(',')})` : '#888');
        const picture = fav.picture ? String(fav.picture) : '';
        html += `
          <button class="preset-btn" data-fav-index="${idx}">
            ${picture
              ? `<img class="preset-picture" src="${picture}" />`
              : `<div class="preset-color" style="background: ${color}"></div>`
            }
            <span class="preset-name">${fav.name || 'Favorite'}</span>
            ${this._favoritesEditMode ? `<span class="fav-delete-badge" data-fav-del="${idx}"><ha-icon icon="mdi:close"></ha-icon></span>` : ''}
          </button>
        `;
      });

      html += `</div></div>`;
      return html;
    }

    async _addCurrentLightToFavorites() {
      this._ensureLightFavorites();
      const entity = this._getEntity();
      if (!entity) return;
      const attrs = entity.attributes || {};

      // Default name: use color names (Warm White, Indigo, etc.) when applicable.
      const defaultName = (this._activeView === 'temperature')
        ? this._getTempName(Math.round(1000000 / (this._currentTemp || attrs.color_temp || 326)))
        : (this._activeView === 'color')
          ? this._getColorName(this._hue, this._saturation)
          : (this._config.name || attrs.friendly_name || 'Favorite');

      // Ask for a friendly name (optional). 'Skip' keeps the default name.
      const nameInput = await this._promptText('Favorite name', defaultName, {
        okText: 'Save',
        cancelText: 'Skip',
        placeholder: 'Optional'
      });
      const finalName = (nameInput === null) ? defaultName : (String(nameInput).trim() || defaultName);

      // Group entities: saving from the wheel/temp tabs should create a normal favorite
      // applied to the group entity (since the picker already sets all members).

      // Single light favorites: never prompt here; use the default color name.
      const fav = {
        id: `fav_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        name: finalName,
      };

      // Capture brightness/effect
      if (typeof attrs.brightness === 'number') fav.brightness = attrs.brightness;
      if (attrs.effect) fav.effect = attrs.effect;

      // IMPORTANT: Save only ONE color descriptor based on the current view
      if (this._activeView === 'temperature') {
        const ct = (typeof this._currentTemp === 'number' ? this._currentTemp : attrs.color_temp);
        if (typeof ct === 'number' && !Number.isNaN(ct)) {
          fav.type = 'temp';
          fav.color_temp = ct;
          fav.kelvin = Math.round(1000000 / ct);
          fav.color = (fav.kelvin < 3500) ? '#FFE4B5' : (fav.kelvin < 5000 ? '#FFF5E6' : '#E8F0FF');
        }
      } else if (this._activeView === 'color') {
        const h = (typeof this._hue === 'number' ? this._hue : (Array.isArray(attrs.hs_color) ? attrs.hs_color[0] : 0));
        const sat = (typeof this._saturation === 'number' ? this._saturation : (Array.isArray(attrs.hs_color) ? attrs.hs_color[1] : 100));
        const rgb = _hsvToRgb(h, sat, 100);
        fav.type = 'rgb';
        fav.rgb_color = rgb;
        fav.color = `rgb(${rgb.join(',')})`;
      }

      if (!Array.isArray(this._lightFavorites)) this._lightFavorites = [];
      this._lightFavorites.unshift(fav);
      this._saveLightFavorites();
    }

    async _addGroupSnapshotToFavorites(opts = {}) {
      this._ensureLightFavorites();
      const entity = this._getEntity();
      if (!entity) return;
      const attrs = entity.attributes || {};
      const members = Array.isArray(attrs.entity_id) ? attrs.entity_id.slice() : [];
      if (members.length === 0) return;

      const defaultName = (opts.name || this._config.name || attrs.friendly_name || 'Group Scene');

      // Only the group list should ask for a custom name.
      // Saving from the color wheel / temperature views should auto-name (color name) and never prompt.
      let name = defaultName;
      if (!opts.skipPrompt) {
        const nameInput = await this._promptText('Favorite name', defaultName, {
          message: 'This will save the current state of each group member.',
          okText: 'Save',
          cancelText: 'Skip'
        });
        if (nameInput === null) return;
        name = String(nameInput).trim() || defaultName;
      }

      // Snapshot member states
      const states = {};
      const colors = [];
      const temps = [];

      for (const eid of members) {
        const st = this.hass?.states?.[eid];
        if (!st) continue;
        const a = st.attributes || {};
        const snap = { state: st.state };
        if (typeof a.brightness === 'number') snap.brightness = a.brightness;
        if (a.effect) snap.effect = a.effect;

        // If this popup is controlling a group, each row can be in a different mode.
        // When saving a group favorite, respect the visible slider mode per member:
        // - temp slider => save temp
        // - color slider => save color
        // - brightness slider => don't force a color descriptor
        const memberMode = opts.pickerMode || this._groupMemberModes?.[eid] || 'brightness';
        if (memberMode === 'temp') {
          if (typeof a.color_temp === 'number') {
            snap.type = 'temp';
            snap.color_temp = a.color_temp;
          }
        } else if (memberMode === 'color') {
          if (Array.isArray(a.rgb_color)) {
            snap.type = 'rgb';
            snap.rgb_color = a.rgb_color;
          } else if (Array.isArray(a.hs_color)) {
            snap.type = 'hs';
            snap.hs_color = a.hs_color;
          }
        } else {
          // brightness view: keep whatever HA reports, but don't try to mix descriptors
          // (avoids "Color descriptors" conflict)
        }
        states[eid] = snap;
      }

      // Determine swatch color if consistent, otherwise ask for custom color/picture
      let picture = '';
      let swatch = (opts.forceSwatch ? String(opts.forceSwatch).trim() : '');
      try {
        // compute if all members share same rgb_color
        const rgbs = [];
        for (const eid of Object.keys(states)) {
          const s = states[eid];
          if (s.type === 'rgb' && Array.isArray(s.rgb_color)) rgbs.push(s.rgb_color.join(','));
          else rgbs.push('');
        }
      } catch (e) {}

      // We'll do JS-side uniqueness below
      const rgbKeys = Object.values(states).map(s => (s.type === 'rgb' && Array.isArray(s.rgb_color)) ? s.rgb_color.join(',') : '');
      const uniqRgb = Array.from(new Set(rgbKeys.filter(Boolean)));
      if (uniqRgb.length === 1) {
        swatch = `rgb(${uniqRgb[0]})`;
      }

      if (!opts.nameOnly && (opts.alwaysPromptMeta || !swatch)) {
        const colorInput = await this._promptText('Optional button color', '', { message: 'Optional: enter a hex/rgb color for the favorite button (e.g. #ff00aa).', okText: 'Use', cancelText: 'Skip' });
        if (colorInput) swatch = String(colorInput).trim();

        const picInput = await this._promptText('Optional picture path', '', { message: 'Optional: enter an image path/URL (e.g. /local/favs/scene.png).', okText: 'Use', cancelText: 'Skip' });
        if (picInput) picture = String(picInput).trim();
      }

      const fav = {
        id: `fav_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        name,
        type: 'scene',
        targets: members,
        states,
        ...(swatch ? { color: swatch } : {}),
        ...(picture ? { picture } : {}),
      };

      if (!Array.isArray(this._lightFavorites)) this._lightFavorites = [];
      this._lightFavorites.unshift(fav);
      this._saveLightFavorites();
    }



    _applyFavorite(fav) {
      if (!fav) return;

      // Group scene favorite: apply per-target snapshots
      if (fav.type === 'scene' && Array.isArray(fav.targets) && fav.states && this.hass) {
        for (const eid of fav.targets) {
          const snap = fav.states[eid];
          if (!snap) continue;
          if (snap.state === 'off') {
            this.hass.callService('light', 'turn_off', { entity_id: eid });
            continue;
          }
          const d = { entity_id: eid };
          if (typeof snap.brightness === 'number') d.brightness = snap.brightness;
          if (snap.effect) d.effect = snap.effect;
          if (snap.type === 'temp') {
            if (typeof snap.kelvin === 'number') d.kelvin = snap.kelvin;
            else if (typeof snap.color_temp === 'number') d.color_temp = snap.color_temp;
          } else if (snap.type === 'rgb') {
            if (Array.isArray(snap.rgb_color)) d.rgb_color = snap.rgb_color;
          } else if (snap.type === 'hs') {
            if (Array.isArray(snap.hs_color)) d.hs_color = snap.hs_color;
          }
          this.hass.callService('light', 'turn_on', d);
        }
        return;
      }
      const data = { entity_id: this._config.entity };

      // Common fields
      if (typeof fav.brightness === 'number') data.brightness = fav.brightness;
      if (fav.effect) data.effect = fav.effect;

      // IMPORTANT: only one color descriptor per service call
      if (fav.type === 'temp') {
        if (typeof fav.kelvin === 'number' && !Number.isNaN(fav.kelvin)) {
          data.kelvin = fav.kelvin;
        } else if (typeof fav.color_temp === 'number' && !Number.isNaN(fav.color_temp)) {
          data.color_temp = fav.color_temp;
        }
      } else if (fav.type === 'rgb') {
        if (Array.isArray(fav.rgb_color)) data.rgb_color = fav.rgb_color;
      } else if (fav.type === 'hs') {
        if (Array.isArray(fav.hs_color)) data.hs_color = fav.hs_color;
      } else {
        // Backward compatibility for older saved favorites
        if (Array.isArray(fav.rgb_color)) data.rgb_color = fav.rgb_color;
        else if (Array.isArray(fav.hs_color)) data.hs_color = fav.hs_color;
        else if (typeof fav.kelvin === 'number') data.kelvin = fav.kelvin;
        else if (typeof fav.color_temp === 'number') data.color_temp = fav.color_temp;
      }

      this.hass.callService('light', 'turn_on', data);
    }



    _getPopupButtonStyle(isActive = false) {
      if (isActive) {
        // Highlighted button styles
        const styles = [];
        if (this._config.popup_highlight_color) styles.push(`background: ${this._config.popup_highlight_color}`);
        if (this._config.popup_highlight_text_color) styles.push(`color: ${this._config.popup_highlight_text_color}`);
        if (this._config.popup_highlight_radius !== undefined && this._config.popup_highlight_radius !== null && this._config.popup_highlight_radius !== '') styles.push(`border-radius: ${this._config.popup_highlight_radius}px`);
        if (this._config.popup_highlight_opacity !== undefined && this._config.popup_highlight_opacity !== null && this._config.popup_highlight_opacity !== '') styles.push(`opacity: ${this._config.popup_highlight_opacity}`);
        
        // Use configured shadow or default shadow (flat design, no inset)
        const shadow = this._config.popup_highlight_box_shadow || '0 2px 8px rgba(0,0,0,0.15)';
        styles.push(`box-shadow: ${shadow}`);
        
        const borderStyle = this._config.popup_highlight_border_style || 'none';
        const borderWidth = this._config.popup_highlight_border_width || '0';
        const borderColor = this._config.popup_highlight_border_color || 'transparent';
        if (borderStyle !== 'none') styles.push(`border: ${borderWidth}px ${borderStyle} ${borderColor}`);
        
        return styles.length ? styles.join('; ') + ';' : '';
      } else {
        // Non-highlighted button styles
        const styles = [];
        if (this._config.popup_button_bg) styles.push(`background: ${this._config.popup_button_bg}`);
        if (this._config.popup_button_text_color) styles.push(`color: ${this._config.popup_button_text_color}`);
        if (this._config.popup_button_radius !== undefined && this._config.popup_button_radius !== null && this._config.popup_button_radius !== '') styles.push(`border-radius: ${this._config.popup_button_radius}px`);
        if (this._config.popup_button_opacity !== undefined && this._config.popup_button_opacity !== null && this._config.popup_button_opacity !== '') styles.push(`opacity: ${this._config.popup_button_opacity}`);
        
        const borderStyle = this._config.popup_button_border_style || 'none';
        const borderWidth = this._config.popup_button_border_width || '0';
        const borderColor = this._config.popup_button_border_color || 'transparent';
        if (borderStyle !== 'none') styles.push(`border: ${borderWidth}px ${borderStyle} ${borderColor}`);
        
        return styles.length ? styles.join('; ') + ';' : '';
      }
    }


    _renderPopupPortal() {
      // Reuse existing portal to avoid flicker on hass updates.
      const entity = this._getEntity();
      const entityName = this._getPopupName(entity);
      const isOn = this._isOn();
      const isUnavailable = !entity || String(entity.state || '').toLowerCase() === 'unavailable';
      const isOnEffective = isUnavailable ? false : isOn;
      const brightness = this._getBrightness();
      const supportsColor = entity && entity.attributes.supported_color_modes && 
        entity.attributes.supported_color_modes.some(m => ['hs', 'rgb', 'xy', 'rgbw'].includes(m));
      const supportsTemp = entity && entity.attributes.supported_color_modes && 
        entity.attributes.supported_color_modes.some(m => m === 'color_temp');
      
      const effectList = entity && entity.attributes.effect_list ? entity.attributes.effect_list : [];
      const currentEffect = entity && entity.attributes.effect ? entity.attributes.effect : 'None';

      const isGroup = entity && entity.attributes.entity_id && Array.isArray(entity.attributes.entity_id);

      // Check default view configuration
      const defaultView = this._config.popup_default_view; // 'main', 'individual', or undefined
      const defaultSection = this._config.popup_default_section; // 'brightness', 'color', 'temperature', 'last', or undefined
      
      // For main entity view, only set brightness as default if _activeView is not already set
      // This allows tabs (temperature/color) to work properly
      if (!this._activeView || this._activeView === 'main') {
        this._activeView = 'brightness';
      }

      // Use coalescing for border radius so 0 is valid
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();
      
      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-light-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      const safeTitle = (t) => String(t || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      portal.innerHTML = `
        <style>
          .hki-light-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-light-popup-container {
            ${this._getPopupCardStyle()}
            border-radius: ${popupBorderRadius}px; 
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column;
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-touch-callout: none;
          }
          .hki-light-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-light-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-light-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-light-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; color: var(--primary-text-color); }
          .hki-light-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-light-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .graphs-container { padding: 0; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
          .graphs-container #sensorTiles { height: 100%; overflow-y: auto; }
          .graphs-container hui-history-graph-card { display: block; height: 100%; }
          .graphs-container ha-card { height: 100%; overflow: hidden; }

          .sensor-tiles { display: flex; flex-direction: column; gap: 24px; width: 100%; height: 100%; box-sizing: border-box; padding: 16px; align-self: stretch; justify-content: flex-start; }
          .sensor-tile { background: rgba(255,255,255,0.05); border-radius: 18px; padding: 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.25); flex: 1; display: flex; flex-direction: column; min-height: 0; }
          .sensor-tile-top { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 12px; }
          .sensor-tile-title { font-size: 14px; font-weight: 600; opacity: 0.9; }
          .sensor-tile-value { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
          .sensor-tile-graph { flex: 1; width: 100%; min-height: 120px; overflow: hidden; border-radius: 14px; background: rgba(0,0,0,0.12); padding: 8px; box-sizing: border-box; }
          .sensor-tile-graph svg { width: 100%; height: 100%; display: block; }


          .hki-light-popup-tabs {
            display: flex; gap: 8px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-light-popup-tab {
            flex: 1; height: 40px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.2s; font-size: 14px; font-weight: 500;
          }
          .hki-light-popup-tab:hover { background: var(--secondary-background-color, rgba(255, 255, 255, 0.08)); }
          .hki-light-popup-tab.active { 
            background: var(--primary-color, rgba(255, 255, 255, 0.15)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .hki-light-popup-tab ha-icon { --mdc-icon-size: 18px; }
          
          .hki-light-popup-content {
            flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 12px;
            min-height: 0;
            position: relative;
            overflow-x: hidden;
          }

          .hki-light-popup-content.view-favorites {
            align-items: stretch;
          justify-items: stretch;
            justify-content: flex-start;
          }

          .save-favorite-fab {
            position: absolute; right: 16px; bottom: 16px;
            width: 44px; height: 44px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.10);
            color: var(--primary-text-color);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: transform 0.15s, background 0.15s;
          }
          .save-favorite-fab:hover { background: rgba(255, 255, 255, 0.14); transform: scale(1.05); }
          .save-favorite-fab ha-icon { --mdc-icon-size: 20px; }

          .favorites-view { width: 100%; height: 100%; position: relative; }

          /* Sticky header so the Edit button never scrolls with the grid */
          .favorites-sticky-header {
            position: sticky;
            top: 0;
            z-index: 6;
            display: flex;
            justify-content: flex-end;
            padding: 8px 0 8px 0;
            background: transparent;
            backdrop-filter: none;
          }

          .favorites-grid { width: 100%; padding-top: 16px; }
          .preset-picture {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }


          /* Edit button under top tabs (top-right) */
          .favorites-edit-btn {
            position: relative;
            z-index: 1;
            display: flex; align-items: center; gap: 8px;
            background: var(--divider-color, rgba(255, 255, 255, 0.06));
            border: 1px solid rgba(255, 255, 255, 0.10);
            color: var(--primary-text-color);
            height: 34px; padding: 0 12px; border-radius: 999px;
            cursor: pointer;
          }
          .favorites-edit-btn:hover { background: rgba(255, 255, 255, 0.10); }
          .favorites-edit-btn ha-icon { --mdc-icon-size: 18px; }

          .preset-btn { position: relative; }
          .fav-delete-badge {
            position: absolute; top: 8px; right: 8px;
            width: 20px; height: 20px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.10);
            border: 1px solid rgba(255, 255, 255, 0.12);
            display: flex; align-items: center; justify-content: center;
            color: var(--primary-text-color);
          }
          .fav-delete-badge:hover { background: rgba(255, 80, 80, 0.25); border-color: rgba(255, 80, 80, 0.35); }
          .fav-delete-badge ha-icon { --mdc-icon-size: 14px; }

          .value-display {
            font-size: 16px; font-weight: 500; color: var(--primary-text-color); 
            margin-bottom: 8px; opacity: 0.9; text-align: center;
            min-height: 22px;
          }
          .value-display span { font-size: 16px; opacity: 0.9; }
          
          .vertical-slider-container { width: 80px; height: 280px; position: relative; }
          .vertical-slider-track {
            width: 100%; height: 100%; background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .vertical-slider-fill {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: transparent;
            border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
          }
          .vertical-slider-thumb {
            position: absolute; left: 50%; transform: translateX(-50%);
            width: 90px; height: 6px; background: white;
            border-radius: 4px; box-shadow: 0 0 0 2px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.3);
            cursor: grab; pointer-events: none;
          }
          .vertical-slider-thumb:active { cursor: grabbing; }

          .temp-gradient {
            background: linear-gradient(to bottom, 
              rgb(166, 209, 255) 0%,
              rgb(255, 255, 255) 50%,
              rgb(255, 200, 130) 100%) !important;
          }
          .temp-fill { background: transparent !important; }

          .color-section-container {
            display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;
          }
          .color-name {
            font-size: 16px; font-weight: 500; color: var(--primary-text-color);
            opacity: 0.9; text-transform: capitalize; text-align: center;
            min-height: 22px;
          }
          .color-wheel {
            width: 280px; height: 280px; border-radius: 50%;
            background: conic-gradient(hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%));
            position: relative; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .color-wheel::after {
            content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 40%; height: 40%; border-radius: 50%; background: radial-gradient(circle, white 0%, transparent 70%);
          }
          .color-wheel-indicator {
            position: absolute; width: 28px; height: 28px; border-radius: 50%;
            border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%); pointer-events: none; top: 50%; left: 50%;
            transition: top 0.3s, left 0.3s; 
          }

          .presets-container { 
            display: grid; 
            /* fixed 4-per-row grid (matches HKI style) */
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px; 
            width: 100%;
            box-sizing: border-box;
          }
          /* Favorites spacing under the fixed Edit header */
          .favorites-grid { padding-top: 16px; }
          .preset-picture { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
          .preset-btn {
            aspect-ratio: 1; border-radius: 12px; border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            background: transparent; cursor: pointer;
            display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
            gap: 6px; transition: all 0.2s; padding: 10px 8px 8px 8px; outline: none;
            min-width: 0;
          }
          .preset-btn:hover { transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); }
          .preset-btn:active { transform: scale(0.95); }
          .preset-color { width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
          .preset-name {
            font-size: 10px;
            color: var(--primary-text-color);
            text-align: center;
            opacity: 0.8;
            max-width: 100%;
            word-break: break-word;
            /* keep circles aligned even with long text */
            height: 26px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .individual-container { width: 100%; flex: 1; overflow-y: auto; max-height: none; }
          .individual-item {
            padding: 12px 0; border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            display: flex; align-items: center; gap: 12px;
          }
          .individual-item:last-child { border-bottom: none; }
          .individual-icon {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05));
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .individual-icon ha-icon { --mdc-icon-size: 20px; }
          .individual-info { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
          .individual-name { font-size: 14px; font-weight: 500; }
          .individual-state { font-size: 12px; opacity: 0.6; }
          .individual-slider {
            flex: 2; height: 40px; background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .individual-slider-fill {
            height: 100%; background: rgba(255, 255, 255, 0.18);
            border-radius: ${borderRadius}px 0 0 ${borderRadius}px;
            transition: width 0.2s;
          }
          /* For horizontal color/temp pickers we only show the handle (no fill) */
          .individual-slider[data-mode="color"] .individual-slider-fill,
          .individual-slider[data-mode="temp"] .individual-slider-fill { display: none; }
          .individual-slider[data-mode="brightness"] .individual-slider-fill { display: block !important; }
          .individual-slider-thumb {
            position: absolute; top: 0; transform: translateX(-50%);
            width: 12px; height: 100%; background: white; border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3); pointer-events: none; transition: left 0.2s;
          }
          
          .individual-item.switch-style .individual-icon {
            cursor: pointer;
            transition: background 0.2s;
          }
          .individual-item.switch-style .individual-icon:hover {
            background: var(--divider-color, rgba(255, 255, 255, 0.1));
          }
          .individual-switch-container {
            flex: 0 0 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .individual-switch {
            width: 52px;
            height: 32px;
            background: var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: 16px;
            position: relative;
            transition: background 0.3s;
          }
          .individual-switch.on {
            background: var(--primary-color, #03a9f4);
          }
          .individual-switch-thumb {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 26px;
            height: 26px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .individual-switch.on .individual-switch-thumb {
            transform: translateX(20px);
          }

          .effects-list-container { width: 100%; }
          .effects-trigger {
            width: 100%; padding: 16px; background: var(--divider-color, rgba(255, 255, 255, 0.05));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1)); border-radius: 12px;
            display: flex; align-items: center; justify-content: space-between;
            cursor: pointer; transition: all 0.2s; color: var(--primary-text-color);
          }
          .effects-trigger:hover { border-color: rgba(255, 255, 255, 0.3); }
          .effects-trigger-content { display: flex; align-items: center; gap: 12px; }
          .effects-trigger-content ha-icon { --mdc-icon-size: 24px; }
          .effects-trigger-arrow { transition: transform 0.3s; }
          .effects-trigger-arrow.expanded { transform: rotate(90deg); }
          .effects-list {
            margin-top: 12px; display: none; flex-direction: column; gap: 8px;
          }
          .effects-list.expanded { display: flex; }
          .effect-item {
            padding: 14px; background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05)); border-radius: 8px;
            cursor: pointer; transition: all 0.2s;
            margin-bottom: 4px;
          }
          .effect-item:hover { background: rgba(255, 255, 255, 0.08); }
          .effect-item.active {
            background: rgba(255, 215, 0, 0.1); border-color: #FFD700;
          }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          /* Timeline styles (make line continuous like other popups) */
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot {
            width: 10px; height: 10px; border-radius: 50%;
            z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c);
            margin-top: 3px;
          }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }

          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content {
            flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color);
          }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }

          .bottom-nav {
            display: flex; justify-content: space-around; align-items: center;
            padding: 8px 20px; border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            background: rgba(255, 255, 255, 0.03); gap: 8px;
            flex-shrink: 0;
          }
          .nav-btn {
            flex: 1; height: 46px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 2px;
            transition: all 0.2s; position: relative;
          }
          .nav-btn:hover { background: var(--secondary-background-color, rgba(255, 255, 255, 0.08)); }
          .nav-btn.active { 
            background: var(--primary-color, rgba(255, 255, 255, 0.15)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .nav-btn.power-on { color: #FFD700; }
          .nav-btn ha-icon { --mdc-icon-size: 20px; }
          .nav-label { font-size: 10px; line-height: 10px; opacity: 0.75; letter-spacing: 0.4px; }

          /* Climate Specific */
          .climate-slider-group { display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .climate-dual-wrapper { display: flex; gap: 24px; justify-content: center; width: 100%; }
          .climate-label { font-size: 12px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }


        </style>
        <div class="hki-light-popup-container">
          <div class="hki-light-popup-header">
            <span class="hki-light-popup-title">
              <span id="hkiHeaderIconSlot"></span>
              <span class="hki-light-popup-title-text">
                ${safeTitle(entityName)}
                <span class="hki-light-popup-state">${this._getPopupHeaderState(isOnEffective ? brightness + '%' : (isUnavailable ? 'Unavailable' : 'Off'))}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </span>
            </span>
            <div class="hki-light-popup-header-controls">
              ${isGroup ? '<button class="header-btn" id="individualLightsBtn"><ha-icon icon="mdi:lightbulb-group-outline"></ha-icon></button>' : ''}
              <button class="header-btn" id="historyBtn">
                <ha-icon icon="mdi:chart-box-outline"></ha-icon>
              </button>
              <button class="header-btn" id="closeBtn">
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
          </div>
          
          <div class="hki-light-popup-tabs">
            ${this._config.popup_show_favorites !== false ? `
              <button class="hki-light-popup-tab ${this._activeView === 'favorites' ? 'active' : ''}" id="scenesBtn" style="${this._activeView === 'favorites' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:star"></ha-icon><span>Favorites</span></button>
            ` : ''}
            ${this._config.popup_show_effects !== false ? `
              <button class="hki-light-popup-tab ${this._activeView === 'effects' ? 'active' : ''}" id="effectsBtn" style="${this._activeView === 'effects' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:auto-fix"></ha-icon><span>Effects</span></button>
            ` : ''}
          </div>
          
          <div class="hki-light-popup-content ${this._activeView === 'favorites' ? 'view-favorites' : ''}">
            ${this._getDomain() === 'climate' 
              ? this._renderClimateContent(entity) 
              : this._renderContent(isOn, brightness, supportsTemp, supportsColor, effectList, currentEffect, isGroup)
            }
          </div>
          
          <div class="bottom-nav">
            ${
              this._getDomain() === "climate"
                ? this._renderClimateNav(entity)
                : `
                  <button class="nav-btn ${isOnEffective ? "power-on" : ""}" id="powerBtn" style="${isOnEffective ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                    <ha-icon icon="mdi:power"></ha-icon>
                    ${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Power</span>'}
                  </button>
                  <button class="nav-btn ${this._activeView === "brightness" ? "active" : ""}" id="brightnessBtn" style="${this._activeView === "brightness" ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                    <ha-icon icon="mdi:brightness-6"></ha-icon>
                    ${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Bright</span>'}
                  </button>
                  ${
                    supportsTemp
                      ? `<button class="nav-btn ${this._activeView === "temperature" ? "active" : ""}" id="temperatureBtn" style="${this._activeView === "temperature" ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                          <ha-icon icon="mdi:thermometer"></ha-icon>
                          ${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Temp</span>'}
                        </button>`
                      : ""
                  }
                  ${
                    supportsColor
                      ? `<button class="nav-btn ${this._activeView === "color" ? "active" : ""}" id="colorBtn" style="${this._activeView === "color" ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                          <ha-icon icon="mdi:palette"></ha-icon>
                          ${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Color</span>'}
                        </button>`
                      : ""
                  }
                `
            }
          </div>
        </div>
      `;

      const container = portal.querySelector('.hki-light-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;

      portal.addEventListener('mousedown', (e) => {
        isBackgroundClick = (e.target === portal);
      });
      portal.addEventListener('touchstart', (e) => {
        isBackgroundClick = (e.target === portal);
      }, { passive: true });

      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) {
          this._closePopup();
        }
        isBackgroundClick = false;
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      // Populate header icon (avoid rendering lit-html objects into innerHTML)
      try {
        const slot = portal.querySelector('#hkiHeaderIconSlot');
        if (slot) {
          slot.innerHTML = '';
          const __cfgIconRendered = ((this.renderTemplate('icon', this._config.icon || '') || '').toString().trim());
          const cfgIcon = (__cfgIconRendered && __cfgIconRendered !== '[object Object]') ? __cfgIconRendered : null;
          {
            // Always use ha-state-icon so we can keep HA-native coloring behavior
            const el = document.createElement('ha-state-icon');
            el.hass = this.hass;
            el.stateObj = entity;
            el.style.setProperty('--mdc-icon-size', '22px');

            if (cfgIcon) {
              // Allow custom icon, but keep entity state/color behavior
              el.icon = cfgIcon;
            }

            // Apply custom icon_color if configured, else actual light/entity color
            const _slotIconColor = this._getPopupIconColor(this._getCurrentColor());
            if (_slotIconColor) {
              el.style.color = _slotIconColor;
            }

            slot.appendChild(el);
          }
        }
      } catch (e) {
        // ignore
      }

      this._setupPopupHandlers(portal);
      this._setupContentHandlers(portal);
      
      // Auto-switch to individual view if configured and it's a group
      if (defaultView === 'individual' && isGroup) {
        const content = portal.querySelector('.hki-light-popup-content');
        if (content) {
          content.innerHTML = this._renderIndividualView();
          this._setupContentHandlers(portal);
        }
      }
      
      if (this._activeView === 'color') {
          setTimeout(() => this._setInitialColorIndicator(), 100);
      }
    }

    _renderClimatePopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.

      const name = this._getPopupName(entity);
      const attrs = entity.attributes || {};
      const mode = entity.state;
      const unit = '°';
      const color = this._getClimateColor(entity);
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();

      // Keep temp constraints in sync (also used by slider handlers)
      this._tempMin = attrs.min_temp || 7;
      this._tempMax = attrs.max_temp || 35;
      this._step = this._getTempStep();

      const presetList = attrs.preset_modes || [];
      const fanList = attrs.fan_modes || [];

      const valueSize = this._config.popup_value_font_size || 36;
      const valueWeight = this._config.popup_value_font_weight || 300;

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      const renderStateLine = () => {
        const cur = this._getClimateBadgeTemperature(entity);
        const curText = (cur !== undefined && cur !== null && cur !== '') ? ` • ${cur}${unit}` : '';
        return `${String(mode).replace(/_/g, ' ')}${curText}`;
      };

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-touch-callout: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-tabs {
            display: flex; gap: 8px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .tab-btn {
            flex: 1; height: 40px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.2s; font-size: 14px; font-weight: 500;
          }
          .tab-btn:hover { background: var(--secondary-background-color, rgba(255,255,255,0.08)); }
          .tab-btn.active { 
            background: var(--primary-color, rgba(255,255,255,0.12)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }

          .hki-popup-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; min-height: 0; }
          .climate-controls-view { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
          .sliders-wrapper { display: flex; gap: 24px; justify-content: center; width: 100%; align-items: center; }
          .slider-group { display: flex; flex-direction: column; align-items: center; gap: 12px; height: 320px; width: 80px; }
          .value-display { font-size: ${valueSize}px; font-weight: ${valueWeight}; text-align: center; }
          .value-display span { font-size: ${Math.max(14, Math.round(valueSize/2))}px; opacity: 0.7; }
          .slider-label { font-size: 12px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }

          .vertical-slider-track {
            width: 100%; flex: 1; 
            background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .vertical-slider-fill {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: ${color}; transition: background 0.3s;
            border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
          }
          .vertical-slider-thumb {
            position: absolute; left: 50%; transform: translateX(-50%);
            width: 90px; height: 6px; background: white;
            border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            pointer-events: none;
          }

          /* Vertical slider with +/- buttons */
          .slider-with-buttons {
            position: relative;
            width: 100%;
            display: block;
          }
          .slider-center {
            width: fit-content;
            margin: 0 auto;
          }
          .vertical-temp-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: absolute;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
          }
          .vertical-temp-btn {
            width: 48px; height: 48px; border-radius: 50%; border: none;
            background: var(--secondary-background-color, rgba(255,255,255,0.1));
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .vertical-temp-btn:hover {
            background: var(--primary-color, rgba(255,255,255,0.2));
            transform: scale(1.1);
          }
          .vertical-temp-btn:active {
            transform: scale(0.95);
          }
          .vertical-temp-btn ha-icon {
            --mdc-icon-size: 24px;
          }

          /* Circular slider styles */
          .circular-slider-wrapper {
            display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%;
            position: relative;
          }
          .circular-slider-container {
            position: relative; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; user-select: none; flex-shrink: 0;
          }
          .circular-slider-svg {
            position: absolute; top: 0; left: 0; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          }
          .circular-value-display {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            text-align: center; pointer-events: none;
          }
          .circular-temp-label-top {
            opacity: 0.6; text-transform: uppercase; letter-spacing: 1.5px;
            margin-bottom: 12px;
          }
          .circular-temp-value {
            color: var(--primary-text-color);
            line-height: 1;
          }
          .circular-temp-value span {
            opacity: 0.7;
          }
          .circular-temp-buttons {
            display: flex; flex-direction: column; gap: 12px;
            position: absolute; right: 0px;
          }
          .circular-temp-btn {
            width: 48px; height: 48px; border-radius: 50%; border: none;
            background: var(--secondary-background-color, rgba(255,255,255,0.1));
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .circular-temp-btn:hover {
            background: var(--primary-color, rgba(255,255,255,0.2));
            transform: scale(1.1);
          }
          .circular-temp-btn:active {
            transform: scale(0.95);
          }
          .circular-temp-btn ha-icon {
            --mdc-icon-size: 24px;
          }

          .hki-popup-nav {
            display: flex; justify-content: space-evenly; padding: 12px;
            background: rgba(255, 255, 255, 0.03); border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            gap: 8px; overflow-x: auto;
            flex-shrink: 0;
          }
          .nav-btn {
            min-width: 64px; height: 52px; border-radius: 12px; border: none;
            background: transparent; color: var(--primary-text-color);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 2px;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
          }
          .nav-btn:hover { background: var(--secondary-background-color, rgba(255, 255, 255, 0.1)); }
          .nav-btn.active { 
            background: var(--primary-color, rgba(255, 255, 255, 0.15)); 
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .nav-btn ha-icon { --mdc-icon-size: 22px; }
          .nav-label { font-size: 10px; line-height: 10px; opacity: 0.75; letter-spacing: 0.4px; text-transform: uppercase; }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700); z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }

          .list-container { width: 100%; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; max-height: 100%; }
          .list-item { padding: 14px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
          .list-item.active { background: ${color}; color: white; }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${((this.renderTemplate('icon', this._config.icon || '') || '').toString().trim()) || (entity.attributes && entity.attributes.icon) || HVAC_ICONS[mode] || 'mdi:thermostat'}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(renderStateLine())}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
                            <button class="header-btn" id="graphBtn"><ha-icon icon="mdi:chart-line"></ha-icon></button>
              <button class="header-btn" id="historyBtn"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-tabs">
            <button class="tab-btn ${this._activeView === 'main' ? 'active' : ''}" id="tabMain" style="${this._activeView === 'main' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:fire"></ha-icon><span>Heat</span></button>
            ${(this._config.popup_show_presets !== false && presetList.length) ? `<button class="tab-btn ${this._activeView === 'presets' ? 'active' : ''}" id="tabPresets" style="${this._activeView === 'presets' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:tune"></ha-icon><span>Presets</span></button>` : ''}
            ${fanList.length ? `<button class="tab-btn ${this._activeView === 'fan' ? 'active' : ''}" id="tabFan" style="${this._activeView === 'fan' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:fan"></ha-icon><span>Fan</span></button>` : ''}
          </div>

          <div class="hki-popup-content" id="popupContent">
            ${this._renderClimatePopupContent(entity, color)}
          </div>

          <div class="hki-popup-nav">
            ${this._renderClimatePopupHvacModes(entity)}
          </div>
        </div>
      `;

      const container = portal.querySelector('.hki-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());
      const historyBtn = portal.querySelector('#historyBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = 'history';
          const content = portal.querySelector('#popupContent');
          if (content) {
            content.innerHTML = `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
            setTimeout(() => this._loadHistory(), 100);
          }
          portal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        });
      }

      const graphBtn = portal.querySelector('#graphBtn');
      if (graphBtn) {
        graphBtn.addEventListener('click', () => {
          this._activeView = 'graphs';
          const content = portal.querySelector('#popupContent');
          if (content) {
            content.innerHTML = `<div class="graphs-container" id="graphsContainer"></div>`;
            setTimeout(() => this._mountClimateSensorTiles(portal), 50);
          }
          portal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        });
      }

      const tabMain = portal.querySelector('#tabMain');
      const tabPresets = portal.querySelector('#tabPresets');
      const tabFan = portal.querySelector('#tabFan');

      const switchView = (view) => {
        this._activeView = view;
        if (tabMain) tabMain.classList.toggle('active', view === 'main');
        if (tabPresets) tabPresets.classList.toggle('active', view === 'presets');
        if (tabFan) tabFan.classList.toggle('active', view === 'fan');

        const content = portal.querySelector('#popupContent');
        if (content) content.innerHTML = this._renderClimatePopupContent(this._getEntity(), color);

        if (view === 'main') {
          if (this._config.climate_use_circular_slider) {
            const ent2 = this._getEntity();
            const a2 = ent2?.attributes || {};
            const isR2 = (ent2?.state === 'heat_cool' || ent2?.state === 'auto') && a2.target_temp_high !== undefined && this._config.climate_show_target_range !== false;
            if (isR2) this._setupDualCircularSliderHandlers(portal); else this._setupCircularSliderHandlers(portal);
          } else {
            this._setupClimatePopupSliders(portal);
            this._setupVerticalPlusMinusButtons(portal);
          }
        }
        if (view === 'presets') this._setupClimatePopupListHandlers(portal, 'preset');
        if (view === 'fan') this._setupClimatePopupListHandlers(portal, 'fan');
      };

      if (tabMain) tabMain.addEventListener('click', () => switchView('main'));
      if (tabPresets) tabPresets.addEventListener('click', () => switchView('presets'));
      if (tabFan) tabFan.addEventListener('click', () => switchView('fan'));

      // HVAC mode buttons
      portal.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const hvacMode = btn.dataset.mode;
          if (!hvacMode) return;
          if (hvacMode !== 'off') {
            try { localStorage.setItem(`hki_climate_last_mode:${this._config.entity}`, hvacMode); } catch (e) {}
          }
          // Optimistic UI: highlight immediately
          this._optimisticHvacMode = hvacMode;
          portal.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = '';
            b.style.color = '';
          });
          btn.classList.add('active');
          if (HVAC_COLORS && HVAC_COLORS[hvacMode]) btn.style.color = HVAC_COLORS[hvacMode];

          this.hass.callService('climate', 'set_hvac_mode', { entity_id: this._config.entity, hvac_mode: hvacMode });
        });
      });

      if (this._activeView === 'main') {
        if (this._config.climate_use_circular_slider) {
          const ent3 = this._getEntity();
          const a3 = ent3?.attributes || {};
          const isR3 = (ent3?.state === 'heat_cool' || ent3?.state === 'auto') && a3.target_temp_high !== undefined && this._config.climate_show_target_range !== false;
          if (isR3) this._setupDualCircularSliderHandlers(portal); else this._setupCircularSliderHandlers(portal);
        } else {
          this._setupClimatePopupSliders(portal);
          this._setupVerticalPlusMinusButtons(portal);
        }
      }
      if (this._activeView === 'presets') this._setupClimatePopupListHandlers(portal, 'preset');
      if (this._activeView === 'fan') this._setupClimatePopupListHandlers(portal, 'fan');
    }

    _renderClimatePopupContent(entity, color) {
      if (!entity) return '';
      const attrs = entity.attributes || {};
      const mode = entity.state;

      if (this._activeView === 'history') {
        return `<div class=\"timeline-container\" data-view-type=\"history\" id=\"historyContainer\"><div class=\"history-loading\">Loading Timeline...</div></div>`;
      }

      if (this._activeView === 'graphs') {
        return `<div class=\"graphs-container\" id=\"graphsContainer\"></div>`;
      }

      if (this._activeView === 'presets') return this._renderClimatePopupList(attrs.preset_modes, attrs.preset_mode, 'preset', color);
      if (this._activeView === 'fan') return this._renderClimatePopupList(attrs.fan_modes, attrs.fan_mode, 'fan', color);

      if (mode === 'off') {
        return `<div class="climate-controls-view"><div style="opacity: 0.5; font-size: 18px; font-weight: 500;">System is Off</div></div>`;
      }

      // Use circular slider if enabled
      if (this._config.climate_use_circular_slider) {
        const isRange = (mode === 'heat_cool' || mode === 'auto') && (attrs.target_temp_high !== undefined && attrs.target_temp_low !== undefined) && (this._config.climate_show_target_range !== false);
        if (isRange) {
          return this._renderDualCircularTemperatureControl(entity, mode, color);
        }
        return this._renderCircularTemperatureControl(entity, mode, color);
      }

      const isRange = (mode === 'heat_cool' || mode === 'auto') && (attrs.target_temp_high !== undefined && attrs.target_temp_low !== undefined) && (this._config.climate_show_target_range !== false);
      const range = this._tempMax - this._tempMin;
      const unit = attrs.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
      const showButtons = this._config.climate_show_plus_minus === true;

      const renderSlider = (id, value, label) => {
        const v = (value === undefined || value === null) ? '--' : value;
        const pct = (value === undefined || value === null) ? 0 : ((value - this._tempMin) / range) * 100;
        const background = this._config.climate_show_gradient === false ? color : this._getTempGradient();
        // Clamp thumb position so it's always visible (at 0% and 100%)
        const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;
        return `
          <div class="slider-group">
            <div class="value-display" id="display-${id}">${v}<span>${unit}</span></div>
            <div class="vertical-slider-track" id="slider-${id}" data-type="${id}">
              <div class="vertical-slider-fill" style="height: ${pct}%; background: ${background};"></div>
              <div class="vertical-slider-thumb" style="bottom: ${thumbPos}"></div>
            </div>
            ${label ? `<div class="slider-label">${label}</div>` : ''}
          </div>
        `;
      };

      const wrapWithButtons = (sliderContent) => {
        if (!showButtons) return sliderContent;
        return `
          <div class="slider-with-buttons">
            <div class="slider-center">${sliderContent}</div>
            <div class="vertical-temp-buttons">
              <button class="vertical-temp-btn plus" data-action="plus">
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
              <button class="vertical-temp-btn minus" data-action="minus">
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
            </div>
          </div>
        `;
      };

      if (isRange) {
        const sliders = `<div class="sliders-wrapper">
          ${renderSlider('target_temp_low', attrs.target_temp_low, 'Low')}
          ${renderSlider('target_temp_high', attrs.target_temp_high, 'High')}
        </div>`;
        return `<div class="climate-controls-view">${wrapWithButtons(sliders)}</div>`;
      }

      const slider = `<div class="sliders-wrapper">
        ${renderSlider('temperature', attrs.temperature ?? attrs.current_temperature, 'Target')}
      </div>`;
      return `<div class="climate-controls-view">${wrapWithButtons(slider)}</div>`;
    }

    _renderCircularTemperatureControl(entity, mode, color) {
      const attrs = entity.attributes || {};
      const temperature = this._optimisticClimateTemp ?? attrs.temperature ?? attrs.current_temperature;
      const unit = attrs.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
      const range = this._tempMax - this._tempMin;
      const value = temperature ?? this._tempMin;
      const percentage = ((value - this._tempMin) / range) * 100;
      const showButtons = this._config.climate_show_plus_minus === true;
      const useGradient = this._config.climate_show_gradient !== false; // Default true
      
      // Calculate arc length for partial circle (270 degrees = 75% of circle)
      const maxArcLength = 628.32 * 0.75; // 75% of full circumference
      const arcLength = (percentage / 100) * maxArcLength;
      
      // Calculate thumb position on 270-degree arc
      // Arc starts at 135 degrees and spans 270 degrees
      const startAngle = 135 * (Math.PI / 180); // Convert to radians
      const arcAngle = (percentage / 100) * 270 * (Math.PI / 180); // Angle within the arc
      const totalAngle = startAngle + arcAngle;
      const thumbX = 140 + 100 * Math.cos(totalAngle);
      const thumbY = 140 + 100 * Math.sin(totalAngle);
      
      // Get mode label
      const modeLabels = {
        'heat': 'HEATING',
        'cool': 'COOLING',
        'heat_cool': 'AUTO',
        'auto': 'AUTO',
        'dry': 'DRY',
        'fan_only': 'FAN',
        'off': 'OFF'
      };
      const modeLabel = modeLabels[mode] || mode.toUpperCase();
      
      // Get font sizes from config
      const valueSize = this._config.popup_value_font_size || 64;
      const labelSize = this._config.popup_label_font_size || 11;
      const valueWeight = this._config.popup_value_font_weight || 200;
      const labelWeight = this._config.popup_label_font_weight || 500;
      
      // Gradient goes from cold (cyan) at start to hot (orange) at end
      const strokeColor = useGradient ? 'url(#tempGradient)' : color;
      
      return `
        <div class="climate-controls-view">
          <div class="circular-slider-wrapper">
            <div class="circular-slider-container" id="circularSlider">
              <svg class="circular-slider-svg" viewBox="0 0 280 280" width="280" height="280">
                ${useGradient ? `
                <defs>
                  <linearGradient id="tempGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#00D9FF;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#00E5A0;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#DFFF00;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#FFB800;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
                  </linearGradient>
                </defs>
                ` : ''}
                
                <!-- Background arc (partial circle) -->
                <circle 
                  cx="140" cy="140" r="100" 
                  fill="none" 
                  stroke="var(--divider-color, rgba(255,255,255,0.05))" 
                  stroke-width="20"
                  stroke-dasharray="${maxArcLength} 628.32"
                  transform="rotate(135 140 140)"
                />
                
                <!-- Progress arc with gradient (partial circle) -->
                <circle 
                  cx="140" cy="140" r="100" 
                  fill="none" 
                  stroke="${strokeColor}" 
                  stroke-width="20"
                  stroke-linecap="round"
                  stroke-dasharray="${arcLength} 628.32"
                  transform="rotate(135 140 140)"
                  class="circular-progress"
                  id="circularProgress"
                />
                
                <!-- Thumb handle -->
                <circle 
                  cx="${thumbX}" 
                  cy="${thumbY}" 
                  r="12" 
                  fill="white"
                  stroke="var(--card-background-color, #1c1c1c)"
                  stroke-width="3"
                  class="circular-thumb"
                  id="circularThumb"
                  style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"
                />
              </svg>
              
              <div class="circular-value-display">
                <div class="circular-temp-label-top" style="font-size: ${labelSize}px; font-weight: ${labelWeight};">${modeLabel} TO</div>
                <div class="circular-temp-value" id="circularTempValue" style="font-size: ${valueSize}px; font-weight: ${valueWeight};">${value}<span style="font-size: ${valueSize / 2}px;">${unit}</span></div>
              </div>
            </div>
            
            ${showButtons ? `
              <div class="circular-temp-buttons">
                <button class="circular-temp-btn plus" data-action="plus">
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
                <button class="circular-temp-btn minus" data-action="minus">
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    _renderDualCircularTemperatureControl(entity, mode, color) {
      const attrs = entity.attributes || {};
      const unit = attrs.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
      const range = this._tempMax - this._tempMin;
      const showButtons = this._config.climate_show_plus_minus === true;
      const valueSize = this._config.popup_value_font_size || 48;
      const labelSize = this._config.popup_label_font_size || 11;
      const valueWeight = this._config.popup_value_font_weight || 200;
      const labelWeight = this._config.popup_label_font_weight || 500;

      const renderMiniCircle = (id, value, label, accent) => {
        const pct = Math.max(0, Math.min(100, ((value - this._tempMin) / range) * 100));
        const maxArc = 628.32 * 0.75;
        const arcLen = (pct / 100) * maxArc;
        const startAngle = 135 * (Math.PI / 180);
        const arcAngle = (pct / 100) * 270 * (Math.PI / 180);
        const totalAngle = startAngle + arcAngle;
        const tx = 110 + 78 * Math.cos(totalAngle);
        const ty = 110 + 78 * Math.sin(totalAngle);
        return `
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div style="font-size:${labelSize}px;font-weight:${labelWeight};opacity:0.6;text-transform:uppercase;letter-spacing:1.5px;">${label}</div>
            <div style="position:relative;width:220px;height:220px;display:flex;align-items:center;justify-content:center;cursor:pointer;" id="circularSlider_${id}">
              <svg style="position:absolute;top:0;left:0;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3));" viewBox="0 0 220 220" width="220" height="220">
                <circle cx="110" cy="110" r="78" fill="none" stroke="var(--divider-color,rgba(255,255,255,0.05))" stroke-width="16" stroke-dasharray="${628.32*0.75}" transform="rotate(135 110 110)"/>
                <circle cx="110" cy="110" r="78" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${arcLen} 628.32" transform="rotate(135 110 110)" id="circularProgress_${id}"/>
                <circle cx="${tx}" cy="${ty}" r="10" fill="white" stroke="var(--card-background-color,#1c1c1c)" stroke-width="3" id="circularThumb_${id}" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"/>
              </svg>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;">
                <div id="circularTempValue_${id}" style="font-size:${valueSize}px;font-weight:${valueWeight};line-height:1;">${value !== null && value !== undefined ? value : '--'}<span style="font-size:${valueSize/2}px;opacity:0.7;">${unit}</span></div>
              </div>
            </div>
            ${showButtons ? `
              <div style="display:flex;gap:12px;">
                <button class="circular-temp-btn minus" data-action="minus" data-slider="${id}" style="width:44px;height:44px;border-radius:50%;border:none;background:var(--secondary-background-color,rgba(255,255,255,0.1));color:var(--primary-text-color);cursor:pointer;display:flex;align-items:center;justify-content:center;"><ha-icon icon="mdi:minus"></ha-icon></button>
                <button class="circular-temp-btn plus" data-action="plus" data-slider="${id}" style="width:44px;height:44px;border-radius:50%;border:none;background:var(--secondary-background-color,rgba(255,255,255,0.1));color:var(--primary-text-color);cursor:pointer;display:flex;align-items:center;justify-content:center;"><ha-icon icon="mdi:plus"></ha-icon></button>
              </div>
            ` : ''}
          </div>
        `;
      };

      const low = this._optimisticTempLow ?? attrs.target_temp_low;
      const high = this._optimisticTempHigh ?? attrs.target_temp_high;

      return `
        <div class="climate-controls-view">
          <div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;width:100%;flex-wrap:wrap;">
            ${renderMiniCircle('low', low, 'Cool to', '#1E90FF')}
            ${renderMiniCircle('high', high, 'Heat to', 'darkorange')}
          </div>
        </div>
      `;
    }

    _renderClimatePopupList(items, current, type, color) {
      if (!items || !items.length) return '<div style="opacity:0.6">Not available</div>';
      return `
        <div class="list-container">
          ${items.map(item => `
            <div class="list-item ${item === current ? 'active' : ''}" data-value="${item}" data-type="${type}">
              <span>${item}</span>
              ${item === current ? '<ha-icon icon="mdi:check"></ha-icon>' : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    _renderClimatePopupHvacModes(entity) {
      const modes = entity?.attributes?.hvac_modes || [];
      const current = this._optimisticHvacMode ?? entity?.state;
      const labelize = (s) => String(s || '').replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
      return modes.map(m => {
        const isActive = m === current;
        const customStyle = isActive ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false);
        const colorStyle = isActive ? `color:${(m === 'off') ? 'var(--primary-text-color)' : ((HVAC_COLORS && HVAC_COLORS[m]) || '')}` : '';
        const combinedStyle = [customStyle, colorStyle].filter(s => s).join('; ');
        
        return `
        <button class="nav-btn ${isActive ? 'active' : ''}" data-mode="${m}" style="${combinedStyle}">
          <ha-icon icon="${HVAC_ICONS[m] || 'mdi:thermostat'}"></ha-icon>
          ${this._config.popup_hide_button_text ? '' : `<span class="nav-label">${labelize(m)}</span>`}
        </button>
      `;
      }).join('');
    }





    
    async _mountClimateSensorTiles(portal) {
      try {
        const host = portal.querySelector('#graphsContainer');
        if (!host) return;
        host.innerHTML = '';

        const climateEnt = this._getEntity();
        if (!climateEnt) {
          host.innerHTML = '<div class="history-loading">No entity selected</div>';
          return;
        }

        const attrs = climateEnt.attributes || {};

        const exists = (eid) => !!(eid && this.hass && this.hass.states && this.hass.states[eid]);

        // Prefer explicit overrides; fall back to auto-discovery; finally fall back to attributes history on the climate entity
        const tempOverride = this._config.climate_current_temperature_entity || '';
        const humOverride = this._config.climate_humidity_entity || '';
        const pressOverride = this._config.climate_pressure_entity || '';

        const base = (climateEnt.entity_id || '').replace('climate.', '');
        const firstExisting = (candidates) => candidates.find(exists) || '';

        const tempAuto = firstExisting([
          `sensor.${base}_temperature`,
          `sensor.${base}_temp`,
          `sensor.${base}_current_temperature`,
          `sensor.${base}_current_temp`,
          `sensor.${base}_temp_current`,
        ]);
        const humAuto = firstExisting([
          `sensor.${base}_humidity`,
          `sensor.${base}_current_humidity`,
          `sensor.${base}_rh`,
          `sensor.${base}_relative_humidity`,
        ]);
        const pressAuto = firstExisting([
          `sensor.${base}_pressure`,
          `sensor.${base}_air_pressure`,
          `sensor.${base}_barometric_pressure`,
        ]);

        // Attribute fallbacks (for value display) — these are common on climate entities
        const attrKeys = {
          temperature: ['current_temperature', 'temperature'],
          humidity: ['current_humidity', 'humidity'],
          pressure: ['current_pressure', 'pressure', 'air_pressure'],
        };
        const pickAttrKey = (keys) => keys.find((k) => attrs[k] !== undefined && attrs[k] !== null);

        const tiles = [];

        const addTile = (key, titleKey, unitFallback, overrideId, autoId, attrKeyCandidates, titleOverride) => {
          const graphEntity = overrideId || autoId || '';
          const hasGraphEntity = exists(graphEntity);
          const attrKey = pickAttrKey(attrKeyCandidates);

          // If we have neither a sensor entity nor an attribute to show, skip
          if (!hasGraphEntity && !attrKey) return;

          tiles.push({
            key,
            titleKey,
            titleOverride,
            graphEntity: hasGraphEntity ? graphEntity : null,
            attrKey: hasGraphEntity ? null : attrKey, // only use attribute-series when no override/auto entity exists
            unitFallback,
          });
        };

        addTile('temperature', 'current_temperature', this._getTempUnit(climateEnt), tempOverride, tempAuto, attrKeys.temperature, this._config.climate_temperature_name);
        addTile('humidity', 'current_humidity', '%', humOverride, humAuto, attrKeys.humidity, this._config.climate_humidity_name);
        addTile('pressure', 'current_pressure', 'hPa', pressOverride, pressAuto, attrKeys.pressure, this._config.climate_pressure_name);

        if (!tiles.length) {
          host.innerHTML = '<div class="history-loading">No sensor data found. Configure Climate: Current Temp / Humidity / Pressure entities.</div>';
          return;
        }

        host.innerHTML = `<div class="sensor-tiles" id="sensorTiles"></div>`;
        const tilesHost = host.querySelector('#sensorTiles');

        const colorFor = (n) => {
          const nn = Math.max(0, Math.min(1, n));
          const hue = 200 * (1 - nn); // 200=blue, 0=red
          return `hsl(${hue}, 90%, 60%)`;
        };

        const parseSeries = (history, attrKey = null) => {
          const points = [];
          for (const it of (history || [])) {
            const ts = (it?.lu ?? it?.last_updated ?? it?.last_changed);
            if (!ts) continue;
            let raw = null;
            if (attrKey) {
              const a = it?.a ?? it?.attributes;
              raw = a ? a[attrKey] : null;
            } else {
              raw = (it?.s ?? it?.state);
            }
            const n = (typeof raw === 'number') ? raw : parseFloat(String(raw));
            if (!Number.isFinite(n)) continue;
            points.push({ t: new Date(ts).getTime(), v: n });
          }
          points.sort((a, b) => a.t - b.t);
          return points;
        };

        const downsample = (pts, maxN = 60) => {
          if (pts.length <= maxN) return pts;
          const step = Math.ceil(pts.length / maxN);
          const out = [];
          for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
          if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
          return out;
        };

        const buildSvg = (pts, width = 260, height = 56) => {
          if (!pts || pts.length < 2) return null;
          const minV = Math.min(...pts.map(p => p.v));
          const maxV = Math.max(...pts.map(p => p.v));
          const span = (maxV - minV) || 1;
          const t0 = pts[0].t;
          const t1 = pts[pts.length - 1].t;
          const tSpan = (t1 - t0) || 1;

          const xy = pts.map(p => {
            const x = (p.t - t0) / tSpan * width;
            const y = height - ((p.v - minV) / span * height);
            return { x, y, v: p.v };
          });

          const gradId = `grad-${Math.random().toString(16).slice(2)}`;
          const stops = [];
          const stopCount = Math.min(12, xy.length);
          for (let i = 0; i < stopCount; i++) {
            const idx = Math.round(i * (xy.length - 1) / (stopCount - 1 || 1));
            const p = xy[idx];
            const n = (p.v - minV) / span;
            const offset = (p.x / width) * 100;
            stops.push(`<stop offset="${offset.toFixed(1)}%" stop-color="${colorFor(n)}" />`);
          }

          const line = xy.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          const area = `0,${height.toFixed(1)} ${line} ${width.toFixed(1)},${height.toFixed(1)}`;

          return {
            svg: `
              <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="sparkline">
                <defs>
                  <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
                    ${stops.join('')}
                  </linearGradient>
                </defs>
                <polygon points="${area}" fill="url(#${gradId})" opacity="0.12"></polygon>
                <polyline points="${line}" fill="none" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
              </svg>`
          };
        };

        const climateName = this._config.name || attrs.friendly_name || climateEnt.entity_id;
        const pretty = (s) => String(s || '')
          .split('_')
          .filter(Boolean)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        // Render shells first
        tilesHost.innerHTML = tiles.map((t, idx) => {
          // Title should be: <Climate Name> <Attribute>
          // If we are charting a sensor override/auto entity, we still use the tile label
          // If we are charting a climate attribute series, we use the attribute key prettified
          const attrTitle = t.titleOverride || pretty(t.titleKey || t.attrKey || t.key);
          let name = `${climateName} ${attrTitle}`;
          let unit = t.unitFallback || '';
          let value = '--';

          if (t.graphEntity) {
            const st = this.hass.states[t.graphEntity];
            unit = st?.attributes?.unit_of_measurement || unit;
            value = st?.state ?? '--';
          } else if (t.attrKey) {
            value = attrs[t.attrKey];
          }

          return `
            <div class="sensor-tile" data-key="${t.key}">
              <div class="sensor-tile-top">
                <div class="sensor-tile-title">${name}</div>
                <div class="sensor-tile-value">${value}<span class="sensor-tile-unit">${unit}</span></div>
              </div>
              <div class="sensor-tile-graph" id="tileGraph-${idx}">
                <div class="history-loading" style="padding: 10px 0;">Loading…</div>
              </div>
            </div>`;
        }).join('');

        const startTs = new Date(Date.now() - (24 * 60 * 60 * 1000));

        // Fetch history + render sparklines
        await Promise.all(tiles.map(async (t, idx) => {
          const holder = portal.querySelector(`#tileGraph-${idx}`);
          if (!holder) return;
          try {
            // If we are charting a sensor entity, we can use minimal_response
            // If we are charting attributes from the climate entity, we must request full history to get attributes
            const entityId = t.graphEntity || climateEnt.entity_id;
            const wantAttrs = !t.graphEntity && !!t.attrKey;
            const url = wantAttrs
              ? `history/period/${startTs.toISOString()}?filter_entity_id=${encodeURIComponent(entityId)}`
              : `history/period/${startTs.toISOString()}?filter_entity_id=${encodeURIComponent(entityId)}&minimal_response`;

            const data = await this.hass.callApi('GET', url);
            const series = (Array.isArray(data) && data[0]) ? data[0] : [];
            const pts = parseSeries(series, wantAttrs ? t.attrKey : null);
            const ds = downsample(pts, 80);
            if (!ds.length) {
              holder.innerHTML = '<div class="history-loading" style="padding: 10px 0;">No history</div>';
              return;
            }
            const res = buildSvg(ds, 260, 56);
            holder.innerHTML = res ? res.svg : '<div class="history-loading" style="padding: 10px 0;">No data</div>';
          } catch (e) {
            console.warn('sparkline error', t.key, e);
            holder.innerHTML = '<div class="history-loading" style="padding: 10px 0;">Error</div>';
          }
        }));

      } catch (e) {
        console.error('Failed to mount sensor tiles', e);
      }
    }

    _setupClimatePopupSliders(portal) {
      const tracks = portal.querySelectorAll('.vertical-slider-track');
      const ent = this._getEntity();
      const unit = ent?.attributes?.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
      tracks.forEach(track => {
        const type = track.dataset.type; // temperature, target_temp_low, target_temp_high

        const update = (e) => {
          this._isDragging = true;
          const rect = track.getBoundingClientRect();
          const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
          let rawVal = this._tempMin + (y * (this._tempMax - this._tempMin));
          let val = Math.round(rawVal / this._step) * this._step;
          val = Math.round(val * 10) / 10;

          const pct = ((val - this._tempMin) / (this._tempMax - this._tempMin)) * 100;
          const fill = track.querySelector('.vertical-slider-fill');
          const thumb = track.querySelector('.vertical-slider-thumb');
          const display = portal.querySelector(`#display-${type}`);

          if (fill) fill.style.height = `${pct}%`;
          // Clamp thumb position so it stays visible at 0% and 100%
          const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;
          if (thumb) thumb.style.bottom = thumbPos;
          if (display) display.innerHTML = `${val}<span>${unit}</span>`;

          return val;
        };

        const finish = (e) => {
          const ev = e.changedTouches ? e.changedTouches[0] : e;
          const val = update(ev);
          this._isDragging = false;

          const payload = { entity_id: this._config.entity };
          if (type === 'temperature') payload.temperature = val;
          else if (type === 'target_temp_low') payload.target_temp_low = val;
          else if (type === 'target_temp_high') payload.target_temp_high = val;

          // Validate ranges
          const ent = this._getEntity();
          if (ent && (type === 'target_temp_low' || type === 'target_temp_high')) {
            if (type === 'target_temp_low' && val >= ent.attributes.target_temp_high) return;
            if (type === 'target_temp_high' && val <= ent.attributes.target_temp_low) return;
          }

          this.hass.callService('climate', 'set_temperature', payload);

          document.removeEventListener('mousemove', updateWrapper);
          document.removeEventListener('mouseup', finish);
          document.removeEventListener('touchmove', touchWrapper);
          document.removeEventListener('touchend', finish);
        };

        const updateWrapper = (e) => update(e);
        const touchWrapper = (e) => { e.preventDefault(); update(e.touches[0]); };

        track.addEventListener('mousedown', (e) => {
          updateWrapper(e);
          document.addEventListener('mousemove', updateWrapper);
          document.addEventListener('mouseup', finish);
        });

        track.addEventListener('touchstart', (e) => {
          touchWrapper(e);
          document.addEventListener('touchmove', touchWrapper, { passive: false });
          document.addEventListener('touchend', finish);
        });
      });
    }

    _setupCircularSliderHandlers(portal) {
      const circularSlider = portal.querySelector('#circularSlider');
      if (!circularSlider) return;

      const ent = this._getEntity();
      const unit = ent?.attributes?.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
      
      // +/- button handlers
      let minusBtn = portal.querySelector('.circular-temp-btn.minus');
      let plusBtn = portal.querySelector('.circular-temp-btn.plus');

      // Prevent duplicate listeners when the popup re-renders
      if (minusBtn && minusBtn.parentNode) {
        const clone = minusBtn.cloneNode(true);
        minusBtn.parentNode.replaceChild(clone, minusBtn);
        minusBtn = clone;
      }
      if (plusBtn && plusBtn.parentNode) {
        const clone = plusBtn.cloneNode(true);
        plusBtn.parentNode.replaceChild(clone, plusBtn);
        plusBtn = clone;
      }

      const applyDelta = (dir) => {
        const ent = this._getEntity();
        const attrs = ent?.attributes || {};
        const step = this._getTempStep();
        this._step = step;

        const currentRaw = this._optimisticClimateTemp ?? attrs.temperature ?? attrs.current_temperature ?? this._tempMin;
        const current = this._roundToStep(currentRaw, step);
        let newVal = this._roundToStep(current + (dir * step), step);
        newVal = this._clampTemp(newVal);

        // Keep UI stable until HA confirms the new temperature
        this._optimisticClimateTemp = newVal;
        this._updateCircularSliderUI(portal, newVal, unit);

        this.hass.callService('climate', 'set_temperature', {
          entity_id: this._config.entity,
          temperature: newVal
        });
      };

      if (minusBtn) {
        minusBtn.addEventListener('click', () => applyDelta(-1));
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => applyDelta(1));
      }

      // Circular slider drag handlers
      const svg = circularSlider.querySelector('.circular-slider-svg');
      const progress = circularSlider.querySelector('#circularProgress');
      const thumb = circularSlider.querySelector('#circularThumb');
      const valueDisplay = circularSlider.querySelector('#circularTempValue');
      
      const maxArcLength = 628.32 * 0.75; // 75% of full circumference (270 degrees)
      
      const updateFromPoint = (clientX, clientY) => {
        this._isDragging = true;
        const rect = svg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate angle from center
        let angle = Math.atan2(clientY - centerY, clientX - centerX);
        
        // Convert to degrees
        let degrees = angle * 180 / Math.PI;
        
        // Normalize to 0-360
        if (degrees < 0) degrees += 360;
        
        // The arc starts at 135 degrees and goes to 405 degrees (135 + 270)
        // Adjust the angle to be relative to the start of the arc
        let arcDegrees = degrees - 135;
        if (arcDegrees < 0) arcDegrees += 360;
        
        // Constrain to 270-degree range
        if (arcDegrees > 270) {
          // Snap to closest end
          if (arcDegrees < 315) {
            arcDegrees = 270; // Snap to end
          } else {
            arcDegrees = 0; // Snap to start
          }
        }
        
        const percentage = (arcDegrees / 270) * 100;
        let rawVal = this._tempMin + (percentage / 100) * (this._tempMax - this._tempMin);
        const step = this._getTempStep();
        this._step = step;
        let val = this._roundToStep(rawVal, step);
        val = this._clampTemp(val);
        this._optimisticClimateTemp = val;
        
        const finalPct = ((val - this._tempMin) / (this._tempMax - this._tempMin)) * 100;
        const arcLength = (finalPct / 100) * maxArcLength;
        
        // Calculate thumb position
        const startAngle = 135 * (Math.PI / 180);
        const arcAngle = (finalPct / 100) * 270 * (Math.PI / 180);
        const totalAngle = startAngle + arcAngle;
        const thumbX = 140 + 100 * Math.cos(totalAngle);
        const thumbY = 140 + 100 * Math.sin(totalAngle);
        
        if (progress) progress.setAttribute('stroke-dasharray', `${arcLength} 628.32`);
        if (thumb) {
          thumb.setAttribute('cx', thumbX);
          thumb.setAttribute('cy', thumbY);
        }
        if (valueDisplay) {
          const valueSize = this._config.popup_value_font_size || 64;
          valueDisplay.innerHTML = `${val}<span style="font-size: ${valueSize / 2}px;">${unit}</span>`;
        }
        
        return val;
      };
      
      const finish = (e) => {
        const ev = e.changedTouches ? e.changedTouches[0] : e;
        const val = updateFromPoint(ev.clientX, ev.clientY);
        this._isDragging = false;
        
        this.hass.callService('climate', 'set_temperature', { 
          entity_id: this._config.entity, 
          temperature: val 
        });
        
        document.removeEventListener('mousemove', moveWrapper);
        document.removeEventListener('mouseup', finish);
        document.removeEventListener('touchmove', touchWrapper);
        document.removeEventListener('touchend', finish);
      };
      
      const moveWrapper = (e) => updateFromPoint(e.clientX, e.clientY);
      const touchWrapper = (e) => { 
        e.preventDefault(); 
        updateFromPoint(e.touches[0].clientX, e.touches[0].clientY); 
      };
      
      circularSlider.addEventListener('mousedown', (e) => {
        updateFromPoint(e.clientX, e.clientY);
        document.addEventListener('mousemove', moveWrapper);
        document.addEventListener('mouseup', finish);
      });
      
      circularSlider.addEventListener('touchstart', (e) => {
        updateFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        document.addEventListener('touchmove', touchWrapper, { passive: false });
        document.addEventListener('touchend', finish);
      });
      
      // Setup vertical +/- buttons if they exist
      this._setupVerticalPlusMinusButtons(portal);
    }

    _setupDualCircularSliderHandlers(portal) {
      const step = this._getTempStep();

      const setupOne = (slotId, attrLow, attrHigh, optimisticKey, serviceParam) => {
        const el = portal.querySelector(`#circularSlider_${slotId}`);
        if (!el) return;
        const svg = el.querySelector('svg');
        const progress = el.querySelector(`#circularProgress_${slotId}`);
        const thumb = el.querySelector(`#circularThumb_${slotId}`);
        const valueDisplay = el.querySelector(`#circularTempValue_${slotId}`);
        const unit = this._getEntity()?.attributes?.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
        const maxArc = 628.32 * 0.75;
        const valueSize = this._config.popup_value_font_size || 48;

        const applyValue = (val) => {
          this[optimisticKey] = val;
          const pct = ((val - this._tempMin) / (this._tempMax - this._tempMin)) * 100;
          const arcLen = (pct / 100) * maxArc;
          const startAngle = 135 * (Math.PI / 180);
          const arcAngle = (pct / 100) * 270 * (Math.PI / 180);
          const totalAngle = startAngle + arcAngle;
          const tx = 110 + 78 * Math.cos(totalAngle);
          const ty = 110 + 78 * Math.sin(totalAngle);
          if (progress) progress.setAttribute('stroke-dasharray', `${arcLen} 628.32`);
          if (thumb) { thumb.setAttribute('cx', tx); thumb.setAttribute('cy', ty); }
          if (valueDisplay) valueDisplay.innerHTML = `${val}<span style="font-size:${valueSize/2}px;opacity:0.7;">${unit}</span>`;
        };

        const getFromPoint = (clientX, clientY) => {
          const rect = svg.getBoundingClientRect();
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          let angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
          if (angle < 0) angle += 360;
          let arcDeg = angle - 135;
          if (arcDeg < 0) arcDeg += 360;
          if (arcDeg > 270) arcDeg = arcDeg < 315 ? 270 : 0;
          let raw = this._tempMin + (arcDeg / 270) * (this._tempMax - this._tempMin);
          return this._clampTemp(this._roundToStep(raw, step));
        };

        const commit = (val) => {
          const ent = this._getEntity();
          const attrs = ent?.attributes || {};
          const lowVal = slotId === 'low' ? val : (this._optimisticTempLow ?? attrs.target_temp_low);
          const highVal = slotId === 'high' ? val : (this._optimisticTempHigh ?? attrs.target_temp_high);
          this.hass.callService('climate', 'set_temperature', {
            entity_id: this._config.entity,
            target_temp_low: lowVal,
            target_temp_high: highVal,
          });
        };

        // +/- buttons
        portal.querySelectorAll(`.circular-temp-btn[data-slider="${slotId}"]`).forEach(btn => {
          btn.addEventListener('click', () => {
            const ent = this._getEntity();
            const attrs = ent?.attributes || {};
            const cur = this[optimisticKey] ?? attrs[attrLow] ?? attrs[attrHigh] ?? this._tempMin;
            const dir = btn.dataset.action === 'plus' ? 1 : -1;
            const val = this._clampTemp(this._roundToStep(cur + dir * step, step));
            applyValue(val);
            commit(val);
          });
        });

        let dragging = false;
        el.addEventListener('mousedown', (e) => { dragging = true; applyValue(getFromPoint(e.clientX, e.clientY)); });
        el.addEventListener('touchstart', (e) => { dragging = true; applyValue(getFromPoint(e.touches[0].clientX, e.touches[0].clientY)); }, { passive: true });

        const onMove = (e) => { if (dragging) applyValue(getFromPoint(e.clientX, e.clientY)); };
        const onTouchMove = (e) => { if (dragging) applyValue(getFromPoint(e.touches[0].clientX, e.touches[0].clientY)); };
        const onUp = (e) => {
          if (!dragging) return;
          dragging = false;
          const val = this[optimisticKey];
          if (val !== undefined) commit(val);
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchmove', onTouchMove);
          document.removeEventListener('touchend', onUp);
        };
        el.addEventListener('mousedown', () => {
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
        el.addEventListener('touchstart', () => {
          document.addEventListener('touchmove', onTouchMove, { passive: true });
          document.addEventListener('touchend', onUp);
        }, { passive: true });
      };

      setupOne('low', 'target_temp_low', 'target_temp_low', '_optimisticTempLow', 'target_temp_low');
      setupOne('high', 'target_temp_high', 'target_temp_high', '_optimisticTempHigh', 'target_temp_high');
    }

    _setupVerticalPlusMinusButtons(portal) {
      let minusBtn = portal.querySelector('.vertical-temp-btn.minus');
      let plusBtn = portal.querySelector('.vertical-temp-btn.plus');

      if (!minusBtn && !plusBtn) return;

      // Prevent duplicate listeners when the popup re-renders
      if (minusBtn && minusBtn.parentNode) {
        const clone = minusBtn.cloneNode(true);
        minusBtn.parentNode.replaceChild(clone, minusBtn);
        minusBtn = clone;
      }
      if (plusBtn && plusBtn.parentNode) {
        const clone = plusBtn.cloneNode(true);
        plusBtn.parentNode.replaceChild(clone, plusBtn);
        plusBtn = clone;
      }

      
      const useGradient = this._config.climate_show_gradient !== false;
      
      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          const ent = this._getEntity();
          const attrs = ent?.attributes || {};
          const step = this._getTempStep();
          const current = this._optimisticClimateTemp ?? attrs.temperature ?? attrs.current_temperature ?? this._tempMin;
          const unit = attrs.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
          let newVal = this._clampTemp(this._roundToStep(current - step, step));
          this._optimisticClimateTemp = newVal;
          
          // Optimistic UI update
          const percentage = this._getTempPercentage(newVal);
          const color = (HVAC_COLORS && HVAC_COLORS[ent.state]) || HVAC_COLORS.off || 'var(--primary-color)';
          const background = useGradient ? this._getTempGradient() : color;
          
          const fill = portal.querySelector('.vertical-slider-fill');
          const thumb = portal.querySelector('.vertical-slider-thumb');
          const valueDisplay = portal.querySelector('.value-display');
          
          if (fill) {
            fill.style.height = percentage + '%';
            fill.style.background = background;
          }
          // Clamp thumb position so it stays visible at 0% and 100%
          const thumbPos = percentage <= 0 ? '0px' : percentage >= 100 ? 'calc(100% - 6px)' : `calc(${percentage}% - 6px)`;
          if (thumb) thumb.style.bottom = thumbPos;
          if (valueDisplay) valueDisplay.innerHTML = `${newVal}<span>${unit}</span>`;
          
          this.hass.callService('climate', 'set_temperature', { 
            entity_id: this._config.entity, 
            temperature: newVal 
          });
        });
      }
      
      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          const ent = this._getEntity();
          const attrs = ent?.attributes || {};
          const step = this._getTempStep();
          const current = this._optimisticClimateTemp ?? attrs.temperature ?? attrs.current_temperature ?? this._tempMin;
          const unit = attrs.temperature_unit || this.hass?.config?.unit_system?.temperature || '°';
          let newVal = this._clampTemp(this._roundToStep(current + step, step));
          this._optimisticClimateTemp = newVal;
          
          // Optimistic UI update
          const percentage = this._getTempPercentage(newVal);
          const color = (HVAC_COLORS && HVAC_COLORS[ent.state]) || HVAC_COLORS.off || 'var(--primary-color)';
          const background = useGradient ? this._getTempGradient() : color;
          
          const fill = portal.querySelector('.vertical-slider-fill');
          const thumb = portal.querySelector('.vertical-slider-thumb');
          const valueDisplay = portal.querySelector('.value-display');
          
          if (fill) {
            fill.style.height = percentage + '%';
            fill.style.background = background;
          }
          // Clamp thumb position so it stays visible at 0% and 100%
          const thumbPos = percentage <= 0 ? '0px' : percentage >= 100 ? 'calc(100% - 6px)' : `calc(${percentage}% - 6px)`;
          if (thumb) thumb.style.bottom = thumbPos;
          if (valueDisplay) valueDisplay.innerHTML = `${newVal}<span>${unit}</span>`;
          
          this.hass.callService('climate', 'set_temperature', { 
            entity_id: this._config.entity, 
            temperature: newVal 
          });
        });
      }
    }

    _setupClimatePopupListHandlers(portal, type) {
      portal.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
          const value = item.dataset.value;
          if (!value) return;

          if (type === 'preset') {
            this.hass.callService('climate', 'set_preset_mode', { entity_id: this._config.entity, preset_mode: value });
          } else if (type === 'fan') {
            this.hass.callService('climate', 'set_fan_mode', { entity_id: this._config.entity, fan_mode: value });
          }
        });
      });
    }



    _renderContent(isOn, brightness, supportsTemp, supportsColor, effectList, currentEffect, isGroup) {
      const valueStyle = `font-size: ${this._config.popup_value_font_size || 36}px; font-weight: ${this._config.popup_value_font_weight || 300};`;
      const labelStyle = `font-size: ${this._config.popup_label_font_size || 16}px; font-weight: ${this._config.popup_label_font_weight || 400};`;
      
      if (this._activeView === 'brightness') {
        const barColor = this._config.dynamic_bar_color ? this._getCurrentColor() : 'linear-gradient(to top, #FFD700, #FFA500)';
        // Clamp thumb position so it's always visible (at 0% and 100%)
        const thumbPos = brightness <= 0 ? '0px' : brightness >= 100 ? 'calc(100% - 6px)' : `calc(${brightness}% - 6px)`;
        return `
          <div class="value-display" style="${valueStyle}"><span style="${valueStyle}">${brightness}</span><span style="${labelStyle}">%</span></div>
          <div class="vertical-slider-container">
            <div class="vertical-slider-track" id="brightnessTrack">
              <div class="vertical-slider-fill" style="height: ${brightness}%; background: ${barColor}"></div>
              <div class="vertical-slider-thumb" style="bottom: ${thumbPos}"></div>
            </div>
          </div>
        `;
      } else if (this._activeView === 'temperature') {
        const range = this._tempMax - this._tempMin;
        const currentTempPct = 100 - (((this._currentTemp - this._tempMin) / range) * 100);
        const kelvin = Math.round(1000000 / this._currentTemp);
        const tempName = this._getTempName(kelvin);
        // Clamp thumb position so it's always visible (at 0% and 100%)
        const thumbPos = currentTempPct <= 0 ? '0px' : currentTempPct >= 100 ? 'calc(100% - 6px)' : `calc(${currentTempPct}% - 6px)`;
        return `
          <div class="value-display" style="${labelStyle}">${tempName}</div>
          <div class="vertical-slider-container">
            <div class="vertical-slider-track temp-gradient" id="tempTrackVertical">
              <div class="vertical-slider-fill temp-fill" style="height: ${currentTempPct}%"></div>
              <div class="vertical-slider-thumb" style="bottom: ${thumbPos}"></div>
            </div>
          </div>
          ${this._config.popup_show_favorites !== false ? `
          <button class="save-favorite-fab" id="saveFavoriteBtn" title="Save to Favorites">
            <ha-icon icon="mdi:star-plus"></ha-icon>
          </button>
          ` : ''}
        `;
      } else if (this._activeView === 'color') {
        const colorName = this._getColorName(this._hue, this._saturation);
        return `
          <div class="value-display" style="${labelStyle}">${colorName}</div>
          <div class="color-wheel" id="colorWheel">
            <div class="color-wheel-indicator" id="colorIndicator"></div>
          </div>
          ${this._config.popup_show_favorites !== false ? `
          <button class="save-favorite-fab" id="saveFavoriteBtn" title="Save to Favorites">
            <ha-icon icon="mdi:star-plus"></ha-icon>
          </button>
          ` : ''}
        `;
      }
      
      const view = this._popupPortal ? this._popupPortal.querySelector('[data-view-type]')?.dataset.viewType : null;
      
      if (view === 'scenes') {
        return this._renderFavoritesView();
      } else if (view === 'individual' && isGroup) {
        return this._renderIndividualView();
      } else if (view === 'effects' && effectList.length > 0) {
        return this._renderEffectsView(effectList, currentEffect);
      } else if (view === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer">
          <div class="history-loading">Loading Timeline...</div>
        </div>`;
      }

      return '';
    }

    _renderClimateContent(entity) {
        if (this._activeView === 'presets') return this._renderList(entity.attributes.preset_modes, entity.attributes.preset_mode, 'preset');
        if (this._activeView === 'fan') return this._renderList(entity.attributes.fan_modes, entity.attributes.fan_mode, 'fan');
    
        // Main Sliders
        const attrs = entity.attributes;
        const mode = entity.state;
        const color = HVAC_COLORS[mode] || HVAC_COLORS.off;
        const isRange = (mode === 'heat_cool' || mode === 'auto') && attrs.target_temp_high;
        const range = this._tempMax - this._tempMin;
        const borderRadius = this._config.popup_slider_radius ?? 12;
    
        const renderSlider = (id, val, label) => {
            const pct = ((val - this._tempMin) / range) * 100;
            // Clamp thumb position so it's always visible (at 0% and 100%)
            const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;
            return `
                <div class="climate-slider-group">
                    <div class="value-display" id="disp-${id}">${val}<span>°</span></div>
                    <div class="vertical-slider-container">
                        <div class="vertical-slider-track" id="track-${id}" data-type="${id}">
                            <div class="vertical-slider-fill" style="height: ${pct}%; background: ${color}; border-radius: 0 0 ${borderRadius}px ${borderRadius}px;"></div>
                            <div class="vertical-slider-thumb" style="bottom: ${thumbPos}"></div>
                        </div>
                    </div>
                    ${label ? `<div class="climate-label">${label}</div>` : ''}
                </div>`;
        };
    
        if (mode === 'off') return `<div style="opacity:0.5; font-size:24px; font-weight:300;">System is Off</div>`;
        
        if (isRange) {
            return `<div class="climate-dual-wrapper">
                ${renderSlider('low', attrs.target_temp_low, 'Low')}
                ${renderSlider('high', attrs.target_temp_high, 'High')}
            </div>`;
        }
        return renderSlider('single', attrs.temperature || attrs.current_temperature, 'Target');
    }
    
    _renderClimateNav(entity) {
        const modes = entity.attributes.hvac_modes || [];
        const currentMode = this._optimisticHvacMode ?? entity.state;
        const title = (s) => String(s || '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return modes.map(m => {
            const isActive = m === currentMode;
            return `
            <button class="nav-btn ${isActive ? 'active' : ''}" id="mode-${m}" style="${isActive ? `color:${HVAC_COLORS[m]}` : ''}">
                <ha-icon icon="${HVAC_ICONS[m]}"></ha-icon>
                ${this._config.popup_hide_button_text ? '' : `<span class="nav-label">${title(m)}</span>`}
            </button>
        `;
        }).join('');
    }


    /* --- COVER POPUP --- */
    _coverFavoritesKey() {
      return `hki_cover_favorites__${this._config.entity}`;
    }

    _ensureCoverFavorites() {
      try {
        const raw = localStorage.getItem(this._coverFavoritesKey());
        this._coverFavorites = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(this._coverFavorites)) this._coverFavorites = [];
      } catch (e) {
        this._coverFavorites = [];
      }
    }

    _persistCoverFavorites() {
      try {
        localStorage.setItem(this._coverFavoritesKey(), JSON.stringify(this._coverFavorites || []));
      } catch (e) {}
    }

    _getCoverPosition(ent) {
      if (!ent) return 0;
      const pos = ent.attributes && ent.attributes.current_position;
      if (typeof pos === 'number') return Math.max(0, Math.min(100, pos));
      if (ent.state === 'open') return 100;
      if (ent.state === 'closed') return 0;
      return 0;
    }

    async _applyCoverFavorite(fav) {
      if (!fav) return;
      try {
        if (Array.isArray(fav.members) && fav.members.length) {
          for (const m of fav.members) {
            if (!m?.entity_id) continue;
            const p = typeof m.position === 'number' ? m.position : 0;
            await this.hass.callService('cover', 'set_cover_position', { entity_id: m.entity_id, position: Math.max(0, Math.min(100, p)) });
          }
          return;
        }
        const position = typeof fav.position === 'number' ? fav.position : null;
        if (position === null) return;
        await this.hass.callService('cover', 'set_cover_position', { entity_id: this._config.entity, position: Math.max(0, Math.min(100, position)) });
      } catch (e) {
        console.error('HKI cover favorite apply failed', e);
      }
    }

    async _promptCoverGroupFavoriteMeta(defaultName) {
      const name = await this._promptText('Favorite name', defaultName || 'Preset');
      if (name === null) return null;
      const color = await this._promptText('Button color (optional)', '');
      if (color === null) return null;
      const image = await this._promptText('Image path/URL (optional)', '');
      if (image === null) return null;
      return { name: name || defaultName || 'Preset', color: color || '', image: image || '' };
    }

    _renderCoverPopupPortal(entity) {
      if (!entity) entity = this._getEntity();
      // Reuse existing portal to avoid flicker on hass updates.
      const isGroup = Array.isArray(entity.attributes?.entity_id) && entity.attributes.entity_id.length > 1;
      const entityName = this._getPopupName(entity);
      const pos = this._getCoverPosition(entity);

      // Check default view configuration for groups
      const defaultView = this._config.popup_default_view; // 'main', 'individual', or undefined
      
      // Auto-switch to individual/group view if configured and it's a group
      // Only set if not already explicitly set by user
      if (defaultView === 'individual' && isGroup && this._coverGroupMode === undefined) {
        this._coverGroupMode = true;
      } else if (this._coverGroupMode === undefined) {
        this._coverGroupMode = false;
      }

      // Use same visual overrides as other popups
      const popupRadius = this._config.popup_border_radius ?? 16;
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-light-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      const safeTitle = (s) => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const controlsIcon = this._getResolvedIcon(entity, 'mdi:window-shutter');

      const groupBtn = isGroup ? `
        <button class="header-btn" id="coverGroupBtn" title="Group">
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
        </button>
      ` : '';

      portal.innerHTML = `
        <style>
          /* Base popup styles (mirrors light/climate popups) */
          .hki-light-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-light-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column;
            overflow: hidden;
          }
          .hki-light-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-light-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-light-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-light-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; color: var(--primary-text-color); }
          .hki-light-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-light-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-light-popup-tabs {
            display: flex; gap: 8px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-light-popup-tab {
            flex: 1; height: 40px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.2s; font-size: 14px; font-weight: 500;
          }
          .hki-light-popup-tab:hover { background: var(--secondary-background-color, rgba(255, 255, 255, 0.08)); }
          .hki-light-popup-tab.active { 
            background: var(--primary-color, rgba(255, 255, 255, 0.15)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .hki-light-popup-tab ha-icon { --mdc-icon-size: 18px; }

          .hki-light-popup-content {
            flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column;
            align-items: stretch; justify-content: flex-start; gap: 12px;
            min-height: 0;
            position: relative;
            overflow-x: hidden;
          }
          .hki-light-popup-content.view-favorites { align-items: stretch;
          justify-items: stretch; justify-content: flex-start; }

          .hki-light-popup-nav {
            display: flex; justify-content: space-evenly; padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            gap: 8px;
            flex-shrink: 0;
          }
          .nav-btn {
            min-width: 60px; height: 50px; border-radius: 12px;
            border: none; background: transparent;
            color: var(--primary-text-color); opacity: 0.5;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s;
            flex: 1;
          }
          .nav-btn:hover { opacity: 1; background: var(--divider-color, rgba(255, 255, 255, 0.05)); }
          .nav-btn:active { background: rgba(255, 255, 255, 0.1); }
          .nav-btn ha-icon { --mdc-icon-size: 24px; margin-bottom: 2px; }
          .nav-btn .nav-label { font-size: 9px; font-weight: 600; text-transform: uppercase; }

          .save-favorite-fab {
            position: absolute; right: 16px; bottom: 16px;
            width: 44px; height: 44px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.10);
            color: var(--primary-text-color);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: transform 0.15s, background 0.15s;
            z-index: 5;
          }
          .save-favorite-fab:hover { background: rgba(255, 255, 255, 0.14); transform: scale(1.05); }
          .save-favorite-fab ha-icon { --mdc-icon-size: 20px; }

          .favorites-view { width: 100%; height: 100%; position: relative; }
          .favorites-sticky-header {
            position: sticky; top: 0; z-index: 6;
            display: flex; justify-content: flex-end;
            padding: 8px 0 8px 0;
            background: transparent;
            backdrop-filter: none;
          }
          .favorites-edit-btn {
            position: relative; z-index: 1;
            display: flex; align-items: center; gap: 8px;
            background: var(--divider-color, rgba(255, 255, 255, 0.06));
            border: 1px solid rgba(255, 255, 255, 0.10);
            color: var(--primary-text-color);
            height: 34px; padding: 0 12px; border-radius: 999px;
            cursor: pointer;
          }
          .favorites-edit-btn:hover { background: rgba(255, 255, 255, 0.10); }
          .favorites-edit-btn ha-icon { --mdc-icon-size: 18px; }

          .preset-btn {
            position: relative;
            height: 82px;
            border-radius: ${popupBorderRadius}px;
            background: var(--divider-color, rgba(255, 255, 255, 0.06));
            border: 1px solid rgba(255, 255, 255, 0.08);
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            gap: 8px;
            cursor:pointer;
            overflow:hidden;
          }
          .preset-name {
            font-size: 11px;
            opacity: 0.85;
            max-width: 88%;
            text-align:center;
            overflow:hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.1;
            min-height: 2.2em;
          }
          .preset-picture {
            width: 32px; height: 32px; border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }
          .fav-delete-badge {
            position: absolute; top: 8px; right: 8px;
            width: 20px; height: 20px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.10);
            border: 1px solid rgba(255, 255, 255, 0.12);
            display: flex; align-items: center; justify-content: center;
            color: var(--primary-text-color);
          }
          .fav-delete-badge:hover { background: rgba(255, 80, 80, 0.25); border-color: rgba(255, 80, 80, 0.35); }
          .fav-delete-badge ha-icon { --mdc-icon-size: 14px; }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual {
            display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0;
          }
          .timeline-dot {
            width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700);
            z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px;
          }
          .timeline-line {
            width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px;
          }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content {
            flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color);
          }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }

          /* Cover-specific */

          /* Shared vertical slider styles (match light/climate) */
          .vertical-slider-container { width: 80px; height: 280px; position: relative; }
          .vertical-slider-track {
            width: 100%; height: 100%; background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .vertical-slider-fill {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: rgba(33,150,243,0.85);
            border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
          }
          .vertical-slider-thumb {
            position: absolute; left: 50%; transform: translateX(-50%);
            width: 90px; height: 6px; background: white;
            border-radius: 6px;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.3);
            pointer-events: none;
          }
          .hki-cover-content { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .cover-controls-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
          .cover-slider-wrap { width: 160px; height: 360px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .cover-value { font-size: 40px; font-weight: 300; }
          .cover-value span { font-size: 18px; opacity: 0.7; }
          .cover-track { width: 100%; flex: 1; background: rgba(255,255,255,0.10); border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer; }
          .cover-fill { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(33,150,243,0.85); }
          .cover-thumb { position: absolute; left: 50%; transform: translateX(-50%); width: 110%; height: 6px; background: #fff; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.30); pointer-events: none; }
          .cover-actions { display: flex; gap: 10px; width: 100%; justify-content: center; }
          .cover-chip { height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); color: var(--primary-text-color); display:flex; align-items:center; gap:8px; cursor:pointer; }
          .cover-chip:hover { background: rgba(255,255,255,0.10); }

          .cover-members { width: 100%; flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
          .cover-row { 
            display: flex; align-items: center; gap: 12px; padding: 12px 0; 
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .cover-row:last-child { border-bottom: none; }
          .cover-row-left { display:flex; align-items:center; gap:12px; min-width: 0; flex: 1; }
          .cover-row-name { font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .cover-row-state { font-size: 12px; opacity: 0.6; }
          .cover-row-slider { 
            flex: 2; height: 40px; border-radius: 999px; 
            background: var(--secondary-background-color, rgba(255,255,255,0.1)); 
            border: 2px solid var(--divider-color, rgba(255,255,255,0.1));
            position: relative; overflow: hidden; cursor: pointer; 
          }
          .cover-row-fill { 
            height: 100%; background: rgba(255,255,255,0.18);
            border-radius: 999px 0 0 999px;
            transition: width 0.2s ease; 
          }
          .cover-row-thumb { 
            position: absolute; top: 0; transform: translateX(-50%); 
            width: 12px; height: 100%; border-radius: 6px; background: #fff; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: left 0.2s ease; 
          }

          .hki-light-popup-container { border-radius: ${popupRadius}px; }
        </style>
        <div class="hki-light-popup-container">
          <div class="hki-light-popup-header">
            <div class="hki-light-popup-title">
              <ha-icon icon="${controlsIcon}" style="color: ${this._getPopupIconColor('rgba(33,150,243,0.95)')}"></ha-icon>
              <div class="hki-light-popup-title-text">
                ${safeTitle(entityName)}
                <span class="hki-light-popup-state">${this._getPopupHeaderState(pos + '%')}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-light-popup-header-controls">
              ${groupBtn}
              <button class="header-btn" id="historyBtn" title="History"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-light-popup-tabs">
            ${this._config.popup_show_favorites !== false ? `
              <button class="hki-light-popup-tab ${this._activeView === 'favorites' ? 'active' : ''}" id="coverTabFavorites" style="${this._activeView === 'favorites' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                <ha-icon icon="mdi:star"></ha-icon> Favorites
              </button>
            ` : ''}
            <button class="hki-light-popup-tab ${this._activeView !== 'favorites' ? 'active' : ''}" id="coverTabControls" style="${this._activeView !== 'favorites' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="mdi:tune-vertical"></ha-icon> Controls
            </button>
          </div>

          <div class="hki-light-popup-content ${this._activeView === 'favorites' ? 'view-favorites' : ''}">
            <div class="hki-cover-content">
              ${this._renderCoverPopupContent(entity)}
            </div>
          </div>

          <div class="hki-light-popup-nav">
            <button class="nav-btn" id="coverOpen" style="${this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:arrow-up"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Open</span>'}</button>
            <button class="nav-btn" id="coverStop" style="${this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:stop"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Stop</span>'}</button>
            <button class="nav-btn" id="coverClose" style="${this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:arrow-down"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span class="nav-label">Close</span>'}</button>
</div>
        </div>
      `;

      
      // Close cover popup when clicking on the backdrop (outside the popup container)
      const container = portal.querySelector('.hki-light-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;
      this._setupCoverPopupHandlers(portal);

      // If history is active (header button), load it
      if (this._coverHistoryOpen) {
        this._loadHistory();
      }
    }

    _renderCoverPopupContent(entity) {
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const isGroup = Array.isArray(entity.attributes?.entity_id) && entity.attributes.entity_id.length > 1;
      if (this._coverHistoryOpen) {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }

      if (this._activeView === 'favorites') {
        const favs = Array.isArray(this._coverFavorites) ? this._coverFavorites : [];
        if (favs.length === 0) {
          return `<div style="padding: 18px; text-align:center; opacity:0.6;">No favorites yet</div>`;
        }
        const tiles = favs.map((f, idx) => {
          const label = (f && f.name) ? f.name : `Preset ${idx + 1}`;
          const color = f.color || 'rgba(255,255,255,0.12)';
          const pic = f.image ? `<img class="preset-picture" src="${f.image}" alt="" />` : `<div class="preset-icon" style="width:32px;height:32px;border-radius:50%;background:${color};"></div>`;
          const del = (this._coverEditMode ? `<div class="fav-delete-badge" data-del="${idx}"><ha-icon icon="mdi:close"></ha-icon></div>` : '');
          return `
            <div class="preset-btn" data-idx="${idx}" style="position:relative;">
              ${del}
              ${pic}
              <div class="preset-name">${label}</div>
            </div>
          `;
        }).join('');

        return `
          <div class="favorites-view">
            <div class="favorites-sticky-header">
              <button class="favorites-edit-btn" id="coverFavEdit"><ha-icon icon="mdi:pencil"></ha-icon> Edit</button>
            </div>
            <div class="favorites-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
              ${tiles}
            </div>
          </div>
        `;
      }

      if (this._coverGroupMode && isGroup) {
        const rows = entity.attributes.entity_id.map((id) => {
          const st = this.hass.states[id];
          if (!st) return '';
          const p = this._getCoverPosition(st);
          const name = (st.attributes?.friendly_name) || id;
          return `
            <div class="cover-row" data-entity-id="${id}">
              <div class="cover-row-left">
                <div style="display:flex;flex-direction:column;min-width:0;flex:1;">
                  <div class="cover-row-name">${name}</div>
                  <div class="cover-row-state">${p}%</div>
                </div>
              </div>
              <div class="cover-row-slider" data-slider="pos">
                <div class="cover-row-fill" style="width:${p}%"></div>
                <div class="cover-row-thumb" style="left:${p}%"></div>
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="cover-members" data-view-type="cover-individual">
            ${rows}
          </div>
          ${this._config.popup_show_favorites !== false ? `<button class="save-favorite-fab" id="coverGroupSave" title="Save favorite"><ha-icon icon="mdi:star-plus"></ha-icon></button>` : ''}
        `;
      }

      // Controls view
      const pos = this._getCoverPosition(entity);
      // Clamp thumb so it is always visible (at 0% it would otherwise be rendered outside the track)
      const thumbBottom = (pos <= 0) ? '0px' : `calc(${pos}% - 6px)`;
      return `
        <div class="cover-controls-wrap">
          <div class="cover-slider-wrap">
            <div class="cover-value" id="coverPosDisp" style="font-size:${this._config.popup_value_font_size ?? 36}px; font-weight:${this._config.popup_value_font_weight ?? 300};">${pos}<span>%</span></div>
            <div class="vertical-slider-container">
              <div class="vertical-slider-track" id="coverPosTrack">
                <div class="vertical-slider-fill" style="height:${pos}%;"></div>
              <div class="vertical-slider-thumb" style="bottom:${thumbBottom}"></div>
              </div>
            </div>
            <div style="opacity:0.55; letter-spacing:0.08em; font-size:${this._config.popup_label_font_size ?? 16}px; font-weight:${this._config.popup_label_font_weight ?? 400};">POSITION</div>
          </div>
        </div>
        ${this._config.popup_show_favorites !== false ? `<button class="save-favorite-fab" id="coverSave" title="Save favorite"><ha-icon icon="mdi:star-plus"></ha-icon></button>` : ''}
      `;
    }

    _setupCoverPopupHandlers(portal) {
      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#historyBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._coverHistoryOpen = !this._coverHistoryOpen;
          this._renderCoverPopupPortal(this._getEntity());
        });
      }

      const groupBtn = portal.querySelector('#coverGroupBtn');
      if (groupBtn) {
        groupBtn.addEventListener('click', () => {
          this._coverGroupMode = !this._coverGroupMode;
          this._coverHistoryOpen = false;
          this._renderCoverPopupPortal(this._getEntity());
        });
      }

      const tabFav = portal.querySelector('#coverTabFavorites');
      if (tabFav) tabFav.addEventListener('click', () => { this._activeView = 'favorites'; this._coverHistoryOpen = false; this._renderCoverPopupPortal(this._getEntity()); });
      const tabCtl = portal.querySelector('#coverTabControls');
      if (tabCtl) tabCtl.addEventListener('click', () => { this._activeView = 'controls'; this._coverHistoryOpen = false; this._renderCoverPopupPortal(this._getEntity()); });

      const openBtn = portal.querySelector('#coverOpen');
      if (openBtn) openBtn.addEventListener('click', () => this.hass.callService('cover', 'open_cover', { entity_id: this._config.entity }));
      const stopBtn = portal.querySelector('#coverStop');
      if (stopBtn) stopBtn.addEventListener('click', () => this.hass.callService('cover', 'stop_cover', { entity_id: this._config.entity }));
      const closeBtn2 = portal.querySelector('#coverClose');
      if (closeBtn2) closeBtn2.addEventListener('click', () => this.hass.callService('cover', 'close_cover', { entity_id: this._config.entity }));

      const groupSave = portal.querySelector('#coverGroupSave');
      if (groupSave) {
        groupSave.addEventListener('click', async () => {
          const ent = this._getEntity();
          if (!ent) return;
          const members = (ent.attributes?.entity_id || []).map((id) => {
            const st = this.hass.states[id];
            return { entity_id: id, position: this._getCoverPosition(st) };
          });
          const meta = await this._promptCoverGroupFavoriteMeta(ent.attributes?.friendly_name || 'Group preset');
          if (!meta) return;
          const fav = { name: meta.name, members, color: meta.color, image: meta.image };
          this._coverFavorites = Array.isArray(this._coverFavorites) ? this._coverFavorites : [];
          this._coverFavorites.unshift(fav);
          this._persistCoverFavorites();
          this._activeView = 'favorites';
          this._coverGroupMode = false;
          this._renderCoverPopupPortal(this._getEntity());
        });
      }



      const coverSave = portal.querySelector('#coverSave');
      if (coverSave) {
        coverSave.addEventListener('click', async () => {
          const ent = this._getEntity();
          if (!ent) return;
          const position = this._getCoverPosition(ent);
          const meta = await this._promptCoverGroupFavoriteMeta(position + '%');
          if (!meta) return;
          const fav = { name: meta.name, position, color: meta.color, image: meta.image };
          this._coverFavorites = Array.isArray(this._coverFavorites) ? this._coverFavorites : [];
          this._coverFavorites.unshift(fav);
          this._persistCoverFavorites();
          this._activeView = 'favorites';
          this._coverGroupMode = false;
          this._renderCoverPopupPortal(this._getEntity());
        });
      }
      const editBtn = portal.querySelector('#coverFavEdit');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          this._coverEditMode = !this._coverEditMode;
          this._renderCoverPopupPortal(this._getEntity());
        });
      }

      // Favorites click / delete
      portal.querySelectorAll('.preset-btn').forEach((el) => {
        el.addEventListener('click', async (e) => {
          const del = e.target.closest('[data-del]');
          if (del) {
            const idx = parseInt(del.getAttribute('data-del'));
            if (!Number.isNaN(idx)) {
              this._coverFavorites.splice(idx, 1);
              this._persistCoverFavorites();
              this._renderCoverPopupPortal(this._getEntity());
            }
            e.stopPropagation();
            return;
          }
          const idx = parseInt(el.getAttribute('data-idx'));
          const fav = this._coverFavorites[idx];
          await this._applyCoverFavorite(fav);
        });
      });

      // Main position slider
      const track = portal.querySelector('#coverPosTrack');
      if (track) {
        const applyVisual = (val) => {
          const fill = track.querySelector('.vertical-slider-fill');
          const thumb = track.querySelector('.vertical-slider-thumb');
          const disp = portal.querySelector('#coverPosDisp');
          if (fill) fill.style.height = `${val}%`;
          if (thumb) thumb.style.bottom = (val <= 0) ? '0px' : `calc(${val}% - 6px)`;
          if (disp) disp.innerHTML = `${val}<span>%</span>`;
        };
        const calcVal = (clientY) => {
          const rect = track.getBoundingClientRect();
          const pct = 1 - ((clientY - rect.top) / rect.height);
          return Math.round(Math.max(0, Math.min(1, pct)) * 100);
        };
        let dragging = false;
        const onMove = (e) => {
          if (!dragging) return;
          const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
          applyVisual(calcVal(y));
        };
        const onUp = async (e) => {
          if (!dragging) return;
          dragging = false;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('touchend', onUp);
          const y = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : e.clientY;
          const v = calcVal(y);
          applyVisual(v);
          await this.hass.callService('cover', 'set_cover_position', { entity_id: this._config.entity, position: v });
        };
        const onDown = (e) => {
          dragging = true;
          const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
          applyVisual(calcVal(y));
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
          document.addEventListener('touchmove', onMove, { passive: true });
          document.addEventListener('touchend', onUp);
        };
        track.addEventListener('mousedown', onDown);
        track.addEventListener('touchstart', onDown, { passive: true });
      }

      // Group row sliders
      portal.querySelectorAll('.cover-row').forEach((row) => {
        const entityId = row.getAttribute('data-entity-id');
        const slider = row.querySelector('.cover-row-slider');
        if (!entityId || !slider) return;
        const applyVisual = (pct) => {
          const fill = slider.querySelector('.cover-row-fill');
          const thumb = slider.querySelector('.cover-row-thumb');
          if (fill) fill.style.width = `${pct}%`;
          if (thumb) thumb.style.left = `${pct}%`;
          const st = row.querySelector('.cover-row-state');
          if (st) st.textContent = `${pct}%`;
        };
        const calcPct = (clientX) => {
          const rect = slider.getBoundingClientRect();
          const pct = ((clientX - rect.left) / rect.width) * 100;
          return Math.round(Math.max(0, Math.min(100, pct)));
        };
        let dragging = false;
        const onMove = (e) => {
          if (!dragging) return;
          const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
          applyVisual(calcPct(x));
        };
        const onUp = async (e) => {
          if (!dragging) return;
          dragging = false;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('touchend', onUp);
          const x = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : e.clientX;
          const pct = calcPct(x);
          applyVisual(pct);
          await this.hass.callService('cover', 'set_cover_position', { entity_id: entityId, position: pct });
        };
        const onDown = (e) => {
          dragging = true;
          const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
          applyVisual(calcPct(x));
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
          document.addEventListener('touchmove', onMove, { passive: true });
          document.addEventListener('touchend', onUp);
        };
        slider.addEventListener('mousedown', onDown);
        slider.addEventListener('touchstart', onDown, { passive: true });
      });

      // If history view, load content
      if (this._coverHistoryOpen) {
        this._loadHistory();
      }
    }


    /* ------------------------------------------------------------------
     * Alarm Control Panel Popup (Alarmo)
     * ------------------------------------------------------------------ */
    _renderAlarmPopupPortal(entity) {
      if (!entity) entity = this._getEntity();
      // Reuse existing portal to avoid flicker on hass updates.

      const entityName = this._getPopupName(entity);
      const state = entity.state || 'unknown';
      const popupRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();

      const icon = this._getResolvedIcon(entity, (state === 'disarmed') ? 'mdi:shield-check' : 'mdi:shield-lock');
      const iconColor = (state === 'disarmed') ? '#4CAF50' : '#F44336';

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-light-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      const safeTitle = (t) => String(t || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      portal.innerHTML = `
        <style>
          /* Reuse the same base popup styling as other HKI popups */
          .hki-light-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-light-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column;
            overflow: hidden;
          }
          .hki-light-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-light-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-light-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-light-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; color: var(--primary-text-color); }
          .hki-light-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-light-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-light-popup-body { flex: 1; display:flex; align-items:center; justify-content:center; padding: 18px 20px; box-sizing: border-box; overflow: hidden; }
          .hki-alarm-content { width: 100%; height: 100%; display:flex; flex-direction:column; align-items:center; justify-content:center; }

          /* Code display */
          .alarm-code-wrapper { height: 40px; display:flex; align-items:center; justify-content:center; margin-bottom: 22px; width: 100%; }
          .alarm-code-placeholder { font-size: 13px; opacity: 0.3; letter-spacing: 1px; text-transform: uppercase; }
          .alarm-code-dots { display:flex; gap: 12px; height: 14px; align-items:center; }
          .alarm-code-dot { 
            width: 12px; height: 12px; border-radius: 50%; 
            background: var(--primary-text-color); 
            box-shadow: 0 0 10px var(--primary-color, rgba(255,255,255,0.3)); 
          }

          /* --- Code feedback (wrong/right) --- */
          .alarm-code-wrapper.is-error { animation: hkiShake 0.35s ease-in-out; }
          .alarm-code-wrapper.is-error .alarm-code-dot {
            background: #F44336;
            box-shadow: 0 0 12px rgba(244,67,54,0.55);
          }
          
          .alarm-code-wrapper.is-success .alarm-code-dot {
            background: #4CAF50;
            box-shadow: 0 0 12px rgba(76,175,80,0.55);
          }
          
          /* shake animation */
          @keyframes hkiShake {
            0% { transform: translateX(0); }
            15% { transform: translateX(-8px); }
            30% { transform: translateX(8px); }
            45% { transform: translateX(-6px); }
            60% { transform: translateX(6px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }

          /* Keypad */
          .alarm-keypad { display:grid; grid-template-columns: repeat(3, 1fr); row-gap: 16px; column-gap: 24px; width: 100%; max-width: 280px; }
          .alarm-key {
            width: 72px; height: 72px; border-radius: 50%; border: none;
            background: var(--secondary-background-color, rgba(255,255,255,0.06));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            color: var(--primary-text-color); font-size: 26px; font-weight: 300;
            cursor: pointer; justify-self: center;
            display:flex; align-items:center; justify-content:center;
            transition: all 0.15s ease-out;
            user-select: none; -webkit-tap-highlight-color: transparent;
          }
          .alarm-key:active { background: rgba(255,255,255,0.2); transform: scale(0.95); }
          .alarm-key.action { background: transparent; font-size: 16px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.6)); }

          /* Bottom nav matches alarmo popup look */
          .hki-alarm-nav { display: flex; justify-content: space-evenly; padding: 12px; background: rgba(255, 255, 255, 0.03); border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05)); gap: 8px; flex-shrink: 0; }
          .alarm-nav-btn {
            width: 60px; height: 50px; border-radius: 12px; border: none;
            background: transparent; color: var(--primary-text-color);
            opacity: 0.5; display:flex; flex-direction:column; align-items:center; justify-content:center;
            cursor:pointer; transition: all 0.3s;
          }
          .alarm-nav-btn:hover { opacity: 1; background: rgba(255,255,255,0.05); }
          .alarm-nav-btn ha-icon { --mdc-icon-size: 24px; margin-bottom: 2px; }
          .alarm-nav-btn span { font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .alarm-nav-btn.active { 
            opacity: 1; 
            background: var(--primary-color, rgba(255,255,255,0.10));
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .alarm-nav-btn.active.disarm { color: #4CAF50; }
          .alarm-nav-btn.active.home { color: #FF9800; }
          .alarm-nav-btn.active.away { color: #F44336; }
          .alarm-nav-btn.active.night { color: #FF9800; }

          /* Timeline styles (shared look with other popups) */
          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .history-loading { padding: 40px 20px; text-align: center; opacity: 0.6; font-size: 14px; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }

          /* History view container scrolling */
          .alarm-history-scroll { width:100%; height:100%; overflow:auto; padding: 6px 6px 0 6px; box-sizing: border-box; }
        </style>

        <div class="hki-light-popup-container">
          <div class="hki-light-popup-header">
            <div class="hki-light-popup-title">
              <ha-icon icon="${icon}" style="color:${this._getPopupIconColor(iconColor)}"></ha-icon>
              <div class="hki-light-popup-title-text">
                ${safeTitle(entityName)}
                <span class="hki-light-popup-state">${this._getPopupHeaderState(String(state).replace(/_/g,' '))}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-light-popup-header-controls">
              <button class="header-btn" id="alarmHistoryBtn" title="History"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-light-popup-body" id="alarmBody">
            ${this._renderAlarmPopupContent(entity)}
          </div>

          <div class="hki-alarm-nav" id="alarmBottomNav">
            <button class="alarm-nav-btn disarm ${state === 'disarmed' ? 'active' : ''}" id="btnDisarm" style="${state === 'disarmed' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="mdi:lock-open-variant"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Disarm</span>'}
            </button>
            <button class="alarm-nav-btn home ${state === 'armed_home' ? 'active' : ''}" id="btnHome" style="${state === 'armed_home' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="mdi:home-lock"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Home</span>'}
            </button>
            <button class="alarm-nav-btn away ${state === 'armed_away' ? 'active' : ''}" id="btnAway" style="${state === 'armed_away' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="mdi:lock"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Away</span>'}
            </button>
            <button class="alarm-nav-btn night ${state === 'armed_night' ? 'active' : ''}" id="btnNight" style="${state === 'armed_night' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="mdi:weather-night"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Night</span>'}
            </button>
          </div>
        </div>
      `;

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;
      this._setupAlarmPopupHandlers(portal);

      if (this._alarmHistoryOpen) this._loadHistory();
    }

    _renderAlarmPopupContent(entity) {
      if (this._alarmHistoryOpen) {
        return `
          <div class="alarm-history-scroll">
            <div class="timeline-container" data-view-type="history" id="historyContainer">
              <div class="history-loading">Loading Timeline...</div>
            </div>
          </div>
        `;
      }

      const code = String(this._alarmCodeInput || '');
      const dots = code.length > 0
        ? `<div class="alarm-code-dots">${Array.from({length: code.length}).map(()=>'<div class="alarm-code-dot"></div>').join('')}</div>`
        : `<span class="alarm-code-placeholder">Enter Code</span>`;

      return `
        <div class="hki-alarm-content" data-view-type="main">
          <div class="alarm-code-wrapper" id="alarmCodeWrapper">${dots}</div>
          <div class="alarm-keypad">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="alarm-key" data-key="${n}">${n}</button>`).join('')}
            <button class="alarm-key action" data-key="clear">CLR</button>
            <button class="alarm-key" data-key="0">0</button>
            <div style="width:72px;"></div>
          </div>
        </div>
      `;
    }

    _setupAlarmPopupHandlers(portal) {
      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#alarmHistoryBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._alarmHistoryOpen = !this._alarmHistoryOpen;
          // When opening history, render and then load
          this._renderAlarmPopupPortal(this._getEntity());
          if (this._alarmHistoryOpen) setTimeout(() => this._loadHistory(), 50);
        });
      }

      // keypad (only in main view)
      portal.querySelectorAll('.alarm-key').forEach((b) => {
        b.addEventListener('click', (e) => {
          const k = e.currentTarget?.dataset?.key;
          if (!k) return;
          if (k === 'clear') this._alarmCodeInput = '';
          else this._alarmCodeInput = `${this._alarmCodeInput || ''}${k}`;
          // update just the code wrapper
          const w = portal.querySelector('#alarmCodeWrapper');
          if (w) {
            const code = String(this._alarmCodeInput || '');
            w.innerHTML = code.length > 0
              ? `<div class="alarm-code-dots">${Array.from({length: code.length}).map(()=>'<div class="alarm-code-dot"></div>').join('')}</div>`
              : `<span class="alarm-code-placeholder">Enter Code</span>`;
          }
        });
      });

      const doAction = async (service) => {
        const entityId = this._config.entity;
        if (!entityId) return;
      
        const data = { entity_id: entityId };
        const code = String(this._alarmCodeInput || '').trim();
        if (code) data.code = code;
      
        const wrapper = portal.querySelector('#alarmCodeWrapper');
      
        const flash = (cls) => {
          if (!wrapper) return;
          wrapper.classList.remove('is-error', 'is-success');
          // force reflow so the animation triggers every time
          void wrapper.offsetWidth;
          wrapper.classList.add(cls);
          setTimeout(() => wrapper.classList.remove(cls), 500);
        };
      
        try {
          await this.hass.callService('alarm_control_panel', service, data);
      
          // ✅ correct (or accepted) -> glow green then close popup
          flash('is-success');
          this._alarmCodeInput = '';
          setTimeout(() => this._closePopup(), 350);
      
        } catch (e) {
          // ❌ wrong code -> glow red + shake, then clear input
          console.warn('Alarm service call failed', e);
          flash('is-error');
      
          setTimeout(() => {
            this._alarmCodeInput = '';
            if (wrapper) {
              wrapper.innerHTML = `<span class="alarm-code-placeholder">Enter Code</span>`;
            }
          }, 350);
      
          // keep popup open; optionally re-render after a short delay if you want state refresh
          // setTimeout(() => this._renderAlarmPopupPortal(this._getEntity()), 250);
        }
      };

      const btnDisarm = portal.querySelector('#btnDisarm');
      if (btnDisarm) btnDisarm.addEventListener('click', () => doAction('alarm_disarm'));
      const btnHome = portal.querySelector('#btnHome');
      if (btnHome) btnHome.addEventListener('click', () => doAction('alarm_arm_home'));
      const btnAway = portal.querySelector('#btnAway');
      if (btnAway) btnAway.addEventListener('click', () => doAction('alarm_arm_away'));
      const btnNight = portal.querySelector('#btnNight');
      if (btnNight) btnNight.addEventListener('click', () => doAction('alarm_arm_night'));
    }



    /**
     * Humidifier Popup
     */
    /**
     * Humidifier Popup
     */
    _renderHumidifierPopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.

      const name = this._getPopupName(entity);
      const attrs = entity.attributes || {};
      const state = entity.state;
      const isOn = state === 'on';
      const currentHumidity = attrs.current_humidity ?? 0;
      const targetHumidity = attrs.humidity ?? 50;
      const minHumidity = attrs.min_humidity ?? 0;
      const maxHumidity = attrs.max_humidity ?? 100;
      const modes = attrs.available_modes || [];
      const currentMode = attrs.mode || 'normal';
      
      // Fan speed entity (configured separately)
      const fanEntityId = this._config.humidifier_fan_entity || '';
      const fanEntity = fanEntityId ? this.hass?.states?.[fanEntityId] : null;
      const fanModes = fanEntity?.attributes?.options || fanEntity?.attributes?.fan_modes || [];
      const currentFanMode = fanEntity?.state || '';
      const hasFan = !!(fanEntityId && fanEntity && fanModes.length);

      const color = isOn ? 'var(--primary-color, #03a9f4)' : 'var(--disabled-text-color, #6f6f6f)';
      const icon = this._getResolvedIcon(entity, isOn ? 'mdi:air-humidifier' : 'mdi:air-humidifier-off');
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();
      const valueSize = this._config.popup_value_font_size || 36;
      const valueWeight = this._config.popup_value_font_weight || 300;
      const useCircular = this._config.humidifier_use_circular_slider === true;

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      portal.innerHTML = '';

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }
          .hki-tabs {
            display: flex; gap: 8px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .tab-btn {
            flex: 1; height: 40px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.2s; font-size: 14px; font-weight: 500;
          }
          .tab-btn:hover { background: var(--secondary-background-color, rgba(255,255,255,0.08)); }
          .tab-btn.active { background: var(--primary-color, rgba(255,255,255,0.12)); color: var(--text-primary-color, var(--primary-text-color)); }
          .hki-popup-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 0; }
          /* Vertical slider */
          .slider-with-buttons { display: block; position: relative; width: 100%; }
          .slider-center { width: fit-content; margin: 0 auto; }
          .humidifier-current-display { display: flex; flex-direction: column; align-items: center; gap: 6px; position: absolute; left: 24px; top: 50%; transform: translateY(-50%); pointer-events: none; }
          .humidifier-current-label { font-size: 11px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
          .humidifier-current-value { font-size: 28px; font-weight: 300; }
          .humidifier-slider-group { display: flex; flex-direction: column; align-items: center; gap: 12px; height: 320px; width: 80px; }
          .sliders-wrapper { display: flex; gap: 24px; justify-content: center; width: 100%; align-items: center; }
          .value-display { font-size: ${valueSize}px; font-weight: ${valueWeight}; text-align: center; }
          .value-display span { font-size: ${Math.max(14, Math.round(valueSize/2))}px; opacity: 0.7; }
          .slider-label { font-size: 12px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
          .vertical-slider-track {
            width: 100%; flex: 1; background: var(--secondary-background-color, rgba(255,255,255,0.1));
            border: 2px solid var(--divider-color, rgba(255,255,255,0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .vertical-slider-fill { position: absolute; bottom: 0; left: 0; right: 0; transition: background 0.3s; border-radius: 0 0 ${borderRadius}px ${borderRadius}px; }
          .vertical-slider-thumb { position: absolute; left: 50%; transform: translateX(-50%); width: 90px; height: 6px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); pointer-events: none; }
          /* +/- buttons */
          .vertical-temp-buttons { display: flex; flex-direction: column; gap: 12px; position: absolute; right: 0px; top: 50%; transform: translateY(-50%); }
          .vertical-temp-btn { width: 48px; height: 48px; border-radius: 50%; border: none; background: var(--secondary-background-color,rgba(255,255,255,0.1)); color: var(--primary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
          .vertical-temp-btn:hover { background: var(--primary-color,rgba(255,255,255,0.2)); transform: scale(1.1); }
          .vertical-temp-btn:active { transform: scale(0.95); }
          .vertical-temp-btn ha-icon { --mdc-icon-size: 24px; }
          /* Circular slider */
          .circular-slider-wrapper { display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%; position: relative; }
          .circular-slider-container { position: relative; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; flex-shrink: 0; }
          .circular-slider-svg { position: absolute; top: 0; left: 0; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
          .circular-value-display { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; pointer-events: none; }
          .circular-temp-label-top { opacity: 0.6; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
          .circular-temp-value { color: var(--primary-text-color); line-height: 1; }
          .circular-temp-value span { opacity: 0.7; }
          .circular-temp-buttons { display: flex; flex-direction: column; gap: 12px; position: absolute; right: 0px; }
          .circular-temp-btn { width: 48px; height: 48px; border-radius: 50%; border: none; background: var(--secondary-background-color,rgba(255,255,255,0.1)); color: var(--primary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
          .circular-temp-btn:hover { background: var(--primary-color,rgba(255,255,255,0.2)); transform: scale(1.1); }
          .circular-temp-btn:active { transform: scale(0.95); }
          .circular-temp-btn ha-icon { --mdc-icon-size: 24px; }
          /* Nav */
          .hki-popup-nav { display: flex; justify-content: space-evenly; padding: 12px; background: rgba(255,255,255,0.03); border-top: 1px solid var(--divider-color,rgba(255,255,255,0.05)); gap: 8px; flex-shrink: 0; min-height: 74px; box-sizing: border-box; }
          .nav-btn { flex: 1; height: 50px; border-radius: 12px; border: none; background: transparent; color: var(--primary-text-color); opacity: 0.5; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s; font-size: 11px; }
          .nav-btn:hover { opacity: 0.8; background: rgba(255,255,255,0.05); }
          .nav-btn.active { opacity: 1; background: var(--primary-color,rgba(255,255,255,0.1)); color: var(--text-primary-color,var(--primary-text-color)); }
          .nav-btn ha-icon { --mdc-icon-size: 24px; }
          /* Mode / fan list */
          .mode-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }
          .mode-item { padding: 14px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
          .mode-item:hover { background: rgba(255,255,255,0.08); }
          .mode-item.active { background: ${color}; color: white; }
          /* Timeline / history */
          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color,#FFD700); z-index: 2; border: 2px solid var(--card-background-color,#1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color,rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${icon}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(isOn ? 'On' : 'Off')}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
              <button class="header-btn" id="humidifierHistoryBtn"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-tabs">
            <button class="tab-btn ${this._activeView === 'main' ? 'active' : ''}" id="tabMain" style="${this._activeView === 'main' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:water-percent"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Humidity</span>'}</button>
            ${modes.length > 0 ? `<button class="tab-btn ${this._activeView === 'modes' ? 'active' : ''}" id="tabModes" style="${this._activeView === 'modes' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:tune"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Mode</span>'}</button>` : ''}
            ${hasFan ? `<button class="tab-btn ${this._activeView === 'fan' ? 'active' : ''}" id="tabFan" style="${this._activeView === 'fan' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:fan"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Fan</span>'}</button>` : ''}
          </div>

          <div class="hki-popup-content" id="humidifierContent">
            ${this._renderHumidifierPopupContent(entity, color, minHumidity, maxHumidity, targetHumidity, currentHumidity, valueSize, valueWeight, borderRadius, hasFan, fanModes, currentFanMode)}
          </div>

          <div class="hki-popup-nav">
            <button class="nav-btn ${isOn ? 'active' : ''}" id="humidifierToggle" style="${isOn ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="${isOn ? 'mdi:power' : 'mdi:power-off'}"></ha-icon>
              <span>${isOn ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      `;

      const container = portal.querySelector('.hki-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => { if (isBackgroundClick && e.target === portal) this._closePopup(); isBackgroundClick = false; });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#humidifierHistoryBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = this._activeView === 'history' ? 'main' : 'history';
          const content = portal.querySelector('#humidifierContent');
          if (content) {
            content.innerHTML = this._renderHumidifierPopupContent(entity, color, minHumidity, maxHumidity, targetHumidity, currentHumidity, valueSize, valueWeight, borderRadius, hasFan, fanModes, currentFanMode);
            if (this._activeView === 'history') {
              setTimeout(() => this._loadHistory(), 100);
            } else {
              this._setupHumidifierContentHandlers(portal, entity, minHumidity, maxHumidity, fanEntity, fanEntityId);
            }
          }
        });
      }

      const toggleBtn = portal.querySelector('#humidifierToggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          this.hass.callService('humidifier', isOn ? 'turn_off' : 'turn_on', { entity_id: this._config.entity });
        });
      }

      const switchTab = (view) => {
        this._activeView = view;
        portal.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.style = this._getPopupButtonStyle(false); });
        const id = 'tab' + view.charAt(0).toUpperCase() + view.slice(1);
        const activeTab = portal.querySelector('#' + id);
        if (activeTab) { activeTab.classList.add('active'); activeTab.style = this._getPopupButtonStyle(true); }
        const content = portal.querySelector('#humidifierContent');
        if (content) {
          content.innerHTML = this._renderHumidifierPopupContent(entity, color, minHumidity, maxHumidity, targetHumidity, currentHumidity, valueSize, valueWeight, borderRadius, hasFan, fanModes, currentFanMode);
          this._setupHumidifierContentHandlers(portal, entity, minHumidity, maxHumidity, fanEntity, fanEntityId);
        }
      };

      const tabMain = portal.querySelector('#tabMain');
      if (tabMain) tabMain.addEventListener('click', () => { if (this._activeView !== 'main') switchTab('main'); });
      const tabModes = portal.querySelector('#tabModes');
      if (tabModes) tabModes.addEventListener('click', () => { if (this._activeView !== 'modes') switchTab('modes'); });
      const tabFan = portal.querySelector('#tabFan');
      if (tabFan) tabFan.addEventListener('click', () => { if (this._activeView !== 'fan') switchTab('fan'); });

      this._setupHumidifierContentHandlers(portal, entity, minHumidity, maxHumidity, fanEntity, fanEntityId);
    }

    _renderHumidifierPopupContent(entity, color, minHumidity, maxHumidity, targetHumidity, currentHumidity, valueSize, valueWeight, borderRadius, hasFan, fanModes, currentFanMode) {
      if (this._activeView === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }
      if (this._activeView === 'modes') {
        const modes = entity.attributes.available_modes || [];
        const currentMode = entity.attributes.mode || 'normal';
        return this._renderHumidifierModesList(modes, currentMode, color);
      }
      if (this._activeView === 'fan') {
        // Re-read fan entity state fresh at render time so the active selection
        // is always current even when switching tabs.
        const liveFanEntityId = this._config.humidifier_fan_entity || '';
        const liveFanEntity = liveFanEntityId ? this.hass?.states?.[liveFanEntityId] : null;
        const liveFanModes = liveFanEntity?.attributes?.options || liveFanEntity?.attributes?.fan_modes || fanModes || [];
        const liveFanMode = liveFanEntity?.state || currentFanMode || '';
        return this._renderHumidifierFanList(liveFanModes, liveFanMode, color);
      }
      if (entity.state === 'off') {
        return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="opacity:0.5;font-size:18px;font-weight:500;">Humidifier is Off</div></div>`;
      }

      const attrs = entity.attributes || {};
      const useCircular = this._config.humidifier_use_circular_slider === true;
      const showButtons = this._config.humidifier_show_plus_minus === true;
      const labelSize = this._config.popup_label_font_size || 11;
      const labelWeight = this._config.popup_label_font_weight || 500;
      const vSize = this._config.popup_value_font_size || 64;
      const vWeight = this._config.popup_value_font_weight || 200;
      const range = maxHumidity - minHumidity;

      // Range (min/max target) support
      const humLow = this._optimisticHumidityLow ?? attrs.target_humidity_low ?? null;
      const humHigh = this._optimisticHumidityHigh ?? attrs.target_humidity_high ?? null;
      const isRange = humLow !== null && humHigh !== null && this._config.humidifier_show_target_range !== false;

      if (useCircular) {
        if (isRange) {
          return this._buildHumidifierDualCircle(humLow, humHigh, minHumidity, maxHumidity, color, labelSize, labelWeight, vSize, vWeight, showButtons);
        }
        return this._buildHumidifierSingleCircle(targetHumidity, currentHumidity, minHumidity, maxHumidity, color, labelSize, labelWeight, vSize, vWeight, showButtons);
      }

      // ── Vertical slider ─────────────────────────────────────────────────────
      const humBlue = '#03a9f4';
      const humGradientCss = 'linear-gradient(to top, #8BC34A 0%, #29B6F6 45%, #0277BD 100%)';
      const renderSlider = (id, value, label) => {
        const v = value ?? '--';
        const pct = value == null ? 0 : ((value - minHumidity) / range) * 100;
        const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;
        return `
          <div class="humidifier-slider-group">
            <div class="value-display" id="display-${id}">${v}<span>%</span></div>
            <div class="vertical-slider-track" id="slider-${id}" data-type="${id}">
              <div class="vertical-slider-fill" style="height:${pct}%;background:${humGradientCss};"></div>
              <div class="vertical-slider-thumb" style="bottom:${thumbPos}"></div>
            </div>
            <div class="slider-label">${label}</div>
          </div>
        `;
      };

      if (isRange) {
        const slidersHtml = `
          <div class="sliders-wrapper">
            ${renderSlider('humidity_low', humLow, 'Low')}
            ${renderSlider('humidity_high', humHigh, 'High')}
          </div>
        `;
        if (showButtons) {
          return `
            <div class="slider-with-buttons">
              <div class="slider-center">${slidersHtml}</div>
              <div class="vertical-temp-buttons">
                <button class="vertical-temp-btn plus" data-hum-action="plus-high"><ha-icon icon="mdi:plus"></ha-icon></button>
                <button class="vertical-temp-btn minus" data-hum-action="minus-high"><ha-icon icon="mdi:minus"></ha-icon></button>
              </div>
            </div>
          `;
        }
        return `<div class="slider-with-buttons"><div class="slider-center">${slidersHtml}</div></div>`;
      }

      const sliderHtml = `<div class="sliders-wrapper">${renderSlider('humidity', targetHumidity, 'Target')}</div>`;

      return `
        <div class="slider-with-buttons">
          <div class="humidifier-current-display">
            <div class="humidifier-current-label">Current</div>
            <div class="humidifier-current-value">${currentHumidity}<span style="font-size:18px;opacity:0.7;">%</span></div>
          </div>
          <div class="slider-center">${sliderHtml}</div>
          ${showButtons ? `
            <div class="vertical-temp-buttons">
              <button class="vertical-temp-btn plus" data-hum-action="plus"><ha-icon icon="mdi:plus"></ha-icon></button>
              <button class="vertical-temp-btn minus" data-hum-action="minus"><ha-icon icon="mdi:minus"></ha-icon></button>
            </div>
          ` : ''}
        </div>
      `;
    }

    _buildHumidifierSingleCircle(targetHumidity, currentHumidity, minHumidity, maxHumidity, color, labelSize, labelWeight, vSize, vWeight, showButtons) {
      const range = maxHumidity - minHumidity;
      const pct = Math.max(0, Math.min(100, ((targetHumidity - minHumidity) / range) * 100));
      const maxArcLen = 628.32 * 0.75;
      const arcLen = (pct / 100) * maxArcLen;
      const sa = 135 * (Math.PI / 180);
      const aa = (pct / 100) * 270 * (Math.PI / 180);
      const tx = 140 + 100 * Math.cos(sa + aa);
      const ty = 140 + 100 * Math.sin(sa + aa);
      const useGradient = this._config.humidifier_show_gradient !== false;
      const stroke = useGradient ? 'url(#humGradient)' : color;
      const gradDefs = useGradient ? '<defs><linearGradient id="humGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#8BC34A;stop-opacity:1"/><stop offset="40%" style="stop-color:#29B6F6;stop-opacity:1"/><stop offset="100%" style="stop-color:#0277BD;stop-opacity:1"/></linearGradient></defs>' : '';
      return `
        <div class="circular-slider-wrapper">
          <div class="circular-slider-container" id="circularSliderHum">
            <svg class="circular-slider-svg" viewBox="0 0 280 280" width="280" height="280">
              ${gradDefs}
              <circle cx="140" cy="140" r="100" fill="none" stroke="var(--divider-color,rgba(255,255,255,0.05))" stroke-width="20" stroke-dasharray="${maxArcLen} 628.32" transform="rotate(135 140 140)"/>
              <circle cx="140" cy="140" r="100" fill="none" stroke="${stroke}" stroke-width="20" stroke-linecap="round" stroke-dasharray="${arcLen} 628.32" transform="rotate(135 140 140)" id="humCircularProgress"/>
              <circle cx="${tx}" cy="${ty}" r="12" fill="white" stroke="var(--card-background-color,#1c1c1c)" stroke-width="3" id="humCircularThumb" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"/>
            </svg>
            <div class="circular-value-display">
              <div class="circular-temp-label-top" style="font-size:${labelSize}px;font-weight:${labelWeight};">TARGET</div>
              <div class="circular-temp-value" id="humCircularValue" style="font-size:${vSize}px;font-weight:${vWeight};">${targetHumidity}<span style="font-size:${vSize/2}px;">%</span></div>
              <div style="font-size:13px;opacity:0.5;margin-top:8px;">Now: ${currentHumidity}%</div>
            </div>
          </div>
          ${showButtons ? `
            <div class="circular-temp-buttons">
              <button class="circular-temp-btn plus" data-hum-action="plus"><ha-icon icon="mdi:plus"></ha-icon></button>
              <button class="circular-temp-btn minus" data-hum-action="minus"><ha-icon icon="mdi:minus"></ha-icon></button>
            </div>
          ` : ''}
        </div>
      `;
    }

    _buildHumidifierDualCircle(humLow, humHigh, minHumidity, maxHumidity, color, labelSize, labelWeight, vSize, vWeight, showButtons) {
      const range = maxHumidity - minHumidity;
      const sz = Math.round(vSize * 0.75);
      const buildArc = (val, idSuffix, gradId, col1, col2) => {
        const pct = Math.max(0, Math.min(100, ((val - minHumidity) / range) * 100));
        const maxArcLen = 628.32 * 0.75;
        const arcLen = (pct / 100) * maxArcLen;
        const sa = 135 * (Math.PI / 180);
        const aa = (pct / 100) * 270 * (Math.PI / 180);
        const tx = 140 + 100 * Math.cos(sa + aa);
        const ty = 140 + 100 * Math.sin(sa + aa);
        const useGradient = this._config.humidifier_show_gradient !== false;
        const stroke = useGradient ? ('url(#' + gradId + ')') : color;
        const gradDefs = useGradient ? ('<defs><linearGradient id="' + gradId + '" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:' + col1 + ';stop-opacity:1"/><stop offset="100%" style="stop-color:' + col2 + ';stop-opacity:1"/></linearGradient></defs>') : '';
        return `
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div style="font-size:${labelSize}px;font-weight:${labelWeight};opacity:0.6;text-transform:uppercase;letter-spacing:1.5px;">${idSuffix}</div>
            <div class="circular-slider-container" id="circularSliderHum${idSuffix}" style="width:200px;height:200px;">
              <svg class="circular-slider-svg" viewBox="0 0 280 280" width="200" height="200">
                ${gradDefs}
                <circle cx="140" cy="140" r="100" fill="none" stroke="var(--divider-color,rgba(255,255,255,0.05))" stroke-width="15" stroke-dasharray="${maxArcLen} 628.32" transform="rotate(135 140 140)"/>
                <circle cx="140" cy="140" r="100" fill="none" stroke="${stroke}" stroke-width="15" stroke-linecap="round" stroke-dasharray="${arcLen} 628.32" transform="rotate(135 140 140)" id="humCircularProgress${idSuffix}"/>
                <circle cx="${tx}" cy="${ty}" r="12" fill="white" stroke="var(--card-background-color,#1c1c1c)" stroke-width="3" id="humCircularThumb${idSuffix}" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"/>
              </svg>
              <div class="circular-value-display">
                <div class="circular-temp-label-top" style="font-size:${labelSize}px;font-weight:${labelWeight};">TARGET</div>
                <div class="circular-temp-value" id="humCircularValue${idSuffix}" style="font-size:${sz}px;font-weight:${vWeight};">${val}<span style="font-size:${sz/2}px;">%</span></div>
              </div>
            </div>
          </div>
        `;
      };
      return `
        <div class="circular-slider-wrapper">
          ${buildArc(humLow, 'Low', 'humGradLow', '#8BC34A', '#29B6F6')}
          ${buildArc(humHigh, 'High', 'humGradHigh', '#29B6F6', '#0277BD')}
          ${showButtons ? `
            <div class="circular-temp-buttons">
              <button class="circular-temp-btn plus" data-hum-action="plus-high"><ha-icon icon="mdi:plus"></ha-icon></button>
              <button class="circular-temp-btn minus" data-hum-action="minus-high"><ha-icon icon="mdi:minus"></ha-icon></button>
            </div>
          ` : ''}
        </div>
      `;
    }
    _renderHumidifierModesList(modes, currentMode, color) {
      return `
        <div class="mode-list">
          ${modes.map(mode => `
            <div class="mode-item ${mode === currentMode ? 'active' : ''}" data-mode="${mode}">
              <span style="text-transform:capitalize;">${mode.replace(/_/g, ' ')}</span>
              ${mode === currentMode ? '<ha-icon icon="mdi:check"></ha-icon>' : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    _renderHumidifierFanList(fanModes, currentFanMode, color) {
      if (!fanModes || !fanModes.length) return `<div style="opacity:0.6;padding:20px;">No fan modes available</div>`;
      return `
        <div class="mode-list">
          ${fanModes.map(mode => `
            <div class="mode-item ${mode === currentFanMode ? 'active' : ''}" data-fan-mode="${mode}">
              <span style="text-transform:capitalize;">${mode.replace(/_/g, ' ')}</span>
              ${mode === currentFanMode ? '<ha-icon icon="mdi:check"></ha-icon>' : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    _setupHumidifierContentHandlers(portal, entity, minHumidity, maxHumidity, fanEntity, fanEntityId) {
      if (this._activeView === 'history') return;

      if (this._activeView === 'modes') {
        portal.querySelectorAll('.mode-item').forEach(item => {
          item.addEventListener('click', () => {
            this.hass.callService('humidifier', 'set_mode', { entity_id: this._config.entity, mode: item.getAttribute('data-mode') });
          });
        });
        return;
      }

      if (this._activeView === 'fan') {
        // Refresh live state from hass at call time (not stale closure)
        const liveFanEntity = fanEntityId ? this.hass?.states?.[fanEntityId] : null;
        portal.querySelectorAll('[data-fan-mode]').forEach(item => {
          item.addEventListener('click', () => {
            if (!fanEntityId) return;
            const mode = item.getAttribute('data-fan-mode');
            // Optimistic UI: mark clicked item active immediately
            portal.querySelectorAll('[data-fan-mode]').forEach(el => {
              el.classList.remove('active');
              el.querySelector('ha-icon[icon="mdi:check"]')?.remove();
            });
            item.classList.add('active');
            item.insertAdjacentHTML('beforeend', '<ha-icon icon="mdi:check"></ha-icon>');
            // Call service
            const domainGuess = fanEntityId.split('.')[0];
            if (domainGuess === 'select') {
              this.hass.callService('select', 'select_option', { entity_id: fanEntityId, option: mode });
            } else if (domainGuess === 'fan') {
              this.hass.callService('fan', 'set_preset_mode', { entity_id: fanEntityId, preset_mode: mode });
            } else {
              // Fallback: try select first
              this.hass.callService('select', 'select_option', { entity_id: fanEntityId, option: mode });
            }
          });
        });
        return;
      }

      const attrs = entity.attributes || {};
      const useCircular = this._config.humidifier_use_circular_slider === true;
      const step = this._config.humidifier_humidity_step ? parseFloat(this._config.humidifier_humidity_step) : 1;
      const range = maxHumidity - minHumidity;
      const humLowAttr = attrs.target_humidity_low ?? null;
      const humHighAttr = attrs.target_humidity_high ?? null;
      const isRange = humLowAttr !== null && humHighAttr !== null && this._config.humidifier_show_target_range !== false;

      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v / step) * step));
      const commitRange = (low, high) => {
        // Route range to climate.set_temperature directly (target_temp_low / target_temp_high)
        // because HA humidifier domain doesn't have a native range service.
        // Our custom component also handles this via climate entity id stored in hass state attributes.
        const climateEntityId = entity.attributes?.source_climate_entity;
        if (climateEntityId) {
          this.hass.callService('climate', 'set_temperature', {
            entity_id: climateEntityId,
            target_temp_low: low,
            target_temp_high: high,
          });
        } else {
          // Fallback: call humidifier set_humidity with range params (custom component handles it)
          this.hass.callService('humidifier', 'set_humidity', {
            entity_id: this._config.entity,
            humidity: low,
          });
        }
      };

      if (useCircular) {
        const maxArc = 628.32 * 0.75;

        const setupCircle = (idSuffix, getOptimistic, setOptimistic, commitFn) => {
          const circEl = portal.querySelector(`#circularSliderHum${idSuffix}`);
          if (!circEl) return;
          const svg = circEl.querySelector('svg');
          const progress = circEl.querySelector(`#humCircularProgress${idSuffix}`);
          const thumb = circEl.querySelector(`#humCircularThumb${idSuffix}`);
          const valDisplay = circEl.querySelector(`#humCircularValue${idSuffix}`);
          const vSize = this._config.popup_value_font_size || 64;
          const sz = isRange ? Math.round(vSize * 0.75) : vSize;

          const updateFromVal = (val) => {
            setOptimistic(val);
            const pct = ((val - minHumidity) / range) * 100;
            const arcLen = (pct / 100) * maxArc;
            const sa = 135 * (Math.PI / 180);
            const aa = (pct / 100) * 270 * (Math.PI / 180);
            const tx = 140 + 100 * Math.cos(sa + aa);
            const ty = 140 + 100 * Math.sin(sa + aa);
            if (progress) progress.setAttribute('stroke-dasharray', `${arcLen} 628.32`);
            if (thumb) { thumb.setAttribute('cx', tx); thumb.setAttribute('cy', ty); }
            if (valDisplay) valDisplay.innerHTML = `${val}<span style="font-size:${sz/2}px;">%</span>`;
          };

          const getValFromPoint = (clientX, clientY) => {
            const rect = svg.getBoundingClientRect();
            const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            let angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
            if (angle < 0) angle += 360;
            let arcDeg = angle - 135;
            if (arcDeg < 0) arcDeg += 360;
            if (arcDeg > 270) arcDeg = arcDeg < 315 ? 270 : 0;
            return clamp(minHumidity + (arcDeg / 270) * range, minHumidity, maxHumidity);
          };

          let dragging = false;
          const onDown = (x, y) => { dragging = true; updateFromVal(getValFromPoint(x, y)); };
          const onMove = (x, y) => { if (dragging) updateFromVal(getValFromPoint(x, y)); };
          const onUp = () => {
            if (!dragging) return;
            dragging = false;
            commitFn(getOptimistic());
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
          };
          const mouseMove = (e) => onMove(e.clientX, e.clientY);
          const mouseUp = onUp;
          const touchMove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
          const touchEnd = onUp;

          circEl.addEventListener('mousedown', (e) => { onDown(e.clientX, e.clientY); document.addEventListener('mousemove', mouseMove); document.addEventListener('mouseup', mouseUp); });
          circEl.addEventListener('touchstart', (e) => { onDown(e.touches[0].clientX, e.touches[0].clientY); document.addEventListener('touchmove', touchMove, { passive: true }); document.addEventListener('touchend', touchEnd); }, { passive: true });
        };

        if (isRange) {
          setupCircle('Low',
            () => this._optimisticHumidityLow ?? humLowAttr,
            (v) => { this._optimisticHumidityLow = v; },
            (v) => commitRange(v, this._optimisticHumidityHigh ?? humHighAttr)
          );
          setupCircle('High',
            () => this._optimisticHumidityHigh ?? humHighAttr,
            (v) => { this._optimisticHumidityHigh = v; },
            (v) => commitRange(this._optimisticHumidityLow ?? humLowAttr, v)
          );
          // +/- buttons act on High in range mode
          portal.querySelectorAll('[data-hum-action]').forEach(btn => {
            btn.addEventListener('click', () => {
              const action = btn.getAttribute('data-hum-action');
              if (action === 'plus-high' || action === 'minus-high') {
                const dir = action.startsWith('plus') ? 1 : -1;
                const cur = this._optimisticHumidityHigh ?? humHighAttr;
                const val = clamp(cur + dir * step, minHumidity, maxHumidity);
                this._optimisticHumidityHigh = val;
                commitRange(this._optimisticHumidityLow ?? humLowAttr, val);
              }
            });
          });
        } else {
          setupCircle('',
            () => this._optimisticHumidity ?? attrs.humidity,
            (v) => { this._optimisticHumidity = v; },
            (v) => this.hass.callService('humidifier', 'set_humidity', { entity_id: this._config.entity, humidity: v })
          );
          portal.querySelectorAll('[data-hum-action]').forEach(btn => {
            btn.addEventListener('click', () => {
              const cur = this._optimisticHumidity ?? attrs.humidity ?? minHumidity;
              const dir = btn.getAttribute('data-hum-action') === 'plus' ? 1 : -1;
              const val = clamp(cur + dir * step, minHumidity, maxHumidity);
              this._optimisticHumidity = val;
              this.hass.callService('humidifier', 'set_humidity', { entity_id: this._config.entity, humidity: val });
            });
          });
        }
        return;
      }

      // ── Vertical slider handlers ────────────────────────────────────────────
      if (isRange) {
        const setupVertical = (idSuffix, getOptimistic, setOptimistic, commitFn) => {
          const slider = portal.querySelector(`#slider-${idSuffix}`);
          if (!slider) return;
          const update = (clientY) => {
            const rect = slider.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
            const val = clamp(minHumidity + pct * range, minHumidity, maxHumidity);
            setOptimistic(val);
            const display = portal.querySelector(`#display-${idSuffix}`);
            const fill = slider.querySelector('.vertical-slider-fill');
            const thumb = slider.querySelector('.vertical-slider-thumb');
            if (display) display.innerHTML = `${val}<span>%</span>`;
            const ap = ((val - minHumidity) / range) * 100;
            if (fill) fill.style.height = `${ap}%`;
            if (thumb) thumb.style.bottom = ap <= 0 ? '0px' : ap >= 100 ? 'calc(100% - 6px)' : `calc(${ap}% - 6px)`;
            return val;
          };
          let isDragging = false;
          slider.addEventListener('mousedown', (e) => { isDragging = true; update(e.clientY); });
          document.addEventListener('mousemove', (e) => { if (isDragging) update(e.clientY); });
          document.addEventListener('mouseup', (e) => { if (!isDragging) return; isDragging = false; commitFn(update(e.clientY)); });
          slider.addEventListener('touchstart', (e) => { isDragging = true; update(e.touches[0].clientY); }, { passive: true });
          document.addEventListener('touchmove', (e) => { if (isDragging) update(e.touches[0].clientY); }, { passive: true });
          document.addEventListener('touchend', (e) => { if (isDragging && e.changedTouches.length > 0) { isDragging = false; commitFn(update(e.changedTouches[0].clientY)); } }, { passive: true });
        };

        setupVertical('humidity_low',
          () => this._optimisticHumidityLow ?? humLowAttr,
          (v) => { this._optimisticHumidityLow = v; },
          (v) => commitRange(v, this._optimisticHumidityHigh ?? humHighAttr)
        );
        setupVertical('humidity_high',
          () => this._optimisticHumidityHigh ?? humHighAttr,
          (v) => { this._optimisticHumidityHigh = v; },
          (v) => commitRange(this._optimisticHumidityLow ?? humLowAttr, v)
        );

        portal.querySelectorAll('[data-hum-action]').forEach(btn => {
          btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-hum-action');
            if (action === 'plus-high' || action === 'minus-high') {
              const dir = action.startsWith('plus') ? 1 : -1;
              const cur = this._optimisticHumidityHigh ?? humHighAttr;
              const val = clamp(cur + dir * step, minHumidity, maxHumidity);
              this._optimisticHumidityHigh = val;
              commitRange(this._optimisticHumidityLow ?? humLowAttr, val);
            }
          });
        });
        return;
      }

      // Single vertical slider
      const slider = portal.querySelector('#slider-humidity');
      if (!slider) return;

      const updateHumidity = (clientY) => {
        const rect = slider.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
        const value = clamp(minHumidity + pct * range, minHumidity, maxHumidity);
        const display = portal.querySelector('#display-humidity');
        const fill = slider.querySelector('.vertical-slider-fill');
        const thumb = slider.querySelector('.vertical-slider-thumb');
        if (display) display.innerHTML = `${value}<span>%</span>`;
        const actualPct = ((value - minHumidity) / range) * 100;
        if (fill) fill.style.height = `${actualPct}%`;
        if (thumb) thumb.style.bottom = actualPct <= 0 ? '0px' : actualPct >= 100 ? 'calc(100% - 6px)' : `calc(${actualPct}% - 6px)`;
        return value;
      };

      portal.querySelectorAll('[data-hum-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = attrs.humidity ?? minHumidity;
          const dir = btn.getAttribute('data-hum-action') === 'plus' ? 1 : -1;
          const val = clamp(cur + dir * step, minHumidity, maxHumidity);
          this.hass.callService('humidifier', 'set_humidity', { entity_id: this._config.entity, humidity: val });
        });
      });

      let isDragging = false;
      slider.addEventListener('mousedown', (e) => { isDragging = true; updateHumidity(e.clientY); });
      document.addEventListener('mousemove', (e) => { if (isDragging) updateHumidity(e.clientY); });
      document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const value = updateHumidity(e.clientY);
        this.hass.callService('humidifier', 'set_humidity', { entity_id: this._config.entity, humidity: value });
      });
      slider.addEventListener('touchstart', (e) => { isDragging = true; updateHumidity(e.touches[0].clientY); }, { passive: true });
      document.addEventListener('touchmove', (e) => { if (isDragging) updateHumidity(e.touches[0].clientY); }, { passive: true });
      document.addEventListener('touchend', (e) => {
        if (isDragging && e.changedTouches.length > 0) {
          isDragging = false;
          const value = updateHumidity(e.changedTouches[0].clientY);
          this.hass.callService('humidifier', 'set_humidity', { entity_id: this._config.entity, humidity: value });
        }
      }, { passive: true });
    }


    /**
     * Fan Popup
     */
    _renderFanPopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.

      const name = this._getPopupName(entity);
      const attrs = entity.attributes || {};
      const state = entity.state;
      const isOn = state === 'on';
      const speed = attrs.percentage || 0;
      const presetModes = attrs.preset_modes || [];
      const currentPreset = attrs.preset_mode || null;
      const direction = attrs.direction || 'forward';
      const oscillating = attrs.oscillating || false;
      const supportsDirection = attrs.supported_features ? (attrs.supported_features & 2) !== 0 : false;
      const supportsOscillate = attrs.supported_features ? (attrs.supported_features & 4) !== 0 : false;
      
      const color = isOn ? 'var(--primary-color, #03a9f4)' : 'var(--disabled-text-color, #6f6f6f)';
      const icon = this._getResolvedIcon(entity, isOn ? 'mdi:fan' : 'mdi:fan-off');
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();

      const valueSize = this._config.popup_value_font_size || 36;
      const valueWeight = this._config.popup_value_font_weight || 300;

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-tabs {
            display: flex; gap: 8px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .tab-btn {
            flex: 1; height: 40px; border-radius: 8px;
            background: transparent; border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.2s; font-size: 14px; font-weight: 500;
          }
          .tab-btn:hover { background: var(--secondary-background-color, rgba(255,255,255,0.08)); }
          .tab-btn.active { 
            background: var(--primary-color, rgba(255,255,255,0.12)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }

          .hki-popup-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 0; }
          
          .fan-slider-wrapper {
            display: flex; align-items: center; justify-content: center; width: 100%;
          }
          .fan-slider-group { display: flex; flex-direction: column; align-items: center; gap: 12px; height: 320px; width: 80px; }
          .value-display { font-size: ${valueSize}px; font-weight: ${valueWeight}; text-align: center; }
          .value-display span { font-size: ${Math.max(14, Math.round(valueSize/2))}px; opacity: 0.7; }
          .slider-label { font-size: 12px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }

          .vertical-slider-track {
            width: 100%; flex: 1; 
            background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px; position: relative; overflow: hidden; cursor: pointer;
          }
          .vertical-slider-fill {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: ${color}; transition: background 0.3s;
            border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
          }
          .vertical-slider-thumb {
            position: absolute; left: 50%; transform: translateX(-50%);
            width: 90px; height: 6px; background: white;
            border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            pointer-events: none;
          }

          .hki-popup-nav {
            display: flex; justify-content: space-evenly; padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            gap: 8px;
            flex-shrink: 0;
            min-height: 74px; /* keep consistent even when empty */
            box-sizing: border-box;
          }
          .nav-btn {
            flex: 1; height: 50px; border-radius: 12px;
            border: none; background: transparent;
            color: var(--primary-text-color); opacity: 0.5;
            cursor: pointer;
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
            transition: all 0.2s; font-size: 11px;
          }
          .nav-btn:hover { opacity: 0.8; background: rgba(255, 255, 255, 0.05); }
          .nav-btn.active { 
            opacity: 1; 
            background: var(--primary-color, rgba(255,255,255,0.1)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .nav-btn ha-icon { --mdc-icon-size: 24px; }

          .preset-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }
          .preset-item { 
            padding: 14px; 
            background: rgba(255,255,255,0.05); 
            border-radius: 8px; 
            cursor: pointer; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            transition: all 0.2s;
          }
          .preset-item:hover { background: rgba(255,255,255,0.08); }
          .preset-item.active { background: ${color}; color: white; }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700); z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${icon}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(isOn ? speed + '%' : 'Off')}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
              <button class="header-btn" id="fanHistoryBtn"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-tabs">
            <button class="tab-btn ${this._activeView === 'main' ? 'active' : ''}" id="tabMain" style="${this._activeView === 'main' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:fan"></ha-icon>${this._config.popup_hide_button_text ? '' : '<span>Speed</span>'}</button>
            ${presetModes.length > 0 ? `<button class="tab-btn ${this._activeView === 'presets' ? 'active' : ''}" id="tabPresets" style="${this._activeView === 'presets' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}"><ha-icon icon="mdi:tune"></ha-icon><span>Presets</span></button>` : ''}
          </div>

          <div class="hki-popup-content" id="fanContent">
            ${this._renderFanPopupContent(entity, color, speed, valueSize, valueWeight, borderRadius)}
          </div>

          <div class="hki-popup-nav">
            <button class="nav-btn ${isOn ? 'active' : ''}" id="fanToggle" style="${isOn ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
              <ha-icon icon="${isOn ? 'mdi:power' : 'mdi:power-off'}"></ha-icon>
              <span>${isOn ? 'On' : 'Off'}</span>
            </button>
            ${supportsDirection ? `
              <button class="nav-btn ${direction === 'reverse' ? 'active' : ''}" id="fanDirection" style="${direction === 'reverse' ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                <ha-icon icon="${direction === 'reverse' ? 'mdi:rotate-left' : 'mdi:rotate-right'}"></ha-icon>
                <span>${direction === 'reverse' ? 'Reverse' : 'Forward'}</span>
              </button>
            ` : ''}
            ${supportsOscillate ? `
              <button class="nav-btn ${oscillating ? 'active' : ''}" id="fanOscillate" style="${oscillating ? this._getPopupButtonStyle(true) : this._getPopupButtonStyle(false)}">
                <ha-icon icon="${oscillating ? 'mdi:arrow-oscillating' : 'mdi:arrow-oscillating-off'}"></ha-icon>
                <span>Oscillate</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;

      const container = portal.querySelector('.hki-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#fanHistoryBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = this._activeView === 'history' ? 'main' : 'history';
          const content = portal.querySelector('#fanContent');
          if (content) {
            content.innerHTML = this._renderFanPopupContent(entity, color, speed, valueSize, valueWeight, borderRadius);
            if (this._activeView === 'history') {
              setTimeout(() => this._loadHistory(), 100);
            } else {
              this._setupFanContentHandlers(portal, entity);
            }
          }
        });
      }

      const toggleBtn = portal.querySelector('#fanToggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          this.hass.callService('fan', isOn ? 'turn_off' : 'turn_on', { entity_id: this._config.entity });
        });
      }

      const directionBtn = portal.querySelector('#fanDirection');
      if (directionBtn) {
        directionBtn.addEventListener('click', () => {
          this.hass.callService('fan', 'set_direction', {
            entity_id: this._config.entity,
            direction: direction === 'forward' ? 'reverse' : 'forward'
          });
        });
      }

      const oscillateBtn = portal.querySelector('#fanOscillate');
      if (oscillateBtn) {
        oscillateBtn.addEventListener('click', () => {
          this.hass.callService('fan', 'oscillate', {
            entity_id: this._config.entity,
            oscillating: !oscillating
          });
        });
      }

      const tabMain = portal.querySelector('#tabMain');
      if (tabMain) {
        tabMain.addEventListener('click', () => {
          if (this._activeView === 'main') return;
          this._activeView = 'main';
          const content = portal.querySelector('#fanContent');
          if (content) {
            content.innerHTML = this._renderFanPopupContent(entity, color, speed, valueSize, valueWeight, borderRadius);
            this._setupFanContentHandlers(portal, entity);
          }
          tabMain.classList.add('active');
          tabMain.style = this._getPopupButtonStyle(true);
          const tabPresets = portal.querySelector('#tabPresets');
          if (tabPresets) {
            tabPresets.classList.remove('active');
            tabPresets.style = this._getPopupButtonStyle(false);
          }
        });
      }

      const tabPresets = portal.querySelector('#tabPresets');
      if (tabPresets) {
        tabPresets.addEventListener('click', () => {
          if (this._activeView === 'presets') return;
          this._activeView = 'presets';
          const content = portal.querySelector('#fanContent');
          if (content) {
            content.innerHTML = this._renderFanPresetsList(presetModes, currentPreset, color);
            this._setupFanContentHandlers(portal, entity);
          }
          tabPresets.classList.add('active');
          tabPresets.style = this._getPopupButtonStyle(true);
          if (tabMain) {
            tabMain.classList.remove('active');
            tabMain.style = this._getPopupButtonStyle(false);
          }
        });
      }

      this._setupFanContentHandlers(portal, entity);
    }

    _renderFanPopupContent(entity, color, speed, valueSize, valueWeight, borderRadius) {
      if (this._activeView === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }

      if (this._activeView === 'presets') {
        const presetModes = entity.attributes.preset_modes || [];
        const currentPreset = entity.attributes.preset_mode || null;
        return this._renderFanPresetsList(presetModes, currentPreset, color);
      }

      if (entity.state === 'off') {
        return `<div class="climate-controls-view"><div style="opacity: 0.5; font-size: 18px; font-weight: 500;">Fan is Off</div></div>`;
      }

      const pct = speed;
      // Clamp thumb position so it's always visible (at 0% and 100%)
      const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;

      return `
        <div class="fan-slider-wrapper">
          <div class="fan-slider-group">
            <div class="value-display" id="displaySpeed">${speed}<span>%</span></div>
            <div class="vertical-slider-track" id="sliderSpeed">
              <div class="vertical-slider-fill" style="height: ${pct}%; background: ${color};"></div>
              <div class="vertical-slider-thumb" style="bottom: ${thumbPos}"></div>
            </div>
            <div class="slider-label">Speed</div>
          </div>
        </div>
      `;
    }

    _renderFanPresetsList(presetModes, currentPreset, color) {
      return `
        <div class="preset-list">
          ${presetModes.map(preset => `
            <div class="preset-item ${preset === currentPreset ? 'active' : ''}" data-preset="${preset}">
              <span style="text-transform: capitalize;">${preset.replace(/_/g, ' ')}</span>
              ${preset === currentPreset ? '<ha-icon icon="mdi:check"></ha-icon>' : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    _setupFanContentHandlers(portal, entity) {
      if (this._activeView === 'presets') {
        const presetItems = portal.querySelectorAll('.preset-item');
        presetItems.forEach(item => {
          item.addEventListener('click', () => {
            const preset = item.getAttribute('data-preset');
            this.hass.callService('fan', 'set_preset_mode', {
              entity_id: this._config.entity,
              preset_mode: preset
            });
          });
        });
        return;
      }

      if (this._activeView === 'history') {
        return;
      }

      const slider = portal.querySelector('#sliderSpeed');
      if (!slider) return;

      const updateSpeed = (clientY) => {
        const rect = slider.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, Math.round(((rect.bottom - clientY) / rect.height) * 100)));
        
        const display = portal.querySelector('#displaySpeed');
        const fill = slider.querySelector('.vertical-slider-fill');
        const thumb = slider.querySelector('.vertical-slider-thumb');
        
        if (display) display.innerHTML = `${pct}<span>%</span>`;
        if (fill) fill.style.height = `${pct}%`;
        // Clamp thumb position so it stays visible at 0% and 100%
        const thumbPos = pct <= 0 ? '0px' : pct >= 100 ? 'calc(100% - 6px)' : `calc(${pct}% - 6px)`;
        if (thumb) thumb.style.bottom = thumbPos;
        
        return pct;
      };

      let isDragging = false;
      const handleMove = (clientY) => {
        if (!isDragging) return;
        updateSpeed(clientY);
      };

      const handleEnd = (clientY) => {
        if (!isDragging) return;
        isDragging = false;
        const value = updateSpeed(clientY);
        this.hass.callService('fan', 'set_percentage', {
          entity_id: this._config.entity,
          percentage: value
        });
      };

      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSpeed(e.clientY);
      });
      document.addEventListener('mousemove', (e) => handleMove(e.clientY));
      document.addEventListener('mouseup', (e) => handleEnd(e.clientY));

      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSpeed(e.touches[0].clientY);
      }, { passive: true });
      document.addEventListener('touchmove', (e) => {
        if (isDragging) handleMove(e.touches[0].clientY);
      }, { passive: true });
      document.addEventListener('touchend', (e) => {
        if (isDragging && e.changedTouches.length > 0) {
          handleEnd(e.changedTouches[0].clientY);
        }
      }, { passive: true });
    }


    /**
     * Switch Popup
     */
    /**
     * Switch Popup - HomeKit Style Vertical Toggle
     */
    /**
     * Switch Popup - HomeKit Style Vertical Toggle
     */
    /**
     * Switch Popup - Centered Vertical Slider
     */
    /**
     * Switch Popup - Matching Light/Climate Slider Style
     */
    /**
     * Switch Popup - Large Prominent Thumb
     */
    /**
     * Switch Popup - Large Prominent Handle
     */
    /**
     * Switch Popup - Extra Thick Handle
     */
    /**
     * Switch Popup - Super Thick Pill Handle
     */
    /**
     * Switch Popup - Thick Pill Handle Matching Screenshot
     */
    /**
     * Switch Popup - Thick Pill Handle with Matching Border-Radius
     */
    /**
     * Switch Popup - Handle Follows Slider Border Radius
     */

    _renderSwitchPopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.
      this._popupType = 'switch';
      this._popupEntityId = entity?.entity_id || this._config?.entity || null;
      const hasRealEntity = !!entity;
      if (!entity) {
        entity = {
          entity_id: this._config?.entity || 'hki.dummy',
          state: '',
          attributes: { friendly_name: this._config?.name || 'Popup' },
          last_changed: new Date().toISOString(),
        };
      }


      const domain = (entity.entity_id || this._config.entity || '').split('.')[0] || this._getDomain();
      const serviceDomain = domain === 'group' ? 'homeassistant' : (domain === 'input_boolean' ? 'input_boolean' : 'switch');

      const name = this._getPopupName(entity);
      const state = entity.state;
      const isOn = state === 'on';

      const isGroup = Array.isArray(entity.attributes?.entity_id) && entity.attributes.entity_id.length > 1;

      // Check default view configuration for groups
      const defaultView = this._config.popup_default_view; // 'main', 'individual', or undefined
      
      // Auto-switch to individual/group view if configured and it's a group
      // Only set on initial render (when _activeView is not already 'group')
      if (defaultView === 'individual' && isGroup && this._activeView !== 'group') {
        this._activeView = 'group';
      } else if (!this._activeView || this._activeView === 'brightness') {
        // Reset to main view if not set or coming from light popup
        this._activeView = 'main';
      }

      const color = isOn ? 'var(--primary-color, #03a9f4)' : 'var(--disabled-text-color, #6f6f6f)';
      const icon = this._getResolvedIcon(entity, isOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off');
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();
      const handleRadius = Math.round(borderRadius * 0.7); // Handle radius follows slider radius proportionally
      const valueSize = this._config.popup_value_font_size || 36;
      const valueWeight = this._config.popup_value_font_weight || 300;

      const groupBtn = isGroup ? `
        <button class="header-btn" id="switchGroupBtn" title="Group">
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
        </button>
      ` : '';

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-popup-content { 
            flex: 1; padding: 20px; overflow-y: auto; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            min-height: 0; 
          }

          .switch-slider-container {
            display: flex; flex-direction: column; align-items: center; gap: 12px;
            width: 80px; height: 320px;
          }

          .switch-group-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
            justify-content: flex-start;
          }
          .switch-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 14px;
            background: var(--divider-color, rgba(255, 255, 255, 0.06));
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          .switch-row-left { display:flex; gap: 12px; align-items:center; min-width:0; }
          .switch-row-name { font-size: 14px; font-weight: 500; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
          .switch-row-state { font-size: 11px; opacity: 0.6; text-transform: capitalize; margin-top: 2px; }
          .switch-row-text { display:flex; flex-direction:column; min-width:0; }
          .switch-row-toggle {
            width: 46px; height: 30px; border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06);
            position: relative;
            cursor: pointer;
            flex-shrink: 0;
          }
          .switch-row-toggle.on { background: var(--primary-color, rgba(3,169,244,0.35)); border-color: rgba(3,169,244,0.45); }
          .switch-row-toggle-knob {
            width: 24px; height: 24px; border-radius: 50%;
            background: #fff;
            position: absolute; top: 50%;
            transform: translateY(-50%);
            left: 3px;
            transition: left 0.18s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.35);
          }
          .switch-row-toggle.on .switch-row-toggle-knob { left: 19px; }

          .value-display {
            font-size: ${valueSize}px;
            font-weight: ${valueWeight};
            text-align: center;
          }

          .slider-label {
            font-size: 12px;
            opacity: 0.5;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .vertical-slider-track {
            width: 100%; flex: 1;
            background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }

          .vertical-slider-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: ${color};
            transition: background 0.3s ease, height 0.3s ease;
            height: ${isOn ? '100%' : '0%'};
            border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
          }

          .vertical-slider-thumb {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 74px;
            height: 120px;
            background: white;
            border-radius: ${handleRadius}px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
            cursor: grab;
            pointer-events: none;
            transition: bottom 0.3s ease;
            bottom: ${isOn ? 'calc(100% - 124px)' : '4px'};
          }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 12px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700); z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.1)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }

          /* Keep popup layout consistent with other HKI popups (always show bottom bar) */
          .hki-popup-nav {
            display: flex; justify-content: space-evenly; padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            gap: 8px;
            flex-shrink: 0;
            min-height: 74px; /* same visual height even when empty */
            box-sizing: border-box;
          }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${icon}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(isOn ? 'On' : 'Off')}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
              ${groupBtn}
              <button class="header-btn" id="switchHistoryBtn" title="History"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-popup-content" id="switchContent">
            ${this._renderSwitchPopupContent(entity, color, icon, isOn, borderRadius, valueSize, valueWeight)}
          </div>

          <div class="hki-popup-nav"></div>
        </div>
      `;

      const container = portal.querySelector('.hki-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#switchHistoryBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = this._activeView === 'history' ? 'main' : 'history';
          this._renderSwitchPopupPortal(this._getEntity());
          if (this._activeView === 'history') {
            setTimeout(() => this._loadHistory(), 100);
          }
        });
      }

      const groupBtnEl = portal.querySelector('#switchGroupBtn');
      if (groupBtnEl) {
        groupBtnEl.addEventListener('click', () => {
          this._activeView = (this._activeView === 'group') ? 'main' : 'group';
          this._renderSwitchPopupPortal(this._getEntity());
        });
      }

      this._setupSwitchHandlers(portal, entity, serviceDomain);
    }

    _renderSwitchPopupContent(entity, color, icon, isOn, borderRadius, valueSize, valueWeight) {
      if (this._activeView === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }

      const isGroup = Array.isArray(entity.attributes?.entity_id) && entity.attributes.entity_id.length > 1;
      if (this._activeView === 'group' && isGroup) {
        const rows = (entity.attributes.entity_id || []).map((id) => {
          const st = this.hass?.states?.[id];
          if (!st) return '';
          const on = st.state === 'on';
          const nm = st.attributes?.friendly_name || id;
          return `
            <div class="switch-row" data-entity-id="${id}">
              <div class="switch-row-left">
                <ha-icon icon="${on ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}" style="color:${on ? 'var(--primary-color, #03a9f4)' : 'var(--disabled-text-color, #6f6f6f)'}; --mdc-icon-size:22px;"></ha-icon>
                <div class="switch-row-text">
                  <div class="switch-row-name">${nm}</div>
                  <div class="switch-row-state">${on ? 'On' : 'Off'}</div>
                </div>
              </div>
              <div class="switch-row-toggle ${on ? 'on' : ''}" data-toggle="1">
                <div class="switch-row-toggle-knob"></div>
              </div>
            </div>
          `;
        }).join('');

        return `<div class="switch-group-container" data-view-type="group">${rows || '<div style="opacity:0.6;text-align:center;padding:12px;">No members</div>'}</div>`;
      }

      return `
        <div class="switch-slider-container">
          <div class="value-display">${isOn ? 'On' : 'Off'}</div>
          <div class="vertical-slider-track" id="switchSlider">
            <div class="vertical-slider-fill"></div>
            <div class="vertical-slider-thumb"></div>
          </div>
          <div class="slider-label">Switch</div>
        </div>
      `;
    }

    _renderCustomPopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.
      this._popupType = 'custom';
      this._popupEntityId = entity?.entity_id || this._config?.entity || null;
      const hasRealEntity = !!entity;
      if (!entity) {
        entity = {
          entity_id: this._config?.entity || 'hki.dummy',
          state: '',
          attributes: { friendly_name: this._config?.name || 'Popup' },
          last_changed: new Date().toISOString(),
        };
      }


      const name = this._getPopupName(entity) || 'Popup';
      const state = entity?.state || '';
      const domain = entity ? this._getDomain() : '';
      const icon = entity ? this._getResolvedIcon(entity, this._getDomainIcon(domain)) : (this._config?.icon || 'mdi:information');
      
      // Get state color based on domain and state
      let color;
      if (!entity) {
        color = 'var(--primary-color, #03a9f4)';
      } else if (domain === 'climate') {
        color = this._getClimateColor(entity);
      } else if (domain === 'light' && state === 'on') {
        color = this._getCurrentColor() || '#ffc107';
      } else {
        color = (state === 'on' || state === 'open' || state === 'locked') 
          ? 'var(--primary-color, #03a9f4)' 
          : 'var(--disabled-text-color, #6f6f6f)';
      }

      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-popup-content { 
            flex: 1; padding: 20px; overflow-y: auto; 
            display: flex; flex-direction: column;
            min-height: 0; 
          }

          .custom-card-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 12px;
          }

          /* Timeline history - consistent with other popups */
          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700); z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }

          .hki-popup-nav {
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
            min-height: 74px;
            box-sizing: border-box;
          }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${icon}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(this._getLocalizedState(state, domain))}${hasRealEntity && this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
              ${hasRealEntity ? `<button class="header-btn" id="historyBtn" title="History"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>` : ''}
              <button class="header-btn" id="closeBtn" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-popup-content" id="customContent">
            ${this._renderCustomPopupContent(entity)}
          </div>

          <div class="hki-popup-nav"></div>
        </div>
      `;

      // No stopPropagation on container - embedded cards need click events for their actions.
      // Background-click-to-close is handled below via the isBackgroundClick flag instead.

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

      // Forward hass-action events from built-in HA cards (button, tile, etc.).
      // These cards fire hass-action events that need to reach the Lovelace handler.
      // The portal lives on document.body (outside the HA tree), so we re-dispatch
      // from `this` which IS inside the tree and will bubble to the correct handler.
      portal.addEventListener('hass-action', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('hass-action', {
          detail: e.detail,
          bubbles: true,
          composed: true,
        }));
      });

      // Forward more-info and dialog events — tile/button cards fire these directly
      // and they must reach the HA root to open the dialog.
      // Close our popup first so the dialog is fully visible.
      ['hass-more-info', 'hass-show-dialog', 'show-dialog'].forEach(evtName => {
        portal.addEventListener(evtName, (e) => {
          e.stopPropagation();
          this._closePopup();
          this.dispatchEvent(new CustomEvent(evtName, {
            detail: e.detail,
            bubbles: true,
            composed: true,
          }));
        });
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#historyBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = this._activeView === 'history' ? 'main' : 'history';
          const content = portal.querySelector('#customContent');
          if (content) {
            content.innerHTML = this._renderCustomPopupContent(entity);
            if (this._activeView === 'history') {
              setTimeout(() => this._loadHistory(), 100);
            } else {
              this._renderCustomCard();
            }
          }
        });
      }

      // Render the custom card after portal is in DOM
      this._renderCustomCard();
    }

    _renderCustomPopupContent(entity) {
      if (this._activeView === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }

      return `<div class="custom-card-container" id="customCardContainer"></div>`;
    }

    _renderCustomCard() {
      const container = this._popupPortal?.querySelector('#customCardContainer');
      const cardConfig = this._config.custom_popup?.card || this._config.custom_popup_card;
      
      if (!container || !cardConfig) return;

      try {
        // Try to use Home Assistant's helpers if available
        let cardElement;
        
        if (window.loadCardHelpers) {
          // Modern HA - use card helpers
          window.loadCardHelpers().then(helpers => {
            if (helpers && helpers.createCardElement) {
              cardElement = helpers.createCardElement(cardConfig);
              cardElement.hass = this.hass;
              container.innerHTML = '';
              container.appendChild(cardElement);
            }
          }).catch(err => {
            console.warn('Card helpers not available, falling back to createElement:', err);
            this._createCardElementFallback(container, cardConfig);
          });
        } else {
          // Fallback for older HA or when helpers unavailable
          this._createCardElementFallback(container, cardConfig);
        }
      } catch (error) {
        console.error('Failed to render custom popup card:', error);
        container.innerHTML = `
          <div style="padding: 20px; text-align: center; opacity: 0.6;">
            <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; color: var(--error-color);"></ha-icon>
            <div style="margin-top: 12px;">Failed to load custom card</div>
            <div style="font-size: 12px; margin-top: 8px;">${error.message}</div>
          </div>
        `;
      }
    }

    _createCardElementFallback(container, cardConfig) {
      try {
        // Built-in HA cards are registered as hui-<type>-card, not as their YAML type name.
        // Custom cards (type starts with 'custom:') use the registered custom element name.
        const type = cardConfig.type || 'hui-error-card';
        let tagName;
        if (type.startsWith('custom:')) {
          tagName = type.replace('custom:', '');
        } else {
          tagName = `hui-${type}-card`;
        }
        const cardElement = document.createElement(tagName);
        
        // Set config first (some cards need this before hass)
        if (cardElement.setConfig) {
          cardElement.setConfig(cardConfig);
        }
        
        // Then set hass
        cardElement.hass = this.hass;

        // Clear container and add card
        container.innerHTML = '';
        container.appendChild(cardElement);
      } catch (error) {
        console.error('Fallback card creation failed:', error);
        container.innerHTML = `
          <div style="padding: 20px; text-align: center; opacity: 0.6;">
            <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; color: var(--error-color);"></ha-icon>
            <div style="margin-top: 12px;">Card type "${cardConfig.type}" not found</div>
            <div style="font-size: 11px; margin-top: 8px;">Make sure the card is installed and registered</div>
          </div>
        `;
      }
    }

    _setupSwitchHandlers(portal, entity, serviceDomain = null) {
      if (!portal || !entity) return;

      const getServiceDomainForId = (id) => {
        const d = String(id || '').split('.')[0];
        if (d === 'group') return 'homeassistant';
        return d === 'input_boolean' ? 'input_boolean' : 'switch';
      };
      const sd = serviceDomain || getServiceDomainForId(entity.entity_id || this._config.entity);

      // Group view handlers
      if (this._activeView === 'group') {
        portal.querySelectorAll('.switch-row').forEach((row) => {
          const id = row.getAttribute('data-entity-id');
          const toggle = row.querySelector('.switch-row-toggle');
          if (!id || !toggle) return;

          toggle.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const st = this.hass?.states?.[id];
            const isOn = st?.state === 'on';
            const dom = getServiceDomainForId(id);
            this.hass.callService(dom, isOn ? 'turn_off' : 'turn_on', { entity_id: id });
          });
        });
        return;
      }

      // Main view: click track toggles
      if (this._activeView === 'history') return;

      const switchEl = portal.querySelector('#switchSlider');
      if (!switchEl) return;

      switchEl.addEventListener('click', () => {
        const isOn = entity.state === 'on';
        this.hass.callService(sd, isOn ? 'turn_off' : 'turn_on', { entity_id: this._config.entity });
      });
    }
    _renderLockPopupPortal(entity) {
      // Reuse existing portal to avoid flicker on hass updates.

      const name = this._getPopupName(entity);
      const state = entity.state;
      const isLocked = state === 'locked';
      const isUnlocked = state === 'unlocked';
      const isJammed = state === 'jammed';
      const isLocking = state === 'locking';
      const isUnlocking = state === 'unlocking';
      
      // Check contact sensor
      const contactSensorEntity = this._config.lock_contact_sensor_entity ? this.hass.states[this._config.lock_contact_sensor_entity] : null;
      const contactSensorState = contactSensorEntity ? contactSensorEntity.state : null;
      const isContactOpen = contactSensorState === 'on' || contactSensorState === 'open' || contactSensorState === true || contactSensorState === 'True';
      const contactOpenLabel = this._config.lock_contact_sensor_label || "Door Open";
      
      // Override color and state text if contact sensor is open
      let color = isLocked ? '#4CAF50' : (isJammed ? '#F44336' : '#FFC107');
      let icon = this._getResolvedIcon(entity, isLocked ? 'mdi:lock' : (isJammed ? 'mdi:lock-alert' : 'mdi:lock-open'));
      let stateText = this._getLocalizedState(state, 'lock');
      
      if (isContactOpen) {
        color = '#F44336'; // Red when contact sensor is open
        icon = this._getResolvedIcon(entity, 'mdi:lock-alert');
        stateText = contactOpenLabel;
      }
      
      const borderRadius = this._config.popup_slider_radius ?? 12;
      const popupBorderRadius = this._config.popup_border_radius ?? 16;
      const { width: popupWidth, height: popupHeight } = this._getPopupDimensions();
      const handleRadius = Math.round(borderRadius * 0.7); // Handle radius follows slider radius proportionally
      const valueSize = this._config.popup_value_font_size || 36;
      const valueWeight = this._config.popup_value_font_weight || 300;

      // Supported features: bit 0 (1) indicates "open" support for locks in Home Assistant
      const canOpenDoor = ((Number(entity?.attributes?.supported_features) || 0) & 1) === 1;

      const portal = this._popupPortal || document.createElement('div');
      portal.className = 'hki-popup-portal';
      // Clear previous content when reusing.
      portal.innerHTML = '';

      // Calculate slider position (locked = top/100%, unlocked = bottom/0%)
      // Use actual state for slider position, not transition states
      const sliderPosition = (isLocked || isLocking) ? 100 : 0;
      
      // Calculate proper bottom position to keep handle inside container (handle is 120px tall, 50% of ~240px slider track)
      let handleBottom;
      if (sliderPosition === 0) {
        handleBottom = '4px';
      } else if (sliderPosition === 100) {
        handleBottom = 'calc(100% - 124px)';
      } else {
        handleBottom = `calc(${sliderPosition}% - 60px)`;
      }

      portal.innerHTML = `
        <style>
          .hki-popup-portal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            ${this._getPopupPortalStyle()}
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .hki-popup-container {
            ${this._getPopupCardStyle()};
            border-radius: ${popupBorderRadius}px;
            width: ${popupWidth}; height: ${popupHeight};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex; flex-direction: column; overflow: hidden; user-select: none; -webkit-user-select: none;
          }
          .hki-popup-header {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            flex-shrink: 0;
          }
          .hki-popup-title { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
          .hki-popup-title ha-icon { --mdc-icon-size: 24px; }
          .hki-popup-title-text { display: flex; flex-direction: column; gap: 2px; font-size: 16px; font-weight: 500; min-width: 0; }
          .hki-popup-state { font-size: 12px; opacity: 0.6; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hki-popup-header-controls { display: flex; gap: 8px; align-items: center; }
          .header-btn {
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--divider-color, rgba(255, 255, 255, 0.05)); border: none;
            color: var(--primary-text-color); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .header-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.05); }
          .header-btn ha-icon { --mdc-icon-size: 20px; }

          .hki-popup-content { 
            flex: 1; padding: 20px; overflow-y: auto; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            min-height: 0; 
          }

          .lock-slider-container {
            display: flex; flex-direction: column; align-items: center; gap: 12px;
            width: 80px; height: 320px;
          }
          
          .value-display {
            font-size: ${valueSize}px;
            font-weight: ${valueWeight};
            text-align: center;
          }
          
          .slider-label {
            font-size: 12px;
            opacity: 0.5;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .vertical-slider-track {
            width: 100%; flex: 1;
            background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
            border: 2px solid var(--divider-color, rgba(255, 255, 255, 0.1));
            border-radius: ${borderRadius}px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          
          .vertical-slider-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: ${color};
            transition: height 0.3s ease, background 0.3s ease;
            height: ${sliderPosition}%;
            border-radius: 0 0 ${Math.max(0, borderRadius - 2)}px ${Math.max(0, borderRadius - 2)}px;
          }
          
          .vertical-slider-thumb {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 74px;
            height: 120px;
            background: white;
            border-radius: ${handleRadius}px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
            cursor: grab;
            pointer-events: none;
            transition: bottom 0.3s ease;
            bottom: ${handleBottom};
          }

          .hki-popup-nav {
            display: flex; justify-content: space-evenly; padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
            gap: 8px;
            flex-shrink: 0;
            min-height: 74px; /* keep consistent even when empty */
            box-sizing: border-box;
          }
          .nav-btn {
            flex: 1; height: 50px; border-radius: 12px;
            border: none; background: transparent;
            color: var(--primary-text-color); opacity: 0.5;
            cursor: pointer;
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
            transition: all 0.2s; font-size: 11px;
          }
          .nav-btn:hover { opacity: 0.8; background: rgba(255, 255, 255, 0.05); }
          .nav-btn.active { 
            opacity: 1; 
            background: var(--primary-color, rgba(255,255,255,0.1)); 
            color: var(--text-primary-color, var(--primary-text-color));
          }
          .nav-btn ha-icon { --mdc-icon-size: 24px; }

          .timeline-container { width: 100%; height: 100%; padding: 0 10px 10px 10px; box-sizing: border-box; overflow-y: auto; align-self: stretch; }
          .timeline-item { display: flex; gap: 16px; margin-bottom: 0; min-height: 40px; position: relative; }
          .timeline-visual { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
          .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color, #FFD700); z-index: 2; border: 2px solid var(--card-background-color, #1c1c1c); margin-top: 3px; }
          .timeline-line { width: 2px; flex-grow: 1; background: var(--divider-color, rgba(255,255,255,0.12)); margin-top: -2px; margin-bottom: -4px; }
          .timeline-item:last-child .timeline-line { display: none; }
          .timeline-content { flex: 1; padding-bottom: 16px; font-size: 13px; color: var(--primary-text-color); }
          .timeline-detail { font-size: 11px; opacity: 0.6; display: block; margin-top: 4px; }
          .timeline-ago { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; }
          .timeline-trigger { font-size: 10px; opacity: 0.5; display: block; margin-top: 2px; font-style: italic; }
          .history-loading { width: 100%; text-align: center; padding: 20px; opacity: 0.6; }
        </style>

        <div class="hki-popup-container">
          <div class="hki-popup-header">
            <div class="hki-popup-title">
              <ha-icon icon="${icon}" style="color: ${this._getPopupIconColor(color)}"></ha-icon>
              <div class="hki-popup-title-text">
                ${name}
                <span class="hki-popup-state">${this._getPopupHeaderState(stateText)}${this._formatLastTriggered(entity) ? ` - ${this._formatLastTriggered(entity)}` : ''}</span>
              </div>
            </div>
            <div class="hki-popup-header-controls">
              <button class="header-btn" id="lockHistoryBtn"><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="header-btn" id="closeBtn"><ha-icon icon="mdi:close"></ha-icon></button>
            </div>
          </div>

          <div class="hki-popup-content" id="lockContent">
            ${this._renderLockPopupContent(entity, color, icon, stateText, sliderPosition, borderRadius, valueSize, valueWeight)}
          </div>

          <div class="hki-popup-nav">
            ${canOpenDoor ? `
              <button class="nav-btn" id="openDoorBtn" style="${this._getPopupButtonStyle(false)}">
                <ha-icon icon="mdi:door-open"></ha-icon>
                ${this._config.popup_hide_button_text ? '' : '<span>Open Door</span>'}
              </button>
            ` : ''}
          </div>
        </div>
      `;

      const container = portal.querySelector('.hki-popup-container');
      if (container) container.addEventListener('click', (e) => e.stopPropagation());

      let isBackgroundClick = false;
      portal.addEventListener('mousedown', (e) => { isBackgroundClick = (e.target === portal); });
      portal.addEventListener('touchstart', (e) => { isBackgroundClick = (e.target === portal); }, { passive: true });
      portal.addEventListener('click', (e) => {
        if (isBackgroundClick && e.target === portal) this._closePopup();
        isBackgroundClick = false;
      });

      if (!this._popupPortal) {
        document.body.appendChild(portal);
        this._applyOpenAnimation(portal);
      }
      this._popupPortal = portal;

      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const historyBtn = portal.querySelector('#lockHistoryBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this._activeView = this._activeView === 'history' ? 'main' : 'history';
          const content = portal.querySelector('#lockContent');
          if (content) {
            content.innerHTML = this._renderLockPopupContent(entity, color, icon, stateText, sliderPosition, borderRadius, valueSize, valueWeight);
            if (this._activeView === 'history') {
              setTimeout(() => this._loadHistory(), 100);
            } else {
              this._setupLockHandlers(portal, entity);
            }
          }
        });
      }

      const openDoorBtn = portal.querySelector('#openDoorBtn');
      if (openDoorBtn && canOpenDoor) {
        openDoorBtn.addEventListener('click', () => {
          this.hass.callService('lock', 'open', { entity_id: this._config.entity });
        });
      }

      this._setupLockHandlers(portal, entity);
    }

    _renderLockPopupContent(entity, color, icon, stateText, sliderPosition, borderRadius, valueSize, valueWeight) {
      if (this._activeView === 'history') {
        return `<div class="timeline-container" data-view-type="history" id="historyContainer"><div class="history-loading">Loading Timeline...</div></div>`;
      }

      return `
        <div class="lock-slider-container">
          <div class="value-display">${stateText}</div>
          <div class="vertical-slider-track" id="lockSlider">
            <div class="vertical-slider-fill"></div>
            <div class="vertical-slider-thumb"></div>
          </div>
          <div class="slider-label">Lock</div>
        </div>
      `;
    }

    _setupLockHandlers(portal, entity) {
      if (this._activeView === 'history') return;

      const slider = portal.querySelector('#lockSlider');
      if (!slider) return;
      
      const fill = slider.querySelector('.vertical-slider-fill');
      const thumb = slider.querySelector('.vertical-slider-thumb');
      const display = portal.querySelector('.value-display');
      
      slider.addEventListener('click', (e) => {
        const rect = slider.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const clickPercent = (rect.height - clickY) / rect.height;
        
        // Optimistically update UI immediately
        if (clickPercent > 0.5) {
          // Locking
          if (fill) {
            fill.style.height = '100%';
            fill.style.background = '#4CAF50';
          }
          if (thumb) thumb.style.bottom = 'calc(100% - 60px)';
          if (display) display.textContent = 'Locking';
          
          this.hass.callService('lock', 'lock', { entity_id: this._config.entity });
        } else {
          // Unlocking
          if (fill) {
            fill.style.height = '0%';
            fill.style.background = '#FFC107';
          }
          if (thumb) thumb.style.bottom = '4px';
          if (display) display.textContent = 'Unlocking';
          
          this.hass.callService('lock', 'unlock', { entity_id: this._config.entity });
        }
      });
    }

    _renderIndividualView() {
      const entity = this._getEntity();
      if (!entity || !entity.attributes.entity_id || !Array.isArray(entity.attributes.entity_id)) {
        return '<div style="padding: 20px; text-align: center; opacity: 0.6;">No individual lights found</div>';
      }

      let html = '<div class="individual-container" data-view-type="individual">';

      const defaultSection = this._config.popup_default_section; // 'brightness', 'color', 'temperature', 'last', or undefined
      
      const pickDefaultMode = (child) => {
        const scm = child?.attributes?.supported_color_modes || [];
        const hasTemp = scm.includes('color_temp');
        const hasColor = scm.some(m => ['hs','rgb','xy','rgbw','rgbww'].includes(m));
        
        // If default_section is configured and not 'last', use that setting
        if (defaultSection && defaultSection !== 'last') {
          if (defaultSection === 'temperature' && hasTemp) return 'temp';
          if (defaultSection === 'color' && hasColor) return 'color';
          return 'brightness';
        }
        
        // Otherwise use the smart default (temp > color > brightness)
        return hasTemp ? 'temp' : (hasColor ? 'color' : 'brightness');
      };

      entity.attributes.entity_id.forEach(entityId => {
        const childEntity = this.hass.states[entityId];
        if (!childEntity) return;

        const name = childEntity.attributes.friendly_name || entityId;
        const isOn = childEntity.state === 'on';
        const brightnessPct = childEntity.attributes.brightness ? Math.round((childEntity.attributes.brightness / 255) * 100) : 0;

        const scm = childEntity.attributes.supported_color_modes || [];
        const supportsTemp = scm.includes('color_temp');
        const supportsColor = scm.some(m => ['hs','rgb','xy','rgbw','rgbww'].includes(m));
        const supportsBrightness = scm.some(m => ['brightness', 'color_temp', 'hs', 'rgb', 'xy', 'rgbw', 'rgbww'].includes(m));
        
        // If light doesn't support brightness/color/temp, show as switch
        if (!supportsBrightness && !supportsTemp && !supportsColor) {
          html += `
            <div class="individual-item switch-style">
              <button class="individual-icon" data-entity="${entityId}" data-action="toggle" title="Toggle">
                <ha-icon icon="${isOn ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off'}"></ha-icon>
              </button>
              <div class="individual-info">
                <div class="individual-name">${name}</div>
                <div class="individual-state">${isOn ? 'On' : 'Off'}</div>
              </div>
              <div class="individual-switch-container" data-entity="${entityId}">
                <div class="individual-switch ${isOn ? 'on' : 'off'}">
                  <div class="individual-switch-thumb"></div>
                </div>
              </div>
            </div>
          `;
          return;
        }

        if (!this._groupMemberModes) this._groupMemberModes = {};
        
        // If default_section is configured (not 'last'), always use that on first view
        // Otherwise, remember the last mode used for this light
        if (defaultSection && defaultSection !== 'last') {
          this._groupMemberModes[entityId] = pickDefaultMode(childEntity);
        } else if (!this._groupMemberModes[entityId]) {
          this._groupMemberModes[entityId] = pickDefaultMode(childEntity);
        }

        // Cycle order: brightness -> temp -> color -> brightness, skipping unsupported
        const mode = this._groupMemberModes[entityId];
        const nextMode = (() => {
          const order = ['brightness','temp','color'];
          let i = order.indexOf(mode);
          for (let step=0; step<3; step++) {
            i = (i+1) % order.length;
            const m = order[i];
            if (m==='temp' && !supportsTemp) continue;
            if (m==='color' && !supportsColor) continue;
            return m;
          }
          return 'brightness';
        })();

        const icon = mode === 'temp' ? 'mdi:thermometer' : (mode === 'color' ? 'mdi:palette' : 'mdi:lightbulb');

        // Slider value based on mode
        let pct = brightnessPct;
        let sliderKind = 'brightness';
        let gradient = '';
        if (mode === 'temp') {
          sliderKind = 'temp';
          const minM = childEntity.attributes.min_mireds || 153;
          const maxM = childEntity.attributes.max_mireds || 500;
          const ct = typeof childEntity.attributes.color_temp === 'number' ? childEntity.attributes.color_temp : minM;
          pct = Math.round(((ct - minM) / (maxM - minM)) * 100);
          gradient = 'background: linear-gradient(to right, #8ec5ff, #e8f0ff, #fff2c6, #ffd1a1);';
        } else if (mode === 'color') {
          sliderKind = 'color';
          const h = Array.isArray(childEntity.attributes.hs_color) ? childEntity.attributes.hs_color[0] : 0;
          pct = Math.round((h / 360) * 100);
          gradient = 'background: linear-gradient(to right, rgb(255,0,0), rgb(255,255,0), rgb(0,255,0), rgb(0,255,255), rgb(0,0,255), rgb(255,0,255), rgb(255,0,0));';
        }

        const memberColor = this._getCurrentColorFromState(childEntity);
        // For brightness mode, use the member's actual color if available, otherwise fall back to the classic gold.
        const brightnessFill = memberColor ? `${memberColor}` : 'rgba(255, 215, 0, 0.55)';

        html += `
          <div class="individual-item">
            <button class="individual-icon individual-mode-btn" data-entity="${entityId}" data-next="${nextMode}" title="Change mode">
              <ha-icon icon="${icon}"></ha-icon>
            </button>
            <div class="individual-info">
              <div class="individual-name">${name}</div>
              <div class="individual-state">${isOn ? brightnessPct + '%' : 'Off'}</div>
            </div>
            <div class="individual-slider" data-entity="${entityId}" data-mode="${sliderKind}" style="${gradient}">
              <div class="individual-slider-fill" style="width: ${pct}%; ${sliderKind==='brightness' ? `background: ${brightnessFill};` : ''}"></div>
              <div class="individual-slider-thumb" style="left: ${pct}%;"></div>
            </div>
          </div>
        `;
      });

      html += '</div>';

      // Save group favorite button (same placement as other save buttons)
      if (this._config.popup_show_favorites !== false) {
        html += `
          <button class="save-favorite-fab" id="saveGroupFavoriteBtn" title="Save group favorite">
            <ha-icon icon="mdi:star-plus"></ha-icon>
          </button>
        `;
      }

      return html;
    }


    _renderEffectsView(effectList, currentEffect) {
      let html = '<div class="effects-list-container" data-view-type="effects">';
      
      if (!effectList || effectList.length === 0) {
        html += '<div style="padding: 40px 20px; text-align: center; opacity: 0.6; font-size: 14px;">No effects available for this device</div>';
      } else {
        html += '<div class="effects-list expanded">';
        html += `<div class="effect-item ${currentEffect === 'None' || !currentEffect ? 'active' : ''}" data-effect="None">No Effect</div>`;
        effectList.forEach(effect => {
          html += `<div class="effect-item ${effect === currentEffect ? 'active' : ''}" data-effect="${effect}">${effect}</div>`;
        });
        html += '</div>';
      }
      
      html += '</div>';
      return html;
    }

    _setInitialColorIndicator() {
      const colorWheel = this._popupPortal ? this._popupPortal.querySelector('#colorWheel') : null;
      const indicator = this._popupPortal ? this._popupPortal.querySelector('#colorIndicator') : null;
      
      if (colorWheel && indicator) {
        const rect = colorWheel.getBoundingClientRect();
        
        if (rect.width === 0 || rect.height === 0) {
          setTimeout(() => this._setInitialColorIndicator(), 50);
          return;
        }
        
        const r = rect.width / 2;
        const hue = this._hue || 0;
        const saturation = Math.min(100, Math.max(0, this._saturation || 0));
        
        const theta = (hue - 90) * (Math.PI / 180);
        const dist = (saturation / 100) * r;
        
        const x = r + (dist * Math.cos(theta));
        const y = r + (dist * Math.sin(theta));
        
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        indicator.style.background = 'hsl(' + hue + ', ' + saturation + '%, 50%)';
      }
    }

    _setupPopupHandlers(portal) {
      if (this._getDomain() === 'climate') {
          this._setupClimateHandlers(portal);
          return; // Skip light handlers
      }
      const closeBtn = portal.querySelector('#closeBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this._closePopup());

      const individualLightsBtn = portal.querySelector('#individualLightsBtn');
      if (individualLightsBtn) {
        individualLightsBtn.addEventListener('click', () => {
          portal.querySelectorAll('.hki-light-popup-tab').forEach(t => t.classList.remove('active'));
          
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            const currentView = content.querySelector('[data-view-type]')?.dataset.viewType;
            if (currentView === 'individual') {
              this._renderPopupPortal();
            } else {
              content.innerHTML = this._renderIndividualView();
              this._setupContentHandlers(portal);
            }
          }
        });
      }

      const historyBtn = portal.querySelector('#historyBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          portal.querySelectorAll('.hki-light-popup-tab').forEach(t => t.classList.remove('active'));
          
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            const currentView = content.querySelector('[data-view-type]')?.dataset.viewType;
            if (currentView === 'history') {
              this._renderPopupPortal();
            } else {
              content.innerHTML = `<div class="timeline-container" data-view-type="history" id="historyContainer">
                <div class="history-loading">Loading Timeline...</div>
              </div>`;
              setTimeout(() => this._loadHistory(), 100);
            }
          }
        });
      }

      const scenesBtn = portal.querySelector('#scenesBtn');
      if (scenesBtn) {
        scenesBtn.addEventListener('click', () => {
          portal.querySelectorAll('.hki-light-popup-tab').forEach(t => t.classList.remove('active'));
          scenesBtn.classList.add('active');
          this._activeView = 'favorites';
          
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.classList.add('view-favorites');
            content.innerHTML = this._renderFavoritesView();
            this._setupContentHandlers(portal);
          }
        });
      }

      const effectsBtn = portal.querySelector('#effectsBtn');
      if (effectsBtn) {
        effectsBtn.addEventListener('click', () => {
          portal.querySelectorAll('.hki-light-popup-tab').forEach(t => t.classList.remove('active'));
          effectsBtn.classList.add('active');
          this._activeView = 'effects';
          
          const entity = this._getEntity();
          const effectList = entity && entity.attributes.effect_list ? entity.attributes.effect_list : [];
          const currentEffect = entity && entity.attributes.effect ? entity.attributes.effect : 'None';
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.innerHTML = this._renderEffectsView(effectList, currentEffect);
            this._setupContentHandlers(portal);
          }
        });
      }

      // Bottom navigation
      const powerBtn = portal.querySelector('#powerBtn');
      if (powerBtn) {
        powerBtn.addEventListener('click', () => {
          this.hass.callService('light', 'toggle', { entity_id: this._config.entity });
        });
      }

      const brightnessBtn = portal.querySelector('#brightnessBtn');
      if (brightnessBtn) {
        brightnessBtn.addEventListener('click', () => {
          portal.querySelectorAll('.nav-btn').forEach(t => t.classList.remove('active'));
          this._activeView = 'brightness';
          this._renderPopupPortal();
        });
      }

      const temperatureBtn = portal.querySelector('#temperatureBtn');
      if (temperatureBtn) {
        temperatureBtn.addEventListener('click', () => {
          portal.querySelectorAll('.nav-btn').forEach(t => t.classList.remove('active'));
          this._activeView = 'temperature';
          this._syncState();
          this._renderPopupPortal();
        });
      }

      const colorBtn = portal.querySelector('#colorBtn');
      if (colorBtn) {
        colorBtn.addEventListener('click', () => {
          portal.querySelectorAll('.nav-btn').forEach(t => t.classList.remove('active'));
          this._activeView = 'color';
          this._syncState();
          this._renderPopupPortal();
        });
      }
    }

    _setupClimateHandlers(portal) {
        // 1. Sliders
        portal.querySelectorAll('.vertical-slider-track').forEach(track => {
            const type = track.dataset.type; // 'single', 'low', 'high'
            const update = (e) => {
                 const rect = track.getBoundingClientRect();
                 const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
                 let val = this._tempMin + (y * (this._tempMax - this._tempMin));
                 val = Math.round(val / this._step) * this._step;
                 val = Math.round(val * 10) / 10;
                 
                 // UI Update logic (height %, text content) goes here
                 // Same as the climate code provided previously
                 
                 return val;
            };
            // Add mousedown/touchstart listeners similar to light slider...
        });
    
        // 2. Nav Buttons
        const entity = this._getEntity();
        (entity.attributes.hvac_modes || []).forEach(m => {
            const btn = portal.querySelector(`#mode-${m}`);
            if(btn) btn.addEventListener('click', () => {
                 // Optimistic UI: highlight immediately
                 this._optimisticHvacMode = m;
                 portal.querySelectorAll('button[id^="mode-"]').forEach(b => {
                   b.classList.remove('active');
                   b.style.color = '';
                 });
                 btn.classList.add('active');
                 if (HVAC_COLORS && HVAC_COLORS[m]) btn.style.color = HVAC_COLORS[m];

                 this.hass.callService('climate', 'set_hvac_mode', {
                     entity_id: this._config.entity, hvac_mode: m
                 });
                 // Re-render shortly to keep UI consistent with other elements
                 setTimeout(() => this._renderPopupPortal(), 200);
            });
        });
    }

    _setupContentHandlers(portal) {
      // Brightness slider
      const brightnessTrack = portal.querySelector('#brightnessTrack');
      if (brightnessTrack) {
        const self = this;
        const updateBrightness = (e) => {
          self._isDragging = true;
          const rect = brightnessTrack.getBoundingClientRect();
          const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
          const brightness = Math.round(y * 100);
          self._brightness = brightness;
          
          const fill = brightnessTrack.querySelector('.vertical-slider-fill');
          const thumb = brightnessTrack.querySelector('.vertical-slider-thumb');
          const valueDisplay = portal.querySelector('.value-display');
          
          if (fill) {
            fill.style.height = brightness + '%';
            if (self._config.dynamic_bar_color) {
              fill.style.background = self._getCurrentColor();
            }
          }
          // Clamp thumb position so it stays visible at 0% and 100%
          const thumbPos = brightness <= 0 ? '0px' : brightness >= 100 ? 'calc(100% - 6px)' : 'calc(' + brightness + '% - 6px)';
          if (thumb) thumb.style.bottom = thumbPos;
          if (valueDisplay) valueDisplay.innerHTML = brightness + '<span>%</span>';
        };

        const finishBrightness = () => {
          document.removeEventListener('mousemove', updateBrightness);
          document.removeEventListener('mouseup', finishBrightness);
          document.removeEventListener('touchmove', handleTouch);
          document.removeEventListener('touchend', finishBrightness);
          
          self._isDragging = false;
          if (self._brightness > 0) {
            self.hass.callService('light', 'turn_on', { entity_id: self._config.entity, brightness_pct: self._brightness });
          } else {
            self.hass.callService('light', 'turn_off', { entity_id: self._config.entity });
          }
        };

        const handleTouch = (e) => { e.preventDefault(); updateBrightness(e.touches[0]); };

        brightnessTrack.addEventListener('mousedown', (e) => {
          updateBrightness(e);
          document.addEventListener('mousemove', updateBrightness);
          document.addEventListener('mouseup', finishBrightness);
        });
        brightnessTrack.addEventListener('touchstart', (e) => {
          handleTouch(e);
          document.addEventListener('touchmove', handleTouch, { passive: false });
          document.addEventListener('touchend', finishBrightness);
        });
      }

      // Temperature slider
      const tempTrackVertical = portal.querySelector('#tempTrackVertical');
      if (tempTrackVertical) {
        const self = this;
        const updateTemp = (e) => {
          self._isDragging = true;
          const rect = tempTrackVertical.getBoundingClientRect();
          const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
          const range = self._tempMax - self._tempMin;
          const mireds = Math.round(self._tempMax - (y * range));
          self._currentTemp = mireds;
          const kelvin = Math.round(1000000 / mireds);
          
          const fill = tempTrackVertical.querySelector('.vertical-slider-fill');
          const thumb = tempTrackVertical.querySelector('.vertical-slider-thumb');
          const valueDisplay = portal.querySelector('.value-display');
          
          const tempPct = 100 - (((mireds - self._tempMin) / range) * 100);
          if (fill) fill.style.height = tempPct + '%';
          // Clamp thumb position so it stays visible at 0% and 100%
          const thumbPos = tempPct <= 0 ? '0px' : tempPct >= 100 ? 'calc(100% - 6px)' : 'calc(' + tempPct + '% - 6px)';
          if (thumb) thumb.style.bottom = thumbPos;
          if (valueDisplay) valueDisplay.textContent = self._getTempName(kelvin);
        };

        const finishTemp = () => {
          document.removeEventListener('mousemove', updateTemp);
          document.removeEventListener('mouseup', finishTemp);
          document.removeEventListener('touchmove', handleTouchTemp);
          document.removeEventListener('touchend', finishTemp);
          
          self._isDragging = false;
          self.hass.callService('light', 'turn_on', { entity_id: self._config.entity, color_temp: self._currentTemp });
        };

        const handleTouchTemp = (e) => { e.preventDefault(); updateTemp(e.touches[0]); };

        tempTrackVertical.addEventListener('mousedown', (e) => {
          updateTemp(e);
          document.addEventListener('mousemove', updateTemp);
          document.addEventListener('mouseup', finishTemp);
        });
        tempTrackVertical.addEventListener('touchstart', (e) => {
          handleTouchTemp(e);
          document.addEventListener('touchmove', handleTouchTemp, { passive: false });
          document.addEventListener('touchend', finishTemp);
        });
      }

      // Color wheel
      const colorWheel = portal.querySelector('#colorWheel');
      if (colorWheel) {
        const self = this;
        const updateColor = (e) => {
          self._isDragging = true;
          const rect = colorWheel.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
          const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
          
          const x = clientX - rect.left - centerX;
          const y = clientY - rect.top - centerY;
          
          let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
          if (angle < 0) angle += 360;
          const distance = Math.min(1, Math.sqrt(x * x + y * y) / (rect.width / 2));
          
          self._hue = angle;
          self._saturation = distance * 100;
          
          const indicator = portal.querySelector('#colorIndicator');
          const colorNameEl = portal.querySelector('.value-display');
          if (indicator) {
            const r = distance * (rect.width / 2);
            const theta = (angle - 90) * Math.PI / 180;
            const indicatorX = centerX + r * Math.cos(theta);
            const indicatorY = centerY + r * Math.sin(theta);
            
            indicator.style.left = indicatorX + 'px';
            indicator.style.top = indicatorY + 'px';
            indicator.style.background = 'hsl(' + self._hue + ', ' + self._saturation + '%, 50%)';
            indicator.style.transition = 'none';
          }
          if (colorNameEl) {
            colorNameEl.textContent = self._getColorName(self._hue, self._saturation);
          }
        };

        const finishColor = () => {
          document.removeEventListener('mousemove', updateColor);
          document.removeEventListener('mouseup', finishColor);
          document.removeEventListener('touchmove', handleTouchColor);
          document.removeEventListener('touchend', finishColor);
          self._isDragging = false;
          self.hass.callService('light', 'turn_on', { entity_id: self._config.entity, hs_color: [self._hue, self._saturation] });
          const indicator = portal.querySelector('#colorIndicator');
          if (indicator) indicator.style.transition = 'top 0.3s, left 0.3s';
        };
        
        const handleTouchColor = (e) => { e.preventDefault(); updateColor(e); };

        colorWheel.addEventListener('mousedown', (e) => {
          updateColor(e);
          document.addEventListener('mousemove', updateColor);
          document.addEventListener('mouseup', finishColor);
        });
        
        colorWheel.addEventListener('touchstart', (e) => {
          handleTouchColor(e);
          document.addEventListener('touchmove', handleTouchColor, { passive: false });
          document.addEventListener('touchend', finishColor);
        });
      }

      // Preset buttons
      const presetBtns = portal.querySelectorAll('.preset-btn');
      const self = this;
      presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); 
          if (self._favoritesEditMode) return;
          const idx = parseInt(btn.dataset.favIndex);
          if (Number.isNaN(idx)) return;
          self._ensureLightFavorites();
          const fav = Array.isArray(self._lightFavorites) ? self._lightFavorites[idx] : null;
          if (!fav) return;
          self._applyFavorite(fav);
        });
      });

      // Favorites edit toggle
      const favEditBtn = portal.querySelector('#favoritesEditBtn');
      if (favEditBtn) {
        favEditBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._favoritesEditMode = !this._favoritesEditMode;
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.classList.add('view-favorites');
            content.innerHTML = this._renderFavoritesView();
            this._setupContentHandlers(portal);
          }
        });
      }

      // Favorites delete badges
      const delBadges = portal.querySelectorAll('.fav-delete-badge');
      delBadges.forEach(b => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(b.dataset.favDel);
          if (Number.isNaN(idx)) return;
          this._ensureLightFavorites();
          if (Array.isArray(this._lightFavorites)) {
            this._lightFavorites.splice(idx, 1);
            this._saveLightFavorites();
          }
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.classList.add('view-favorites');
            content.innerHTML = this._renderFavoritesView();
            this._setupContentHandlers(portal);
          }
        });
      });

      // Save favorite button (color wheel / color temp)
      const saveFavBtn = portal.querySelector('#saveFavoriteBtn');
      if (saveFavBtn) {
        saveFavBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this._addCurrentLightToFavorites();
          
          // Switch to favorites tab and show the updated list
          this._activeView = 'favorites';
          const content = portal.querySelector('.hki-light-popup-content');
          const scenesBtn = portal.querySelector('#scenesBtn');
          
          if (content) {
            content.classList.add('view-favorites');
            content.innerHTML = this._renderFavoritesView();
            this._setupContentHandlers(portal);
          }
          
          // Update tab active states
          if (scenesBtn) {
            portal.querySelectorAll('.hki-light-popup-tab').forEach(t => t.classList.remove('active'));
            scenesBtn.classList.add('active');
          }
        });
      }

      // Group member mode buttons
      const modeBtns = portal.querySelectorAll('.individual-mode-btn');
      modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const eid = btn.dataset.entity;
          const next = btn.dataset.next || 'brightness';
          if (!this._groupMemberModes) this._groupMemberModes = {};
          this._groupMemberModes[eid] = next;
          // Re-render only the individual view
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.innerHTML = this._renderIndividualView();
            this._setupContentHandlers(portal);
          }
        });
      });

      // Save group favorite button
      const saveGroupBtn = portal.querySelector('#saveGroupFavoriteBtn');
      if (saveGroupBtn) {
        saveGroupBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this._addGroupSnapshotToFavorites({ alwaysPromptMeta: true });
          const content = portal.querySelector('.hki-light-popup-content');
          if (content) {
            content.classList.add('view-favorites');
            content.innerHTML = this._renderFavoritesView();
            this._setupContentHandlers(portal);
          }
        });
      }

      // Individual sliders
      const individualSliders = portal.querySelectorAll('.individual-slider');
      individualSliders.forEach(slider => {
        const entityId = slider.dataset.entity;
        const mode = slider.dataset.mode || 'brightness';

        const calcPct = (clientX) => {
          const rect = slider.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          return Math.round(x * 100);
        };

        const applyVisual = (pct) => {
          const fill = slider.querySelector('.individual-slider-fill');
          const thumb = slider.querySelector('.individual-slider-thumb');
          if (fill) fill.style.width = pct + '%';
          if (thumb) thumb.style.left = pct + '%';
        };

        const finish = async (clientX) => {
          const pct = calcPct(clientX);
          applyVisual(pct);

          const st = this.hass.states[entityId];
          if (!st) return;
          const a = st.attributes || {};

          if (mode === 'temp') {
            const minM = a.min_mireds || 153;
            const maxM = a.max_mireds || 500;
            const ct = Math.round(minM + ((maxM - minM) * (pct / 100)));
            await this.hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: ct });
          } else if (mode === 'color') {
            const hue = Math.round((pct / 100) * 360);
            await this.hass.callService('light', 'turn_on', { entity_id: entityId, hs_color: [hue, 100] });
          } else {
            if (pct > 0) {
              await this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: pct });
            } else {
              await this.hass.callService('light', 'turn_off', { entity_id: entityId });
            }
          }
        };

        let isDragging = false;
        const onMove = (e) => {
          if (!isDragging) return;
          const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
          const pct = calcPct(clientX);
          applyVisual(pct);
        };
        const onUp = async (e) => {
          if (!isDragging) return;
          isDragging = false;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('touchend', onUp);
          const clientX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : e.clientX;
          await finish(clientX);
        };

        const onDown = (e) => {
          isDragging = true;
          const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
          const pct = calcPct(clientX);
          applyVisual(pct);
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
          document.addEventListener('touchmove', onMove, { passive: true });
          document.addEventListener('touchend', onUp);
        };

        slider.addEventListener('mousedown', onDown);
        slider.addEventListener('touchstart', onDown, { passive: true });
      });

      // Individual switch containers (for on/off only lights)
      const individualSwitches = portal.querySelectorAll('.individual-switch-container');
      individualSwitches.forEach(switchContainer => {
        const entityId = switchContainer.dataset.entity;
        switchContainer.addEventListener('click', async () => {
          await this.hass.callService('light', 'toggle', { entity_id: entityId });
        });
      });
      
      // Individual icon buttons (both for mode switching and toggle)
      const individualIcons = portal.querySelectorAll('.individual-icon');
      individualIcons.forEach(icon => {
        const entityId = icon.dataset.entity;
        const action = icon.dataset.action;
        
        if (action === 'toggle') {
          // For switch-style items, icon toggles the light
          icon.addEventListener('click', async () => {
            await this.hass.callService('light', 'toggle', { entity_id: entityId });
          });
        } else {
          // For slider items, icon cycles the mode
          icon.addEventListener('click', () => {
            const nextMode = icon.dataset.next;
            if (this._groupMemberModes) {
              this._groupMemberModes[entityId] = nextMode;
            }
            this._renderPopupPortal();
          });
        }
      });

      // Effects toggle and items
      const effectsTrigger = portal.querySelector('#effectsTrigger');
      if (effectsTrigger) {
        effectsTrigger.addEventListener('click', () => {
          this._expandedEffects = !this._expandedEffects;
          const effectsList = portal.querySelector('.effects-list');
          const arrow = portal.querySelector('.effects-trigger-arrow');
          if (effectsList) {
            effectsList.classList.toggle('expanded');
          }
          if (arrow) {
            arrow.classList.toggle('expanded');
          }
        });
      }

      const effectItems = portal.querySelectorAll('.effect-item');
      effectItems.forEach(item => {
        item.addEventListener('click', () => {
          const effect = item.dataset.effect;
          if (effect === 'None') {
            self.hass.callService('light', 'turn_on', { entity_id: self._config.entity, effect: 'none' });
          } else {
            self.hass.callService('light', 'turn_on', { entity_id: self._config.entity, effect: effect });
          }
        });
      });
    }

    async _loadHistory() {
      const container = this._popupPortal.querySelector('#historyContainer');
      if (!container) return;

      const entityId = this._config.entity;
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
      
      try {
        // Fetch main entity logbook
        const logbook = await this.hass.callApi('GET', `logbook/${startTime.toISOString()}?entity=${entityId}&end_time=${endTime.toISOString()}`);
        
        // For locks, also fetch contact sensor history if configured
        let contactLogbook = [];
        const domain = this._getDomain();
        if (domain === 'lock' && this._config.lock_contact_sensor_entity) {
          try {
            contactLogbook = await this.hass.callApi('GET', `logbook/${startTime.toISOString()}?entity=${this._config.lock_contact_sensor_entity}&end_time=${endTime.toISOString()}`);
          } catch (e) {
            console.warn('Could not fetch contact sensor history', e);
          }
        }
        
        if ((!logbook || logbook.length === 0) && (!contactLogbook || contactLogbook.length === 0)) {
          container.innerHTML = '<div class="history-loading">No history available</div>';
          return;
        }

        const stateChanges = logbook
          .filter(entry => {
            // alarm_control_panel entries (Alarmo) often have message instead of state
            if (domain === 'alarm_control_panel') {
              const hasState = !!entry.state && entry.state !== 'unknown';
              const hasMsg = !!entry.message && String(entry.message).trim() !== '';
              return hasState || hasMsg
            }
            if (!entry.state) return false;
            if (domain === 'climate') return entry.state !== 'unknown';
            if (domain === 'cover') return entry.state !== 'unknown';
            if (domain === 'lock') return entry.state !== 'unknown';
            if (domain === 'humidifier') return entry.state !== 'unknown';
            if (domain === 'fan') return entry.state !== 'unknown';
            return (entry.state === 'on' || entry.state === 'off' || entry.state === 'unavailable');
          });
        
        // Add contact sensor state changes with a special flag
        const contactSensorLabel = this._config.lock_contact_sensor_label || "Door";
        contactLogbook
          .filter(entry => {
            const state = String(entry.state || '').toLowerCase();
            return state === 'on' || state === 'off' || state === 'open' || state === 'closed';
          })
          .forEach(entry => {
            stateChanges.push({
              ...entry,
              isContactSensor: true,
              contactLabel: contactSensorLabel
            });
          });
        
        // Sort all events by time, most recent first
        const sortedChanges = stateChanges
          .sort((a, b) => new Date(b.when) - new Date(a.when))
          .slice(0, 15);
        
        let htmlContent = '';
        
        sortedChanges.forEach((entry, index) => {
          const date = new Date(entry.when);
          const timeStr = this._formatHistoryTime(date);
          const ago = this._getTimeAgo(date);
          
          let stateText = 'Changed';
          
          // Handle contact sensor events
          if (entry.isContactSensor) {
            const state = String(entry.state || '').toLowerCase();
            if (state === 'on' || state === 'open') {
              stateText = `${entry.contactLabel} Opened`;
            } else if (state === 'off' || state === 'closed') {
              stateText = `${entry.contactLabel} Closed`;
            }
          } else if (domain === 'alarm_control_panel') {
            // Alarmo often logs message; prefer that, else state
            const raw = entry.message ?? entry.state ?? 'changed';
            const norm = String(raw)
              .replace(/_/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            stateText = this._titleCase(norm);
          } else if (entry.state === 'on') {
            stateText = this.hass.localize('ui.card.button.turn_on') || 'Turned On';
          } else if (entry.state === 'off') {
            stateText = this.hass.localize('ui.card.button.turn_off') || 'Turned Off';
          } else if (entry.state === 'unavailable') {
            stateText = this._getLocalizedState('unavailable', domain);
          } else if (entry.state) {
            stateText = this._getLocalizedState(entry.state, domain);
          }

          
          // --- FIX: USER RESOLUTION VIA PERSON ENTITIES ---
          let trigger = 'System';
          
          if (entry.context_user_id) {
             // 1. Try to find a "person" entity that matches this user_id
             const person = Object.values(this.hass.states).find(state => 
                state.entity_id.startsWith('person.') && 
                state.attributes.user_id === entry.context_user_id
             );
             
             if (person && person.attributes.friendly_name) {
                trigger = person.attributes.friendly_name;
             } 
             // 2. Fallback: Check if it matches the currently logged-in user
             else if (this.hass.user && this.hass.user.id === entry.context_user_id) {
                trigger = this.hass.user.name;
             } 
             else {
                trigger = 'User'; // ID exists but couldn't resolve name
             }
          } else {
             // If no user ID, check if the entry name differs from the entity name
             // (This often catches automations or scenes depending on how they log)
             const entityName = this.hass.states[entityId]?.attributes?.friendly_name;
             if (entry.name && entry.name !== entityName && entry.name !== entityId) {
                trigger = entry.name;
             }
          }
          // ------------------------------------------------
          
          // Determine dot color
          let dotColor = '#2196F3';
          
          if (entry.isContactSensor) {
            // Contact sensor: red for open, yellow/amber for closed
            const state = String(entry.state || '').toLowerCase();
            dotColor = (state === 'on' || state === 'open') ? '#F44336' : '#FFC107';
          } else if (domain === 'alarm_control_panel') {
            const raw = (entry.state ? String(entry.state) : (entry.message ? String(entry.message) : '')).toLowerCase();
            if (raw.includes('disarm')) dotColor = '#4CAF50';
            else if (raw.includes('trigger')) dotColor = '#E53935';
            else if (raw.includes('armed') || raw.includes('arm')) dotColor = '#FF9800';
            else dotColor = '#2196F3';
          } else if (domain === 'lock') {
            const state = entry.state ? String(entry.state).toLowerCase() : '';
            if (state === 'locked') dotColor = '#4CAF50';
            else if (state === 'unlocked') dotColor = '#FFC107';
            else if (state === 'jammed') dotColor = '#F44336';
            else dotColor = '#2196F3';
          } else if (domain === 'climate') {
            dotColor = (HVAC_COLORS && HVAC_COLORS[entry.state]) || (entry.state === 'off' ? '#444' : '#FFD700');
          } else if (domain === 'cover') {
            dotColor = entry.state === 'closed' ? '#444' : '#2196F3';
          } else {
            dotColor = entry.state === 'on' ? '#FFD700' : (entry.state === 'off' ? '#444' : '#E53935');
          }
          
          htmlContent += `
            <div class="timeline-item">
              <div class="timeline-visual">
                <div class="timeline-dot" style="background: ${dotColor}"></div>
                <div class="timeline-line"></div>
              </div>
              <div class="timeline-content">
                <strong>${stateText}</strong>
                <span class="timeline-ago">${ago}</span>
                <span class="timeline-trigger">${trigger}</span>
              </div>
            </div>
          `;
        });
        container.innerHTML = htmlContent;
      } catch (err) {
        console.error("Error fetching history", err);
        container.innerHTML = '<div class="history-loading">Error loading history</div>';
      }
    }

    _titleCase(str) {
      return String(str)
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    _getTimeAgo(date) {
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
      if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
      return 'Just now';
    }

    _formatLastTriggered(entity) {
      if (!entity || !entity.last_changed) {
        return '';
      }
      const lastChanged = new Date(entity.last_changed);
      if (isNaN(lastChanged.getTime())) {
        return '';
      }
      return this._getTimeAgo(lastChanged);
    }

    
    _getClimateBadgeTemperature(entity) {
      // Optional override entity for the small temperature bubble.
      const overrideId = this._config.climate_current_temperature_entity;
      if (overrideId && this.hass && this.hass.states && this.hass.states[overrideId]) {
        const st = this.hass.states[overrideId].state;
        const num = Number(st);
        if (!Number.isNaN(num)) return num;
        // If it's not numeric (e.g. 'unknown'), fall through to default.
      }
      const v = entity?.attributes?.current_temperature;
      return (v === undefined || v === null) ? null : v;
    }


    _getTempUnit(entity) {
      const unit = entity?.attributes?.temperature_unit
        || this.hass?.config?.unit_system?.temperature
        || '°C';
      // HA typically returns "°C"/"°F" already; if not, normalize.
      if (unit === 'C' || unit === 'c') return '°C';
      if (unit === 'F' || unit === 'f') return '°F';
      return unit;
    }

    _renderClimateCornerBadge(entity, isOn, iconColor, badgeBorder, badgeBg, getTransform) {
      if (this._getDomain() !== 'climate') return '';
      if (this._config.show_temp_badge === false) return '';
      const tempVal = this._getClimateBadgeTemperature(entity);
      if (tempVal === null || tempVal === undefined || tempVal === '' || Number.isNaN(Number(tempVal))) return '';

      const unit = '°';

      // Temperature badge specific config (falls back to icon badge config)
      const size = this._config.temp_badge_size ?? this._config.badge_size ?? 40;
      const fontSize = this._config.size_temp_badge ?? this._config.size_badge;

      const textColor = this._config.temp_badge_text_color ?? 'white';

      const border = (() => {
        const w = this._config.temp_badge_border_width ?? this._config.badge_border_width;
        const st = this._config.temp_badge_border_style ?? this._config.badge_border_style ?? 'none';
        const c = this._config.temp_badge_border_color ?? this._config.badge_border_color ?? 'transparent';
        const _toUnit = (v) => (v === undefined || v === null || v === '') ? '0px' : (String(v).match(/[a-z%]+$/) ? String(v) : `${v}px`);
        return `${_toUnit(w)} ${st} ${c}`;
      })();

      const borderRadius = (() => {
        const r = this._config.temp_badge_border_radius ?? this._config.badge_border_radius;
        if (r === undefined || r === null || r === '') return '999px';
        return (String(r).match(/[a-z%]+$/) ? String(r) : `${r}px`);
      })();

      const boxShadow = this._config.temp_badge_box_shadow ?? this._config.badge_box_shadow ?? '';

      const bubbleColor = isOn ? iconColor : '#888';

      const x = (this._config.temp_badge_offset_x ?? this._config.badge_offset_x) || 0;
      const y = (this._config.temp_badge_offset_y ?? this._config.badge_offset_y) || 0;

      const fontFamily = (this._config.temp_badge_font_family === 'custom')
        ? this._config.temp_badge_font_custom
        : (this._config.temp_badge_font_family || this._config.badge_font_family || 'system-ui');

      const fontWeight = this._config.temp_badge_font_weight || this._config.badge_font_weight || '500';

      return html`
        <div class="badge climate-corner-badge" style="
          width: var(--hki-temp-badge-size, ${size}px); height: var(--hki-temp-badge-size, ${size}px);
          background: ${bubbleColor};
          border: ${border};
          border-radius: ${borderRadius};
          box-shadow: ${boxShadow};
          color: ${textColor};
          font-size: ${fontSize !== undefined && fontSize !== null && fontSize !== '' ? `${fontSize}px` : 'calc(var(--hki-temp-badge-size, 40px) * 0.35)'};
          font-family: ${fontFamily};
          font-weight: ${fontWeight};
          transform: translate(${x}px, ${y}px);
        ">
          ${tempVal}${unit}
        </div>
      `;
    }

    
    _renderBadge(entity, isOn, iconColor, badgeBorder, badgeBg, badgeCount, getTransform) {
      // Icon badge can be disabled independently of other elements
      if (this._config.show_icon_badge === false) return '';

      // Light group count badge
      if (badgeCount > 0) {
        // Scale badge with icon size (while preserving existing badge size overrides)
// Use the same responsive icon sizing as the tile icon itself:
const stageMin = Math.min(this._stageW || 0, this._stageH || 0);
const maxIconSize = this._config.size_icon || 24;
const iconScale = (() => { const max = Number(maxIconSize) || 24; return Math.max(0.08, Math.min(0.35, 0.15 * (max / 24))); })();
const responsiveIcon = stageMin ? Math.round(stageMin * iconScale) : maxIconSize;
const iconSize = Math.max(16, Math.min(maxIconSize, responsiveIcon));

        // If badge_size isn't configured, derive a sensible diameter from icon size
        const badgeDiameter = (this._config.badge_size !== undefined && this._config.badge_size !== null && this._config.badge_size !== '')
          ? Number(this._config.badge_size)
          : Math.max(16, Math.round(iconSize * 0.6));

        // Font size: keep existing size_badge override, otherwise scale with badge diameter
        const badgeFontSize = (this._config.size_badge !== undefined && this._config.size_badge !== null && this._config.size_badge !== '')
          ? Number(this._config.size_badge)
          : Math.max(9, Math.round(badgeDiameter * 0.55));

        return html`
          <div class="badge" style="
            font-size: ${badgeFontSize}px;
            background: ${badgeBg};
            border: ${badgeBorder};
            transform: ${getTransform(this._config.badge_offset_x, this._config.badge_offset_y)};
            min-width: ${badgeDiameter}px;
            height: ${badgeDiameter}px;
            line-height: ${badgeDiameter}px;
          ">
            ${badgeCount}
          </div>
        `;
      }

      return '';
    }



/* --- TILE RENDER LOGIC --- */

    render() {
      const layoutRaw = this._config.card_layout || 'square';
      let layout = layoutRaw;

      // Supported layouts
      if (!['square','badge','hki_tile','google_default'].includes(layout)) layout = 'square';
      // Google Default renders like square, but has its own default config + editor baselines
      if (layout === 'google_default') layout = 'square';

      const entity = this._getEntity();
      const hasEntity = !!entity;
const isOn = hasEntity ? this._isOn() : false;
      const isUnavailable = hasEntity ? (String(entity.state || '').toLowerCase() === 'unavailable') : false;
      const isOnEffective = isUnavailable ? false : isOn;

      // Icon (template-capable). If empty, fall back to HA entity icon.
      const iconRendered = this.renderTemplate('icon', this._config.icon || '');
      const iconToUse = (iconRendered !== undefined && iconRendered !== null && String(iconRendered).trim() !== '')
        ? String(iconRendered).trim()
        : undefined;

      // -- Typography Helper --
      const getFont = (family, weight, size) => {
          let f = family || 'inherit';
          if (f === 'system') f = 'inherit';
          else if (f === 'custom') f = this._config[`${family}_custom`] || 'inherit';
          
          let w = weight || 'normal';
          return `font-family: ${f}; font-weight: ${w}; font-size: ${size || 12}px;`;
      };

      // -- Unit Helper (Fix for "border: 2 solid" bug) --
      const _toUnit = (v) => (!v ? '0px' : (isNaN(v) ? v : `${v}px`));

      // -- Layout & Shape --
      // (layout is defined at the start of render)
      
      // Apply layout-specific defaults (without writing to YAML)
      let gridRows = this._config.grid_rows;
      let gridCols = this._config.grid_columns;
      let elementGrid = this._config.element_grid;
      let borderRadius = this._config.border_radius;
      
            if (layout === 'hki_tile') {
        if (borderRadius === undefined) borderRadius = 12;
      }

if (layout === 'square') {
        // Fixed square layout (button-card grid-template-areas equivalent):
        // "i i"
        // "area area" (whitespace)
        // "n n"
        // "s s"
        // "l l" (info_display)
        // Layout settings are intentionally removed for now.
        gridRows = 5;
        gridCols = 2;
        if (borderRadius === undefined) borderRadius = 12;
        elementGrid = [
          'icon','icon',
          'empty','empty',
          'name','name',
          'state','state',
          'info','info'
        ];
      }

      // -- Colors --
      const haDefaultBg = 'var(--ha-card-background, var(--card-background-color))';
      
      // Light color (only meaningful for light domain; safe to call anyway)
      const currentLightColor = this._getCurrentColor?.() || null;

      // HKI Default on-state auto-theme: white card + black text when entity is active
      // Only applies to HKI Default layout (square / undefined), only when the user
      // has not explicitly set a value for the affected property.
      const isHkiDefault = !this._config.card_layout || this._config.card_layout === 'square' || this._config.card_layout === 'hki_tile' || this._config.card_layout === 'badge';
      const _hkiOnActive = isHkiDefault && isOnEffective;
      
      // Card color with template support
      let bgColor = (_hkiOnActive && !this._config.card_color) ? 'white' : haDefaultBg;
      if (this._config.card_color) {
        const rendered = this.renderTemplate('cardColor', this._config.card_color);
        if (rendered === 'auto' && this._getDomain() === 'light' && currentLightColor) {
          bgColor = currentLightColor;
        } else if (rendered) {
          bgColor = rendered;
        }
      }
      
      // Card opacity with template support
      // Defaults: 1.0 when on, 0.7 when off, 0.5 when unavailable
      let cardOpacity = isUnavailable ? 0.5 : (isOnEffective ? 1.0 : 0.7);
      if (this._config.card_opacity !== undefined) {
        const rendered = this.renderTemplate('cardOpacity', String(this._config.card_opacity));
        const parsed = parseFloat(rendered);
        if (!isNaN(parsed)) {
          cardOpacity = isUnavailable ? Math.min(parsed, 0.5) : parsed;
        }
      }
      
      // Box shadow with template support
      let boxShadow = '';
      if (this._config.box_shadow) {
        const rendered = this.renderTemplate('boxShadow', this._config.box_shadow);
        if (rendered === 'default') {
          boxShadow = ''; // unset -> theme default
        } else if (rendered === 'none') {
          boxShadow = 'none';
        } else if (rendered === 'auto') {
          boxShadow = (currentLightColor) ? `0 8px 24px ${currentLightColor}` : '';
        } else if (rendered) {
          boxShadow = rendered;
        }
      }

      // Individual Element Colors with template support
      const nameColor = this._config.name_color 
        ? this.renderTemplate('nameColor', this._config.name_color) 
        : (_hkiOnActive ? '#000000' : 'inherit');
      const stateColor = isUnavailable ? 'var(--error-color, red)' 
        : (this._config.state_color ? this.renderTemplate('stateColor', this._config.state_color) : (_hkiOnActive ? '#000000' : 'inherit'));
      const labelColor = this._config.label_color 
        ? this.renderTemplate('labelColor', this._config.label_color) 
        : (_hkiOnActive ? '#000000' : 'inherit');

      // Info display / brightness colors (template support; defaults follow theme)
      const brightnessColorBase = this._config.brightness_color
        ? this.renderTemplate('brightnessColor', this._config.brightness_color)
        : '';
      const _infoDspDefault = _hkiOnActive ? '#000000' : 'inherit';
      const brightnessColorOn = this._config.brightness_color_on
        ? this.renderTemplate('brightnessColorOn', this._config.brightness_color_on)
        : (brightnessColorBase || _infoDspDefault);
      const brightnessColorOff = this._config.brightness_color_off
        ? this.renderTemplate('brightnessColorOff', this._config.brightness_color_off)
        : (brightnessColorBase || _infoDspDefault);

      // Icon color logic with template support and auto modes
      const domain = this._getDomain();
      let iconColor;
      // When no explicit icon_color is set, follow Home Assistant defaults:
      // - unavailable: --state-icon-unavailable-color
      // - climate: color based on hvac_action / hvac_mode
      // - light on: actual bulb color
      // - on: #ffc107, off: --state-icon-color
      if (isUnavailable) {
        iconColor = 'var(--state-icon-unavailable-color)';
      } else if (domain === 'climate' && !this._config.icon_color) {
        iconColor = this._getClimateColor(entity);
      } else if (domain === 'light' && isOn && !this._config.icon_color) {
        // For lights: use actual color
        iconColor = this._getCurrentColor() || '#ffc107';
      } else {
        // For everything else: yellow when on, grey when off
        iconColor = isOn ? '#ffc107' : 'var(--state-icon-color)';
      }
      
      if (this._config.icon_color) {
        const rendered = this.renderTemplate('iconColor', this._config.icon_color);
        
        if (rendered === 'auto') {
          // Auto mode: smart color based on domain and state
          if (domain === 'climate') {
            iconColor = this._getClimateColor(entity);
          } else if (domain === 'lock') {
            const state = entity?.state;
            if (state === 'locked') iconColor = '#4CAF50';
            else if (state === 'unlocked') iconColor = '#FFC107';
            else if (state === 'jammed') iconColor = '#F44336';
            else iconColor = 'var(--primary-color)';
          } else if (domain === 'alarm_control_panel') {
            const state = entity?.state;
            if (state === 'disarmed') iconColor = '#4CAF50';
            else if (state === 'armed_home' || state === 'armed_away' || state === 'armed_night' || 
                     state === 'armed_vacation' || state === 'armed_custom_bypass') iconColor = '#FF9800';
            else if (state === 'triggered' || state === 'pending') iconColor = '#F44336';
            else iconColor = 'var(--primary-color)';
          } else if (domain === 'light' && isOn) {
            // For lights in on state with auto, use current light color
            iconColor = this._getCurrentColor() || 'var(--primary-color)';
          }
        } else if (rendered) {
          // Use the rendered template value directly
          iconColor = rendered;
        }
      }


      // -- Borders with template support --
      // Card Border
      const borderWidth = this._config.border_width ? this.renderTemplate('borderWidth', String(this._config.border_width)) : '0';
      const borderStyle = this._config.border_style ? this.renderTemplate('borderStyle', this._config.border_style) : 'none';
      const borderColor = this._config.border_color ? this.renderTemplate('borderColor', this._config.border_color) : 'transparent';
      const cardBorder = `${_toUnit(borderWidth)} ${borderStyle} ${borderColor}`;
      
      // Icon Circle Styling with template support
      const iconCircleBorderWidth = this._config.icon_circle_border_width ? this.renderTemplate('iconCircleBorderWidth', String(this._config.icon_circle_border_width)) : '0';
      const iconCircleBorderStyle = this._config.icon_circle_border_style ? this.renderTemplate('iconCircleBorderStyle', this._config.icon_circle_border_style) : 'none';
      const iconCircleBorderColor = this._config.icon_circle_border_color ? this.renderTemplate('iconCircleBorderColor', this._config.icon_circle_border_color) : 'transparent';
      const iconCircleBorder = `${_toUnit(iconCircleBorderWidth)} ${iconCircleBorderStyle} ${iconCircleBorderColor}`;
      const iconCircleBg = this._config.icon_circle_bg 
        ? this.renderTemplate('iconCircleBg', this._config.icon_circle_bg) 
        : 'rgba(0,0,0,0.05)';

      // Badge Styling with template support
      const badgeBorderWidth = this._config.badge_border_width ? this.renderTemplate('badgeBorderWidth', String(this._config.badge_border_width)) : '0';
      const badgeBorderStyle = this._config.badge_border_style ? this.renderTemplate('badgeBorderStyle', this._config.badge_border_style) : 'none';
      const badgeBorderColor = this._config.badge_border_color ? this.renderTemplate('badgeBorderColor', this._config.badge_border_color) : 'transparent';
      const badgeBorder = `${_toUnit(badgeBorderWidth)} ${badgeBorderStyle} ${badgeBorderColor}`;
      const badgeBg = this._config.badge_bg ? this.renderTemplate('badgeBg', this._config.badge_bg) : 'var(--primary-color)';

      // -- Offsets --
      const getTransform = (x, y) => `translate(${x || 0}px, ${y || 0}px)`;

      // -- Data --
      // For templates: show rendered value or empty string (cache retrieves instantly on subsequent loads)
      // Never show raw template syntax or default values while loading
      const nameText = this._isTemplate(this._config.name)
        ? (this._renderedName || '')
        : (this._config.name || entity?.attributes?.friendly_name || '');
      
      let stateText = this._isTemplate(this._config.state_label)
        ? (this._renderedState || '')
        : this._config.state_label;
      
      if (!stateText) {
          if (entity) {
            const domain = this._getDomain();
            // Use localized state strings
            stateText = this._getLocalizedState(entity.state, domain);
          } else {
            stateText = '';
          }
      }
      const labelText = this._isTemplate(this._config.label)
        ? (this._renderedLabel || '')
        : (this._config.label || '');
      const infoText = this._isTemplate(this._config.info_display)
        ? (this._renderedInfo || '')
        : (this._config.info_display || '');
      const brightnessColor = this._config.brightness_color 
        ? this.renderTemplate('brightnessColor', this._config.brightness_color) 
        : 'inherit';
            
      const isGroup = !!(entity?.attributes?.entity_id && Array.isArray(entity.attributes.entity_id));
      const badgeCount = isGroup
        ? (entity?.attributes?.entity_id || []).filter((id) => this.hass?.states?.[id]?.state === 'on').length
        : 0;
      
      // Animations should only run when the entity is effectively ON.
      // (Disabled for OFF and for UNAVAILABLE, which is treated as OFF elsewhere.)
      // Icon animation with template support - defaults to "on" state if plain animation name
      let animClass = '';
      if (this._config.icon_animation) {
        const rendered = this.renderTemplate('iconAnimation', this._config.icon_animation);
        if (rendered && rendered !== 'none') {
          // If it's a plain animation name (no template syntax in original config)
          if (!this._isTemplate(this._config.icon_animation)) {
            // Default to showing animation only when entity is on
            animClass = isOnEffective ? `animate-${rendered}` : '';
          } else {
            // Template explicitly controls when to show animation
            animClass = `animate-${rendered}`;
          }
        }
        // rendered === 'none' → no animation (also suppresses the fan default below)
      } else if (domain === 'fan' && isOnEffective) {
        // Fan: spin by default when on (override with icon_animation: none to disable)
        animClass = 'animate-spin';
      }

      // Custom Font Logic for specific fields
      const nameFont = this._config.name_font_family === 'custom' ? this._config.name_font_custom : this._config.name_font_family;
      const stateFont = this._config.state_font_family === 'custom' ? this._config.state_font_custom : this._config.state_font_family;
      const labelFont = this._config.label_font_family === 'custom' ? this._config.label_font_custom : this._config.label_font_family;

      // New Brightness Font Logic
      const brightnessFont = this._config.brightness_font_family === 'custom' ? this._config.brightness_font_custom : this._config.brightness_font_family;

      // Shared ha-card inline styles (used by most layouts). Tile layout should use this too.
      const __hkiCardStyle = `
            background: ${isUnavailable ? "transparent" : bgColor};
            opacity: ${isUnavailable ? 1 : cardOpacity};
            --hki-unavailable-bg: ${bgColor};
            --hki-unavailable-opacity: ${cardOpacity};
            border-radius: ${borderRadius}px !important;
            box-shadow: ${boxShadow || 'none'} !important;
            border: ${cardBorder} !important;
            ${iconColor ? `            --icon-color: ${iconColor} !important;\n` : ''}            --hki-card-min: ${Math.min(this._stageW || 0, this._stageH || 0)}px;
            --hki-icon-size: clamp(16px, calc(var(--hki-card-min) * ${(() => { const max = Number(this._config.size_icon) || 24; const scale = Math.max(0.08, Math.min(0.35, 0.15 * (max / 24))); return scale.toFixed(4); })()}), ${Number(this._config.size_icon) || 24}px);
            --hki-temp-badge-scale: ${(() => { const iconMax = (this._config.size_icon || 24); const circleMax = iconMax + 16; const tempMax = (this._config.temp_badge_size ?? circleMax); return (tempMax / circleMax).toFixed(4); })()};
            --hki-temp-badge-size: calc(var(--hki-icon-circle-size) * var(--hki-temp-badge-scale));
            --hki-icon-circle-size: calc(var(--hki-icon-size) + 16px);
      `;

      

const iconAlign = this._config.icon_align || 'left';
              const iconJustify = iconAlign === 'center' ? 'center' : iconAlign === 'right' ? 'flex-end' : 'flex-start';
              
              const renderInfoDisplay = () => {
                  if (this._config.show_info_display === false) return '';
                  
                  let bottomValue = '';
                  
                  // For templates: only show rendered value, never raw template
                  if (this._isTemplate(this._config.info_display)) {
                    bottomValue = this._renderedInfo || '';
                  } else if (this._config.info_display) {
                    bottomValue = this._config.info_display;
                  }
                  
                  // If no override, calculate default value
                  if (!bottomValue) {
                    if (this._getDomain() === 'light') {
                      bottomValue = `${this._getBrightness()}%`;
                    } else if (this._getDomain() === 'climate') {
                      const attrs = entity.attributes || {};
                      if (attrs.target_temp_low !== undefined && attrs.target_temp_low !== null) {
                        const unit = '°';
                        bottomValue = `${attrs.target_temp_low}-${attrs.target_temp_high}${unit}`;
                      } else if (attrs.temperature !== undefined && attrs.temperature !== null) {
                        const unit = '°';
                        bottomValue = `${attrs.temperature}${unit}`;
                      }
                    }
                  }
                  
                  if (!bottomValue) return '';
                  const brightnessColor = isOn ? brightnessColorOn : brightnessColorOff;
                  return html`
                    <div class="brightness-tag info-tag" style="
                        ${getFont(brightnessFont, this._config.brightness_font_weight, this._config.size_brightness || 12)}
                        color: ${brightnessColor};
                        text-align: ${this._config.brightness_text_align || 'left'};
                        transform: ${getTransform(this._config.brightness_offset_x, this._config.brightness_offset_y)};
                    ">
                        ${bottomValue}
                    </div>
                  `;
              };

              const elements = {
                icon: () => html`
                  <div class="tile-header" style="justify-content: ${iconJustify};">
                    ${(this._config.show_icon !== false) ? html`
                    <div 
                        class="icon-circle"
                        style="
                            width: var(--hki-icon-circle-size); 
                            height: var(--hki-icon-circle-size);
                            background: ${this._config.show_icon_circle !== false ? iconCircleBg : 'transparent'};
                            border: ${this._config.show_icon_circle !== false ? iconCircleBorder : 'none'};
                            transform: ${getTransform(this._config.icon_offset_x, this._config.icon_offset_y)};
                        "
                        @click=${(e) => { e.stopPropagation(); this._handleDelayClick(this._config.icon_tap_action || { action: "hki-more-info" }, this._config.icon_double_tap_action); }}
	                        
                        @mousedown=${(e) => { e.stopPropagation(); this._startHold(e, this._config.icon_hold_action); }}
                        @mouseup=${(e) => { e.stopPropagation(); this._clearHold(); }}
                        @mouseleave=${(e) => { this._clearHold(); }}
                        @touchstart=${(e) => { e.stopPropagation(); this._startHold(e, this._config.icon_hold_action); }}
                        @touchend=${(e) => { e.stopPropagation(); this._clearHold(); }}
                        @touchcancel=${(e) => { this._clearHold(); }}
                    >
                        ${this._config.use_entity_picture ? (() => {
                          const entityPicture = this._config.entity_picture_override || entity?.attributes?.entity_picture;
                          return entityPicture ? html`
                            <img 
                              src="${entityPicture}"
                              class="${animClass}"
                              style="width: var(--hki-icon-size); height: var(--hki-icon-size); border-radius: 50%; object-fit: cover;"
                            />
                          ` : html`
                            <ha-state-icon
                              .hass=${this.hass}
                              .stateObj=${entity}
                              .icon=${iconToUse}
                              class="${animClass}"
                              style="--mdc-icon-size: var(--hki-icon-size); color: ${iconColor}; transition: color 0.3s;"
                            ></ha-state-icon>
                          `;
                        })() : iconToUse ? html`
                          <ha-icon 
                            .icon=${iconToUse}
                            class="${animClass}"
                            style="--mdc-icon-size: var(--hki-icon-size); color: ${iconColor};"
                          ></ha-icon>
                        ` : html`
                          <ha-state-icon
                            .hass=${this.hass}
                            .stateObj=${entity}
                            class="${animClass}"
                            style="--mdc-icon-size: var(--hki-icon-size); color: ${iconColor}; transition: color 0.3s;"
                          ></ha-state-icon>
                        `}
                        ${this._renderBadge(entity, isOn, iconColor, badgeBorder, badgeBg, badgeCount, getTransform)}
                    </div>
                    ` : ''}
                  </div>
                `,
                name: () => (this._config.show_name !== false) ? html`
                  <div class="name" style="
                      ${getFont(nameFont, this._config.name_font_weight, this._config.size_name || 14)}
                      color: ${nameColor};
                      text-align: ${this._config.name_text_align || 'left'};
                      transform: ${getTransform(this._config.name_offset_x, this._config.name_offset_y)};
                  ">
                      ${nameText}
                  </div>
                ` : '',
                label: () => (this._config.show_label && labelText) ? html`
                  <div class="label" style="
                      ${getFont(labelFont, this._config.label_font_weight, this._config.size_label || 11)}
                      color: ${labelColor};
                      text-align: ${this._config.label_text_align || 'left'};
                      transform: ${getTransform(this._config.label_offset_x, this._config.label_offset_y)};
                  ">
                      ${labelText}
                  </div>
                ` : '',
                state: () => (this._config.show_state !== false) ? html`
                  <div class="state" style="
                      ${getFont(stateFont, this._config.state_font_weight, this._config.size_state || 12)}
                      color: ${stateColor};
                      text-align: ${this._config.state_text_align || 'left'};
                      transform: ${getTransform(this._config.state_offset_x, this._config.state_offset_y)};
                  ">
                      ${stateText}
                  </div>
                ` : '',
              info_display: renderInfoDisplay,
              info: renderInfoDisplay,
              temp_badge: () => {
                  // Only render for climate entities
                  if (this._getDomain() !== 'climate') return '';
                  return this._renderClimateCornerBadge(entity, isOn, iconColor, badgeBorder, badgeBg, getTransform);
                }
              };


// HKI Tile layout: wide pill, icon circle left, stacked text.
      if (layout === 'hki_tile') {
        const showIcon = this._config.show_icon !== false;
        const showName = this._config.show_name !== false;
        const showState = this._config.show_state !== false;
        const showCircle = this._config.show_icon_circle !== false;
        const showLabel = false;
        const showInfo = this._config.show_brightness !== false; // Enable info display for tile layout
        
        // Icon color logic for tile (same as main layout)
        let tileIconColor;
        if (isUnavailable) {
          tileIconColor = 'var(--state-icon-unavailable-color)';
        } else if (domain === 'climate' && !this._config.icon_color) {
          tileIconColor = this._getClimateColor(entity);
        } else if (domain === 'light' && isOn && !this._config.icon_color) {
          // For lights: use actual color
          tileIconColor = this._getCurrentColor() || '#ffc107';
        } else {
          // For everything else: yellow when on, grey when off
          tileIconColor = isOn ? '#ffc107' : 'var(--state-icon-color)';
        }
        
        if (this._config.icon_color) {
          const rendered = this.renderTemplate('iconColor', this._config.icon_color);
          if (rendered === 'auto') {
            if (domain === 'climate') {
              tileIconColor = this._getClimateColor(entity);
            } else if (domain === 'light' && isOn) {
              tileIconColor = this._getCurrentColor() || 'var(--primary-color)';
            }
          } else if (rendered) {
            tileIconColor = rendered;
          }
        }
        
        const __iconOverride = (this.renderTemplate('icon', this._config.icon || '') || '').toString().trim();
        const icon = (__iconOverride)
          ? __iconOverride
          : ((entity && entity.attributes && entity.attributes.icon) || 'mdi:help-circle');

        const tileNameText = nameText;
        const tileStateText = stateText;

        const tileLabelText = (this._config.label !== undefined && this._config.label !== null && this._config.label !== '')
          ? labelText
          : labelText;
        
        // Get info display content
        let tileInfoEl = "";
        if (showInfo) {
          // Get the info value from template or config or domain defaults
          if (this._isTemplate(this._config.info_display)) {
            tileInfoEl = this._renderedInfo || '';
          } else if (this._config.info_display) {
            tileInfoEl = this._config.info_display;
          } else if (domain === 'light') {
            tileInfoEl = `${this._getBrightness()}%`;
          } else if (domain === 'climate') {
            const attrs = entity.attributes || {};
            if (attrs.target_temp_low !== undefined && attrs.target_temp_low !== null) {
              tileInfoEl = `${attrs.target_temp_low}-${attrs.target_temp_high}°`;
            } else if (attrs.temperature !== undefined && attrs.temperature !== null) {
              tileInfoEl = `${attrs.temperature}°`;
            }
          } else if (domain === 'media_player') {
            const volume = this._getSliderValue();
            tileInfoEl = `${volume}%`;
          } else if (domain === 'fan') {
            const speed = this._getSliderValue();
            tileInfoEl = `${speed}%`;
          }
        }

        const tileAnimClass = (this._config.enable_icon_animation === true && isOnEffective)
          ? 'hki-icon-anim'
          : (domain === 'fan' && isOnEffective ? 'animate-spin' : '');
        const __hkiTileHeightCfg = Number(this._config.tile_height);
        const __hkiTileHeightRaw = (Number.isFinite(__hkiTileHeightCfg) && __hkiTileHeightCfg > 0)
          ? Math.round(__hkiTileHeightCfg)
          : 60; // default tile height (do not write to YAML)
        const __hkiTileHeight = Math.max(40, __hkiTileHeightRaw); // minimum 40px
        const __hkiTileStyle = `${__hkiCardStyle} height: ${__hkiTileHeight}px !important; min-height: ${__hkiTileHeight}px !important;`;

        // Tile brightness/volume slider configuration
        const showBrightnessSlider = this._config.show_tile_slider === true && isOnEffective && (
          domain === 'light' ||
          domain === 'media_player' ||
          domain === 'fan' ||
          domain === 'cover'
        );
        const sliderTrackColor = this._config.tile_slider_track_color || 'rgba(255, 255, 255, 0.2)';
        const sliderFillColor = this._config.tile_slider_fill_color || 'rgba(255, 255, 255, 0.8)';
        const currentSliderValue = this._getSliderValue();


        return html`
          <ha-card 
            class="hki-tile ${isOnEffective ? 'on' : 'off'} layout-hki-tile ${isUnavailable ? 'is-unavailable' : ''}"
            style="${__hkiTileStyle}"
            @click=${(e) => { 
              // Don't handle if slider is active (let slider handle it)
              if (showBrightnessSlider) return;
              e.stopPropagation(); 
              this._handleDelayClick(this._config.tap_action || ((!this._config.entity && (this._config.custom_popup?.enabled || this._config.custom_popup_enabled)) ? { action: "hki-more-info" } : { action: "toggle" }), this._config.double_tap_action); 
            }}
            @mousedown=${(e) => {
              // Don't handle if slider is active
              if (showBrightnessSlider) return;
              e.stopPropagation(); 
              this._startHold(e, this._config.hold_action); 
            }}
            @mouseup=${(e) => { e.stopPropagation(); this._clearHold(); }}
            @mouseleave=${(e) => { this._clearHold(); }}
            @touchstart=${(e) => {
              // Don't handle if slider is active
              if (showBrightnessSlider) return;
              e.stopPropagation(); 
              this._startHold(e, this._config.hold_action); 
            }}
            @touchend=${(e) => { e.stopPropagation(); this._clearHold(); }}
          >
            <div class="hki-tile layout-hki-tile">
              ${showIcon ? html`
                <div class="icon-circle hki-icon-circle" style="
                  width: var(--hki-icon-circle-size);
                  height: var(--hki-icon-circle-size);
                  background: ${showCircle ? iconCircleBg : 'transparent'};
                  border: ${showCircle ? iconCircleBorder : 'none'};
                  transform: translate(calc(${Number(this._config.icon_offset_x||0)}px + ${Number(this._config.icon_circle_offset_x||0)}px), calc(${Number(this._config.icon_offset_y||0)}px + ${Number(this._config.icon_circle_offset_y||0)}px));
                  cursor: pointer;
                  z-index: 10;
                  position: relative;
                "
                @click=${(e) => { 
                  e.stopPropagation();
                  // When slider is enabled, the card itself ignores taps; so the icon handles them.
                  const ta = (this._config.icon_tap_action || this._config.tap_action || ((!this._config.entity && (this._config.custom_popup?.enabled || this._config.custom_popup_enabled)) ? { action: "hki-more-info" } : { action: "toggle" }));
                  const dta = (this._config.icon_double_tap_action || this._config.double_tap_action);
                  this._handleDelayClick(ta, dta);
                }}
                @mousedown=${(e) => { 
                  e.stopPropagation(); 
                  const ha = (this._config.icon_hold_action || this._config.hold_action);
                  this._startHold(e, ha); 
                }}
                @mouseup=${(e) => { e.stopPropagation(); this._clearHold(); }}
                @mouseleave=${(e) => { this._clearHold(); }}
                @touchstart=${(e) => { 
                  e.stopPropagation(); 
                  const ha = (this._config.icon_hold_action || this._config.hold_action);
                  this._startHold(e, ha); 
                }}
                @touchend=${(e) => { e.stopPropagation(); this._clearHold(); }}
                @touchcancel=${(e) => { this._clearHold(); }}
                >
                  ${this._config.entity_picture ? html`
                    <img src="${this._getEntityPicture(entity)}" class="${tileAnimClass}" style="width:var(--hki-icon-size);height:var(--hki-icon-size);border-radius:50%; " />
                  ` : (icon && this._config.icon) ? html`
                    <ha-icon .icon=${icon} class="${tileAnimClass}" style="--mdc-icon-size: var(--hki-icon-size); color: ${tileIconColor}; transition: color 0.3s;"></ha-icon>
                  ` : html`
                    <ha-state-icon .hass=${this.hass} .stateObj=${entity} class="${tileAnimClass}" style="--mdc-icon-size: var(--hki-icon-size); color: ${tileIconColor}; transition: color 0.3s;"></ha-state-icon>
                  `}

                  ${this._renderBadge(entity, isOnEffective, tileIconColor, badgeBorder, badgeBg, badgeCount, (x, y) => `translate(${x || 0}px, ${y || 0}px)`)}
                </div>
              ` : ''}

              <div class="hki-tile-text">
                ${showName ? html`<div class="name" style="${getFont(nameFont, this._config.name_font_weight, this._config.size_name || 13)} color:${nameColor}; transform:${getTransform(this._config.name_offset_x, this._config.name_offset_y)};">${tileNameText}</div>` : ''}
                ${showLabel ? html`<div class="label" style="${getFont(labelFont, this._config.label_font_weight, (this._config.size_label ?? -2))} color:${labelColor}; transform:${getTransform(this._config.label_offset_x, this._config.label_offset_y)};">${tileLabelText}</div>` : ''}
                ${showState ? html`<div class="state" style="${getFont(stateFont, this._config.state_font_weight, this._config.size_state || 12)} color:${stateColor}; transform:${getTransform(this._config.state_offset_x, this._config.state_offset_y)};">${tileStateText}</div>` : ''}
              </div>
              ${showInfo && tileInfoEl ? html`
                <div class="tile-info-corner" style="
                  ${getFont(brightnessFont, this._config.brightness_font_weight, this._config.size_brightness || 12)}
                  color: ${isOnEffective ? brightnessColorOn : brightnessColorOff};
                  transform:${getTransform(this._config.brightness_offset_x, this._config.brightness_offset_y)};
                ">${tileInfoEl}</div>
              ` : ''}
            </div>
            ${showBrightnessSlider ? html`
                <div 
                  class="hki-brightness-slider-container"
                  style="
                    --slider-track-color: ${sliderTrackColor};
                    --slider-fill-color: ${sliderFillColor};
                    --slider-progress: ${currentSliderValue}%;
                  "
                >
                  <div class="hki-brightness-slider-visual"></div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  .value=${currentSliderValue}
                  class="hki-brightness-slider-input"
                  style="
                    --slider-track-color: ${sliderTrackColor};
                    --slider-fill-color: ${sliderFillColor};
                    --slider-progress: ${currentSliderValue}%;
                  "
                  @click=${(e) => this._tileSliderClick(e)}
                  @pointerdown=${(e) => this._tileSliderPointerDown(e)}
                  @pointermove=${(e) => this._tileSliderPointerMove(e)}
                  @pointerup=${(e) => this._tileSliderPointerUp(e)}
                  @pointercancel=${(e) => this._tileSliderPointerUp(e)}
                  @input=${(e) => this._tileSliderInput(e, domain)}
                  @change=${(e) => this._tileSliderChange(e, domain)}
                  />
                </div>
              ` : ''}
          </ha-card>
        `;
      }

      // HA badge mimic mode: compact, fixed-size, no grid.
      if (layout === 'badge') {
        // Mimic Home Assistant badges: fixed-size icon circle and optional pill for name/state.
        const showIcon = this._config.show_icon !== false;
        const showName = this._config.show_name === true;
        const showState = this._config.show_state === true;

        // Use the already computed display strings (and allow explicit overrides via config)
        const badgeNameText = nameText;

        const badgeStateText = stateText;

        // Fixed HA-like badge sizes
        const badgeCircleSize = 35;
        const iconSize = Math.min(Math.max(Number(this._config.size_icon || 18), 10), 28);

        // Pill is shown only when name/state selected
        const showPill = (showName || showState);

        // Reuse existing HKI styling logic for card-level overrides (background/border/shadow/opacity/radius)
        const badgeBg = bgColor;
        const badgeBorder = (() => {
          // HA-like default outline for badges is slightly thinner than 1px.
          // Only apply this default when the user didn't explicitly configure a border.
          const bw = this._config.border_width;
          const bs = this._config.border_style;
          const bc = this._config.border_color;
          const userSetBorder = !((bw === undefined || bw === null || bw === '') && (bs === undefined || bs === null || bs === '') && (bc === undefined || bc === null || bc === ''));
          if (!userSetBorder) return `0.5px solid var(--divider-color)`;
          // If user did set a border but used an unqualified "1", allow "0.5" in badge mode by setting border_width to 0.5.
          if ((bw === 1 || bw === '1' || bw === '1px') && (bs === undefined || bs === null || bs === '')) {
            return `0.5px solid ${bc || 'var(--divider-color)'}`;
          }
          return cardBorder;
        })();
        const iconRendered = this.renderTemplate('icon', this._config.icon || '');
        const iconToUse = (iconRendered !== undefined && iconRendered !== null && String(iconRendered).trim() !== '') ? String(iconRendered).trim() : undefined;

        const badgeShadow = boxShadow;
        const badgeOpacity = cardOpacity;

        const badgeRadius = (this._config.border_radius !== undefined && this._config.border_radius !== null)
          ? borderRadius
          : 999;

        // Icon circle style (can be disabled independently)
        const showCircle = this._config.show_icon_circle !== false;

        // Default to the existing icon circle styling (so HKI overrides behave the same as other layouts)
        const circleBg = showCircle ? iconCircleBg : 'transparent';
        const circleBorder = showCircle ? iconCircleBorder : 'none';

        // Icon color logic for badge (same as main layout)
        let badgeIconColor;
        if (isUnavailable) {
          badgeIconColor = 'var(--state-icon-unavailable-color)';
        } else if (domain === 'climate' && !this._config.icon_color) {
          badgeIconColor = this._getClimateColor(entity);
        } else if (domain === 'light' && isOn && !this._config.icon_color) {
          // For lights: use actual color
          badgeIconColor = this._getCurrentColor() || '#ffc107';
        } else {
          // For everything else: yellow when on, grey when off
          badgeIconColor = isOn ? '#ffc107' : 'var(--state-icon-color)';
        }
        
        if (this._config.icon_color) {
          const rendered = this.renderTemplate('iconColor', this._config.icon_color);
          if (rendered === 'auto') {
            if (domain === 'climate') {
              badgeIconColor = this._getClimateColor(entity);
            } else if (domain === 'light' && isOn) {
              badgeIconColor = this._getCurrentColor() || 'var(--primary-color)';
            }
          } else if (rendered) {
            badgeIconColor = rendered;
          }
        }

        // Render icon using the same HKI logic as other layouts (entity picture, overrides, animations, colors)
        const renderBadgeIcon = () => {
          if (!showIcon) return '';

          if (this._config.use_entity_picture) {
            const entityPicture = this._config.entity_picture_override || entity?.attributes?.entity_picture;
            if (entityPicture) {
              return html`
                <img
                  src="${entityPicture}"
                  class="${animClass}"
                  style="width:${iconSize}px;height:${iconSize}px;border-radius:50%;object-fit:cover;display:block;"
                />
              `;
            }
          }

          if (iconToUse) {
            return html`
              <ha-icon
                .icon=${iconToUse}
                class="${animClass}"
                style="--mdc-icon-size:${iconSize}px;color:${badgeIconColor};transition:color 0.3s;display:block;"
              ></ha-icon>
            `;
          }

          return html`
            <ha-state-icon
              .hass=${this.hass}
              .stateObj=${entity}
              class="${animClass}"
              style="--mdc-icon-size:${iconSize}px;color:${badgeIconColor};transition:color 0.3s;display:block;"
            ></ha-state-icon>
          `;
        };

        // Apply HKI visual overrides:
        // - Icon-only: circle gets background/border/shadow/radius/opacity
        // - Pill: wrapper gets background/border/shadow/radius/opacity (circle uses icon-circle settings)
        const wrapStyle = showPill
          ? (isUnavailable
              ? `background:transparent;border:${badgeBorder};box-shadow:${badgeShadow};--hki-badge-bg:${badgeBg};--hki-badge-opacity:${badgeOpacity};--hki-badge-pill-height:${badgeCircleSize}px;height:${badgeCircleSize}px;border-radius:calc(${badgeCircleSize}px/2);`
              : `background:${badgeBg};border:${badgeBorder};box-shadow:${badgeShadow};opacity:${badgeOpacity};--hki-badge-pill-height:${badgeCircleSize}px;height:${badgeCircleSize}px;border-radius:calc(${badgeCircleSize}px/2);`)
          : '';

        return html`
          <ha-card
            class="hki-ha-badge ${isOnEffective ? 'on' : 'off'}"
            style="
              background: transparent;box-shadow: none !important;border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              ${iconColor ? `            --icon-color: ${iconColor} !important;\n` : ''}            "

            @click=${() => this._handleDelayClick(this._config.tap_action || { action: "hki-more-info" }, this._config.double_tap_action || { action: "hki-more-info" })}
	            
            @mousedown=${(e) => this._startHold(e, this._config.hold_action || { action: "hki-more-info" })}
            @mouseup=${() => this._clearHold()}
            @mouseleave=${() => this._clearHold()}
            @touchstart=${(e) => this._startHold(e, this._config.hold_action || { action: "hki-more-info" })}
            @touchend=${() => this._clearHold()}
            @touchcancel=${() => this._clearHold()}
          >
            <div
              class="hki-ha-badge__wrap ${showPill ? 'pill' : 'icon-only'} ${isUnavailable ? 'is-unavailable' : ''}"
              style="${wrapStyle}"
            >
              ${showIcon ? html`
                <div
                  class="hki-ha-badge__circle ${isUnavailable ? 'is-unavailable' : ''}"
                  style="
                    width:${badgeCircleSize}px;
                    height:${badgeCircleSize}px;
                    transform: translate(calc(${Number(this._config.icon_offset_x||0)}px + ${Number(this._config.icon_circle_offset_x||0)}px), calc(${Number(this._config.icon_offset_y||0)}px + ${Number(this._config.icon_circle_offset_y||0)}px));
                    ${showPill ? `background:${circleBg};border:${circleBorder};border-radius:999px;` : `background:${badgeBg || 'var(--card-background-color)'};border:${badgeBorder || '0.5px solid var(--divider-color)'};border-radius:${badgeRadius}px;box-shadow:${badgeShadow};opacity:${badgeOpacity};`}
                  "
                >
                  <div class="hki-ha-badge__iconwrap">
                    ${renderBadgeIcon()}
                  </div>
                </div>
              ` : ''}

              ${showPill ? html`
                <div class="hki-ha-badge__text">
                  ${showName ? html`
                    <div class="hki-ha-badge__name" style="
                      ${getFont(nameFont, this._config.name_font_weight, this._config.size_name || 12)}
                      color:${nameColor};
                      text-align:${this._config.name_text_align || 'left'};
                      transform:${getTransform(this._config.name_offset_x, this._config.name_offset_y)};
                    ">${badgeNameText}</div>
                  ` : ''}
                  ${showState ? html`
                    <div class="hki-ha-badge__state" style="
                      ${getFont(stateFont, this._config.state_font_weight, this._config.size_state || 12)}
                      color:${stateColor};
                      text-align:${this._config.state_text_align || 'left'};
                      transform:${getTransform(this._config.state_offset_x, this._config.state_offset_y)};
                    ">${badgeStateText}</div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </ha-card>
        `;
      }


      return html`
        <ha-card 
          class="hki-tile ${isOnEffective ? 'on' : 'off'} layout-${layout}  ${isUnavailable ? "is-unavailable" : ""}"
          style="
            background: ${isUnavailable ? "transparent" : bgColor};
            opacity: ${isUnavailable ? 1 : cardOpacity};
            --hki-unavailable-bg: ${bgColor};
            --hki-unavailable-opacity: ${cardOpacity};
            border-radius: ${borderRadius}px !important;
            box-shadow: ${boxShadow || 'none'} !important;
            border: ${cardBorder} !important;
            ${iconColor ? `            --icon-color: ${iconColor} !important;\n` : ''}            --hki-card-min: ${Math.min(this._stageW || 0, this._stageH || 0)}px;
            --hki-icon-size: clamp(16px, calc(var(--hki-card-min) * ${(() => { const max = Number(this._config.size_icon) || 24; const scale = Math.max(0.08, Math.min(0.35, 0.15 * (max / 24))); return scale.toFixed(4); })()}), ${Number(this._config.size_icon) || 24}px);
            --hki-temp-badge-scale: ${(() => { const iconMax = (this._config.size_icon || 24); const circleMax = iconMax + 16; const tempMax = (this._config.temp_badge_size ?? circleMax); return (tempMax / circleMax).toFixed(4); })()};
            --hki-temp-badge-size: calc(var(--hki-icon-circle-size) * var(--hki-temp-badge-scale));
            --hki-icon-circle-size: calc(var(--hki-icon-size) + 16px);
            
          "
          @click=${() => this._handleDelayClick(this._config.tap_action || ((!this._config.entity && (this._config.custom_popup?.enabled || this._config.custom_popup_enabled)) ? { action: "hki-more-info" } : { action: "toggle" }), this._config.double_tap_action || { action: "hki-more-info" })}
	          
          @mousedown=${(e) => this._startHold(e, this._config.hold_action || { action: "hki-more-info" })}
          @mouseup=${() => this._clearHold()}
          @mouseleave=${() => this._clearHold()}
          @touchstart=${(e) => this._startHold(e, this._config.hold_action || { action: "hki-more-info" })}
          @touchend=${() => this._clearHold()}
          @touchcancel=${() => this._clearHold()}
        >
            ${(() => {
              // Define all renderable elements
              
              // Fixed square layout: button-card like grid
              if (layout === 'square') {
                const _name = (this._config.show_name !== false) ? elements.name?.() : '';
                const _label = (this._config.show_label && labelText) ? elements.label?.() : '';
                const _state = (this._config.show_state !== false) ? elements.state?.() : '';
                const _info  = (this._config.show_info_display !== false) ? elements.info?.() : '';
                const _temp  = (this._config.show_temp_badge !== false) ? elements.temp_badge?.() : '';

                return html`
                  <div class="hki-square-grid">
                    <div class="sq-icon">${elements.icon?.()}</div>
                    ${_temp ? html`<div class="sq-temp-badge">${_temp}</div>` : ''}
                    <div class="sq-area"></div>
                    <div class="sq-name">${_name}</div>
                    <div class="sq-label">${_label}</div>
                    <div class="sq-state-row">
                      <div class="sq-state">${_state}</div>
                      <div class="sq-info">${_info}</div>
                    </div>
                  </div>
                `;
              }

// Check if we have grid layout config, otherwise use default
              return elementGrid
                ? (() => {
                // Button-card-like approach:
                // We treat the tile as a positioning stage and place each element absolutely,
                // anchored to the tile box (percent-based), so elements don't drift when the
                // tile is resized inside parent grid cards (e.g. type: grid, square: true).
                const grid = elementGrid;

                // === Canvas Layout (WYSIWYG) ===
                // If enabled, we ignore the painted grid for rendering and instead place a few logical
                // elements by percent-based boxes relative to the card. This behaves consistently inside
                // HA grid cards (square: true) and during resizing.
                const _useCanvas = (layout !== 'square') && (this._config.use_canvas_layout !== false);
                if (_useCanvas) {
                  const _defaultCanvas = {
                    icon: { x: 6, y: 6, w: 28, h: 28, ax: 'start', ay: 'start' },
                    text: { x: 6, y: 64, w: 70, h: 30, ax: 'start', ay: 'end' },
                    info: { x: 70, y: 64, w: 24, h: 30, ax: 'end', ay: 'end' }
                  };
                  const _canvas = (this._config.canvas_layout && typeof this._config.canvas_layout === 'object')
                    ? this._config.canvas_layout
                    : _defaultCanvas;

                  // Build a text stack so line spacing stays stable during resize (button-card-like).
                  const _nameHtml = elements.name?.();
                  const _stateHtml = elements.state?.();
                  const _labelHtml = elements.label?.();
                  const _gap = Number.isFinite(this._config.text_line_gap_px) ? Number(this._config.text_line_gap_px) : 2;
                  const _textStack = (_nameHtml || _stateHtml || _labelHtml) ? html`
                    <div class="hki-text-stack" style="display:flex;flex-direction:column;gap:${_gap}px;align-items:flex-start;">
                      ${_nameHtml || ''}
                      ${_stateHtml || ''}
                      ${_labelHtml || ''}
                    </div>
                  ` : '';

                  const _placed = [];
                  const _place = (key, content, fallbackBox, innerJustify, innerAlign) => {
                    if (!content) return;
                    const b = (_canvas && _canvas[key]) ? _canvas[key] : fallbackBox;
                    if (!b) return;
                    const x = Math.max(0, Math.min(100, Number(b.x ?? fallbackBox.x)));
                    const y = Math.max(0, Math.min(100, Number(b.y ?? fallbackBox.y)));
                    const w = Math.max(1, Math.min(100, Number(b.w ?? fallbackBox.w)));
                    const h = Math.max(1, Math.min(100, Number(b.h ?? fallbackBox.h)));

                    _placed.push(html`
                      <div class="stage-item stage-${key}" style="
                        left:${x}%;
                        top:${y}%;
                        width:${w}%;
                        height:${h}%;
                        display:flex;
                        justify-content:${innerJustify};
                        align-items:${innerAlign};
                        box-sizing:border-box;
                        padding:0;
                      ">
                        <div class="stage-inner" style="width:100%;height:100%;display:flex;justify-content:${innerJustify};align-items:${innerAlign};max-width:100%;max-height:100%;">
                          ${content}
                        </div>
                      </div>
                    `);
                  };

                  // Place icon, text stack, and info (brightness). Other elements remain controlled by existing toggles.
                  _place('icon', elements.icon?.(), _defaultCanvas.icon, 'flex-start', 'flex-start');
                  _place('text', _textStack, _defaultCanvas.text, 'flex-start', 'flex-end');
                  _place('info', elements.info?.(), _defaultCanvas.info, 'flex-end', 'flex-end');
                  // Climate corner badge if present (top-right by default, small box)
                  _place('temp_badge', elements.temp_badge?.(), { x: 76, y: 6, w: 18, h: 18 }, 'flex-end', 'flex-start');

                  return html`<div class="layout-stage-container">${_placed}</div>`;
                }


                // Percent inset from the stage edges/cell edges for start/end alignment.
                // Kept intentionally simple (no UI complexity required).
                const inset = Number.isFinite(this._config.grid_inset_percent)
                  ? Number(this._config.grid_inset_percent)
                  : 7;

                const placed = [];

                // Build a bounding box per element type so selecting multiple cells creates a single spanning area
                // (instead of duplicating the element).
                const boundsByCell = {};
                for (let i = 0; i < grid.length; i++) {
                  const cell = grid[i];
                  if (!cell || cell === 'empty') continue;
                  const r = Math.floor(i / gridCols) + 1;
                  const c = (i % gridCols) + 1;
                  if (!boundsByCell[cell]) {
                    boundsByCell[cell] = { minR: r, maxR: r, minC: c, maxC: c };
                  } else {
                    boundsByCell[cell].minR = Math.min(boundsByCell[cell].minR, r);
                    boundsByCell[cell].maxR = Math.max(boundsByCell[cell].maxR, r);
                    boundsByCell[cell].minC = Math.min(boundsByCell[cell].minC, c);
                    boundsByCell[cell].maxC = Math.max(boundsByCell[cell].maxC, c);
                  }
                }

                
                
                // Merge text elements into a single stack when they are laid out as a typical tile text block.
                // This keeps the spacing between lines stable when the card resizes (e.g. inside HA grid cards),
                // while still letting users position the text visually by choosing the text cells.
                if (boundsByCell.name && (boundsByCell.state || boundsByCell.label)) {
                  const _n = boundsByCell.name;
                  const _s = boundsByCell.state;
                  const _l = boundsByCell.label;

                  // Prefer merging when state/label are below (or overlapping) the name and share columns.
                  const _rowsOk = (_s ? (_s.minR >= _n.minR) : true) && (_l ? (_l.minR >= _n.minR) : true);

                  const _overlap = (a, b) => Math.max(a.minC, b.minC) <= Math.min(a.maxC, b.maxC);

                  const _colsOk =
                    (_s ? _overlap(_n, _s) : true) &&
                    (_l ? _overlap(_n, _l) : true);

                  if (_rowsOk && _colsOk) {
                    const _minR = Math.min(_n.minR, _s ? _s.minR : _n.minR, _l ? _l.minR : _n.minR);
                    const _maxR = Math.max(_n.maxR, _s ? _s.maxR : _n.maxR, _l ? _l.maxR : _n.maxR);
                    const _minC = Math.min(_n.minC, _s ? _s.minC : _n.minC, _l ? _l.minC : _n.minC);
                    const _maxC = Math.max(_n.maxC, _s ? _s.maxC : _n.maxC, _l ? _l.maxC : _n.maxC);

                    boundsByCell.textstack = { minR: _minR, maxR: _maxR, minC: _minC, maxC: _maxC };

                    // Replace individual name/state/label renders with a single stacked block.
                    const _nameHtml = elements.name?.();
                    const _stateHtml = elements.state?.();
                    const _labelHtml = elements.label?.();

                    elements.textstack = () => html`
                      <div class="hki-text-stack" style="display:flex;flex-direction:column;gap:${Number.isFinite(this._config.text_line_gap_px) ? Number(this._config.text_line_gap_px) : 2}px;align-items:flex-start;">
                        ${_nameHtml || ''}
                        ${_stateHtml || ''}
                        ${_labelHtml || ''}
                      </div>
                    `;

                    delete boundsByCell.name;
                    delete boundsByCell.state;
                    delete boundsByCell.label;
                  }
                }

// Compute stage dimensions for pixel-accurate placement.
                // Use the measured ha-card size (ResizeObserver) to avoid clipping/misalignment when ha-card has overflow hidden.
                const _stageW = this._stageW || 0;
                const _stageH = this._stageH || 0;

                // Row sizing:
                // Keep the visual grid intuitive: each row/column represents an equal slice of the card.
                // This ensures the visual editor grid is a true "where it will go" preview.
                const _rowHeights = [];

                for (const cell of Object.keys(boundsByCell)) {
                  const elementHtml = elements[cell]?.();
                  if (!elementHtml) continue;

                  const b = boundsByCell[cell];

                                    // Cell bounds for the stage.
                  // Use pixel-based rows when we can measure the card, so text rows behave like min-content rows.
                  let leftVal, topVal, widthVal, heightVal;
                  if (_stageW > 0 && _stageH > 0) {
                    const _colW = _stageW / gridCols;
                    leftVal = `${(b.minC - 1) * _colW}px`;
                    widthVal = `${(b.maxC - b.minC + 1) * _colW}px`;

                    if (_rowHeights.length) {
                      let _topPx = 0;
                      for (let rr = 1; rr < b.minR; rr++) _topPx += (_rowHeights[rr] || 0);
                      let _hPx = 0;
                      for (let rr = b.minR; rr <= b.maxR; rr++) _hPx += (_rowHeights[rr] || 0);
                      topVal = `${_topPx}px`;
                      heightVal = `${_hPx}px`;
                    } else {
                      const _rowH = _stageH / gridRows;
                      topVal = `${(b.minR - 1) * _rowH}px`;
                      heightVal = `${(b.maxR - b.minR + 1) * _rowH}px`;
                    }
                  } else {
                    // Fallback to percentage placement if size is not yet measurable.
                    leftVal = `${((b.minC - 1) / gridCols) * 100}%`;
                    topVal = `${((b.minR - 1) / gridRows) * 100}%`;
                    widthVal = `${((b.maxC - b.minC + 1) / gridCols) * 100}%`;
                    heightVal = `${((b.maxR - b.minR + 1) / gridRows) * 100}%`;
                  }

                  // Align within the spanned area.
                  // Goal: make the visual editor grid a true preview of where content lands.
                  const _edgeJustify = (b.minC === 1) ? 'flex-start' : ((b.maxC === gridCols) ? 'flex-end' : 'center');
                  const _edgeAlign = (b.minR === 1) ? 'flex-start' : ((b.maxR === gridRows) ? 'flex-end' : 'center');

                  const _isText = (cell === 'name' || cell === 'state' || cell === 'label' || cell === 'info' || cell === 'textstack');

                  // Horizontal alignment
                  let _slotJustify = _edgeJustify;
                  if (cell === 'info') {
                    _slotJustify = 'flex-end';
                  } else if (_isText) {
                    _slotJustify = (b.minC === 1) ? 'flex-start' : ((b.maxC === gridCols) ? 'flex-end' : 'flex-start');
                  }

                  // Vertical alignment
                  let _slotAlign = _edgeAlign;
                  if (cell === 'name' || cell === 'textstack') {
                    _slotAlign = 'flex-end';
                  } else if (cell === 'state' || cell === 'label' || cell === 'info') {
                    _slotAlign = 'flex-start';
                  }

// Padding inside each slot. Keep this stable so element offsets don't "drift" when the card resizes.
                  // Users can control outer spacing via border/padding settings; slot padding should remain predictable.
                  const _padCfg = Number.isFinite(this._config.grid_cell_padding_px)
                    ? Number(this._config.grid_cell_padding_px)
                    : 6;

                  // Adaptive padding: keep small cells usable (e.g. 5x5 grids) so content doesn't get clipped.
                  // Cap padding to a fraction of a single cell size when we know the stage dimensions.
                  let _padPx = _padCfg;
                  if (_stageW > 0 && _stageH > 0) {
                    const _cellW = _stageW / gridCols;
                    const _cellH = _stageH / gridRows;
                    const _cap = Math.max(2, Math.floor(Math.min(_cellW, _cellH) * 0.12));
                    _padPx = Math.max(2, Math.min(_padCfg, _cap));
                  }

                  // Info should flush to the right edge of its slot.
                  const _isInfo = cell === 'info';

                  const _innerStyle = _isInfo
                    ? `width:100%; height:100%; display:flex; justify-content:flex-end; align-items:${_slotAlign}; max-width:100%; max-height:100%;`
                    : 'max-width:100%; max-height:100%;';

                  placed.push(html`
                    <div class="stage-item stage-${cell}" style="
                      left: ${leftVal};
                      top: ${topVal};
                      width: ${widthVal};
                      height: ${heightVal};
                      display: flex;
                      justify-content: ${_slotJustify};
                      align-items: ${_slotAlign};
                      box-sizing: border-box;
                      padding: ${_padPx}px;
                    ">
                      <div class="stage-inner" style="${_innerStyle}">
                        ${elementHtml}
                      </div>
                    </div>
                  `);
                }

                return html`
                  <div class="layout-stage-container">
                    ${placed}
                  </div>
                `;
                })()
                : (() => {
                const order = (this._config.element_order || ['icon', 'name', 'label', 'state']).filter(el => el !== 'info');
                
                // Render elements in configured order with proper structure
                // Text elements need to be wrapped in tile-content-wrapper, but icon should be standalone
                const renderedElements = [];
                let textElements = [];
                
                order.forEach(el => {
                  if (el === 'icon') {
                    // If we have accumulated text elements, wrap them
                    if (textElements.length > 0) {
                      renderedElements.push(html`<div class="tile-content-wrapper">${textElements}</div>`);
                      textElements = [];
                    }
                    // Add icon directly
                    renderedElements.push(elements.icon?.());
                  } else {
                    // Accumulate text elements
                    const elementHtml = elements[el]?.();
                    if (elementHtml) {
                      textElements.push(elementHtml);
                    }
                  }
                });
                
                // Wrap any remaining text elements
                if (textElements.length > 0) {
                  renderedElements.push(html`<div class="tile-content-wrapper">${textElements}</div>`);
                }

                return html`${renderedElements}`;
                })();
            })()}
        </ha-card>
      `;
    }

    static get styles() {
      return css`
        :host { display: block; }
        
        ha-card { 
            transition: all 0.3s ease; 
            overflow: hidden; 
            padding: 12px; 
            box-sizing: border-box; 
            cursor: pointer; 
            position: relative;
            display: flex; 
            flex-direction: column; 
            -webkit-touch-callout: none;
            justify-content: space-between;
            isolation: isolate; 
            z-index: 0;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        /* --- LAYOUTS --- */
        
        /* Rectangular: Default flex column behavior */
        
        /* Square: Force aspect ratio */
        .hki-tile.layout-square { 
            aspect-ratio: 1 / 1; 
            height: auto;
        }

        /* Tile: Row Layout (Icon Left, Text Right) */
        .hki-tile.layout-tile {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 16px;
            min-height: 72px; /* Standard HA Tile height */
        }
        .hki-tile.layout-tile .tile-header {
            width: auto;
            flex-shrink: 0;
        }
        .hki-tile.layout-tile .tile-content-wrapper {
            flex: 1;
            align-items: flex-start;
            text-align: left;
            justify-content: center;
        }
        .hki-tile.layout-tile .brightness-tag, .info-tag {
            position: static;
            transform: none;
            margin-left: 0;
        }

        /* Badge: Compact Horizontal Layout (Like HA Badge) */
        .hki-ha-badge {
          cursor: pointer;
        }

        ha-card.hki-tile { height: 100%; min-height: 0; position: relative; }
        .hki-tile.is-unavailable::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--hki-unavailable-bg, transparent);
          opacity: var(--hki-unavailable-opacity, 0.5);
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
        }
        .hki-tile.is-unavailable > * {
          position: relative;
          z-index: 1;
        }
        /* Fixed square layout (button-card grid-template-areas) */
        .hki-square-grid {
          position: relative;
          display: grid;
          grid-template-areas:
            "i i"
            "area area"
            "n n"
            "l l"
            "s s";
          /* Intentionally matches custom:button-card behavior:
             only one explicit column size -> remaining column becomes auto */
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr min-content min-content min-content;
          width: 100%;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
          padding: 0;
          align-items: stretch;
          justify-items: stretch;
        }

        /* Icon is positioned like button-card (top/left in %) so it scales with the card,
           while text stays stable via fixed paddings. */
        .hki-square-grid .sq-icon {
          grid-area: i;
          position: absolute;
          top: 7%;
          left: 7%;
          display: inline-flex;
          align-items: flex-start;
          justify-content: flex-start;
          z-index: 1;
          pointer-events: none; /* click handled by card; keep icon purely visual */
        }
        .hki-square-grid .sq-icon * { pointer-events: none; }

        .hki-square-grid .sq-temp-badge {
          position: absolute;
          top: 7%;
          right: 7%;
          z-index: 2;
          pointer-events: none;
        }
        .hki-square-grid .sq-temp-badge         .hki-square-grid .sq-area { grid-area: area; }

        .hki-square-grid .sq-name {
          grid-area: n;
          justify-self: start;
          align-self: end;
          padding: 0 10px;
          min-width: 0;
        
          text-align: left;
          /* Keep name on one line, but don't clip it out when offsets push it */
          white-space: nowrap;
          overflow-wrap: normal !important;
          word-break: keep-all;
          overflow: visible;
          text-overflow: clip;
        }

        /* The actual name text is rendered inside a nested .name element.
           Force the nested element to inherit the single-line behavior so it
           never wraps when the card is resized. */
        .hki-square-grid .sq-name .name {
          white-space: nowrap !important;
          overflow: visible;
          text-overflow: clip;
          display: block;
          min-width: 0;
          overflow-wrap: normal !important;
          word-break: keep-all;
        }


        .hki-square-grid .sq-label {
          grid-area: l;
          justify-self: start;
          align-self: start;
          padding: 0 10px;
          min-width: 0;
          text-align: left;
          overflow: visible;
          white-space: normal;
          text-overflow: clip;
        }


        .hki-square-grid .sq-state-row {
  grid-area: s;

  /* Full-width row with stable padding; keep state (left) + info (right) locked together */
  justify-self: stretch;
  align-self: start;
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: row;
  justify-content: flex-start; /* info is pushed via margin-left:auto */
  align-items: baseline;
  gap: 10px;

  padding: 0 10px;
  box-sizing: border-box;

  overflow: visible;
}


.hki-square-grid .sq-state {
  flex: 1 1 auto;
  min-width: 0;

  /* Text should not be clipped; allow overflow */
  overflow: visible;
  text-overflow: unset;
  white-space: normal;

  text-align: left;
}

/* Ensure legacy shared classes don't re-enable ellipsis inside square layout */
.hki-square-grid .name,
.hki-square-grid .state,
.hki-square-grid .label {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}


.hki-square-grid .sq-info {
  flex: 0 0 auto;
  margin-left: auto;

  text-align: right;
  white-space: nowrap;
  min-width: 0;

  overflow: visible;
}



        /* Square fixed layout: info display must participate in the state row (no absolute positioning) */
        .hki-square-grid .brightness-tag,
        .hki-square-grid .info-tag {
          position: static !important;
          top: auto !important;
          right: auto !important;
          bottom: auto !important;
          left: auto !important;
          margin: 0 !important;
          width: auto !important;
          max-width: none !important;
          overflow: visible !important;
          text-overflow: unset !important;
          white-space: nowrap !important;
          display: inline-flex;
          align-items: baseline;
        }
        .hki-ha-badge__wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
        }

        .hki-ha-badge__wrap.pill {
          /* Prevent pill background bleeding around the icon circle */
          overflow: hidden;
          gap: 0;
          height: var(--hki-badge-pill-height, auto);
          border-radius: calc(var(--hki-badge-pill-height, 0px) / 2);
        }
        .hki-ha-badge__wrap.pill .hki-ha-badge__text {
          margin-left: 2px;
          margin-right: 2px;
        }


        .hki-ha-badge__wrap.is-unavailable,
        .hki-ha-badge__circle.is-unavailable {
          position: relative;
        }
        .hki-ha-badge__wrap.is-unavailable::before,
        .hki-ha-badge__circle.is-unavailable::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--hki-badge-bg, transparent);
          opacity: var(--hki-badge-opacity, 0.5);
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
        }
        .hki-ha-badge__wrap.is-unavailable > *,
        .hki-ha-badge__circle.is-unavailable > * {
          position: relative;
          z-index: 1;
        }
        .hki-ha-badge__circle {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex: 0 0 auto;
          margin: 0;
          box-sizing: border-box;
        }
        .hki-ha-badge__text {
          display: flex;
          flex-direction: column;
          line-height: 1.0;
          padding-right: 2px;
        }
        .hki-ha-badge__name {
          font-size: 12px;
          font-weight: 500;
        }
        .hki-ha-badge__state {
          font-size: 11px;
          opacity: 0.8;
        }
.hki-tile.layout-badge {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            /* More compact like HA badges */
            gap: 6px;
            min-height: 35px;
            height: auto;
            padding: 6px 8px;

            /* Do not stretch full-width in headers */
            width: fit-content;
            max-width: 100%;
            flex: 0 0 auto;

            border-radius: 999px;
            overflow: hidden;
        }

        .hki-tile.layout-badge .tile-header {
            width: auto;
            flex-shrink: 0;
        }
        .hki-tile.layout-badge .icon-circle {
            width: var(--hki-icon-circle-size) !important;
            height: var(--hki-icon-circle-size) !important;
            padding: 0;
        }


        /* HKI Tile layout: wide pill */
        .hki-tile.layout-hki-tile {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 999px;
            min-height: 72px;
            width: 100%;
            box-sizing: border-box;
            position: relative; /* For stacking context */
            pointer-events: auto; /* allow whole tile to be clickable */
        }
        
        /* Re-enable pointer events on interactive elements */
        .hki-tile.layout-hki-tile .hki-icon-circle {
            pointer-events: auto;
            flex: 0 0 auto;
        }
        
        .hki-tile.layout-hki-tile .hki-tile-text {
            pointer-events: auto;
        }
        
        /* Info display positioned in top-right corner */
        .hki-tile.layout-hki-tile .tile-info-corner {
            position: absolute;
            top: 8px;
            right: 12px;
            pointer-events: none; /* Don't block slider */
            z-index: 1; /* Above content (but keep card stacking sane) */
            font-weight: 500;
            opacity: 0.9;
        }
        
        /* Allow slider to fill full width on tile layout */
        ha-card.layout-hki-tile {
            position: relative; /* anchor slider overlay stacking */
            overflow: hidden; /* Keep overflow hidden to clip slider to card shape */
        }
        .hki-tile.layout-hki-tile .hki-tile-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 0;
        }

        .hki-tile.layout-hki-tile .tile-info{
            margin-left: 0;
            flex: 0 0 auto;
            align-self: flex-start;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .hki-tile.layout-hki-tile .label{
            line-height: 1.1;
        }
        .hki-tile.layout-hki-tile .name,
        .hki-tile.layout-hki-tile .state {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            line-height: 1.1;
        }

        /* Brightness Slider Overlay */
        .hki-brightness-slider-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            overflow: hidden;
            border-radius: inherit;
            pointer-events: none; /* purely visual; hitbox is the input */
            z-index: 1; /* above card background */
        }

        /* Visual fill overlay (full-card) */
        .hki-brightness-slider-visual {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background: linear-gradient(
                to right,
                var(--slider-fill-color, rgba(255, 255, 255, 0.8)) 0%,
                var(--slider-fill-color, rgba(255, 255, 255, 0.8)) var(--slider-progress, 50%),
                var(--slider-track-color, rgba(255, 255, 255, 0.2)) var(--slider-progress, 50%),
                var(--slider-track-color, rgba(255, 255, 255, 0.2)) 100%
            );
        }

        /* Invisible interaction layer (bottom strip) */
        .hki-brightness-slider-input {
            -webkit-appearance: none;
            appearance: none;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 28px; /* interaction area */
            background: transparent;
            outline: none;
            margin: 0;
            padding: 0;
            cursor: pointer;
            pointer-events: auto; /* this is what makes it draggable */
        
            z-index: 2;
            touch-action: none;
        }

        /* Keep the native track/thumb invisible */
        .hki-brightness-slider-input::-webkit-slider-runnable-track {
            width: 100%;
            height: 100%;
            background: transparent;
        }

        .hki-brightness-slider-input::-moz-range-track {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
        }

        .hki-brightness-slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 0;
            height: 0;
            background: transparent;
        }

        .hki-brightness-slider-input::-moz-range-thumb {
            width: 0;
            height: 0;
            background: transparent;
            border: none;
        }

        /* Ensure HKI Tile slider fill never washes out the icon/circle/badges */
.hki-tile.layout-hki-tile .tile-header,
.hki-tile.layout-hki-tile .icon-circle,
.hki-tile.layout-hki-tile .hki-tile-text {
    position: relative;
    z-index: 3;
}
/* Keep info display in the corner and above the slider fill */
.hki-tile.layout-hki-tile .tile-info-corner {
    position: absolute;
    z-index: 4;
}
/* Badges must remain absolutely positioned (don't let them shift the icon) */
.hki-tile.layout-hki-tile .badge,
.hki-tile.layout-hki-tile .climate-corner-badge {
    position: absolute;
    z-index: 4;
}

/* Match HKI default badge placement (tile needs a small nudge) */
.hki-tile.layout-hki-tile .icon-circle .badge {
    top: -5px !important;
    right: -5px !important;
}
/* Badge Circular: Fully round badge with icon only */
        .hki-tile.layout-badge.badge-circle {
            aspect-ratio: 1 / 1;
            width: auto;
            min-width: 40px;
            min-height: 40px;
            padding: 8px;
            justify-content: center;
        }
        .hki-tile.layout-badge.badge-circle .name,
        .hki-tile.layout-badge.badge-circle .state,
        .hki-tile.layout-badge.badge-circle .label,
        .hki-tile.layout-badge.badge-circle .brightness-tag,
        .hki-tile.layout-badge.badge-circle .info-tag {
            display: none;
        }
        
        /* Circle: Fully Round Button with Centered Content */
        .hki-tile.layout-circle {
            aspect-ratio: 1 / 1;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 100px;
        }
        .hki-tile.layout-circle .tile-content-wrapper {
            align-items: center;
            text-align: center;
        }
        .hki-tile.layout-circle .icon-circle {
            margin: 0;
        }
/* Hide badge counter when card is used in header badges section */
        :host([role="button"]) ha-card::after,
        :host(:not([role])) ha-card::after {
            content: none !important;
            display: none !important;
        }
        .hki-tile.layout-badge .icon-circle ha-icon,
        .hki-tile.layout-badge .icon-circle ha-state-icon {
            --mdc-icon-size: var(--hki-icon-size) !important;
        }
        .hki-tile.layout-badge .tile-content-wrapper {
            flex: 1;
            align-items: flex-start;
            justify-content: center;
            gap: 2px;
        }
        .hki-tile.layout-badge .name {
            font-size: 14px;
            line-height: 1.2;
        }
        .hki-tile.layout-badge .state {
            font-size: 12px;
            line-height: 1.2;
        }
        .hki-tile.layout-badge .label {
            display: none; /* Hide label in badge mode */
        }
        .hki-tile.layout-badge .brightness-tag,
        .hki-tile.layout-badge .info-tag {
            position: static;
            transform: none;
            font-size: 12px;
            margin-left: auto;
        }
        .hki-tile.layout-badge:not(.badge-circle) .badge,
        .hki-tile.layout-badge .climate-corner-badge {
            display: none; /* Hide badges in badge layout (except circular badges) */
        }

        /* --- ELEMENTS --- */

        .tile-header { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; z-index: 1; }
        
        .icon-circle {
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            position: relative;
            transition: transform 0.2s;
            cursor: pointer;
            box-sizing: border-box;
        }
        .icon-circle:active { transform: scale(0.9); }

        .badge {
            position: absolute; top: -2px; right: -2px;
            color: white; border-radius: 50%;
            min-width: 16px; padding: 0 3px; height: 16px;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold;
            z-index: 2;
            box-sizing: border-box;
            pointer-events: none;
            flex-shrink: 0;
        }
        .badge.climate-corner-badge {
            /* Align with the icon row (same vertical level as the icon) */
            top: 7%;
            right: 7%;
        }

        .brightness-tag { 
            position: absolute; 
            bottom: 12px; 
            right: 12px; 
            font-weight: 500; 
            opacity: 0.9;
            z-index: 2;
        }
        
        /* When brightness-tag is in tile-content-wrapper, use normal flow positioning */
        .tile-content-wrapper .brightness-tag,
        .tile-content-wrapper .info-tag {
            position: static;
            bottom: auto;
            right: auto;
            width: 100%;
        }
        
        /* When badge or info is in grid, remove absolute positioning */
        .grid-cell .climate-corner-badge,
        .grid-cell .brightness-tag,
        .grid-cell .info-tag {
            position: static !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            left: auto !important;
            width: auto;
            margin: 0;
        }
        
        .tile-content-wrapper { display: flex; flex-direction: column; gap: 2px; z-index: 1; width: 100%; }
        
        /* Grid layout container (single grid so elements stay anchored on resize) */
        

        /* Stage-based placement (button-card-like): absolute elements anchored to the tile box */
        .layout-stage-container {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 0;
        }
        .stage-item {
            position: absolute;
            box-sizing: border-box;
            /* Keep icons/text from being clipped; text overflow is handled on text nodes */
            overflow: visible;
        }
        /* Text nodes: allow wrapping or truncation via existing HKI settings; default to no overflow bleed */
        .stage-item .name,
        .stage-item .state,
        .stage-item .label,
        .stage-item .info-tag {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

.layout-grid-container {
            display: grid;
            gap: 12px;
            align-items: stretch;
          justify-items: stretch;
            width: 100%;
            height: 100%;
                    align-content: stretch;
            min-height: 0;
        }


/* Absolute positioning grid mode (grid_position_mode: "absolute") */
.layout-abs-container {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.layout-abs-container .abs-cell {
    position: absolute;
    display: flex;
    box-sizing: border-box;
    pointer-events: none;
}
.layout-abs-container .abs-cell > * {
    pointer-events: auto;
}


        /* Grid layout rows - 3 column grid */
        .layout-grid-row {
            display: grid;
            gap: 12px;
            align-items: center;
            width: 100%;
        }
        
        /* Grid cell styling */
        .grid-cell {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        /* Center non-text elements in grid cells */
        .grid-cell:has(.badge),
        .grid-cell:has(.climate-corner-badge),
        .grid-cell:has(.tile-header) {
            align-items: center;
        }
        
        /* Text elements in grid cells take full width */
        .grid-cell .name,
        .grid-cell .state,
        .grid-cell .label,
        .grid-cell .brightness-tag,
        .grid-cell .info-tag {
            width: 100%;
        }
.name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .state { opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .label { opacity: 0.7; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Animations */
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.5; transform: scale(0.9); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-6px);} 60% {transform: translateY(-3px);} }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
        @keyframes swing { 20% { transform: rotate(15deg); } 40% { transform: rotate(-10deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-5deg); } 100% { transform: rotate(0deg); } }
        @keyframes tada { 0%, 100% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.9) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); } }
        @keyframes wobble { 0%, 100% { transform: translateX(0%); } 15% { transform: translateX(-6px) rotate(-5deg); } 30% { transform: translateX(5px) rotate(3deg); } 45% { transform: translateX(-5px) rotate(-3deg); } 60% { transform: translateX(4px) rotate(2deg); } 75% { transform: translateX(-3px) rotate(-1deg); } }
        @keyframes flip { 0% { transform: perspective(400px) rotateY(0); } 40% { transform: perspective(400px) rotateY(-180deg); } 100% { transform: perspective(400px) rotateY(-360deg); } }
        
        .animate-spin { animation: spin 2s linear infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-shake { animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite; }
        .animate-swing { animation: swing 1s ease-in-out infinite; }
        .animate-tada { animation: tada 1.5s ease-in-out infinite; }
        .animate-wobble { animation: wobble 1s ease-in-out infinite; }
        .animate-flip { animation: flip 2s ease-in-out infinite; }
      
        /* HA Badge mimic layout */
        .hki-ha-badge__wrap {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          line-height: 1;
        }

        .hki-ha-badge__wrap.pill {
          height: 36px;
          /* Make the icon circle flush with the pill edge (closer to HA default). */
          padding: 0 10px 0 0;
          box-sizing: border-box;
        }

        .hki-ha-badge__wrap.icon-only {
          height: 36px;
          padding: 0;
          box-sizing: border-box;
        }

        .hki-ha-badge__circle {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          box-sizing: border-box;
        }

        .hki-ha-badge__iconwrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          line-height: 0;
        }

        .hki-ha-badge__icon {
          display: block;
        }

        .hki-ha-badge__text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1px;
          padding-right: 2px;
          white-space: nowrap;
        }

        .hki-ha-badge__name {
          font-size: 12px;
          font-weight: 600;
          line-height: 1.1;
        }

        .hki-ha-badge__state {
          font-size: 12px;
          opacity: 0.85;
          line-height: 1.1;
        }


      mwc-button.reset-defaults {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color, #fff);

        /* Filled button (covers different mwc versions) */
        --mdc-button-raised-button-color: var(--primary-color);
        --mdc-button-raised-ink-color: var(--text-primary-color, #fff);
        --mdc-button-unelevated-fill-color: var(--primary-color);
        --mdc-button-unelevated-ink-color: var(--text-primary-color, #fff);
        --mdc-protected-button-container-color: var(--primary-color);
        --mdc-protected-button-label-text-color: var(--text-primary-color, #fff);

        /* Ripple */
        --mdc-ripple-color: rgba(255,255,255,0.6);

        min-height: 34px;
      }

`;
    }
  }

  /* --- ENHANCED VISUAL EDITOR WITH ACCORDIONS --- */

  class HkiButtonCardEditor extends LitElement {

    // Baseline defaults for offset editors (UI shows values relative to these).
    static OFFSET_DEFAULTS = {
      name_offset_x: -10,
      state_offset_x: -10,
      label_offset_x: -10,
      icon_offset_x: -10,
      brightness_offset_x: 10,
      temp_badge_offset_x: 10,
      brightness_offset_y: 10,
      temp_badge_offset_y: -10,
      icon_offset_y: -4,
      label_offset_y: 11,
      state_offset_y: 10,
      name_offset_y: 17,
    };
    static TILE_OFFSET_DEFAULTS = {
      name_offset_x: 44,
      name_offset_y: -18,
      state_offset_x: 44,
      state_offset_y: -15,
      label_offset_x: 0,
      label_offset_y: 0,
      icon_offset_x: -17,
      icon_offset_y: 13,
      icon_badge_offset_x: 0,
      icon_badge_offset_y: 0,
      brightness_offset_x: 21,
      brightness_offset_y: 43,
      temp_badge_offset_x: 0,
      temp_badge_offset_y: 0,
    }
    static GOOGLE_OFFSET_DEFAULTS = {
      name_offset_x: 0,
      name_offset_y: -6,
      state_offset_x: 0,
      state_offset_y: -8,
      label_offset_x: 0,
      label_offset_y: -6,
      icon_offset_x: -10,
      icon_offset_y: -1,
      icon_badge_offset_x: 0,
      icon_badge_offset_y: 0,
      brightness_offset_x: 0,
      brightness_offset_y: 0,
      temp_badge_offset_x: 0,
      temp_badge_offset_y: 0,
    };

;


    _getOffsetUiValue(field) {
      const __layout = (this._config?.card_layout || 'square');
      // Badge uses raw offsets (baseline 0). Tile uses its own baseline.
      if (__layout === 'badge') return (this._config?.[field] ?? 0);
      const dict = (__layout === 'hki_tile') ? HkiButtonCardEditor.TILE_OFFSET_DEFAULTS : ((__layout === 'google_default') ? HkiButtonCardEditor.GOOGLE_OFFSET_DEFAULTS : HkiButtonCardEditor.OFFSET_DEFAULTS);
      const base = dict[field];
      if (base === undefined) return (this._config?.[field] ?? 0);
      const actual = (this._config?.[field] ?? base);
      return Number.isFinite(actual) ? (actual - base) : 0;
    }

    _applyOffsetUiValue(field, uiValue) {
      const __layout = (this._config?.card_layout || 'square');
      // Badge uses raw offsets (baseline 0). Tile uses its own baseline.
      if (__layout === 'badge') {
        const actual = Number(uiValue);
        return Number.isFinite(actual) ? actual : 0;
      }
      const dict = (__layout === 'hki_tile') ? HkiButtonCardEditor.TILE_OFFSET_DEFAULTS : ((__layout === 'google_default') ? HkiButtonCardEditor.GOOGLE_OFFSET_DEFAULTS : HkiButtonCardEditor.OFFSET_DEFAULTS);
      const base = dict[field];
      if (base === undefined) return uiValue;
      const n = Number(uiValue);
      return (Number.isFinite(n) ? (base + n) : base);
    }

    static get properties() { return { hass: {}, lovelace: {}, _config: { state: true }, _closedDetails: { state: true } }; }
    
    constructor() {
      super();
      this._paDomainCache = {};

      this._closedDetails = {
        // keep the first (non-accordion) block open automatically
    
        // accordions: collapsed by default
        climate: true,
        humidifier: true,
        lock: true,
        layout_order: true,
        typography: true,
        visibility: true,
        card_styling: true,
        icon_settings: true,
    
        popup: true,
    
        actions: true,
        action_tap: true,
        action_double_tap: true,
        action_hold: true,
        action_icon_tap: true,
        action_icon_hold: true,
        action_icon_double_tap: true,
    
        offsets: true,
      };
    }


    
    _cardObjToYaml(obj, indent = 0) {
      if (obj == null) return '';
      const pad = '  '.repeat(indent);
      if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
      if (typeof obj === 'string') {
        const s = obj;

        // Multiline strings -> YAML block scalar (preserves formatting/templates)
        if (s.includes('\n')) {
          const indentStr = '  '.repeat(indent + 1);
          const lines = s.split('\n').map(line => `${indentStr}${line}`).join('\n');
          return `|-\n${lines}`;
        }

        // Only quote when truly needed - NOT just because string contains ':'
        // mdi:power, custom:card, scene.entity are all valid unquoted YAML values
        if (s === '' || ['true','false','null','yes','no','on','off'].includes(s.toLowerCase()) ||
            (!isNaN(Number(s)) && s.trim() !== '') ||
            /^[\{\[\*&!|>'"@`]/.test(s) || / #/.test(s) || /^\s|\s$/.test(s)) {
          return `"${s.replace(/\\/g,'\\\\').replace(/"/g,'\\\"')}"`;
        }
        return s;
      }

if (Array.isArray(obj)) {
        return obj.map(item => {
          if (item && typeof item === 'object') {
            // Render object entries; first entry goes inline with "- ", rest align to same column
            const entries = Object.entries(item);
            if (entries.length === 0) return `${pad}-`;
            const [firstKey, firstVal] = entries[0];
            const firstValStr = (firstVal && typeof firstVal === 'object')
              ? `\n${this._cardObjToYaml(firstVal, indent + 2)}`
              : ` ${this._cardObjToYaml(firstVal, indent + 1)}`;
            const rest = entries.slice(1).map(([k, v]) => {
              const valStr = (v && typeof v === 'object')
                ? `\n${this._cardObjToYaml(v, indent + 2)}`
                : ` ${this._cardObjToYaml(v, indent + 1)}`;
              return `${'  '.repeat(indent + 1)}${k}:${valStr}`;
            });
            return [`${pad}- ${firstKey}:${firstValStr}`, ...rest].join('\n');
          }
          return `${pad}- ${this._cardObjToYaml(item, indent)}`;
        }).join('\n');
      }
      if (typeof obj === 'object') {
        return Object.entries(obj).map(([k, v]) => {
          if (v && typeof v === 'object') {
            return `${pad}${k}:\n${this._cardObjToYaml(v, indent + 1)}`;
          }
          const rendered = this._cardObjToYaml(v, indent);
          return `${pad}${k}: ${rendered}`;
        }).join('\n');
      }
      return String(obj);
    }

    _yamlStrToObj(str) {
      if (!str || !str.trim()) return null;
      try {
        const lines = str.split('\n');
        const [obj] = this._parseYamlBlock(lines, 0, 0);
        return (obj && typeof obj === 'object') ? obj : null;
      } catch(e) { return null; }
    }

    _parseYamlValue(raw) {
      const s = raw.trim();
      if (s === 'true' || s === 'yes') return true;
      if (s === 'false' || s === 'no') return false;
      if (s === 'null' || s === '~' || s === '') return null;
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
        return s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');
      const n = Number(s);
      if (!isNaN(n) && s !== '') return n;
      return s;
    }

    _parseYamlBlockScalar(lines, startIdx, parentIndent, style) {
      // Minimal YAML block scalar support for "|" (literal) and ">" (folded)
      // Returns [stringValue, nextIdx]
      let idx = startIdx;

      // Find indentation level of the scalar content (first non-empty line)
      let contentIndent = null;
      while (idx < lines.length) {
        const line = lines[idx];
        if (line.trimEnd() === '') { idx++; continue; }
        const indent = line.length - line.trimStart().length;
        if (indent <= parentIndent) {
          // no content (or scalar ended immediately)
          return ['', idx];
        }
        contentIndent = indent;
        break;
      }
      if (contentIndent === null) return ['', idx];

      const outLines = [];
      while (idx < lines.length) {
        const line = lines[idx];
        const trimmedEnd = line.trimEnd();
        if (trimmedEnd === '') {
          outLines.push('');
          idx++;
          continue;
        }
        const indent = line.length - line.trimStart().length;
        if (indent <= parentIndent) break; // scalar ended
        // Strip the content indentation (or as much as available)
        outLines.push(line.slice(Math.min(contentIndent, line.length)));
        idx++;
      }

      if (style === '>') {
        // Fold: turn single newlines into spaces, keep paragraph breaks
        const paragraphs = [];
        let current = [];
        for (const l of outLines) {
          if (l === '') {
            if (current.length) {
              paragraphs.push(current.join(' ').trimEnd());
              current = [];
            }
            // keep empty line as paragraph separator
            paragraphs.push('');
          } else {
            current.push(l.trimEnd());
          }
        }
        if (current.length) paragraphs.push(current.join(' ').trimEnd());

        // Rebuild, preserving blank lines
        let folded = '';
        for (let p = 0; p < paragraphs.length; p++) {
          const part = paragraphs[p];
          if (part === '') {
            // avoid trailing extra blank lines
            if (!folded.endsWith('\n') && folded !== '') folded += '\n';
            folded += '\n';
          } else {
            if (folded !== '' && !folded.endsWith('\n\n')) folded += '\n';
            folded += part;
          }
        }
        return [folded.replace(/\n\n\n+/g, '\n\n'), idx];
      }

      // Literal
      return [outLines.join('\n'), idx];
    }


    _parseYamlBlock(lines, startIdx, baseIndent) {
      // Returns [result, nextIdx]
      // Detect if this block is an array or object by looking at first non-empty line
      let idx = startIdx;
      let result = null;

      while (idx < lines.length) {
        const line = lines[idx];
        const trimmed = line.trimEnd();
        if (trimmed === '' || trimmed.trimStart().startsWith('#')) { idx++; continue; }
        const indent = trimmed.length - trimmed.trimStart().length;
        if (indent < baseIndent) break; // dedented — end of block

        const content = trimmed.trimStart();

        if (content.startsWith('- ') || content === '-') {
          // Array
          if (!Array.isArray(result)) result = [];
          const itemContent = content.startsWith('- ') ? content.slice(2).trimStart() : '';

          if (itemContent === '') {
            // Next lines form the item
            idx++;
            const [val, nextIdx] = this._parseYamlBlock(lines, idx, indent + 2);
            result.push(val);
            idx = nextIdx;
          } else if (itemContent.includes(': ') || itemContent.endsWith(':')) {
            // Inline object start: "- key: value" or "- key:"
            const obj = {};
            const colonIdx = itemContent.indexOf(': ');
            const colonEnd = itemContent.endsWith(':');
            const key = colonEnd ? itemContent.slice(0, -1) : itemContent.slice(0, colonIdx);
            const valStr = colonEnd ? '' : itemContent.slice(colonIdx + 2);
            idx++;
            if (valStr === '' || colonEnd) {
              const [val, nextIdx] = this._parseYamlBlock(lines, idx, indent + 2);
              obj[key] = val;
              idx = nextIdx;
            } else {
              if (valStr === '|' || valStr.startsWith('|') || valStr === '>' || valStr.startsWith('>')) {
                const style = valStr.trim().startsWith('>') ? '>' : '|';
                const [val, ni] = this._parseYamlBlockScalar(lines, idx, indent, style);
                obj[key] = val;
                idx = ni;
              } else {
                obj[key] = this._parseYamlValue(valStr);
              }
            }
            // Continue reading sibling keys at indent+2
            while (idx < lines.length) {
              const sibLine = lines[idx].trimEnd();
              if (sibLine === '' || sibLine.trimStart().startsWith('#')) { idx++; continue; }
              const sibIndent = sibLine.length - sibLine.trimStart().length;
              if (sibIndent !== indent + 2) break;
              const sibContent = sibLine.trimStart();
              if (sibContent.startsWith('- ') || sibContent === '-') break; // next array item
              const ci = sibContent.indexOf(': ');
              const ce = sibContent.endsWith(':');
              if (ci === -1 && !ce) break;
              const sk = ce ? sibContent.slice(0,-1) : sibContent.slice(0, ci);
              const sv = ce ? '' : sibContent.slice(ci + 2);
              idx++;
              if (sv === '' || ce) {
                const [val, nextIdx] = this._parseYamlBlock(lines, idx, sibIndent + 2);
                obj[sk] = val;
                idx = nextIdx;
              } else {
                if (sv === '|' || sv.startsWith('|') || sv === '>' || sv.startsWith('>')) {
                const style = sv.trim().startsWith('>') ? '>' : '|';
                const [val, ni] = this._parseYamlBlockScalar(lines, idx, sibIndent, style);
                obj[sk] = val;
                idx = ni;
              } else {
                obj[sk] = this._parseYamlValue(sv);
              }
              }
            }
            result.push(obj);
          } else {
            result.push(this._parseYamlValue(itemContent));
            idx++;
          }
        } else if (content.includes(': ') || content.endsWith(':')) {
          // Object
          if (!result || Array.isArray(result)) result = {};
          const ci = content.indexOf(': ');
          const ce = content.endsWith(':');
          const key = ce ? content.slice(0,-1) : content.slice(0, ci);
          const valStr = ce ? '' : content.slice(ci + 2);
          idx++;
          if (valStr === '' || ce) {
            // Check if next line is more indented (nested block) or same (empty value)
            let nextIdx2 = idx;
            while (nextIdx2 < lines.length && lines[nextIdx2].trim() === '') nextIdx2++;
            const nextLine = lines[nextIdx2];
            if (nextLine !== undefined) {
              const nextIndent = nextLine.length - nextLine.trimStart().length;
              if (nextIndent > indent) {
                const [val, ni] = this._parseYamlBlock(lines, idx, nextIndent);
                result[key] = val;
                idx = ni;
              } else {
                result[key] = null;
              }
            } else {
              result[key] = null;
            }
          } else {
            if (valStr === '|' || valStr.startsWith('|') || valStr === '>' || valStr.startsWith('>')) {
              const style = valStr.trim().startsWith('>') ? '>' : '|';
              const [val, ni] = this._parseYamlBlockScalar(lines, idx, indent, style);
              result[key] = val;
              idx = ni;
            } else {
              result[key] = this._parseYamlValue(valStr);
            }
          }
        } else {
          idx++;
        }
      }
      return [result, idx];
    }

    _defaultFontWeight(prefix) {
      if (prefix === "name") return "bold";
      if (prefix === "state") return "bold";
      if (prefix === "brightness") return "bold";
      return "normal";
    }


setConfig(config) {
      const flat = HkiButtonCard._migrateFlatConfig(config) || {};
      this._config = flat;
      // If the user is not actively editing the YAML, drop the draft so the editor shows the
      // serialized value from config again. While focused, keep the draft to avoid cursor jumps.
      if (!this._customPopupYamlFocused) {
        this._customPopupYamlDraft = null;
      }
      // NOTE: Do NOT fire config-changed here. Doing so causes an infinite crash loop when this
      // editor is embedded inside hui-card-element-editor (e.g. as a slot card in hki-header-card):
      // setConfig -> config-changed -> parent saves -> HA calls setConfig again -> repeat.
      // Migration/normalization is already handled by _fireChanged on every real user-driven change.
    }

disconnectedCallback() {
      super.disconnectedCallback?.();
      // hui-card-element-editor saves on every change, so no flush needed on disconnect.
    }
    
    shouldUpdate(changedProps) {
      // Always update if hass changed
      if (changedProps.has('hass')) {
        return true;
      }
      
      // Always update if _closedDetails changed (accordion state)
      if (changedProps.has('_closedDetails')) {
        return true;
      }
      
      // If _config didn't change, check other properties
      if (!changedProps.has('_config')) {
        return true;
      }
      
      // If _config changed, do a deep comparison to see if it's meaningful
      const oldConfig = changedProps.get('_config');
      const newConfig = this._config;
      
      // Simple comparison - if they're the same reference, no update needed
      if (oldConfig === newConfig) {
        return false;
      }
      
      // Deep comparison - stringify and compare
      // This prevents re-renders from object reference changes when content is identical
      try {
        return JSON.stringify(oldConfig) !== JSON.stringify(newConfig);
      } catch (e) {
        // If stringify fails, assume we need to update
        return true;
      }
    }
    
    render() {
      if (!this.hass || !this._config) return html``;
      this._ensureCardEditorLoaded();
      
      const fonts = ["system", "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway", "custom"];
      // Weights as Names
      const weights = ["lighter", "normal", "bold", "bolder"];
      const shapes = ["square", "google_default", "hki_tile", "badge"];
      const isBadgeLayout = (this._config.card_layout === 'badge');

      const isGoogleLayout = (this._config.card_layout === 'google_default');

      const borders = ["solid", "dashed", "dotted", "double", "none"];

      const selectedEntity = this.hass.states[this._config.entity];
      const isClimate = selectedEntity && selectedEntity.entity_id && selectedEntity.entity_id.split('.')[0] === 'climate';
      const isLock = selectedEntity && selectedEntity.entity_id && selectedEntity.entity_id.split('.')[0] === 'lock';
      const isHumidifier = selectedEntity && selectedEntity.entity_id && selectedEntity.entity_id.split('.')[0] === 'humidifier';

      // Custom Actions Dropdown List (Replaces Native Selector)
      const actionsList = [
        { value: "toggle", label: "Toggle" },
        { value: "hki-more-info", label: "More Info (HKI)" },
        { value: "more-info", label: "More Info (Native)" },
        { value: "navigate", label: "Navigate" },
        { value: "perform-action", label: "Perform Action" },
        { value: "url", label: "URL" },
        { value: "fire-dom-event", label: "Fire DOM Event" },
        { value: "none", label: "None" }
      ];

      const renderHeader = (title, key) => html`
        <div class="accordion-header" @click=${(e) => this._toggleHeader(e, key)}>
           <span>${title}</span>
           <ha-icon icon="${this._closedDetails[key] ? 'mdi:plus' : 'mdi:minus'}"></ha-icon>
        </div>
      `;

      // Helper to generate Font Inputs for a specific element (Name, State, Label)
      const renderFontSection = (prefix, label) => html`
        <div class="sub-section">
            <strong>${label} Typography</strong>
            <div class="side-by-side">
                <ha-select 
                  label="Family" 
                  .value=${this._config[`${prefix}_font_family`] || "system"} 
                  @selected=${(ev) => this._dropdownChanged(ev, `${prefix}_font_family`)} 
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                    ${fonts.map(f => html`<mwc-list-item .value=${f}>${f}</mwc-list-item>`)}
                </ha-select>
                <ha-select 
                  label="Weight" 
                  .value=${(this._config[`${prefix}_font_weight`] ?? this._defaultFontWeight(prefix))} 
                  @selected=${(ev) => this._dropdownChanged(ev, `${prefix}_font_weight`)} 
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                    ${weights.map(w => html`<mwc-list-item .value=${w}>${w.charAt(0).toUpperCase() + w.slice(1)}</mwc-list-item>`)}
                </ha-select>
            </div>
            ${this._config[`${prefix}_font_family`] === 'custom' ? html`
                <ha-textfield .label=${"Custom Font Name"} .value=${this._config[`${prefix}_font_custom`] || ""} @input=${(ev) => this._textChanged(ev, `${prefix}_font_custom`)}></ha-textfield>
            ` : ''}
            <ha-textfield label="Size (px)" type="number" .value=${this._config[`size_${prefix}`] || ""} @input=${(ev) => this._textChanged(ev, `size_${prefix}`)}></ha-textfield>
            <div class="tpl-field">
                <div class="tpl-title">Color (supports templates)</div>
                <ha-code-editor
                  .hass=${this.hass}
                  mode="yaml"
                  autocomplete-entities
                  autocomplete-icons
                  .autocompleteEntities=${true}
                  .autocompleteIcons=${true}
                  .label=${"Color"}
                  .value=${this._config[`${prefix}_color`] || ""}
                  @value-changed=${(ev) => {
                    ev.stopPropagation();
                    const value = ev.detail?.value;
                    const key = `${prefix}_color`;
                    if (value !== this._config[key]) {
                      this._fireChanged({ ...this._config, [key]: value || undefined });
                    }
                  }}
                  @click=${(e) => e.stopPropagation()}
                ></ha-code-editor>
            </div>
        </div>
      `;
      
      // Helper for Action Dropdowns with conditional fields
      const renderActionDropdown = (label, configKey) => {
          const currentAction = (this._config[configKey] && this._config[configKey].action) ? this._config[configKey].action : "none";
          const actionConfig = this._config[configKey] || {};
          
          return html`
            <div class="action-config-section">
              <strong>${label}</strong>
              <ha-select 
                label="Action Type" 
                .value=${currentAction} 
                @selected=${(ev) => this._actionChanged(ev, configKey)} 
                @closed=${(e) => e.stopPropagation()} 
                @click=${(e) => e.stopPropagation()}
              >
                  ${actionsList.map(a => html`<mwc-list-item .value=${a.value}>${a.label}</mwc-list-item>`)}
              </ha-select>
              
              ${currentAction === 'navigate' ? html`
                ${customElements.get("ha-navigation-picker") ? html`
                  <ha-navigation-picker
                    .hass=${this.hass}
                    .label=${"Navigation Path"}
                    .value=${actionConfig.navigation_path || ""}
                    @value-changed=${(ev) => this._actionFieldChanged(ev, configKey, 'navigation_path')}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-navigation-picker>
                ` : customElements.get("ha-selector") ? html`
                  <ha-selector
                    .hass=${this.hass}
                    .label=${"Navigation Path"}
                    .selector=${{ navigation: {} }}
                    .value=${actionConfig.navigation_path || ""}
                    @value-changed=${(ev) => this._actionFieldChanged(ev, configKey, 'navigation_path')}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-selector>
                ` : html`
                  <ha-textfield
                    label="Navigation Path"
                    .value=${actionConfig.navigation_path || ""}
                    @input=${(ev) => this._actionFieldChanged(ev, configKey, 'navigation_path')}
                    placeholder="/lovelace/0"
                  ></ha-textfield>
                `}
              ` : ''}


              ${currentAction === 'url' ? html`
                <ha-textfield 
                  label="URL Path" 
                  .value=${actionConfig.url_path || ""} 
                  @input=${(ev) => this._actionFieldChanged(ev, configKey, 'url_path')}
                  placeholder="https://example.com"
                ></ha-textfield>
              ` : ''}
              
              ${currentAction === "perform-action" ? html`
                <div class="perform-action-config">
                  ${customElements.get("ha-service-picker") ? html`
                    <ha-service-picker
                      .hass=${this.hass}
                      .label=${"Action (service)"}
                      .value=${actionConfig.perform_action || ""}
                      @value-changed=${(ev) => {
                        ev.stopPropagation();
                        const v = ev.detail?.value ?? ev.target?.value ?? "";
                        if (v !== actionConfig.perform_action) {
                          const updated = { ...actionConfig, action: "perform-action", perform_action: String(v || "") };
                          this._fireChanged({ ...this._config, [configKey]: updated });
                        }
                      }}
                      @click=${(e) => e.stopPropagation()}
                    ></ha-service-picker>
                  ` : html`
                    ${(() => {
                      const key = String(configKey || '');
                      const full = String(actionConfig.perform_action || "");
                      const derivedDomain = full.includes('.') ? full.split('.')[0] : '';
                      const cachedDomain = (this._paDomainCache && this._paDomainCache[key]) ? this._paDomainCache[key] : '';
                      const domain = cachedDomain || derivedDomain;
                      const derivedService = (full.includes('.') && derivedDomain === domain) ? (full.split('.')[1] || '') : '';
                      const domains = Object.keys(this.hass?.services || {}).sort();
                      const services = (domain && this.hass?.services?.[domain]) ? Object.keys(this.hass.services[domain]).sort() : [];
                      return html`
                        <div class="side-by-side">
                          <ha-select
                            label="Domain"
                            .value=${domain || ""}
                            @selected=${(e) => {
                              e.stopPropagation();
                              const nextDomain = e.target.value || '';
                              this._paDomainCache[key] = nextDomain;
                              const updated = { ...actionConfig, action: "perform-action", perform_action: "" };
                              this._fireChanged({ ...this._config, [configKey]: updated });
                              this.requestUpdate();
                            }}
                            @closed=${(e) => e.stopPropagation()}
                            @click=${(e) => e.stopPropagation()}
                          >
                            <mwc-list-item value=""></mwc-list-item>
                            ${domains.map((d) => html`<mwc-list-item .value=${d}>${d}</mwc-list-item>`)}
                          </ha-select>

                          <ha-select
                            label="Service"
                            .value=${derivedService || ""}
                            .disabled=${!domain}
                            @selected=${(e) => {
                              e.stopPropagation();
                              const service = e.target.value || '';
                              const d = (this._paDomainCache[key] || domain || '');
                              const next = (d && service) ? `${d}.${service}` : "";
                              const updated = { ...actionConfig, action: "perform-action", perform_action: next };
                              this._fireChanged({ ...this._config, [configKey]: updated });
                            }}
                            @closed=${(e) => e.stopPropagation()}
                            @click=${(e) => e.stopPropagation()}
                          >
                            <mwc-list-item value=""></mwc-list-item>
                            ${services.map((s) => html`<mwc-list-item .value=${s}>${s}</mwc-list-item>`)}
                          </ha-select>
                        </div>
                      `;
                    })()}
                  `}


                  ${actionConfig.perform_action ? html`
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{ target: {} }}
                      .label=${"Target (optional)"}
                      .value=${actionConfig.target || null}
                      @value-changed=${(ev) => {
                        ev.stopPropagation();
                        const target = ev.detail?.value;
                        // Only update if target actually changed
                        const currentTarget = actionConfig.target;
                        if (JSON.stringify(currentTarget) !== JSON.stringify(target)) {
                          const updated = { ...actionConfig };
                          if (target && Object.keys(target).length > 0) {
                            updated.target = target;
                          } else {
                            delete updated.target;
                          }
                          this._fireChanged({ ...this._config, [configKey]: updated });
                        }
                      }}
                      @click=${(e) => e.stopPropagation()}
                    ></ha-selector>

                    <ha-yaml-editor
                      .hass=${this.hass}
                      .label=${"Service Data (optional, YAML)"}
                      .value=${actionConfig.data || null}
                      @value-changed=${(ev) => {
                        ev.stopPropagation();
                        const data = ev.detail?.value;
                        // Only update if data actually changed
                        const currentData = actionConfig.data;
                        if (JSON.stringify(currentData) !== JSON.stringify(data)) {
                          const updated = { ...actionConfig };
                          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                            updated.data = data;
                          } else {
                            delete updated.data;
                          }
                          this._fireChanged({ ...this._config, [configKey]: updated });
                        }
                      }}
                      @click=${(e) => e.stopPropagation()}
                    ></ha-yaml-editor>
                  ` : ''}
                </div>
              ` : ""}
              
              ${currentAction === 'more-info' ? html`
                <ha-selector 
                  .hass=${this.hass} 
                  .selector=${{ entity: {} }} 
                  .value=${actionConfig.entity || ""} 
                  .label=${"Entity (optional)"} 
                  @value-changed=${(ev) => this._actionFieldSelectorChanged(ev, configKey, 'entity')}
                ></ha-selector>
              ` : ''}
            </div>
          `;
      };

      return html`
        <div class="card-config">
          <div class="disclaimer">
            <ha-alert alert-type="info" title="Documentation">
              Please read the <a href="https://jimz011.github.io/hki-elements/" target="_blank" rel="noopener noreferrer">documentation</a>
              first to set up this card. <br><br>
              This card may contain bugs. Use at your own risk!
            </ha-alert>
          </div>
          <div class="accordion-group">
            ${renderHeader("Card Layout", "layout_type")}
            <div class="accordion-content ${this._closedDetails['layout_type'] ? 'hidden' : ''}">
                <ha-select 
                  label="Card Layout" 
                  .value=${this._config.card_layout || "square"} 
                  @selected=${(ev) => {
                    ev.stopPropagation();
                    const newLayout = ev.target.value;
                    const oldLayout = this._config.card_layout;
                    
                    // Create new config with layout changed
                    const newConfig = { ...this._config, card_layout: newLayout };
                    
                    // When switching layouts, clear conflicting properties
                    if (oldLayout !== newLayout) {
                      // Clear layout-specific customizations to apply new defaults
                      if (newLayout === 'circle') {
                        // Force circle to be round even if user had custom border_radius
                        delete newConfig.grid_rows;
                        delete newConfig.grid_columns;
                        delete newConfig.element_grid;
                        delete newConfig.border_radius;
                      } else if (newLayout === 'badge' && this._config.badge_circle) {
                        // Force badge circle to be round
                        delete newConfig.border_radius;
                      } else {
                        // For other layouts, clear grid and border_radius if they were set by previous layouts
                        // Only clear if they match layout-specific defaults
                        if (this._config.grid_rows === 3 && this._config.grid_columns === 3) {
                          // These look like circle defaults
                          delete newConfig.grid_rows;
                          delete newConfig.grid_columns;
                          delete newConfig.element_grid;
                        }
                        if (this._config.border_radius === 100 || this._config.border_radius === 50) {
                          // These look like circle/badge-circle defaults
                          delete newConfig.border_radius;
                        }
                      }
                    }
                    
                    this._fireChanged(newConfig);
                  }} 
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                    ${shapes.map(a => html`<mwc-list-item .value=${a}>${a === "square" ? "HKI Default" : (a === "google_default" ? "Google Default" : (a === "hki_tile" ? "HKI Tile" : "Badge"))}</mwc-list-item>`) }
                </ha-select>
                <div class="layout-actions">
                  <button type="button" class="hki-reset-btn" @click=${(ev) => { ev.stopPropagation(); this._resetToDefaults(ev); }}>
  <ha-icon icon="mdi:restore"></ha-icon>
  <span>Reset to defaults</span>
</button>
                </div>

                
                
                
                ${this._config.card_layout === 'badge' ? html`
                  <p style="font-size: 13px; opacity: 0.7; margin: 8px 0;">
                    Badge layout mimics Home Assistant badges. Only icon, name and state are available here.
                  </p>
                  <div class="side-by-side" style="gap: 16px; flex-wrap: wrap;">
                    <ha-formfield .label=${"Show Icon"}>
                      <ha-switch .checked=${this._config.show_icon !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_icon"); }}></ha-switch>
                    </ha-formfield>
                    <ha-formfield .label=${"Show Name"}>
                      <ha-switch .checked=${this._config.show_name !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_name"); }}></ha-switch>
                    </ha-formfield>
                    <ha-formfield .label=${"Show State"}>
                      <ha-switch .checked=${this._config.show_state !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_state"); }}></ha-switch>
                    </ha-formfield>
                  </div>
                ` : ''}</div>
          </div>

          <div class="accordion-group ">
            ${renderHeader("Entity", "general")}
            <div class="accordion-content ${this._closedDetails['general'] ? 'hidden' : ''}">
                <div class="side-by-side" style="grid-template-columns: 1fr auto; align-items:center;">
  <ha-selector
    .hass=${this.hass}
    .selector=${{ entity: {} }}
    .value=${this._config.entity || ""}
    .label=${"Entity"}
    .required=${false}
    @value-changed=${(ev) => this._selectorChanged(ev, "entity")}
  ></ha-selector>
  <button class="hki-editor-clear" title="Clear Entity" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, entity: "" }); }}>
    <ha-icon icon="mdi:close"></ha-icon>
  </button>
</div>
                
                <div class="separator"></div>
                <strong>Appearance</strong>
                <ha-formfield .label=${"Use Entity Picture"}><ha-switch .checked=${this._config.use_entity_picture === true} @change=${(ev) => this._switchChanged(ev, "use_entity_picture")}></ha-switch></ha-formfield>
                
                ${this._config.use_entity_picture ? html`
                  <ha-textfield .label=${"Entity Picture Override (optional)"} .value=${this._config.entity_picture_override || ""} @input=${(ev) => this._textChanged(ev, "entity_picture_override")}></ha-textfield>
                ` : html`
                  <div class="tpl-field">
  <div class="tpl-title">Icon</div>
  <div class="tpl-desc">Enter a single icon (e.g., <code>mdi:lightbulb</code>) or a Jinja template that resolves to one icon.</div>
  <ha-code-editor
    .hass=${this.hass}
    mode="yaml"
    autocomplete-entities
    autocomplete-icons
    .autocompleteEntities=${true}
    .autocompleteIcons=${true}
    .label=${"Icon (mdi:* or Jinja)"}
    .value=${this._config.icon || ""}
    @value-changed=${(ev) => {
      ev.stopPropagation();
      const value = ev.detail?.value;
      if (value !== this._config.icon) {
        this._fireChanged({ ...this._config, icon: value || undefined });
      }
    }}
    @click=${(e) => e.stopPropagation()}
  ></ha-code-editor>
</div>
                `}
                
                <div class="separator"></div>
                <strong>Text Overrides (Jinja)</strong>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 0;">
                  These fields support Jinja templates (e.g., <code>{{ states('sensor.temperature') }}°C</code>).
                  Available variables: <code>config</code>, <code>user</code>.
                </p>

                <div class="tpl-field">
                  <div class="tpl-title">Name (top line)</div>
                  <div class="tpl-desc">Overrides the primary name text shown on the tile.</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Name template"}
                    .value=${this._config.name || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.name) {
                        this._fireChanged({ ...this._config, name: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>

                <div class="tpl-field">
                  <div class="tpl-title">State (bottom-right / state line)</div>
                  <div class="tpl-desc">Overrides the state text (normally the entity state, like On/Off/23°C).</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"State template"}
                    .value=${this._config.state_label || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.state_label) {
                        this._fireChanged({ ...this._config, state_label: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                ${isBadgeLayout ? '' : html`

                ${this._config.card_layout === 'hki_tile' ? '' : html`
                <div class="tpl-field">
                  <div class="tpl-title">Label (subtitle)</div>
                  <div class="tpl-desc">Overrides the smaller subtitle/label text (if enabled).</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Label template"}
                    .value=${this._config.label || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.label) {
                        this._fireChanged({ ...this._config, label: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                `}
                ${(isBadgeLayout || isGoogleLayout) ? '' : html`

                <div class="tpl-field">
                  <div class="tpl-title">Info (the optional “info” row)</div>
                  <div class="tpl-desc">Overrides the info line when the card layout includes an info element.</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Info template"}
                    .value=${this._config.info_display || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.info_display) {
                        this._fireChanged({ ...this._config, info_display: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                `}
`}

          </div>

          ${isClimate ? html`
          <div class="accordion-group ">
            ${renderHeader("Climate Settings", "climate")}
            <div class="accordion-content ${this._closedDetails['climate'] ? 'hidden' : ''}">
                <div class="side-by-side" style="align-items:center;">
                  <ha-selector 
                    .hass=${this.hass} 
                    .selector=${{ entity: {} }} 
                    .value=${this._config.climate_current_temperature_entity || ""} 
                    .label=${"Current Temp Entity (optional)"} 
                    @value-changed=${(ev) => this._selectorChanged(ev, "climate_current_temperature_entity")}
                  ></ha-selector>
                  <button class="hki-editor-clear" title="Clear" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, climate_current_temperature_entity: "" }); }}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <ha-textfield label="Temp Friendly Name (optional)" .value=${this._config.climate_temperature_name || ""} @input=${(ev) => this._textChanged(ev, "climate_temperature_name")}></ha-textfield>

                <div class="side-by-side" style="align-items:center;">
                  <ha-selector 
                    .hass=${this.hass} 
                    .selector=${{ entity: {} }} 
                    .value=${this._config.climate_humidity_entity || ""} 
                    .label=${"Humidity Entity (optional)"} 
                    @value-changed=${(ev) => this._selectorChanged(ev, "climate_humidity_entity")}
                  ></ha-selector>
                  <button class="hki-editor-clear" title="Clear" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, climate_humidity_entity: "" }); }}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <ha-textfield label="Humidity Friendly Name (optional)" .value=${this._config.climate_humidity_name || ""} @input=${(ev) => this._textChanged(ev, "climate_humidity_name")}></ha-textfield>

                <div class="side-by-side" style="align-items:center;">
                  <ha-selector 
                    .hass=${this.hass} 
                    .selector=${{ entity: {} }} 
                    .value=${this._config.climate_pressure_entity || ""} 
                    .label=${"Pressure Entity (optional)"} 
                    @value-changed=${(ev) => this._selectorChanged(ev, "climate_pressure_entity")}
                  ></ha-selector>
                  <button class="hki-editor-clear" title="Clear" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, climate_pressure_entity: "" }); }}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <ha-textfield label="Pressure Friendly Name (optional)" .value=${this._config.climate_pressure_name || ""} @input=${(ev) => this._textChanged(ev, "climate_pressure_name")}></ha-textfield>
                
                <div class="separator"></div>
                <strong>Popup Slider Settings</strong>
                <ha-textfield label="Temperature Step Size" type="number" step="0.1" .value=${this._config.climate_temp_step ?? 0.5} @input=${(ev) => this._textChanged(ev, "climate_temp_step")} placeholder="0.5"></ha-textfield>
                <ha-formfield .label=${"Use Circular Slider"}><ha-switch .checked=${this._config.climate_use_circular_slider === true} @change=${(ev) => this._switchChanged(ev, "climate_use_circular_slider")}></ha-switch></ha-formfield>
                <ha-formfield .label=${"Show +/- Buttons"}><ha-switch .checked=${this._config.climate_show_plus_minus === true} @change=${(ev) => this._switchChanged(ev, "climate_show_plus_minus")}></ha-switch></ha-formfield>
                <ha-formfield .label=${"Show Gradient"}><ha-switch .checked=${this._config.climate_show_gradient !== false} @change=${(ev) => this._switchChanged(ev, "climate_show_gradient")}></ha-switch></ha-formfield>
                <ha-formfield .label=${"Show Min/Max Target Range (if supported)"}><ha-switch .checked=${this._config.climate_show_target_range !== false} @change=${(ev) => this._switchChanged(ev, "climate_show_target_range")}></ha-switch></ha-formfield>
                
                <div class="separator"></div>
                <ha-formfield .label=${"Show Temperature Badge"}>
                  <ha-switch .checked=${this._config.show_temp_badge !== false} @change=${(ev) => this._switchChanged(ev, "show_temp_badge")}></ha-switch>
                </ha-formfield>
                <strong>Temperature Badge Styling</strong>
                <div class="side-by-side">
                  <ha-textfield label="Size (px)" type="number" .value=${this._config.temp_badge_size ?? 40} @input=${(ev) => this._textChanged(ev, "temp_badge_size")}></ha-textfield>
                  <ha-textfield label="Font Size (px)" type="number" .value=${this._config.size_temp_badge ?? 9} @input=${(ev) => this._textChanged(ev, "size_temp_badge")}></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-select 
                    label="Font Family" 
                    .value=${this._config.temp_badge_font_family || "system"} 
                    @selected=${(ev) => this._dropdownChanged(ev, "temp_badge_font_family")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    ${fonts.map(f => html`<mwc-list-item .value=${f}>${f}</mwc-list-item>`)}
                  </ha-select>
                  <ha-select 
                    label="Font Weight" 
                    .value=${this._config.temp_badge_font_weight || "normal"} 
                    @selected=${(ev) => this._dropdownChanged(ev, "temp_badge_font_weight")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    ${weights.map(w => html`<mwc-list-item .value=${w}>${w.charAt(0).toUpperCase() + w.slice(1)}</mwc-list-item>`)}
                  </ha-select>
                </div>
                ${this._config.temp_badge_font_family === 'custom' ? html`
                  <ha-textfield label="Custom Font Name" .value=${this._config.temp_badge_font_custom || ""} @input=${(ev) => this._textChanged(ev, "temp_badge_font_custom")}></ha-textfield>
                ` : ''}
                <div class="side-by-side">
                  <ha-textfield label="Border Radius" .value=${this._config.temp_badge_border_radius ?? ""} @input=${(ev) => this._textChanged(ev, "temp_badge_border_radius")}></ha-textfield>
                  <ha-textfield label="Box Shadow" .value=${this._config.temp_badge_box_shadow || ""} @input=${(ev) => this._textChanged(ev, "temp_badge_box_shadow")}></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-textfield label="Text Color" .value=${this._config.temp_badge_text_color || ""} @input=${(ev) => this._textChanged(ev, "temp_badge_text_color")}></ha-textfield>
                  <ha-textfield label="Border Color" .value=${this._config.temp_badge_border_color || ""} @input=${(ev) => this._textChanged(ev, "temp_badge_border_color")}></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-select 
                    label="Border Style" 
                    .value=${this._config.temp_badge_border_style || "none"} 
                    @selected=${(ev) => this._dropdownChanged(ev, "temp_badge_border_style")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    ${borders.map(b => html`<mwc-list-item .value=${b}>${b}</mwc-list-item>`)}
                  </ha-select>
                  <ha-textfield label="Border Width" .value=${this._config.temp_badge_border_width || ""} @input=${(ev) => this._textChanged(ev, "temp_badge_border_width")}></ha-textfield>
                </div>
            </div>
          </div>
          ` : ''}

          ${isHumidifier ? html`
          <div class="accordion-group ">
            ${renderHeader("Humidifier Settings", "humidifier")}
            <div class="accordion-content ${this._closedDetails['humidifier'] ? 'hidden' : ''}">
                <strong>Fan Speed Entity</strong>
                <p style="font-size:13px;opacity:0.7;margin:8px 0;">
                  Connect a <code>select</code> or <code>fan</code> entity to control fan speed directly inside the humidifier popup.
                </p>
                <div class="side-by-side" style="align-items:center;">
                  <ha-selector 
                    .hass=${this.hass} 
                    .selector=${{ entity: { domain: ['select', 'fan'] } }} 
                    .value=${this._config.humidifier_fan_entity || ""} 
                    .label=${"Fan Speed Entity (optional)"} 
                    @value-changed=${(ev) => this._selectorChanged(ev, "humidifier_fan_entity")}
                  ></ha-selector>
                  <button class="hki-editor-clear" title="Clear" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, humidifier_fan_entity: "" }); }}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <div class="separator"></div>
                <strong>Popup Slider Settings</strong>
                <ha-textfield label="Humidity Step Size" type="number" step="1" .value=${this._config.humidifier_humidity_step ?? 1} @input=${(ev) => this._textChanged(ev, "humidifier_humidity_step")} placeholder="1"></ha-textfield>
                <ha-formfield .label=${"Use Circular Slider"}><ha-switch .checked=${this._config.humidifier_use_circular_slider === true} @change=${(ev) => this._switchChanged(ev, "humidifier_use_circular_slider")}></ha-switch></ha-formfield>
                <ha-formfield .label=${"Show +/- Buttons"}><ha-switch .checked=${this._config.humidifier_show_plus_minus === true} @change=${(ev) => this._switchChanged(ev, "humidifier_show_plus_minus")}></ha-switch></ha-formfield>
                <ha-formfield .label=${"Show Gradient (circular)"}><ha-switch .checked=${this._config.humidifier_show_gradient !== false} @change=${(ev) => this._switchChanged(ev, "humidifier_show_gradient")}></ha-switch></ha-formfield>
            </div>
          </div>
          ` : ''}

          ${isLock ? html`
          <div class="accordion-group ">
            ${renderHeader("Lock Settings", "lock")}
            <div class="accordion-content ${this._closedDetails['lock'] ? 'hidden' : ''}">
                <strong>Contact Sensor (Door/Window)</strong>
                <p style="font-size: 13px; opacity: 0.7; margin: 8px 0;">
                  Add a contact sensor (door or window) to display when it's open. The lock icon will turn red and show your custom label when the sensor is open/on.
                </p>
                
                <div class="side-by-side" style="align-items:center;">
                  <ha-selector 
                    .hass=${this.hass} 
                    .selector=${{ entity: { domain: ['binary_sensor', 'sensor'] } }} 
                    .value=${this._config.lock_contact_sensor_entity || ""} 
                    .label=${"Contact Sensor Entity (optional)"} 
                    @value-changed=${(ev) => this._selectorChanged(ev, "lock_contact_sensor_entity")}
                  ></ha-selector>
                  <button class="hki-editor-clear" title="Clear" @click=${(e) => { e.stopPropagation(); this._fireChanged({ ...this._config, lock_contact_sensor_entity: "" }); }}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <ha-textfield 
                  label="Open State Label (e.g., 'Door Open')" 
                  .value=${this._config.lock_contact_sensor_label || "Door Open"} 
                  @input=${(ev) => this._textChanged(ev, "lock_contact_sensor_label")}
                  placeholder="Door Open"
                ></ha-textfield>
            </div>
          </div>
          ` : ''}

          
          <div class="accordion-group ">
            ${renderHeader("Visibility", "visibility")}
            <div class="accordion-content ${this._closedDetails['visibility'] ? 'hidden' : ''}">
              <p style="font-size: 13px; opacity: 0.7; margin: 8px 0;">
                Toggle which elements are shown. (Badge layout also has its own quick toggles in Card Layout.)
              </p>
              <div class="side-by-side" style="gap: 16px; flex-wrap: wrap;">
                <ha-formfield .label=${"Show Icon"}>
                  <ha-switch .checked=${this._config.show_icon !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_icon"); }}></ha-switch>
                </ha-formfield>
                <ha-formfield .label=${"Show Name"}>
                  <ha-switch .checked=${this._config.show_name !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_name"); }}></ha-switch>
                </ha-formfield>
                <ha-formfield .label=${"Show State"}>
                  <ha-switch .checked=${this._config.show_state !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_state"); }}></ha-switch>
                </ha-formfield>
                ${((this._config.card_layout || 'square') === 'square' || isGoogleLayout) ? html`
                <ha-formfield .label=${"Show Label"}>
                  <ha-switch .checked=${this._config.show_label !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_label"); }}></ha-switch>
                </ha-formfield>
                ` : ''} 
                ${((this._config.card_layout || 'square') === 'square' || this._config.card_layout === 'hki_tile') ? html`
                <ha-formfield .label=${"Show Info Display"}>
                  <ha-switch .checked=${this._config.show_info_display !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_info_display"); }}></ha-switch>
                </ha-formfield>
                ` : ''} 
</div>
            </div>
          </div>

<div class="accordion-group ">
             ${renderHeader("Card Styling", "card_styling")}
             <div class="accordion-content ${this._closedDetails['card_styling'] ? 'hidden' : ''}">
                <strong>Colors</strong>
                <div class="tpl-field">
                  <div class="tpl-title">Card Background</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Card Background"}
                    .value=${this._config.card_color || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.card_color) {
                        this._fireChanged({ ...this._config, card_color: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                <div class="tpl-field">
                  <div class="tpl-title">Card Opacity</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Card Opacity"}
                    .value=${this._config.card_opacity || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.card_opacity) {
                        this._fireChanged({ ...this._config, card_opacity: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>

                <div class="separator"></div>
                <strong>Card Border</strong>
                <div class="tpl-field">
                  <div class="tpl-title">Border Style</div>
                  <div class="tpl-desc">Supports templates. Values: none, solid, dashed, dotted, double, groove, ridge, inset, outset</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Border Style"}
                    .value=${this._config.border_style || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.border_style) {
                        this._fireChanged({ ...this._config, border_style: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                <div class="tpl-field">
                  <div class="tpl-title">Border Width</div>
                  <div class="tpl-desc">Supports templates. Auto adds 'px' if number only.</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Border Width"}
                    .value=${this._config.border_width || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.border_width) {
                        this._fireChanged({ ...this._config, border_width: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
<div class="tpl-field">
                  <div class="tpl-title">Border Color</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Border Color"}
                    .value=${this._config.border_color || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.border_color) {
                        this._fireChanged({ ...this._config, border_color: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div><div class="tpl-field">
                  <div class="tpl-title">Border Radius</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Border Radius"}
                    .value=${this._config.border_radius || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.border_radius) {
                        this._fireChanged({ ...this._config, border_radius: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                ${this._config.card_layout === "hki_tile" ? html`
                  <div class="side-by-side">
                    <ha-textfield
                      label="Tile Height (px)"
                      type="number"
                      min="40"
                      step="1"
                      placeholder="60"
                      .value=${this._config.tile_height ?? ""}
                      @input=${(ev) => this._textChanged(ev, "tile_height")}
                    ></ha-textfield>
                    <div></div>
                  </div>
                  <ha-formfield label="Show Slider (brightness/volume)">
                    <ha-switch
                      .checked=${this._config.show_tile_slider === true}
                      @change=${(ev) => this._switchChanged(ev, "show_tile_slider")}
                    ></ha-switch>
                  </ha-formfield>
                  ${this._config.show_tile_slider === true ? html`
                    <div class="side-by-side">
                      <ha-textfield
                        label="Track Color (unfilled)"
                        placeholder="rgba(255, 255, 255, 0.2)"
                        .value=${this._config.tile_slider_track_color ?? ""}
                        @input=${(ev) => this._textChanged(ev, "tile_slider_track_color")}
                      ></ha-textfield>
                      <ha-textfield
                        label="Fill Color (filled)"
                        placeholder="rgba(255, 255, 255, 0.8)"
                        .value=${this._config.tile_slider_fill_color ?? ""}
                        @input=${(ev) => this._textChanged(ev, "tile_slider_fill_color")}
                      ></ha-textfield>
                    </div>
                  ` : ''}
                ` : ''}
<div class="tpl-field">
                  <div class="tpl-title">Box Shadow</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Box Shadow"}
                    .value=${this._config.box_shadow || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.box_shadow) {
                        this._fireChanged({ ...this._config, box_shadow: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
             </div>
          </div>

          <div class="accordion-group ">
             ${renderHeader("Icon Styling", "icon_settings")}
             <div class="accordion-content ${this._closedDetails['icon_settings'] ? 'hidden' : ''}">

                <strong>Icon Styling</strong>
                <ha-formfield .label=${"Show Icon"}>
                  <ha-switch .checked=${this._config.show_icon !== false} @change=${(ev) => { ev.stopPropagation(); this._switchChanged(ev, "show_icon"); }}></ha-switch>
                </ha-formfield>
                <ha-textfield label="Size (px)" type="number" .value=${this._config.size_icon || 24} @input=${(ev) => this._textChanged(ev, "size_icon")}></ha-textfield>
<div class="tpl-field">
                  <div class="tpl-title">Icon Color</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Icon Color"}
                    .value=${this._config.icon_color || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_color) {
                        this._fireChanged({ ...this._config, icon_color: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>

                ${isGoogleLayout ? '' : html`
<div class="separator"></div>
                <strong>Icon Circle</strong>
                <ha-formfield .label=${"Show Icon Circle"}>
                  <ha-switch .checked=${this._config.show_icon_circle !== false} @change=${(ev) => this._switchChanged(ev, "show_icon_circle")}></ha-switch>
                </ha-formfield>
<div class="tpl-field">
                  <div class="tpl-title">Icon Circle Background</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Icon Circle Background"}
                    .value=${this._config.icon_circle_bg || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_circle_bg) {
                        this._fireChanged({ ...this._config, icon_circle_bg: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
<div class="tpl-field">
                  <div class="tpl-title">Icon Circle Border Style</div>
                  <div class="tpl-desc">Supports templates. Values: none, solid, dashed, dotted</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Icon Circle Border Style"}
                    .value=${this._config.icon_circle_border_style || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_circle_border_style) {
                        this._fireChanged({ ...this._config, icon_circle_border_style: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                <div class="tpl-field">
                  <div class="tpl-title">Icon Circle Border Width</div>
                  <div class="tpl-desc">Supports templates. Auto adds 'px' if number only.</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Icon Circle Border Width"}
                    .value=${this._config.icon_circle_border_width || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_circle_border_width) {
                        this._fireChanged({ ...this._config, icon_circle_border_width: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                <div class="tpl-field">
                  <div class="tpl-title">Icon Circle Border Color</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Icon Circle Border Color"}
                    .value=${this._config.icon_circle_border_color || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_circle_border_color) {
                        this._fireChanged({ ...this._config, icon_circle_border_color: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>

                
                `}
${isGoogleLayout ? '' : html`
<div class="separator"></div>
                <strong>Icon Badge</strong>
                <ha-formfield .label=${"Show Icon Badge"}>
                  <ha-switch .checked=${this._config.show_icon_badge !== false} @change=${(ev) => this._switchChanged(ev, "show_icon_badge")}></ha-switch>
                </ha-formfield>
<div class="tpl-field">
                  <div class="tpl-title">Badge Background</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Badge Background"}
                    .value=${this._config.badge_bg || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.badge_bg) {
                        this._fireChanged({ ...this._config, badge_bg: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
<div class="tpl-field">
                  <div class="tpl-title">Badge Border Style</div>
                  <div class="tpl-desc">Supports templates. Values: none, solid, dashed, dotted</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Badge Border Style"}
                    .value=${this._config.badge_border_style || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.badge_border_style) {
                        this._fireChanged({ ...this._config, badge_border_style: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div><div class="tpl-field">
                  <div class="tpl-title">Badge Border Width</div>
                  <div class="tpl-desc">Supports templates. Auto adds 'px' if number only.</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Badge Border Width"}
                    .value=${this._config.badge_border_width || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.badge_border_width) {
                        this._fireChanged({ ...this._config, badge_border_width: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div><div class="tpl-field">
                  <div class="tpl-title">Badge Border Color</div>
                  <div class="tpl-desc">Supports templates and plain values</div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Badge Border Color"}
                    .value=${this._config.badge_border_color || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.badge_border_color) {
                        this._fireChanged({ ...this._config, badge_border_color: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
                
                <div class="separator"></div>
                
                `}
<strong>Icon Animation</strong>
                <div class="tpl-field">
                  <div class="tpl-title">Animation</div>
                  <div class="tpl-desc">
                    Supports templates and plain values. Available: <code>spin</code>, <code>pulse</code>, <code>bounce</code>, <code>shake</code>, <code>swing</code>, <code>tada</code>, <code>wobble</code>, <code>flip</code><br>
                    <strong>Note:</strong> Plain animation names (e.g., <code>pulse</code>) automatically apply only when entity is ON. Use templates for custom control.
                  </div>
                  <ha-code-editor
                    .hass=${this.hass}
                    mode="yaml"
                    autocomplete-entities
                    .autocompleteEntities=${true}
                    .label=${"Animation"}
                    .value=${this._config.icon_animation || ""}
                    @value-changed=${(ev) => {
                      ev.stopPropagation();
                      const value = ev.detail?.value;
                      if (value !== this._config.icon_animation) {
                        this._fireChanged({ ...this._config, icon_animation: value || undefined });
                      }
                    }}
                    @click=${(e) => e.stopPropagation()}
                  ></ha-code-editor>
                </div>
             </div>
          </div>

          <div class="accordion-group ">
            ${renderHeader("Typography", "typography")}
             <div class="accordion-content ${this._closedDetails['typography'] ? 'hidden' : ''}">
                ${renderFontSection("name", "Name")}
                <div class="separator"></div>
                ${renderFontSection("state", "State")}
                <div class="separator"></div>
                ${renderFontSection("label", "Label")}
                <div class="separator"></div>
                ${renderFontSection("brightness", "Info Display")}
             </div>
          </div>

          <div class="accordion-group ">
            ${renderHeader("HKI Popup Options", "popup")}
             <div class="accordion-content ${this._closedDetails['popup'] ? 'hidden' : ''}">
                <p style="font-size: 12px; opacity: 0.7; margin: 8px 0; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; border-left: 3px solid var(--primary-color);">
                  <strong>Note:</strong> These settings only work when an action is set to <code>more-info (HKI)</code>.
                </p>
                
                <div class="separator"></div>
                <strong>Custom Popup</strong>
                <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 8px 0;">Enable to embed any custom card in the popup frame. Perfect for remote controls, custom climate controls, or specialized interfaces.</p>
                <ha-formfield .label=${"Enable Custom Popup"}><ha-switch .checked=${this._config.custom_popup?.enabled === true || this._config.custom_popup_enabled === true} @change=${(ev) => this._switchChanged(ev, "custom_popup_enabled")}></ha-switch></ha-formfield>
                
                ${(this._config.custom_popup?.enabled === true || this._config.custom_popup_enabled === true) ? html`
                  <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Popup Card</p>
                  <p style="font-size: 10px; opacity: 0.6; margin: 0 0 8px 0; font-style: italic;">This card will be embedded in the popup. Defaults to a vertical-stack — click the card type to change it.</p>
                  <div class="card-config">
                    ${customElements.get('hui-card-element-editor')
                      ? html`<hui-card-element-editor
                      .hass=${this.hass}
                      .lovelace=${this._getLovelace()}
                      .value=${this._config.custom_popup_card ?? this._config.custom_popup?.card ?? { type: "vertical-stack", cards: [] }}
                      @config-changed=${(ev) => {
                        ev.stopPropagation();
                        const newCard = ev.detail?.config;
                        if (!newCard) return;
                        const existing = this._config?.custom_popup_card ?? this._config?.custom_popup?.card;
                        if (JSON.stringify(newCard) !== JSON.stringify(existing)) {
                          this._fireChanged({ ...this._config, custom_popup_card: newCard });
                        }
                      }}
                    ></hui-card-element-editor>`
                      : customElements.get('hui-card-picker')
                        ? html`
                          <hui-card-picker
                            .hass=${this.hass}
                            .lovelace=${this._getLovelace()}
                            .value=${this._config.custom_popup_card ?? this._config.custom_popup?.card ?? { type: "vertical-stack", cards: [] }}
                            @config-changed=${(ev) => {
                              ev.stopPropagation();
                              const picked = ev.detail?.config;
                              if (!picked) return;
                              const existing = this._config?.custom_popup_card ?? this._config?.custom_popup?.card;
                              if (JSON.stringify(picked) !== JSON.stringify(existing)) {
                                this._fireChanged({ ...this._config, custom_popup_card: picked });
                              }
                            }}
                          ></hui-card-picker>

                          <ha-yaml-editor
                            .hass=${this.hass}
                            .label=${"Popup Card (YAML)"}
                            .value=${this._config.custom_popup_card ?? this._config.custom_popup?.card ?? { type: "vertical-stack", cards: [] }}
                            @value-changed=${(ev) => {
                              ev.stopPropagation();
                              const newCard = ev.detail?.value;
                              if (!newCard) return;
                              const existing = this._config?.custom_popup_card ?? this._config?.custom_popup?.card;
                              if (JSON.stringify(newCard) !== JSON.stringify(existing)) {
                                this._fireChanged({ ...this._config, custom_popup_card: newCard });
                              }
                            }}
                            @click=${(e) => e.stopPropagation()}
                          ></ha-yaml-editor>
                        `
                        : (() => { this._ensureCardEditorLoaded(); return html`<div class="hki-editor-loading">Loading card picker…</div>`; })()}
                  </div>
                ` : ''}
                
                <div class="separator"></div>
                <strong>Popup Animation</strong>
                <div class="side-by-side">
                  <ha-select label="Open Animation" .value=${this._config.popup_open_animation || 'scale'}
                    @selected=${(ev) => this._dropdownChanged(ev, 'popup_open_animation')}
                    @closed=${(e) => e.stopPropagation()} @click=${(e) => e.stopPropagation()}>
                    <mwc-list-item value="none">None</mwc-list-item>
                    <mwc-list-item value="fade">Fade</mwc-list-item>
                    <mwc-list-item value="scale">Scale</mwc-list-item>
                    <mwc-list-item value="slide-up">Slide Up</mwc-list-item>
                    <mwc-list-item value="slide-down">Slide Down</mwc-list-item>
                    <mwc-list-item value="slide-left">Slide Left</mwc-list-item>
                    <mwc-list-item value="slide-right">Slide Right</mwc-list-item>
                    <mwc-list-item value="flip">Flip</mwc-list-item>
                    <mwc-list-item value="bounce">Bounce</mwc-list-item>
                     <mwc-list-item value="zoom">Zoom</mwc-list-item>
                     <mwc-list-item value="rotate">Rotate</mwc-list-item>
                     <mwc-list-item value="drop">Drop</mwc-list-item>
                     <mwc-list-item value="swing">Swing</mwc-list-item>
                  </ha-select>
                  <ha-select label="Close Animation" .value=${this._config.popup_close_animation || 'scale'}
                    @selected=${(ev) => this._dropdownChanged(ev, 'popup_close_animation')}
                    @closed=${(e) => e.stopPropagation()} @click=${(e) => e.stopPropagation()}>
                    <mwc-list-item value="none">None</mwc-list-item>
                    <mwc-list-item value="fade">Fade</mwc-list-item>
                    <mwc-list-item value="scale">Scale</mwc-list-item>
                    <mwc-list-item value="slide-up">Slide Up</mwc-list-item>
                    <mwc-list-item value="slide-down">Slide Down</mwc-list-item>
                    <mwc-list-item value="slide-left">Slide Left</mwc-list-item>
                    <mwc-list-item value="slide-right">Slide Right</mwc-list-item>
                    <mwc-list-item value="flip">Flip</mwc-list-item>
                    <mwc-list-item value="bounce">Bounce</mwc-list-item>
                     <mwc-list-item value="zoom">Zoom</mwc-list-item>
                     <mwc-list-item value="rotate">Rotate</mwc-list-item>
                     <mwc-list-item value="drop">Drop</mwc-list-item>
                     <mwc-list-item value="swing">Swing</mwc-list-item>
                  </ha-select>
                </div>
                <ha-textfield label="Animation Duration (ms)" type="number" .value=${this._config.popup_animation_duration ?? 300} @input=${(ev) => this._textChanged(ev, 'popup_animation_duration')}></ha-textfield>

                <div class="separator"></div>
                <strong>Popup Container</strong>
                <ha-textfield label="Border Radius (px)" type="number" .value=${this._config.popup_border_radius ?? 16} @input=${(ev) => this._textChanged(ev, "popup_border_radius")}></ha-textfield>
                <div class="side-by-side">
                  <ha-select
                    label="Width"
                    .value=${this._config.popup_width || 'auto'}
                    @selected=${(ev) => this._dropdownChanged(ev, "popup_width")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    <mwc-list-item value="auto">Auto (Responsive) - Default</mwc-list-item>
                    <mwc-list-item value="default">Default (400px)</mwc-list-item>
                    <mwc-list-item value="custom">Custom</mwc-list-item>
                  </ha-select>
                  ${this._config.popup_width === 'custom' ? html`
                    <ha-textfield label="Custom Width (px)" type="number" .value=${this._config.popup_width_custom ?? 400} @input=${(ev) => this._textChanged(ev, "popup_width_custom")}></ha-textfield>
                  ` : html`<div></div>`}
                </div>
                <div class="side-by-side">
                  <ha-select
                    label="Height"
                    .value=${this._config.popup_height || 'auto'}
                    @selected=${(ev) => this._dropdownChanged(ev, "popup_height")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    <mwc-list-item value="auto">Auto (Responsive) - Default</mwc-list-item>
                    <mwc-list-item value="default">Default (600px)</mwc-list-item>
                    <mwc-list-item value="custom">Custom</mwc-list-item>
                  </ha-select>
                  ${this._config.popup_height === 'custom' ? html`
                    <ha-textfield label="Custom Height (px)" type="number" .value=${this._config.popup_height_custom ?? 600} @input=${(ev) => this._textChanged(ev, "popup_height_custom")}></ha-textfield>
                  ` : html`<div></div>`}
                </div>
                <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Background Blur (Portal)</p>
                <ha-formfield .label=${"Enable Background Blur"}><ha-switch .checked=${this._config.popup_blur_enabled !== false} @change=${(ev) => this._switchChanged(ev, "popup_blur_enabled")}></ha-switch></ha-formfield>
                <ha-textfield label="Blur Amount (px)" type="number" .value=${this._config.popup_blur_amount ?? 10} @input=${(ev) => this._textChanged(ev, "popup_blur_amount")} .disabled=${this._config.popup_blur_enabled === false}></ha-textfield>
                
                <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Card Glass Effect (Bubble-card style)</p>
                <p style="font-size: 10px; opacity: 0.6; margin: 0 0 8px 0; font-style: italic;">Creates a frosted glass effect on the popup card. Enabled by default with 0.4 opacity.</p>
                <ha-formfield .label=${"Enable Card Blur"}><ha-switch .checked=${this._config.popup_card_blur_enabled !== false} @change=${(ev) => this._switchChanged(ev, "popup_card_blur_enabled")}></ha-switch></ha-formfield>
                <div class="side-by-side">
                  <ha-textfield label="Card Blur (px)" type="number" .value=${this._config.popup_card_blur_amount ?? 40} @input=${(ev) => this._textChanged(ev, "popup_card_blur_amount")} .disabled=${this._config.popup_card_blur_enabled === false}></ha-textfield>
                  <ha-textfield label="Card Opacity" type="number" step="0.1" min="0" max="1" .value=${this._config.popup_card_opacity ?? 0.4} @input=${(ev) => this._textChanged(ev, "popup_card_opacity")}></ha-textfield>
                </div>
                
                ${(() => {
                  const domain = selectedEntity?.entity_id?.split('.')[0];
                  const hasChildren = selectedEntity?.attributes?.entity_id && Array.isArray(selectedEntity.attributes.entity_id);
                  const isLightGroup = domain === 'light' && hasChildren;
                  
                  // Show default view for any group entity (light, cover, switch, etc.)
                  // Show default section only for light groups
                  if (hasChildren) {
                    const entityTypeName = domain === 'light' ? 'Lights' : (domain === 'cover' ? 'Covers' : (domain === 'switch' ? 'Switches' : 'Entities'));
                    
                    return html`
                      <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Default View${isLightGroup ? ' & Section' : ''} (Groups)</p>
                      <p style="font-size: 10px; opacity: 0.6; margin: 0 0 8px 0; font-style: italic;">For ${domain} groups, choose which view${isLightGroup ? ' and section' : ''} to show when opening the popup.</p>
                      <div class="side-by-side">
                        <ha-select
                          label="Default View"
                          .value=${this._config.popup_default_view || 'main'}
                          @selected=${(ev) => this._dropdownChanged(ev, "popup_default_view")}
                          @closed=${(e) => e.stopPropagation()}
                          @click=${(e) => e.stopPropagation()}
                        >
                          <mwc-list-item value="main">Main (Group Controls)</mwc-list-item>
                          <mwc-list-item value="individual">Individual ${entityTypeName}</mwc-list-item>
                        </ha-select>
                        ${isLightGroup ? html`
                          <ha-select
                            label="Default Section"
                            .value=${this._config.popup_default_section || 'last'}
                            @selected=${(ev) => this._dropdownChanged(ev, "popup_default_section")}
                            @closed=${(e) => e.stopPropagation()}
                            @click=${(e) => e.stopPropagation()}
                          >
                            <mwc-list-item value="last">Last Used (Default)</mwc-list-item>
                            <mwc-list-item value="brightness">Always Brightness</mwc-list-item>
                            <mwc-list-item value="color">Always Color</mwc-list-item>
                            <mwc-list-item value="temperature">Always Temperature</mwc-list-item>
                          </ha-select>
                        ` : html`<div></div>`}
                      </div>
                    `;
                  }
                  return '';
                })()}
                
                ${(() => {
                  const domain = selectedEntity?.entity_id?.split('.')[0];
                  
                  // Show/hide options based on entity domain
                  const showLightOptions = domain === 'light';
                  const showClimateOptions = isClimate;
                  const showAlarmOptions = domain === 'alarm_control_panel';
                  const showCoverOptions = domain === 'cover';
                  
                  if (!showLightOptions && !showClimateOptions && !showAlarmOptions && !showCoverOptions) {
                    return '';
                  }
                  
                  return html`
                    <div class="separator"></div>
                    <strong>Features</strong>
                    <div class="checkbox-grid">
                      ${showLightOptions ? html`
                        <ha-formfield .label=${"Show Favorites"}><ha-switch .checked=${this._config.popup_show_favorites !== false} @change=${(ev) => this._switchChanged(ev, "popup_show_favorites")}></ha-switch></ha-formfield>
                        <ha-formfield .label=${"Show Effects"}><ha-switch .checked=${this._config.popup_show_effects !== false} @change=${(ev) => this._switchChanged(ev, "popup_show_effects")}></ha-switch></ha-formfield>
                      ` : ''}
                      ${showClimateOptions ? html`
                        <ha-formfield .label=${"Show Presets"}><ha-switch .checked=${this._config.popup_show_presets !== false} @change=${(ev) => this._switchChanged(ev, "popup_show_presets")}></ha-switch></ha-formfield>
                      ` : ''}
                      ${showCoverOptions ? html`
                        <ha-formfield .label=${"Show Favorites"}><ha-switch .checked=${this._config.popup_show_favorites !== false} @change=${(ev) => this._switchChanged(ev, "popup_show_favorites")}></ha-switch></ha-formfield>
                      ` : ''}
                    </div>
                  `;
                })()}
                
                <div class="separator"></div>
                <strong>Content Display</strong>
                <ha-textfield label="Slider Border Radius (px)" type="number" .value=${this._config.popup_slider_radius ?? 12} @input=${(ev) => this._textChanged(ev, "popup_slider_radius")}></ha-textfield>
                <ha-formfield .label=${"Hide Text Under Buttons"}><ha-switch .checked=${this._config.popup_hide_button_text === true} @change=${(ev) => this._switchChanged(ev, "popup_hide_button_text")}></ha-switch></ha-formfield>
                
                <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Value Display (Temperature/Brightness)</p>
                <div class="side-by-side">
                    <ha-textfield label="Font Size (px)" type="number" .value=${this._config.popup_value_font_size ?? 36} @input=${(ev) => this._textChanged(ev, "popup_value_font_size")}></ha-textfield>
                    <ha-textfield label="Font Weight" type="number" .value=${this._config.popup_value_font_weight ?? 300} @input=${(ev) => this._textChanged(ev, "popup_value_font_weight")}></ha-textfield>
                </div>
                
                <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">Label Display (Color/Mode Names)</p>
                <div class="side-by-side">
                    <ha-textfield label="Font Size (px)" type="number" .value=${this._config.popup_label_font_size ?? 16} @input=${(ev) => this._textChanged(ev, "popup_label_font_size")}></ha-textfield>
                    <ha-textfield label="Font Weight" type="number" .value=${this._config.popup_label_font_weight ?? 400} @input=${(ev) => this._textChanged(ev, "popup_label_font_weight")}></ha-textfield>
                </div>
                
                <p style="font-size: 11px; opacity: 0.7; margin: 12px 0 4px 0;">History/Logbook Time Format</p>
                <ha-select
                  label="Time Format"
                  .value=${this._config.popup_time_format || 'auto'}
                  @selected=${(ev) => this._dropdownChanged(ev, "popup_time_format")}
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value="auto">Auto</mwc-list-item>
                  <mwc-list-item value="12">12-Hour Clock</mwc-list-item>
                  <mwc-list-item value="24">24-Hour Clock</mwc-list-item>
                </ha-select>
                
                <div class="separator"></div>
                <strong>Active Button Styling</strong>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 0;">Customize selected/highlighted buttons</p>
                <div class="side-by-side">
                  <ha-textfield label="Color" .value=${this._config.popup_highlight_color || ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_color")} placeholder="var(--primary-color)"></ha-textfield>
                  <ha-textfield label="Text Color" .value=${this._config.popup_highlight_text_color || ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_text_color")} placeholder="white"></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-textfield label="Border Radius (px)" type="number" .value=${this._config.popup_highlight_radius ?? ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_radius")} placeholder="8"></ha-textfield>
                  <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${this._config.popup_highlight_opacity ?? ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_opacity")} placeholder="1"></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-select 
                    label="Border Style" 
                    .value=${this._config.popup_highlight_border_style || "none"} 
                    @selected=${(ev) => this._dropdownChanged(ev, "popup_highlight_border_style")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    ${borders.map(b => html`<mwc-list-item .value=${b}>${b}</mwc-list-item>`)}
                  </ha-select>
                  <ha-textfield label="Border Width (px)" .value=${this._config.popup_highlight_border_width || ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_border_width")} placeholder="0"></ha-textfield>
                </div>
                <ha-textfield label="Border Color" .value=${this._config.popup_highlight_border_color || ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_border_color")}></ha-textfield>
                <ha-textfield label="Box Shadow" .value=${this._config.popup_highlight_box_shadow || ""} @input=${(ev) => this._textChanged(ev, "popup_highlight_box_shadow")} placeholder="0 2px 8px rgba(0,0,0,0.2)"></ha-textfield>
                
                <div class="separator"></div>
                <strong>Inactive Button Styling</strong>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 0;">Customize unselected buttons</p>
                <div class="side-by-side">
                  <ha-textfield label="Background" .value=${this._config.popup_button_bg || ""} @input=${(ev) => this._textChanged(ev, "popup_button_bg")} placeholder="transparent"></ha-textfield>
                  <ha-textfield label="Text Color" .value=${this._config.popup_button_text_color || ""} @input=${(ev) => this._textChanged(ev, "popup_button_text_color")} placeholder="inherit"></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-textfield label="Border Radius (px)" type="number" .value=${this._config.popup_button_radius ?? ""} @input=${(ev) => this._textChanged(ev, "popup_button_radius")} placeholder="8"></ha-textfield>
                  <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${this._config.popup_button_opacity ?? ""} @input=${(ev) => this._textChanged(ev, "popup_button_opacity")} placeholder="1"></ha-textfield>
                </div>
                <div class="side-by-side">
                  <ha-select 
                    label="Border Style" 
                    .value=${this._config.popup_button_border_style || "none"} 
                    @selected=${(ev) => this._dropdownChanged(ev, "popup_button_border_style")}
                    @closed=${(e) => e.stopPropagation()}
                    @click=${(e) => e.stopPropagation()}
                  >
                    ${borders.map(b => html`<mwc-list-item .value=${b}>${b}</mwc-list-item>`)}
                  </ha-select>
                  <ha-textfield label="Border Width (px)" .value=${this._config.popup_button_border_width || ""} @input=${(ev) => this._textChanged(ev, "popup_button_border_width")} placeholder="0"></ha-textfield>
                </div>
                <ha-textfield label="Border Color" .value=${this._config.popup_button_border_color || ""} @input=${(ev) => this._textChanged(ev, "popup_button_border_color")}></ha-textfield>
             </div>
          </div>

          <div class="accordion-group ">
            ${renderHeader("Actions", "actions")}
             <div class="accordion-content ${this._closedDetails['actions'] ? 'hidden' : ''}">
                ${this._config.show_tile_slider === true ? html`
                  <div style="padding: 12px; background: rgba(255,193,7,0.1); border-radius: 8px; margin: 8px 0;">
                    <strong style="color: var(--primary-text-color);">ℹ️ Card Actions Disabled</strong>
                    <div style="font-size: 12px; color: var(--primary-text-color); opacity: 0.7; margin-top: 4px;">
                      When tile slider is enabled, card tap/hold/double-tap actions are disabled. Use icon actions below instead.
                    </div>
                  </div>
                ` : html`
                  <div class="sub-accordion">
                    ${renderHeader("Tap Action", "action_tap")}
                    <div class="sub-accordion-content ${this._closedDetails['action_tap'] ? 'hidden' : ''}">
                      ${renderActionDropdown("Tap Action", "tap_action")}
                    </div>
                  </div>
                  
                  <div class="sub-accordion">
                    ${renderHeader("Double Tap Action", "action_double_tap")}
                    <div class="sub-accordion-content ${this._closedDetails['action_double_tap'] ? 'hidden' : ''}">
                      ${renderActionDropdown("Double Tap Action", "double_tap_action")}
                    </div>
                  </div>
                  
                  <div class="sub-accordion">
                    ${renderHeader("Hold Action", "action_hold")}
                    <div class="sub-accordion-content ${this._closedDetails['action_hold'] ? 'hidden' : ''}">
                      ${renderActionDropdown("Hold Action", "hold_action")}
                    </div>
                  </div>
                `}
                
                <div class="sub-accordion">
                  ${renderHeader("Icon Tap Action", "action_icon_tap")}
                  <div class="sub-accordion-content ${this._closedDetails['action_icon_tap'] ? 'hidden' : ''}">
                    ${renderActionDropdown("Icon Tap Action", "icon_tap_action")}
                  </div>
                </div>
                
                <div class="sub-accordion">
                  ${renderHeader("Icon Hold Action", "action_icon_hold")}
                  <div class="sub-accordion-content ${this._closedDetails['action_icon_hold'] ? 'hidden' : ''}">
                    ${renderActionDropdown("Icon Hold Action", "icon_hold_action")}
                  </div>
                </div>
                
                <div class="sub-accordion">
                  ${renderHeader("Icon Double Tap Action", "action_icon_double_tap")}
                  <div class="sub-accordion-content ${this._closedDetails['action_icon_double_tap'] ? 'hidden' : ''}">
                    ${renderActionDropdown("Icon Double Tap Action", "icon_double_tap_action")}
                  </div>
                </div>
             </div>
          </div>

          <div class="accordion-group ">
            ${renderHeader("Offsets", "offsets")}
             <div class="accordion-content ${this._closedDetails['offsets'] ? 'hidden' : ''}">
                <p style="font-size: 11px; opacity: 0.7; margin-top: 0;">Adjust X/Y position in pixels.</p>
                <div class="side-by-side">
                    <ha-textfield label="Name X" type="number" .value=${this._getOffsetUiValue("name_offset_x")} @input=${(ev) => this._textChanged(ev, "name_offset_x")}></ha-textfield>
                    <ha-textfield label="Name Y" type="number" .value=${this._getOffsetUiValue("name_offset_y")} @input=${(ev) => this._textChanged(ev, "name_offset_y")}></ha-textfield>
                </div>
                <div class="side-by-side">
                    <ha-textfield label="State X" type="number" .value=${this._getOffsetUiValue("state_offset_x")} @input=${(ev) => this._textChanged(ev, "state_offset_x")}></ha-textfield>
                    <ha-textfield label="State Y" type="number" .value=${this._getOffsetUiValue("state_offset_y")} @input=${(ev) => this._textChanged(ev, "state_offset_y")}></ha-textfield>
                </div>
                ${((this._config.card_layout || 'square') === 'square' || isGoogleLayout) ? html`
                <div class="side-by-side">
                    <ha-textfield label="Label X" type="number" .value=${this._getOffsetUiValue("label_offset_x")} @input=${(ev) => this._textChanged(ev, "label_offset_x")}></ha-textfield>
                    <ha-textfield label="Label Y" type="number" .value=${this._getOffsetUiValue("label_offset_y")} @input=${(ev) => this._textChanged(ev, "label_offset_y")}></ha-textfield>
                </div>
                ` : ''} 

                <div class="side-by-side">
                    <ha-textfield label="Icon X" type="number" .value=${this._getOffsetUiValue("icon_offset_x")} @input=${(ev) => this._textChanged(ev, "icon_offset_x")}></ha-textfield>
                    <ha-textfield label="Icon Y" type="number" .value=${this._getOffsetUiValue("icon_offset_y")} @input=${(ev) => this._textChanged(ev, "icon_offset_y")}></ha-textfield>
                </div>
                ${!isGoogleLayout ? html`
                <div class="side-by-side">
                    <ha-textfield label="Icon Badge X" type="number" .value=${this._config.badge_offset_x || 0} @input=${(ev) => this._textChanged(ev, "badge_offset_x")}></ha-textfield>
                    <ha-textfield label="Icon Badge Y" type="number" .value=${this._config.badge_offset_y || 0} @input=${(ev) => this._textChanged(ev, "badge_offset_y")}></ha-textfield>
                </div>
                ` : ''}
                ${((this._config.card_layout || 'square') === 'square' || this._config.card_layout === 'hki_tile') ? html`
                <div class="side-by-side">
                    <ha-textfield label="Info X" type="number" .value=${this._getOffsetUiValue("brightness_offset_x")} @input=${(ev) => this._textChanged(ev, "brightness_offset_x")}></ha-textfield>
                    <ha-textfield label="Info Y" type="number" .value=${this._getOffsetUiValue("brightness_offset_y")} @input=${(ev) => this._textChanged(ev, "brightness_offset_y")}></ha-textfield>
                </div>
                ` : ''} 
                ${isClimate ? html`
                <div class="side-by-side">
                    <ha-textfield label="Temp Badge X" type="number" .value=${this._getOffsetUiValue("temp_badge_offset_x")} @input=${(ev) => this._textChanged(ev, "temp_badge_offset_x")}></ha-textfield>
                    <ha-textfield label="Temp Badge Y" type="number" .value=${this._getOffsetUiValue("temp_badge_offset_y")} @input=${(ev) => this._textChanged(ev, "temp_badge_offset_y")}></ha-textfield>
                </div>
                ` : ''}
             </div>
          </div>

        </div>
      `;
    }
    
    _toggleHeader(e, key) {
        // Check if the click target is an interactive element or inside one
        const target = e.target;
        const header = e.currentTarget;
        
        // Don't toggle if clicking on interactive elements like selectors, dropdowns, buttons, inputs
        const interactiveSelectors = [
            'ha-selector',
            'ha-select', 
            'mwc-list-item',
            'ha-textfield',
            'input',
            'button',
            'ha-switch',
            'ha-icon-button',
            'mwc-button',
            'ha-target-picker',
            'ha-entity-picker',
            'ha-service-picker',
            '.hki-editor-clear'
        ];
        
        // Check if target or any parent (up to header) matches interactive selectors
        let element = target;
        while (element && element !== header) {
            if (interactiveSelectors.some(selector => element.matches?.(selector))) {
                return; // Don't toggle
            }
            element = element.parentElement;
        }
        
        // Safe to toggle - click was on header itself or non-interactive child (like span/ha-icon)
        this._toggle(key);
    }

    _toggle(key) {
        this._closedDetails = { ...this._closedDetails, [key]: !this._closedDetails[key] };
    }
    
    // For HA Selectors (Entity, Icon)
    _selectorChanged(ev, field) { 
        ev.stopPropagation(); 
        const value = ev.detail.value;
        // If the user changes the main entity, prefer the entity's default icon.
        // Only keep a custom icon if the user explicitly set one (i.e. not the old default lightbulb fallback).
        if (field === 'entity') {
          const next = { ...this._config, [field]: value };
          if (!next.icon || next.icon === 'mdi:lightbulb') {
            next.icon = '';
          }
          this._fireChanged(next);
          return;
        }
        this._fireChanged({ ...this._config, [field]: value }); 
    }

    _toHaActionSelectorValue(actionConfig) {
      // Convert your lovelace-style config -> HA automation action list
      if (!actionConfig?.perform_action) return [];
    
      return [{
        service: actionConfig.perform_action,
        target: actionConfig.target,
        data: actionConfig.data,
      }];
    }
    
    _fromHaActionSelectorValue(ev, configKey) {
      ev.stopPropagation();
    
      const list = ev.detail?.value;
      const currentConfig = this._config[configKey] || {};
    
      // Ignore events without detail or value
      if (!ev.detail || ev.detail.value === undefined) {
        return;
      }
    
      // cleared
      if (!Array.isArray(list) || list.length === 0) {
        // Only fire if we actually had a value before
        if (currentConfig.perform_action) {
          this._fireChanged({ ...this._config, [configKey]: { action: "perform-action" } });
        }
        return;
      }
    
      const a = list[0] || {};
    
      // HA's action selector often uses `action:` for service calls
      const act = a.action || a.service || "";
      
      // Ignore incomplete actions (no service specified)
      if (!act) {
        return;
      }
    
      const updated = {
        action: "perform-action",
        perform_action: act,
      };
    
      if (a.target && Object.keys(a.target).length) updated.target = a.target;
      if (a.data && Object.keys(a.data).length) updated.data = a.data;
    
      // Only fire change if the value actually changed
      const hasChanged = 
        currentConfig.perform_action !== updated.perform_action ||
        JSON.stringify(currentConfig.target || {}) !== JSON.stringify(updated.target || {}) ||
        JSON.stringify(currentConfig.data || {}) !== JSON.stringify(updated.data || {});
      
      if (hasChanged) {
        this._fireChanged({ ...this._config, [configKey]: updated });
      }
    }

    
    // For Dropdowns (ha-select)
    _dropdownChanged(ev, field) {
        ev.stopPropagation();
        const value = ev.target.value;
        this._fireChanged({ ...this._config, [field]: value });
    }

    // For Action Dropdowns - merges 'action' string back into an object

    _actionChanged(ev, field) {
        ev.stopPropagation();
        const actionValue = ev.target.value;

        // IMPORTANT:
        // Keep `{ action: "none" }` in the config instead of deleting the field.
        // Otherwise the card falls back to its default action (e.g. HKI more-info),
        // which makes "None" still do something.
        if (actionValue === "none") {
          this._fireChanged({ ...this._config, [field]: { action: "none" } });
          return;
        }

        // Clean slate: only keep the new action type, remove old properties
        // This prevents navigation_path staying when switching from navigate to url, etc.
        const newActionConfig = { action: actionValue };
        this._fireChanged({ ...this._config, [field]: newActionConfig });
    }

    _actionFieldChanged(ev, actionKey, fieldName, isJSON = false) {
      ev.stopPropagation();
    
      let value = ev.detail?.value ?? ev.target?.value;  // ✅ supports ha-selector + text/select
    
      if (isJSON && value) {
        try { value = JSON.parse(value); } catch (e) { return; }
      }
    
      const currentActionConfig = this._config[actionKey] || {};
      const newActionConfig = { ...currentActionConfig, [fieldName]: value };
      this._fireChanged({ ...this._config, [actionKey]: newActionConfig });
    }


    _actionFieldYamlChanged(ev, actionKey, fieldName) {
        ev.stopPropagation();
        const value = ev.detail.value;
        const currentActionConfig = this._config[actionKey] || {};
        const newActionConfig = { ...currentActionConfig, [fieldName]: value };
        this._fireChanged({ ...this._config, [actionKey]: newActionConfig });
    }

    _actionFieldSelectorChanged(ev, actionKey, fieldName) {
      ev.stopPropagation();
      const value = ev.detail?.value;
    
      const currentActionConfig = this._config[actionKey] || {};
      const newActionConfig = { ...currentActionConfig };
    
      // Only special-case "target"
      if (fieldName === "target") {
        const t = value || {};
    
        const isEmptyVal = (v) => {
          if (v === undefined || v === null) return true;
          if (Array.isArray(v)) return v.length === 0;
          if (typeof v === "string") return v.trim() === "";
          return false;
        };
    
        const empty =
          isEmptyVal(t.entity_id) &&
          isEmptyVal(t.device_id) &&
          isEmptyVal(t.area_id) &&
          isEmptyVal(t.floor_id) &&
          isEmptyVal(t.label_id);
    
        if (empty) {
          delete newActionConfig.target;   // ✅ THIS is what makes “last one” removable
        } else {
          newActionConfig.target = t;
        }
      } else {
        newActionConfig[fieldName] = value;
      }
    
      this._fireChanged({ ...this._config, [actionKey]: newActionConfig });
    }

    // For Textfields (ha-textfield)
    _textChanged(ev, field) { 
        ev.stopPropagation(); 
        let value = ev.target.value; 
        const isOffset = HkiButtonCardEditor.OFFSET_DEFAULTS[field] !== undefined ||
                         HkiButtonCardEditor.TILE_OFFSET_DEFAULTS[field] !== undefined ||
                         HkiButtonCardEditor.GOOGLE_OFFSET_DEFAULTS[field] !== undefined;
        if (ev.target.type === "number") {
          const parsed = parseFloat(value);
          if (isNaN(parsed)) {
            // Empty number field: reset offset to baseline (0 in UI = default), or delete non-offset key
            if (isOffset) {
              value = this._applyOffsetUiValue(field, 0);
            } else {
              const next = { ...this._config };
              delete next[field];
              this._fireChanged(next);
              return;
            }
          } else {
            value = parsed;
            if (isOffset) value = this._applyOffsetUiValue(field, value);
          }
        } else {
          // Text field: empty string → remove key
          if (value === '' && !isOffset) {
            const next = { ...this._config };
            delete next[field];
            this._fireChanged(next);
            return;
          }
          if (isOffset) value = this._applyOffsetUiValue(field, value);
        }
        this._fireChanged({ ...this._config, [field]: value }); 
    }

    // For Switches (ha-switch)
    _getLovelace() {
      // HA sets this.lovelace on the editor element. Fall back to DOM lookup if not set.
      if (this.lovelace) return this.lovelace;
      try {
        const root = document.querySelector('home-assistant')?.shadowRoot
          ?.querySelector('ha-panel-lovelace')?.shadowRoot
          ?.querySelector('hui-root');
        const huiRoot = root || document.querySelector('hui-root');
        const lv = huiRoot?.lovelace || huiRoot?.__lovelace || huiRoot?._lovelace;
        if (lv) return lv;
        // Borrow lovelace from any already-rendered hui-card-element-editor on the page
        const existingEditor = document.querySelector('hui-card-element-editor');
        if (existingEditor?.lovelace) return existingEditor.lovelace;
        return null;
      } catch (_) { return null; }
    }

    _ensureCardEditorLoaded() {
      // Proactively load the built-in Lovelace card editor. HA lazy-loads this,
      // which can cause the card picker to be missing unless it was opened elsewhere first.
      //
      // APPROACH: Call getConfigElement() on already-registered HA cards. This is the
      // same trick used by simple-swipe-card and triggers HA's own lazy-loader to
      // register hui-card-picker and hui-card-element-editor as a side effect.
      // This is far more reliable than trying to import() hardcoded/hashed JS paths.
      if (customElements.get('hui-card-element-editor') || customElements.get('hui-card-picker')) return;

      if (this._waitingForCardEditor) return;
      this._waitingForCardEditor = true;

      const triggers = [
        () => customElements.get('hui-entities-card')?.getConfigElement?.(),
        () => customElements.get('hui-conditional-card')?.getConfigElement?.(),
        () => customElements.get('hui-vertical-stack-card')?.getConfigElement?.(),
        () => customElements.get('hui-horizontal-stack-card')?.getConfigElement?.(),
        () => customElements.get('hui-glance-card')?.getConfigElement?.(),
        () => customElements.get('hui-picture-elements-card')?.getConfigElement?.(),
        () => customElements.get('hui-button-card')?.getConfigElement?.(),
      ];

      const tryTriggers = async () => {
        for (const trigger of triggers) {
          try {
            await trigger();
            if (customElements.get('hui-card-element-editor') || customElements.get('hui-card-picker')) break;
          } catch (_) {}
        }
        // Regardless of whether any trigger succeeded, wait for the element to be defined.
        Promise.race([
          customElements.whenDefined('hui-card-element-editor'),
          customElements.whenDefined('hui-card-picker'),
          new Promise((res) => setTimeout(res, 3000)),
        ]).then(() => {
          this._waitingForCardEditor = false;
          this.requestUpdate();
        });
};

      tryTriggers();
    }

    _switchChanged(ev, field) { 
        ev.stopPropagation(); 
        this._fireChanged({ ...this._config, [field]: ev.target.checked }); 
    }
    

    // Reset all optional settings back to internal defaults (keeps entity + layout)
    _resetToDefaults(ev) {
        if (ev) {
          ev.stopPropagation();
          ev.preventDefault?.();
        }
        // Reset only layout geometry controls (sizes + offsets) back to internal defaults.
        // We deliberately keep content/visibility/styling keys (name/state/label/icon settings etc.).
        const next = { ...this._config };
        const keysToClear = [
          "size_icon",
          "size_name",
          "size_state",
          "size_label",
          "size_brightness",
          "temp_badge_size",
          "name_offset_x",
          "name_offset_y",
          "state_offset_x",
          "state_offset_y",
          "label_offset_x",
          "label_offset_y",
          "icon_offset_x",
          "icon_offset_y",
          "brightness_offset_x",
          "brightness_offset_y",
          "temp_badge_offset_x",
          "temp_badge_offset_y",
          "icon_circle_offset_x",
          "icon_circle_offset_y",
          "icon_badge_offset_x",
          "icon_badge_offset_y"
        ];
        for (const k of keysToClear) {
          if (k in next) delete next[k];
        }
        // Keep mandatory fields
        next.type = next.type || "custom:hki-button-card";
        this._fireChanged(next);
    }

    _fireChanged(newConfig) {
        // Clean up empty values that shouldn't be in YAML
        const cleaned = { ...newConfig };
        
        // Remove empty icon
        if (cleaned.icon === '') {
          delete cleaned.icon;
        }
        
        // Remove any empty-string optional fields (but keep 'entity' which may be intentionally blank)
        const KEEP_EMPTY = new Set(['entity', 'type']);
        for (const [k, v] of Object.entries(cleaned)) {
          if (typeof v === 'string' && v === '' && !KEEP_EMPTY.has(k)) {
            delete cleaned[k];
          }
        }
        
        // Remove empty or default icon_double_tap_action
        if (cleaned.icon_double_tap_action && 
            (!cleaned.icon_double_tap_action.action || cleaned.icon_double_tap_action.action === 'none')) {
          delete cleaned.icon_double_tap_action;
        }

        // Convert flat internal format → nested YAML format for user-facing output
        const output = HkiButtonCard._serializeToNested(cleaned);
        
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: output }, bubbles: true, composed: true }));
    }
    
    static get styles() { 
        return css`
            .card-config { 
                display: flex; 
                flex-direction: column; 
                gap: 12px; 
                padding: 8px; 
            }
            
            /* ALLOW OVERFLOW FOR DROPDOWNS */
            .accordion-group { 
                background: var(--secondary-background-color);
                border-radius: 4px;
                margin-bottom: 8px;
                overflow: visible;
                border: 1px solid var(--divider-color);
            }
            
            .accordion-header { 
                padding: 12px;
                cursor: pointer;
                font-weight: 600;
                background: var(--primary-background-color);
                border-bottom: 1px solid var(--divider-color);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .accordion-header ha-icon {
                font-weight: bold;
                font-size: 1.2em;
            }
            
            .accordion-content { 
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                overflow: visible; 
            }
            
            .accordion-content.hidden { display: none; }
            .accordion-group.hidden { display: none; }
            
            .sub-accordion {
                background: var(--secondary-background-color);
                border-radius: 4px;
                margin-bottom: 8px;
                overflow: visible;
                border: 1px solid var(--divider-color);
            }
            
            .sub-accordion .accordion-header {
                padding: 12px;
                font-size: 14px;
                font-weight: 600;
                background: var(--primary-background-color);
                border-bottom: 1px solid var(--divider-color);
            }
            
            .sub-accordion-content {
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                overflow: visible;
            }
            
            .sub-accordion-content.hidden { display: none; }
            
            .side-by-side { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 12px; 
                margin-bottom: 8px; 
            }

            /* Text override template helpers */
            .tpl-field {
                margin-top: 10px;
            }
            .tpl-title {
                font-weight: 600;
                margin-bottom: 4px;
            }
            .tpl-desc {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 6px;
            }
            ha-code-editor {
                width: 100%;
            }
            
            .sub-section { 
                border: 1px solid var(--divider-color); 
                padding: 10px; 
                border-radius: 6px; 
                margin-bottom: 8px; 
            }
            
            .separator { 
                height: 1px; 
                background: var(--divider-color); 
                margin: 12px 0; 
            }
            
            .action-config-section {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .action-config-section strong {
                font-size: 13px;
                opacity: 0.7;
                margin-bottom: 4px;
            }
            
            .perform-action-config {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .perform-action-config ha-selector,
            .perform-action-config ha-textfield,
            .perform-action-config ha-yaml-editor {
                width: 100%;
            }
            
            
            .hki-editor-clear{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid var(--divider-color);
                background: var(--card-background-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 0;
            }
            .hki-editor-clear ha-icon{
                --mdc-icon-size: 20px;
            }
            .hki-editor-clear:hover{
                background: var(--secondary-background-color);
            }
.checkbox-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 8px; 
            }
            
            .grid-layout-editor {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin: 12px 0;
            }
            
            .element-palette {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .palette-element {
                flex: 1;
                min-width: 80px;
                padding: 8px 12px;
                background: var(--card-background-color);
                border: 2px solid var(--divider-color);
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                position: relative;
                transition: all 0.2s;
            }
            
            .palette-element:hover {
                border-color: var(--primary-color);
                transform: translateY(-2px);
            }
            
            .palette-element.selected {
                border-color: var(--primary-color);
                background: var(--primary-color);
                color: white;
            }
            
            .palette-element ha-icon {
                --mdc-icon-size: 20px;
            }
            
            .palette-element span {
                font-size: 11px;
                font-weight: 500;
            }
            
            .element-count {
                position: absolute;
                top: 4px;
                right: 4px;
                background: var(--primary-color);
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
            }
            
            .palette-element.selected .element-count {
                background: white;
                color: var(--primary-color);
            }
            
            .layout-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                padding: 12px;
                background: var(--secondary-background-color);
                border-radius: 8px;
                border: 2px solid var(--divider-color);
            }
            
            .grid-cell {
                aspect-ratio: 1;
                background: var(--card-background-color);
                border: 2px dashed var(--divider-color);
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                cursor: pointer;
                transition: all 0.2s;
                min-height: 60px;
            }
            
            .grid-cell:hover {
                border-color: var(--primary-color);
                transform: scale(1.05);
            }
            
            .grid-cell.filled {
                border-style: solid;
                background: var(--primary-color);
                color: white;
            }
            
            .grid-cell.filled ha-icon {
                --mdc-icon-size: 24px;
            }
            
            .grid-cell.filled span {
                font-size: 10px;
                font-weight: 500;
            }
            
            .grid-cell.selectable {
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            .grid-cell .empty-indicator {
                font-size: 24px;
                opacity: 0.3;
                font-weight: 300;
            }
            
            .reset-order-btn {
                width: 100%;
                padding: 10px;
                background: var(--secondary-background-color);
                border: 1px solid var(--divider-color);
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                margin-top: 8px;
            }
            
            .reset-order-btn:hover {
                background: var(--primary-color);
                color: white;
            }
            
            ha-textfield, ha-selector, ha-select, ha-yaml-editor { 
                width: 100%; 
                display: block; 
                margin-bottom: 8px; 
            }
            ha-formfield { 
                display: flex; 
                align-items: center; 
                height: 40px; 
            }
        
            .layout-actions{
                margin-top: 8px;
                display: flex;
                justify-content: flex-end;
            }
            
.hki-reset-btn{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    transition: background 120ms ease, border-color 120ms ease, transform 60ms ease;
}
.hki-reset-btn:hover{
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.35);
}
.hki-reset-btn:active{
    transform: translateY(1px);
    background: rgba(255,255,255,0.18);
}
.hki-reset-btn ha-icon{
    width: 18px;
    height: 18px;
}
mwc-button.reset-defaults{
                --mdc-theme-primary: var(--primary-color);
            }
`; 
    }
  }

  // Guard against double-registration (can happen on reloads / caching)
  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, HkiButtonCard);
  }
  if (!customElements.get(EDITOR_TAG)) {
    customElements.define(EDITOR_TAG, HkiButtonCardEditor);
  }
  
  window.customCards = window.customCards || [];
  window.customCards.push({ 
    type: CARD_TYPE, 
    name: "HKI Button Card", 
    description: "Customizable buttons with built-in popups.", 
    preview: true 
  });
})();