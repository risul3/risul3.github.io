(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    // Resolve section index path
    const parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // remove current page
    const sectionIndex = "/" + parts.join("/") + "/index.html";

    const res = await fetch(sectionIndex);
    if (!res.ok) return;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // 1️⃣ Find the "Articles Overview" heading
    const heading = [...doc.querySelectorAll("h2, h3")]
      .find(h =>
        h.textContent.toLowerCase().includes("articles")
      );

    if (!heading) return;

    // 2️⃣ Collect links UNTIL next heading of same level
    const links = [];
    let el = heading.nextElementSibling;

    while (el && !/^H[23]$/.test(el.tagName)) {
      if (el.tagName === "P") {
        const a = el.querySelector("a[href$='.html']");
        if (a) {
          links.push({
            href: a.getAttribute("href"),
            text: a.textContent.replace("→", "").trim()
          });
        }
      }
      el = el.nextElementSibling;
    }

    if (links.length < 2) return;

    // 3️⃣ Normalize current page name
    const current = location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(".html", "");

    const index = links.findIndex(l =>
      l.href.replace(".html", "") === current
    );

    if (index === -1) return;

    const prev = links[index - 1];
    const next = links[index + 1];

    // 4️⃣ Render navigation
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
