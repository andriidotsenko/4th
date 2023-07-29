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
    document.querySelectorAll(".tabs__nav-btn")[1].click();
    isWebp();
})();