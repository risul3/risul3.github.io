(async function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // Determine section index path
    const parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // remove current page
    const indexUrl = "/" + parts.join("/") + "/index.html";

    const res = await fetch(indexUrl);
    if (!res.ok) return;

    const doc = new DOMParser().parseFromString(
      await res.text(),
      "text/html"
    );

    // Collect all article links from index page
    const links = [...doc.querySelectorAll("a[href$='.html']")]
      .filter(a => !a.getAttribute("href").includes("index.html"))
      .map(a => ({
        href: a.getAttribute("href"),
        text: a.textContent.replace(/[→←]/g, "").trim()
      }));

    if (links.length < 2) return;

    const current = location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(".html", "");

    const items = links
      .filter(l => l.href.replace(".html", "") !== current)
      .map(l => `<li><a href="${l.href}">${l.text}</a></li>`)
      .join("");

    container.innerHTML = `
      <section class="sibling-list">
        <h3>Other articles in this section</h3>
        <ul>
          ${items}
        </ul>
      </section>
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
