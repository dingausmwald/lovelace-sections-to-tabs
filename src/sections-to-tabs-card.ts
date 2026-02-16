import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

interface CardConfig {
  type: string;
  mediaquery?: string;
  position?: 'top' | 'bottom';
  show_labels?: boolean; // true = text + icon, false = nur icons
  full_width?: boolean; // true = sections volle breite, false = wie konfiguriert (default: true)
  align?: 'left' | 'center' | 'right'; // Tab-Ausrichtung (default: center)
  height?: number; // Tab-Leisten-Höhe in px (default: 48)
  inverted?: boolean; // true = dunkler Hintergrund, heller Text (default: false)
  show_all?: boolean; // true = alle Sections sichtbar + Scroll-Spy (default: true)
  background_color?: string; // default: var(--primary-background-color)
  foreground_color?: string; // default: var(--primary-color)
  tabs?: {
    section: string;
    icon?: string;
    title?: string;
  }[];
}

class SectionsToTabsCard extends LitElement {
  @property({ attribute: false }) hass: any;

  @state() private _config!: CardConfig;
  @state() private _activeTab = 0;
  @state() private _showTabs = false;
  @state() private _sections: HTMLElement[] = [];
  @state() private _sectionNames: string[] = [];

  private _mediaQueryList?: MediaQueryList;
  private _view: HTMLElement | null = null;
  private _resizeObserver?: ResizeObserver;
  private _scrollHandler?: () => void;
  private _scrollSpyPaused = false;

  static getStubConfig() {
    return {
      type: 'custom:sections-to-tabs-card',
      mediaquery: '(max-width: 768px)',
      position: 'top',
      align: 'center',
      height: 58,
      show_labels: true,
      show_all: true,
      background_color: 'var(--primary-background-color)',
      foreground_color: 'var(--primary-color)',
    };
  }

  static getConfigElement() {
    return document.createElement('sections-to-tabs-editor');
  }

  setConfig(config: CardConfig) {
    console.log('sections-to-tabs: setConfig', config);
    this._config = config;
    this.requestUpdate();
  }

  getCardSize() {
    return 1;
  }

  connectedCallback() {
    super.connectedCallback();
    // Warte bis DOM komplett ist - Android App braucht länger
    this._waitForView();
  }

  private async _waitForView() {
    // Mehrere Versuche mit steigender Wartezeit für Android App
    const delays = [100, 300, 500, 1000, 2000];

    for (const delay of delays) {
      await new Promise(r => setTimeout(r, delay));
      this._init();

      if (this._view && this._sections.length > 0) {
        console.log('sections-to-tabs: initialized after', delay, 'ms');
        return;
      }
    }
    console.log('sections-to-tabs: failed to initialize after all attempts');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mediaQueryList) {
      this._mediaQueryList.removeEventListener('change', this._handleMediaChange);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    this._teardownScrollSpy();
    // Sections und ihre Wrapper wieder sichtbar machen
    this._resetSectionStyles();
    // Tab-Leiste aus dem DOM entfernen
    if (this._tabsContainer) {
      this._tabsContainer.remove();
      this._tabsContainer = null;
    }
  }

  private _handleMediaChange = (e: MediaQueryListEvent) => {
    this._showTabs = e.matches;
    this._updateVisibility();
  };

  private _init() {
    this._activeTab = 0;
    this._findSections();
    this._debugDomTree();
    this._setupMediaQuery();
    this._updateVisibility();
  }

