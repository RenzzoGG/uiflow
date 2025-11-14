/* =====================================================
   UIFlow Dashboard — Chart + Dynamic Filters
===================================================== */

/* =============================
   DASHBOARD CHART DATA
============================= */

const dataSets = {
    7: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [400, 550, 510, 620, 700, 820, 900],
        revenue: "$900",
        users: "128",
        session: "3m 05s",
        conversion: "4.8%"
    },

    30: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
        revenue: "$4,320",
        users: "1,204",
        session: "3m 21s",
        conversion: "12.4%"
    },

    90: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
        data: [1200, 1400, 1600, 1300, 1700, 2000],
        revenue: "$8,950",
        users: "3,842",
        session: "3m 44s",
        conversion: "15.6%"
    },

    365: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        data: [3500, 4300, 3900, 5100],
        revenue: "$22,900",
        users: "14,120",
        session: "4m 24s",
        conversion: "22.7%"
    }
};

/* =============================
   DASHBOARD CHART
============================= */

const dashCanvas = document.getElementById("chart");
let dashChart = null;

function loadDashboardChart(range = 7) {
    const set = dataSets[range];

    if (dashChart) dashChart.destroy();

    dashChart = new Chart(dashCanvas, {
        type: "line",
        data: {
            labels: set.labels,
            datasets: [{
                data: set.data,
                borderColor: "#4b6bff",
                backgroundColor: "rgba(75,107,255,0.16)",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: "#4b6bff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    document.querySelectorAll(".card")[0].querySelector("h3").innerText = set.revenue;
    document.querySelectorAll(".card")[1].querySelector("h3").innerText = set.users;
    document.querySelectorAll(".card")[2].querySelector("h3").innerText = set.session;
    document.querySelectorAll(".card")[3].querySelector("h3").innerText = set.conversion;
}

loadDashboardChart(7);

/* DASHBOARD FILTER BUTTONS */
document.querySelectorAll(".dash-filter").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".dash-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        loadDashboardChart(btn.dataset.range);
    });
});

/* =====================================================
   SPA NAVIGATION
===================================================== */

const menuItems = document.querySelectorAll(".sidebar-menu a");
const views = document.querySelectorAll(".view");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        views.forEach(v => v.classList.remove("active"));

        const target = item.textContent.trim().toLowerCase();

        if (target === "dashboard") document.getElementById("view-dashboard").classList.add("active");
        if (target === "analytics") document.getElementById("view-analytics").classList.add("active");
        if (target === "users") document.getElementById("view-users").classList.add("active");
        if (target === "settings") document.getElementById("view-settings").classList.add("active");
    });
});

/* =====================================================
   DARK MODE
===================================================== */

const body = document.body;
const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* =====================================================
   USERS TABLE SYSTEM
===================================================== */

const users = [
    { name: "Ana Torres", email: "ana@mail.com", status: "Active" },
    { name: "Carlos Díaz", email: "carlos@mail.com", status: "Inactive" },
    { name: "Lucía Martín", email: "lucia@mail.com", status: "Pending" },
    { name: "Diego López", email: "diego@mail.com", status: "Active" },
    { name: "Fernanda Ruiz", email: "fernanda@mail.com", status: "Inactive" },
    { name: "Mario Torres", email: "mario@mail.com", status: "Pending" },
    { name: "Valeria Soto", email: "valeria@mail.com", status: "Active" },
    { name: "Jorge Medina", email: "jorge@mail.com", status: "Active" },
    { name: "Nicole Caro", email: "nicole@mail.com", status: "Pending" },
    { name: "Sebastián Pérez", email: "seb@mail.com", status: "Inactive" },
    { name: "Daniela Castro", email: "dani@mail.com", status: "Active" },
];

let currentPage = 1;
const rowsPerPage = 6;

function renderTable(data) {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const paginated = data.slice(start, start + rowsPerPage);

    paginated.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status ${user.status.toLowerCase()}">${user.status}</span></td>
            </tr>
        `;
    });

    document.getElementById("pageInfo").innerText =
        `Page ${currentPage} of ${Math.ceil(data.length / rowsPerPage)}`;
}

renderTable(users);

/* Pagination */
document.getElementById("nextPage").onclick = () => {
    if (currentPage < Math.ceil(users.length / rowsPerPage)) {
        currentPage++;
        renderTable(users);
    }
};

document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable(users);
    }
};

/* Sorting */
let sortDirection = true;

document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
        const col = th.dataset.col;
        users.sort((a, b) =>
            sortDirection
                ? a[col].localeCompare(b[col])
                : b[col].localeCompare(a[col])
        );
        sortDirection = !sortDirection;
        currentPage = 1;
        renderTable(users);
    });
});

/* Search */
document.getElementById("tableSearch").addEventListener("input", e => {
    const text = e.target.value.toLowerCase();

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        user.status.toLowerCase().includes(text)
    );

    currentPage = 1;
    renderTable(filtered);
});

/* =====================================================
   ANALYTICS — 3 CHARTS + RANGE SWITCHER
===================================================== */

const analyticsRanges = document.querySelectorAll(".a-filter");

/* CHART 1 – Revenue */
let analyticsChart1;
const chart1Canvas = document.getElementById("analyticsChart");

/* CHART 2 – Users Growth */
let analyticsChart2;
const chart2Canvas = document.getElementById("analyticsChartUsers");

/* CHART 3 – Devices */
let analyticsChart3;
const chart3Canvas = document.getElementById("analyticsChartDevices");

const analyticsDatasets = {
    7:   [3200, 4100, 3800, 5100, 5600, 6200, 7000],
    30:  [2500, 2900, 3100, 3300, 3600, 3900, 4200],
    90:  [2000, 2400, 2600, 2800, 3000, 3200, 3400],
    365: [1500, 1600, 1800, 2100, 2400, 2600, 3000]
};

function loadAnalyticsCharts(range = 7) {

    /* Chart 1 */
    if (analyticsChart1) analyticsChart1.destroy();
    analyticsChart1 = new Chart(chart1Canvas, {
        type: "line",
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets: [{
                label: "Revenue",
                data: analyticsDatasets[range],
                borderColor: "#4b6bff",
                backgroundColor: "rgba(75,107,255,0.2)",
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    /* Chart 2 */
    if (analyticsChart2) analyticsChart2.destroy();
    analyticsChart2 = new Chart(chart2Canvas, {
        type: "bar",
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun"],
            datasets: [{
                label: "Users",
                data: [800,950,1100,1300,1500,1850],
                backgroundColor: "#3a54d9",
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    /* Chart 3 */
    if (analyticsChart3) analyticsChart3.destroy();
    analyticsChart3 = new Chart(chart3Canvas, {
        type: "doughnut",
        data: {
            labels: ["Mobile","Desktop","Tablet"],
            datasets: [{
                data: [62,28,10],
                backgroundColor: ["#4b6bff","#3a54d9","#a6b4ff"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/* Inicial */
loadAnalyticsCharts(7);

/* Range Filters */
analyticsRanges.forEach(btn => {
    btn.addEventListener("click", () => {
        analyticsRanges.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadAnalyticsCharts(btn.dataset.range);
    });
});
