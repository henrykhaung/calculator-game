document.querySelector(".menu li").addEventListener("mouseover", function () {
    document.getElementById("menu").textContent = "Close";
});

document.querySelector(".menu li").addEventListener("mouseout", function () {
    document.getElementById("menu").textContent = "Menu";
});
