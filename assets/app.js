let startups = [];
let filtered = [];

let currentPage = 1;
const itemsPerPage = 5;

async function loadStartups() {
    const response = await fetch("assets/startups.json");
    startups = await response.json();
    filtered = startups; // Initialize filtered with full list
    renderTableWithPagination(filtered);
}

function renderTable(data) {
    const tbody = document.querySelector("#startupTable tbody");
    tbody.innerHTML = "";

    data.forEach(startup => {
        const row = `
  <tr onclick="showDetails(${JSON.stringify(startup).replace(/"/g, '&quot;')})">
    <td data-label="Logo"><img src="${startup.logo}" alt="${startup.name} Logo" width="40"></td>
    <td data-label="Name"><a class="company_name" href="${startup.website}" target="_blank">${startup.name}</a></td>
    <td data-label="Valuation">${startup.valuation}</td>
    <td data-label="Category">${startup.category}</td>
    <td data-label="Founded">${startup.founded}</td>
    <td data-label="Location">${startup.location}</td>
  </tr>`;

        tbody.innerHTML += row;
    });
}

function showDetails(startup) {
    alert(
        `Name: ${startup.name}\nValuation: ${startup.valuation}\nCategory: ${startup.category}\nFounded: ${startup.founded}\nLocation: ${startup.location}\nWebsite: ${startup.website}`
    );
}

function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const valuation = document.getElementById("valuationFilter").value;

    filtered = startups.filter(s =>
        s.name.toLowerCase().includes(search) &&
        (category === "" || s.category === category) &&
        (valuation === "" || parseInt(s.valuation) < parseInt(valuation))
    );

    currentPage = 1; // Reset to first page after filter
    renderTableWithPagination(filtered);
}

function renderTableWithPagination(data) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);
    renderTable(paginatedData);
    renderPagination(data.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;
        btn.onclick = () => {
            currentPage = i;
            renderTableWithPagination(filtered);
        };
        pagination.appendChild(btn);
    }
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("valuationFilter").addEventListener("change", applyFilters);

loadStartups();
