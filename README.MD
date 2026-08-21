# BIP! Badges - Interactive Bibliometric Visualization

A lightweight JavaScript library for embedding charts that visualize bibliometric indicators of scientific papers and researchers. These charts are powered by the **[BIP! Services platform](https://bip.imsi.athenarc.gr)**.

## 📦 Installation

### Quick Start

1. **Include** the [embed.js](https://cdn.jsdelivr.net/gh/athenarc/bip-plugin@main/embed.js) or preferably the minified version [embed.min.js](https://cdn.jsdelivr.net/gh/athenarc/bip-plugin@main/embed.min.js) in your HTML page:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/athenarc/bip-plugin@main/embed.min.js"></script>
   ```
2. **Add** elements with the `bip-embed` class:
   ```html
   <div class="bip-embed" data-doi="10.1093/nar/gkx1141"></div>
   <div class="bip-embed" data-doi="10.1038/nature12373"></div>
   ```

### Multiple Charts
You can embed multiple paper charts and/or researcher badges on the same page — each will automatically fetch and display data for its respective identifier.

## 🎯 Usage Examples

### Basic Implementation
```html
<!DOCTYPE html>
<html>
<head>
    <title>Research Impact Visualization</title>
    <script src="https://cdn.jsdelivr.net/gh/athenarc/bip-plugin@main/embed.min.js"></script>
</head>
<body>
    <h1>Paper Impact Metrics</h1>
    
    <!-- Single chart -->
    <div class="bip-embed" data-doi="10.1093/nar/gkx1141"></div>
    
    <!-- Multiple charts -->
    <div class="bip-embed" data-doi="10.1038/nature12373"></div>
    <div class="bip-embed" data-doi="10.1126/science.1234567"></div>
    
</body>
</html>
```

## 🔬 Researcher / Scholar Embed

To display bibliometric indicators for a **researcher**, use the `bip-scholar-embed` class with a `data-orcid` attribute:

```html
<div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678"></div>
```

This renders a **stats badge** that shows several indicators pulled from the BIP! API via the researcher's [ORCID](https://orcid.org) identifier:

| Metric | Description |
|--------|-------------|
| **Publications** | Total number of published papers |
| **Datasets** | Total number of dataset records |
| **Software** | Total number of software records |
| **Other** | Total number of ther research outputs |
| **Citations** | Total citation count across works |
| **Popular** | Number of works classified as *Popular* (Top 10% or better) |
| **Influential** | Number of works classified as *Influential* (Top 10% or better) |
| **h-index** | The researcher's h-index score |
| **Acad. Age** | Academic age (years since first publication) |
| **Open Access** | Percentage of works available as Open Access |

Clicking on the badge redirects to the researcher's full BIP! Scholar profile in a new tab.

### Compact Layout
If space is limited, you can display a **compact version** of the badge which hides the text labels and relies only on the indicator icons. Simply add `data-layout="compact"` to the element:

```html
<div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678" data-layout="compact"></div>
```

### Handling Missing Profiles

By default, if no public BIP! Scholar profile is found for a given ORCID, the widget will display a fallback message ("No BIP! profile found for this ORCID"). 

If you prefer the widget to completely hide itself when no profile is found (silent mode), you can add the `data-empty-mode="silent"` attribute:

```html
<div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678" data-empty-mode="silent"></div>
```

### Mixed usage

Both embed types can be freely mixed on the same page — each operates independently:

```html
<!-- Paper-level doughnut chart -->
<div class="bip-embed" data-doi="10.1093/nar/gkx1141"></div>

<!-- Researcher stats badge -->
<div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678"></div>

<!-- Compact researcher stats badge -->
<div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678" data-layout="compact"></div>
```

---

## 📊 Performance Classifications *(paper-level)*

The BIP! Services platform offers a range of citation-based impact indicators; a detailed description of the indicators is available [here](https://bip.imsi.athenarc.gr/site/indicators).

For each indicator, the platform classifies research works into five performance tiers:

| Class | Label | Color | Description | Percentage |
|-------|-------|-------|-------------|------------|
| **C1** | Top 0.01% | `#00441b` | Exceptional impact | Top 0.01% of research works |
| **C2** | Top 0.1% | `#1b7837` | Very high impact | Top 0.1% of research works |
| **C3** | Top 1% | `#4daf4a` | High impact | Top 1% of research works |
| **C4** | Top 10% | `#a6d96a` | Above average | Top 10% of research works |
| **C5** | Average | `#808080` | Average impact | Remaining 90% |

### Visual Representation
- **C1-C4**: Filled segments with green gradient (darker = higher impact)
- **C5**: Unfilled arc with grey text (represents average performance)


## 🔍 Troubleshooting

### Common Issues

**Chart not displaying:**
- Check that the DOI or ORCID is valid and accessible
- Verify internet connection (API calls required)
- Check browser console for JavaScript errors

**Styling issues:**
- Ensure no CSS conflicts with existing styles
- Check that Google Fonts (Nunito) is loading properly

**API errors:**
- Verify the DOI/ORCID exists in the BIP database
- Check API endpoint availability
- Some DOIs may not have complete data

### Debug Mode
Enable console logging by opening browser developer tools to see detailed information about data fetching and chart rendering.

## 📄 License

This project is open source. Please check the BIP! platform [terms of use](https://bip.imsi.athenarc.gr/site/data#api) for further guidelines.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For technical support or questions about the BIP platform:
- **BIP! Services Support**: [bip@athenarc.gr](mailto:bip@athenarc.gr)
- **BIP! Services Website**: [https://bip.imsi.athenarc.gr](https://bip.imsi.athenarc.gr)
