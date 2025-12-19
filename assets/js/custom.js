(function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // Current page: /fintech/payment-systems.html
    const currentPath = window.location.pathname;

    // Section index: /fintech/index.html
    const sectionIndex = currentPath.replace(/[^/]+$/, "index.html");

    fetch(sectionIndex)
      .then(res => {
        if (!res.ok) throw new Error("Index not found");
        return res.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        // Base path, e.g. /fintech/
        const basePath = sectionIndex.replace("index.html", "");

        // Collect article links from index page
        const links = [...doc.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href =>
            href &&
            href.endsWith(".html") &&
            href !== "index.html" &&
            href !== "./index.html" &&
            href !== "../index.html"
          )
          // Convert to absolute paths
          .map(href => basePath + href);

        if (links.length < 2) return;

        const items = links
          .filter(href => href !== currentPath)
          .map(href => {
            const title = href
              .split("/")
              .pop()
              .replace(".html", "")
              .replace(/-/g, " ");
            return `<li><a href="${href}">${title}</a></li>`;
          })
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
