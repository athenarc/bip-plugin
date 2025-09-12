# BIP Doughnut Chart Embed Script

This JavaScript file provides functionality to dynamically embed **doughnut charts** into web pages for visualizing bibliometric indicators of scientific papers. The indicators are provided by the **[BIP](https://bip.imsi.athenarc.gr/search)** platform. 
The charts are powered by **Chart.js** and **chartjs-plugin-datalabels**, styled with **Font Awesome** icons and **Nunito** font.

---

## Features

- **Interactive doughnut charts** for [bibliometric indicators](https://bip.imsi.athenarc.gr/site/indicators):
  - Popularity
  - Influence
  - Citation Count
  - Impulse
- **Color-coded classifications** (Top 0.01%, Top 0.1%, Top 1%, Top 10%, Average)
- **Font Awesome icons** drawn inside the chart quadrants
- **Popup tooltips** with indicator details and raw scores
- **Clickable charts** redirecting to the BIP details page for the given DOI
- **Automatic dependency loading**:
  - Chart.js
  - chartjs-plugin-datalabels
  - Font Awesome CSS
  - Google Fonts (Nunito)

---

## Installation & Usage

1. **Include the script** in your web page (self-executing function, no external build required).
   ```html
   <script src="path/to/your/embed-doughnjut.js"></script>
   ```

2. **Add HTML elements** with the `bip-embed` class and a `data-doi` attribute containing the DOI of the paper:
   ```html
   <div class="bip-embed" data-doi="10.1234/example.doi"></div>
   <div class="bip-embed" data-doi="10.5678/another.doi"></div>
   ```

3. On page load:
   - Dependencies (Chart.js, plugin, fonts) are automatically loaded.
   - Each element with `.bip-embed` is replaced with a doughnut chart for the given DOI.

---

## API Endpoints

The script fetches scores from the **BIP API**:

```
GET https://bip-api.imsi.athenarc.gr/paper/scores/{encoded_doi}
```

### Example Response
```json
{
	"doi": "10.1093/nar/gkx1141",
	"attrank": 6.6810213e-7,
	"pagerank": 3.009036e-8,
	"3_year_cc": 231,
	"cc": 868,
	"pop_class": "C2",
	"inf_class": "C3",
	"imp_class": "C2",
	"cc_class": "C2"
}
```

The script maps classification codes (`C1–C5`) into numeric classes (1–5) and applies colors and labels.

---

## Mappings

### Label Mapping
| Code | Numeric | Label       |
|------|---------|-------------|
| C1   | 5       | Top 0.01%   |
| C2   | 4       | Top 0.1%    |
| C3   | 3       | Top 1%      |
| C4   | 2       | Top 10%     |
| C5   | 1       | Average     |

### Color Mapping
| Class | Color     | Description   |
|-------|-----------|---------------|
| 5     | `#00441b` | Very dark green |
| 4     | `#1b7837` | Dark green    |
| 3     | `#4daf4a` | Medium green  |
| 2     | `#a6d96a` | Light green   |
| 1     | `#808080` | Grey (Average) |

---

## Tooltip Layout

Each chart includes a **popup tooltip** showing:

- Indicator name with icon
- Classification label (colored)
- Raw score (when available)

Example:
```
Popularity   | Top 0.01% | 42
Influence    | Top 1%    | 0.0021
Citations    | Top 10%   | 178
Impulse      | Top 0.1%  | 12
```

---

## Events

- **Hover (mouseenter/leave):** Shows/hides tooltip
- **Click:** Opens BIP details page for the DOI:

  ```
  https://bip.imsi.athenarc.gr/site/details?id={doi}
  ```

---

## Customization

- **Chart styles:** Defined in `injectDoughnutStyles()`
- **Color mapping & labels:** Controlled via `LABEL_MAPPING`, `VALUE_LABELS`, and `COLOR_MAPPING`
- **Icons:** Font Awesome icons drawn in quadrants (configurable in the `centerIcons` plugin)

---

## Dependencies

Automatically loaded at runtime:

- [Chart.js](https://www.chartjs.org/)
- [chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/)
- [Font Awesome 6](https://fontawesome.com/)
- [Google Fonts - Nunito](https://fonts.google.com/specimen/Nunito)

---