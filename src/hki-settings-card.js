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
  title: "HKI Global Settings",
  button: {},
  header: {},
  navigation: {},
});

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
  c.button = (c.button && typeof c.button === "object") ? { ...c.button } : {};
  c.header = (c.header && typeof c.header === "object") ? { ...c.header } : {};
  c.navigation = (c.navigation && typeof c.navigation === "object") ? { ...c.navigation } : {};
  return c;
}

class HkiSettingsBase extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
    };
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._publishGlobals();
  }

  _publishGlobals() {
    const cfg = this._config || DEFAULT_CONFIG;
    window.HKI?.setGlobalSettings?.({
      button: sanitizeScope(cfg.button),
      header: sanitizeScope(cfg.header),
      navigation: sanitizeScope(cfg.navigation),
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
    if (!value || value.trim() === "") delete next[scope][key];
    else next[scope][key] = value.trim();
    this._emitChanged(next);
  }

  _setNumber(scope, key, value) {
    const next = normalizeConfig(this._config);
    const raw = String(value ?? "").trim();
    if (raw === "") delete next[scope][key];
    else {
      const n = Number(raw);
      if (Number.isFinite(n)) next[scope][key] = n;
      else delete next[scope][key];
    }
    this._emitChanged(next);
  }

  _setSelect(scope, key, value) {
    const next = normalizeConfig(this._config);
    if (!value || value === "__inherit__") delete next[scope][key];
    else next[scope][key] = value;
    this._emitChanged(next);
  }

  _resetScope(scope) {
    const next = normalizeConfig(this._config);
    next[scope] = {};
    this._emitChanged(next);
  }

  _resetAll() {
    this._emitChanged(normalizeConfig({ type: `custom:${CARD_TYPE}` }));
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
        @change=${(e) => (type === "number"
          ? this._setNumber(scope, key, e.target.value)
          : this._setText(scope, key, e.target.value))}
      ></ha-textfield>
    `;
  }

  _renderScopeHeader(title, scope, subtitle) {
    return html`
      <div class="scope-head">
        <div>
          <div class="scope-title">${title}</div>
          <div class="scope-sub">${subtitle}</div>
        </div>
        <mwc-button @click=${() => this._resetScope(scope)}>Reset ${scope}</mwc-button>
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

        <details class="scope-accordion" open>
          <summary>Button Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Button Card Defaults", "button", "Applied to hki-button-card when a field is empty.")}
            <div class="grid">
              ${this._renderInput("button", "border_radius", "Border radius (px or CSS)")}
              ${this._renderInput("button", "box_shadow", "Box shadow")}
              ${this._renderInput("button", "border_width", "Border width")}
              ${this._renderSelect("button", "border_style", "Border style", BORDER_STYLES)}
              ${this._renderInput("button", "border_color", "Border color")}
              ${this._renderSelect("button", "name_font_family", "Name font family", FONT_FAMILIES)}
              ${this._renderInput("button", "name_font_custom", "Name custom font")}
              ${this._renderSelect("button", "name_font_weight", "Name font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_name", "Name size", "number")}
              ${this._renderInput("button", "name_color", "Name color")}
              ${this._renderSelect("button", "state_font_family", "State font family", FONT_FAMILIES)}
              ${this._renderInput("button", "state_font_custom", "State custom font")}
              ${this._renderSelect("button", "state_font_weight", "State font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_state", "State size", "number")}
              ${this._renderInput("button", "state_color", "State color")}
              ${this._renderSelect("button", "label_font_family", "Label font family", FONT_FAMILIES)}
              ${this._renderInput("button", "label_font_custom", "Label custom font")}
              ${this._renderSelect("button", "label_font_weight", "Label font weight", FONT_WEIGHTS)}
              ${this._renderInput("button", "size_label", "Label size", "number")}
              ${this._renderInput("button", "label_color", "Label color")}
            </div>
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Header Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Header Card Defaults", "header", "Applied to hki-header-card when a field is empty.")}
            <div class="grid">
              ${this._renderInput("header", "card_border_radius", "Card border radius")}
              ${this._renderInput("header", "card_border_radius_top", "Top border radius")}
              ${this._renderInput("header", "card_border_radius_bottom", "Bottom border radius")}
              ${this._renderInput("header", "card_box_shadow", "Card box shadow")}
              ${this._renderInput("header", "card_border_width", "Card border width", "number")}
              ${this._renderSelect("header", "card_border_style", "Card border style", BORDER_STYLES)}
              ${this._renderInput("header", "card_border_color", "Card border color")}
              ${this._renderSelect("header", "font_family", "Font family", FONT_FAMILIES)}
              ${this._renderInput("header", "font_family_custom", "Custom font")}
              ${this._renderSelect("header", "font_style", "Font style", [{ value: "normal", label: "normal" }, { value: "italic", label: "italic" }])}
              ${this._renderInput("header", "title_size_px", "Title size", "number")}
              ${this._renderInput("header", "subtitle_size_px", "Subtitle size", "number")}
              ${this._renderInput("header", "title_color", "Title color")}
              ${this._renderInput("header", "subtitle_color", "Subtitle color")}
            </div>
          </section>
        </details>

        <details class="scope-accordion">
          <summary>Navigation Card Defaults</summary>
          <section class="scope">
            ${this._renderScopeHeader("Navigation Card Defaults", "navigation", "Applied to hki-navigation-card when a field is empty.")}
            <div class="grid">
              ${this._renderInput("navigation", "default_border_radius", "Default border radius", "number")}
              ${this._renderInput("navigation", "default_border_width", "Default border width", "number")}
              ${this._renderSelect("navigation", "default_border_style", "Default border style", BORDER_STYLES)}
              ${this._renderInput("navigation", "default_border_color", "Default border color")}
              ${this._renderInput("navigation", "button_box_shadow", "Button box shadow")}
              ${this._renderInput("navigation", "button_box_shadow_hover", "Button box shadow hover")}
              ${this._renderInput("navigation", "label_font_size", "Label font size", "number")}
              ${this._renderInput("navigation", "label_font_weight", "Label font weight", "number")}
              ${this._renderInput("navigation", "label_letter_spacing", "Label letter spacing", "number")}
              ${this._renderSelect("navigation", "label_text_transform", "Label text transform", NAV_TEXT_TRANSFORM)}
              ${this._renderInput("navigation", "label_color", "Label color")}
            </div>
          </section>
        </details>

        <div class="footer">
          <mwc-button @click=${this._resetAll}>Reset all globals</mwc-button>
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
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.08);
        padding: 12px;
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
      ha-textfield, ha-select {
        width: 100%;
      }
      .footer {
        display: flex;
        justify-content: flex-end;
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
  preview: true,
});
