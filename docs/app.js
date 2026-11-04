const projectList = document.querySelector("#project-list");
const filterContainer = document.querySelector("#category-filters");
const searchInput = document.querySelector("#project-search");
const resultsSummary = document.querySelector("#results-summary");
const emptyState = document.querySelector("#empty-state");
const clearSearchButton = document.querySelector("#clear-search");

let projects = [];
let selectedCategory = "all";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

function makeProjectCard(project, index) {
  const stack = project.stack.map((item) => `<span class="tech-tag">${escapeHtml(item)}</span>`).join("");
  const contributionGuide = project.contributingGuide
    ? `<a href="${escapeHtml(project.contributingGuide)}" target="_blank" rel="noreferrer">Contribution guide <span aria-hidden="true">↗</span></a>`
    : "";

  return `
    <article class="project-card" style="--card-index: ${index}" aria-labelledby="project-title-${index}">
      <div class="card-topline">
        <span class="project-category">${escapeHtml(project.category)} <span aria-hidden="true">/</span> ${escapeHtml(project.focus)}</span>
        <span class="project-stage"><span class="stage-dot"></span>${escapeHtml(project.stage)}</span>
      </div>
      <div class="card-main">
        <div class="project-title-row">
          <h3 id="project-title-${index}">${escapeHtml(project.name)}</h3>
          <a class="repo-icon" href="${escapeHtml(project.repository)}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(project.name)} on GitHub">↗</a>
        </div>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <div class="project-context">
          <div><h4>Where it is</h4><p>${escapeHtml(project.context)}</p></div>
          <div><h4>Ways to jump in</h4><p>${escapeHtml(project.contribute)}</p></div>
        </div>
        <div class="tech-stack" aria-label="Technologies">${stack}</div>
      </div>
      <div class="card-actions">
        <a class="primary-action" href="${escapeHtml(project.issues)}" target="_blank" rel="noreferrer">Browse open issues <span aria-hidden="true">↗</span></a>
        <div class="secondary-actions">
          <a href="${escapeHtml(project.readme)}" target="_blank" rel="noreferrer">Project README <span aria-hidden="true">↗</span></a>
          ${contributionGuide}
        </div>
      </div>
    </article>`;
}

function renderFilters() {
  const categories = [...new Set(projects.map((project) => project.category))];
  const buttons = categories.map((category) => {
    const count = projects.filter((project) => project.category === category).length;
    return `<button class="filter-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)} <span class="filter-count">${count}</span></button>`;
  }).join("");

  filterContainer.insertAdjacentHTML("beforeend", buttons);
  filterContainer.querySelector('[data-count="all"]').textContent = projects.length;
}

function renderProjects() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleProjects = projects.filter((project) => {
    const inCategory = selectedCategory === "all" || project.category === selectedCategory;
    const searchableText = [project.name, project.category, project.focus, project.summary, project.context, project.contribute, ...project.stack]
      .join(" ")
      .toLocaleLowerCase();
    return inCategory && searchableText.includes(query);
  });

  projectList.innerHTML = visibleProjects.map(makeProjectCard).join("");
  emptyState.hidden = visibleProjects.length > 0;
  projectList.hidden = visibleProjects.length === 0;
  resultsSummary.textContent = `${visibleProjects.length} ${visibleProjects.length === 1 ? "project" : "projects"}${selectedCategory === "all" ? "" : ` in ${selectedCategory}`}`;
}

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  filterContainer.querySelectorAll("button[data-category]").forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderProjects();
});

searchInput.addEventListener("input", renderProjects);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderProjects();
  searchInput.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderProjects();
  }
});

fetch("projects.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load project catalog (${response.status})`);
    return response.json();
  })
  .then((catalog) => {
    if (!Array.isArray(catalog)) throw new Error("Project catalog must be a JSON array");
    projects = catalog;
    renderFilters();
    renderProjects();
  })
  .catch((error) => {
    resultsSummary.textContent = "The project catalog could not be loaded.";
    console.error(error);
  });
