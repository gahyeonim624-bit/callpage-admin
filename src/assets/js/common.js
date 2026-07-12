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

document.addEventListener("input", function (e) {
  if (!e.target.matches(".create-input")) return;

  var field = e.target.closest(".create-field");
  if (!field) return;

  var counter = field.querySelector(".create-counter-current");
  if (!counter) return;

  counter.textContent = e.target.value.length;
});

document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (!e.target.matches(".create-input")) return;

  e.preventDefault();
});

(function () {
  var active = document.body.dataset.navActive;
  if (!active) return;

  var item = document.querySelector('.layout-nav-item[data-nav="' + active + '"]');
  if (!item) return;

  item.classList.add("active");
})();

(function () {
  var header = document.querySelector(".layout-header");
  if (!header) return;

  function updateHeaderBg() {
    header.classList.toggle("is-scrolled", window.scrollY > 0);
  }

  updateHeaderBg();
  window.addEventListener("scroll", updateHeaderBg, { passive: true });
})();

(function () {
  var addBtn = document.getElementById("preqAddBtn");
  var card = document.getElementById("preqCard");
  var list = document.getElementById("preqList");
  var itemTpl = document.getElementById("preqItemTemplate");
  var optionTpl = document.getElementById("preqOptionTemplate");
  if (!addBtn || !card || !list || !itemTpl || !optionTpl) return;

  function renumber() {
    list.querySelectorAll(".preq-item").forEach(function (item, i) {
      item.querySelector(".preq-index").textContent = i + 1;
    });
  }

  function addOptionRow(optionList) {
    optionList.appendChild(optionTpl.content.cloneNode(true));
  }

  function addQuestion() {
    var node = itemTpl.content.cloneNode(true);
    var item = node.querySelector(".preq-item");
    addOptionRow(item.querySelector(".preq-option-list"));
    list.appendChild(item);
    renumber();
  }

  addBtn.addEventListener("click", addQuestion);

  list.addEventListener("click", function (e) {
    var removeBtn = e.target.closest(".preq-remove");
    if (removeBtn) {
      var item = removeBtn.closest(".preq-item");
      if (item) {
        item.remove();
        renumber();
      }
      return;
    }

    var typeBtn = e.target.closest(".preq-type-btn");
    if (typeBtn) {
      var toggle = typeBtn.closest(".preq-type-toggle");
      toggle.querySelectorAll(".preq-type-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn === typeBtn);
      });

      var question = typeBtn.closest(".preq-item");
      var isText = typeBtn.dataset.type === "text";
      question.querySelector(".preq-answer-example").hidden = !isText;
      question.querySelector(".preq-options").hidden = isText;
      return;
    }

    var optionAddBtn = e.target.closest(".preq-option-add");
    if (optionAddBtn) {
      addOptionRow(optionAddBtn.closest(".preq-options").querySelector(".preq-option-list"));
      return;
    }

    var optionRemoveBtn = e.target.closest(".preq-option-remove");
    if (optionRemoveBtn) {
      var row = optionRemoveBtn.closest(".preq-option-row");
      var rowList = optionRemoveBtn.closest(".preq-option-list");
      if (row && rowList.children.length > 1) {
        row.remove();
      }
      return;
    }
  });
})();

(function () {
  var addBtn = document.getElementById("adAddBtn");
  var list = document.getElementById("adList");
  var itemTpl = document.getElementById("adItemTemplate");
  if (!addBtn || !list || !itemTpl) return;

  function renumber() {
    list.querySelectorAll(".ad-item").forEach(function (item, i) {
      item.querySelector(".ad-index").textContent = i + 1;
    });
  }

  addBtn.addEventListener("click", function () {
    var node = itemTpl.content.cloneNode(true);
    list.appendChild(node);
    renumber();
  });

  list.addEventListener("click", function (e) {
    var removeBtn = e.target.closest(".ad-remove");
    if (!removeBtn) return;

    var item = removeBtn.closest(".ad-item");
    if (item) {
      item.remove();
      renumber();
    }
  });
})();

document.addEventListener("click", function (e) {
  var btn = e.target.closest(".copy-btn");
  if (!btn) return;

  var wrap = btn.closest(".create-field-copy");
  var input = wrap && wrap.querySelector("input");
  if (!input) return;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(input.value);
  }
});

document.addEventListener("change", function (e) {
  if (!e.target.matches(".ad-channel-select")) return;

  var group = e.target.closest(".create-field-group");
  var customField = group && group.querySelector(".ad-channel-custom");
  if (!customField) return;

  customField.hidden = e.target.value !== "custom";
});
