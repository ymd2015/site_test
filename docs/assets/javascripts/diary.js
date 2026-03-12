document.addEventListener("DOMContentLoaded", function () {
  var tabsList = document.querySelector(".md-tabs__list");
  if (!tabsList) return;

  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");

  var repoUrl = document.documentElement.dataset.repoUrl;
  var url = repoUrl
    ? repoUrl.replace(/\/$/, "") + "/edit/main/docs/" + year + "/" + month + "/" + day + ".md"
    : "#";

  var li = document.createElement("li");
  li.className = "md-tabs__item diary-tab-item";

  var a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "md-tabs__link";
  a.textContent = "\u270F\uFE0F \u4ECA\u65E5\u306E\u65E5\u8A18\u3092\u66F8\u304F";

  li.appendChild(a);
  tabsList.appendChild(li);
});
