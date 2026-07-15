/**
 * MMO ARCHITECTS - Entropy Grid Matrix Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("entropyGridContainer");
  if (gridContainer) {
    loadEntropyGrid(gridContainer);
  }
});

async function loadEntropyGrid(container) {
  try {
    const response = await fetch("/data/projects.json");
    const projects = await response.json();
    
    // Select first 5 projects for home page Selected Works
    const homeProjects = projects.slice(0, 5);
    
    container.innerHTML = generateEntropyLayout(homeProjects);
    
    // Bind click events to cards
    container.querySelectorAll(".entropy-card").forEach(card => {
      card.addEventListener("click", () => {
        const projId = card.getAttribute("data-id");
        window.location.href = `/projects.html?id=${projId}`;
      });
    });
  } catch (error) {
    console.error("Failed to render entropy grid:", error);
  }
}

function generateEntropyLayout(projects) {
  const sizeClasses = ['size-standard', 'size-tall', 'size-square', 'size-wide'];
  const spaceClasses = ['space-tight', 'space-medium', 'space-wide'];
  
  // Pick exactly 1 random index for the colspan-3 (panoramic layout)
  const panoramaIndex = Math.floor(Math.random() * projects.length);
  
  let html = '';
  let currentColumnSpace = 0; // Tracks filled grid column space
  
  // Helper to handle asset paths between local development server and Vercel
  const getAssetPath = (path) => {
    if (!path) return "";
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return path.startsWith("/public") ? path : "/public" + path;
    }
    return path;
  };
  
  projects.forEach((proj, idx) => {
    let sizeClass = '';
    let colSpan = 1;
    
    if (idx === panoramaIndex) {
      sizeClass = 'colspan-3';
      colSpan = 3;
    } else {
      // Anti-Collapse Logic:
      // If we have only 1 column left in the row (currentColumnSpace == 2),
      // we MUST use a 1-column layout to fill the row perfectly and prevent grid collapse.
      if (currentColumnSpace === 2) {
        const singles = ['size-standard', 'size-tall', 'size-square'];
        sizeClass = singles[Math.floor(Math.random() * singles.length)];
        colSpan = 1;
      } else {
        sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
        colSpan = sizeClass === 'size-wide' ? 2 : 1;
      }
    }
    
    const spaceClass = spaceClasses[Math.floor(Math.random() * spaceClasses.length)];
    
    // Update ongoing counter
    currentColumnSpace = (currentColumnSpace + colSpan) % 3;
    
    html += `
      <div class="entropy-card ${sizeClass} ${spaceClass}" data-id="${proj.id}">
        <div class="entropy-img-wrapper">
          <img class="entropy-img" src="${getAssetPath(proj.thumbnail)}" alt="${proj.title}">
          <img class="entropy-blueprint" src="${getAssetPath(proj.blueprint)}" alt="${proj.title} Blueprint">
        </div>
        <div class="entropy-card-info">
          <h3 class="entropy-card-title">${proj.title}</h3>
          <div class="entropy-card-meta">
            <div>${proj.subCategory}</div>
            <div>${proj.year}</div>
          </div>
        </div>
      </div>
    `;
  });
  
  // Grid Footer View All Projects anchor is forced-aligned
  // using grid-column: 3; align-self: end; to guarantee alignment.
  html += `
    <div class="grid-footer">
      <a href="/projects.html" class="view-all-link eng-label">
        VIEW ALL PROJECTS <span class="arrow-move">➔</span>
      </a>
    </div>
  `;
  
  return html;
}
