(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    // Determine section path safely
    const parts = location.pathname.split("/").filter(Boolean);

    // Remove current page (file or directory)
    parts.pop();

    // Build section index URL
    const sectionIndex = "/" + parts.join("/") + "/index.html";

    const res = await fetch(sectionIndex);
    if (!res.ok) return;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Collect all article links from the index page
    const links = [...doc.querySelectorAll("a")]
      .map(a => a.getAttribute("href"))
      .filter(href =>
        href &&
        href.endsWith(".html") &&
        href !== "index.html"
      );

    if (!links.length) return;

    // Normalize current page name
    const current = location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(".html", "");

    const normalized = links.map(href =>
      href.replace(".html", "")
    );

    const index = normalized.indexOf(current);
    if (index === -1) return;

    const prev = links[index - 1];
    const next = links[index + 1];

    container.innerHTML = `
      <nav class="sibling-nav">
        <div>
          ${prev ? `← <a href="${prev}">Previous</a>` : ""}
        </div>
        <div>
          ${next ? `<a href="${next}">Next</a> →` : ""}
        </div>
      </nav>
    `;
  } catch (e) {
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
