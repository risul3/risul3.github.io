(async function () {
  const container = document.getElementById("sibling-list");
  if (!container) return;

  try {
    // 1️⃣ Determine section index path robustly
    const parts = location.pathname.split("/").filter(Boolean);

    // Remove current page (file or directory)
    parts.pop();

    // Build absolute section index URL
    const indexUrl = "/" + parts.join("/") + "/index.html";

    const res = await fetch(indexUrl);
    if (!res.ok) return;

    const doc = new DOMParser().parseFromString(
      await res.text(),
      "text/html"
    );

    // 2️⃣ Collect article links from index page
    const links = [...doc.querySelectorAll("a[href$='.html']")]
      .filter(a => !a.getAttribute("href").includes("index.html"))
      .map(a => ({
        href: a.getAttribute("href"),
        text: a.textContent.replace(/[→←]/g, "").trim()
      }));

    if (links.length < 2) return;

    // 3️⃣ Normalize current page name
    const current = location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(".html", "");

    // 4️⃣ Exclude current page from list
    const items = links
      .filter(l => l.href.replace(".html", "") !== current)
      .map(l => `<li><a href="${l.href}">${l.text}</a></li>`)
      .join("");

    if (!items) return;

    // 5️⃣ Render sibling list
    container.innerHTML = `
      <section class="sibling-list">
        <h3>Other articles in this section</h3>
        <ul>
          ${items}
        </ul>
      </section>
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
