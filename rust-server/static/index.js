const accordian = document.querySelector(".accordian");

accordian.addEventListener("click", (e) => {
	const activePanel = e.target.closest(".accordian-panel");
	if (!activePanel) return;
	toggleAccordian(activePanel);
});

function toggleAccordian(panelToActivate) {
	const activeBtn = panelToActivate.querySelector("button");
	const activePanelIsOpened = activeBtn.getAttribute("aria-expanded");

	if (activePanelIsOpened === "true") {
		panelToActivate.querySelector("button").setAttribute("aria-expanded", false);
		panelToActivate.querySelector(".accordian-content").setAttribute("aria-hidden", true);
	} else {
		panelToActivate.querySelector("button").setAttribute("aria-expanded", true);
		panelToActivate.querySelector(".accordian-content").setAttribute("aria-hidden", false);
	}
}
