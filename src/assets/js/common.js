document.addEventListener("click", function (e) {
  var btn = e.target.closest(".header-toggle-btn");
  if (!btn) return;

  var group = btn.closest(".header-toggle");
  if (!group) return;

  group.querySelectorAll(".header-toggle-btn").forEach(function (el) {
    el.classList.toggle("active", el === btn);
    el.setAttribute("aria-selected", el === btn ? "true" : "false");
  });
});