  private _findSections() {
    // Finde hui-sections-view über parent chain
    let el: HTMLElement | null = this;
    let depth = 0;
    while (el && depth < 20) {
      console.log('sections-to-tabs: checking', el.tagName);
      if (el.tagName?.toLowerCase() === 'hui-sections-view') {
        this._view = el;
        break;
      }
      // Auch durch shadowRoot parents gehen
      el = el.parentElement || (el.getRootNode() as ShadowRoot)?.host as HTMLElement;
      depth++;
    }

    console.log('sections-to-tabs: view found?', this._view?.tagName);

    if (!this._view) return;

    // Versuche Sections im shadowRoot zu finden
    let sections: NodeListOf<Element> | null = null;

    if (this._view.shadowRoot) {
      sections = this._view.shadowRoot.querySelectorAll('hui-section');
      console.log('sections-to-tabs: sections in shadowRoot', sections.length);
    }

    // Fallback: direkt im Element
    if (!sections || sections.length === 0) {
      sections = this._view.querySelectorAll('hui-section');
      console.log('sections-to-tabs: sections direct', sections.length);
    }

    this._sections = Array.from(sections) as HTMLElement[];

    // Extrahiere Namen
    const allNames = this._sections.map((section, i) => {
      const config = (section as any).config;
      const name = config?.title || config?.name || `Section ${i + 1}`;
      console.log(`sections-to-tabs: section[${i}] config:`, JSON.stringify(config), '→ name:', name);
      return name;
    });

    // Sortiere Sections nach tabs-Config Reihenfolge (Matching über section-Name)
    if (this._config?.tabs?.length) {
      const orderedSections: HTMLElement[] = [];
      const orderedNames: string[] = [];
      const used = new Set<number>();

      for (const tab of this._config.tabs) {
        const tabName = tab.section?.toLowerCase();
        if (!tabName) continue;
        const idx = allNames.findIndex(
          (name, i) => !used.has(i) && name.toLowerCase() === tabName
        );
        console.log(`sections-to-tabs: matching tab "${tab.section}" → found at index ${idx} (names: ${allNames.map(n => `"${n}"`).join(', ')})`);
        if (idx !== -1) {
          orderedSections.push(this._sections[idx]);
          orderedNames.push(allNames[idx]);
          used.add(idx);
        }
      }

      // Nicht-gematchte Sections ans Ende
      this._sections.forEach((section, i) => {
        if (!used.has(i)) {
          orderedSections.push(section);
          orderedNames.push(allNames[i]);
        }
      });

      this._sections = orderedSections;
      this._sectionNames = orderedNames;
    } else {
      this._sectionNames = allNames;
    }

    console.log('sections-to-tabs: found sections', this._sectionNames);
    this.requestUpdate();
  }

  private _debugDomTree() {
    if (!this._sections.length) return;
    const section = this._sections[0];
    console.log('sections-to-tabs: === DOM DEBUG ===');
    console.log('sections-to-tabs: section tag:', section.tagName, 'has shadowRoot:', !!section.shadowRoot);

    // Walk up from section
    let el: HTMLElement | null = section;
    let level = 0;
    while (el && level < 15) {
      const computed = window.getComputedStyle(el);
      console.log(
        `sections-to-tabs: [${level}] <${el.tagName.toLowerCase()}> class="${el.className}"`,
        `| display: ${computed.display}`,
        `| grid-template-columns: ${computed.gridTemplateColumns}`,
        `| width: ${computed.width}`,
        `| max-width: ${computed.maxWidth}`,
        `| padding: ${computed.paddingLeft} ${computed.paddingRight}`,
        `| margin: ${computed.marginLeft} ${computed.marginRight}`,
        `| hasShadowRoot: ${!!el.shadowRoot}`
      );
      if (el === this._view) {
        console.log('sections-to-tabs: ^^^ this is the view');
        break;
      }
      el = el.parentElement || (el.getRootNode() as ShadowRoot)?.host as HTMLElement;
      level++;
    }

    // Also check view's shadowRoot children
    if (this._view?.shadowRoot) {
      console.log('sections-to-tabs: view shadowRoot children:');
      this._view.shadowRoot.childNodes.forEach(child => {
        if (child instanceof HTMLElement) {
          console.log(`  <${child.tagName.toLowerCase()}> class="${child.className}"`);
        } else if (child instanceof HTMLStyleElement) {
          console.log('  <style>');
        }
      });
    }
    console.log('sections-to-tabs: === END DEBUG ===');
  }

  private _setupMediaQuery() {
    if (this._mediaQueryList) {
      this._mediaQueryList.removeEventListener('change', this._handleMediaChange);
    }

    const mq = this._config?.mediaquery || '(max-width: 768px)';
    this._mediaQueryList = window.matchMedia(mq);
    this._mediaQueryList.addEventListener('change', this._handleMediaChange);
    this._showTabs = this._mediaQueryList.matches;
    console.log('sections-to-tabs: mediaquery', mq, 'matches:', this._showTabs);
    this.requestUpdate();
  }

