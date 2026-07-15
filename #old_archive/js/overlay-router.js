/**
 * MMO ARCHITECTS - El Croquis Split-View Detail Overlay Router
 */

let projectsList = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProjectsForOverlay();
  
  // Bind close buttons
  const closeBtn = document.getElementById("detailCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjectDetail);
  }
});

async function fetchProjectsForOverlay() {
  try {
    const response = await fetch("/data/projects.json");
    projectsList = await response.json();
  } catch (error) {
    console.error("Overlay router failed to preload projects data:", error);
  }
}

function openProjectDetail(id) {
  const proj = projectsList.find(p => p.id === id);
  if (!proj) return;
  
  const overlay = document.getElementById("projectDetailLayer");
  const gnb = document.getElementById("gnb");
  
  // Lock body scroll to prevent base page wheel movement
  document.body.classList.add("modal-open");
  
  // Populate data fields
  document.getElementById("detailTitle").innerText = proj.title;
  document.getElementById("detailCategory").innerText = proj.category;
  document.getElementById("detailYear").innerText = proj.year;
  document.getElementById("detailLocation").innerText = proj.subCategory; // Show sub-category or location
  document.getElementById("detailArea").innerText = proj.summary; // Show summary/description
  document.getElementById("detailDescription").innerText = proj.summary;
  
  // Detailed Monograph notes
  document.getElementById("detailMonograph").innerText = `Monograph — ${proj.title} (${proj.year})`;
  
  // Image stream
  document.getElementById("detailPhoto").src = proj.thumbnail;
  document.getElementById("detailBlueprint").src = proj.detailedPlan || proj.blueprint;
  
  // UX Reset Fix: Reset right panel internal scrollbar to zero
  const rightScroll = document.getElementById("detailRightScroll");
  if (rightScroll) {
    rightScroll.scrollTop = 0;
  }
  
  // Slide up and make visible
  if (overlay) {
    overlay.classList.add("active");
  }
  if (gnb) {
    gnb.classList.add("overlay-active");
  }
}

function closeProjectDetail() {
  const overlay = document.getElementById("projectDetailLayer");
  const gnb = document.getElementById("gnb");
  
  if (overlay) {
    overlay.classList.remove("active");
  }
  if (gnb) {
    gnb.classList.remove("overlay-active");
  }
  
  // Unlock body scroll
  document.body.classList.remove("modal-open");
}

// Expose globally for infinite-scroll
window.openProjectDetail = openProjectDetail;
window.closeProjectDetail = closeProjectDetail;
