
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

  /* -------- Fase 2: Grafik dari data.json -------- */

  /* Data fallback (salinan dari data.json) agar grafik tetap muncul
     meskipun fetch gagal (misal: buka via file://, atau 404). */
  var FALLBACK_DATA = {
    kebiasaanBoros: {
      judul: "Kebiasaan boros energi yang paling sering ditemukan",
      keterangan: "Skala 1\u20135 menunjukkan seberapa sering kebiasaan ini dilaporkan/diamati di lingkungan sekolah.",
      labels: ["Lampu menyala siang hari","Charger tetap tercolok","Kipas/AC di ruang kosong","Perangkat standby lama"],
      nilai: [5,4,4,3]
    },
    pemahamanHematEnergi: {
      judul: "Tingkat pemahaman warga sekolah tentang hemat energi",
      keterangan: "Berdasarkan angket terhadap 60 responden (siswa, guru, dan staf).",
      labels: ["Sangat paham","Cukup paham","Kurang paham","Tidak paham"],
      nilai: [12,28,15,5],
      warna: ["#2f4a31","#6b8f4e","#e8b23b","#c0392b"]
    },
    kebiasaanHarianSiswa: {
      judul: "Kebiasaan hemat energi siswa sehari-hari",
      keterangan: "Persentase siswa yang mengaku rutin melakukan kebiasaan berikut (angket, 50 siswa).",
      labels: ["Matikan lampu saat keluar kelas","Cabut charger setelah penuh","Atur AC \u2264 25 \u00b0C","Manfaatkan cahaya alami","Matikan komputer setelah pelajaran"],
      nilai: [68,42,30,55,48]
    },
    observasiRuangan: {
      judul: "Hasil observasi: jumlah ruangan dengan peralatan menyala tanpa penghuni",
      keterangan: "Observasi dilakukan selama 5 hari pada jam istirahat (12.00\u201312.30 WIB).",
      labels: ["Senin","Selasa","Rabu","Kamis","Jumat"],
      lampu: [7,5,6,4,3],
      kipas: [4,3,5,3,2],
      proyektor: [2,1,2,1,0]
    },
    sumberEnergiSekolah: {
      judul: "Distribusi penggunaan energi listrik sekolah",
      keterangan: "Estimasi berdasarkan pencatatan daya peralatan per area.",
      labels: ["Penerangan (lampu)","Pendingin ruangan (AC/kipas)","Perangkat elektronik (PC, proyektor)","Lain-lain"],
      nilai: [35,30,25,10],
      warna: ["#e8b23b","#2f4a31","#6b8f4e","#a89470"]
    }
  };

  function renderCharts(data) {
    /* 1 — Kebiasaan boros (bar horizontal) */
    var c1 = document.getElementById("chartKebiasaan");
    if (c1) {
      var kb = data.kebiasaanBoros;
      new Chart(c1, {
        type: "bar",
        data: {
          labels: kb.labels,
          datasets: [{
            data: kb.nilai,
            backgroundColor: kb.nilai.map(function (v, i) {
              return i === 0 ? "#e8b23b" : "#2f4a31";
            }),
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
      var ket = document.getElementById("keteranganKebiasaan");
      if (ket) ket.textContent = kb.keterangan;
    }

    /* 2 — Pemahaman hemat energi (doughnut) */
    var c2 = document.getElementById("chartPemahaman");
    if (c2) {
      var ph = data.pemahamanHematEnergi;
      new Chart(c2, {
        type: "doughnut",
        data: {
          labels: ph.labels,
          datasets: [{
            data: ph.nilai,
            backgroundColor: ph.warna,
            borderWidth: 2,
            borderColor: "#fffdf6"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 13 } } },
            title: { display: true, text: ph.judul, font: { size: 14, weight: "600" }, color: "#1e3220", padding: { bottom: 12 } }
          }
        }
      });
    }

    /* 3 — Distribusi penggunaan energi (pie) */
    var c3 = document.getElementById("chartSumberEnergi");
    if (c3) {
      var se = data.sumberEnergiSekolah;
      new Chart(c3, {
        type: "pie",
        data: {
          labels: se.labels,
          datasets: [{
            data: se.nilai,
            backgroundColor: se.warna,
            borderWidth: 2,
            borderColor: "#fffdf6"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 13 } } },
            title: { display: true, text: se.judul, font: { size: 14, weight: "600" }, color: "#1e3220", padding: { bottom: 12 } }
          }
        }
      });
    }

    /* 4 — Kebiasaan harian siswa (bar vertical) */
    var c4 = document.getElementById("chartKebiasaanSiswa");
    if (c4) {
      var ks = data.kebiasaanHarianSiswa;
      new Chart(c4, {
        type: "bar",
        data: {
          labels: ks.labels,
          datasets: [{
            label: "% siswa",
            data: ks.nilai,
            backgroundColor: "#6b8f4e",
            borderRadius: 4,
            maxBarThickness: 48
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.y + " %"; } } }
          },
          scales: {
            y: { min: 0, max: 100, ticks: { callback: function (v) { return v + " %"; } }, grid: { color: "#ddd4b8" } },
            x: { grid: { display: false }, ticks: { maxRotation: 25, font: { size: 12 } } }
          }
        }
      });
    }

    /* 5 — Observasi ruangan (line chart) */
    var c5 = document.getElementById("chartObservasi");
    if (c5) {
      var ob = data.observasiRuangan;
      new Chart(c5, {
        type: "line",
        data: {
          labels: ob.labels,
          datasets: [
            { label: "Lampu", data: ob.lampu, borderColor: "#e8b23b", backgroundColor: "rgba(232,178,59,0.15)", fill: true, tension: 0.3, pointRadius: 5 },
            { label: "Kipas/AC", data: ob.kipas, borderColor: "#2f4a31", backgroundColor: "rgba(47,74,49,0.10)", fill: true, tension: 0.3, pointRadius: 5 },
            { label: "Proyektor", data: ob.proyektor, borderColor: "#6b8f4e", backgroundColor: "rgba(107,143,78,0.10)", fill: true, tension: 0.3, pointRadius: 5 }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 13 } } }
          },
          scales: {
            y: { min: 0, ticks: { stepSize: 1, precision: 0 }, title: { display: true, text: "Jumlah ruangan" }, grid: { color: "#ddd4b8" } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  if (window.Chart) {
    fetch("./data.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderCharts(data);
      })
      .catch(function (err) {
        console.warn("Fetch data.json gagal, pakai data fallback:", err);
        renderCharts(FALLBACK_DATA);
      });
  }
});