  private _resetSectionStyles() {
    this._sections.forEach(section => {
      section.style.display = '';
      const wrapper = section.parentElement;
      if (wrapper) {
        wrapper.style.display = '';
        wrapper.style.gridColumn = '';
        wrapper.style.scrollMarginTop = '';
        wrapper.style.order = '';
      }
    });
    // Padding vom View entfernen
    if (this._view) {
      this._view.style.paddingTop = '';
      this._view.style.paddingBottom = '';
    }
  }

  private _updateVisibility() {
    if (!this._sections.length) return;

    const showAll = this._config?.show_all !== false; // default true

    if (this._showTabs) {
      if (showAll) {
        // Show-All-Modus: Alle Sections sichtbar + volle Breite
        const height = this._config?.height || 58;
        const position = this._config?.position || 'top';
        const scrollMargin = position === 'top' ? (56 + height) : 0;

        this._sections.forEach((section, i) => {
          section.style.display = '';
          const wrapper = section.parentElement;
          if (wrapper) {
            wrapper.style.display = '';
            wrapper.style.setProperty('grid-column', '1 / -1', 'important');
            wrapper.style.scrollMarginTop = `${scrollMargin}px`;
            wrapper.style.order = `${i}`;
          }
        });
        this._setupScrollSpy();
      } else {
        // Tab-Modus: nur aktive Section zeigen
        this._teardownScrollSpy();
        this._sections.forEach((section, i) => {
          const wrapper = section.parentElement;
          if (i === this._activeTab) {
            section.style.display = '';
            if (wrapper) {
              wrapper.style.display = '';
              wrapper.style.setProperty('grid-column', '1 / -1', 'important');
            }
          } else {
            section.style.display = 'none';
            if (wrapper) {
              wrapper.style.display = 'none';
            }
          }
        });
      }
    } else {
      // Normal-Modus: Alles zurücksetzen
      this._teardownScrollSpy();
      this._resetSectionStyles();
    }
  }

  private _selectTab(index: number) {
    this._activeTab = index;
    const showAll = this._config?.show_all !== false;

    if (showAll && this._showTabs) {
      // Scroll zur Section, kurz Scroll-Spy pausieren
      this._scrollSpyPaused = true;
      const wrapper = this._sections[index]?.parentElement;
      if (wrapper) {
        wrapper.scrollIntoView({ behavior: 'smooth' });
      }
      this._updateTabIndicator();
      setTimeout(() => { this._scrollSpyPaused = false; }, 800);
    } else {
      this._updateVisibility();
    }
  }

