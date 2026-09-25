
document.addEventListener("DOMContentLoaded", function () {
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
});
