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

    // Load Nunito font from Google Fonts
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }

  
  const FA_SVGS = {
    "file-lines": { vb: "0 0 384 512", d: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" },
    "database": { vb: "0 0 448 512", d: "M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" },
    "code": { vb: "0 0 640 512", d: "M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" },
    "box-archive": { vb: "0 0 512 512", d: "M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z" },
    "quote-left": { vb: "0 0 448 512", d: "M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" },
    "fire": { vb: "0 0 448 512", d: "M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" },
    "landmark": { vb: "0 0 512 512", d: "M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z" },
    "hourglass": { vb: "0 0 384 512", d: "M0 32C0 14.3 14.3 0 32 0H64 320h32c17.7 0 32 14.3 32 32s-14.3 32-32 32V75c0 42.4-16.9 83.1-46.9 113.1L237.3 256l67.9 67.9c30 30 46.9 70.7 46.9 113.1v11c17.7 0 32 14.3 32 32s-14.3 32-32 32H320 64 32c-17.7 0-32-14.3-32-32s14.3-32 32-32V437c0-42.4 16.9-83.1 46.9-113.1L146.7 256 78.9 188.1C48.9 158.1 32 117.4 32 75V64C14.3 64 0 49.7 0 32zM96 64V75c0 25.5 10.1 49.9 28.1 67.9L192 210.7l67.9-67.9c18-18 28.1-42.4 28.1-67.9V64H96zm0 384H288V437c0-25.5-10.1-49.9-28.1-67.9L192 301.3l-67.9 67.9c-18 18-28.1 42.4-28.1 67.9v11z" },
    "lock-open": { vb: "0 0 576 512", d: "M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z" },
    "circle-info": { vb: "0 0 512 512", d: "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" },
    "rocket": { vb: "0 0 512 512", d: "M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" },
    "chart-line": { vb: "0 0 512 512", d: "M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" },
  };
  function getFaSvg(iconName, cls) {
    const icon = FA_SVGS[iconName];
    if(!icon) return "";
    return `<svg class="${cls || ''}" viewBox="${icon.vb}" xmlns="http://www.w3.org/2000/svg" style="fill:currentColor; height:1em; vertical-align:-0.125em;"><path d="${icon.d}"/></svg>`;
  }
  const CACHED_FA_IMGS = {};
  function getFaImg(iconName) {
    if (CACHED_FA_IMGS[iconName]) return CACHED_FA_IMGS[iconName];
    const icon = FA_SVGS[iconName];
    if(!icon) return null;
    const svgStr = `<svg viewBox="${icon.vb}" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff;"><path d="${icon.d}"/></svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    CACHED_FA_IMGS[iconName] = img;
    return img;
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

  // Shared BIP! logo SVG — used both in the doughnut centre and the scholar badge.
  // Pre-loaded as an Image so canvas drawImage works synchronously on first render.
  const BIP_LOGO_SVG = '<svg viewBox="0 0 183 131" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1,0,0,1,-179.059,-154.146)"><g transform="matrix(1,0,0,1,-66.0596,-9.93667)"><path d="M351.285,247.602L356.273,267.276L341.707,270.97L335.782,247.602L334.591,247.602L334.591,294.847L381.836,294.847L381.836,247.602L367.924,247.602L371.256,262.683L361.698,264.796L357.898,247.602L351.285,247.602Z"/></g><g transform="matrix(0.168673,0.743215,-0.975201,0.221322,434.556,-84.0818)"><path d="M361.217,200.43C363.531,197.393 364.749,193.947 364.749,190.44C364.749,179.413 352.937,170.46 338.387,170.46C323.837,170.46 312.024,179.413 312.024,190.44C312.024,193.947 313.242,197.393 315.556,200.43L361.217,200.43Z"/></g><path d="M219.18,203.472L273.775,156.094L299.812,272.142L256.693,260.054L256.757,259.976C258.312,258.018 259.397,255.53 260.013,252.51C260.628,249.491 260.529,246.424 259.714,243.31C258.702,239.44 256.744,236.367 253.839,234.09C250.934,231.814 247.317,230.612 242.988,230.484C245.699,228.128 247.497,225.493 248.383,222.581C249.268,219.668 249.339,216.791 248.596,213.949C247.798,210.895 246.164,208.198 243.694,205.856C241.224,203.514 238.279,202.071 234.858,201.528C231.438,200.985 227.188,201.378 222.109,202.706L219.18,203.472ZM278.36,259.026L260.974,192.543L269.772,190.242L287.158,256.725L278.36,259.026ZM216.943,248.911L247.089,257.362C247.556,256.996 247.98,256.613 248.359,256.212C249.498,255.01 250.295,253.485 250.749,251.638C251.202,249.792 251.153,247.81 250.599,245.694C249.951,243.215 248.753,241.227 247.004,239.729C245.256,238.232 243.159,237.408 240.713,237.256C238.267,237.105 234.928,237.582 230.695,238.689L215.321,242.709L216.943,248.911ZM200.011,220.108L206.8,246.067L179.059,238.29L200.011,220.108ZM213.27,234.864L227.646,231.104C231.546,230.085 234.275,229.096 235.834,228.14C237.897,226.889 239.294,225.345 240.025,223.507C240.755,221.668 240.816,219.585 240.207,217.257C239.63,215.05 238.593,213.246 237.096,211.845C235.599,210.444 233.787,209.69 231.66,209.584C229.532,209.478 226.08,210.05 221.304,211.299L208.016,214.774L213.27,234.864Z" style="fill:rgb(68,157,68);"/><g transform="matrix(-0.427227,-0.904145,0.553379,-0.261483,417.632,570.854)"><path d="M382.711,181.446L365.824,181.446L370.045,131.407L378.489,131.407L382.711,181.446Z" style="fill:rgb(191,191,191);"/></g><g transform="matrix(-0.813991,-0.580877,0.382756,-0.536361,573.704,473.775)"><path d="M382.711,181.446L365.824,181.446L370.045,131.407L378.489,131.407L382.711,181.446Z" style="fill:rgb(191,191,191);"/></g><g transform="matrix(-0.162117,0.986772,0.520937,0.0855849,325.195,-166.277)"><path d="M382.711,181.446L365.824,181.446L370.045,131.407L378.489,131.407L382.711,181.446Z" style="fill:rgb(191,191,191);"/></g></g></svg>';
  const bipLogoImg = (() => {
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(BIP_LOGO_SVG);
    return img;
  })();

  function mapLabelsToData(label) {
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
        imp_class: mapLabelsToData(data.imp_class),
        inf_class: mapLabelsToData(data.inf_class),
        pop_class: mapLabelsToData(data.pop_class),
        cc_class: mapLabelsToData(data.cc_class),
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
    .popup-tooltip *{
      font-family: 'Nunito', sans-serif !important;
    } 
    
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
    .popup-header { display:flex; justify-content: space-between; align-items:center; font-weight:600; margin-bottom:6px; color: #808080; }
    .popup-header .col-class { min-width: 90px; text-align: right; }
    .popup-header .col-score { min-width: 80px; text-align: right; }
    .popup-row > span:first-child { color: #808080; }


    .popup-tooltip svg {
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
      container.innerHTML = "";
      container.style = "";
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
    <div class="popup-row"><span>${getFaSvg("fire")} Popularity</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.pop_class)};">${
      VALUE_LABELS[data?.pop_class]
    }</strong>
    <span class="score">${data?.attrank ? data.attrank : ""}</span>
  </span>
</div>
<div class="popup-row"><span>${getFaSvg("landmark")} Influence</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.inf_class)};">${
      VALUE_LABELS[data?.inf_class]
    }</strong>
    <span class="score">${data?.pagerank ? data.pagerank : ""}</span>
  </span>
</div>
<div class="popup-row"><span>${getFaSvg("quote-left")} Citation Count</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.cc_class)};">${
      VALUE_LABELS[data?.cc_class]
    }</strong>
    <span class="score">${data?.cc ? data.cc : ""}</span>
  </span>
</div>
<div class="popup-row"><span>${getFaSvg("rocket")} Impulse</span>
  <span class="popup-val">
    <strong style="color: ${getColorForClass(data?.imp_class)};">${
      VALUE_LABELS[data?.imp_class]
    }</strong>
    <span class="score">${data?.["3_year_cc"] ?? ""}</span>
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
            const chartRadius = Math.min(chartArea.width, chartArea.height) / 2;

            const dataset = chart.data.datasets[0];
            const cutoutPct = dataset.cutout ? parseFloat(dataset.cutout) / 100 : 0.55;

            // Place icons at the midpoint of the donut ring
            const ringMidRadius = chartRadius * (1 + cutoutPct) / 2;
            const icons = ["landmark", "quote-left", "rocket", "fire"];

            ctx.save();
            

            for (let i = 0; i < 4; i++) {
              const angle = -Math.PI / 2 + i * (Math.PI / 2) + Math.PI / 4;
              const x = centerX + ringMidRadius * Math.cos(angle);
              const y = centerY + ringMidRadius * Math.sin(angle);
              
              const img = getFaImg(icons[i]);
              if (img) {
                if (img.complete && img.naturalHeight !== 0) {
                  const size = 10;
                  ctx.drawImage(img, x - size/2, y - size/2, size, size);
                } else {
                  img.onload = () => chart.update("none");
                }
              }

            }

            // Draw BIP! logo in the centre hole
            const innerRadius = chartRadius * cutoutPct;
            const logoH = innerRadius * 1.05;
            const logoW = logoH * (183 / 131); // preserve aspect ratio of viewBox
            if (bipLogoImg.complete && bipLogoImg.naturalHeight !== 0) {
              ctx.drawImage(
                bipLogoImg,
                centerX - logoW / 2,
                centerY - logoH / 2,
                logoW,
                logoH
              );
            } else {
              bipLogoImg.onload = () => chart.update("none");
            }

            ctx.restore();
          },
        },
      ],
    };

    new Chart(canvas, config);

    const paperUrl = `https://bip.imsi.athenarc.gr/site/details?id=${data.doi}`;
    container.setAttribute("role", "link");
    container.setAttribute("tabindex", "0");
    container.setAttribute("aria-label", "BIP! paper metrics");

    container.addEventListener("mouseenter", () =>
      chartTooltip.classList.add("show")
    );

    // close tooltip when mouse leaves the container
    container.addEventListener("mouseleave", () =>
      chartTooltip.classList.remove("show")
    );

    // Show the same tooltip for keyboard users
    container.addEventListener("focus", () =>
      chartTooltip.classList.add("show")
    );
    container.addEventListener("blur", () =>
      chartTooltip.classList.remove("show")
    );

    const openPaperProfile = () =>
      window.open(paperUrl, "_blank", "noopener");

    container.addEventListener("click", openPaperProfile);
    container.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        // Prevent Space from also scrolling the page.
        e.preventDefault();
        openPaperProfile();
      }
    });
  }

  function renderLoadingSpinner(container) {
    container.innerHTML = `
      <span class="loader"></span>
      <style>
        .loader {
            width: 48px;
            height: 48px;
            border: 3px dotted #00441b;
            border-style: solid solid dotted dotted;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            animation: rotation 2s linear infinite;
          }
          .loader::after {
            content: '';  
            box-sizing: border-box;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            border: 3px dotted #1b7837;
            border-style: solid solid dotted;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            animation: rotationBack 1s linear infinite;
            transform-origin: center center;
          }
              
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          } 
          @keyframes rotationBack {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            }
          } 
      </style>
    `;
    container.style.display = "inline-block";
    container.style.width = "64px";
    container.style.height = "64px";
    container.style.margin = "10px";
  }

  async function initEmbeds() {
    const elements = document.querySelectorAll(".bip-embed");
    for (let el of elements) {
      const doi = el.getAttribute("data-doi");
      if (!doi) continue;

      renderLoadingSpinner(el);
      const data = await fetchScore(doi);
      renderDoughnut(el, data);
    }
  }

  // ─── RESEARCHER / SCHOLAR EMBED ──────────────────────────────────────────────
  // All code below is purely additive. Nothing above this line is modified.
  // Trigger: <div class="bip-scholar-embed" data-orcid="0000-0002-1234-5678"></div>
  // ─────────────────────────────────────────────────────────────────────────────

  async function fetchScholarScore(orcid) {
    try {
      const encodedOrcid = encodeURIComponent(orcid);
      const response = await fetch(
        `https://bip-api.imsi.athenarc.gr/scholar/scores/${encodedOrcid}`
      );
      if (!response.ok) throw new Error("API request failed");
      return await response.json();
    } catch (err) {
      console.error("Error fetching scholar score:", err);
      return null;
    }
  }

  function formatNumber(n) {
    if (n == null) return "—";
    return Number(n).toLocaleString();
  }

  function injectScholarStyles() {
    if (document.getElementById("bip-scholar-styles")) return;
    const style = document.createElement("style");
    style.id = "bip-scholar-styles";
    style.innerHTML = `
      .bip-scholar-badge * {
        font-family: 'Nunito', sans-serif !important;
        box-sizing: border-box;
      }
      .bip-scholar-badge {
        display: inline-flex;
        align-items: center;
        gap: 0;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 8px 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        font-family: 'Nunito', sans-serif;
        position: relative;
        transition: box-shadow 0.2s;
        text-decoration: none;
      }
      .bip-scholar-badge:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.14);
      }
      .bip-scholar-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10px;
        min-width: 54px;
      }
      .bip-scholar-stat + .bip-scholar-stat {
        border-left: 1px solid #e8e8e8;
      }
      .bip-scholar-stat--group-sep {
        border-left: 2px solid #c8c8c8 !important;
        margin-left: 2px;
      }
      .bip-scholar-stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #1a1a1a;
        line-height: 1.2;
        white-space: nowrap;
      }
      .bip-scholar-stat-label {
        font-size: 10px;
        font-weight: 600;
        color: #9e9e9e;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-top: 2px;
        white-space: nowrap;
      }
      .bip-scholar-stat-icon {
        font-size: 11px;
        margin-right: 3px;
        color: #757575;
      }
      .bip-scholar-badge--compact .bip-scholar-stat {
        min-width: auto;
        padding: 0 8px;
      }
      .bip-scholar-badge--compact .bip-scholar-stat-value {
        font-size: 14px;
      }
      .bip-scholar-badge--compact .bip-scholar-stat-icon {
        font-size: 12px;
        margin-right: 5px;
      }
      .bip-scholar-logo {
        display: flex;
        align-items: center;
        padding-right: 12px;
        margin-right: 2px;
        border-right: 1px solid #e8e8e8;
      }
      .bip-scholar-logo svg {
        height: 30px;
        width: auto;
        display: block;
      }
      .bip-scholar-no-profile {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #fafafa;
        border: 1px dashed #d0d0d0;
        border-radius: 10px;
        padding: 7px 14px;
        font-family: 'Nunito', sans-serif;
        font-size: 12px;
        color: #aaa;
      }
      .bip-scholar-no-profile i {
        color: #ccc;
        font-size: 13px;
      }
      .bip-scholar-no-profile a {
        color: #2e7d32;
        font-weight: 600;
        text-decoration: none;
        opacity: 0.8;
      }
      .bip-scholar-no-profile a:hover {
        text-decoration: underline;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function renderScholarBadge(container, data, orcid) {
  const layout = container.getAttribute("data-layout") || "default";
  const isCompact = layout === "compact";
    injectScholarStyles();

    // Reset stale styles left by the loading spinner
    container.style.width = "";
    container.style.height = "";
    container.style.margin = "6px 0";
    container.style.display = "block";

    if (!data) {
      const emptyMode = container.getAttribute("data-empty-mode") || "default";
      if (emptyMode === "silent") {
        container.innerHTML = "";
        container.style.display = "none";
        return;
      }
      container.innerHTML = `
        <div class="bip-scholar-no-profile">
          ${getFaSvg("circle-info")}
          No BIP! Scholar profile found for this ORCID.
          <a href="https://bip.imsi.athenarc.gr" target="_blank" rel="noopener">Learn more ↗</a>
        </div>
      `;
      return;
    }

    const pct = data.openness?.open_percentage != null
      ? Math.round(Number(data.openness.open_percentage)) + "%"
      : "—";
    const age = data.academic_age != null
      ? Number(data.academic_age) + " yrs"
      : "—";

    const profileUrl = `https://bip.imsi.athenarc.gr/scholar/profile/${encodeURIComponent(orcid)}`;

    // work_types_num may be an array [publications, datasets, software, other]
    // or an object {publication: N, dataset: N, software: N, other: N}
    let wt = [null, null, null, null];
    if (Array.isArray(data.work_types_num)) {
      wt = data.work_types_num;
    } else if (data.work_types_num && typeof data.work_types_num === "object") {
      wt = [
        data.work_types_num.papers      ?? null,
        data.work_types_num.dataset     ?? data.work_types_num.datasets  ?? null,
        data.work_types_num.software    ?? null,
        data.work_types_num.other       ?? null,
      ];
    }

    const stats = [
      { icon: "file-lines",  value: formatNumber(wt[0] ?? null), label: "Publications", groupSep: false },
      { icon: "database",    value: formatNumber(wt[1] ?? null), label: "Datasets",     groupSep: false },
      { icon: "code",        value: formatNumber(wt[2] ?? null), label: "Software",     groupSep: false },
      { icon: "box-archive", value: formatNumber(wt[3] ?? null), label: "Other",        groupSep: false },
      { icon: "quote-left",  value: formatNumber(data.citations_num),           label: "Citations",   groupSep: true  },
      { icon: "fire",        value: formatNumber(data.popular_works_count),     label: "Popular",     groupSep: false },
      { icon: "landmark",    value: formatNumber(data.influential_works_count), label: "Influential", groupSep: false },
      { icon: "chart-line",     value: data.h_index != null ? formatNumber(data.h_index) : "—", label: "h-index", groupSep: false },
      { icon: "hourglass",   value: age,                                        label: "Acad. Age",   groupSep: true },
      { icon: "lock-open",   value: pct,                                        label: "Open Access", groupSep: true },
    ];

    const statsHtml = stats.map(s => `
      <div class="bip-scholar-stat${s.groupSep ? " bip-scholar-stat--group-sep" : ""}" title="${s.label}">
        <span class="bip-scholar-stat-value">
          ${getFaSvg(s.icon, "bip-scholar-stat-icon")}${s.value}
        </span>
        ${isCompact ? '' : `<span class="bip-scholar-stat-label">${s.label}</span>`}
      </div>
    `).join("");

    container.innerHTML = `
      <div class="bip-scholar-badge${isCompact ? " bip-scholar-badge--compact" : ""}" role="link" tabindex="0" aria-label="BIP! researcher metrics">
        <div class="bip-scholar-logo">
          ${BIP_LOGO_SVG}
        </div>
        ${statsHtml}
      </div>
    `;

    container.querySelector(".bip-scholar-badge").addEventListener("click", () => {
      window.open(profileUrl, "_blank", "noopener");
    });
    container.querySelector(".bip-scholar-badge").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        // Prevent Space from also scrolling the page.
        e.preventDefault();
        window.open(profileUrl, "_blank", "noopener");
      }
    });
  }

  async function initScholarEmbeds() {
    const elements = document.querySelectorAll(".bip-scholar-embed");
    for (let el of elements) {
      const orcid = el.getAttribute("data-orcid");
      if (!orcid) continue;

      renderLoadingSpinner(el);
      const data = await fetchScholarScore(orcid);
      renderScholarBadge(el, data, orcid);
    }
  }

  // ─── ENTRY POINT ─────────────────────────────────────────────────────────────
  // Runs both paper and scholar embeds. Each is independent and safe to use alone.

  async function initAllEmbeds() {
    await Promise.all([
      initEmbeds(),
      initScholarEmbeds(),
    ]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      loadDependencies(initAllEmbeds)
    );
  } else {
    loadDependencies(initAllEmbeds);
  }
})();