  private _setupScrollSpy() {
    if (this._scrollHandler) return; // already active

    this._scrollHandler = () => {
      if (this._scrollSpyPaused) return;

      const height = this._config?.height || 58;
      const offset = 56 + height + 20; // HA header + tab bar + buffer

      // Nach visueller Position sortieren, aber Tab-Index beibehalten
      const positions = this._sections.map((section, i) => ({
        index: i,
        top: section.parentElement?.getBoundingClientRect().top ?? Infinity
      })).sort((a, b) => a.top - b.top);

      let activeIndex = 0;
      for (const pos of positions) {
        if (pos.top <= offset) {
          activeIndex = pos.index;
        }
      }

      if (activeIndex !== this._activeTab) {
        this._activeTab = activeIndex;
        this._updateTabIndicator();
      }
    };

    window.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  private _teardownScrollSpy() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = undefined;
    }
  }

  private _updateTabIndicator() {
    if (!this._tabsContainer) return;
    const fgColor = this._config?.foreground_color || 'var(--primary-color)';
    const buttons = this._tabsContainer.querySelectorAll('button');
    buttons.forEach((btn, i) => {
      const isActive = i === this._activeTab;
      btn.style.borderBottom = `2px solid ${isActive ? fgColor : 'transparent'}`;
      btn.style.opacity = isActive ? '1' : '0.5';
    });
  }

  private _getTabLabel(index: number): string {
    const tabs = this._config?.tabs || [];
    if (tabs[index]?.title) return tabs[index].title!;
    if (tabs[index]?.section) return tabs[index].section;
    return this._sectionNames[index] || `Tab ${index + 1}`;
  }

  private _getTabIcon(index: number): string | undefined {
    const tabs = this._config?.tabs || [];
    return tabs[index]?.icon;
  }

  private _tabsContainer: HTMLElement | null = null;

  private _createTabsContainer() {
    if (!this._view) return;

    // Prüfe ob Container noch im DOM ist
    if (this._tabsContainer && this._tabsContainer.isConnected) return;

    // Entferne ALLE existierenden Container (falls Card neu instanziiert wurde)
    document.querySelectorAll('.sections-to-tabs-bar').forEach(el => el.remove());

    this._tabsContainer = document.createElement('div');
    this._tabsContainer.className = 'sections-to-tabs-bar';

    // Fixed position - einfach an body anhängen
    document.body.appendChild(this._tabsContainer);

    // ResizeObserver um bei Sidebar-Änderungen die Position zu aktualisieren
    if (this._view && !this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        if (this._showTabs) {
          this._renderTabsToContainer();
        }
      });
      this._resizeObserver.observe(this._view);
    }

    console.log('sections-to-tabs: tabs container created');
  }

  private _renderTabsToContainer() {
    if (!this._tabsContainer) return;

    const position = this._config?.position || 'top';
    const align = this._config?.align || 'center';
    const justifyContent = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    const height = this._config?.height || 58;

    // Content-Bereich: left-Position der View = Sidebar-Breite
    const leftOffset = this._view ? this._view.getBoundingClientRect().left : 0;
    const leftPadding = leftOffset > 0 ? 12 : 0;
    const bgColor = this._config?.background_color || 'var(--primary-background-color)';
    const fgColor = this._config?.foreground_color || 'var(--primary-color)';

    this._tabsContainer.setAttribute('style', `
      display: flex;
      gap: 0;
      padding: 0 8px 0 ${leftPadding}px;
      background: ${bgColor};
      justify-content: ${justifyContent};
      width: calc(100% - ${leftOffset}px);
      box-sizing: border-box;
      height: ${height}px;
      align-items: center;
      ${position === 'top' ? 'border-bottom: 1px solid var(--divider-color);' : 'border-top: 1px solid var(--divider-color);'}
      position: fixed;
      ${position === 'top' ? 'top: 56px;' : 'bottom: 0;'}
      left: ${leftOffset}px;
      z-index: 2;
    `);

    this._tabsContainer.innerHTML = '';
    const showLabels = this._config?.show_labels !== false; // default true
    // Icon-Größe proportional zur Leisten-Höhe
    const iconSize = showLabels ? Math.round(height * 0.33) : Math.round(height * 0.42);

    // Content verdrängen statt überdecken
    if (this._view) {
      if (position === 'top') {
        this._view.style.paddingTop = `${height}px`;
        this._view.style.paddingBottom = '';
      } else {
        this._view.style.paddingBottom = `${height}px`;
        this._view.style.paddingTop = '';
      }
    }

    this._sections.forEach((_, i) => {
      const btn = document.createElement('button');
      const icon = this._getTabIcon(i);
      const label = this._getTabLabel(i);
      const isActive = i === this._activeTab;

      if (showLabels) {
        btn.innerHTML = `
          ${icon ? `<ha-icon icon="${icon}" style="--mdc-icon-size: ${iconSize}px;"></ha-icon>` : ''}
          <span>${label}</span>
        `;
      } else {
        // Nur Icons
        btn.innerHTML = icon
          ? `<ha-icon icon="${icon}" style="--mdc-icon-size: ${iconSize}px;"></ha-icon>`
          : `<span>${label}</span>`;
        btn.title = label; // Tooltip
      }

      btn.style.cssText = `
        padding: ${showLabels ? '0 16px' : '0'};
        border: none;
        background: transparent;
        color: ${fgColor};
        cursor: pointer;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-family: inherit;
        font-size: 14px;
        ${showLabels ? '' : 'width: 56px;'};
        height: 100%;
        box-sizing: border-box;
        border-bottom: 2px solid ${isActive ? fgColor : 'transparent'};
        opacity: ${isActive ? '1' : '0.5'};
        transition: opacity 0.2s, border-color 0.2s;
      `;
      btn.onclick = () => this._selectTab(i);
      this._tabsContainer!.appendChild(btn);
    });
  }

  render() {
    // Tabs werden extern gerendert, Card selbst ist unsichtbar
    if (this._showTabs && this._sections.length > 0) {
      this._createTabsContainer();
      this._renderTabsToContainer();
    } else if (this._tabsContainer) {
      this._tabsContainer.remove();
      this._tabsContainer = null;
    }

    return html``;
  }

  static styles = css`
    :host {
      display: none !important;
    }
  `;
}

