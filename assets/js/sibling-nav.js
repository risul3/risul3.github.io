(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    // Always load the section index
    const res = await fetch("./index.html");
    if (!res.ok) return;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Collect article links from index page
    const links = [...doc.querySelectorAll("a")]
      .map(a => a.getAttribute("href"))
      .filter(href =>
        href &&
        href.endsWith(".html") &&
        href !== "index.html"
      );

    if (links.length === 0) return;

    // Normalize current page name safely
    const segments = location.pathname
      .split("/")
      .filter(Boolean); // removes empty segments

    let current = segments[segments.length - 1] || "";
    current = current.replace(".html", "");

    // Normalize links
    const normalizedLinks = links.map(href =>
      href.replace(".html", "")
    );

    const index = normalizedLinks.indexOf(current);
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
