/* =====================================================
   UIFlow Dashboard — Charts, views, users table, dark mode
   Todos los datos son de ejemplo y fijos (sin backend)
===================================================== */

/* =============================
   HELPERS
============================= */

// Serie determinista con tendencia al alza y algo de ondulación
function series(length, base, step, wave) {
    return Array.from({ length }, (_, i) => Math.round(base + i * step + Math.sin(i * 1.3) * wave));
}

const sum = values => values.reduce((a, b) => a + b, 0);
const money = value => "$" + value.toLocaleString("en-US");
const number = value => value.toLocaleString("en-US");

function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Marca como activo el botón pulsado dentro de su grupo de rangos
function setPressed(group, activeBtn) {
    group.querySelectorAll(".range-btn").forEach(btn => {
        btn.setAttribute("aria-pressed", String(btn === activeBtn));
    });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* =============================
   CHART THEME
   Ejes y cuadrícula toman los colores de las variables CSS
============================= */

function setChartDefaults() {
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.color = cssVar("--chart-text");
    Chart.defaults.borderColor = cssVar("--chart-grid");
}

function applyChartTheme() {
    setChartDefaults();
    // Los gráficos ya creados copiaron los colores al crearse: se actualizan uno a uno
    Object.values(Chart.instances).forEach(chart => {
        Object.values(chart.options.scales || {}).forEach(scale => {
            if (scale.ticks) scale.ticks.color = Chart.defaults.color;
            if (scale.grid) scale.grid.color = Chart.defaults.borderColor;
        });
        if (chart.options.plugins?.legend?.labels) {
            chart.options.plugins.legend.labels.color = Chart.defaults.color;
        }
        if (chart.config.type === "doughnut") {
            chart.data.datasets[0].borderColor = cssVar("--surface");
        }
        chart.update("none");
    });
}

setChartDefaults();

/* =============================
   DASHBOARD CHART DATA
============================= */

const dataSets = {
    7: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [400, 550, 510, 620, 700, 820, 900],
        users: "128",
        session: "3m 05s",
        conversion: "4.8%"
    },
    30: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        data: series(30, 450, 12, 90),
        users: "1,204",
        session: "3m 21s",
        conversion: "12.4%"
    },
    90: {
        labels: Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
        data: series(13, 3200, 180, 350),
        users: "3,842",
        session: "3m 44s",
        conversion: "15.6%"
    },
    365: {
        labels: MONTHS,
        data: [12400, 13100, 12800, 14200, 15000, 14600, 16100, 16900, 16400, 17800, 18500, 19900],
        users: "14,120",
        session: "4m 24s",
        conversion: "22.7%"
    }
};

/* =============================
   DASHBOARD CHART
============================= */

const dashChart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Revenue",
            data: [],
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
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { maxTicksLimit: 8 } } }
    }
});

function loadDashboardRange(range) {
    const set = dataSets[range];

    dashChart.data.labels = set.labels;
    dashChart.data.datasets[0].data = set.data;
    dashChart.update();

    document.querySelector('[data-kpi="revenue"]').textContent = money(sum(set.data));
    document.querySelector('[data-kpi="users"]').textContent = set.users;
    document.querySelector('[data-kpi="session"]').textContent = set.session;
    document.querySelector('[data-kpi="conversion"]').textContent = set.conversion;
}

loadDashboardRange(7);

/* DASHBOARD FILTER BUTTONS */
const dashRangeGroup = document.querySelector("#view-dashboard .range-group");

dashRangeGroup.addEventListener("click", e => {
    const btn = e.target.closest(".range-btn");
    if (!btn) return;
    setPressed(dashRangeGroup, btn);
    loadDashboardRange(btn.dataset.range);
});

/* =====================================================
   ANALYTICS — 3 CHARTS + RANGE SWITCHER
===================================================== */

const analyticsDatasets = {
    7: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        revenue: [3200, 4100, 3800, 5100, 5600, 6200, 7000],
        newUsers: [42, 58, 51, 73, 80, 95, 110],
        devices: [62, 28, 10],
        mau: "8,312",
        churn: "3.8%"
    },
    30: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        revenue: [24500, 26800, 29100, 31400],
        newUsers: [310, 365, 402, 455],
        devices: [60, 30, 10],
        mau: "8,540",
        churn: "3.6%"
    },
    90: {
        labels: Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
        revenue: series(13, 24000, 900, 1500),
        newUsers: series(13, 300, 18, 40),
        devices: [58, 31, 11],
        mau: "9,105",
        churn: "3.4%"
    },
    365: {
        labels: MONTHS,
        revenue: series(12, 95000, 4200, 6000),
        newUsers: series(12, 1200, 85, 150),
        devices: [55, 33, 12],
        mau: "11,870",
        churn: "3.1%"
    }
};

const analyticsRevenueChart = new Chart(document.getElementById("analyticsChart"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Revenue",
            data: [],
            borderColor: "#4b6bff",
            backgroundColor: "rgba(75,107,255,0.2)",
            tension: 0.3,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { maxTicksLimit: 7 } } }
    }
});

const analyticsUsersChart = new Chart(document.getElementById("analyticsChartUsers"), {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: "New users",
            data: [],
            backgroundColor: "#4b6bff",
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { maxTicksLimit: 7 } } }
    }
});