customElements.define('sections-to-tabs-card', SectionsToTabsCard);

// ── Editor ──
class SectionsToTabsEditor extends LitElement {
  @property({ attribute: false }) hass: any;
  @state() private _config!: CardConfig;

  private _schema = [
    {
      name: '',
      type: 'grid' as const,
      schema: [
        { name: 'mediaquery', selector: { text: {} } },
        { name: 'position', selector: { select: { options: ['top', 'bottom'] } } },
        { name: 'align', selector: { select: { options: ['left', 'center', 'right'] } } },
        { name: 'height', selector: { number: { min: 30, max: 120, step: 1, mode: 'slider' as const } } },
      ],
    },
    {
      name: '',
      type: 'grid' as const,
      schema: [
        { name: 'show_labels', selector: { boolean: {} } },
        { name: 'show_all', selector: { boolean: {} } },
      ],
    },
    {
      name: '',
      type: 'grid' as const,
      schema: [
        { name: 'background_color', selector: { text: {} } },
        { name: 'foreground_color', selector: { text: {} } },
      ],
    },
  ];

  private _labels: Record<string, string> = {
    mediaquery: 'Media Query',
    position: 'Position',
    align: 'Alignment',
    height: 'Height (px)',
    show_labels: 'Show Labels',
    show_all: 'Show All Sections',
    background_color: 'Background Color',
    foreground_color: 'Foreground Color',
  };

  setConfig(config: CardConfig) {
    this._config = config;
  }

  private _fireChanged() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  private _formChanged(e: CustomEvent) {
    const newConfig = { ...this._config, ...e.detail.value };
    this._config = newConfig;
    this._fireChanged();
  }

  private _addTab() {
    const tabs = [...(this._config.tabs || []), { section: '', icon: '', title: '' }];
    this._config = { ...this._config, tabs };
    this._fireChanged();
  }

  private _removeTab(index: number) {
    const tabs = [...(this._config.tabs || [])];
    tabs.splice(index, 1);
    this._config = { ...this._config, tabs };
    this._fireChanged();
  }

  private _tabChanged(index: number, field: string, value: string) {
    const tabs = [...(this._config.tabs || [])];
    tabs[index] = { ...tabs[index], [field]: value };
    this._config = { ...this._config, tabs };
    this._fireChanged();
  }

  render() {
    if (!this._config) return html``;

    const tabs = this._config.tabs || [];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${(s: { name: string }) => this._labels[s.name] || s.name}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="tabs-header">
        <span>Tabs</span>
        <ha-icon-button @click=${this._addTab}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </ha-icon-button>
      </div>

      ${tabs.map((tab, i) => html`
        <div class="tab-row">
          <ha-textfield
            label="Section"
            .value=${tab.section || ''}
            @change=${(e: Event) => this._tabChanged(i, 'section', (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="Icon"
            .value=${tab.icon || ''}
            @value-changed=${(e: CustomEvent) => this._tabChanged(i, 'icon', e.detail.value)}
          ></ha-icon-picker>
          <ha-textfield
            label="Title"
            .value=${tab.title || ''}
            @change=${(e: Event) => this._tabChanged(i, 'title', (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-icon-button @click=${() => this._removeTab(i)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        </div>
      `)}
    `;
  }

  static styles = css`
    .tabs-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0 4px;
      font-weight: 500;
      font-size: 14px;
      border-top: 1px solid var(--divider-color);
      margin-top: 12px;
    }
    .tab-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .tab-row ha-textfield {
      flex: 1;
    }
    .tab-row ha-icon-picker {
      flex: 1;
    }
  `;
}

customElements.define('sections-to-tabs-editor', SectionsToTabsEditor);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'sections-to-tabs-card',
  name: 'Sections to Tabs',
  description: 'Converts sections to tabs on mobile'
});

console.info(
  '%c SECTIONS-TO-TABS %c v1.5.0 ',
  'color: white; background: #039be5; font-weight: bold;',
  'color: #039be5; background: white; font-weight: bold;'
);
