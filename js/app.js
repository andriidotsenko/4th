(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    const tabsBtn = document.querySelectorAll(".tabs__nav-btn");
    const tabsItems = document.querySelectorAll(".tabs__item");
    tabsBtn.forEach(onTabClick);
    function onTabClick(item) {
        item.addEventListener("click", (() => {
            let currentBtn = item;
            let tabId = currentBtn.getAttribute("data-tab");
            let currentTab = document.querySelector(tabId);
            let currentTytle = `4TH - ${currentBtn.innerText}`;
            if (!currentBtn.classList.contains("active")) {
                tabsBtn.forEach((item => {
                    item.classList.remove("active");
                }));
                tabsItems.forEach((item => {
                    item.classList.remove("active");
                }));
                currentBtn.classList.add("active");
                currentTab.classList.add("active");
                document.title = currentTytle;
            }
        }));
    }
    document.querySelectorAll(".tabs__nav-btn")[0].click();
    const resultOutput = document.querySelector(".result__outputs");
    const formCalculator = document.querySelector(".tab-calculator__form");
    const dateOne = document.querySelectorAll(".datepicker__input")[0];
    const dateTwo = document.querySelectorAll(".datepicker__input")[1];
    const checkbox1 = document.getElementById("checkbox_1");
    const checkbox1Label = document.querySelector(".input-from__checkbox .checkbox__inner");
    const checkbox2 = document.getElementById("checkbox_2");
    const checkbox2Label = document.querySelector(".input-to__checkbox .checkbox__inner");
    checkbox1Label.textContent = checkbox1.checked ? "Including" : "No including";
    checkbox2Label.textContent = checkbox2.checked ? "Including" : "No including";
    formCalculator.addEventListener("submit", setCalculatorResult);
    checkbox1.addEventListener("change", toggleText);
    checkbox2.addEventListener("change", toggleText);
    checkbox1.addEventListener("change", handleCheckboxChange);
    checkbox2.addEventListener("change", handleCheckboxChange);
    function handleCheckboxChange() {
        if (dateOne.value && dateTwo.value) setCalculatorResult(event);
    }
    function setCalculatorResult(event) {
        event.preventDefault();
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
            resultOutput.innerText = "Invalid date input";
            return;
        }
        let timeDifference = secondDate - firstDate;
        let daysDifference = Math.abs(timeDifference / (1e3 * 60 * 60 * 24));
        const checkedPreset = document.querySelector('.presets__radio input[name="radio-p"]:checked');
        const checkedAllow = document.querySelector('.allow__radio input[name="radio-allow"]:checked');
        let timeUnit = "d.";
        if (checkedPreset && checkedPreset.id === "p_radio_2") {
            daysDifference *= 24;
            timeUnit = "h.";
        } else if (checkedPreset && checkedPreset.id === "p_radio_3") {
            daysDifference *= 24 * 60;
            timeUnit = "m.";
        } else if (checkedPreset && checkedPreset.id === "p_radio_4") {
            daysDifference *= 24 * 60 * 60;
            timeUnit = "s.";
        }
        if (checkedAllow && checkedAllow.id === "a_radio_1") {
            const totalDays = Math.ceil(daysDifference);
            const weekends = calculateWeekends(firstDate, totalDays);
            daysDifference -= weekends;
        } else if (checkedAllow && checkedAllow.id === "a_radio_2") {
            const totalDays = Math.ceil(daysDifference);
            const weekdays = calculateWeekdays(firstDate, totalDays);
            daysDifference -= weekdays;
        }
        if (!isNaN(daysDifference)) {
            const formattedDaysDifference = daysDifference.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            resultOutput.innerText = `= ${formattedDaysDifference} ${timeUnit}`;
        } else resultOutput.innerText = "Calculation error";
    }
    const addMonthButton = document.querySelector('.actions__item[data-preset="month"]');
    const addWeekButton = document.querySelector('.actions__item[data-preset="week"]');
    if (addMonthButton && addWeekButton) {
        addMonthButton.addEventListener("click", (event => {
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
        }));
        addWeekButton.addEventListener("click", (event => {
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
        }));
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    function calculateWeekends(startDate, days) {
        let weekends = 0;
        for (let i = 0; i < days; i++) {
            const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1e3).getDay();
            if (day === 0 || day === 6) weekends++;
        }
        return weekends;
    }
    function calculateWeekdays(startDate, days) {
        let weekdays = 0;
        for (let i = 0; i < days; i++) {
            const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1e3).getDay();
            if (day >= 1 && day <= 5) weekdays++;
        }
        return weekdays;
    }
    resultOutput.innerText = "enter dates!";
    function toggleText(event) {
        const checkbox = event.target;
        let label;
        if (checkbox === checkbox1) label = checkbox1Label; else if (checkbox === checkbox2) label = checkbox2Label;
        label.textContent = checkbox.checked ? "Including" : "No including";
    }
    const presetsRadios = document.querySelectorAll('.presets__radio input[name="radio-p"]');
    const allowRadios = document.querySelectorAll('.allow__radio input[name="radio-allow"]');
    presetsRadios.forEach((radio => {
        radio.addEventListener("change", handleRadioChange);
    }));
    allowRadios.forEach((radio => {
        radio.addEventListener("change", handleRadioChange);
    }));
    function handleRadioChange(event) {
        if (dateOne.value && dateTwo.value) setCalculatorResult(event);
    }
    isWebp();
})();