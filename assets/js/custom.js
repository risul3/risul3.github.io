(function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // Example: /fintech/payment-systems.html
    const path = window.location.pathname;

    // Section index: /fintech/index.html
    const sectionIndex = path.replace(/[^/]+$/, "index.html");

    fetch(sectionIndex)
      .then(res => {
        if (!res.ok) throw new Error("Index not found");
        return res.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        // Collect article links from index page
        const links = [...doc.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href =>
            href &&
            href.endsWith(".html") &&
            href !== "index.html"
          );

        if (links.length < 2) return;

        const current = path.split("/").pop();

        const items = links
          .filter(href => href !== current)
          .map(href => {
            const title = href
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
