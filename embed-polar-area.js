(async function () {
  function loadChartJs(callback) {
    if (window.Chart) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  const LABEL_MAPPING = {
    C1: 1, // 0.01%
    C2: 2, // 0.1%
    C3: 3, // 1%
    C4: 4, // 10%
    C5: 5, // 90%
  };

  const VALUE_LABELS = {
    1: "Top 0.01%",
    2: "Top 0.1%",
    3: "Top 1%",
    4: "Top 10%",
    5: "Top 90%",
  };

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

  function createTooltip(container, canvas, tooltipModel) {
    let tooltipEl = container.querySelector(".custom-tooltip");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "custom-tooltip";
      Object.assign(tooltipEl.style, {
        position: "absolute",
        pointerEvents: "none",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "6px 10px",
        borderRadius: "4px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        transform: "translate(-50%, -100%)",
        opacity: 0,
        transition: "opacity 0.15s ease",
        zIndex: 1000,
      });
      container.appendChild(tooltipEl);
    }

    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    const lines = tooltipModel.dataPoints
      .map((dp) => `${dp.label}: ${VALUE_LABELS[dp.raw] || dp.raw}`)
      .join("<br>");
    tooltipEl.innerHTML = lines;

    const rect = canvas.getBoundingClientRect();
    tooltipEl.style.left =
      rect.left + window.scrollX + tooltipModel.caretX + "px";
    tooltipEl.style.top =
      rect.top + window.scrollY + tooltipModel.caretY - 10 + "px";
    tooltipEl.style.opacity = 1;
  }

  function renderPolarArea(container, data) {
    if (!data) {
      container.innerHTML = "<span style='color:red'>No data</span>";
      return;
    }

    container.innerHTML = `<canvas id="chart-${data.doi.replace(
      /[^a-z0-9]/gi,
      "_"
    )}-polar" width="400" height="400"></canvas>`;
    container.style.width = "64px";
    container.style.height = "64px";
    container.style.display = "inline-block";
    container.style.position = "relative"; // απαραίτητο για το tooltip

    const canvas = container.querySelector(
      `#chart-${data.doi.replace(/[^a-z0-9]/gi, "_")}-polar`
    );
    const fontSize = Math.max(8, Math.round(canvas.width / canvas.width));

    new Chart(canvas, {
      type: "polarArea",
      data: {
        datasets: [
          {
            data: [
              data.imp_class,
              data.inf_class,
              data.pop_class,
              data.cc_class,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.4)",
              "rgba(75, 192, 192, 0.4)",
              "rgba(255, 205, 86, 0.4)",
              "rgba(54, 162, 235, 0.4)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 205, 86, 0.8)",
              "rgba(54, 162, 235, 0.8)",
            ],
          },
        ],
        labels: ["Impulse", "Influence", "Popularity", "Citations"],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          r: {
            ticks: {
              font: { size: 8 },
            },
          },
        },
        plugins: {
          datalabels: {
            color: "black",
            font: { size: fontSize, weight: "bold", family: "Arial" },
            formatter: (value) => VALUE_LABELS[value] || value,
          },
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: (context) =>
              createTooltip(container, canvas, context.tooltip),
          },
        },
        scales: {
          r: {
            min: 1,
            max: 5,
            ticks: {
              callback: (value) => VALUE_LABELS[value] || "",
              font: { size: fontSize },
            },
            afterBuildTicks: (scale) => {
              scale.ticks = Object.keys(VALUE_LABELS).map((v) => ({
                value: Number(v),
              }));
            },
          },
        },
      },
    });
  }

  async function initEmbeds() {
    const elements = document.querySelectorAll(".bip-polar-embed");
    for (let el of elements) {
      const doi = el.getAttribute("data-doi");
      if (!doi) continue;

      el.innerHTML = "<span style='color:gray'>Loading...</span>";
      const data = await fetchScore(doi);
      renderPolarArea(el, data);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      loadChartJs(initEmbeds)
    );
  } else {
    loadChartJs(initEmbeds);
  }
})();
