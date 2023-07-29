const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownBtn.addEventListener("click", function() {
  dropdownMenu.classList.toggle("show");
});