// HKI Parcels Card
// Multi-carrier parcel tracker for PostNL, DHL, DPD and more.
// Based on the original hki-postnl-card by jimz011/hki-elements.
// Standalone version: https://github.com/jonisnet/hki-parcels-card

const { LitElement, html, css } = window.HKI.getLit();
const CARD_VERSION = 'v1.2.1';
console.info(`%c HKI-PARCELS-CARD %c ${CARD_VERSION} `, 'color: white; background: #ed8c00; font-weight: bold;', 'color: #ed8c00; background: white; font-weight: bold;');

const DEFAULT_CARRIER_ICON = 'mdi:package-variant-closed';
const DEFAULT_CARRIER_COLOR = '#ed8c00';
const DEFAULT_PLACEHOLDER_IMAGE = 'https://github.com/jonisnet/hki-parcels-card/blob/main/images/dutch-parcels.png?raw=true';

function hasPhuIcons() {
    return !!(window.customIconsets && window.customIconsets['phu']);
}

function getDefaultIcon(carrierType) {
    const phuMap = { postnl: 'phu:postnl', postnl_v4: 'phu:postnl', dhl: 'phu:dhl', dpd: 'phu:dpd', postnl_legacy: 'phu:postnl' };
    if (hasPhuIcons() && phuMap[carrierType]) return phuMap[carrierType];
    return 'mdi:package-variant-closed';
}

// ============================================================
// Translations
// ============================================================

const TRANSLATIONS = {
    nl: {
        tab_in_transit:         'Onderweg',
        tab_delivered:          'Bezorgd',
        tab_sent:               'Verzonden',
        tab_letters:            'Post',
        status_registered:      'Aangemeld',
        status_in_transit:      'Onderweg',
        status_out_for_delivery:'Vandaag bezorgd',
        status_ready_for_pickup:'Te afhalen',
        status_at_pickup_point: 'Bij afhaalpunt',
        status_delivered:       'Bezorgd',
        status_returning:       'Retour naar verzender',
        status_problem:         'Probleem',
        status_unknown:         'Onbekend',
        parcel_from:            'Pakket van',
        unknown:                'Onbekend',
        mail_from:              'Post van',
        letterbox_mail:         'Brievenbuspost',
        unread:                 'Ongelezen',
        letterbox_received:     'Brievenbuspost ontvangen',
        parcel_delivered_msg:   'Pakket bezorgd',
        select_parcel:          'Selecteer een pakket voor details',
        no_image:               'Geen afbeelding beschikbaar',
        label_tracking:         'Track & Trace',
        label_status:           'Status',
        label_delivery:         'Bezorgwijze',
        label_pickup_point:     'Afhaalpunt',
        home_delivery:          'Thuisbezorging',
        pickup_point:           'Afhaalpunt',
        label_type:             'Type',
        type_letter:            'Brief',
        type_parcel:            'Pakket',
        open_tracking:          'TRACK & TRACE OPENEN ↗',
        no_parcels:             'Geen pakketten in deze categorie',
        post_section_upcoming:  'Nog te bezorgen',
        post_section_delivered: 'Bezorgd',
        stats_in_transit:       'onderweg',
        stats_recent:           'recent',
        stats_letters:          'brieven',
        error_no_carriers:      'Geen carriers geconfigureerd, of geen van de geconfigureerde sensoren gevonden.',
        error_no_carriers_hint: 'Voeg minstens 1 carrier toe met een entity_incoming of entity_delivered.',
        // editor
        editor_title:           '📦 Multi-carrier pakketten kaart',
        editor_intro1:          'Voeg hieronder één of meer carriers toe (PostNL, DHL, DPD, ...). Elke carrier kan tot 4 sensoren hebben.',
        editor_intro2:          'Kies het juiste PostNL-type: v4.x (peternijssen ≥4.0), v3.x (peternijssen ≤3.x) of arjenbos voor de oude single-entity integratie.',
        section_basic:          'Basis Instellingen',
        label_card_title:       'Kaartnaam',
        label_days_back:        'Aantal dagen geschiedenis (bezorgd)',
        section_carriers:       'Carriers',
        btn_add_carrier:        '+ Carrier toevoegen',
        section_layout:         'Layout Volgorde',
        layout_help:            'Gebruik de pijltjes om de blokken te herschikken',
        layout_header:          'Header (Titel)',
        layout_animation:       'Animatie / Afbeelding',
        layout_tabs:            'Navigatie Tabs',
        layout_list:            'Pakketten Lijst',
        section_display:        'Weergave Opties',
        show_header:            'Toon header',
        show_delivered_tab:     'Toon "Bezorgd" tab',
        show_sent_tab:          'Toon "Verzonden" tab',
        show_letters_tab:       'Toon "Post" tab (als minstens 1 carrier brieven ondersteunt)',
        show_animation:         'Toon animatie/detailweergave',
        show_placeholder:       'Toon placeholder',
        show_tracking_link:     'Toon "Track & Trace" knop',
        section_appearance:     'Uiterlijk',
        label_header_color:     'Header Kleur',
        label_header_text:      'Header Tekst Kleur',
        label_placeholder_img:  'Placeholder Afbeelding',
        color_default:          'Standaard',
        color_custom:           'Aangepast',
        btn_remove_carrier:     'Verwijder carrier',
        label_carrier_name:     'Naam',
        legacy_warning:         'Recreëert de originele hki-postnl-card: één entity met onderweg én bezorgde pakketten, plus een losse entity voor verzonden. Geen brieven, geen sensor-templating. Deze modus krijgt geen verdere updates zolang arjenbos/ha-postnl niet wordt bijgehouden.',
        label_account:          'Account / gebruikersdeel van de sensornaam',
        account_help_suffix:    '_incoming_parcels" etc. De 4 sensoren worden automatisch opgebouwd.',
        adv_sensors:            'Geavanceerd: sensoren handmatig overschrijven',
        adv_sensors_help:       'Normaal hoef je dit niet aan te passen. Gebruik dit alleen als je sensoren een afwijkende naam hebben.',
        entity_incoming:        'Onderweg Entity (incoming)',
        entity_delivered:       'Bezorgd Entity (delivered)',
        entity_outgoing:        'Verzonden Entity (outgoing)',
        entity_outgoing_delivered: 'Verzonden Bezorgd Entity (outgoing delivered)',
        entity_letters:         'Post / Brieven Entity (letters)',
        letters_entity_help:    'Brief-afbeeldingen (image.* entiteiten) worden automatisch gekoppeld op datum.',
        no_letters_support:     'Post/Brieven wordt alleen ondersteund voor PostNL.',
        adv_appearance:         'Geavanceerd: uiterlijk overschrijven',
        label_icon:             'Icoon (mdi:...)',
        label_color:            'Kleur',
        label_logo:             'Logo URL (optioneel)',
        label_van:              'Voertuig GIF URL (optioneel)',
        label_banner:           'Banner URL (optioneel, achtergrond bij 1 carrier)',
        appearance_help:        'Logo, voertuig-animatie en banner hebben al een ingebouwde standaard per carrier. Vul hier alleen iets in als je die wilt overschrijven.',
        postnl_entity_label:    'PostNL Ontvangst Entity',
        postnl_dist_label:      'PostNL Verzending Entity (optioneel)',
        detected_one:           'Automatisch gevonden',
        detected_multiple:      'Meerdere accounts gevonden — kies er één',
        detected_none:          'Geen sensors gevonden — vul handmatig in',
        integration_not_found:  'Integratie niet gevonden. Installeer de integratie eerst:',
        no_prefix:              '(geen gebruikersnaam-prefix)',
        detected_badge:         'gevonden',
        label_icon_pick:        'Icoon',
        label_color_pick:       'Kleur',
        url_logo:               'Logo URL',
        url_van:                'Voertuig GIF URL',
        url_banner:             'Banner URL',
        url_placeholder:        'Laat leeg voor de standaard afbeelding',
        url_preview_fail:       'Afbeelding niet gevonden',
        browse_media:           'Bladeren',
    },
    en: {
        tab_in_transit:         'In Transit',
        tab_delivered:          'Delivered',
        tab_sent:               'Sent',
        tab_letters:            'Letters',
        status_registered:      'Registered',
        status_in_transit:      'In Transit',
        status_out_for_delivery:'Out for Delivery',
        status_ready_for_pickup:'Ready for Pickup',
        status_at_pickup_point: 'At Pickup Point',
        status_delivered:       'Delivered',
        status_returning:       'Returning to Sender',
        status_problem:         'Problem',
        status_unknown:         'Unknown',
        parcel_from:            'Parcel from',
        unknown:                'Unknown',
        mail_from:              'Mail from',
        letterbox_mail:         'Letterbox Mail',
        unread:                 'Unread',
        letterbox_received:     'Letterbox mail received',
        parcel_delivered_msg:   'Parcel delivered',
        select_parcel:          'Select a parcel for details',
        no_image:               'No image available',
        label_tracking:         'Tracking',
        label_status:           'Status',
        label_delivery:         'Delivery',
        label_pickup_point:     'Pickup point',
        home_delivery:          'Home delivery',
        pickup_point:           'Pickup point',
        label_type:             'Type',
        type_letter:            'Letter',
        type_parcel:            'Parcel',
        open_tracking:          'OPEN TRACKING ↗',
        no_parcels:             'No parcels in this category',
        post_section_upcoming:  'Still to be delivered',
        post_section_delivered: 'Delivered',
        stats_in_transit:       'in transit',
        stats_recent:           'recent',
        stats_letters:          'letters',
        error_no_carriers:      'No carriers configured, or none of the configured sensors were found.',
        error_no_carriers_hint: 'Add at least 1 carrier with an entity_incoming or entity_delivered.',
        // editor
        editor_title:           '📦 Multi-carrier parcel card',
        editor_intro1:          'Add one or more carriers below (PostNL, DHL, DPD, ...). Each carrier can have up to 4 sensors.',
        editor_intro2:          'Pick the right PostNL type: v4.x (peternijssen ≥4.0), v3.x (peternijssen ≤3.x), or arjenbos for the legacy single-entity integration.',
        section_basic:          'Basic Settings',
        label_card_title:       'Card title',
        label_days_back:        'Days to show delivery history',
        section_carriers:       'Carriers',
        btn_add_carrier:        '+ Add carrier',
        section_layout:         'Layout Order',
        layout_help:            'Use the arrows to reorder the blocks',
        layout_header:          'Header (Title)',
        layout_animation:       'Animation / Image',
        layout_tabs:            'Navigation Tabs',
        layout_list:            'Parcel List',
        section_display:        'Display Options',
        show_header:            'Show header',
        show_delivered_tab:     'Show "Delivered" tab',
        show_sent_tab:          'Show "Sent" tab',
        show_letters_tab:       'Show "Letters" tab (requires at least 1 carrier with letter support)',
        show_animation:         'Show animation / detail view',
        show_placeholder:       'Show placeholder image',
        show_tracking_link:     'Show tracking link button (disable for kiosk / touch-only)',
        section_appearance:     'Appearance',
        label_header_color:     'Header color',
        label_header_text:      'Header text color',
        label_placeholder_img:  'Placeholder image',
        color_default:          'Default',
        color_custom:           'Custom',
        btn_remove_carrier:     'Remove carrier',
        label_carrier_name:     'Name',
        legacy_warning:         'Recreates the original hki-postnl-card: one entity with both in-transit and delivered parcels, plus a separate entity for sent parcels. No letter support, no sensor templating. This mode will not receive further updates as long as arjenbos/ha-postnl is not actively maintained.',
        label_account:          'Account / user part of the sensor name',
        account_help_suffix:    '_incoming_parcels" etc. The 4 sensors are built automatically.',
        adv_sensors:            'Advanced: override sensors manually',
        adv_sensors_help:       'You normally don\'t need to change this. Use this only if your sensors have a non-standard name.',
        entity_incoming:        'In Transit entity (incoming)',
        entity_delivered:       'Delivered entity',
        entity_outgoing:        'Sent entity (outgoing)',
        entity_outgoing_delivered: 'Sent delivered entity (outgoing delivered)',
        entity_letters:         'Letters entity',
        letters_entity_help:    'Letter scan images (image.* entities) are matched automatically by date.',
        no_letters_support:     'Letters are only supported for PostNL.',
        adv_appearance:         'Advanced: override appearance',
        label_icon:             'Icon (mdi:...)',
        label_color:            'Color',
        label_logo:             'Logo URL (optional)',
        label_van:              'Vehicle GIF URL (optional)',
        label_banner:           'Banner URL (optional, background when 1 carrier)',
        appearance_help:        'Logo, vehicle animation and banner already have a built-in default per carrier. Only fill in a value here if you want to override it.',
        postnl_entity_label:    'PostNL Incoming Entity',
        postnl_dist_label:      'PostNL Outgoing Entity (optional)',
        detected_one:           'Auto-detected',
        detected_multiple:      'Multiple accounts found — choose one',
        detected_none:          'No sensors found — enter manually',
        integration_not_found:  'Integration not found. Install the integration first:',
        no_prefix:              '(no account prefix)',
        detected_badge:         'found',
        label_icon_pick:        'Icon',
        label_color_pick:       'Color',
        url_logo:               'Logo URL',
        url_van:                'Vehicle GIF URL',
        url_banner:             'Banner URL',
        url_placeholder:        'Leave empty to use the built-in default',
        url_preview_fail:       'Image not found',
        browse_media:           'Browse',
    }
};

