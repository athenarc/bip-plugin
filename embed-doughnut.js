(async function () {
  function loadDependencies(callback) {
    if (window.Chart && window.ChartDataLabels) {
      callback();
      return;
    }

    const chartScript = document.createElement("script");
    chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    chartScript.onload = () => {
      const dataLabelScript = document.createElement("script");
      dataLabelScript.src =
        "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels";
      dataLabelScript.onload = () => {
        const fontAwesomeScript = document.createElement("script");
        fontAwesomeScript.src = "https://use.fontawesome.com/51e2e27171.js";
        fontAwesomeScript.onload = () => {
          // εδώ είμαστε σίγουροι ότι και τα δύο έχουν φορτώσει
          callback();
        };
        document.head.appendChild(fontAwesomeScript);
      };
      document.head.appendChild(dataLabelScript);
    };
    document.head.appendChild(chartScript);

    // Προσθήκη CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
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
    // Αν έχουμε ήδη προσθέσει τα styles, δεν τα ξαναπροσθέτουμε
    if (document.getElementById("doughnut-chart-styles")) return;

    const style = document.createElement("style");
    style.id = "doughnut-chart-styles";
    style.innerHTML = `
    .popup-tooltip {
    width: 260px;
      display: none;
      position: absolute;
      top: 70px;
      left: 74px;
      background: linear-gradient(145deg, #ffffff, #f7f9fc);
      transform: translateY(-50%);
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 999;
      min-width: 180px;
      color: #333;
      line-height: 1.6;
    }

     .popup-tooltip.show {
        display: block;
        opacity: 1;
      }
    .popup-tooltip i {
        color: #439d44;
        margin-right: 8px;
        font-size: 18px;
      }

    .popup-tooltip .close-btn {
      cursor: pointer;
      float: right;
      font-size: 18px;
      margin-left: 8px;
    }

    .popup-tooltip a {
        display: inline-block;
        margin-top: 12px;
        color: #439d44;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.2s;
      }

    .popup-tooltip a:hover {
        color: #2e7d32;
        text-decoration: underline;
      }

      .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        cursor: pointer;
        font-size: 18px;
        color: #aaa;
        transition: color 0.2s;
      }

      .close-btn:hover {
        color: #444;
      }
  `;
    document.head.appendChild(style);
  }

  function renderDoughnut(container, data) {
    injectDoughnutStyles(); // φροντίζουμε να μπει η CSS μία φορά

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
      <div class="close-btn">&times;</div>
      <div><i class="fa-solid fa-rocket"></i> Impulse: <strong>${
        VALUE_LABELS[data?.imp_class]
      }</strong></div>
      <div><i class="fa-solid fa-fire"></i> Popularity: <strong>${
        VALUE_LABELS[data?.pop_class]
      }</strong></div>
      <div><i class="fa-solid fa-comment"></i> Citations: <strong>${
        VALUE_LABELS[data?.cc_class]
      }</strong></div>
      <div><i class="fa-solid fa-landmark"></i> Influence: <strong>${
        VALUE_LABELS[data?.inf_class]
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

    const chartData = {
      labels: ["Impulse", "Influence", "Popularity", "Citations"],
      datasets: [
        {
          data: [
            data?.imp_class,
            5 - data?.imp_class,
            data?.inf_class,
            5 - data?.inf_class,
            data?.pop_class,
            5 - data?.pop_class,
            data?.cc_class,
            5 - data?.cc_class,
          ],
          backgroundColor: [
            "#439d44",
            "rgba(67, 157, 68, 0.1)",
            "#439d44",
            "rgba(67, 157, 68, 0.1)",
            "#439d44",
            "rgba(67, 157, 68, 0.1)",
            "#439d44",
            "rgba(67, 157, 68, 0.1)",
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
            formatter: (value, context) => {
              const icons = ["🚀", "🔥", "💬", "🏛️"];
              const i = Math.floor(context.dataIndex / 2);
              return context.dataIndex % 2 === 0 && i < icons.length
                ? icons[i]
                : "";
            },
            color: "#333",
            font: { size: 16 },
            anchor: "center",
            align: "center",
            textAlign: "center",
          },
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [ChartDataLabels],
    };

    new Chart(canvas, config);

    container.addEventListener("mouseenter", () =>
      chartTooltip.classList.add("show")
    );

    // Κλείσιμο tooltip όταν φεύγει ο δείκτης από το container
    container.addEventListener("mouseleave", () =>
      chartTooltip.classList.remove("show")
    );

    // Άνοιγμα link στο click
    chartTooltip.addEventListener("click", () =>
      window.open(
        `https://bip.imsi.athenarc.gr/site/details?id=${data.doi}`,
        "_blank"
      )
    );
  }

  async function initEmbeds() {
    const elements = document.querySelectorAll(".bip-doughnut-embed");
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
