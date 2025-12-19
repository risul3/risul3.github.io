(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    const res = await fetch("./index.html");
    if (!res.ok) return;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const header = [...doc.querySelectorAll("h2, h3")]
      .find(h => h.textContent.trim().toLowerCase() === "contents");

    if (!header) return;

    const list = header.nextElementSibling;
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

    container.innerHTML = `
      <nav class="sibling-nav">
        <div>${prev ? `← <a href="${prev.href}">${prev.text}</a>` : ""}</div>
        <div>${next ? `<a href="${next.href}">${next.text}</a> →` : ""}</div>
      </nav>
    `;
  } catch (_) {
    // Fail silently
  }
})();

(function () {
  const el = document.getElementById("breadcrumbs");
  if (!el) return;

  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return;

  let path = "/";
  const crumbs = parts.slice(0, -1).map(p => {
    path += p + "/";
    return `<a href="${path}">${p}</a>`;
  });

  el.innerHTML = `Home → ${crumbs.join(" → ")}`;
})();