function getT(lang) {
    const base = (lang || 'en').split('-')[0].toLowerCase();
    return TRANSLATIONS[base] || TRANSLATIONS.en;
}

// ============================================================
// Carrier configuration
// ============================================================

const REPO_BASE = 'https://github.com/jonisnet/hki-parcels-card/blob/main/images';

const CARRIER_REPO_URLS = {
    postnl_v4: 'https://github.com/peternijssen/ha-postnl',
    dhl:       'https://github.com/peternijssen/ha-dhl-nl',
    dpd:       'https://github.com/peternijssen/ha-dpd',
};

const CARRIER_ASSETS = {
    postnl_v4: {
        logo:   `${REPO_BASE}/postnl-logo.png?raw=true`,
        van:    `${REPO_BASE}/postnl-van.gif?raw=true`,
        banner: `${REPO_BASE}/postnl-banner.jpg?raw=true`
    },
    postnl: {
        logo:   `${REPO_BASE}/postnl-logo.png?raw=true`,
        van:    `${REPO_BASE}/postnl-van.gif?raw=true`,
        banner: `${REPO_BASE}/postnl-banner.jpg?raw=true`
    },
    dhl: {
        logo:   `${REPO_BASE}/DHL_logo.png?raw=true`,
        van:    null,
        banner: `${REPO_BASE}/DHL_banner.png?raw=true`
    },
    dpd: {
        logo:   `${REPO_BASE}/DPD_logo.png?raw=true`,
        van:    null,
        banner: `${REPO_BASE}/DPD_banner.png?raw=true`
    },
    postnl_legacy: {
        logo:   `${REPO_BASE}/postnl-logo.png?raw=true`,
        van:    `${REPO_BASE}/postnl-van.gif?raw=true`,
        banner: `${REPO_BASE}/postnl-banner.jpg?raw=true`
    },
    custom: { logo: null, van: null, banner: null }
};

const CARRIER_PRESETS = {
    postnl_v4:    { label: 'PostNL',                    icon: 'mdi:package-variant-closed', color: '#ed8c00', schema: 'canonical',     supports_letters: true,  sensor_slug: 'postnl' },
    postnl:       { label: 'PostNL (peternijssen v3.x)', icon: 'mdi:package-variant-closed', color: '#ed8c00', schema: 'legacy',        supports_letters: true,  sensor_slug: 'postnl' },
    dhl:          { label: 'DHL',                        icon: 'mdi:package-variant-closed', color: '#ffcc00', schema: 'canonical',     supports_letters: false, sensor_slug: 'dhl'    },
    dpd:          { label: 'DPD',                        icon: 'mdi:package-variant-closed', color: '#dc0032', schema: 'canonical',     supports_letters: false, sensor_slug: 'dpd',
                    slug_first_suffixes: { incoming: 'binnenkomende_pakketten', delivered: 'bezorgde_pakketten', outgoing: 'uitgaande_pakketten', outgoing_delivered: null, letters: null } },
    postnl_legacy:{ label: 'PostNL (arjenbos)',          icon: 'mdi:package-variant-closed', color: '#ed8c00', schema: 'single_entity', supports_letters: false, sensor_slug: null     },
    custom:       { label: 'Custom',                     icon: 'mdi:package-variant-closed', color: '#ed8c00', schema: 'canonical',     supports_letters: false, sensor_slug: null     }
};

