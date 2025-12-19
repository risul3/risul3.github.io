(async function () {
  const container = document.getElementById("sibling-nav");
  if (!container) return;

  try {
    const parts = location.pathname.split("/").filter(Boolean);
    parts.pop();
    const indexUrl = "/" + parts.join("/") + "/index.html";

    const res = await fetch(indexUrl);
    if (!res.ok) return;

    const doc = new DOMParser().parseFromString(await res.text(), "text/html");

    const links = [...doc.querySelectorAll("a[href$='.html']")]
      .filter(a => !a.getAttribute("href").includes("index.html"))
      .map(a => ({
        href: a.getAttribute("href"),
        text: a.textContent.replace(/[→←]/g, "").trim()
      }));

    const current = location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(".html", "");

    const idx = links.findIndex(l =>
      l.href.replace(".html", "") === current
    );

    if (idx === -1) return;

    const prev = links[idx - 1];
    const next = links[idx + 1];

    container.innerHTML = `
      <nav class="sibling-nav">
        <div>${prev ? `← <a href="${prev.href}">${prev.text}</a>` : ""}</div>
        <div>${next ? `<a href="${next.href}">${next.text}</a> →` : ""}</div>
      </nav>
    `;
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
