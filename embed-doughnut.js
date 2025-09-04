(async function () {
  function loadDependencies(callback) {
    if (window.Chart && window.ChartDataLabels) {
      callback();
      return;
    }

    const chartScript = document.createElement("script");
    // TODO: include only chart type that we need
    chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    chartScript.onload = () => {
      const dataLabelScript = document.createElement("script");
      dataLabelScript.src =
        "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels";
      dataLabelScript.onload = () => {
        callback();
      };
      document.head.appendChild(dataLabelScript);
    };
    document.head.appendChild(chartScript);

    // Προσθήκη CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    // TODO: include only icons that we need
    cssLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(cssLink);

    // Load Nunito font from Google Fonts
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);  
  }

  const LABEL_MAPPING = {
    C1: 5, // 0.01%
    C2: 4, // 0.1%
    C3: 3, // 1%
    C4: 2, // 10%
    C5: 1, // 90%
  };

  const VALUE_LABELS = {
    5: "Top 0.01%",
    4: "Top 0.1%",
    3: "Top 1%",
    2: "Top 10%",
    1: "Average",
  };

  const COLOR_MAPPING = {
    5: "#00441b", // C1 - Very dark green (Top 0.01%)
    4: "#1b7837", // C2 - Dark green (Top 0.1%)
    3: "#4daf4a", // C3 - Medium green (Top 1%)
    2: "#a6d96a", // C4 - Light green (Top 10%)
    1: "#808080", // C5 - Grey (Average)
  };

  function getColorForClass(className) {
    return COLOR_MAPPING[className] || "#81c784";
  }

  async function mapLabelsToData(label) {
    return LABEL_MAPPING[label] || null;
  }

  async function fetchScore(doi) {
    try {
      const encodedDoi = encodeURIComponent(doi);
      const response = await fetch(
        `https://bip-api.imsi.athenarc.gr/paper/scores/${encodedDoi}`
      );
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      return {
        ...data,
        imp_class: await mapLabelsToData(data.imp_class),
        inf_class: await mapLabelsToData(data.inf_class),
        pop_class: await mapLabelsToData(data.pop_class),
        cc_class: await mapLabelsToData(data.cc_class),
      };
    } catch (err) {
      console.error("Error fetching score:", err);
      return null;
    }
  }

  function injectDoughnutStyles() {
    // avoid multiple injections
    if (document.getElementById("doughnut-chart-styles")) return;

    const style = document.createElement("style");
    style.id = "doughnut-chart-styles";
    style.innerHTML = `
    .popup-tooltip {
      display: none;
      position: absolute;
      top: 37px;
      left: 74px;
      background: #f8f9fa;
      transform: translateY(-50%);
      border: 1px solid #ccc;
      padding: 13px;
      border-radius: 5px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 999;
      min-width: 180px;
      color: #333;
      line-height: 1.5;
      font-size: 14px;
      font-family: 'Nunito', sans-serif;
      white-space: nowrap;
    }

    .popup-tooltip.show {
      display: block;
      opacity: 1;
    }

    .popup-row { display: flex; justify-content: space-between; align-items: center; }
    .popup-val { display: inline-flex; align-items: center; gap: 14px; }
    .popup-val > strong { min-width: 90px; text-align: right; }
    .popup-val .score { color: #808080; font-size: 12px; min-width: 80px; text-align: right; }
    .popup-header { display:flex; justify-content: space-between; align-items:center; font-weight:600; margin-bottom:6px; }
    .popup-header .col-class { min-width: 90px; text-align: right; }
    .popup-header .col-score { min-width: 80px; text-align: right; }


    .popup-tooltip i {
      color: #808080;
      margin-right: 8px;
      font-size: 16px;
    }

    .popup-tooltip a {
      display: inline-block;
      margin-top: 12px;
      color: #808080;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .popup-tooltip a:hover {
      color: #2e7d32;
      text-decoration: underline;
    }
  `;
    document.head.appendChild(style);
  }

  function renderDoughnut(container, data) {
    injectDoughnutStyles(); // inject styles only once
    
    if (!data) {
      container.innerHTML = "<span style='color:red'>No data</span>";
      return;
    }
    container.style.position = "relative";
    container.style.display = "inline-block";
    container.style.cursor = "pointer";
    container.style.margin = "10px";
    container.innerHTML = `<div class="chart-container" style="position: relative; margin: auto;">
    <canvas id="chart-${data.doi.replace(
      /[^a-z0-9]/gi,
      "_"
    )}-doughnut" width="400" height="400"></canvas>
    <div class="popup-tooltip" id="chartTooltip-${data.doi.replace(
      /[^a-z0-9]/gi,
      "_"
    )}">
    <div class="popup-header">
      <span>Indicator</span>
      <span class="popup-val"><span class="col-class">Class</span><span class="col-score">Score</span></span>
    </div>
    <div class="popup-row"><span><i class="fa-solid fa-fire"></i> Popularity</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.pop_class)};">${VALUE_LABELS[data?.pop_class]}</strong>
    <span class="score">${data?.attrank ? data.attrank : ''}</span>
  </span>
</div>
<div class="popup-row"><span><i class="fa-solid fa-landmark"></i> Influence</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.inf_class)};">${VALUE_LABELS[data?.inf_class]}</strong>
    <span class="score">${data?.pagerank ? data.pagerank : ''}</span>
  </span>
</div>
<div class="popup-row"><span><i class="fa-solid fa-quote-left"></i> Citation Count</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.cc_class)};">${VALUE_LABELS[data?.cc_class]}</strong>
    <span class="score">${data?.cc ? data.cc : ''}</span>
  </span>
</div>
<div class="popup-row"><span><i class="fa-solid fa-rocket"></i> Impulse</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.imp_class)};">${VALUE_LABELS[data?.imp_class]}</strong>
    <span class="score">${data?.['3_year_cc'] ?? ''}</span>
  </span>
</div>
    </div>
  </div>`;
    container.style.width = "64px";
    container.style.height = "64px";

    const canvas = container.querySelector(
      `#chart-${data.doi.replace(/[^a-z0-9]/gi, "_")}-doughnut`
    );
    const chartTooltip = container.querySelector(
      `#chartTooltip-${data.doi.replace(/[^a-z0-9]/gi, "_")}`
    );
    console.log(data);
    const chartData = {
            labels: ["Popularity", "Influence", "Citation", "Impulse"],
      datasets: [
        {
          data: (() => {
            const out = [];
            const pushQuad = (cls) => {
              if (cls === 1) {
                out.push(0, 5, 0.1);
              } else {
                out.push(cls, 5 - cls, 0.1);
              }
            };
            // Order: Influence, Citation, Impulse, Popularity (matching existing rendering order)
            pushQuad(data?.inf_class);
            pushQuad(data?.cc_class);
            pushQuad(data?.imp_class);
            pushQuad(data?.pop_class);
            return out;
          })(),
          backgroundColor: (() => {
            const out = [];
            const pushColors = (cls) => {
              out.push(getColorForClass(cls), "#e0e0e0", "transparent");
            };
            pushColors(data?.inf_class);
            pushColors(data?.cc_class);
            pushColors(data?.imp_class);
            pushColors(data?.pop_class);
            return out;
          })(),
          borderWidth: 0,
          borderColor: "#fff",
          cutout: "55%",
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: chartData,
      options: {
        plugins: {
          datalabels: {
            display: false, // don't show labels on slices
          },
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [
        ChartDataLabels,
        {
          id: "centerIcons",
          afterDraw: (chart) => {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            // calculate radius inside cutout
            const dataset = chart.data.datasets[0];
            const cutout = dataset.cutout
              ? parseFloat(dataset.cutout) / 100
              : 0.55;
            const radius =
              ((Math.min(chartArea.width, chartArea.height) / 2) *
                (1 + cutout)) /
              2 /
              2.5;

            const icons = ["\uf19c", "\uf10d", "\uf135", "\uf06d"];
            ctx.save();
            ctx.font = "10px FontAwesome";
            ctx.fillStyle = "#808080";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (let i = 0; i < 4; i++) {
              let angle = -Math.PI / 2 + i * (Math.PI / 2); // quadrants starting from top left
              angle += Math.PI / 4; // move to middle of the visualisation
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              ctx.fillText(icons[i], x, y);
            }

            ctx.restore();
          },
        },
      ],
    };

    new Chart(canvas, config);

    container.addEventListener("mouseenter", () =>
      chartTooltip.classList.add("show")
    );

    // close tooltip when mouse leaves the container
    container.addEventListener("mouseleave", () =>
      chartTooltip.classList.remove("show")
    );

    // open link on click
    canvas.addEventListener("click", () =>
      window.open(
        `https://bip.imsi.athenarc.gr/site/details?id=${data.doi}`,
        "_blank"
      )
    );
  }

  async function initEmbeds() {
    const elements = document.querySelectorAll(".bip-embed");
    for (let el of elements) {
      const doi = el.getAttribute("data-doi");
      if (!doi) continue;

      el.innerHTML = "<span style='color:gray'>Loading...</span>";
      const data = await fetchScore(doi);
      renderDoughnut(el, data);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      loadDependencies(initEmbeds)
    );
  } else {
    loadDependencies(initEmbeds);
  }
})();
