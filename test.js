(async function () {
  const elements = document.querySelectorAll(".bip-embed");

  async function fetchScore(doi) {
    try {
      const encodedDoi = encodeURIComponent(doi);
      const url = `https://bip-api.imsi.athenarc.gr/paper/scores/${encodedDoi}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API request failed");
      return await response.json();
    } catch (err) {
      console.error("Error fetching score:", err);
      return null;
    }
  }

  function renderBadge(container, data) {
    if (!data) {
      container.innerHTML = "<span style='color:red'>No data</span>";
      return;
    }
    container.innerHTML = `<span style='color:green'>Score: ${data.score}</span>`;
  }

  console.log(document?.readyState);
  for (let el of elements) {
    const doi = el.getAttribute("data-doi");
    if (!doi) continue;

    el.innerHTML = "<span style='color:gray;font-size:12px'>Loading...</span>";
    const data = await fetchScore(doi);
    console.log(data);
    renderBadge(el, data);
  }
})();
