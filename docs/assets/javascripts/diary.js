document.addEventListener("DOMContentLoaded", function () {
  var repoUrl = document.documentElement.dataset.repoUrl;

  // --- サイトベースURL の検出 ---
  var siteUrl = document.documentElement.dataset.siteUrl || "";
  if (!siteUrl) {
    // canonical リンクと編集URLから推定
    var canonical = document.querySelector("link[rel=canonical]");
    var editBtnForBase = document.querySelector("a.md-content__button");
    if (canonical && editBtnForBase) {
      var bm = editBtnForBase.href.match(/\/edit\/main\/docs\/(.+\.md)$/);
      if (bm) {
        var docsPage = bm[1].replace(/\.md$/, "/");
        var canonHref = canonical.href;
        if (canonHref.endsWith(docsPage)) {
          siteUrl = canonHref.slice(0, canonHref.length - docsPage.length);
        } else if (docsPage === "index/") {
          siteUrl = canonHref.replace(/\/?$/, "/");
        }
      }
    }
    if (!siteUrl) siteUrl = window.location.origin + "/";
  }
  if (!siteUrl.endsWith("/")) siteUrl += "/";
  // 今日の日記 docs 相対パス
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");
  var diaryDocPath = "diary/" + year + "/" + month + "/" + day + ".md";

  // Pages の HEAD チェックで edit/new を自動判別して開く
  function openGitHubEdit(docPath, onBefore, onAfter) {
    if (!repoUrl) { if (onAfter) onAfter(); return; }
    var pageUrl = siteUrl + docPath.replace(/\.md$/i, "") + "/";
    if (onBefore) onBefore();
    fetch(pageUrl, { method: "HEAD" })
      .then(function (res) {
        var target = res.ok
          ? repoUrl.replace(/\/$/, "") + "/edit/main/docs/" + docPath
          : repoUrl.replace(/\/$/, "") + "/new/main?filename=docs/" + docPath;
        window.open(target, "_blank", "noopener,noreferrer");
      })
      .catch(function () {
        var target = repoUrl.replace(/\/$/, "") + "/new/main?filename=docs/" + docPath;
        window.open(target, "_blank", "noopener,noreferrer");
      })
      .finally(function () {
        if (onAfter) onAfter();
      });
  }

  // このページを編集 URL（MkDocs Material が生成した編集ボタンから取得）
  var editBtn = document.querySelector("a.md-content__button");
  var editUrl = editBtn ? editBtn.href : null;
  if (editBtn) editBtn.style.display = "none"; // FAB に統合するので非表示

  // Speed Dial FAB を構築
  var fab = document.createElement("div");
  fab.className = "diary-fab";

  var actions = [];
  if (editUrl) {
    actions.push({ url: editUrl, icon: "\uD83D\uDCDD", label: "\u3053\u306E\u30DA\u30FC\u30B8\u3092\u7DE8\u96C6" });
  }
  actions.push({ url: "#", icon: "\uD83D\uDDD3\uFE0F", label: "\u4ECA\u65E5\u306E\u65E5\u8A18\u3092\u66F8\u304F", id: "diary-fab-diary" });
  // パス指定ボタン（modal トリガー、id で後からイベント追加）
  actions.push({ url: "#", icon: "\uD83D\uDCC2", label: "\u30D1\u30B9\u3092\u6307\u5B9A\u3057\u3066\u7DE8\u96C6", id: "diary-fab-path" });

  var actionsHtml = actions.map(function (item) {
    return (
      '<a href="' + item.url + '"' +
      (item.url !== "#" ? ' target="_blank" rel="noopener noreferrer"' : '') +
      ' class="diary-fab__action"' +
      (item.id ? ' id="' + item.id + '"' : '') +
      ' data-tooltip="' + item.label + '">' +
      '<span aria-hidden="true">' + item.icon + '</span>' +
      '</a>'
    );
  }).join("");

  fab.innerHTML =
    '<div class="diary-fab__actions">' + actionsHtml + '</div>' +
    '<button class="diary-fab__main" aria-label="\u7DE8\u96C6\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83' +
    ' 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>' +
    '</svg>' +
    '</button>';

  document.body.appendChild(fab);

  // 今日の日記ボタン
  document.getElementById("diary-fab-diary").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    fab.classList.remove("diary-fab--open");
    openGitHubEdit(diaryDocPath);
  });

  // ===== パス指定モーダル =====
  var modal = document.createElement("div");
  modal.className = "diary-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML =
    '<div class="diary-modal__box" role="dialog" aria-modal="true" aria-label="\u30D1\u30B9\u3092\u6307\u5B9A\u3057\u3066\u7DE8\u96C6">' +
    '<p class="diary-modal__label">\u7DE8\u96C6\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u306E\u30D1\u30B9</p>' +
    '<input id="diary-modal-input" class="diary-modal__input" type="text"' +
    ' list="diary-modal-datalist"' +
    ' placeholder="path/to/file" autocomplete="off" spellcheck="false" />' +
    '<datalist id="diary-modal-datalist"></datalist>' +
    '<p class="diary-modal__hint">docs/ \u4EE5\u4E0B\u306E\u30D1\u30B9\uff08.md \u4E0D\u8981\uff09</p>' +
    '<div class="diary-modal__btns">' +
    '<button class="diary-modal__cancel">\u30AD\u30E3\u30F3\u30BB\u30EB</button>' +
    '<button class="diary-modal__submit">\u7DE8\u96C6\u3092\u958B\u304F</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var navPathsLoaded = false;
  function loadNavPaths() {
    if (navPathsLoaded) return;
    navPathsLoaded = true;
    var datalist = document.getElementById("diary-modal-datalist");
    var seen = {};
    document.querySelectorAll(".md-nav__link[href]").forEach(function (a) {
      var href = a.href;
      if (!href || href.indexOf("#") !== -1) return;
      if (!href.startsWith(siteUrl)) return;
      var path = href.slice(siteUrl.length).replace(/\/$/, "");
      if (path && !seen[path]) {
        seen[path] = true;
        var opt = document.createElement("option");
        opt.value = path;
        datalist.appendChild(opt);
      }
    });
  }

  function openModal() {
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("diary-modal--open");
    loadNavPaths();
    var input = modal.querySelector("#diary-modal-input");
    input.value = "";
    setTimeout(function () { input.focus(); }, 50);
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("diary-modal--open");
  }

  function submitModal() {
    var input = modal.querySelector("#diary-modal-input");
    var submitBtn = modal.querySelector(".diary-modal__submit");
    var path = input.value.trim().replace(/^\//, "");
    if (!path) return;
    if (!/\.md$/i.test(path)) path += ".md"; // .md を自動付与
    if (!repoUrl) { closeModal(); return; }
    openGitHubEdit(
      path,
      function () { submitBtn.disabled = true; submitBtn.textContent = "\u78BA\u8A8D\u4E2D\u2026"; },
      function () { submitBtn.disabled = false; submitBtn.textContent = "\u7DE8\u96C6\u3092\u958B\u304F"; closeModal(); }
    );
  }

  document.getElementById("diary-fab-path").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    fab.classList.remove("diary-fab--open");
    openModal();
  });

  modal.querySelector(".diary-modal__cancel").addEventListener("click", closeModal);
  modal.querySelector(".diary-modal__submit").addEventListener("click", submitModal);

  modal.querySelector("#diary-modal-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitModal();
    if (e.key === "Escape") closeModal();
  });

  // \u30d0\u30c3\u30af\u30c9\u30ed\u30c3\u30d7\u30af\u30ea\u30c3\u30af\u3067\u9589\u3058\u308b
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  var mainBtn = fab.querySelector(".diary-fab__main");
  mainBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    fab.classList.toggle("diary-fab--open");
  });

  document.addEventListener("click", function () {
    fab.classList.remove("diary-fab--open");
  });
});
