(async function () {
  const navContainer = document.getElementById("sibling-nav");
  if (!navContainer) return;

  try {
    // Fetch the section index page
    const response = await fetch("./index.html");
    if (!response.ok) return;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Find links under the Contents section
    const contentsHeader = [...doc.querySelectorAll("h2, h3")]
      .find(h => h.textContent.trim().toLowerCase() === "contents");

    if (!contentsHeader) return;

    let list = contentsHeader.nextElementSibling;
    if (!list || list.tagName !== "UL") return;

    const links = [...list.querySelectorAll("a")]
      .map(a => ({
        href: a.getAttribute("href"),
        text: a.textContent.trim()
      }));

    const current = location.pathname.split("/").pop();
    const index = links.findIndex(l => l.href.endsWith(current));
    if (index === -1) return;

    const prev = links[index - 1];
    const next = links[index + 1];

    navContainer.innerHTML = `
      <hr />
      <nav class="sibling-nav">
        <div>
          ${prev ? `← <a href="${prev.href}">${prev.text}</a>` : ""}
        </div>
        <div>
          ${next ? `<a href="${next.href}">${next.text}</a> →` : ""}
        </div>
      </nav>
    `;
  } catch (e) {
    // Fail silently — content must still work without JS
  }
})();
