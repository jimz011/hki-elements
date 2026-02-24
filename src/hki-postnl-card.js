// HKI PostNL Card
const { LitElement, html, css } = window.HKI.getLit();
const CARD_VERSION = '1.0.2';

// Default External Assets
const DEFAULT_LOGO = "https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-logo.png?raw=true";
const DEFAULT_VAN = "https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-van.gif?raw=true";
const DEFAULT_BANNER = "https://github.com/jimz011/hki-postnl-card/blob/main/images/postnl-banner.jpg?raw=true";

class HKIPostNLCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._activeTab = 'onderweg';
        this._selectedParcel = null;
        this._isRendered = false;
    }

    set hass(hass) {
        this._hass = hass;
        if (this.config && this._isRendered) {
            this.updateContent();
        } else if (this.config) {
            this.render();
        }
    }

    setConfig(config) {
        if (!config.entity) {
            // Allow render even if entity missing to show error state
        }
        this.config = {
            title: 'PostNL',
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            logo_path: DEFAULT_LOGO,
            van_path: DEFAULT_VAN,
            header_color: '',
            header_text_color: '',
            placeholder_image: DEFAULT_BANNER,
            distribution_entity: '',
            layout_order: ['header', 'animation', 'tabs', 'list'],
            ...config
        };
        
        if (!Array.isArray(this.config.layout_order) || this.config.layout_order.length === 0) {
            this.config.layout_order = ['header', 'animation', 'tabs', 'list'];
        }

        this._logoSrc = this.config.logo_path || DEFAULT_LOGO;
        this._vanSrc = this.config.van_path || DEFAULT_VAN;
        
        if (this._hass) {
            this.render();
        }
    }

    static getConfigElement() {
        return document.createElement("hki-postnl-card-editor");
    }

    static getStubConfig() {
        return { 
            entity: "sensor.postnl_delivery",
            distribution_entity: "sensor.postnl_distribution",
            title: "PostNL",
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            logo_path: DEFAULT_LOGO,
            van_path: DEFAULT_VAN,
            placeholder_image: DEFAULT_BANNER,
            header_color: '',
            header_text_color: '',
            layout_order: ['header', 'animation', 'tabs', 'list']
        };
    }

    getCardSize() {
        return 4;
    }

    formatDate(dateStr) {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('nl-NL', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    }

    getData() {
        if (!this.config.entity) return null;
        const entityId = this.config.entity;
        const stateObj = this._hass ? this._hass.states[entityId] : null;

        if (!stateObj) return null;

        const attrs = stateObj.attributes;
        let shipments = [];
        
        if (Array.isArray(attrs)) {
            shipments = attrs;
        } else if (attrs.enroute || attrs.en_route || attrs.delivered) {
            const enrouteArray = Array.isArray(attrs.enroute) ? attrs.enroute : (Array.isArray(attrs.en_route) ? attrs.en_route : []);
            const deliveredArray = Array.isArray(attrs.delivered) ? attrs.delivered : [];
            shipments = [...enrouteArray, ...deliveredArray];
        } else if (attrs.shipments) {
            shipments = attrs.shipments;
        } else if (attrs.parcels) {
            shipments = attrs.parcels;
        } else {
            shipments = Object.values(attrs).filter(item => item && item.key);
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - (this.config.days_back || 90));

        shipments = shipments.filter(item => {
            if (!item.delivered) return true;
            const dDate = new Date(item.delivery_date || item.planned_date || 0);
            return dDate >= cutoffDate;
        });

        return shipments;
    }

    getDistributionData() {
        if (!this.config.distribution_entity) return [];
        
        const stateObj = this._hass ? this._hass.states[this.config.distribution_entity] : null;
        if (!stateObj) return [];

        const attrs = stateObj.attributes;
        let shipments = [];
        
        if (Array.isArray(attrs)) {
            shipments = attrs;
        } else if (attrs.en_route || attrs.delivered || attrs.Enroute || attrs.Delivered) {
            const enroute = attrs.en_route || attrs.Enroute || [];
            const delivered = attrs.delivered || attrs.Delivered || [];
            shipments = [...enroute, ...delivered];
        } else if (attrs.shipments) {
            shipments = attrs.shipments;
        } else if (attrs.parcels) {
            shipments = attrs.parcels;
        } else {
            shipments = Object.values(attrs).filter(item => item && item.key);
        }

        return shipments;
    }

    getFilteredShipments(shipments, distributionShipments) {
        let filtered = [];
        
        if (this._activeTab === 'onderweg') {
            filtered = shipments.filter(item => !item.delivered);
        } else if (this._activeTab === 'bezorgd') {
            filtered = shipments.filter(item => item.delivered);
        } else if (this._activeTab === 'verzonden') {
            filtered = distributionShipments;
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.delivery_date || a.planned_date || a.expected_datetime || 0);
            const dateB = new Date(b.delivery_date || b.planned_date || b.expected_datetime || 0);
            return dateB - dateA;
        });

        return filtered;
    }

    handleTabClick(e) {
        const tab = e.currentTarget.dataset.tab;
        if (tab === this._activeTab) return;
        
        this._activeTab = tab;
        this._selectedParcel = null;
        this.updateContent();
    }

    handleParcelClick(e) {
        const key = e.currentTarget.dataset.key;
        
        if (this._selectedParcel === key) {
            this._selectedParcel = null;
        } else {
            this._selectedParcel = key;
        }
        
        this.updateContent();
    }

    updateContent() {
        if (!this._isRendered) return;

        const shipments = this.getData();
        const distributionShipments = this.getDistributionData();
        if (!shipments) return;

        const displayedShipments = this.getFilteredShipments(shipments, distributionShipments);
        const activeCount = shipments.filter(s => !s.delivered).length;
        const recentCount = shipments.filter(s => s.delivered).length;

        const statsEl = this.shadowRoot.querySelector('.header-stats');
        const statsBarEl = this.shadowRoot.querySelector('.stats-text');
        
        const statsText = `${activeCount} onderweg • ${recentCount} recent`;
        if (statsEl) statsEl.textContent = statsText;
        if (statsBarEl) statsBarEl.textContent = statsText;

        this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
            if (tab.dataset.tab === this._activeTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        this.updateAnimation(displayedShipments);
        this.updateList(displayedShipments);
    }

    updateAnimation(displayedShipments) {
        const animationEl = this.shadowRoot.querySelector('.header-animation');
        if (!animationEl) return;

        const selectedParcelData = this._selectedParcel 
            ? displayedShipments.find(s => s.key === this._selectedParcel)
            : null;

        if (this.config.show_animation && selectedParcelData) {
            const vanPos = selectedParcelData.delivered ? '75%' : '25%';
            const statusText = selectedParcelData.delivered ? 'Bezorgd' : 'Onderweg';
            
            animationEl.classList.add('animation-active');
            
            animationEl.innerHTML = `
                <div class="visual-road">
                    <div class="house-bg">🏠</div>
                    <div class="road-line"></div>
                    <img class="van-img" src="${this._vanSrc}" style="margin-left: ${vanPos};" alt="PostNL Van">
                </div>
                <div class="animation-info">
                    <strong>${selectedParcelData.name}</strong> • ${statusText}
                </div>
            `;
        } else {
            animationEl.classList.remove('animation-active');
            
            if (this.config.show_placeholder) {
                if (!this.config.placeholder_image) {
                    animationEl.innerHTML = `
                        <div class="animation-placeholder">
                            <div class="placeholder-text">Selecteer een pakket voor animatie</div>
                        </div>
                    `;
                } else {
                    animationEl.innerHTML = '';
                }
            } else {
                animationEl.innerHTML = '';
            }
        }
    }

    updateList(displayedShipments) {
        const listEl = this.shadowRoot.querySelector('.list');
        if (!listEl) return;

        const currentKeys = Array.from(listEl.querySelectorAll('.parcel-header')).map(el => el.dataset.key);
        const newKeys = displayedShipments.map(s => s.key);
        const needsRebuild = JSON.stringify(currentKeys) !== JSON.stringify(newKeys);

        if (displayedShipments.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <ha-icon icon="mdi:package-variant-closed" style="width: 48px; height: 48px; margin-bottom: 10px;"></ha-icon>
                    <div>Geen pakketten in deze categorie</div>
                </div>`;
            return;
        }

        if (needsRebuild) {
            listEl.innerHTML = displayedShipments.map(item => {
                const isDelivered = item.delivered;
                const statusMsg = item.status_message || (isDelivered ? "Bezorgd" : "Onderweg");
                const dateLabel = this.formatDate(item.delivery_date || item.planned_date || item.planned_to);
                
                return `
                <div class="parcel" data-key="${item.key}">
                    <div class="parcel-header" data-key="${item.key}">
                        <div class="ph-left">
                            <span class="ph-name">${item.name || 'Onbekend'}</span>
                            <span class="ph-status">
                                <ha-icon class="ph-status-icon" icon="${isDelivered ? 'mdi:check-circle' : 'mdi:truck-delivery'}" style="width:16px;height:16px;"></ha-icon>
                                ${statusMsg}
                            </span>
                        </div>
                        <div class="ph-right">
                            <div class="ph-date">${dateLabel || ''}</div>
                            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
                        </div>
                    </div>
                    
                    <div class="details-panel">
                        <div class="detail-row">
                            <strong>Track & Trace:</strong> ${item.key}
                        </div>
                        ${item.shipment_type ? `<div class="detail-row"><strong>Type:</strong> ${item.shipment_type === 'LetterboxParcel' ? 'Brievenbuspakje' : 'Pakket'}</div>` : ''}
                        ${item.delivery_address_type ? `<div class="detail-row"><strong>Bezorging:</strong> ${item.delivery_address_type === 'ServicePoint' ? 'Afhaalpunt' : 'Thuisbezorging'}</div>` : ''}
                        <a href="${item.url}" target="_blank" class="btn-track">OPEN TRACK & TRACE ↗</a>
                    </div>
                </div>`;
            }).join('');

            this.shadowRoot.querySelectorAll('.parcel-header').forEach(el => {
                el.addEventListener('click', this.handleParcelClick.bind(this));
            });
        } else {
            this.shadowRoot.querySelectorAll('.parcel').forEach(parcelEl => {
                const key = parcelEl.dataset.key;
                if (key === this._selectedParcel) {
                    parcelEl.classList.add('selected');
                } else {
                    parcelEl.classList.remove('selected');
                }
            });
        }
    }

    render() {
        const shipments = this.getData();
        const distributionShipments = this.getDistributionData();
        
        if (!shipments) {
            this.shadowRoot.innerHTML = `<ha-card style="padding:16px; color:red;">Entiteit niet gevonden of niet geconfigureerd.<br><br>Installeer a.u.b. de <a href="https://github.com/arjenbos/ha-postnl" target="_blank">arjenbos/ha-postnl</a> integratie.</ha-card>`;
            return;
        }

        const displayedShipments = this.getFilteredShipments(shipments, distributionShipments);
        const activeCount = shipments.filter(s => !s.delivered).length;
        const recentCount = shipments.filter(s => s.delivered).length;
        const headerColor = this.config.header_color || 'var(--card-background-color)';
        const headerTextColor = this.config.header_text_color || 'var(--primary-text-color)';
        const placeholderImage = this.config.placeholder_image || DEFAULT_BANNER;

        const css = `
        <style>
            :host { 
                --postnl-orange: #ed8c00; 
                --postnl-purple: ${headerColor};
                --header-text: ${headerTextColor};
                --placeholder-image: ${placeholderImage ? `url('${placeholderImage}')` : 'none'};
                --bg-color: var(--card-background-color, white); 
            }
            ha-card { 
                background: var(--bg-color); 
                color: var(--primary-text-color); 
                overflow: hidden; 
                border-radius: 12px; 
            }
            
            /* Header Block */
            .header { 
                background: var(--postnl-purple);
                padding: 16px; 
                color: var(--header-text); 
                display: flex; 
                align-items: center; 
                gap: 12px; 
            }
            .header img { 
                height: 36px; 
                border-radius: 6px; 
                background: white; 
                padding: 4px; 
            }
            .header-info { 
                display: flex; 
                flex-direction: column; 
                flex: 1;
            }
            .header-title { 
                font-weight: bold; 
                font-size: 1.1em; 
            }
            .header-stats { 
                font-size: 0.8em; 
                opacity: 0.9; 
            }
            .stats-bar {
                background: var(--secondary-background-color, #f5f5f5);
                padding: 8px 16px;
                border-bottom: 1px solid var(--divider-color, #eee);
                text-align: center;
            }
            .stats-text {
                font-size: 0.85em;
                color: var(--secondary-text-color);
                font-weight: 500;
            }

            /* Tabs Block */
            .tabs { 
                display: flex; 
                background: var(--secondary-background-color, #f5f5f5); 
                border-bottom: 1px solid var(--divider-color, #eee); 
            }
            .tab { 
                flex: 1; 
                text-align: center; 
                padding: 12px; 
                cursor: pointer; 
                font-size: 0.9em; 
                font-weight: 500; 
                color: var(--secondary-text-color); 
                position: relative; 
                transition: all 0.2s;
                user-select: none;
            }
            .tab:hover {
                background: rgba(237, 140, 0, 0.1);
            }
            .tab.active { 
                color: var(--postnl-orange); 
                font-weight: bold; 
            }
            .tab.active::after { 
                content: ''; 
                position: absolute; 
                bottom: 0; 
                left: 0; 
                right: 0; 
                height: 3px; 
                background: var(--postnl-orange); 
            }

            /* Animation Block */
            .header-animation {
                background-image: var(--placeholder-image);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                padding: 16px;
                border-bottom: 1px solid var(--divider-color);
                height: 150px;
                box-sizing: border-box;
            }
            .header-animation.animation-active {
                background-image: none !important;
                background-color: var(--card-background-color);
            }
            .visual-road { 
                position: relative; 
                height: 80px; 
                display: flex; 
                align-items: center; 
                overflow: hidden;
                background: var(--card-background-color, white);
            }
            .road-line { 
                position: absolute; 
                bottom: 20px; 
                left: 0; 
                right: 0; 
                height: 3px; 
                background: repeating-linear-gradient(
                    to right,
                    #ccc 0px,
                    #ccc 15px,
                    transparent 15px,
                    transparent 30px
                );
                z-index: 1; 
            }
            .house-bg { 
                position: absolute; 
                right: 30px; 
                bottom: 15px; 
                font-size: 36px; 
                opacity: 0.3; 
                z-index: 0; 
            }
            .van-img { 
                height: 50px; 
                z-index: 2; 
                transition: margin-left 1.5s ease-in-out; 
                margin-bottom: 6px; 
                position: relative;
            }
            .animation-info {
                text-align: center;
                margin-top: 8px;
                font-size: 0.85em;
                color: var(--secondary-text-color);
                background: var(--card-background-color, white);
            }
            .animation-info strong {
                color: var(--primary-text-color);
            }
            .animation-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 118px;
            }
            .placeholder-text {
                color: var(--secondary-text-color);
                font-size: 0.9em;
                opacity: 0.6;
            }

            /* List Block */
            .list { 
                padding: 0; 
                margin: 0; 
                max-height: 500px;
                overflow-y: auto;
            }
            .empty-state { 
                padding: 40px; 
                text-align: center; 
                color: var(--secondary-text-color); 
                opacity: 0.7; 
            }
            
            .parcel { 
                border-bottom: 1px solid var(--divider-color, #eee); 
            }
            .parcel.selected {
                background: rgba(237, 140, 0, 0.05);
            }
            .parcel-header { 
                padding: 16px; 
                cursor: pointer; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                transition: background 0.2s;
                user-select: none;
            }
            .parcel-header:hover { 
                background: var(--secondary-background-color); 
            }
            
            .ph-left { 
                display: flex; 
                flex-direction: column;
                flex: 1;
            }
            .ph-name { 
                font-weight: 600; 
                font-size: 1em;
                margin-bottom: 4px;
            }
            .ph-status { 
                font-size: 0.85em; 
                color: var(--secondary-text-color); 
                display: flex; 
                align-items: center; 
                gap: 10px; 
            }
            .ph-status-icon { 
                color: var(--postnl-orange);
                flex-shrink: 0;
                display: flex;
                align-items: center;
            }

            .ph-right { 
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
            }
            .ph-date {
                font-size: 0.85em; 
                color: var(--secondary-text-color); 
            }
            .chevron { 
                transition: transform 0.3s;
                margin-left: 8px;
            }
            .selected .chevron { 
                transform: rotate(180deg); 
                color: var(--postnl-orange);
            }

            .details-panel {
                padding: 12px 16px;
                background: var(--secondary-background-color);
                border-top: 1px solid var(--divider-color);
                font-size: 0.9em;
                color: var(--secondary-text-color);
                display: none;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            }
            .selected .details-panel {
                display: block;
                max-height: 200px;
            }
            .detail-row {
                margin-bottom: 6px;
            }
            .detail-row strong {
                color: var(--primary-text-color);
            }
            .btn-track { 
                background: var(--postnl-orange); 
                color: white; 
                text-decoration: none; 
                padding: 8px 16px; 
                border-radius: 6px; 
                font-size: 0.9em; 
                font-weight: 600; 
                display: inline-block;
                margin-top: 8px;
                transition: all 0.2s;
            }
            .btn-track:hover {
                background: #d17a00;
                box-shadow: 0 2px 8px rgba(237, 140, 0, 0.3);
            }
            .list::-webkit-scrollbar {
                width: 6px;
            }
            .list::-webkit-scrollbar-track {
                background: transparent;
            }
            .list::-webkit-scrollbar-thumb {
                background: var(--divider-color);
                border-radius: 3px;
            }
        </style>
        `;

        // Pre-build list HTML
        let listHtml = '';
        if (displayedShipments.length === 0) {
            listHtml = `
            <div class="empty-state">
                <ha-icon icon="mdi:package-variant-closed" style="width: 48px; height: 48px; margin-bottom: 10px;"></ha-icon>
                <div>Geen pakketten in deze categorie</div>
            </div>`;
        } else {
            listHtml = displayedShipments.map(item => {
                const isDelivered = item.delivered;
                const statusMsg = item.status_message || (isDelivered ? "Bezorgd" : "Onderweg");
                const dateLabel = this.formatDate(item.delivery_date || item.planned_date || item.planned_to);
                
                return `
                <div class="parcel" data-key="${item.key}">
                    <div class="parcel-header" data-key="${item.key}">
                        <div class="ph-left">
                            <span class="ph-name">${item.name || 'Onbekend'}</span>
                            <span class="ph-status">
                                <ha-icon class="ph-status-icon" icon="${isDelivered ? 'mdi:check-circle' : 'mdi:truck-delivery'}" style="width:16px;height:16px;"></ha-icon>
                                ${statusMsg}
                            </span>
                        </div>
                        <div class="ph-right">
                            <div class="ph-date">${dateLabel || ''}</div>
                            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
                        </div>
                    </div>
                    
                    <div class="details-panel">
                        <div class="detail-row">
                            <strong>Track & Trace:</strong> ${item.key}
                        </div>
                        ${item.shipment_type ? `<div class="detail-row"><strong>Type:</strong> ${item.shipment_type === 'LetterboxParcel' ? 'Brievenbuspakje' : 'Pakket'}</div>` : ''}
                        ${item.delivery_address_type ? `<div class="detail-row"><strong>Bezorging:</strong> ${item.delivery_address_type === 'ServicePoint' ? 'Afhaalpunt' : 'Thuisbezorging'}</div>` : ''}
                        <a href="${item.url}" target="_blank" class="btn-track">OPEN TRACK & TRACE ↗</a>
                    </div>
                </div>`;
            }).join('');
        }

        // Define Blocks
        const blocks = {
            header: this.config.show_header ? `
                <div class="header">
                    <img src="${this._logoSrc}" alt="PostNL Logo">
                    <div class="header-info">
                        <span class="header-title">${this.config.title || 'PostNL'}</span>
                        <span class="header-stats">${activeCount} onderweg • ${recentCount} recent</span>
                    </div>
                </div>
                ` : `
                <div class="stats-bar">
                    <span class="stats-text">${activeCount} onderweg • ${recentCount} recent</span>
                </div>
            `,
            animation: this.config.show_placeholder !== false ? `<div class="header-animation"></div>` : '',
            tabs: `
                <div class="tabs">
                    <div class="tab ${this._activeTab === 'onderweg' ? 'active' : ''}" data-tab="onderweg">Onderweg</div>
                    ${this.config.show_delivered ? `<div class="tab ${this._activeTab === 'bezorgd' ? 'active' : ''}" data-tab="bezorgd">Bezorgd</div>` : ''}
                    ${this.config.show_sent ? `<div class="tab ${this._activeTab === 'verzonden' ? 'active' : ''}" data-tab="verzonden">Verzonden</div>` : ''}
                </div>
            `,
            list: `<div class="list">${listHtml}</div>`
        };

        // Construct HTML based on layout order
        const layoutOrder = this.config.layout_order || ['header', 'animation', 'tabs', 'list'];
        const contentHtml = layoutOrder.map(blockName => blocks[blockName] || '').join('');

        this.shadowRoot.innerHTML = css + `<ha-card>${contentHtml}</ha-card>`;
        this._isRendered = true;
        
        this.shadowRoot.querySelectorAll('.tab').forEach(el => {
            el.addEventListener('click', this.handleTabClick.bind(this));
        });
        this.shadowRoot.querySelectorAll('.parcel-header').forEach(el => {
            el.addEventListener('click', this.handleParcelClick.bind(this));
        });
    }
}

// EDITOR CLASS
class HKIPostNLCardEditor extends LitElement {
    static get properties() {
        return {
            hass: { type: Object },
            _config: { attribute: false }
        };
    }

    constructor() {
        super();
        this._config = {};
    }

    setConfig(config) {
        this._config = {
            entity: 'sensor.postnl_delivery',
            distribution_entity: 'sensor.postnl_distribution',
            title: 'PostNL',
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            logo_path: DEFAULT_LOGO,
            van_path: DEFAULT_VAN,
            header_color: '',
            header_text_color: '',
            placeholder_image: DEFAULT_BANNER,
            layout_order: ['header', 'animation', 'tabs', 'list'],
            ...config
        };
        // Ensure defaults if keys missing
        if (!this._config.layout_order) this._config.layout_order = ['header', 'animation', 'tabs', 'list'];
    }

    _renderEntityPicker(label, field, value, helper = "") {
        return html`
            <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: {} }}
                .value=${value || ""}
                .label=${label}
                .helper=${helper}
                @value-changed=${(ev) => this._changed(ev, field)}
            ></ha-selector>
        `;
    }

    _val(ev) {
        return ev.detail?.value ?? ev.target?.value;
    }

    _changed(ev, explicitField = null) {
        ev.stopPropagation();
        const field = explicitField || ev.target?.dataset?.field;
        if (!field || !this._config) return;

        let value = this._val(ev);

        // Handle numeric fields
        const numeric = new Set(['days_back']);
        if (numeric.has(field)) {
            value = parseInt(value, 10);
        }

        // Handle boolean fields
        const bools = new Set(['show_delivered', 'show_sent', 'show_animation', 'show_header', 'show_placeholder']);
        if (bools.has(field)) {
            value = !!(ev.target?.checked ?? value);
        }

        const next = { ...this._config, [field]: value };
        this._config = next;

        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: next },
            bubbles: true,
            composed: true
        }));
    }

    _moveBlock(index, direction) {
        if (!this._config.layout_order) return;
        const newOrder = [...this._config.layout_order];
        
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        
        this._config = { ...this._config, layout_order: newOrder };
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        }));
    }

    static get styles() {
        return css`
            .card-config {
                padding: 16px;
            }
            .section {
                margin-top: 24px;
                margin-bottom: 12px;
                font-weight: 600;
                font-size: 14px;
                color: var(--primary-text-color);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid var(--divider-color);
                padding-bottom: 8px;
            }
            .helper-text {
                font-size: 12px;
                color: var(--secondary-text-color);
                margin: 4px 0 16px 0;
                font-style: italic;
            }
            .inline-fields-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            ha-selector,
            ha-textfield {
                width: 100%;
                margin-bottom: 16px;
            }
            .switch-row {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 8px;
                width: 100%;
            }
            .switch-row ha-switch {
                flex-shrink: 0;
                margin-bottom: 0;
            }
            .switch-row span {
                font-size: 14px;
                color: var(--primary-text-color);
                flex: 1;
                line-height: 1.4;
            }
            /* Sortable list styling */
            .sort-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--secondary-background-color);
                border: 1px solid var(--divider-color);
                padding: 8px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
            }
            .sort-label {
                font-weight: 500;
                text-transform: capitalize;
            }
            .sort-actions ha-icon-button {
                color: var(--secondary-text-color);
            }
            .sort-actions ha-icon-button:hover {
                color: var(--primary-text-color);
            }
            /* Warning Box Styling */
            .warning-box {
                background-color: var(--secondary-background-color);
                border: 1px solid var(--divider-color);
                border-left: 4px solid #ed8c00;
                padding: 12px;
                margin-bottom: 24px;
                font-size: 13px;
                line-height: 1.4;
                border-radius: 4px;
                color: var(--primary-text-color);
            }
            .warning-title {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }
            .warning-box a {
                color: var(--primary-color, #03a9f4);
                text-decoration: underline;
            }
            .warning-error {
                margin-top: 8px; 
                color: var(--error-color, red);
                font-weight: 500;
            }
        `;
    }

    render() {
        if (!this._config) return html``;
        
        const layoutLabels = {
            'header': 'Header (Logo/Titel)',
            'animation': 'Animatie / Afbeelding',
            'tabs': 'Navigatie Tabs',
            'list': 'Pakketten Lijst'
        };

        const currentLayout = this._config.layout_order || ['header', 'animation', 'tabs', 'list'];

        return html`
            <div class="card-config">
                <div class="warning-box">
                    <div class="warning-title">⚠️ Requirement</div>
                    <div><strong>This card requires the PostNL integration.</strong></div>
                    <div>You must install and configure the <a href="https://github.com/arjenbos/ha-postnl" target="_blank">PostNL Integration by Arjen Bos</a> before using this card.</div>
                    <div style="margin-top: 8px;">Please read the <a href="https://jimz011.github.io/hki-elements/" target="_blank" rel="noopener noreferrer">documentation</a> to set up this card.</div>
                    <div class="warning-error">This card may contain bugs. Use at your own risk!</div>
                </div>

                <div class="section">Basis Instellingen</div>
                
                ${this._renderEntityPicker(
                    "PostNL Ontvangst Entity",
                    "entity",
                    this._config.entity,
                    "De entity voor ontvangen pakketten (standaard: sensor.postnl_delivery)"
                )}

                ${this._renderEntityPicker(
                    "PostNL Verzending Entity (Optioneel)",
                    "distribution_entity",
                    this._config.distribution_entity || "",
                    "De entity voor verzonden pakketten (standaard: sensor.postnl_distribution)"
                )}

                <ha-textfield
                    label="Kaartnaam"
                    .value=${this._config.title || 'PostNL'}
                    placeholder="PostNL"
                    data-field="title"
                    @input=${this._changed}
                ></ha-textfield>

                <ha-textfield
                    label="Aantal dagen geschiedenis"
                    type="number"
                    .value=${String(this._config.days_back || 90)}
                    min="1"
                    max="365"
                    data-field="days_back"
                    @input=${this._changed}
                ></ha-textfield>

                <div class="section">Layout Volgorde</div>
                <div class="helper-text">Gebruik de pijltjes om de blokken te herschikken</div>
                ${currentLayout.map((item, index) => html`
                    <div class="sort-item">
                        <span class="sort-label">${layoutLabels[item] || item}</span>
                        <div class="sort-actions">
                            <ha-icon-button 
                                .path=${"M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"}
                                @click=${() => this._moveBlock(index, 'up')}
                                ?disabled=${index === 0}
                            ></ha-icon-button>
                            <ha-icon-button 
                                .path=${"M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"}
                                @click=${() => this._moveBlock(index, 'down')}
                                ?disabled=${index === currentLayout.length - 1}
                            ></ha-icon-button>
                        </div>
                    </div>
                `)}

                <div class="section">Weergave Opties</div>

                <div class="switch-row">
                    <ha-switch
                        .checked=${this._config.show_header !== false}
                        data-field="show_header"
                        @change=${this._changed}
                    ></ha-switch>
                    <span>Toon header</span>
                </div>

                <div class="switch-row">
                    <ha-switch
                        .checked=${this._config.show_delivered !== false}
                        data-field="show_delivered"
                        @change=${this._changed}
                    ></ha-switch>
                    <span>Toon "Bezorgd" tab</span>
                </div>

                <div class="switch-row">
                    <ha-switch
                        .checked=${this._config.show_sent !== false}
                        data-field="show_sent"
                        @change=${this._changed}
                    ></ha-switch>
                    <span>Toon "Verzonden" tab</span>
                </div>

                <div class="switch-row">
                    <ha-switch
                        .checked=${this._config.show_animation !== false}
                        data-field="show_animation"
                        @change=${this._changed}
                    ></ha-switch>
                    <span>Toon bezorganimatie</span>
                </div>

                <div class="switch-row">
                    <ha-switch
                        .checked=${this._config.show_placeholder !== false}
                        data-field="show_placeholder"
                        @change=${this._changed}
                    ></ha-switch>
                    <span>Toon placeholder</span>
                </div>

                <div class="section">Uiterlijk</div>

                <div class="inline-fields-2">
                    <ha-textfield
                        label="Header Kleur"
                        type="color"
                        .value=${this._config.header_color || '#f0f0f0'}
                        data-field="header_color"
                        @input=${this._changed}
                    ></ha-textfield>

                    <ha-textfield
                        label="Header Tekst Kleur"
                        type="color"
                        .value=${this._config.header_text_color || '#000000'}
                        data-field="header_text_color"
                        @input=${this._changed}
                    ></ha-textfield>
                </div>

                <ha-textfield
                    label="Placeholder Afbeelding (URL)"
                    .value=${this._config.placeholder_image || DEFAULT_BANNER}
                    placeholder="http://..."
                    data-field="placeholder_image"
                    @input=${this._changed}
                ></ha-textfield>

                <ha-textfield
                    label="PostNL Logo (URL)"
                    .value=${this._config.logo_path || DEFAULT_LOGO}
                    placeholder="http://..."
                    data-field="logo_path"
                    @input=${this._changed}
                ></ha-textfield>

                <ha-textfield
                    label="Bezorgbusje Afbeelding (URL)"
                    .value=${this._config.van_path || DEFAULT_VAN}
                    placeholder="http://..."
                    data-field="van_path"
                    @input=${this._changed}
                ></ha-textfield>
            </div>
        `;
    }
}

if (!customElements.get('hki-postnl-card')) {
    customElements.define('hki-postnl-card', HKIPostNLCard);
}
if (!customElements.get('hki-postnl-card-editor')) {
    customElements.define('hki-postnl-card-editor', HKIPostNLCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "hki-postnl-card",
    name: "HKI PostNL Card",
    description: "PostNL Track & Trace Card",
    preview: true
});
