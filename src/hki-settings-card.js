// HKI Settings Card

const { LitElement, html, css } = window.HKI.getLit();
const CARD_TYPE = "hki-settings-card";
const EDITOR_TAG = "hki-settings-card-editor";

const BORDER_STYLES = (window.HKI?.EDITOR_OPTIONS?.borderStyles || [
  { value: "solid", label: "solid" },
  { value: "dashed", label: "dashed" },
  { value: "dotted", label: "dotted" },
  { value: "double", label: "double" },
  { value: "none", label: "none" },
]).map((x) => ({ value: x.value, label: x.label }));

const FONT_FAMILIES = [
  { value: "inherit", label: "inherit" },
  { value: "system", label: "system" },
  { value: "roboto", label: "roboto" },
  { value: "inter", label: "inter" },
  { value: "arial", label: "arial" },
  { value: "georgia", label: "georgia" },
  { value: "mono", label: "mono" },
  { value: "custom", label: "custom" },
];

const FONT_WEIGHTS = [
  { value: "lighter", label: "lighter" },
  { value: "normal", label: "normal" },
  { value: "bold", label: "bold" },
  { value: "bolder", label: "bolder" },
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
  { value: "800", label: "800" },
];
const HEADER_WEIGHT_OPTIONS = [
  { value: "light", label: "light" },
  { value: "regular", label: "regular" },
  { value: "medium", label: "medium" },
  { value: "semibold", label: "semibold" },
  { value: "bold", label: "bold" },
  { value: "black", label: "black" },
];

const NAV_TEXT_TRANSFORM = [
  { value: "none", label: "none" },
  { value: "uppercase", label: "uppercase" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "capitalize" },
];
const TEXT_ALIGN_OPTIONS = [
  { value: "left", label: "left" },
  { value: "center", label: "center" },
  { value: "right", label: "right" },
];
const ICON_ALIGN_OPTIONS = [
  { value: "left", label: "left" },
  { value: "center", label: "center" },
  { value: "right", label: "right" },
];
const POPUP_EDITOR_OPTIONS = window.HKI?.POPUP_EDITOR_OPTIONS || {};
const POPUP_WIDTH_OPTIONS = POPUP_EDITOR_OPTIONS.width || [
  { value: "auto", label: "Auto" },
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];
const POPUP_HEIGHT_OPTIONS = POPUP_EDITOR_OPTIONS.height || [
  { value: "auto", label: "Auto" },
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];
const POPUP_ANIMATION_OPTIONS = POPUP_EDITOR_OPTIONS.animations || [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "scale", label: "Scale" },
];
const POPUP_TIME_FORMAT_OPTIONS = POPUP_EDITOR_OPTIONS.timeFormats || [
  { value: "auto", label: "Auto" },
  { value: "12", label: "12-Hour Clock" },
  { value: "24", label: "24-Hour Clock" },
];
const POPUP_DEFAULT_VIEW_OPTIONS = window.HKI?.EDITOR_OPTIONS?.popupDefaultViewOptions || [
  { value: "main", label: "Main (Group Controls)" },
  { value: "individual", label: "Individual Entities" },
];
const POPUP_DEFAULT_SECTION_OPTIONS = window.HKI?.EDITOR_OPTIONS?.popupDefaultSectionOptions || [
  { value: "last", label: "Last Used" },
  { value: "brightness", label: "Always Brightness" },
  { value: "color", label: "Always Color" },
  { value: "temperature", label: "Always Temperature" },
];
const POPUP_BOTTOM_BAR_ALIGN_OPTIONS = window.HKI?.EDITOR_OPTIONS?.popupBottomBarAlignOptions || [
  { value: "spread", label: "Spread" },
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
];

const DEFAULT_CONFIG = Object.freeze({
  type: `custom:${CARD_TYPE}`,
});
const HA_PRESERVE_KEYS = Object.freeze(["visibility", "grid_options"]);

const isUnset = window.HKI?.isUnsetValue || ((v) => v === undefined || v === null || (typeof v === "string" && v.trim() === ""));

function sanitizeScope(scopeObj) {
  const next = {};
  if (!scopeObj || typeof scopeObj !== "object") return next;
  Object.entries(scopeObj).forEach(([k, v]) => {
    if (isUnset(v)) return;
    next[k] = v;
  });
  return next;
}

function normalizeConfig(config) {
  const c = { ...DEFAULT_CONFIG, ...(config || {}) };
  if (typeof c.title !== "string" || !c.title.trim()) delete c.title;
  if (c.button && typeof c.button === "object") c.button = { ...c.button };
  else delete c.button;
  if (c.header && typeof c.header === "object") c.header = { ...c.header };
  else delete c.header;
  if (c.navigation && typeof c.navigation === "object") c.navigation = { ...c.navigation };
  else delete c.navigation;
  if (c.popup && typeof c.popup === "object") c.popup = { ...c.popup };
  else delete c.popup;
  return c;
}

