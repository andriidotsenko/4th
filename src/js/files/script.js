'use strict';
// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

//tabs and tytle change
const tabsBtn = document.querySelectorAll(".tabs__nav-btn")
const tabsItems = document.querySelectorAll(".tabs__item")

tabsBtn.forEach(onTabClick)

function onTabClick(item) {
	item.addEventListener("click", () => {
		let currentBtn = item;
		let tabId = currentBtn.getAttribute("data-tab")
		let currentTab = document.querySelector(tabId)
		let currentTytle = `4TH - ${currentBtn.innerText}`

		if (!currentBtn.classList.contains("active")) {
			tabsBtn.forEach((item) => {
				item.classList.remove("active")
			});
			tabsItems.forEach((item) => {
				item.classList.remove("active")
			});
			currentBtn.classList.add("active")
			currentTab.classList.add("active")
			document.title = currentTytle
		}
	})
}

document.querySelectorAll(".tabs__nav-btn")[0].click()


const resultOutput = document.querySelector('.result__outputs');
const formCalculator = document.querySelector('.tab-calculator__form');
const dateOne = document.querySelectorAll('.datepicker__input')[0];
const dateTwo = document.querySelectorAll('.datepicker__input')[1];

const checkbox1 = document.getElementById('checkbox_1');
const checkbox1Label = document.querySelector('.input-from__checkbox .checkbox__inner');
const checkbox2 = document.getElementById('checkbox_2');
const checkbox2Label = document.querySelector('.input-to__checkbox .checkbox__inner');

const presetsRadios = document.querySelectorAll('.presets__radio input[name="radio-p"]');
const allowRadios = document.querySelectorAll('.allow__radio input[name="radio-allow"]');
const addMonthButton = document.querySelector('.actions__item[data-preset="month"]');
const addWeekButton = document.querySelector('.actions__item[data-preset="week"]');
const savedObjects = JSON.parse(localStorage.getItem('savedObjects')) || [];

const resultsList = document.querySelector('.results');
const resultsUl = document.querySelector(".results__list");
const clearBtn = document.querySelector('.result__clear');
const MAX_SAVED_OBJECTS = 10;
let itemsLoaded = false;


checkbox1Label.textContent = checkbox1.checked ? 'Including' : 'No including';
checkbox2Label.textContent = checkbox2.checked ? 'Including' : 'No including';

resultOutput.innerText = 'enter dates!';

formCalculator.addEventListener("submit", setCalculatorResult);

checkbox1.addEventListener('change', toggleText);
checkbox2.addEventListener('change', toggleText);

checkbox1.addEventListener('change', handleCheckboxChange);
checkbox2.addEventListener('change', handleCheckboxChange);

presetsRadios.forEach(radio => {
	radio.addEventListener('change', handleRadioChange);
});

allowRadios.forEach(radio => {
	radio.addEventListener('change', handleRadioChange);
});
clearBtn.addEventListener('click', clearAll);

if (addMonthButton && addWeekButton) {
	addMonthButton.addEventListener('click', (event) => {
		event.preventDefault();
		if (dateOne.value && !dateTwo.value) {
			const currentDate = new Date(dateOne.value);
			currentDate.setMonth(currentDate.getMonth() + 1);
			dateTwo.value = formatDate(currentDate);
			setCalculatorResult(event);
		} else if (dateTwo.value && !dateOne.value) {
			const currentDate = new Date(dateTwo.value);
			currentDate.setMonth(currentDate.getMonth() + 1);
			dateOne.value = formatDate(currentDate);
			setCalculatorResult(event);
		}
	});

	addWeekButton.addEventListener('click', (event) => {
		event.preventDefault();
		if (dateTwo.value && !dateOne.value) {
			const currentDate = new Date(dateTwo.value);
			currentDate.setDate(currentDate.getDate() + 7);
			dateOne.value = formatDate(currentDate);
			setCalculatorResult(event);
		} else if (dateOne.value && !dateTwo.value) {
			const currentDate = new Date(dateOne.value);
			currentDate.setDate(currentDate.getDate() + 7);
			dateTwo.value = formatDate(currentDate);
			setCalculatorResult(event);
		}
	});
}

resultsList.style.display = "none";

function handleCheckboxChange() {
	if (dateOne.value && dateTwo.value) {
		setCalculatorResult(event);
	}
}