function slugifyUserSlug(text) {
    return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function buildTemplatedEntities(user, carrierType, slugFirst = false) {
    const preset = CARRIER_PRESETS[carrierType] || CARRIER_PRESETS.custom;
    const slug = preset.sensor_slug;
    if (!slug) {
        return { entity_incoming: null, entity_delivered: null, entity_outgoing: null, entity_outgoing_delivered: null, entity_letters: null };
    }
    const u = slugifyUserSlug(user);
    // slugFirst: sensor.<slug>_<user>_* (e.g. sensor.dpd_keesb_binnenkomende_pakketten)
    // userFirst: sensor.<user>_<slug>_* or sensor.<slug>_* when no prefix
    if (slugFirst && u) {
        const sf = preset.slug_first_suffixes;
        const s = (key, fallback) => sf?.[key] != null ? `sensor.${slug}_${u}_${sf[key]}` : (sf?.[key] === null ? null : `sensor.${slug}_${u}_${fallback}`);
        return {
            entity_incoming:          s('incoming',          'incoming_parcels'),
            entity_delivered:         s('delivered',         'delivered_parcels'),
            entity_outgoing:          s('outgoing',          'outgoing_parcels'),
            entity_outgoing_delivered:s('outgoing_delivered','outgoing_delivered_parcels'),
            entity_letters: preset.supports_letters ? s('letters', 'letters') : null
        };
    }
    const prefix = u ? `${u}_` : '';
    return {
        entity_incoming:          `sensor.${prefix}${slug}_incoming_parcels`,
        entity_delivered:         `sensor.${prefix}${slug}_delivered_parcels`,
        entity_outgoing:          `sensor.${prefix}${slug}_outgoing_parcels`,
        entity_outgoing_delivered:`sensor.${prefix}${slug}_outgoing_delivered_parcels`,
        entity_letters: preset.supports_letters ? `sensor.${prefix}${slug}_letters` : null
    };
}

// Both lowercase (DHL/DPD) and uppercase (ha-postnl v4.x) enum values are accepted.
const CANONICAL_DELIVERED_STATUSES = new Set(['delivered', 'DELIVERED']);

// ============================================================
// Card
// ============================================================

class HkiParcelsCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._activeTab = 'onderweg';
        this._selectedParcel = null;
        this._isRendered = false;
    }

    // Shorthand: resolve a translation key using hass.language.
    _t(key) {
        return getT(this._hass?.language)[key] || key;
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
        this.config = {
            title: 'Parcels',
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_letters: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            show_tracking_link: true,
            header_color: '',
            header_text_color: '',
            placeholder_image: DEFAULT_PLACEHOLDER_IMAGE,
            carriers: [],
            layout_order: ['header', 'animation', 'tabs', 'list'],
            ...config
        };
        if (!Array.isArray(this.config.carriers)) this.config.carriers = [];
        if (!Array.isArray(this.config.layout_order) || this.config.layout_order.length === 0) {
            this.config.layout_order = ['header', 'animation', 'tabs', 'list'];
        }
        if (this._hass) this.render();
    }

    static getConfigElement() {
        return document.createElement("hki-parcels-card-editor");
    }

    static getStubConfig() {
        return {
            title: "Parcels",
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_letters: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            header_color: '',
            header_text_color: '',
            placeholder_image: DEFAULT_PLACEHOLDER_IMAGE,
            carriers: [
                {
                    type: 'postnl',
                    name: 'PostNL',
                    icon: 'mdi:package-variant-closed',
                    color: '#ed8c00',
                    schema: 'legacy',
                    logo_path: '', van_path: '', banner_path: '',
                    entity_incoming: 'sensor.postnl_incoming_parcels',
                    entity_delivered: 'sensor.postnl_delivered_parcels',
                    entity_outgoing: 'sensor.postnl_outgoing_parcels',
                    entity_outgoing_delivered: 'sensor.postnl_outgoing_delivered_parcels',
                    entity_letters: 'sensor.postnl_letters'
                },
                {
                    type: 'dhl',
                    name: 'DHL',
                    icon: 'mdi:package-variant-closed',
                    color: '#ffcc00',
                    schema: 'canonical',
                    logo_path: '', van_path: '', banner_path: '',
                    entity_incoming: 'sensor.dhl_incoming_parcels',
                    entity_delivered: 'sensor.dhl_delivered_parcels',
                    entity_outgoing: 'sensor.dhl_outgoing_parcels',
                    entity_outgoing_delivered: 'sensor.dhl_outgoing_delivered_parcels',
                    entity_letters: ''
                }
            ],
            show_tracking_link: true,
            layout_order: ['header', 'animation', 'tabs', 'list']
        };
    }

    getCardSize() { return 4; }

    formatDate(dateStr) {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(this._hass?.language || 'en', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    }

    // ------------------------------------------------------------------
    // Normalization
    // ------------------------------------------------------------------

    _extractRawList(attrs) {
        if (!attrs) return [];
        if (Array.isArray(attrs)) return attrs;
        const normalized = Object.entries(attrs).reduce((acc, [key, value]) => {
            acc[String(key).toLowerCase()] = value;
            return acc;
        }, {});
        const groupedKeys = ['enroute', 'en_route', 'delivered'];
        const groupedShipments = groupedKeys.flatMap(key => Array.isArray(normalized[key]) ? normalized[key] : []);
        if (groupedShipments.length) return groupedShipments;
        if (Array.isArray(normalized.shipments)) return normalized.shipments;
        if (Array.isArray(normalized.parcels)) return normalized.parcels;
        if (Array.isArray(normalized.letters)) return normalized.letters;
        return Object.values(attrs).filter(item => item && typeof item === 'object');
    }

    _carrierBranding(carrier) {
        const preset = CARRIER_PRESETS[carrier.type] || CARRIER_PRESETS.custom;
        const assets  = CARRIER_ASSETS[carrier.type] || CARRIER_ASSETS.custom;
        return {
            carrier_name:   carrier.name,
            carrier_icon:   (carrier.icon && carrier.icon !== DEFAULT_CARRIER_ICON) ? carrier.icon : getDefaultIcon(carrier.type),
            carrier_color:  carrier.color  || preset.color || DEFAULT_CARRIER_COLOR,
            carrier_logo:   carrier.logo_path   || assets.logo   || '',
            carrier_van:    carrier.van_path    || assets.van    || '',
            carrier_banner: carrier.banner_path || assets.banner || ''
        };
    }

    _canonicalStatusLabel(statusEnum, pickup) {
        const t = this._t.bind(this);
        const labels = {
            registered:       t('status_registered'),
            in_transit:       t('status_in_transit'),
            out_for_delivery: t('status_out_for_delivery'),
            at_pickup_point:  pickup ? t('status_ready_for_pickup') : t('status_at_pickup_point'),
            delivered:        t('status_delivered'),
            returning:        t('status_returning'),
            problem:          t('status_problem'),
            unknown:          t('status_unknown')
        };
        // ha-postnl v4.x uses UPPERCASE enums; normalise before lookup.
        return labels[String(statusEnum).toLowerCase()] || statusEnum;
    }

    _normalizeCanonical(item, carrier) {
        const statusEnum = item.status || 'unknown';
        const delivered = typeof item.delivered === 'boolean'
            ? item.delivered
            : CANONICAL_DELIVERED_STATUSES.has(statusEnum);
        return {
            ...item,
            key: item.barcode || item.key || item.id,
            name: item.sender ? `${this._t('parcel_from')} ${item.sender}` : (item.name || this._t('unknown')),
            status_message: this._canonicalStatusLabel(statusEnum, item.pickup),
            delivered,
            delivery_date: item.delivered_at || item.planned_from || item.delivery_date,
            planned_date: item.planned_from,
            ...this._carrierBranding(carrier)
        };
    }

    _normalizeLegacy(item, carrier) {
        const key = item.key || item.barcode || item.id || item.trackingcode || item.tracking_number;
        const name = item.name
            || (item.sender ? `${this._t('parcel_from')} ${item.sender}` : null)
            || item.description
            || item.title;
        const statusMessage = item.status_message || item.status || item.statusdescription;
        let delivered = item.delivered;
        if (delivered === undefined || delivered === null) {
            const statusLower = String(statusMessage || '').toLowerCase();
            delivered = statusLower.includes('bezorgd') || statusLower.includes('afgeleverd') || statusLower.includes('delivered');
        }
        return {
            ...item,
            key,
            name: name || this._t('unknown'),
            status_message: item.raw_status || statusMessage,
            delivered: !!delivered,
            // Map ha-postnl v4.x field names so the cutoff filter and date display work
            // even when the carrier preset is still set to schema: legacy.
            delivery_date: item.delivery_date || item.delivered_at || item.planned_from || null,
            planned_date:  item.planned_date  || item.planned_from || null,
            ...this._carrierBranding(carrier)
        };
    }

    _normalizeItem(item, carrier) {
        if (!item || typeof item !== 'object') return null;
        return carrier.schema === 'canonical'
            ? this._normalizeCanonical(item, carrier)
            : this._normalizeLegacy(item, carrier);
    }

    _getCarrierSensorItems(carrier, entityField) {
        const entityId = carrier[entityField];
        if (!entityId || !this._hass) return [];
        const stateObj = this._hass.states[entityId];
        if (!stateObj) return [];
        return this._extractRawList(stateObj.attributes)
            .map(item => this._normalizeItem(item, carrier))
            .filter(Boolean);
    }

    // ------------------------------------------------------------------
    // Data aggregation
    // ------------------------------------------------------------------

    getData() {
        const carriers = this.config.carriers || [];
        if (carriers.length === 0) return null;
        const anyConfigured = carriers.some(c =>
            c.entity_incoming || c.entity_delivered || c.entity_outgoing || c.entity_outgoing_delivered || c.entity_letters || c.entity || c.distribution_entity
        );
        if (!anyConfigured) return null;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - (this.config.days_back || 90));

        let onderweg = [], bezorgd = [];
        let verzondenUpcoming = [], verzondenDelivered = [];
        let postUpcoming = [], postDelivered = [];

        carriers.forEach(carrier => {
            const isSingleEntity = (CARRIER_PRESETS[carrier.type] || CARRIER_PRESETS.custom).schema === 'single_entity';
            let merged;

            if (isSingleEntity) {
                const items = this._getCarrierSensorItems(carrier, 'entity');
                merged = items.filter(item => {
                    if (!item.delivered) return true;
                    return new Date(item.delivery_date || item.planned_date || 0) >= cutoffDate;
                });
            } else {
                const incoming  = this._getCarrierSensorItems(carrier, 'entity_incoming').map(i => ({ ...i, delivered: false }));
                const delivered = this._getCarrierSensorItems(carrier, 'entity_delivered').map(i => ({ ...i, delivered: true }));
                const byKey = new Map();
                incoming.concat(delivered).forEach(item => {
                    const key = item.key || JSON.stringify(item);
                    const existing = byKey.get(key);
                    if (!existing || item.delivered) byKey.set(key, item);
                });
                merged = Array.from(byKey.values()).filter(item => {
                    if (!item.delivered) return true;
                    return new Date(item.delivery_date || item.planned_date || 0) >= cutoffDate;
                });
            }

            onderweg = onderweg.concat(merged.filter(i => !i.delivered));
            bezorgd  = bezorgd.concat(merged.filter(i => i.delivered));

            if (isSingleEntity) {
                verzondenUpcoming = verzondenUpcoming.concat(
                    this._getCarrierSensorItems(carrier, 'distribution_entity')
                );
            } else {
                verzondenUpcoming = verzondenUpcoming.concat(
                    this._getCarrierSensorItems(carrier, 'entity_outgoing').map(i => ({ ...i, delivered: false }))
                );
                verzondenDelivered = verzondenDelivered.concat(
                    this._getCarrierSensorItems(carrier, 'entity_outgoing_delivered').map(i => ({ ...i, delivered: true }))
                );
            }

            const carrierLetters = this._getCarrierLetters(carrier);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            carrierLetters.forEach(letter => {
                if (!letter.delivery_date) {
                    // No date: treat as upcoming (still to be delivered / unknown)
                    postUpcoming.push(letter);
                    return;
                }
                const d = new Date(letter.delivery_date);
                if (isNaN(d)) {
                    postUpcoming.push(letter);
                } else if (d >= todayStart) {
                    postUpcoming.push(letter);
                } else if (d >= cutoffDate) {
                    postDelivered.push(letter);
                }
                // Older than cutoff: silently drop
            });
        });

        // If a letter appears in both entity_delivered (parcels flow → bezorgd) and entity_letters
        // (post flow → postDelivered), remove the duplicate from bezorgd.
        const postKeys = new Set([...postUpcoming, ...postDelivered].map(l => l.key).filter(Boolean));
        if (postKeys.size > 0) {
            bezorgd = bezorgd.filter(i => !postKeys.has(i.key));
        }

        return {
            onderweg, bezorgd,
            verzonden: { upcoming: verzondenUpcoming, delivered: verzondenDelivered },
            post: { upcoming: postUpcoming, delivered: postDelivered }
        };
    }

    // ------------------------------------------------------------------
    // Letters
    // ------------------------------------------------------------------

    _slugify(text) {
        return String(text || '').toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    _deriveLetterImagePrefix(entityId) {
        const match = /^sensor\.(.+)_letters$/.exec(entityId || '');
        if (!match) return null;
        return `image.${match[1]}_letter`;
    }

    _getCarrierLetters(carrier) {
        const entityId = carrier.entity_letters;
        if (!entityId || !this._hass) return [];
        const stateObj = this._hass.states[entityId];
        if (!stateObj) return [];

        const rawList = this._extractRawList(stateObj.attributes);
        const imagePrefix = this._deriveLetterImagePrefix(entityId);

        const letters = rawList.map((item, idx) => {
            const dateStr = item.date || item.delivery_date || null;
            const isPlaceholder = !!(item.image_url && /letter_placeholder/i.test(item.image_url));
            return {
                is_letter: true,
                delivered: true,
                key: item.id || item.key || `letter-${carrier.name}-${idx}`,
                name: item.title || (dateStr ? `${this._t('mail_from')} ${dateStr}` : this._t('letterbox_mail')),
                status_message: item.unread ? this._t('unread') : this._t('letterbox_mail'),
                delivery_date: dateStr,
                unread: !!item.unread,
                image_url: item.image_url || '',
                is_placeholder_image: isPlaceholder,
                image_entity_picture: '',
                has_image_prefix: !!imagePrefix,
                ...this._carrierBranding(carrier)
            };
        });

        this._matchLetterImageEntities(letters);
        return letters;
    }

    _matchLetterImageEntities(letters) {
        if (!this._hass) return;
        // Match by mail item id (present in image entity attributes since ha-postnl v4.1.0).
        // The naming convention of image entities changed across versions so pattern matching
        // is unreliable — id-based matching works for any naming scheme.
        const idMap = new Map();
        for (const [entityId, stateObj] of Object.entries(this._hass.states)) {
            if (!entityId.startsWith('image.')) continue;
            if (entityId.toLowerCase().includes('placeholder')) continue;
            if (stateObj.state === 'unavailable') continue;
            const mailId  = stateObj.attributes?.id;
            const picture = stateObj.attributes?.entity_picture;
            if (mailId && picture) idMap.set(mailId, picture);
        }
        letters.forEach(letter => {
            const picture = idMap.get(letter.key);
            if (picture) letter.image_entity_picture = picture;
        });
    }

    hasAnyLettersConfigured() {
        return (this.config.carriers || []).some(c => !!c.entity_letters);
    }

    _countLettersToday(data) {
        const todayStr = new Date().toDateString();
        const allLetters = [...(data?.post?.upcoming || []), ...(data?.post?.delivered || [])];
        return allLetters.filter(l => {
            if (!l.delivery_date) return false;
            const d = new Date(l.delivery_date);
            return !isNaN(d) && d.toDateString() === todayStr;
        }).length;
    }

    // ------------------------------------------------------------------
    // Rendering helpers
    // ------------------------------------------------------------------

    _sortShipments(items) {
        return [...(items || [])].sort((a, b) =>
            new Date(b.delivery_date || b.planned_date || b.expected_datetime || 0) -
            new Date(a.delivery_date || a.planned_date || a.expected_datetime || 0)
        );
    }

    getFilteredShipments(data) {
        if (!data) return [];
        if (this._activeTab === 'post' || this._activeTab === 'verzonden') {
            const bucket = data[this._activeTab] || {};
            return {
                upcoming: this._sortShipments(bucket.upcoming),
                delivered: this._sortShipments(bucket.delivered)
            };
        }
        return this._sortShipments(data[this._activeTab]);
    }

    _groupByCarrier(items) {
        const order = [];
        const groups = new Map();
        items.forEach(item => {
            const name = item.carrier_name || this._t('unknown');
            if (!groups.has(name)) {
                groups.set(name, { name, icon: item.carrier_icon, color: item.carrier_color, items: [] });
                order.push(name);
            }
            groups.get(name).items.push(item);
        });
        return order.map(name => groups.get(name));
    }

    handleTabClick(e) {
        const tab = e.currentTarget.dataset.tab;
        if (tab === this._activeTab) return;
        this._activeTab = tab;
        this._selectedParcel = null;
        this._lastListFingerprint = null; // force re-render on tab switch
        this.updateContent();
    }

    handleParcelClick(e) {
        const key = e.currentTarget.dataset.key;
        this._selectedParcel = (this._selectedParcel === key) ? null : key;
        this._lastListFingerprint = null; // force re-render on selection change
        this.updateContent();
    }

    handleLetterThumbClick(e) {
        e.stopPropagation();
        const { letterName, letterDate, letterSrc } = e.currentTarget.dataset;
        this._openLetterPopup(letterSrc, letterName, letterDate);
    }

    _getNoSelectionBackground() {
        const DEFAULT_PLACEHOLDER = `${REPO_BASE}/dutch-parcels.png?raw=true`;
        const carriers = this.config.carriers || [];
        const placeholderImage = this.config.placeholder_image || DEFAULT_PLACEHOLDER;
        if (carriers.length >= 2) return { image: placeholderImage, showText: false };
        if (carriers.length === 1) {
            const b = this._carrierBranding(carriers[0]);
            const image = b.carrier_banner || b.carrier_logo;
            if (image) return { image, showText: false };
        }
        return { image: placeholderImage, showText: false };
    }

    _openLetterPopup(src, name, dateLabel) {
        let popup = this.shadowRoot.querySelector('.letter-popup-overlay');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'letter-popup-overlay';
            this.shadowRoot.appendChild(popup);
            popup.addEventListener('click', e => {
                if (e.target === popup || e.target.closest('.letter-popup-close')) this._closeLetterPopup();
            });
        }
        popup.innerHTML = `
            <div class="letter-popup-content">
                <button class="letter-popup-close" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>
                <img src="${src}" alt="${name || ''}" />
                <div class="letter-popup-caption"><strong>${name || ''}</strong>${dateLabel ? ` • ${dateLabel}` : ''}</div>
            </div>`;
        popup.classList.add('open');
    }

    _closeLetterPopup() {
        this.shadowRoot.querySelector('.letter-popup-overlay')?.classList.remove('open');
    }

    // ------------------------------------------------------------------
    // updateContent — partial DOM update (no full re-render)
    // ------------------------------------------------------------------

    // Stable fingerprint for the displayed list — excludes image URLs (their time= param
    // changes on every HA scan, which would cause constant re-renders and image flickering).
    _listFingerprint(displayed) {
        const items = Array.isArray(displayed)
            ? displayed
            : [...(displayed.upcoming || []), ...(displayed.delivered || [])];
        return items.map(i => `${i.key}|${i.delivered}|${i.status_message || ''}`).join(',');
    }

    updateContent() {
        if (!this._isRendered) return;
        const data = this.getData();
        if (!data) return;

        const displayed = this.getFilteredShipments(data);
        const lettersToday = this.hasAnyLettersConfigured() ? this._countLettersToday(data) : null;
        const statsText = `${data.onderweg.length} ${this._t('stats_in_transit')} • ${data.bezorgd.length} ${this._t('stats_recent')}${lettersToday !== null ? ` • ${lettersToday} ${this._t('stats_letters')}` : ''}`;

        const statsEl    = this.shadowRoot.querySelector('.header-stats');
        const statsBarEl = this.shadowRoot.querySelector('.stats-text');
        if (statsEl)    statsEl.textContent    = statsText;
        if (statsBarEl) statsBarEl.textContent = statsText;

        this.shadowRoot.querySelectorAll('.tab').forEach(tab =>
            tab.classList.toggle('active', tab.dataset.tab === this._activeTab)
        );
        this.updateAnimation(displayed);

        // Only rebuild the list DOM when items actually changed — avoids destroying
        // <img> elements on every hass tick, which causes letter images to flicker.
        const fp = this._listFingerprint(displayed);
        if (fp !== this._lastListFingerprint) {
            this._lastListFingerprint = fp;
            this.renderList(displayed);
        }
    }

    updateAnimation(displayed) {
        const animationEl = this.shadowRoot.querySelector('.header-animation');
        if (!animationEl) return;

        const flat = Array.isArray(displayed) ? displayed : [...(displayed.upcoming || []), ...(displayed.delivered || [])];
        const selected = this._selectedParcel
            ? flat.find(s => s.key === this._selectedParcel)
            : null;

        animationEl.style.backgroundImage = '';

        if (this.config.show_animation && selected?.delivered) {
            const isLetter = !!selected.is_letter;
            animationEl.classList.add('animation-active');
            animationEl.innerHTML = `
                <div class="delivery-complete">
                    <div class="delivery-complete-icon" style="color:${selected.carrier_color || DEFAULT_CARRIER_COLOR};">
                        <ha-icon icon="${isLetter ? 'mdi:email-check' : 'mdi:package-check'}"></ha-icon>
                    </div>
                    <div class="delivery-complete-text">
                        <strong>${selected.name}</strong>
                        <span>${isLetter ? this._t('letterbox_received') : this._t('parcel_delivered_msg')} • ${selected.carrier_name || ''}</span>
                    </div>
                </div>`;
            return;
        }

        if (this.config.show_animation && selected) {
            const vanPos = selected.delivered ? '75%' : '25%';
            const statusText = selected.status_message || (selected.delivered ? this._t('status_delivered') : this._t('status_in_transit'));
            animationEl.classList.add('animation-active');
            animationEl.innerHTML = `
                <div class="visual-road">
                    <div class="house-bg">🏠</div>
                    <div class="road-line"></div>
                    ${selected.carrier_van
                        ? `<img class="carrier-van-gif" src="${selected.carrier_van}" alt="${selected.carrier_name || ''}" style="left:${vanPos};" />`
                        : `<div class="carrier-chip" style="background:${selected.carrier_color || DEFAULT_CARRIER_COLOR}; left:${vanPos};">
                            <ha-icon icon="${selected.carrier_icon || DEFAULT_CARRIER_ICON}"></ha-icon>
                        </div>`
                    }
                </div>
                <div class="animation-info"><strong>${selected.name}</strong> • ${statusText} • ${selected.carrier_name || ''}</div>`;
        } else {
            animationEl.classList.remove('animation-active');
            if (!this.config.show_placeholder) {
                animationEl.style.backgroundImage = '';
                animationEl.innerHTML = '';
                return;
            }
            const bg = this._getNoSelectionBackground();
            animationEl.style.backgroundImage = bg.image ? `url("${bg.image.replace(/"/g, '%22')}")` : '';
            animationEl.innerHTML = bg.showText
                ? `<div class="animation-placeholder"><div class="placeholder-text">${this._t('select_parcel')}</div></div>`
                : '';
        }
    }

    _renderParcelItem(item) {
        const isDelivered = item.delivered;
        const isLetter    = !!item.is_letter;
        const statusMsg   = item.status_message || (isLetter ? this._t('letterbox_mail') : (isDelivered ? this._t('status_delivered') : this._t('status_in_transit')));
        const dateLabel   = this.formatDate(item.delivery_date || item.planned_date || item.planned_to);
        const statusIcon  = isLetter ? 'mdi:email' : (isDelivered ? 'mdi:check-circle' : 'mdi:truck-delivery');
        const isSelected  = this._selectedParcel === item.key;

        // For placeholder letters: never show an image, always show "no image" text.
        // For real letters: prefer HA image entity picture, fall back to image_url.
        const letterIsPlaceholder = isLetter && !!item.is_placeholder_image;
        let letterThumb = '';
        if (isLetter && !letterIsPlaceholder) {
            letterThumb = item.image_entity_picture || item.image_url || '';
        }

        const deliveryDetail = typeof item.pickup === 'boolean'
            ? `<div class="detail-row"><strong>${this._t('label_delivery')}:</strong> ${item.pickup ? `${this._t('pickup_point')}${item.pickup_point ? ` (${item.pickup_point})` : ''}` : this._t('home_delivery')}</div>`
            : (item.pickup_point ? `<div class="detail-row"><strong>${this._t('label_pickup_point')}:</strong> ${item.pickup_point}</div>` : '');

        return `
        <div class="parcel ${isSelected ? 'selected' : ''}" data-key="${item.key}" style="--carrier-color:${item.carrier_color || DEFAULT_CARRIER_COLOR};">
            <div class="parcel-header" data-key="${item.key}">
                <div class="ph-left">
                    <span class="ph-name">${item.name || this._t('unknown')}</span>
                    <span class="ph-status">
                        <ha-icon class="ph-status-icon" icon="${statusIcon}" style="width:16px;height:16px;"></ha-icon>
                        ${statusMsg}
                    </span>
                </div>
                <div class="ph-right">
                    <div class="ph-date">${dateLabel || ''}</div>
                    <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
                </div>
            </div>
            <div class="details-panel">
                ${letterThumb ? `<img class="letter-thumb" src="${letterThumb}" alt="${item.name || ''}"
                     data-letter-name="${item.name || ''}" data-letter-date="${dateLabel || ''}" data-letter-src="${letterThumb}"
                     onerror="this.style.display='none';this.nextElementSibling&&(this.nextElementSibling.style.display='flex');" />` : ''}
                ${isLetter && (!letterThumb || true) ? `<div class="detail-row letter-no-image" style="${letterThumb ? 'display:none;' : ''}"><ha-icon icon="mdi:email-outline"></ha-icon> ${this._t('no_image')}</div>` : ''}
                ${!isLetter && item.key ? `<div class="detail-row"><strong>${this._t('label_tracking')}:</strong> ${item.key}</div>` : ''}
                ${item.raw_status ? `<div class="detail-row"><strong>${this._t('label_status')}:</strong> ${item.raw_status}</div>` : ''}
                ${deliveryDetail}
                <div class="detail-row"><strong>${this._t('label_type')}:</strong> ${isLetter ? this._t('type_letter') : this._t('type_parcel')}</div>
                ${item.url && this.config.show_tracking_link !== false ? `<a href="${item.url}" target="_blank" class="btn-track">${this._t('open_tracking')}</a>` : ''}
            </div>
        </div>`;
    }

    _renderGroupedList(displayed) {
        if (displayed.length === 0) {
            return `<div class="empty-state">
                <ha-icon icon="mdi:package-variant-closed" style="width:48px;height:48px;margin-bottom:10px;"></ha-icon>
                <div>${this._t('no_parcels')}</div>
            </div>`;
        }
        return this._groupByCarrier(displayed).map(group => `
            <div class="carrier-section">
                <div class="carrier-section-header" style="--carrier-color: ${group.color || DEFAULT_CARRIER_COLOR};">
                    <ha-icon icon="${group.icon || DEFAULT_CARRIER_ICON}"></ha-icon>
                    <span>${group.name}</span>
                    <span class="carrier-section-count">${group.items.length}</span>
                </div>
                ${group.items.map(item => this._renderParcelItem(item)).join('')}
            </div>`).join('');
    }

    _renderSplitSections(displayed) {
        const upcoming  = displayed.upcoming  || [];
        const delivered = displayed.delivered || [];
        if (upcoming.length === 0 && delivered.length === 0) {
            return `<div class="empty-state">
                <ha-icon icon="mdi:package-variant-closed" style="width:48px;height:48px;margin-bottom:10px;"></ha-icon>
                <div>${this._t('no_parcels')}</div>
            </div>`;
        }
        return `
            <div class="post-section">
                <div class="post-section-title">${this._t('post_section_upcoming')}</div>
                ${this._renderGroupedList(upcoming)}
            </div>
            <div class="post-section">
                <div class="post-section-title">${this._t('post_section_delivered')}</div>
                ${this._renderGroupedList(delivered)}
            </div>`;
    }

    renderList(displayed) {
        const listEl = this.shadowRoot.querySelector('.list');
        if (!listEl) return;
        const isSplitTab = this._activeTab === 'post' || this._activeTab === 'verzonden';
        listEl.innerHTML = isSplitTab
            ? this._renderSplitSections(displayed)
            : this._renderGroupedList(displayed);
        listEl.querySelectorAll('.parcel-header').forEach(el =>
            el.addEventListener('click', this.handleParcelClick.bind(this))
        );
        listEl.querySelectorAll('.letter-thumb').forEach(el =>
            el.addEventListener('click', this.handleLetterThumbClick.bind(this))
        );
    }

    render() {
        const data = this.getData();

        if (!data) {
            this.shadowRoot.innerHTML = `<ha-card style="padding:16px;color:red;">
                ${this._t('error_no_carriers')}<br><br>${this._t('error_no_carriers_hint')}
            </ha-card>`;
            return;
        }

        const displayed      = this.getFilteredShipments(data);
        const lettersToday   = this.hasAnyLettersConfigured() ? this._countLettersToday(data) : null;
        const statsText      = `${data.onderweg.length} ${this._t('stats_in_transit')} • ${data.bezorgd.length} ${this._t('stats_recent')}${lettersToday !== null ? ` • ${lettersToday} ${this._t('stats_letters')}` : ''}`;
        const headerColor    = this.config.header_color    || 'var(--card-background-color)';
        const headerTextColor = this.config.header_text_color || 'var(--primary-text-color)';
        const showLettersTab = this.config.show_letters && this.hasAnyLettersConfigured();

        const cssBlock = `<style>
            :host {
                --accent: #ed8c00;
                --header-bg: ${headerColor};
                --header-text: ${headerTextColor};
                --bg-color: var(--card-background-color, white);
            }
            ha-card { background: var(--bg-color); color: var(--primary-text-color); overflow: hidden; border-radius: 12px; }
            .header { background: var(--header-bg); padding: 16px; color: var(--header-text); display: flex; align-items: center; gap: 12px; }
            .header-logo { height: 36px; border-radius: 6px; background: white; padding: 4px; flex-shrink: 0; }
            .header-info { display: flex; flex-direction: column; flex: 1; }
            .header-title { font-weight: bold; font-size: 1.1em; }
            .header-stats { font-size: 0.8em; opacity: 0.9; }
            .stats-bar { background: var(--secondary-background-color, #f5f5f5); padding: 8px 16px; border-bottom: 1px solid var(--divider-color, #eee); text-align: center; }
            .stats-text { font-size: 0.85em; color: var(--secondary-text-color); font-weight: 500; }
            .tabs { display: flex; background: var(--secondary-background-color, #f5f5f5); border-bottom: 1px solid var(--divider-color, #eee); }
            .tab { flex: 1; text-align: center; padding: 12px; cursor: pointer; font-size: 0.9em; font-weight: 500; color: var(--secondary-text-color); position: relative; transition: all 0.2s; user-select: none; }
            .tab:hover { background: rgba(237, 140, 0, 0.1); }
            .tab.active { color: var(--accent); font-weight: bold; }
            .tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); }
            .header-animation { background-size: cover; background-position: center; background-repeat: no-repeat; padding: 16px; border-bottom: 1px solid var(--divider-color); height: 150px; box-sizing: border-box; }
            .header-animation.animation-active { background-image: none !important; background-color: var(--card-background-color); }
            .visual-road { position: relative; height: 80px; display: flex; align-items: center; }
            .house-bg { position: absolute; right: 0; font-size: 32px; }
            .road-line { position: absolute; left: 0; right: 40px; height: 2px; background: var(--divider-color); top: 50%; }
            .carrier-chip { position: absolute; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; top: 50%; transform: translateY(-50%); transition: left 0.4s ease; }
            .carrier-van-gif { position: absolute; height: 48px; top: 50%; transform: translateY(-50%); transition: left 0.4s ease; }
            .animation-info { margin-top: 8px; font-size: 0.9em; color: var(--secondary-text-color); }
            .animation-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; }
            .placeholder-text { color: var(--secondary-text-color); font-size: 0.85em; }
            .delivery-complete { display: flex; align-items: center; gap: 12px; height: 100%; }
            .delivery-complete-icon { color: var(--accent); }
            .delivery-complete-text { display: flex; flex-direction: column; }
            .list { max-height: 420px; overflow-y: auto; }
            .empty-state { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); }
            .carrier-section-header { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--secondary-background-color); font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--carrier-color, var(--accent)); border-top: 1px solid var(--divider-color); }
            .carrier-section-header ha-icon { color: var(--carrier-color, var(--accent)); }
            .carrier-section-count { margin-left: auto; background: var(--carrier-color, var(--accent)); color: white; border-radius: 10px; padding: 1px 8px; font-size: 0.85em; }
            .post-section + .post-section { margin-top: 4px; }
            .post-section-title { padding: 12px 16px 4px; font-size: 0.95em; font-weight: 700; color: var(--primary-text-color); background: var(--card-background-color); }
            .parcel-header { padding: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; user-select: none; }
            .parcel-header:hover { background: var(--secondary-background-color); }
            .ph-left { display: flex; flex-direction: column; flex: 1; }
            .ph-name { font-weight: 600; font-size: 1em; margin-bottom: 4px; }
            .ph-status { font-size: 0.85em; color: var(--secondary-text-color); display: flex; align-items: center; gap: 10px; }
            .ph-status-icon { color: var(--carrier-color, var(--accent)); flex-shrink: 0; display: flex; align-items: center; }
            .ph-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
            .ph-date { font-size: 0.85em; color: var(--secondary-text-color); }
            .chevron { transition: transform 0.3s; margin-left: 8px; }
            .selected .chevron { transform: rotate(180deg); color: var(--carrier-color, var(--accent)); }
            .details-panel { padding: 12px 16px; background: var(--secondary-background-color); border-top: 1px solid var(--divider-color); font-size: 0.9em; color: var(--secondary-text-color); display: none; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
            .selected .details-panel { display: block; max-height: 200px; }
            .detail-row { margin-bottom: 6px; }
            .detail-row strong { color: var(--primary-text-color); }
            .btn-track { background: var(--carrier-color, var(--accent)); color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 0.9em; font-weight: 600; display: inline-block; margin-top: 8px; transition: all 0.2s; }
            .btn-track:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
            .list::-webkit-scrollbar { width: 6px; }
            .list::-webkit-scrollbar-track { background: transparent; }
            .list::-webkit-scrollbar-thumb { background: var(--divider-color); border-radius: 3px; }
            .letter-thumb { display: block; max-width: 120px; max-height: 120px; object-fit: contain; border-radius: 6px; background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.15); margin-bottom: 10px; cursor: pointer; transition: transform 0.15s ease; }
            .letter-thumb:hover { transform: scale(1.04); }
            .letter-no-image { display: flex; align-items: center; gap: 6px; color: var(--secondary-text-color); font-size: 0.85em; }
            .letter-popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; z-index: 9999; padding: 24px; box-sizing: border-box; }
            .letter-popup-overlay.open { display: flex; }
            .letter-popup-content { position: relative; background: var(--card-background-color, white); border-radius: 8px; padding: 16px; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; gap: 10px; }
            .letter-popup-content img { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 4px; }
            .letter-popup-caption { color: var(--primary-text-color); font-size: 0.95em; text-align: center; }
            .letter-popup-close { position: absolute; top: 8px; right: 8px; background: var(--secondary-background-color); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--primary-text-color); }
            .letter-popup-close:hover { background: var(--divider-color); }
        </style>`;

        const headerLogo = (this.config.carriers || []).length === 1
            ? this._carrierBranding(this.config.carriers[0]).carrier_logo : '';

        const placeholderStyle = this.config.placeholder_image ? `style="background-image:url('${this.config.placeholder_image}')"` : '';

        const blocks = {
            header: this.config.show_header
                ? `<div class="header">
                    ${headerLogo ? `<img class="header-logo" src="${headerLogo}" alt="${this.config.carriers[0].name || ''}">` : ''}
                    <div class="header-info">
                        <span class="header-title">${this.config.title || 'Parcels'}</span>
                        <span class="header-stats">${statsText}</span>
                    </div>
                   </div>`
                : `<div class="stats-bar"><span class="stats-text">${statsText}</span></div>`,
            animation: this.config.show_placeholder !== false
                ? `<div class="header-animation" ${placeholderStyle}></div>` : '',
            tabs: `<div class="tabs">
                    <div class="tab ${this._activeTab === 'onderweg' ? 'active' : ''}" data-tab="onderweg">${this._t('tab_in_transit')}</div>
                    ${this.config.show_delivered ? `<div class="tab ${this._activeTab === 'bezorgd'  ? 'active' : ''}" data-tab="bezorgd">${this._t('tab_delivered')}</div>` : ''}
                    ${this.config.show_sent     ? `<div class="tab ${this._activeTab === 'verzonden' ? 'active' : ''}" data-tab="verzonden">${this._t('tab_sent')}</div>` : ''}
                    ${showLettersTab            ? `<div class="tab ${this._activeTab === 'post'      ? 'active' : ''}" data-tab="post">${this._t('tab_letters')}</div>` : ''}
                   </div>`,
            list: `<div class="list">${(this._activeTab === 'post' || this._activeTab === 'verzonden') ? this._renderSplitSections(displayed) : this._renderGroupedList(displayed)}</div>`
        };

        const layoutOrder = this.config.layout_order || ['header', 'animation', 'tabs', 'list'];
        this.shadowRoot.innerHTML = cssBlock + `<ha-card>${layoutOrder.map(b => blocks[b] || '').join('')}</ha-card>`;
        this._isRendered = true;

        this.shadowRoot.querySelectorAll('.tab').forEach(el =>
            el.addEventListener('click', this.handleTabClick.bind(this))
        );
        this.shadowRoot.querySelectorAll('.parcel-header').forEach(el =>
            el.addEventListener('click', this.handleParcelClick.bind(this))
        );
        this.shadowRoot.querySelectorAll('.letter-thumb').forEach(el =>
            el.addEventListener('click', this.handleLetterThumbClick.bind(this))
        );
        this.updateAnimation(displayed);
    }
}

