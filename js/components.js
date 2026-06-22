document.addEventListener("DOMContentLoaded", () => {
    // 1. GNB (Header) 주입
    const headerEl = document.querySelector("header");
    if (headerEl) {
        const pathname = window.location.pathname;
        const isLab = pathname.includes("/lab-");
        const isAbout = pathname.includes("/about.html");
        const isProjects = pathname.includes("/projects.html");
        const isModular = pathname.includes("/lab-modular.html");
        const isSolution = pathname.includes("/lab-solution.html");

        const isContact = pathname.includes("/contact.html");

        const navRightText = isLab ? "LABORATORY" : "SEOUL, KR";

        headerEl.innerHTML = `
            <div class="logo">
                <a href="/index.html" class="logo-link">
                    <span class="logo-title">MMO ARCHITECTS</span>
                    <span class="logo-sub">Design lab</span>
                </a>
            </div>
            <div class="nav-menu">
                <a href="/projects.html" class="${isProjects ? 'active' : ''}">PROJECTS</a>
                <div class="nav-item-wrapper ${isLab ? 'active-parent' : ''}">
                    <a href="/lab-modular.html" class="nav-lab-link ${isLab ? 'active' : ''}">LAB — EDITIONS</a>
                    <div class="lnb-hover-menu">
                        <a href="/lab-modular.html" class="lnb-hover-item ${isModular ? 'active' : ''}">MODULAR</a>
                        <a href="/lab-solution.html" class="lnb-hover-item ${isSolution ? 'active' : ''}">SOLUTION</a>
                    </div>
                </div>
                <a href="/about.html" class="${isAbout ? 'active' : ''}">ABOUT</a>
                <a href="/contact.html" class="${isContact ? 'active' : ''}">CONTACT</a>
            </div>
            <div class="nav-right">${navRightText}</div>
        `;
    }

    // 2. Footer 주입
    const footerEl = document.querySelector("footer") || document.querySelector(".mmo-footer");
    if (footerEl) {
        // 기존 클래스 속성이 없으면 mmo-footer 추가
        if (!footerEl.classList.contains("mmo-footer")) {
            footerEl.classList.add("mmo-footer");
        }
        footerEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1.2rem;">
                <div>
                    <h4 style="font-size: 1.1rem; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 1rem;">MMO ARCHITECTS</h4>
                    <p style="font-size: 0.9rem; color: #555; max-width: 480px; line-height: 1.7; word-break: keep-all;">엠엠오건축사사무소는 물질(Matter)과 방법론(Method)의 심도 있는 결합을 통해 공간의 최종적인 예술 질서(Order)를 확립합니다.</p>
                </div>
                <div style="font-size: 9px; color: #aaa; line-height: 1.6; letter-spacing: 0.02em; font-weight: 400;">
                    주식회사 엠엠오건축사사무소 <br>
                    서울특별시 강서구, 대한민국
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 1.2rem; text-align: right;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem;">
                    <div style="font-size: 0.75rem; letter-spacing: 0.15em; color: #8c8a85; font-weight: 600; text-transform: uppercase;">Direct Contact</div>
                    <div style="font-size: 0.9rem; font-weight: 400; line-height: 1.6; display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end;">
                        <a href="mailto:official@mmoarchitects.com" style="transition: color 0.4s;" onmouseover="this.style.color='#8c8a85'" onmouseout="this.style.color='#1a1a1a'">official@mmoarchitects.com</a>
                        <a href="https://instagram.com/mmoarchitects" target="_blank" style="transition: color 0.4s;" onmouseover="this.style.color='#8c8a85'" onmouseout="this.style.color='#1a1a1a'">@mmoarchitects</a>
                    </div>
                </div>
                <div style="font-size: 9px; color: #888; letter-spacing: 0.02em;">
                    © 2026 MMO Architects. All rights reserved.
                </div>
            </div>
        `;
    }
});
