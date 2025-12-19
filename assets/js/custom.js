(function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // Determine section path (e.g. /fintech/)
    const parts = location.pathname.split("/").filter(Boolean);
    const section = "/" + parts[0] + "/";

    // Fetch section index
    const indexUrl = section + "index.html";

    fetch(indexUrl)
      .then(res => {
        if (!res.ok) throw new Error("Index not found");
        return res.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        // Collect links inside this section only
        const links = [...doc.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href =>
            href &&
            href.startsWith(section) &&
            href !== section &&
            !href.endsWith("/index/")
          );

        if (links.length < 2) return;

        const current = location.pathname.replace(/\/$/, "");

        const items = links
          .filter(href => href.replace(/\/$/, "") !== current)
          .map(href => {
            const title = href
              .split("/")
              .filter(Boolean)
              .pop()
              .replace(/-/g, " ");
            return `<li><a href="${href}">${title}</a></li>`;
          })
          .join("");

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
