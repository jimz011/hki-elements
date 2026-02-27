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

const NAV_TEXT_TRANSFORM = [
  { value: "none", label: "none" },
  { value: "uppercase", label: "uppercase" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "capitalize" },
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
    this._config = normalized;
  }

  _commitTemplateDrafts(baseConfig) {
    const next = normalizeConfig(baseConfig || this._config || DEFAULT_CONFIG);
    Object.entries(this._templateDrafts || {}).forEach(([compound, value]) => {
      const dot = compound.indexOf(".");
      if (dot <= 0) return;
      const scope = compound.slice(0, dot);
      const key = compound.slice(dot + 1);
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
        @selected=${(e) => this._setSelect(scope, key, e.target.value)}
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
          ? this._setNumber(scope, key, e.target.value)
          : this._setText(scope, key, e.target.value))}
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

  _renderCategory(title, fields, description = "") {
    return html`
      <div class="category">
        <div class="category-title">${title}</div>
        ${description ? html`<div class="category-sub">${description}</div>` : ""}
        <div class="grid">${fields}</div>
      </div>
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
            ${this._renderCategory("Card Surface", html`
              ${this._renderTemplateInput("button", "border_radius", "Border radius (Template/CSS)")}
              ${this._renderTemplateInput("button", "box_shadow", "Box shadow (Template/CSS)")}
              ${this._renderTemplateInput("button", "border_width", "Border width (Template/CSS)")}
              ${this._renderSelect("button", "border_style", "Border style", BORDER_STYLES)}
              ${this._renderTemplateInput("button", "border_color", "Border color (Template/CSS)")}
            `, "Styles the outer button container.")}
            ${this._renderCategory("Name Typography", html`
              ${this._renderSelect("button", "name_font_family", "Name font family", FONT_FAMILIES)}
              ${this._renderInput("button", "name_font_custom", "Name custom font")}
              ${this._renderSelect("button", "name_font_weight", "Name font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_name", "Name size", "number")}
              ${this._renderTemplateInput("button", "name_color", "Name color (Template/CSS)")}
            `, "Applies to the entity name text.")}
            ${this._renderCategory("State Typography", html`
              ${this._renderSelect("button", "state_font_family", "State font family", FONT_FAMILIES)}
              ${this._renderInput("button", "state_font_custom", "State custom font")}
              ${this._renderSelect("button", "state_font_weight", "State font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_state", "State size", "number")}
              ${this._renderTemplateInput("button", "state_color", "State color (Template/CSS)")}
            `, "Applies to the entity state text.")}
            ${this._renderCategory("Label Typography", html`
              ${this._renderSelect("button", "label_font_family", "Label font family", FONT_FAMILIES)}
              ${this._renderInput("button", "label_font_custom", "Label custom font")}
              ${this._renderSelect("button", "label_font_weight", "Label font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_label", "Label size", "number")}
              ${this._renderTemplateInput("button", "label_color", "Label color (Template/CSS)")}
            `, "Applies to optional label text.")}
            ${this._renderCategory("Info/Brightness Typography", html`
              ${this._renderSelect("button", "brightness_font_family", "Info font family", FONT_FAMILIES)}
              ${this._renderInput("button", "brightness_font_custom", "Info custom font")}
              ${this._renderSelect("button", "brightness_font_weight", "Info font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_brightness", "Info size", "number")}
              ${this._renderTemplateInput("button", "brightness_color", "Info color (Template/CSS)")}
            `, "Applies to info/brightness line text.")}
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Header Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Header Card Defaults", "header", "Applied to hki-header-card when a field is empty.")}
            ${this._renderCategory("Card Surface", html`
              ${this._renderTemplateInput("header", "card_border_radius", "Card border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_border_radius_top", "Top border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_border_radius_bottom", "Bottom border radius (Template/CSS)")}
              ${this._renderTemplateInput("header", "card_box_shadow", "Card box shadow (Template/CSS)")}
              ${this._renderInput("header", "card_border_width", "Card border width", "number")}
              ${this._renderSelect("header", "card_border_style", "Card border style", BORDER_STYLES)}
              ${this._renderTemplateInput("header", "card_border_color", "Card border color (Template/CSS)")}
            `, "Styles the header card frame and border.")}
            ${this._renderCategory("Typography", html`
              ${this._renderSelect("header", "font_family", "Font family", FONT_FAMILIES)}
              ${this._renderInput("header", "font_family_custom", "Custom font")}
              ${this._renderSelect("header", "font_style", "Font style", [{ value: "normal", label: "normal" }, { value: "italic", label: "italic" }])}
              ${this._renderInput("header", "title_size_px", "Title size", "number")}
              ${this._renderInput("header", "subtitle_size_px", "Subtitle size", "number")}
              ${this._renderSelect("header", "title_weight", "Title weight", FONT_WEIGHTS)}
              ${this._renderSelect("header", "subtitle_weight", "Subtitle weight", FONT_WEIGHTS)}
              ${this._renderTemplateInput("header", "title_color", "Title color (Template/CSS)")}
              ${this._renderTemplateInput("header", "subtitle_color", "Subtitle color (Template/CSS)")}
            `, "Title/subtitle font and text color defaults.")}
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Navigation Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Navigation Card Defaults", "navigation", "Applied to hki-navigation-card when a field is empty.")}
            ${this._renderCategory("Button Surface", html`
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
            ${this._renderCategory("Label Typography", html`
              ${this._renderInput("navigation", "label_font_size", "Label font size", "number")}
              ${this._renderInput("navigation", "label_font_weight", "Label font weight", "number")}
              ${this._renderInput("navigation", "label_letter_spacing", "Label letter spacing", "number")}
              ${this._renderSelect("navigation", "label_text_transform", "Label text transform", NAV_TEXT_TRANSFORM)}
              ${this._renderTemplateInput("navigation", "label_color", "Label color (Template/CSS)")}
            `, "Typography for navigation button labels.")}
            ${this._renderCategory("Bottom Bar", html`
              ${this._renderInput("navigation", "bottom_bar_border_radius", "Bottom bar radius", "number")}
              ${this._renderTemplateInput("navigation", "bottom_bar_box_shadow", "Bottom bar box shadow (Template/CSS)")}
              ${this._renderInput("navigation", "bottom_bar_border_width", "Bottom bar border width", "number")}
              ${this._renderSelect("navigation", "bottom_bar_border_style", "Bottom bar border style", BORDER_STYLES)}
              ${this._renderTemplateInput("navigation", "bottom_bar_border_color", "Bottom bar border color (Template/CSS)")}
            `, "Style for the optional bottom bar container.")}
          </section>
        </details>

        <div class="footer">
          <button type="button" class="hki-reset-btn" @click=${() => this._saveNow()}>
            <ha-icon icon="mdi:content-save"></ha-icon>
            <span>Save settings</span>
          </button>
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
      }
      .category {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
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
        overflow: hidden;
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
