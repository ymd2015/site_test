document.addEventListener("DOMContentLoaded", function () {
  var repoUrl = document.documentElement.dataset.repoUrl;

  // 今日の日記 URL
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");
  var diaryUrl = repoUrl
    ? repoUrl.replace(/\/$/, "") + "/edit/main/docs/" + year + "/" + month + "/" + day + ".md"
    : "#";

  // このページを編集 URL（MkDocs Material が生成した編集ボタンから取得）
  var editBtn = document.querySelector("a.md-content__button");
  var editUrl = editBtn ? editBtn.href : null;
  if (editBtn) editBtn.style.display = "none"; // FAB に統合するので非表示

  // Speed Dial FAB を構築
  var fab = document.createElement("div");
  fab.className = "diary-fab";

  var actions = [
    { url: diaryUrl, icon: "\uD83D\uDDD3\uFE0F", label: "\u4ECA\u65E5\u306E\u65E5\u8A18\u3092\u66F8\u304F" },
  ];
  if (editUrl) {
    actions.push({ url: editUrl, icon: "\uD83D\uDCDD", label: "\u3053\u306E\u30DA\u30FC\u30B8\u3092\u7DE8\u96C6" });
  }

  var actionsHtml = actions.map(function (item) {
    return (
      '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="diary-fab__action" data-tooltip="' + item.label + '">' +
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

  var mainBtn = fab.querySelector(".diary-fab__main");
  mainBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    fab.classList.toggle("diary-fab--open");
  });

  document.addEventListener("click", function () {
    fab.classList.remove("diary-fab--open");
  });
});