function formatDate(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function formatDateTwo(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${day}.${month}.${year}`;
}

function calculateWeekends(startDate, days) {
	let weekends = 0;
	for (let i = 0; i < days; i++) {
		const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay();
		if (day === 0 || day === 6) {
			weekends++;
		}
	}
	return weekends;
}

function calculateWeekdays(startDate, days) {
	let weekdays = 0;
	for (let i = 0; i < days; i++) {
		const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay();
		if (day >= 1 && day <= 5) {
			weekdays++;
		}
	}
	return weekdays;
}

function toggleText(event) {
	const checkbox = event.target;
	let label;
	if (checkbox === checkbox1) {
		label = checkbox1Label;
	} else if (checkbox === checkbox2) {
		label = checkbox2Label;
	}
	label.textContent = checkbox.checked ? 'Including' : 'No including';
}

function setCalculatorResult(event) {
	event.preventDefault();
	resultOutput.style.transform = "scale(1)";
	let firstDate = new Date(dateOne.value);
	let secondDate = new Date(dateTwo.value);

	if (checkbox1.checked) {
		firstDate = new Date(firstDate);
		firstDate.setDate(firstDate.getDate() + 1);
	}

	if (checkbox2.checked) {
		secondDate = new Date(secondDate);
		secondDate.setDate(secondDate.getDate() + 1);
	}

	if (isNaN(firstDate) || isNaN(secondDate)) {
		resultOutput.innerText = 'Invalid date input';
		return;
	}

	let timeDifference = secondDate - firstDate;
	let daysDifference = Math.abs(timeDifference / (1000 * 60 * 60 * 24));

	const checkedPreset = document.querySelector('.presets__radio input[name="radio-p"]:checked');
	const checkedAllow = document.querySelector('.allow__radio input[name="radio-allow"]:checked');

	let timeUnit = 'd.';

	if (checkedPreset && checkedPreset.id === 'p_radio_2') {
		daysDifference *= 24;
		timeUnit = 'h.';
	} else if (checkedPreset && checkedPreset.id === 'p_radio_3') {
		daysDifference *= 24 * 60;
		timeUnit = 'm.';
	} else if (checkedPreset && checkedPreset.id === 'p_radio_4') {
		daysDifference *= 24 * 60 * 60;
		timeUnit = 's.';
	}

	if (checkedAllow && checkedAllow.id === 'a_radio_1') {
		const totalDays = Math.ceil(daysDifference);
		const weekends = calculateWeekends(firstDate, totalDays);
		daysDifference -= weekends;
	} else if (checkedAllow && checkedAllow.id === 'a_radio_2') {
		const totalDays = Math.ceil(daysDifference);
		const weekdays = calculateWeekdays(firstDate, totalDays);
		daysDifference -= weekdays;
	}

	if (!isNaN(daysDifference)) {
		const formattedDaysDifference = daysDifference.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		resultOutput.innerText = `= ${formattedDaysDifference} ${timeUnit}`;

		// Проверяем, есть ли уже такой элемент в массиве savedObjects
		const existingObject = savedObjects.find(obj => obj.start === formatDateTwo(firstDate) && obj.end === formatDateTwo(secondDate) && obj.content === `${formattedDaysDifference} ${timeUnit}`);

		if (!existingObject) {
			generatorListresult(formatDateTwo(firstDate), formatDateTwo(secondDate), `${formattedDaysDifference} ${timeUnit}`);
		}
	} else {
		resultOutput.innerText = 'Calculation error';
	}
}

function handleRadioChange(event) {
	if (dateOne.value && dateTwo.value) {
		setCalculatorResult(event);
	}
}

if (resultsList.style.display === "none") {
	resultOutput.style.transform = "scale(2)";
}

function loadSavedItems() {
	const savedObjects = JSON.parse(localStorage.getItem('savedObjects')) || [];
	savedObjects.forEach(item => {
		generatorListresult(item.start, item.end, item.content);
	});
}

window.addEventListener('DOMContentLoaded', () => {
	loadSavedItems();
	itemsLoaded = true;
});

window.addEventListener('beforeunload', () => {
	localStorage.setItem('itemsLoaded', JSON.stringify(itemsLoaded));
});

function generatorListresult(start, end, content) {
	resultsList.style.display = "block";
	resultOutput.style.transform = "scale(1)";

	const liItem = document.createElement('li');
	liItem.classList.add('results__item', 'item-results');

	const startDiv = document.createElement('div');
	startDiv.classList.add('item-results__start');
	startDiv.textContent = start;

	const endDiv = document.createElement('div');
	endDiv.classList.add('item-results__end');
	endDiv.textContent = end;

	const contentDiv = document.createElement('div');
	contentDiv.classList.add('item-results__content');
	contentDiv.textContent = content;

	resultsUl.prepend(liItem);
	liItem.append(startDiv);
	liItem.append(endDiv);
	liItem.append(contentDiv);

	setRedBGForAWhile(liItem);
	const savedObjects = JSON.parse(localStorage.getItem('savedObjects')) || [];
	const existingObject = savedObjects.find(obj => obj.start === start && obj.end === end && obj.content === content);

	if (!existingObject) {
		savedObjects.unshift({ start, end, content });
		if (savedObjects.length > MAX_SAVED_OBJECTS) {
			savedObjects.pop();
		}
		localStorage.setItem('savedObjects', JSON.stringify(savedObjects));
	}
}

function setRedBGForAWhile(item) {
	function applyBorder(border) {
		return new Promise(resolve => {
			item.style.border = border;
			setTimeout(() => {
				item.style.border = '';
				resolve();
			}, 100);
		});
	}

	async function animateBorder() {
		await applyBorder('#CCEFD2 1px solid');
		await applyBorder('');
		await applyBorder('#CCEFD2 1px solid');

	}

	animateBorder();
}

function clearAll(event) {
	event.preventDefault()
	resultsUl.textContent = '';
	resultOutput.innerText = 'enter dates!';
	resultsList.style.display = "none";
	savedObjects.length = 0;
	localStorage.removeItem('savedObjects');
	dateOne.value = ''
	dateTwo.value = ''
}