// ============================================================
// Editor
// ============================================================

class HkiParcelsCardEditor extends LitElement {
    static get properties() {
        return { hass: { type: Object }, _config: { attribute: false } };
    }

    constructor() {
        super();
        this._config = { carriers: [], layout_order: ['header', 'animation', 'tabs', 'list'] };
        this._openSections = {}; // tracks open state of advanced sections per carrier
    }

    // Shorthand: resolve a translation key using hass.language.
    _t(key) {
        return getT(this.hass?.language)[key] || key;
    }

    setConfig(config) {
        this._config = {
            title: 'Parcels',
            days_back: 90,
            show_delivered: true,
            show_sent: true,
            show_letters: true,
            show_animation: true,
            show_header: true,
            show_placeholder: true,
            show_tracking_link: true,
            header_color: '',
            header_text_color: '',
            placeholder_image: DEFAULT_PLACEHOLDER_IMAGE,
            carriers: [],
            layout_order: ['header', 'animation', 'tabs', 'list'],
            ...config
        };
        if (!Array.isArray(this._config.carriers)) this._config.carriers = [];
        if (!this._config.layout_order) this._config.layout_order = ['header', 'animation', 'tabs', 'list'];
    }

    _val(ev) { return window.HKI.getSelectValue(ev); }

    _emit() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: this._config }, bubbles: true, composed: true
        }));
    }

    _changed(ev, explicitField = null) {
        ev.stopPropagation();
        const field = explicitField || ev.target?.dataset?.field;
        if (!field || !this._config) return;
        let value = this._val(ev);
        if (new Set(['days_back']).has(field)) value = parseInt(value, 10);
        if (new Set(['show_delivered','show_sent','show_letters','show_animation','show_header','show_placeholder','show_tracking_link']).has(field))
            value = !!(ev.target?.checked ?? value);
        this._config = { ...this._config, [field]: value };
        this._emit();
    }

    _carrierChanged(index, field, ev) {
        ev.stopPropagation();
        const carriers = [...(this._config.carriers || [])];
        carriers[index] = { ...carriers[index], [field]: this._val(ev) };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _carrierTypeChanged(index, ev) {
        ev.stopPropagation();
        const type    = this._val(ev);
        const preset  = CARRIER_PRESETS[type] || CARRIER_PRESETS.custom;
        const carriers = [...(this._config.carriers || [])];
        const current = carriers[index] || {};
        const isSingle = preset.schema === 'single_entity';
        // Auto-detect account when changing type (use existing user if already set).
        const detected     = !isSingle ? this._detectUsers(type) : [];
        const detectedEntry = detected.length === 1 ? detected[0] : null;
        const autoUser     = current.user != null ? current.user : (detectedEntry?.user ?? '');
        const slugFirst    = detectedEntry?.slugFirst ?? false;
        const templated    = !isSingle && detectedEntry !== null ? buildTemplatedEntities(autoUser, type, slugFirst) : {};
        carriers[index] = {
            ...current, type,
            name: preset.label, icon: getDefaultIcon(type), color: preset.color, schema: preset.schema,
            user: autoUser,
            _slugFirst: slugFirst,
            _manualUser: !!current.user,
            entity_incoming:    isSingle ? '' : (templated.entity_incoming    ?? current.entity_incoming    ?? ''),
            entity_delivered:   isSingle ? '' : (templated.entity_delivered   ?? current.entity_delivered   ?? ''),
            entity_outgoing:    isSingle ? '' : (templated.entity_outgoing    ?? current.entity_outgoing    ?? ''),
            entity_outgoing_delivered: isSingle ? '' : (templated.entity_outgoing_delivered ?? current.entity_outgoing_delivered ?? ''),
            entity:             isSingle ? (current.entity ?? '') : '',
            distribution_entity:isSingle ? (current.distribution_entity ?? '') : '',
            entity_letters:     preset.supports_letters ? (templated.entity_letters ?? current.entity_letters ?? '') : ''
        };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _carrierUserChanged(index, ev) {
        ev.stopPropagation();
        const user    = this._val(ev);
        const carriers = [...(this._config.carriers || [])];
        const current = carriers[index] || {};
        const templated = buildTemplatedEntities(user, current.type);
        carriers[index] = {
            ...current, user,
            entity_incoming:  templated.entity_incoming  ?? current.entity_incoming  ?? '',
            entity_delivered: templated.entity_delivered ?? current.entity_delivered ?? '',
            entity_outgoing:  templated.entity_outgoing  ?? current.entity_outgoing  ?? '',
            entity_outgoing_delivered: templated.entity_outgoing_delivered ?? current.entity_outgoing_delivered ?? '',
            entity_letters:   (CARRIER_PRESETS[current.type] || CARRIER_PRESETS.custom).supports_letters
                ? (templated.entity_letters ?? current.entity_letters ?? '') : ''
        };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _addCarrier() {
        const type   = 'postnl_v4';
        const preset = CARRIER_PRESETS[type];
        // Auto-detect user for the default carrier type immediately.
        const detected  = this._detectUsers(type);
        const autoEntry = detected.length === 1 ? detected[0] : null;
        const autoUser  = autoEntry?.user ?? null;
        const slugFirst = autoEntry?.slugFirst ?? false;
        const templated = autoUser !== null ? buildTemplatedEntities(autoUser, type, slugFirst) : {};
        const carriers = [...(this._config.carriers || []), {
            type, name: preset.label, icon: getDefaultIcon(type), color: preset.color,
            schema: preset.schema, logo_path: '', van_path: '', banner_path: '',
            user: autoUser ?? '',
            _slugFirst: slugFirst,
            entity_incoming:  templated.entity_incoming  || '',
            entity_delivered: templated.entity_delivered || '',
            entity_outgoing:  templated.entity_outgoing  || '',
            entity_outgoing_delivered: templated.entity_outgoing_delivered || '',
            entity_letters:   preset.supports_letters ? (templated.entity_letters || '') : '',
            _expanded: true,
            _manualUser: false
        }];
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _removeCarrier(index) {
        const carriers = (this._config.carriers || []).filter((_, i) => i !== index);
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _toggleCarrierExpanded(index) {
        const carriers = [...(this._config.carriers || [])];
        carriers[index] = { ...carriers[index], _expanded: !carriers[index]?._expanded };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _moveBlock(index, direction) {
        const newOrder = [...this._config.layout_order];
        if (direction === 'up' && index > 0)
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        else if (direction === 'down' && index < newOrder.length - 1)
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        this._config = { ...this._config, layout_order: newOrder };
        this._emit();
    }

    // Returns { user, slugFirst }[] for all detected accounts of a carrier type.
    // Checks both "sensor.<user>_<slug>_incoming_parcels" and "sensor.<slug>_<user>_<incoming_suffix>".
    _detectUsers(carrierType) {
        if (!this.hass) return [];
        const preset = CARRIER_PRESETS[carrierType];
        if (!preset?.sensor_slug) return [];
        const slug = preset.sensor_slug;
        const slugFirstIncoming = preset.slug_first_suffixes?.incoming ?? 'incoming_parcels';
        const patternUserFirst = new RegExp(`^sensor\\.(.+)_${slug}_incoming_parcels$`);
        const patternSlugFirst = new RegExp(`^sensor\\.${slug}_(.+)_${slugFirstIncoming}$`);
        const patternNoPrefix  = new RegExp(`^sensor\\.${slug}_incoming_parcels$`);
        const seen = new Map(); // user → slugFirst
        for (const entityId of Object.keys(this.hass.states)) {
            const m1 = patternUserFirst.exec(entityId);
            if (m1 && !seen.has(m1[1])) { seen.set(m1[1], false); continue; }
            const m2 = patternSlugFirst.exec(entityId);
            if (m2 && !seen.has(m2[1])) { seen.set(m2[1], true); continue; }
            if (patternNoPrefix.test(entityId) && !seen.has('')) { seen.set('', false); }
        }
        return [...seen.entries()].map(([user, slugFirst]) => ({ user, slugFirst }));
    }

    // Sanitizes free-text account input: lowercase, non-alnum → underscore, trim underscores.
    _sanitizeUserInput(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    _carrierUserInputChanged(index, ev) {
        ev.stopPropagation();
        const raw  = ev.target?.value ?? '';
        const user = this._sanitizeUserInput(raw);
        // Show sanitized result after the user finishes typing (on change/blur).
        if (ev.target && ev.target.value !== user) ev.target.value = user;
        const carriers = [...(this._config.carriers || [])];
        const current  = carriers[index] || {};
        const slugFirst = current._slugFirst ?? false;
        const templated = buildTemplatedEntities(user, current.type, slugFirst);
        const supportsLetters = (CARRIER_PRESETS[current.type] || CARRIER_PRESETS.custom).supports_letters;
        carriers[index] = {
            ...current, user,
            entity_incoming:  templated.entity_incoming  ?? current.entity_incoming  ?? '',
            entity_delivered: templated.entity_delivered ?? current.entity_delivered ?? '',
            entity_outgoing:  templated.entity_outgoing  ?? current.entity_outgoing  ?? '',
            entity_outgoing_delivered: templated.entity_outgoing_delivered ?? current.entity_outgoing_delivered ?? '',
            entity_letters:   supportsLetters ? (templated.entity_letters ?? current.entity_letters ?? '') : ''
        };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    _carrierUserSelected(index, user) {
        const carriers = [...(this._config.carriers || [])];
        const current  = carriers[index] || {};
        const detected = this._detectUsers(current.type);
        const entry    = detected.find(d => d.user === user);
        const slugFirst = entry?.slugFirst ?? current._slugFirst ?? false;
        const templated = buildTemplatedEntities(user, current.type, slugFirst);
        const supportsLetters = (CARRIER_PRESETS[current.type] || CARRIER_PRESETS.custom).supports_letters;
        carriers[index] = {
            ...current, user,
            _slugFirst: slugFirst,
            entity_incoming:  templated.entity_incoming  ?? '',
            entity_delivered: templated.entity_delivered ?? '',
            entity_outgoing:  templated.entity_outgoing  ?? '',
            entity_outgoing_delivered: templated.entity_outgoing_delivered ?? '',
            entity_letters:   supportsLetters ? (templated.entity_letters ?? '') : ''
        };
        this._config = { ...this._config, carriers };
        this._emit();
    }

    static get styles() {
        return css`
            .card-config { padding: 16px; }
            .section-details { margin-bottom: 8px; }
            .section-details summary { list-style: none; }
            .section-details summary::-webkit-details-marker { display: none; }
            .section { margin-top: 24px; margin-bottom: 12px; font-weight: 600; font-size: 14px; color: var(--primary-text-color); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid var(--divider-color); padding-bottom: 8px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between; }
            .section::after { content: '▾'; font-size: 12px; transition: transform 0.2s ease; }
            .section-details:not([open]) .section::after { transform: rotate(-90deg); }
            .helper-text { font-size: 12px; color: var(--secondary-text-color); margin: 4px 0 16px 0; font-style: italic; }
            ha-selector, ha-textfield { width: 100%; margin-bottom: 16px; }
            .plain-field { margin-bottom: 16px; }
            .plain-field label { display: block; font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px; }
            .plain-field input { width: 100%; box-sizing: border-box; padding: 10px 12px; font-size: 14px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--card-background-color, white); color: var(--primary-text-color); font-family: inherit; }
            .plain-field input:focus { outline: none; border-color: var(--primary-color, #03a9f4); }
            .switch-row { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; width: 100%; }
            .switch-row ha-switch { flex-shrink: 0; margin-bottom: 0; }
            .switch-row span { font-size: 14px; color: var(--primary-text-color); flex: 1; line-height: 1.4; }
            .sort-item { display: flex; align-items: center; gap: 8px; background: var(--secondary-background-color); border: 1px solid var(--divider-color); padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; }
            .sort-actions { display: flex; align-items: center; flex-shrink: 0; }
            .sort-label { font-weight: 500; text-transform: capitalize; }
            .carrier-card { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-bottom: 16px; background: var(--secondary-background-color); }
            .carrier-card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; cursor: pointer; user-select: none; }
            .carrier-card-header-title { display: flex; align-items: center; gap: 8px; }
            .carrier-card-header-title .chevron { transition: transform 0.2s ease; flex-shrink: 0; }
            .carrier-card-header-title .chevron.expanded { transform: rotate(90deg); }
            .carrier-card-body { margin-top: 12px; }
            .advanced-toggle { margin-top: 8px; margin-bottom: 4px; cursor: pointer; font-size: 13px; color: var(--secondary-text-color); padding: 6px 12px; user-select: none; border: 1px solid var(--divider-color); border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; }
            .advanced-toggle:hover { background: var(--card-background-color, white); color: var(--primary-text-color); }
            .advanced-toggle .adv-chevron { font-size: 10px; transition: transform 0.15s ease; }
            .advanced-toggle.open .adv-chevron { transform: rotate(90deg); }
            .advanced-body { padding: 12px 0 4px 0; }
            .color-default-btn { background: none; border: 1px solid var(--divider-color); border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer; color: var(--secondary-text-color); white-space: nowrap; }
            .color-default-btn:hover:not(:disabled) { background: var(--secondary-background-color); }
            .color-default-btn:disabled { opacity: 0.45; cursor: default; }
            .templated-preview { background: var(--card-background-color, white); border: 1px solid var(--divider-color); border-radius: 4px; padding: 8px 12px; margin-bottom: 16px; font-family: monospace; font-size: 11px; color: var(--secondary-text-color); line-height: 1.6; }
            .inline-fields-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
            ha-icon-button.danger { color: var(--error-color, red); }
            .plain-button { margin-top: 4px; padding: 8px 16px; font-size: 14px; font-weight: 500; color: var(--primary-color, #03a9f4); background: transparent; border: 1px solid var(--primary-color, #03a9f4); border-radius: 4px; cursor: pointer; font-family: inherit; }
            .plain-button:hover { background: rgba(3,169,244,0.08); }
            .warning-box-details { background-color: var(--secondary-background-color); border: 1px solid var(--divider-color); border-left: 4px solid #ed8c00; padding: 12px; margin-bottom: 24px; font-size: 13px; line-height: 1.4; border-radius: 4px; color: var(--primary-text-color); }
            .warning-title { font-weight: bold; font-size: 14px; cursor: pointer; user-select: none; }
            .warning-box-details a { color: var(--primary-color, #03a9f4); text-decoration: underline; }

            /* sensor auto-detection */
            .detected-row { display: flex; align-items: center; gap: 10px; background: var(--card-background-color, white); border: 1px solid var(--divider-color); border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; }
            .detected-icon { width: 22px; height: 22px; flex-shrink: 0; }
            .detected-icon.ok   { color: var(--success-color, #4caf50); }
            .detected-icon.multi{ color: var(--primary-color, #03a9f4); }
            .detected-icon.none { color: var(--warning-color, #ff9800); }
            .detected-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
            .detected-label { font-size: 12px; color: var(--secondary-text-color); font-style: italic; }
            .detected-value { font-size: 13px; font-weight: 600; color: var(--primary-text-color); font-family: monospace; }
            .detected-override { background: none; border: 1px solid var(--divider-color); border-radius: 4px; padding: 4px 8px; cursor: pointer; color: var(--secondary-text-color); font-size: 14px; flex-shrink: 0; }
            .detected-override:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }

            /* appearance override */
            .appearance-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
            .appearance-preview { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--card-background-color, white); border: 1px solid var(--divider-color); border-radius: 8px; flex-shrink: 0; }
            .appearance-field-grow { flex: 1; }
            .appearance-field-grow ha-selector { width: 100%; }
            .color-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
            .color-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; }
            .color-input-wrap { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
            .color-swatch { width: 40px; height: 32px; border: 1px solid var(--divider-color); border-radius: 4px; cursor: pointer; padding: 2px; background: none; flex-shrink: 0; }
            .color-hex-input { font-family: monospace; font-size: 13px; color: var(--primary-text-color); width: 90px; padding: 4px 8px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--card-background-color, white); box-sizing: border-box; }
            .color-hex-input:focus { outline: none; border-color: var(--primary-color, #03a9f4); }

            /* URL field with preview */
            .url-field { margin-bottom: 8px; }
            .url-input-row { display: flex; gap: 4px; align-items: center; }
            .url-input-row input { flex: 1; min-width: 0; }
            .browse-btn { flex-shrink: 0; background: var(--secondary-background-color, #2d2d2d); border: 1px solid var(--divider-color); border-radius: 4px; padding: 0 8px; cursor: pointer; color: var(--primary-text-color); display: flex; align-items: center; height: 38px; gap: 4px; font-size: 12px; white-space: nowrap; }
            .browse-btn:hover { background: var(--primary-color, #03a9f4); color: white; border-color: var(--primary-color, #03a9f4); }
            .browse-btn ha-icon { --mdc-icon-size: 16px; }
            .url-preview-wrap { padding: 6px 0 10px; }
            .url-preview { max-height: 56px; max-width: 120px; object-fit: contain; border-radius: 4px; border: 1px solid var(--divider-color); background: white; padding: 4px; display: block; }
            .url-preview-error { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--error-color, red); }
        `;
    }

    // Opens a custom media browser overlay above all HA dialogs (z-index 100000).
    // First tries the native HA dialog-media-player-browse (action:'pick') if loaded;
    // falls back to our own WebSocket-based media browser otherwise.
    _openImageBrowser(onSelect) {
        if (!this.hass) return;
        // --- Try native HA media browser dialog ---
        const dialogTag = 'dialog-media-player-browse';
        if (customElements.get(dialogTag)) {
            const entityId = Object.keys(this.hass.states).find(id => id.startsWith('media_player.'));
            if (entityId) {
                const haRoot = document.querySelector('home-assistant');
                if (haRoot) {
                    haRoot.dispatchEvent(new CustomEvent('show-dialog', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            dialogTag,
                            dialogParams: {
                                entityId,
                                action: 'pick',
                                mediaPickedCallback: (item) => {
                                    const url = item?.media_content_id || item?.thumbnail;
                                    if (url) onSelect(url);
                                },
                            },
                        },
                    }));
                    return;
                }
            }
        }
        // --- Fall back to own media browser ---
        // Use showModal() so our dialog enters the browser top-layer above HA's own dialog.
        const backdropStyle = document.createElement('style');
        backdropStyle.textContent = '#hki-media-picker::backdrop{background:rgba(0,0,0,0.65);}';
        document.head.appendChild(backdropStyle);

        const dlg = document.createElement('dialog');
        dlg.id = 'hki-media-picker';
        dlg.style.cssText = 'padding:0;border:none;border-radius:12px;background:transparent;width:520px;max-width:93vw;max-height:82vh;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);';

        const close = () => {
            dlg.close();
            if (dlg.parentNode) dlg.parentNode.removeChild(dlg);
            if (backdropStyle.parentNode) backdropStyle.parentNode.removeChild(backdropStyle);
            blobUrls.forEach(u => URL.revokeObjectURL(u));
        };

        dlg.addEventListener('cancel', close); // ESC key

        const panel = document.createElement('div');
        panel.style.cssText = 'background:var(--card-background-color,#1c1c1c);width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;border-radius:12px;';

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:8px;padding:16px 16px 0;flex-shrink:0;';
        const breadcrumb = document.createElement('div');
        breadcrumb.style.cssText = 'flex:1;font-size:15px;font-weight:500;color:var(--primary-text-color,#fff);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        breadcrumb.textContent = this._t('browse_media');
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:20px;color:var(--secondary-text-color,#aaa);line-height:1;padding:4px 6px;flex-shrink:0;';
        closeBtn.onclick = close;
        header.appendChild(breadcrumb);
        header.appendChild(closeBtn);

        // Manual URL input
        const urlRow = document.createElement('div');
        urlRow.style.cssText = 'display:flex;gap:8px;padding:12px 16px 0;flex-shrink:0;';
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = '/local/afbeelding.png  of  https://...';
        urlInput.style.cssText = 'flex:1;min-width:0;padding:7px 10px;font-size:13px;border:1px solid var(--divider-color,#444);border-radius:4px;background:var(--secondary-background-color,#2d2d2d);color:var(--primary-text-color,#fff);font-family:inherit;box-sizing:border-box;';
        const urlOk = document.createElement('button');
        urlOk.textContent = 'OK';
        urlOk.style.cssText = 'padding:7px 14px;background:var(--primary-color,#03a9f4);color:white;border:none;border-radius:4px;cursor:pointer;font-weight:500;font-size:13px;';
        urlOk.onclick = () => { const v = urlInput.value.trim(); if (v) { onSelect(v); close(); } };
        urlRow.appendChild(urlInput);
        urlRow.appendChild(urlOk);

        const divLabel = document.createElement('div');
        divLabel.style.cssText = 'padding:10px 16px 4px;font-size:11px;color:var(--secondary-text-color,#888);text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0;';
        divLabel.textContent = 'Mediabibliotheek';

        const content = document.createElement('div');
        content.style.cssText = 'flex:1;overflow-y:auto;padding:0 16px 16px;min-height:80px;';

        panel.appendChild(header);
        panel.appendChild(urlRow);
        panel.appendChild(divLabel);
        panel.appendChild(content);
        dlg.appendChild(panel);
        document.body.appendChild(dlg);
        dlg.showModal();

        const stack = [];
        const blobUrls = []; // track for cleanup on close

        // Get the HA auth token from any available source.
        const getToken = () =>
            this.hass.auth?.data?.access_token
            || this.hass.connection?.options?.auth?.data?.access_token
            || JSON.parse(localStorage.getItem('hassTokens') || 'null')?.access_token;

        // Load thumbnail: first try direct (session cookie), then fetch with Bearer token.
        const loadThumb = (imgEl, url, onFail) => {
            if (!url) { onFail(); return; }
            imgEl.src = url;
            imgEl.onerror = () => {
                const token = getToken();
                if (!token) { onFail(); return; }
                imgEl.onerror = () => onFail();
                fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                    .then(r => { if (!r.ok) throw new Error(); return r.blob(); })
                    .then(blob => {
                        const bUrl = URL.createObjectURL(blob);
                        blobUrls.push(bUrl);
                        imgEl.src = bUrl;
                    })
                    .catch(() => onFail());
            };
        };

        const MEDIA_EMOJI = { music: '🎵', audio: '🎵', podcast: '🎙', video: '🎬', movie: '🎬', tv_show: '📺', episode: '📺', channel: '📺', app: '📱', url: '🔗', image: '🖼', photo: '🖼' };

        // Convert media-source://media_source/local/path → /local/path (served via HA's static file server)
        const mediaSourceToLocal = (id) => {
            if (!id) return null;
            if (id.startsWith('media-source://media_source/local/')) {
                return id.slice('media-source://media_source'.length);
            }
            return null;
        };

        const showImageInThumb = (thumb, url) => {
            const img = document.createElement('img');
            img.alt = '';
            img.style.cssText = 'max-width:100%;max-height:72px;object-fit:contain;';
            const onFail = () => { img.remove(); thumb.textContent = '🖼'; thumb.style.fontSize = '28px'; };
            thumb.textContent = '';
            thumb.appendChild(img);
            loadThumb(img, url, onFail);
        };

        const renderItems = (items) => {
            content.innerHTML = '';
            if (stack.length > 0) {
                const back = document.createElement('button');
                back.innerHTML = '&#8592; Terug';
                back.style.cssText = 'display:inline-flex;align-items:center;gap:4px;margin-bottom:10px;background:none;border:1px solid var(--divider-color,#444);border-radius:4px;padding:4px 10px;cursor:pointer;color:var(--primary-text-color,#fff);font-size:13px;';
                back.onclick = () => { stack.pop(); browse(stack.length ? stack[stack.length-1].id : 'media-source://media_source/local'); breadcrumb.textContent = stack.length ? stack[stack.length-1].title : this._t('browse_media'); };
                content.appendChild(back);
            }
            if (!items || items.length === 0) {
                const msg = document.createElement('div');
                msg.style.cssText = 'text-align:center;padding:32px 0;color:var(--secondary-text-color,#aaa);font-size:13px;font-style:italic;';
                msg.textContent = 'Geen bestanden gevonden';
                content.appendChild(msg);
                return;
            }
            const grid = document.createElement('div');
            grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;';
            items.forEach(item => {
                const isFolder = item.can_expand;
                const isImage = ['image', 'photo'].includes(item.media_class);
                const cell = document.createElement('div');
                cell.style.cssText = 'cursor:pointer;border:2px solid transparent;border-radius:6px;overflow:hidden;background:var(--secondary-background-color,#2a2a2a);';
                cell.title = item.title;
                const thumb = document.createElement('div');
                thumb.style.cssText = 'width:100%;height:72px;display:flex;align-items:center;justify-content:center;overflow:hidden;';
                const defaultEmoji = isFolder ? '📁' : (MEDIA_EMOJI[item.media_class] || '📄');
                thumb.textContent = defaultEmoji;
                thumb.style.fontSize = '28px';

                if (!isFolder) {
                    if (item.thumbnail && !item.thumbnail.startsWith('media-source:')) {
                        // HA provided a usable thumbnail URL — load it with auth support
                        showImageInThumb(thumb, item.thumbnail);
                    } else if (isImage && item.media_content_id) {
                        // Image file: convert media-source://media_source/local/... → /local/...
                        const localUrl = mediaSourceToLocal(item.media_content_id);
                        if (localUrl) showImageInThumb(thumb, localUrl);
                    }
                }

                const lbl = document.createElement('div');
                lbl.textContent = item.title;
                lbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color,#aaa);padding:3px 5px 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;';
                cell.appendChild(thumb);
                cell.appendChild(lbl);
                cell.addEventListener('mouseenter', () => cell.style.borderColor = 'var(--primary-color,#03a9f4)');
                cell.addEventListener('mouseleave', () => cell.style.borderColor = 'transparent');
                cell.addEventListener('click', () => {
                    if (isFolder) {
                        stack.push({ id: item.media_content_id, title: item.title });
                        breadcrumb.textContent = item.title;
                        browse(item.media_content_id);
                    } else {
                        const id = item.media_content_id;
                        const thumb = item.thumbnail;
                        // Never save media-source:// URLs — convert to /local/ path instead
                        const localUrl = mediaSourceToLocal(id);
                        const url = (thumb && !thumb.startsWith('media-source:')) ? thumb : (localUrl || id);
                        onSelect(url);
                        close();
                    }
                });
                grid.appendChild(cell);
            });
            content.appendChild(grid);
        };

        const browse = async (mediaContentId) => {
            content.innerHTML = '<div style="text-align:center;padding:32px;color:var(--secondary-text-color,#aaa);font-size:13px;">Laden…</div>';
            try {
                if (!this.hass?.callWS) throw new Error('callWS not available');
                const result = await this.hass.callWS({
                    type: 'media_source/browse_media',
                    media_content_id: mediaContentId,
                });
                renderItems(result.children || []);
            } catch (err) {
                // Fallback: show image.* entities from HA state machine
                if (!this.hass?.states) {
                    content.innerHTML = '<div style="text-align:center;padding:32px;color:var(--secondary-text-color,#aaa);font-size:13px;">Geen verbinding met Home Assistant.</div>';
                    return;
                }
                const imageEntities = Object.entries(this.hass.states)
                    .filter(([id, s]) => id.startsWith('image.') && s.state !== 'unavailable')
                    .map(([id, s]) => ({
                        media_content_id: id,
                        title: s.attributes?.friendly_name || id.replace('image.', ''),
                        thumbnail: s.attributes?.entity_picture,
                        can_expand: false,
                        can_play: true,
                        media_class: 'image',
                    }))
                    .filter(i => i.thumbnail);

                if (imageEntities.length > 0) {
                    divLabel.textContent = 'Afbeeldingen in Home Assistant';
                    renderItems(imageEntities);
                } else {
                    content.innerHTML = '<div style="text-align:center;padding:32px;color:var(--secondary-text-color,#aaa);font-size:13px;">Geen mediabron beschikbaar — gebruik de URL invoer hierboven.</div>';
                }
            }
        };

        browse('media-source://media_source/local');
    }

    // Renders a URL input field with browse button and a small live image preview below it.
    _renderUrlField(label, value, placeholder, onChange) {
        return html`
            <div class="url-field">
                <div class="plain-field" style="margin-bottom:4px;">
                    <label>${label}</label>
                    <div class="url-input-row">
                        <input type="text" .value=${value || ''} placeholder="${placeholder}" @input=${onChange} />
                        <button class="browse-btn" title="${this._t('browse_media')}"
                            @click=${() => this._openImageBrowser((val) => onChange({ target: { value: val }, stopPropagation: () => {}, preventDefault: () => {} }))}>
                            <ha-icon icon="mdi:folder-open"></ha-icon>
                            ${this._t('browse_media')}
                        </button>
                    </div>
                </div>
                ${value ? html`
                    <div class="url-preview-wrap">
                        <img class="url-preview" src="${value}"
                            alt="${label}"
                            title="${label}"
                            @error=${(ev) => { ev.target.style.display = 'none'; ev.target.nextElementSibling?.style.setProperty('display','flex'); }}
                            @load=${(ev)  => { ev.target.style.display = 'block'; ev.target.nextElementSibling?.style.setProperty('display','none'); }} />
                        <div class="url-preview-error" style="display:none;">
                            <ha-icon icon="mdi:image-broken-variant"></ha-icon>
                            <span>${this._t('url_preview_fail')}</span>
                        </div>
                    </div>` : ''}
            </div>`;
    }

    // Renders a color swatch + hex input + always-visible Standaard button.
    _renderColorPicker(label, currentColor, defaultColor, onChange, onReset) {
        const isDefault = !currentColor || currentColor === defaultColor;
        return html`
            <div class="color-row">
                <label class="color-label">${label}</label>
                <div class="color-input-wrap">
                    <input type="color" class="color-swatch"
                        .value=${currentColor || defaultColor}
                        @input=${(ev) => onChange(ev.target.value)} />
                    <input type="text" class="color-hex-input"
                        .value=${currentColor || defaultColor}
                        placeholder="#rrggbb"
                        @change=${(ev) => {
                            const v = ev.target.value.trim();
                            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
                        }} />
                    <button class="color-default-btn"
                        ?disabled=${isDefault}
                        @click=${() => { if (!isDefault) onReset(); }}>
                        ${this._t('color_default')}
                    </button>
                </div>
            </div>`;
    }

    // Renders the "Advanced: appearance override" section with icon-picker, color swatch and image selectors.
    _renderAppearanceOverride(carrier, index, preset) {
        const assets       = CARRIER_ASSETS[carrier.type] || CARRIER_ASSETS.custom;
        const currentIcon  = carrier.icon  || preset.icon;
        const currentColor = carrier.color || preset.color;
        const sectionKey   = `appearance-${index}`;
        const isOpen       = !!this._openSections[sectionKey];

        return html`
            <div class="advanced-toggle ${isOpen ? 'open' : ''}"
                @click=${() => { this._openSections = { ...this._openSections, [sectionKey]: !isOpen }; this.requestUpdate(); }}>
                <span class="adv-chevron">▶</span>
                ${this._t('adv_appearance')}
            </div>
            ${isOpen ? html`
            <div class="advanced-body">
                <div class="helper-text">${this._t('appearance_help')}</div>

                <!-- Icon picker -->
                <div class="appearance-row">
                    <div class="appearance-preview">
                        <ha-icon icon="${currentIcon}" style="color:${currentColor}; width:28px; height:28px;"></ha-icon>
                    </div>
                    <div class="appearance-field-grow">
                        <ha-selector .hass=${this.hass}
                            .selector=${{ icon: {} }}
                            .value=${currentIcon}
                            .label=${this._t('label_icon_pick')}
                            @value-changed=${(ev) => {
                                ev.stopPropagation();
                                const carriers = [...(this._config.carriers || [])];
                                carriers[index] = { ...carriers[index], icon: ev.detail.value };
                                this._config = { ...this._config, carriers };
                                this._emit();
                            }}></ha-selector>
                    </div>
                </div>

                <!-- Color -->
                ${this._renderColorPicker(
                    this._t('label_color_pick'),
                    carrier.color,
                    preset.color,
                    (val) => {
                        const carriers = [...(this._config.carriers || [])];
                        carriers[index] = { ...carriers[index], color: val };
                        this._config = { ...this._config, carriers };
                        this._emit();
                    },
                    () => {
                        const carriers = [...(this._config.carriers || [])];
                        carriers[index] = { ...carriers[index], color: undefined };
                        this._config = { ...this._config, carriers };
                        this._emit();
                    }
                )}

                <!-- Logo -->
                ${this._renderUrlField(this._t('url_logo'), carrier.logo_path, assets.logo || 'https://...', (ev) => this._carrierChanged(index, 'logo_path', ev))}

                <!-- Vehicle GIF -->
                ${this._renderUrlField(this._t('url_van'), carrier.van_path, assets.van || 'https://...', (ev) => this._carrierChanged(index, 'van_path', ev))}

                <!-- Banner -->
                ${this._renderUrlField(this._t('url_banner'), carrier.banner_path, assets.banner || 'https://...', (ev) => this._carrierChanged(index, 'banner_path', ev))}
            </div>` : ''}`;
    }

    // Renders the user/account detection block: badge if 1 found, dropdown if multiple, manual if none.
    // Never mutates state during render — auto-fill happens in _addCarrier / _carrierTypeChanged.
    _renderUserDetection(carrier, index, preset, supportsLetters) {
        const detected   = this._detectUsers(carrier.type);
        const entityPreview = carrier.entity_incoming ? html`
            <div class="templated-preview">
                <div>${carrier.entity_incoming}</div>
                <div>${carrier.entity_delivered}</div>
                <div>${carrier.entity_outgoing}</div>
                <div>${carrier.entity_outgoing_delivered}</div>
                ${supportsLetters && carrier.entity_letters ? html`<div>${carrier.entity_letters}</div>` : ''}
            </div>` : '';

        // Single account found and not overridden by user → show auto-detected badge.
        if (detected.length === 1 && !carrier._manualUser) {
            return html`
                <div class="detected-row">
                    <ha-icon icon="mdi:check-circle" class="detected-icon ok"></ha-icon>
                    <div class="detected-info">
                        <div class="detected-label">${this._t('detected_one')}</div>
                        <div class="detected-value">${(carrier.user != null ? carrier.user : detected[0].user) || this._t('no_prefix')}</div>
                    </div>
                    <button class="detected-override" title="Enter manually"
                        @click=${() => {
                            const carriers = [...(this._config.carriers || [])];
                            carriers[index] = { ...carriers[index], _manualUser: true };
                            this._config = { ...this._config, carriers };
                            this._emit();
                        }}>✎</button>
                </div>
                ${entityPreview}`;
        }

        // Multiple accounts found and not overridden → show dropdown.
        if (detected.length > 1 && !carrier._manualUser) {
            return html`
                <div class="detected-row">
                    <ha-icon icon="mdi:account-multiple" class="detected-icon multi"></ha-icon>
                    <div class="detected-info detected-label">${this._t('detected_multiple')}</div>
                    <button class="detected-override" title="Enter manually"
                        @click=${() => {
                            const carriers = [...(this._config.carriers || [])];
                            carriers[index] = { ...carriers[index], _manualUser: true };
                            this._config = { ...this._config, carriers };
                            this._emit();
                        }}>✎</button>
                </div>
                <ha-selector .hass=${this.hass}
                    .selector=${{ select: {
                        options: detected.map(u => ({ value: u.user, label: u.user })),
                        mode: 'dropdown'
                    } }}
                    .value=${carrier.user || detected[0].user}
                    .label=${this._t('label_account')}
                    @value-changed=${(ev) => {
                        ev.stopPropagation();
                        this._carrierUserSelected(index, window.HKI.getSelectValue(ev));
                    }}></ha-selector>
                ${entityPreview}`;
        }

        // 0 detected and no manual override yet → if a known repo URL exists, show install link instead of input.
        if (detected.length === 0 && !carrier._manualUser) {
            const repoUrl = CARRIER_REPO_URLS[carrier.type];
            if (repoUrl) {
                return html`
                    <div class="detected-row">
                        <ha-icon icon="mdi:alert-circle-outline" class="detected-icon none"></ha-icon>
                        <div class="detected-info">
                            <div class="detected-label">${this._t('integration_not_found')}</div>
                            <a href="${repoUrl}" target="_blank" rel="noopener" style="font-size:12px;word-break:break-all;">${repoUrl}</a>
                        </div>
                        <button class="detected-override" title="Enter manually"
                            @click=${() => {
                                const carriers = [...(this._config.carriers || [])];
                                carriers[index] = { ...carriers[index], _manualUser: true };
                                this._config = { ...this._config, carriers };
                                this._emit();
                            }}>✎</button>
                    </div>`;
            }
        }

        // 0 detected OR user chose manual entry → text input with sanitization.
        return html`
            ${detected.length > 0 ? html`
                <div class="detected-row">
                    <ha-icon icon="mdi:pencil" class="detected-icon multi"></ha-icon>
                    <div class="detected-info detected-label">${this._t('label_account')}</div>
                    <button class="detected-override" title="Back to auto-detect"
                        @click=${() => {
                            const carriers = [...(this._config.carriers || [])];
                            carriers[index] = { ...carriers[index], _manualUser: false };
                            this._config = { ...this._config, carriers };
                            this._emit();
                        }}>↩</button>
                </div>` : html`
                <div class="detected-row">
                    <ha-icon icon="mdi:help-circle-outline" class="detected-icon none"></ha-icon>
                    <div class="detected-info detected-label">${this._t('detected_none')}</div>
                </div>`}
            <div class="plain-field" style="margin-top:8px;">
                <label for="hki-carrier-user-${index}">${this._t('label_account')}</label>
                <input id="hki-carrier-user-${index}" type="text" placeholder="e.g. my_account"
                    .value=${carrier.user || ''}
                    @change=${(ev) => this._carrierUserInputChanged(index, ev)} />
            </div>
            <div class="helper-text">"_${preset.sensor_slug}${this._t('account_help_suffix')}</div>
            ${entityPreview}`;
    }

    _renderEntityPicker(label, value, helper, onChange) {
        return html`
            <div class="plain-field">
                <label>${label}</label>
                <input type="text" .value=${value || ''} placeholder="${helper || ''}" @change=${onChange} />
            </div>`;
    }

    _renderCarrier(carrier, index) {
        const expanded = carrier._expanded !== false;
        const preset   = CARRIER_PRESETS[carrier.type] || CARRIER_PRESETS.custom;
        const supportsLetters = preset.supports_letters;

        return html`
            <div class="carrier-card">
                <div class="carrier-card-header" @click=${() => this._toggleCarrierExpanded(index)}>
                    <div class="carrier-card-header-title">
                        <ha-icon class="chevron ${expanded ? 'expanded' : ''}" icon="mdi:chevron-right"></ha-icon>
                        <ha-icon icon="${carrier.icon || preset.icon}" style="color:${carrier.color || preset.color};"></ha-icon>
                        <span>${carrier.name || preset.label || `Carrier ${index + 1}`}</span>
                    </div>
                    <ha-icon-button class="danger" .path=${"M19,13H5V11H19V13Z"}
                        @click=${(ev) => { ev.stopPropagation(); this._removeCarrier(index); }}
                        title="${this._t('btn_remove_carrier')}"></ha-icon-button>
                </div>

                ${expanded ? html`
                <div class="carrier-card-body">
                    <ha-selector .hass=${this.hass}
                        .selector=${{ select: { options: [
                            { value: 'postnl_v4',     label: 'PostNL' },
                            { value: 'dhl',           label: 'DHL' },
                            { value: 'dpd',           label: 'DPD' },
                            { value: 'postnl',        label: 'PostNL (<v4.x)' },
                            { value: 'postnl_legacy', label: 'PostNL (ArjenBos)' },
                            { value: 'custom',        label: 'Custom' }
                        ], mode: 'dropdown' } }}
                        .value=${carrier.type || 'postnl_v4'} .label=${"Carrier"}
                        @value-changed=${(ev) => this._carrierTypeChanged(index, ev)}></ha-selector>

                    ${carrier.type === 'custom' ? html`
                        <div class="plain-field">
                            <label for="hki-carrier-name-${index}">${this._t('label_carrier_name')}</label>
                            <input id="hki-carrier-name-${index}" type="text" .value=${carrier.name || ''}
                                @input=${(ev) => this._carrierChanged(index, 'name', ev)} />
                        </div>
                    ` : carrier.type === 'postnl_legacy' ? html`
                        <div class="helper-text">
                            ⚠ ${this._t('legacy_warning')}
                            (<a href="https://github.com/arjenbos/ha-postnl" target="_blank">arjenbos/ha-postnl</a>)
                        </div>
                        ${this._renderEntityPicker(this._t('postnl_entity_label'), carrier.entity, 'e.g. sensor.postnl_delivery', (ev) => this._carrierChanged(index, 'entity', ev))}
                        ${this._renderEntityPicker(this._t('postnl_dist_label'), carrier.distribution_entity, 'e.g. sensor.postnl_distribution', (ev) => this._carrierChanged(index, 'distribution_entity', ev))}
                    ` : this._renderUserDetection(carrier, index, preset, supportsLetters)}

                    ${carrier.type !== 'postnl_legacy' ? (() => {
                        const sk = `sensors-${index}`;
                        const open = !!this._openSections[sk];
                        return html`
                        <div class="advanced-toggle ${open ? 'open' : ''}"
                            @click=${() => { this._openSections = { ...this._openSections, [sk]: !open }; this.requestUpdate(); }}>
                            <span class="adv-chevron">▶</span>
                            ${this._t('adv_sensors')}
                        </div>
                        ${open ? html`
                        <div class="advanced-body">
                            <div class="helper-text">${this._t('adv_sensors_help')}</div>
                            ${this._renderEntityPicker(this._t('entity_incoming'), carrier.entity_incoming, 'e.g. sensor.dhl_incoming_parcels', (ev) => this._carrierChanged(index, 'entity_incoming', ev))}
                            ${this._renderEntityPicker(this._t('entity_delivered'), carrier.entity_delivered, 'e.g. sensor.dhl_delivered_parcels', (ev) => this._carrierChanged(index, 'entity_delivered', ev))}
                            ${this._renderEntityPicker(this._t('entity_outgoing'), carrier.entity_outgoing, 'e.g. sensor.dhl_outgoing_parcels', (ev) => this._carrierChanged(index, 'entity_outgoing', ev))}
                            ${this._renderEntityPicker(this._t('entity_outgoing_delivered'), carrier.entity_outgoing_delivered, 'e.g. sensor.dhl_outgoing_delivered_parcels', (ev) => this._carrierChanged(index, 'entity_outgoing_delivered', ev))}
                            ${supportsLetters
                                ? this._renderEntityPicker(this._t('entity_letters'), carrier.entity_letters, this._t('letters_entity_help'), (ev) => this._carrierChanged(index, 'entity_letters', ev))
                                : html`<div class="helper-text">${this._t('no_letters_support')}</div>`}
                        </div>` : ''}`;
                    })() : ''}

                    ${this._renderAppearanceOverride(carrier, index, preset)}
                </div>` : ''}
            </div>`;
    }

    render() {
        if (!this._config) return html``;
        const carriers     = Array.isArray(this._config.carriers) ? this._config.carriers : [];
        const currentLayout = this._config.layout_order || ['header', 'animation', 'tabs', 'list'];
        const layoutLabels = {
            header:    this._t('layout_header'),
            animation: this._t('layout_animation'),
            tabs:      this._t('layout_tabs'),
            list:      this._t('layout_list')
        };

        return html`
            <div class="card-config">
                <details class="warning-box-details" open>
                    <summary class="warning-title">${this._t('editor_title')}</summary>
                    <div style="margin-top:8px;">${this._t('editor_intro1')}</div>
                    <div style="margin-top:8px;">${this._t('editor_intro2')}</div>
                </details>

                <details class="section-details" open>
                    <summary class="section">${this._t('section_basic')}</summary>
                    <div class="plain-field">
                        <label for="hki-title-input">${this._t('label_card_title')}</label>
                        <input id="hki-title-input" type="text" .value=${this._config.title || ''}
                            data-field="title" @input=${this._changed} />
                    </div>
                    <div class="plain-field">
                        <label for="hki-days-input">${this._t('label_days_back')}</label>
                        <input id="hki-days-input" type="number" .value=${String(this._config.days_back || 90)}
                            min="1" max="365" data-field="days_back" @input=${this._changed} />
                    </div>
                </details>

                <details class="section-details" open>
                    <summary class="section">${this._t('section_carriers')}</summary>
                    ${carriers.map((carrier, index) => this._renderCarrier(carrier, index))}
                    <button class="plain-button" @click=${() => this._addCarrier()}>${this._t('btn_add_carrier')}</button>
                </details>

                <details class="section-details">
                    <summary class="section">${this._t('section_layout')}</summary>
                    <div class="helper-text">${this._t('layout_help')}</div>
                    ${currentLayout.map((item, index) => html`
                        <div class="sort-item">
                            <div class="sort-actions">
                                <ha-icon-button .path=${"M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"}
                                    @click=${() => this._moveBlock(index, 'up')} ?disabled=${index === 0}></ha-icon-button>
                                <ha-icon-button .path=${"M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"}
                                    @click=${() => this._moveBlock(index, 'down')} ?disabled=${index === currentLayout.length - 1}></ha-icon-button>
                            </div>
                            <span class="sort-label">${layoutLabels[item] || item}</span>
                        </div>`)}
                </details>

                <details class="section-details">
                    <summary class="section">${this._t('section_display')}</summary>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_header !== false} data-field="show_header" @change=${this._changed}></ha-switch><span>${this._t('show_header')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_delivered !== false} data-field="show_delivered" @change=${this._changed}></ha-switch><span>${this._t('show_delivered_tab')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_sent !== false} data-field="show_sent" @change=${this._changed}></ha-switch><span>${this._t('show_sent_tab')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_letters !== false} data-field="show_letters" @change=${this._changed}></ha-switch><span>${this._t('show_letters_tab')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_animation !== false} data-field="show_animation" @change=${this._changed}></ha-switch><span>${this._t('show_animation')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_placeholder !== false} data-field="show_placeholder" @change=${this._changed}></ha-switch><span>${this._t('show_placeholder')}</span></div>
                    <div class="switch-row"><ha-switch .checked=${this._config.show_tracking_link !== false} data-field="show_tracking_link" @change=${this._changed}></ha-switch><span>${this._t('show_tracking_link')}</span></div>
                </details>

                <details class="section-details">
                    <summary class="section">${this._t('section_appearance')}</summary>
                    ${this._renderColorPicker(
                        this._t('label_header_color'),
                        this._config.header_color,
                        '',
                        (val) => { this._config = { ...this._config, header_color: val }; this._emit(); },
                        ()    => { this._config = { ...this._config, header_color: '' };  this._emit(); }
                    )}
                    ${this._renderColorPicker(
                        this._t('label_header_text'),
                        this._config.header_text_color,
                        '',
                        (val) => { this._config = { ...this._config, header_text_color: val }; this._emit(); },
                        ()    => { this._config = { ...this._config, header_text_color: '' };  this._emit(); }
                    )}
                    ${this._renderUrlField(
                        this._t('label_placeholder_img'),
                        this._config.placeholder_image,
                        'https://...',
                        (ev) => { this._config = { ...this._config, placeholder_image: ev.target.value }; this._emit(); }
                    )}
                </details>
            </div>`;
    }
}


customElements.define('hki-parcels-card', HkiParcelsCard);
customElements.define('hki-parcels-card-editor', HkiParcelsCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "hki-parcels-card",
    name: "HKI Parcels Card",
    description: "Multi-carrier parcel tracker (PostNL, DHL, DPD) — fork of jimz011/hki-elements",
    preview: true
});
