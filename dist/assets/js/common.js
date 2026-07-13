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

document.addEventListener("click", function (e) {
  var toggle = e.target.closest(".consultation-filter-toggle");
  if (!toggle) return;

  var body = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!body) return;

  var expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", !expanded);
  body.hidden = expanded;
});

document.addEventListener("click", function (e) {
  var pill = e.target.closest(".consultation-pill");
  if (!pill) return;

  var group = pill.closest(".consultation-pill-group");
  if (!group) return;

  group.querySelectorAll(".consultation-pill").forEach(function (el) {
    el.classList.toggle("active", el === pill);
  });
});

document.addEventListener("click", function (e) {
  var btn = e.target.closest(".status-toggle-btn");
  if (!btn) return;

  var toggle = btn.closest(".status-toggle");
  if (!toggle) return;

  toggle.querySelectorAll(".status-toggle-btn").forEach(function (el) {
    el.classList.toggle("active", el === btn);
  });

  var row = toggle.closest(".consultation-card-row");
  var statusEl = row && row.querySelector(".consultation-status");
  if (!statusEl) return;

  var isDone = btn.textContent.trim() === "완료";
  statusEl.textContent = isDone ? "완료" : "미완료";
  statusEl.classList.toggle("consultation-status--done", isDone);
  statusEl.classList.toggle("consultation-status--undone", !isDone);
});

(function () {
  var picker = document.getElementById("datepicker");
  if (!picker) return;

  var title = picker.querySelector(".datepicker-title");
  var grid = picker.querySelector(".datepicker-grid");
  var prevBtn = picker.querySelector(".datepicker-prev");
  var nextBtn = picker.querySelector(".datepicker-next");
  var activeInput = null;
  var viewYear, viewMonth;

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function formatDate(y, m, d) {
    return y + "." + pad(m + 1) + "." + pad(d);
  }

  function parseValue(value) {
    var parts = value.split(".");
    if (parts.length === 3) {
      return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10) - 1, d: parseInt(parts[2], 10) };
    }
    var now = new Date();
    return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  }

  function render() {
    title.textContent = viewYear + "년 " + (viewMonth + 1) + "월";
    grid.innerHTML = "";

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var selected = activeInput ? parseValue(activeInput.value) : null;

    for (var i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("span"));
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "datepicker-day";
      btn.textContent = d;
      if (selected && selected.y === viewYear && selected.m === viewMonth && selected.d === d) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", (function (day) {
        return function () {
          if (activeInput) {
            activeInput.value = formatDate(viewYear, viewMonth, day);
          }
          hide();
        };
      })(d));
      grid.appendChild(btn);
    }
  }

  function show(input) {
    activeInput = input;
    var parsed = parseValue(input.value);
    viewYear = parsed.y;
    viewMonth = parsed.m;
    render();
    picker.hidden = false;
  }

  function hide() {
    picker.hidden = true;
    activeInput = null;
  }

  document.addEventListener("click", function (e) {
    var field = e.target.closest(".consultation-date-field");
    if (field) {
      var input = field.querySelector("input");
      if (input) show(input);
      return;
    }

    if (!picker.hidden && !e.target.closest(".datepicker")) {
      hide();
    }
  });

  prevBtn.addEventListener("click", function () {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    render();
  });

  nextBtn.addEventListener("click", function () {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    render();
  });
})();

(function () {
  var pushEl = document.getElementById("pushNotiModal");
  var consultEl = document.getElementById("consultNotiModal");
  if (typeof bootstrap === "undefined") return;

  if (pushEl) {
    var pushModal = new bootstrap.Modal(pushEl);
    setTimeout(function () {
      pushModal.show();
    }, 1000);

    if (consultEl) {
      var consultModal = new bootstrap.Modal(consultEl);
      pushEl.addEventListener("hidden.bs.modal", function () {
        setTimeout(function () {
          consultModal.show();
        }, 500);
      });
    }
  } else if (consultEl) {
    new bootstrap.Modal(consultEl).show();
  }
})();

(function () {
  var card = document.querySelector(".sign-card");
  if (!card) return;

  var allCheckbox = card.querySelector(".agree-all input");
  var itemCheckboxes = card.querySelectorAll(".agree-row input");
  if (!allCheckbox || !itemCheckboxes.length) return;

  allCheckbox.addEventListener("change", function () {
    itemCheckboxes.forEach(function (cb) {
      cb.checked = allCheckbox.checked;
    });
  });

  itemCheckboxes.forEach(function (cb) {
    cb.addEventListener("change", function () {
      allCheckbox.checked = Array.prototype.every.call(itemCheckboxes, function (el) {
        return el.checked;
      });
    });
  });
})();

(function () {
  var timerEl = document.getElementById("authTimer");
  if (!timerEl) return;

  var retryBtn = document.querySelector(".auth-retry-btn");
  var seconds = 39;
  var interval = null;

  function render() {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    timerEl.textContent = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  function tick() {
    seconds--;
    if (seconds < 0) {
      clearInterval(interval);
      return;
    }
    render();
  }

  function start() {
    seconds = 39;
    render();
    clearInterval(interval);
    interval = setInterval(tick, 1000);
  }

  start();

  if (retryBtn) {
    retryBtn.addEventListener("click", start);
  }
})();
