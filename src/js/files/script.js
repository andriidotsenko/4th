// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";







//tabs and tytle change
const tabsBtn = document.querySelectorAll(".tabs__nav-btn");
const tabsItems = document.querySelectorAll(".tabs__item");

tabsBtn.forEach(onTabClick);

function onTabClick(item) {
	item.addEventListener("click", () => {
		let currentBtn = item;
		let tabId = currentBtn.getAttribute("data-tab");
		let currentTab = document.querySelector(tabId);
		let currentTytle = `4TH - ${currentBtn.innerText}`;

		if (!currentBtn.classList.contains("active")) {
			tabsBtn.forEach((item) => {
				item.classList.remove("active");
			});
			tabsItems.forEach((item) => {
				item.classList.remove("active");
			});
			currentBtn.classList.add("active");
			currentTab.classList.add("active");
			document.title = currentTytle;
		}
	});
}

document.querySelectorAll(".tabs__nav-btn")[1].click();
// console.log(document.querySelectorAll(".tabs__nav-btn")[1])