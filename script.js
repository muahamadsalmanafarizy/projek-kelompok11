
document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // KODE ASLI — menu toggle + scroll spy + chart kebiasaan
  // ============================================================

  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (s) { observer.observe(s); });

  // --- Chart kebiasaan boros (asli, tidak diubah) ---
  var canvas = document.getElementById("chartKebiasaan");
  if (canvas && window.Chart) {
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: [
          "Lampu menyala siang hari",
          "Charger tetap tercolok",
          "Kipas/AC di ruang kosong",
          "Perangkat standby lama"
        ],
        datasets: [{
          data: [5, 4, 4, 3],
          backgroundColor: ["#e8b23b", "#2f4a31", "#2f4a31", "#2f4a31"],
          borderRadius: 4,
          maxBarThickness: 42
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 5, ticks: { stepSize: 1 }, grid: { color: "#ddd4b8" } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // ============================================================
  // FASE 2 — Fetch data.json, render grafik angket + observasi
  // ============================================================

  // Palet warna yang cocok dengan tema website
  var COLORS = {
    bg: [
      "rgba(232, 178, 59, 0.75)",   // sun
      "rgba(47, 74, 49, 0.75)",     // forest
      "rgba(107, 143, 78, 0.75)",   // leaf
      "rgba(30, 50, 32, 0.75)",     // forest-dark
      "rgba(244, 217, 152, 0.75)"   // sun-soft
    ],
    border: [
      "#e8b23b",
      "#2f4a31",
      "#6b8f4e",
      "#1e3220",
      "#f4d998"
    ],
    observasi: [
      "rgba(232, 178, 59, 0.8)",
      "rgba(47, 74, 49, 0.8)",
      "rgba(107, 143, 78, 0.8)"
    ],
    observasiBorder: [
      "#e8b23b",
      "#2f4a31",
      "#6b8f4e"
    ]
  };

  fetch("data.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Gagal memuat data.json");
      return res.json();
    })
    .then(function (data) {
      renderInfoBar(data.angket);
      renderAngketCharts(data.angket.pertanyaan);
      renderObservasiChart(data.observasi);
      renderFakta(data.ringkasan.fakta);
    })
    .catch(function (err) {
      console.error(err);
    });

  // --- Info Bar ---
  function renderInfoBar(angket) {
    document.getElementById("jumlah-responden").textContent = angket.responden;
    document.getElementById("tanggal-survey").textContent = angket.tanggal;
    document.getElementById("jumlah-pertanyaan").textContent = angket.pertanyaan.length;
  }

  // --- Grafik Angket: satu doughnut per pertanyaan ---
  function renderAngketCharts(pertanyaan) {
    var container = document.getElementById("charts-angket");

    pertanyaan.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "survey-chart-card";

      var title = document.createElement("h3");
      title.textContent = p.teks;
      card.appendChild(title);

      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = p.kategori;
      card.appendChild(badge);

      var cvs = document.createElement("canvas");
      cvs.id = "chart-angket-" + p.id;
      card.appendChild(cvs);

      container.appendChild(card);

      var labels = Object.keys(p.jawaban);
      var values = Object.values(p.jawaban);

      new Chart(cvs, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: COLORS.bg,
            borderColor: COLORS.border,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 12,
                usePointStyle: true,
                pointStyle: "circle",
                font: { size: 12 },
                color: "#565f4d"
              }
            },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                  var pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return " " + ctx.label + ": " + ctx.parsed + " orang (" + pct + "%)";
                }
              }
            }
          }
        }
      });
    });
  }

  // --- Grafik Observasi: Grouped Bar Chart ---
  function renderObservasiChart(obs) {
    var ctx = document.getElementById("chart-observasi");
    var indikatorKeys = Object.keys(obs.indikator);

    var datasets = indikatorKeys.map(function (key, i) {
      return {
        label: key,
        data: obs.indikator[key],
        backgroundColor: COLORS.observasi[i],
        borderColor: COLORS.observasiBorder[i],
        borderWidth: 2,
        borderRadius: 4,
        maxBarThickness: 36
      };
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: obs.ruangan,
        datasets: datasets
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (v) { return v + "%"; },
              color: "#565f4d"
            },
            grid: { color: "#ddd4b8" }
          },
          x: {
            ticks: { color: "#565f4d" },
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              padding: 14,
              usePointStyle: true,
              pointStyle: "rectRounded",
              font: { size: 12 },
              color: "#565f4d"
            }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " " + ctx.dataset.label + ": " + ctx.parsed.y + "%";
              }
            }
          }
        }
      }
    });
  }

  // --- Fakta Penting ---
  function renderFakta(faktaArr) {
    var container = document.getElementById("fakta-list");

    faktaArr.forEach(function (f, i) {
      var li = document.createElement("li");

      var mark = document.createElement("span");
      mark.className = "mark";
      mark.textContent = i + 1;

      var text = document.createElement("span");
      text.textContent = f;

      li.appendChild(mark);
      li.appendChild(text);
      container.appendChild(li);
    });
  }

});