class HkiSettingsBase extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
    };
  }

  constructor() {
    super();
    this._templateDrafts = {};
  }

  _tplFieldKey(scope, key) {
    return `${scope}.${key}`;
  }

  _objFieldKey(scope, key) {
    return `obj:${scope}.${key}`;
  }

  _getTemplateFieldValue(scope, key) {
    const k = this._tplFieldKey(scope, key);
    if (Object.prototype.hasOwnProperty.call(this._templateDrafts, k)) {
      return this._templateDrafts[k];
    }
    const current = this._config?.[scope]?.[key];
    return current !== undefined ? String(current) : "";
  }

  _onTemplateValueChanged(scope, key, value) {
    const k = this._tplFieldKey(scope, key);
    this._templateDrafts = {
      ...this._templateDrafts,
      [k]: String(value ?? ""),
    };
    this.requestUpdate();
  }

  _onTemplateBlur(scope, key) {
    const k = this._tplFieldKey(scope, key);
    const draft = Object.prototype.hasOwnProperty.call(this._templateDrafts, k)
      ? this._templateDrafts[k]
      : "";
    this._setText(scope, key, draft);
    const next = { ...this._templateDrafts };
    delete next[k];
    this._templateDrafts = next;
    this.requestUpdate();
  }

  _getObjectFieldValue(scope, key) {
    const k = this._objFieldKey(scope, key);
    if (Object.prototype.hasOwnProperty.call(this._templateDrafts, k)) {
      return this._templateDrafts[k];
    }
    const current = this._config?.[scope]?.[key];
    if (current === undefined || current === null) return "";
    try {
      if (window.jsyaml?.dump) return String(window.jsyaml.dump(current) || "").trim();
      return JSON.stringify(current, null, 2);
    } catch (_) {
      return "";
    }
  }

  _onObjectValueChanged(scope, key, value) {
    const k = this._objFieldKey(scope, key);
    this._templateDrafts = {
      ...this._templateDrafts,
      [k]: String(value ?? ""),
    };
    this.requestUpdate();
  }

  _onObjectBlur(scope, key) {
    const k = this._objFieldKey(scope, key);
    const raw = Object.prototype.hasOwnProperty.call(this._templateDrafts, k)
      ? this._templateDrafts[k]
      : "";
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    const text = String(raw ?? "").trim();
    if (!text) {
      delete next[scope][key];
    } else {
      try {
        const parsed = window.jsyaml?.load ? window.jsyaml.load(text) : JSON.parse(text);
        if (parsed && typeof parsed === "object") next[scope][key] = parsed;
      } catch (_) {
        // Keep existing value if parsing fails while user is still editing.
      }
    }
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
    const drafts = { ...this._templateDrafts };
    delete drafts[k];
    this._templateDrafts = drafts;
    this.requestUpdate();
  }

  _withPreservedHaKeys(next) {
    const out = normalizeConfig(next || {});
    const prev = this._config || {};
    HA_PRESERVE_KEYS.forEach((k) => {
      if (prev[k] !== undefined && out[k] === undefined) out[k] = prev[k];
    });
    return out;
  }

  setConfig(config) {
    const normalized = normalizeConfig(config);
    const persisted = window.HKI?.getGlobalSettings?.() || {};
    if (!normalized.button && persisted.button && Object.keys(persisted.button).length) {
      normalized.button = { ...persisted.button };
    }
    if (!normalized.header && persisted.header && Object.keys(persisted.header).length) {
      normalized.header = { ...persisted.header };
    }
    if (!normalized.navigation && persisted.navigation && Object.keys(persisted.navigation).length) {
      normalized.navigation = { ...persisted.navigation };
    }
    if (!normalized.popup && persisted.popup && Object.keys(persisted.popup).length) {
      normalized.popup = { ...persisted.popup };
    }
    this._config = normalized;
  }

  _commitTemplateDrafts(baseConfig) {
    const next = normalizeConfig(baseConfig || this._config || DEFAULT_CONFIG);
    Object.entries(this._templateDrafts || {}).forEach(([compound, value]) => {
      const dot = compound.indexOf(".");
      if (dot <= 0) return;
      const scope = compound.slice(0, dot);
      const key = compound.slice(dot + 1);
      if (scope.includes(":")) return;
      if (!scope || !key) return;
      if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
      const text = String(value ?? "").trim();
      if (!text) delete next[scope][key];
      else next[scope][key] = text;
      if (next[scope] && !Object.keys(next[scope]).length) delete next[scope];
    });
    this._templateDrafts = {};
    return next;
  }

  _saveNow() {
    const next = this._withPreservedHaKeys(this._commitTemplateDrafts(this._config));
    this._config = next;
    try {
      window.HKI?.setGlobalSettings?.({
        button: sanitizeScope(next.button || {}),
        header: sanitizeScope(next.header || {}),
        navigation: sanitizeScope(next.navigation || {}),
        popup: sanitizeScope(next.popup || {}),
      });
    } catch (_) {}
    try {
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }));
    } catch (_) {}
    this.requestUpdate();
  }

  _publishGlobals() {
    const cfg = this._config || DEFAULT_CONFIG;
    window.HKI?.setGlobalSettings?.({
      button: sanitizeScope(cfg.button || {}),
      header: sanitizeScope(cfg.header || {}),
      navigation: sanitizeScope(cfg.navigation || {}),
      popup: sanitizeScope(cfg.popup || {}),
    });
  }

  _emitChanged(next) {
    this._config = next;
    this._publishGlobals();
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: next },
      bubbles: true,
      composed: true,
    }));
  }

  _setText(scope, key, value) {
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    if (!value || value.trim() === "") delete next[scope][key];
    else next[scope][key] = value.trim();
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
  }

  _setNumber(scope, key, value) {
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    const raw = String(value ?? "").trim();
    if (raw === "") delete next[scope][key];
    else {
      const n = Number(raw);
      if (Number.isFinite(n)) next[scope][key] = n;
      else delete next[scope][key];
    }
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
  }

  _setSelect(scope, key, value) {
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    if (!value || value === "__inherit__") delete next[scope][key];
    else next[scope][key] = value;
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
  }

  _setBool(scope, key, checked) {
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    if (checked === undefined || checked === null) delete next[scope][key];
    else next[scope][key] = !!checked;
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
  }

  _setList(scope, key, rawValue) {
    const next = normalizeConfig(this._config);
    if (!next[scope] || typeof next[scope] !== "object") next[scope] = {};
    const values = String(rawValue ?? "")
      .split(/\r?\n|,/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (!values.length) delete next[scope][key];
    else next[scope][key] = values;
    if (!Object.keys(next[scope]).length) delete next[scope];
    this._emitChanged(next);
  }

  _resetScope(scope) {
    const next = this._withPreservedHaKeys(normalizeConfig(this._config));
    delete next[scope];
    this._emitChanged(next);
  }

  _resetAll() {
    const next = this._withPreservedHaKeys(normalizeConfig({ type: `custom:${CARD_TYPE}` }));
    this._emitChanged(next);
  }

  _renderSelect(scope, key, label, options) {
    const current = this._config?.[scope]?.[key];
    return html`
      <ha-select
        .label=${label}
        .value=${current !== undefined ? String(current) : "__inherit__"}
        @selected=${(e) => this._setSelect(scope, key, (e.detail?.value ?? e.target?.value))}
        @closed=${(e) => e.stopPropagation()}
      >
        <mwc-list-item .value=${"__inherit__"}>(inherit)</mwc-list-item>
        ${options.map((opt) => html`<mwc-list-item .value=${String(opt.value)}>${opt.label}</mwc-list-item>`)}
      </ha-select>
    `;
  }

  _renderInput(scope, key, label, type = "text", placeholder = "") {
    const current = this._config?.[scope]?.[key];
    return html`
      <ha-textfield
        .label=${label}
        .type=${type}
        .value=${current !== undefined ? String(current) : ""}
        .placeholder=${placeholder}
        @input=${(e) => (type === "number"
          ? this._setNumber(scope, key, (e.detail?.value ?? e.target?.value))
          : this._setText(scope, key, (e.detail?.value ?? e.target?.value)))}
      ></ha-textfield>
    `;
  }

  _renderTemplateInput(scope, key, label) {
    return html`
      <div class="tpl-field">
        <div class="tpl-title">${label}</div>
        <ha-code-editor
          .hass=${this.hass}
          mode="yaml"
          autocomplete-entities
          autocomplete-icons
          .autocompleteEntities=${true}
          .autocompleteIcons=${true}
          .label=${label}
          .value=${this._getTemplateFieldValue(scope, key)}
          @value-changed=${(ev) => {
            ev.stopPropagation();
            this._onTemplateValueChanged(scope, key, ev.detail?.value ?? "");
          }}
          @blur=${() => this._onTemplateBlur(scope, key)}
          @click=${(e) => e.stopPropagation()}
        ></ha-code-editor>
      </div>
    `;
  }

  _renderSwitch(scope, key, label) {
    return html`
      <ha-formfield .label=${label}>
        <ha-switch
          .checked=${!!this._config?.[scope]?.[key]}
          @change=${(e) => this._setBool(scope, key, e.target.checked)}
        ></ha-switch>
      </ha-formfield>
    `;
  }

  _renderListInput(scope, key, label) {
    const value = this._config?.[scope]?.[key];
    const text = Array.isArray(value) ? value.join("\n") : "";
    return html`
      <div class="tpl-field">
        <div class="tpl-title">${label}</div>
        <ha-code-editor
          .hass=${this.hass}
          mode="yaml"
          .value=${text}
          @blur=${(e) => this._setList(scope, key, e.target?.value ?? text)}
        ></ha-code-editor>
      </div>
    `;
  }

  _renderObjectInput(scope, key, label) {
    return html`
      <div class="tpl-field">
        <div class="tpl-title">${label}</div>
        <ha-code-editor
          .hass=${this.hass}
          mode="yaml"
          autocomplete-entities
          autocomplete-icons
          .autocompleteEntities=${true}
          .autocompleteIcons=${true}
          .value=${this._getObjectFieldValue(scope, key)}
          @value-changed=${(ev) => {
            ev.stopPropagation();
            this._onObjectValueChanged(scope, key, ev.detail?.value ?? "");
          }}
          @blur=${() => this._onObjectBlur(scope, key)}
        ></ha-code-editor>
      </div>
    `;
  }

  _renderCategoryAccordion(title, fields, description = "") {
    return html`
      <details class="category-accordion">
        <summary>${title}</summary>
        <div class="category">
          ${description ? html`<div class="category-sub">${description}</div>` : ""}
          <div class="grid">${fields}</div>
        </div>
      </details>
    `;
  }

  _renderScopeHeader(title, scope, subtitle) {
    return html`
      <div class="scope-head">
        <div>
          <div class="scope-title">${title}</div>
          <div class="scope-sub">${subtitle}</div>
        </div>
        <button type="button" class="hki-reset-btn" @click=${() => this._resetScope(scope)}>
          <ha-icon icon="mdi:restore"></ha-icon>
          <span>Reset ${scope}</span>
        </button>
      </div>
    `;
  }

  _renderForm() {
    const cfg = this._config || DEFAULT_CONFIG;
    return html`
      <div class="wrap">
        <div class="intro">
          <div class="title">${cfg.title || "HKI Global Settings"}</div>
          <div class="sub">
            Global defaults for HKI Button, Header, and Navigation cards.
            Card-level values still win. Blank values inherit these globals.
          </div>
        </div>

        <details class="scope-accordion">
          <summary>Button Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Button Card Defaults", "button", "Applied to hki-button-card when a field is empty.")}
            ${this._renderCategoryAccordion("Card", html`
              ${this._renderTemplateInput("button", "card_color", "Card color (Template/CSS)")}
              ${this._renderTemplateInput("button", "card_opacity", "Card opacity (Template/CSS)")}
              ${this._renderTemplateInput("button", "border_radius", "Border radius (Template/CSS)")}
              ${this._renderTemplateInput("button", "box_shadow", "Box shadow (Template/CSS)")}
              ${this._renderTemplateInput("button", "border_width", "Border width (Template/CSS)")}
              ${this._renderSelect("button", "border_style", "Border style", BORDER_STYLES)}
              ${this._renderTemplateInput("button", "border_color", "Border color (Template/CSS)")}
            `, "Styles the outer button container.")}
            ${this._renderCategoryAccordion("Icon", html`
              ${this._renderTemplateInput("button", "icon_color", "Icon color (Template/CSS/Jinja)")}
              ${this._renderTemplateInput("button", "icon_animation", "Icon animation (Template/Jinja)")}
              ${this._renderSwitch("button", "enable_icon_animation", "Enable icon animation")}
              ${this._renderSelect("button", "icon_align", "Icon align", ICON_ALIGN_OPTIONS)}
              ${this._renderInput("button", "size_icon", "Icon size (px)", "number")}
            `, "Global icon style for button cards.")}
            ${this._renderCategoryAccordion("Icon Circle", html`
              ${this._renderTemplateInput("button", "icon_circle_bg", "Circle background (Template/CSS/Jinja)")}
              ${this._renderSelect("button", "icon_circle_border_style", "Circle border style", BORDER_STYLES)}
              ${this._renderTemplateInput("button", "icon_circle_border_width", "Circle border width (Template/CSS/Jinja)")}
              ${this._renderTemplateInput("button", "icon_circle_border_color", "Circle border color (Template/CSS/Jinja)")}
            `, "Styles for the optional icon circle.")}
            ${this._renderCategoryAccordion("Badge (Icon Badge)", html`
              ${this._renderTemplateInput("button", "badge_bg", "Badge background (Template/CSS/Jinja)")}
              ${this._renderSelect("button", "badge_border_style", "Badge border style", BORDER_STYLES)}
              ${this._renderTemplateInput("button", "badge_border_width", "Badge border width (Template/CSS/Jinja)")}
              ${this._renderTemplateInput("button", "badge_border_color", "Badge border color (Template/CSS/Jinja)")}
              ${this._renderInput("button", "badge_border_radius", "Badge border radius", "number")}
              ${this._renderInput("button", "badge_box_shadow", "Badge box shadow")}
              ${this._renderSwitch("button", "badge_circle", "Badge circle")}
              ${this._renderInput("button", "badge_size", "Badge size (px)", "number")}
              ${this._renderInput("button", "size_badge", "Badge font size", "number")}
              ${this._renderSelect("button", "badge_font_family", "Badge font family", FONT_FAMILIES)}
              ${this._renderSelect("button", "badge_font_weight", "Badge font weight", FONT_WEIGHTS)}
            `, "Styles for the small icon badge/chip.")}
            ${this._renderCategoryAccordion("Temperature Badge", html`
              ${this._renderInput("button", "temp_badge_size", "Temp badge size (px)", "number")}
              ${this._renderInput("button", "size_temp_badge", "Temp badge font size", "number")}
              ${this._renderInput("button", "temp_badge_text_color", "Temp badge text color")}
              ${this._renderInput("button", "temp_badge_border_color", "Temp badge border color")}
              ${this._renderSelect("button", "temp_badge_border_style", "Temp badge border style", BORDER_STYLES)}
              ${this._renderInput("button", "temp_badge_border_width", "Temp badge border width", "number")}
              ${this._renderInput("button", "temp_badge_border_radius", "Temp badge border radius", "number")}
              ${this._renderInput("button", "temp_badge_box_shadow", "Temp badge box shadow")}
              ${this._renderSelect("button", "temp_badge_font_family", "Temp badge font family", FONT_FAMILIES)}
              ${this._renderInput("button", "temp_badge_font_custom", "Temp badge custom font")}
              ${this._renderSelect("button", "temp_badge_font_weight", "Temp badge font weight", FONT_WEIGHTS)}
            `, "Climate temperature corner badge styling.")}
            ${this._renderCategoryAccordion("Name Typography", html`
              ${this._renderSelect("button", "name_font_family", "Name font family", FONT_FAMILIES)}
              ${this._renderInput("button", "name_font_custom", "Name custom font")}
              ${this._renderSelect("button", "name_font_weight", "Name font weight", FONT_WEIGHTS)}
              ${this._renderSelect("button", "name_text_align", "Name text align", TEXT_ALIGN_OPTIONS)}
              ${this._renderInput("button", "size_name", "Name size", "number")}
              ${this._renderTemplateInput("button", "name_color", "Name color (Template/CSS)")}
            `, "Applies to the entity name text.")}
            ${this._renderCategoryAccordion("State Typography", html`
              ${this._renderSelect("button", "state_font_family", "State font family", FONT_FAMILIES)}
              ${this._renderInput("button", "state_font_custom", "State custom font")}
              ${this._renderSelect("button", "state_font_weight", "State font weight", FONT_WEIGHTS)}
              ${this._renderSelect("button", "state_text_align", "State text align", TEXT_ALIGN_OPTIONS)}
              ${this._renderInput("button", "size_state", "State size", "number")}
              ${this._renderTemplateInput("button", "state_color", "State color (Template/CSS)")}
            `, "Applies to the entity state text.")}
            ${this._renderCategoryAccordion("Label Typography", html`
              ${this._renderSelect("button", "label_font_family", "Label font family", FONT_FAMILIES)}
              ${this._renderInput("button", "label_font_custom", "Label custom font")}
              ${this._renderSelect("button", "label_font_weight", "Label font weight", FONT_WEIGHTS)}
              ${this._renderSelect("button", "label_text_align", "Label text align", TEXT_ALIGN_OPTIONS)}
              ${this._renderInput("button", "size_label", "Label size", "number")}
              ${this._renderTemplateInput("button", "label_color", "Label color (Template/CSS)")}
            `, "Applies to optional label text.")}
            ${this._renderCategoryAccordion("Info/Brightness Typography", html`
              ${this._renderSelect("button", "brightness_font_family", "Info font family", FONT_FAMILIES)}
              ${this._renderInput("button", "brightness_font_custom", "Info custom font")}
              ${this._renderSelect("button", "brightness_font_weight", "Info font weight", FONT_WEIGHTS)}
              ${this._renderSelect("button", "brightness_text_align", "Info text align", TEXT_ALIGN_OPTIONS)}
              ${this._renderInput("button", "size_brightness", "Info size", "number")}
              ${this._renderTemplateInput("button", "brightness_color", "Info color (Template/CSS)")}
              ${this._renderTemplateInput("button", "brightness_color_on", "Info color (On) (Template/CSS)")}
              ${this._renderTemplateInput("button", "brightness_color_off", "Info color (Off) (Template/CSS)")}
            `, "Applies to info/brightness line text.")}
            ${this._renderCategoryAccordion("Tile", html`
              ${this._renderInput("button", "tile_height", "Tile height", "number")}
              ${this._renderSwitch("button", "show_tile_slider", "Show tile slider")}
              ${this._renderTemplateInput("button", "tile_slider_track_color", "Tile slider track color (Template/CSS/Jinja)")}
              ${this._renderTemplateInput("button", "tile_slider_fill_color", "Tile slider fill color (Template/CSS/Jinja)")}
            `, "Global defaults for hki_tile layout.")}
            ${this._renderCategoryAccordion("Offsets", html`
              ${this._renderInput("button", "name_offset_x", "Name offset X", "number")}
              ${this._renderInput("button", "name_offset_y", "Name offset Y", "number")}
              ${this._renderInput("button", "state_offset_x", "State offset X", "number")}
              ${this._renderInput("button", "state_offset_y", "State offset Y", "number")}
              ${this._renderInput("button", "label_offset_x", "Label offset X", "number")}
              ${this._renderInput("button", "label_offset_y", "Label offset Y", "number")}
              ${this._renderInput("button", "icon_offset_x", "Icon offset X", "number")}
              ${this._renderInput("button", "icon_offset_y", "Icon offset Y", "number")}
              ${this._renderInput("button", "icon_circle_offset_x", "Icon circle offset X", "number")}
              ${this._renderInput("button", "icon_circle_offset_y", "Icon circle offset Y", "number")}
              ${this._renderInput("button", "icon_badge_offset_x", "Icon badge offset X", "number")}
              ${this._renderInput("button", "icon_badge_offset_y", "Icon badge offset Y", "number")}
              ${this._renderInput("button", "badge_offset_x", "Badge offset X", "number")}
              ${this._renderInput("button", "badge_offset_y", "Badge offset Y", "number")}
              ${this._renderInput("button", "brightness_offset_x", "Info offset X", "number")}
              ${this._renderInput("button", "brightness_offset_y", "Info offset Y", "number")}
              ${this._renderInput("button", "temp_badge_offset_x", "Temp badge offset X", "number")}
              ${this._renderInput("button", "temp_badge_offset_y", "Temp badge offset Y", "number")}
            `, "Global element positioning offsets.")}
          </section>
        </details>

        <details class="scope-accordion">
          <summary>HKI Popup Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("HKI Popup Defaults", "popup", "Shared popup styling defaults for all HKI cards that support popups.")}
            ${this._renderCategoryAccordion("Card", html`
              ${this._renderInput("popup", "popup_border_radius", "Popup border radius", "number")}
              ${this._renderSelect("popup", "popup_width", "Popup width mode", POPUP_WIDTH_OPTIONS)}
              ${this._renderInput("popup", "popup_width_custom", "Popup width custom (px)", "number")}
              ${this._renderSelect("popup", "popup_height", "Popup height mode", POPUP_HEIGHT_OPTIONS)}
              ${this._renderInput("popup", "popup_height_custom", "Popup height custom (px)", "number")}
              ${this._renderSwitch("popup", "popup_blur_enabled", "Popup backdrop blur enabled")}
              ${this._renderInput("popup", "popup_blur_amount", "Popup blur amount", "number")}
              ${this._renderSwitch("popup", "popup_card_blur_enabled", "Popup card blur enabled")}
              ${this._renderInput("popup", "popup_card_blur_amount", "Popup card blur amount", "number")}
              ${this._renderInput("popup", "popup_card_opacity", "Popup card opacity", "number")}
            `, "Container and glass styling for popup surfaces.")}
            ${this._renderCategoryAccordion("Animation", html`
              ${this._renderSelect("popup", "popup_open_animation", "Popup open animation", POPUP_ANIMATION_OPTIONS)}
              ${this._renderSelect("popup", "popup_close_animation", "Popup close animation", POPUP_ANIMATION_OPTIONS)}
              ${this._renderInput("popup", "popup_animation_duration", "Popup animation duration (ms)", "number")}
            `, "Open/close animation style for popup transitions.")}
            ${this._renderCategoryAccordion("Features", html`
              ${this._renderSwitch("popup", "popup_show_favorites", "Show favorites section")}
              ${this._renderSwitch("popup", "popup_show_effects", "Show effects section")}
              ${this._renderSwitch("popup", "popup_show_presets", "Show presets section")}
              ${this._renderSwitch("popup", "popup_hide_bottom_bar", "Hide popup bottom bar")}
              ${this._renderSwitch("popup", "popup_hide_top_bar", "Hide popup top bar")}
              ${(this._config?.popup?.popup_hide_top_bar === true)
                ? this._renderSwitch("popup", "popup_show_close_button", "Show close button when top bar is hidden")
                : ""}
              ${this._renderSwitch("popup", "popup_close_on_action", "Close popup after perform-action")}
              ${this._renderSelect("popup", "popup_bottom_bar_align", "Popup bottom bar align", POPUP_BOTTOM_BAR_ALIGN_OPTIONS)}
              ${this._renderSelect("popup", "popup_default_view", "Popup default view", POPUP_DEFAULT_VIEW_OPTIONS)}
              ${this._renderSelect("popup", "popup_default_section", "Popup default section", POPUP_DEFAULT_SECTION_OPTIONS)}
            `, "Global popup feature toggles and navigation behavior.")}
            ${this._renderCategoryAccordion("Typography", html`
              ${this._renderInput("popup", "popup_slider_radius", "Popup slider radius", "number")}
              ${this._renderSwitch("popup", "popup_hide_button_text", "Hide popup button text")}
              ${this._renderInput("popup", "popup_value_font_size", "Popup value font size", "number")}
              ${this._renderInput("popup", "popup_value_font_weight", "Popup value font weight", "number")}
              ${this._renderInput("popup", "popup_label_font_size", "Popup label font size", "number")}
              ${this._renderInput("popup", "popup_label_font_weight", "Popup label font weight", "number")}
              ${this._renderSelect("popup", "popup_time_format", "Popup time format", POPUP_TIME_FORMAT_OPTIONS)}
            `, "Text and slider display style inside popups.")}
            ${this._renderCategoryAccordion("Buttons", html`
              ${this._renderInput("popup", "popup_highlight_color", "Active button color")}
              ${this._renderInput("popup", "popup_highlight_text_color", "Active button text color")}
              ${this._renderInput("popup", "popup_highlight_radius", "Active button border radius", "number")}
              ${this._renderInput("popup", "popup_highlight_opacity", "Active button opacity", "number")}
              ${this._renderInput("popup", "popup_highlight_border_color", "Active button border color")}
              ${this._renderSelect("popup", "popup_highlight_border_style", "Active button border style", BORDER_STYLES)}
              ${this._renderInput("popup", "popup_highlight_border_width", "Active button border width", "number")}
              ${this._renderInput("popup", "popup_highlight_box_shadow", "Active button box shadow")}
              ${this._renderInput("popup", "popup_button_bg", "Inactive button background")}
              ${this._renderInput("popup", "popup_button_text_color", "Inactive button text color")}
              ${this._renderInput("popup", "popup_button_radius", "Inactive button border radius", "number")}
              ${this._renderInput("popup", "popup_button_opacity", "Inactive button opacity", "number")}
              ${this._renderInput("popup", "popup_button_border_color", "Inactive button border color")}
              ${this._renderSelect("popup", "popup_button_border_style", "Inactive button border style", BORDER_STYLES)}
              ${this._renderInput("popup", "popup_button_border_width", "Inactive button border width", "number")}
            `, "Styling for active/inactive popup action buttons.")}
            ${this._renderCategoryAccordion("Climate", html`
              ${this._renderSwitch("popup", "climate_use_circular_slider", "Climate circular slider")}
              ${this._renderSwitch("popup", "climate_show_plus_minus", "Climate show plus/minus")}
              ${this._renderSwitch("popup", "climate_show_gradient", "Climate show gradient")}
              ${this._renderSwitch("popup", "climate_show_target_range", "Climate show target range")}
              ${this._renderInput("popup", "climate_temp_step", "Climate temperature step", "number")}
            `, "Domain-specific climate popup display style.")}
            ${this._renderCategoryAccordion("Humidifier", html`
              ${this._renderSwitch("popup", "humidifier_use_circular_slider", "Humidifier circular slider")}
              ${this._renderSwitch("popup", "humidifier_show_plus_minus", "Humidifier show plus/minus")}
              ${this._renderSwitch("popup", "humidifier_show_gradient", "Humidifier show gradient")}
              ${this._renderInput("popup", "humidifier_humidity_step", "Humidifier humidity step", "number")}
            `, "Domain-specific humidifier popup display style.")}
            ${this._renderCategoryAccordion("Sensor", html`
              ${this._renderInput("popup", "sensor_graph_style", "Sensor graph style")}
              ${this._renderInput("popup", "sensor_graph_color", "Sensor graph color")}
              ${this._renderInput("popup", "sensor_line_width", "Sensor line width", "number")}
              ${this._renderInput("popup", "sensor_hours", "Sensor default range (hours)", "number")}
              ${this._renderSwitch("popup", "sensor_graph_gradient", "Sensor graph gradient")}
            `, "Domain-specific graph style for sensor/input_number popups.")}
            ${this._renderCategoryAccordion("Lock", html`
              ${this._renderInput("popup", "popup_button_radius", "Action button radius", "number")}
              ${this._renderInput("popup", "popup_highlight_radius", "Active action radius", "number")}
            `, "Lock popup uses the shared popup button styles.")}
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Header Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Header Card Defaults", "header", "Applied to hki-header-card when a field is empty.")}
            ${this._renderCategoryAccordion("Card", html`
              ${this._renderTemplateInput("header", "card_border_radius", "Card border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_border_radius_top", "Top border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_border_radius_bottom", "Bottom border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_box_shadow", "Card box shadow (Template/CSS)")}
              ${this._renderInput("header", "card_border_width", "Card border width", "number")}
              ${this._renderSelect("header", "card_border_style", "Card border style", BORDER_STYLES)}
              ${this._renderTemplateInput("header", "card_border_color", "Card border color (Template/CSS)")}
            `, "Styles the header card frame and border.")}
            ${this._renderCategoryAccordion("Typography", html`
              ${this._renderSelect("header", "font_family", "Font family", FONT_FAMILIES)}
              ${this._renderInput("header", "font_family_custom", "Custom font")}
              ${this._renderSelect("header", "font_style", "Font style", [{ value: "normal", label: "normal" }, { value: "italic", label: "italic" }])}
              ${this._renderInput("header", "title_size_px", "Title size", "number")}
              ${this._renderInput("header", "subtitle_size_px", "Subtitle size", "number")}
              ${this._renderSelect("header", "title_weight", "Title weight", HEADER_WEIGHT_OPTIONS)}
              ${this._renderSelect("header", "subtitle_weight", "Subtitle weight", HEADER_WEIGHT_OPTIONS)}
              ${this._renderTemplateInput("header", "title_color", "Title color (Template/CSS)")}
              ${this._renderTemplateInput("header", "subtitle_color", "Subtitle color (Template/CSS)")}
            `, "Title/subtitle font and text color defaults.")}
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Navigation Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Navigation Card Defaults", "navigation", "Applied to hki-navigation-card when a field is empty.")}
            ${this._renderCategoryAccordion("Button Surface", html`
              ${this._renderInput("navigation", "default_border_radius", "Default border radius", "number")}
              ${this._renderInput("navigation", "default_border_width", "Default border width", "number")}
              ${this._renderSelect("navigation", "default_border_style", "Default border style", BORDER_STYLES)}
              ${this._renderTemplateInput("navigation", "default_border_color", "Default border color (Template/CSS)")}
              ${this._renderTemplateInput("navigation", "button_box_shadow", "Button box shadow (Template/CSS)")}
              ${this._renderTemplateInput("navigation", "button_box_shadow_hover", "Button box shadow hover (Template/CSS)")}
              ${this._renderInput("navigation", "default_button_opacity", "Default button opacity (0-1)", "number")}
              ${this._renderTemplateInput("navigation", "default_background", "Default background (Template/CSS)")}
              ${this._renderTemplateInput("navigation", "default_icon_color", "Default icon color (Template/CSS)")}
            `, "Default look for navigation buttons.")}
            ${this._renderCategoryAccordion("Label Typography", html`
              ${this._renderInput("navigation", "label_font_size", "Label font size", "number")}
              ${this._renderInput("navigation", "label_font_weight", "Label font weight", "number")}
              ${this._renderInput("navigation", "label_letter_spacing", "Label letter spacing", "number")}
              ${this._renderSelect("navigation", "label_text_transform", "Label text transform", NAV_TEXT_TRANSFORM)}
              ${this._renderTemplateInput("navigation", "label_color", "Label color (Template/CSS)")}
            `, "Typography for navigation button labels.")}
            ${this._renderCategoryAccordion("Bottom Bar", html`
              ${this._renderInput("navigation", "bottom_bar_border_radius", "Bottom bar radius", "number")}
              ${this._renderTemplateInput("navigation", "bottom_bar_box_shadow", "Bottom bar box shadow (Template/CSS)")}
              ${this._renderInput("navigation", "bottom_bar_border_width", "Bottom bar border width", "number")}
              ${this._renderSelect("navigation", "bottom_bar_border_style", "Bottom bar border style", BORDER_STYLES)}
              ${this._renderTemplateInput("navigation", "bottom_bar_border_color", "Bottom bar border color (Template/CSS)")}
            `, "Style for the optional bottom bar container.")}
          </section>
        </details>

        <div class="footer">
          <button type="button" class="hki-reset-btn hki-reset-btn-danger" @click=${this._resetAll}>
            <ha-icon icon="mdi:restore-alert"></ha-icon>
            <span>Reset all globals</span>
          </button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .wrap {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 14px;
        overflow: visible;
      }
      :host, ha-card {
        overflow: visible;
      }
      .intro {
        border-radius: 12px;
        padding: 14px;
        background: linear-gradient(135deg, rgba(34, 49, 63, 0.9), rgba(33, 110, 160, 0.55));
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .title {
        font-size: 16px;
        font-weight: 700;
      }
      .sub {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.85;
      }
      .scope {
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.08);
        padding: 12px;
        overflow: visible;
      }
      .category {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
      }
      .category-accordion {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        overflow: visible;
      }
      .category-accordion > summary {
        list-style: none;
        cursor: pointer;
        user-select: none;
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 700;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
      }
      .category-accordion > summary::-webkit-details-marker {
        display: none;
      }
      .category-accordion > summary::after {
        content: "+";
        float: right;
        opacity: 0.8;
      }
      .category-accordion[open] > summary::after {
        content: "-";
      }
      .category-accordion > .category {
        border: none;
        border-radius: 0;
        background: transparent;
      }
      .category-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
        opacity: 0.9;
        margin-bottom: 8px;
      }
      .category-sub {
        font-size: 11px;
        opacity: 0.75;
        margin: 0 0 8px 0;
      }
      .scope-accordion {
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(0, 0, 0, 0.06);
        overflow: visible;
      }
      .scope-accordion > summary {
        list-style: none;
        cursor: pointer;
        user-select: none;
        padding: 12px 14px;
        font-weight: 700;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
      }
      .scope-accordion > summary::-webkit-details-marker {
        display: none;
      }
      .scope-accordion > summary::after {
        content: "+";
        float: right;
        opacity: 0.8;
      }
      .scope-accordion[open] > summary::after {
        content: "-";
      }
      .scope-accordion > .scope {
        border: none;
        border-radius: 0;
        background: transparent;
      }
      .scope-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }
      .scope-title {
        font-size: 14px;
        font-weight: 700;
      }
      .scope-sub {
        font-size: 11px;
        opacity: 0.75;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      ha-textfield, ha-select, ha-code-editor {
        width: 100%;
      }
      ha-code-editor {
        border-radius: 8px;
        overflow: hidden;
      }
      .tpl-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .tpl-title {
        font-size: 12px;
        font-weight: 600;
        opacity: 0.9;
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
      .hki-reset-btn-danger{
        border-color: var(--error-color, #d32f2f);
        background: var(--error-color, #d32f2f);
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      @media (max-width: 720px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

class HkiSettingsCard extends HkiSettingsBase {
  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  render() {
    if (!this._config) this._config = normalizeConfig({});
    return html`<ha-card>${this._renderForm()}</ha-card>`;
  }
}

class HkiSettingsCardEditor extends HkiSettingsBase {
  render() {
    if (!this._config) this._config = normalizeConfig({});
    return this._renderForm();
  }
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, HkiSettingsCard);
}
if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, HkiSettingsCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TYPE,
  name: "HKI Settings Card",
  description: "Global style defaults for HKI cards.",
  preview: false,
});
