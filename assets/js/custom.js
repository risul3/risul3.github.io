(function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // Current URL parts
    const pathParts = window.location.pathname
      .split("/")
      .filter(Boolean);

    // Remove current page (e.g. payment-systems.html)
    pathParts.pop();

    // Build section index URL (e.g. /fintech/index.html)
    const indexUrl = "/" + pathParts.join("/") + "/index.html";

    fetch(indexUrl)
      .then(res => {
        if (!res.ok) throw new Error("Index not found");
        return res.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        // Collect ONLY article links (your files)
        const links = [...doc.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href =>
            href &&
            href.endsWith(".html") &&
            href !== "index.html"
          );

        if (links.length < 2) return;

        const current = window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          .replace(".html", "");

        const items = links
          .filter(h => h.replace(".html", "") !== current)
          .map(h => `<li><a href="${h}">${h.replace(".html", "").replace(/-/g, " ")}</a></li>`)
          .join("");

        if (!items) return;

        container.innerHTML = `
          <section class="sibling-list">
            <h3>Other articles in this section</h3>
            <ul>
              ${items}
            </ul>
          </section>
        `;
      })
      .catch(() => {});
  } catch (_) {}
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
