# Sections to Tabs Card

Home Assistant custom card that automatically converts sections into a tab bar based on browser resolution.

## Installation

### HACS (recommended)
1. Open HACS
2. Frontend
3. Custom repositories → Add repository
4. Search for "Sections to Tabs Card"
5. Install

### Manual
1. Copy `sections-to-tabs-card.js` to `/config/www/`
2. Add resource:
```yaml
resources:
  - url: /hacsfiles/lovelace-sections-to-tabs/sections-to-tabs-card.js
    type: module
```

## Usage

**Important:** For the card to map sections to tabs, each section needs a name. Simply give your section a `name` in its config and reference it in the `tabs` section:

```yaml
# In your dashboard section config:
type: sections
sections:
  - type: grid
    name: Living Room   # ← this name is used for tab mapping
    cards: [...]
  - type: grid
    name: Media
    cards: [...]
```

Full example with all options:

```yaml
type: custom:sections-to-tabs-card
mediaquery: "(max-width: 768px)"
position: top
show_labels: false
show_all: true
align: center
height: 58
tabs:
  - section: Living Room
    title: Living Room
    icon: mdi:sofa
  - section: Media
    title: Media
    icon: mdi:television
  - section: Security
    title: Security
    icon: mdi:shield-home
```

Minimal example:

```yaml
type: custom:sections-to-tabs-card
tabs:
  - section: Living Room
    icon: mdi:sofa
  - section: Media
    icon: mdi:television
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mediaquery` | string | `(max-width: 768px)` | CSS media query that activates the tab bar |
| `position` | string | `top` | Tab bar position: `top` or `bottom` |
| `show_labels` | boolean | `true` | `true` = icon + text, `false` = icons only |
| `show_all` | boolean | `true` | `true` = all sections visible with scroll spy, `false` = only active section |
| `align` | string | `center` | Tab alignment: `left`, `center` or `right` |
| `height` | number | `58` | Tab bar height in px |
| `background_color` | string | `var(--primary-background-color)` | Tab bar background color |
| `foreground_color` | string | `var(--primary-color)` | Tab bar icon/text and active indicator color |
| `tabs` | array | optional | Tab configuration per section |
| `tabs.section` | string | required | Must match the section title |
| `tabs.title` | string | optional | Tab title (default: section title) |
| `tabs.icon` | string | optional | MDI icon, e.g. `mdi:home` |

## Features

- Automatic section detection via DOM
- Responsive media queries
- Show-all mode with scroll spy
- Configurable tab bar height and position
- Tab order controlled via config
- Sidebar-aware positioning (adapts to collapsed sidebar)
- Minimal dependencies (Lit 3.0 only)

---

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/dingausmwald)
