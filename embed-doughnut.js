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
    5: "#1b5e20", // C1 - Very dark green (Top 0.01%)
    4: "#2e7d32", // C2 - Dark green (Top 0.1%)
    3: "#4caf50", // C3 - Medium green (Top 1%)
    2: "#8bc34a", // C4 - Light green (Top 10%)
    1: "#c8e6c9", // C5 - Very light green (Average)
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
      white-space: nowrap;
    }

    .popup-tooltip.show {
      display: block;
      opacity: 1;
    }

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
    <div><i class="fa-solid fa-fire"></i> Popularity: <strong style="color: #439d44;">${
        VALUE_LABELS[data?.pop_class]
      }</strong></div>  
      <div><i class="fa-solid fa-landmark"></i> Influence: <strong style="color: #439d44;">${
        VALUE_LABELS[data?.inf_class]
      }</strong></div>
      <div><i class="fa-solid fa-quote-left"></i> Citation Count (${data?.cc}): <strong style="color: #439d44;">${
        VALUE_LABELS[data?.cc_class]
      }</strong></div>
      <div><i class="fa-solid fa-rocket"></i> Impulse: <strong style="color: #439d44;">${
        VALUE_LABELS[data?.imp_class]
      }</strong></div>
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
          data: [           
            data?.inf_class,
            5 - data?.inf_class,
            data?.cc_class,
            5 - data?.cc_class,
            data?.imp_class,
            5 - data?.imp_class,
            data?.pop_class,
            5 - data?.pop_class,
          ],
          backgroundColor: [

            getColorForClass(data?.inf_class),
            "#e0e0e0",
            getColorForClass(data?.cc_class),
            "#e0e0e0",
            getColorForClass(data?.imp_class),
            "#e0e0e0",
            getColorForClass(data?.pop_class),
            "#e0e0e0",
          ],
          borderWidth: 2,
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
