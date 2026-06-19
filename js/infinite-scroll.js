/**
 * MMO ARCHITECTS - Infinite Loop Magazine Scroll Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const archiveContainer = document.getElementById("archiveScrollContainer");
  const archiveGrid = document.getElementById("archiveGrid");
  
  if (archiveContainer && archiveGrid) {
    loadArchiveGrid(archiveContainer, archiveGrid);
  }
});

async function loadArchiveGrid(container, grid) {
  try {
    const response = await fetch("/data/projects.json");
    const projects = await response.json();
    
    // Render asymmetric masonry layout
    let html = '';
    const sizeClasses = ['size-standard', 'size-wide', 'size-tall', 'size-square'];
    const spaceClasses = ['space-tight', 'space-medium', 'space-wide'];
    
    projects.forEach((proj, idx) => {
      const sizeClass = sizeClasses[idx % sizeClasses.length];
      const spaceClass = spaceClasses[idx % spaceClasses.length];
      
      html += `
        <div class="entropy-card ${sizeClass} ${spaceClass}" data-id="${proj.id}">
          <div class="entropy-img-wrapper">
            <img class="entropy-img" src="${proj.thumbnail}" alt="${proj.title}">
            <img class="entropy-blueprint" src="${proj.blueprint}" alt="${proj.title} Blueprint">
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
    
    grid.innerHTML = html;
    
    // Stitch cloned grid nodes for infinite loop simulation
    const originalHeight = grid.scrollHeight;
    const cloneGrid = grid.cloneNode(true);
    cloneGrid.id = "archiveGridClone";
    container.appendChild(cloneGrid);
    
    // Setup scroll listener for seamless loop
    container.addEventListener("scroll", () => {
      if (container.scrollTop >= originalHeight) {
        container.scrollTop = container.scrollTop - originalHeight;
      } else if (container.scrollTop <= 0) {
        container.scrollTop = originalHeight + container.scrollTop;
      }
    });
    
    // Re-bind overlay clicking events (since we cloned node, document query selector catches all)
    document.querySelectorAll(".entropy-card").forEach(card => {
      card.addEventListener("click", () => {
        const projId = card.getAttribute("data-id");
        if (typeof window.openProjectDetail === "function") {
          window.openProjectDetail(projId);
        }
      });
    });

    // Reset Scroll Trigger Zone (Invisible sidebar bookmark 70px)
    const sidebar = document.getElementById("sidebarBookmark");
    if (sidebar) {
      sidebar.addEventListener("click", () => {
        container.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Check if redirect query parameter exists (e.g. ?id=p-01)
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get("id");
    if (targetId) {
      setTimeout(() => {
        if (typeof window.openProjectDetail === "function") {
          window.openProjectDetail(targetId);
        }
      }, 300);
    }
  } catch (error) {
    console.error("Failed to load archive grid:", error);
  }
}
