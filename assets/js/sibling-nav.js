(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    // Load section index
    const res = await fetch("./index.html");
    if (!res.ok) return;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Collect all article links (relative .html links, excluding index)
    const links = [...doc.querySelectorAll("a")]
      .map(a => ({
        href: a.getAttribute("href"),
        text: a.textContent.trim()
      }))
      .filter(l =>
        l.href &&
        l.href.endsWith(".html") &&
        l.href !== "index.html"
      );

    if (links.length === 0) return;

    const current = location.pathname.split("/").pop();
    const index = links.findIndex(l => l.href.endsWith(current));
    if (index === -1) return;

    const prev = links[index - 1];
    const next = links[index + 1];

    container.innerHTML = `
      <nav class="sibling-nav">
        <div>
          ${prev ? `← <a href="${prev.href}">${prev.text}</a>` : ""}
        </div>
        <div>
          ${next ? `<a href="${next.href}">${next.text}</a> →` : ""}
        </div>
      </nav>
    `;
  } catch (_) {
    // fail silently
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