const analyticsDevicesChart = new Chart(document.getElementById("analyticsChartDevices"), {
    type: "doughnut",
    data: {
        labels: ["Mobile", "Desktop", "Tablet"],
        datasets: [{
            data: [],
            backgroundColor: ["#4b6bff", "#3a54d9", "#a6b4ff"],
            borderColor: cssVar("--surface")
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
    }
});

function loadAnalyticsRange(range) {
    const set = analyticsDatasets[range];

    analyticsRevenueChart.data.labels = set.labels;
    analyticsRevenueChart.data.datasets[0].data = set.revenue;
    analyticsRevenueChart.update();

    analyticsUsersChart.data.labels = set.labels;
    analyticsUsersChart.data.datasets[0].data = set.newUsers;
    analyticsUsersChart.update();

    analyticsDevicesChart.data.datasets[0].data = set.devices;
    analyticsDevicesChart.update();

    document.querySelector('[data-akpi="revenue"]').textContent = money(sum(set.revenue));
    document.querySelector('[data-akpi="users"]').textContent = set.mau;
    document.querySelector('[data-akpi="churn"]').textContent = set.churn;
    document.querySelector('[data-akpi="signups"]').textContent = number(sum(set.newUsers));
}

loadAnalyticsRange(7);

const analyticsRangeGroup = document.querySelector("#view-analytics .range-group");

analyticsRangeGroup.addEventListener("click", e => {
    const btn = e.target.closest(".range-btn");
    if (!btn) return;
    setPressed(analyticsRangeGroup, btn);
    loadAnalyticsRange(btn.dataset.range);
});

/* =====================================================
   SPA NAVIGATION
===================================================== */

const viewInfo = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Welcome back, Alex. Here's what's happening with your product."
    },
    analytics: {
        title: "Analytics",
        subtitle: "Track performance, insights and real-time application metrics."
    }
};

const navItems = document.querySelectorAll(".nav-item");

function showView(name) {
    navItems.forEach(item => {
        const active = item.dataset.view === name;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
    });

    document.querySelectorAll(".view").forEach(view => {
        view.classList.toggle("active", view.id === `view-${name}`);
    });

    document.getElementById("pageTitle").textContent = viewInfo[name].title;
    document.getElementById("pageSubtitle").textContent = viewInfo[name].subtitle;
}

navItems.forEach(item => {
    item.addEventListener("click", () => showView(item.dataset.view));
});

/* =====================================================
   DARK MODE
   (el script del <head> ya aplicó el tema guardado)
===================================================== */

const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function syncThemeButton() {
    const isDark = root.classList.contains("dark");
    themeBtn.setAttribute("aria-pressed", String(isDark));
}

syncThemeButton();

themeBtn.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
    syncThemeButton();
    applyChartTheme();
});

/* =====================================================
   USERS TABLE SYSTEM
   Un solo estado; búsqueda, orden y paginación se combinan en render()
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

const rowsPerPage = 6;
const tableState = { query: "", sortCol: "name", sortDir: "asc", page: 1 };

const tbody = document.querySelector("#usersTable tbody");
const headers = document.querySelectorAll("#usersTable th[data-col]");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const searchInputs = [document.getElementById("tableSearch"), document.getElementById("globalSearch")];

function visibleUsers() {
    const text = tableState.query.toLowerCase();
    const dir = tableState.sortDir === "asc" ? 1 : -1;

    return users
        .filter(user =>
            user.name.toLowerCase().includes(text) ||
            user.email.toLowerCase().includes(text) ||
            user.status.toLowerCase().includes(text)
        )
        .sort((a, b) => a[tableState.sortCol].localeCompare(b[tableState.sortCol]) * dir);
}

function renderTable() {
    const rows = visibleUsers();
    const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
    tableState.page = Math.min(tableState.page, pages);

    const start = (tableState.page - 1) * rowsPerPage;
    tbody.replaceChildren();

    rows.slice(start, start + rowsPerPage).forEach(user => {
        const tr = document.createElement("tr");
        [user.name, user.email].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.append(td);
        });
        const statusCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = `status ${user.status.toLowerCase()}`;
        badge.textContent = user.status;
        statusCell.append(badge);
        tr.append(statusCell);
        tbody.append(tr);
    });

    if (rows.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.className = "empty-row";
        td.textContent = "No users found.";
        tr.append(td);
        tbody.append(tr);
    }

    headers.forEach(th => {
        const sorted = th.dataset.col === tableState.sortCol;
        th.setAttribute("aria-sort", sorted ? (tableState.sortDir === "asc" ? "ascending" : "descending") : "none");
        th.querySelector(".sort-icon").textContent = sorted ? (tableState.sortDir === "asc" ? "▲" : "▼") : "";
    });

    document.getElementById("pageInfo").textContent = `Page ${tableState.page} of ${pages}`;
    prevBtn.disabled = tableState.page <= 1;
    nextBtn.disabled = tableState.page >= pages;
}

renderTable();

/* Pagination */
prevBtn.addEventListener("click", () => {
    tableState.page--;
    renderTable();
});

nextBtn.addEventListener("click", () => {
    tableState.page++;
    renderTable();
});

/* Sorting: clic en la misma columna invierte el orden */
headers.forEach(th => {
    th.querySelector(".sort-btn").addEventListener("click", () => {
        const col = th.dataset.col;
        if (tableState.sortCol === col) {
            tableState.sortDir = tableState.sortDir === "asc" ? "desc" : "asc";
        } else {
            tableState.sortCol = col;
            tableState.sortDir = "asc";
        }
        tableState.page = 1;
        renderTable();
    });
});

/* Search: la caja de la topbar y la de la tabla filtran lo mismo y se sincronizan */
searchInputs.forEach(input => {
    input.addEventListener("input", () => {
        tableState.query = input.value.trim();
        tableState.page = 1;
        searchInputs.forEach(other => { if (other !== input) other.value = input.value; });
        if (input.id === "globalSearch") showView("dashboard");
        renderTable();
    });
});
