// assets/js/market-charts.js
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;

  function initCard(card) {
    if (card.dataset.chartInitialized) return;
    var canvas = card.querySelector("canvas.market-chart");
    var history = JSON.parse(card.dataset.history || "[]");
    if (!canvas || !history.length) return;

    var labels = history.map(function (point) { return point.date; });
    var values = history.map(function (point) { return point.value; });
    var rising = values[values.length - 1] >= values[0];
    var lineColor = rising ? "#c0392b" : "#1565c0";

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            borderColor: lineColor,
            backgroundColor: "transparent",
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHitRadius: 10,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (items) { return items[0].label; },
              label: function (item) { return "  " + item.formattedValue; },
            },
          },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });

    card.dataset.chartInitialized = "true";
  }

  // Always-visible desktop dashboard: charts have real size on load.
  document.querySelectorAll(".market-dashboard--top .market-card").forEach(initCard);

  // Collapsed mobile/tablet accordion: a closed <details> has no layout box,
  // so Chart.js would measure a 0x0 canvas if initialized eagerly. Defer
  // until the user actually opens it.
  document.querySelectorAll(".market-dashboard--accordion").forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (!details.open) return;
      details.querySelectorAll(".market-card").forEach(initCard);
    });
  });
});
