(() => {
  "use strict";

  const state = { site:null, pubs:[], projects:[], funding:[], books:[], lang:null, tracks:new Map(), page:1, filters:{year:"",type:"",track:"",q:""}, charts:[] };
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  /* ---- profile icons: id -> 24x24 SVG path data (currentColor) ---- */
  const PROFILE_ICONS = {
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    orcid: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z",
    github: "M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.204.084 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.93 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.624-5.48 5.92.43.372.823 1.104.823 2.226 0 1.606-.015 2.902-.015 3.297 0 .32.19.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z",
    discord: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
  };

  /* ---- language resolver: every user-facing string goes through this ---- */
  function t(v){
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v !== "object") return String(v);
    return v[state.lang] ?? v[state.site?.meta?.defaultLanguage] ?? v[Object.keys(v)[0]] ?? "";
  }

  /* ---- date adapter: the only place dates are parsed ---- */
  function yearOf(value){
    if (value == null) return null;
    if (typeof value === "object" && Array.isArray(value["date-parts"])) {
      const y = value["date-parts"]?.[0]?.[0];
      return Number.isFinite(+y) ? +y : null;
    }
    const m = String(value).match(/\d{4}/);
    return m ? +m[0] : null;
  }

  /* ---- live counter source: GitHub public repo count ---- */
  async function fetchGithubRepoCount(username){
    try {
      const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers:{ Accept:"application/vnd.github+json" } });
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();
      return Number.isFinite(data.public_repos) ? data.public_repos : null;
    } catch (e) { console.error("[github]", e); return null; }
  }

  function trackOf(id){
    if (!state.tracks.has(id)) { console.warn(`[data] unknown track id: ${id}`); return null; }
    return state.tracks.get(id);
  }
  function tracksOf(list){ return (list || []).map(trackOf).filter(Boolean); }

  /* ---- boot ---- */
  async function boot(){
    let site, pubs = [], pubsFailed = false;
    try {
      const r = await fetch("data/site.json", { cache:"no-cache" });
      if (!r.ok) throw new Error(r.status);
      site = await r.json();
    } catch (e) {
      document.getElementById("noscript-fallback")?.removeAttribute("hidden");
      const f = $("fatal"); f.hidden = false;
      f.textContent = "Could not load data/site.json. Serve this page over HTTP, not from the file system.";
      console.error(e); return;
    }
    try {
      const r = await fetch(site.publications?.source || "data/publications.json", { cache:"no-cache" });
      if (!r.ok) throw new Error(r.status);
      state.pubsUpdated = r.headers.get("last-modified");
      pubs = await r.json();
    } catch (e) { pubsFailed = true; console.error(e); }

    let projects = [], projectsFailed = false;
    try {
      const r = await fetch(site.projects?.source || "data/projects.json", { cache:"no-cache" });
      if (!r.ok) throw new Error(r.status);
      projects = await r.json();
    } catch (e) { projectsFailed = true; console.error(e); }

    let funding = [], fundingFailed = false;
    try {
      const r = await fetch(site.funding?.source || "data/funding.json", { cache:"no-cache" });
      if (!r.ok) throw new Error(r.status);
      funding = await r.json();
    } catch (e) { fundingFailed = true; console.error(e); }

    let books = [], booksFailed = false;
    try {
      const r = await fetch(site.books?.source || "data/books.json", { cache:"no-cache" });
      if (!r.ok) throw new Error(r.status);
      books = await r.json();
    } catch (e) { booksFailed = true; console.error(e); }

    state.site = site;
    state.pubs = Array.isArray(pubs) ? pubs : [];
    state.pubsFailed = pubsFailed;
    state.projects = Array.isArray(projects) ? projects : [];
    state.projectsFailed = projectsFailed;
    state.funding = Array.isArray(funding) ? funding : [];
    state.fundingFailed = fundingFailed;
    state.books = Array.isArray(books) ? books : [];
    state.booksFailed = booksFailed;
    state.lang = pickLang(site);
    (site.taxonomy?.tracks || []).forEach(tr => state.tracks.set(tr.id, tr));
    render();
  }

  function pickLang(site){
    const allowed = site.meta?.languages || [site.meta?.defaultLanguage].filter(Boolean);
    const url = new URLSearchParams(location.search).get("lang");
    if (url && allowed.includes(url)) return url;
    const nav = (navigator.language || "").slice(0,2);
    if (allowed.includes(nav)) return nav;
    return site.meta?.defaultLanguage || allowed[0] || "en";
  }

  /* ---- render ---- */
  const renderers = { about:renderAbout, research:renderResearch, projects:renderProjects, funding:renderFunding, publications:renderPublications, books:renderBooks, contact:renderContact };

  function render(){
    const s = state.site;
    document.documentElement.lang = state.lang;
    document.title = t(s.meta?.title) || document.title;
    setMeta("description", t(s.meta?.description));
    renderLangs(); initTheme(); renderHero(); renderNav();

    state.charts.forEach(c => c.destroy()); state.charts = [];
    const host = $("sections"); host.textContent = "";

    for (const sec of (s.sections || [])) {
      const fn = renderers[sec.id];
      if (!fn) { console.warn(`[data] no renderer for section: ${sec.id}`); continue; }
      const node = document.getElementById("tpl-section").content.firstElementChild.cloneNode(true);
      node.id = sec.id;
      slot(node,"eyebrow").textContent = String(indexOf(sec)).padStart(2,"0");
      slot(node,"title").textContent = t(sec.label);
      host.appendChild(node);
      fn(slot(node,"body"), slot(node,"intro"));
    }
    $("foot-line").textContent = `${s.identity?.name || ""} · ${t(s.contact?.city)}`;
    markCurrentSection();
  }

  const slot = (root, name) => root.querySelector(`[data-slot="${name}"]`);
  const indexOf = (sec) => (state.site.sections || []).indexOf(sec) + 1;
  function setMeta(name, content){ let m = document.querySelector(`meta[name="${name}"]`); if(!m){ m=document.createElement("meta"); m.name=name; document.head.appendChild(m);} m.content = content || ""; }

  function initTheme(){
    const btn = document.getElementById("themetog");
    const apply = (t) => {
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("thk-theme", t); } catch (e) {}
      btn.textContent = t === "dark" ? "☀" : "☾";
      state.charts.forEach(c => c.update());
    };
    apply(document.documentElement.getAttribute("data-theme") || "light");
    btn.addEventListener("click", () => apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));
  }

  function renderLangs(){
    const langs = state.site.meta?.languages || [];
    const box = $("langs"); box.textContent = "";
    if (langs.length < 2) { box.hidden = true; return; }
    box.hidden = false;
    langs.forEach(code => {
      const b = el("button", null, code);
      b.setAttribute("aria-pressed", String(code === state.lang));
      b.addEventListener("click", () => { state.lang = code; state.page = 1; render(); });
      box.appendChild(b);
    });
  }

  function renderHero(){
    const id = state.site.identity || {};
    $("hero").hidden = false;
    $("topbar-name").textContent = id.name || "";
    $("hero-name").textContent = id.name || "";
    $("hero-location").textContent = t(id.location);
    $("hero-headline").textContent = t(id.headline);
    $("hero-tagline").textContent = t(id.tagline);

    const ctas = $("hero-ctas"); ctas.textContent = "";
    (id.cta || []).forEach(c => { const a = el("a", null, t(c.label)); a.href = c.href; ctas.appendChild(a); });

    const profs = $("hero-profiles"); profs.textContent = "";
    (id.profiles || []).filter(p => p.href && p.href !== "TODO").forEach(p => {
      const li = el("li");
      const a = el("a");
      a.href = p.href; a.rel = "me noopener"; a.title = p.label; a.setAttribute("aria-label", p.label);
      const path = PROFILE_ICONS[p.id];
      if (path) {
        a.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="${path}"/></svg>`;
      } else {
        a.textContent = p.label;
      }
      li.appendChild(a); profs.appendChild(li);
    });

    const img = $("hero-portrait");
    if (id.portrait?.src) { img.src = id.portrait.src; img.alt = t(id.portrait.alt); img.hidden = false; }
    else img.hidden = true;
  }

  function renderNav(){
    const ul = $("navlist"); ul.textContent = "";
    (state.site.sections || []).forEach(sec => {
      const li = el("li"); const a = el("a", null, t(sec.label));
      a.href = `#${sec.id}`; li.appendChild(a); ul.appendChild(li);
    });
  }

  function markCurrentSection(){
    const links = [...document.querySelectorAll(".navlist a")];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${e.target.id}`)));
      });
    }, { rootMargin:"-45% 0px -50% 0px" });
    document.querySelectorAll(".section").forEach(s => obs.observe(s));
  }

  /* ---- sections ---- */
  function renderAbout(body){
    const a = state.site.about || {};
    const grid = el("div","about");
    const left = el("div","prose");
    (a.paragraphs || []).forEach(p => left.appendChild(el("p", null, t(p))));
    const counters = el("div","counters");
    (a.counters || []).forEach(c => {
      const box = el("div");
      const value = el("div","counter__value", String(c.value));
      box.appendChild(value);
      box.appendChild(el("div","counter__label", t(c.label)));
      counters.appendChild(box);
      if (c.source === "github-public-repos" && c.username) {
        fetchGithubRepoCount(c.username).then(n => { if (n != null) value.textContent = String(n); });
      }
      if (c.source === "projects-count-total" && !state.projectsFailed) {
        value.textContent = String(state.projects.length);
      }
    });
    if (counters.childElementCount) left.appendChild(counters);

    const right = el("div");

    const exp = a.experience;
    if (exp?.items?.length) {
      right.appendChild(el("h3","sub", t(exp.label)));
      const ol = el("ol","timeline");
      exp.items.forEach(item => {
        const li = el("li");
        const when = [item.start, item.end].filter(Boolean).join(" – ") || (item.start ? `${item.start} –` : "");
        li.appendChild(el("div","timeline__when", when));
        li.appendChild(el("p","timeline__role", t(item.role)));
        li.appendChild(el("div","timeline__org", item.org || ""));
        if (item.note) li.appendChild(el("p","timeline__note", t(item.note)));
        ol.appendChild(li);
      });
      right.appendChild(ol);
    }

    const edu = a.education;
    if (edu?.items?.length) {
      right.appendChild(el("h3","sub", t(edu.label)));
      const ul = el("ul","edu");
      edu.items.forEach(item => {
        const li = el("li"); const box = el("div");
        box.appendChild(el("div","edu__degree", t(item.degree)));
        box.appendChild(el("div","edu__org", item.org || ""));
        li.append(box, el("div","edu__year", item.year && item.year !== "TODO" ? String(item.year) : ""));
        ul.appendChild(li);
      });
      right.appendChild(ul);
    }

    grid.append(left, right); body.appendChild(grid);
  }

  function renderResearch(body, intro){
    const r = state.site.research || {};
    if (r.intro) { intro.hidden = false; intro.textContent = t(r.intro); }
    const wrap = el("div","lines");
    (r.lines || []).forEach(line => {
      const tr = trackOf(line.track);
      const d = el("details","line");
      if (tr) d.style.setProperty("--accent", tr.color);
      const sum = el("summary");
      sum.append(el("span","line__dot"), el("span","line__title", t(line.title)));
      if (line.status) sum.appendChild(el("span","line__status", t(line.status)));
      sum.appendChild(el("span","line__sign","+"));
      const bod = el("div","line__body");
      bod.appendChild(el("p", null, t(line.body)));
      if (line.keywords?.length) {
        const tags = el("ul","tags");
        line.keywords.forEach(k => tags.appendChild(el("li","tag", t(k))));
        bod.appendChild(tags);
      }
      d.append(sum, bod);
      d.addEventListener("toggle", () => { d.querySelector(".line__sign").textContent = d.open ? "−" : "+"; });
      wrap.appendChild(d);
    });
    body.appendChild(wrap);
  }

  function bodyPara(text, max){
    const p = el("p","card__body");
    if (!max || text.length <= max) { p.textContent = text; return p; }
    const cut = text.slice(0, max);
    const head = cut.slice(0, cut.lastIndexOf(" ")) || cut;
    p.appendChild(document.createTextNode(head + "… "));
    const details = document.createElement("details");
    details.className = "card__more";
    const summary = el("summary", null, "Read more");
    details.addEventListener("toggle", () => { summary.textContent = details.open ? "Show less" : "Read more"; });
    details.appendChild(summary);
    details.appendChild(document.createTextNode(text.slice(head.length)));
    p.appendChild(details);
    return p;
  }

  const STATUS_GROUP_FALLBACK = { "Ongoing":"active", "MVP":"active", "Completed":"completed", "Planning phase":"planned", "Paused":"paused" };
  function statusGroup(p){ return p.statusGroup || STATUS_GROUP_FALLBACK[p.status] || "active"; }

  function renderProjects(body, intro){
    if (state.projectsFailed) {
      body.appendChild(el("p","state","Project data is unavailable right now. Everything else on this page is unaffected."));
      return;
    }
    const completed = state.projects.filter(p => p.status === "Completed").length;
    const active = state.projects.length - completed;
    if (state.projects.length) { intro.hidden = false; intro.textContent = `${active} active · ${completed} completed`; }
    const cfg = state.site.projects || {};
    const grid = el("div","cards");
    (state.projects || []).forEach(p => {
      const trs = tracksOf(p.tracks);
      const card = el("article","card");
      if (trs[0]) card.style.setProperty("--accent", trs[0].color);
      card.appendChild(el("div","card__bar"));
      card.appendChild(el("h3","card__name", p.name));
      card.appendChild(el("p","card__summary", t(p.summary)));
      if (p.body) card.appendChild(bodyPara(t(p.body), cfg.bodyTruncateChars));
      if (p.status || p.year || p.funder) {
        const meta = el("p","card__facts");
        if (p.status) meta.appendChild(el("span", `badge badge--${statusGroup(p)}`, p.status));
        const rest = [p.year, p.funder].filter(Boolean).join(" · ");
        if (rest) meta.appendChild(document.createTextNode(p.status ? ` · ${rest}` : rest));
        card.appendChild(meta);
      }
      if (trs.length) {
        const tags = el("ul","tags");
        trs.forEach(tr => { const li = el("li","chip", t(tr.label)); li.style.borderColor = tr.color; li.style.color = tr.color; tags.appendChild(li); });
        card.appendChild(tags);
      }
      const links = (p.links || []).filter(l => l.href && l.href !== "TODO");
      if (links.length) {
        const box = el("div","card__links");
        links.forEach(l => { const a = el("a", null, t(l.label)); a.href = l.href; box.appendChild(a); });
        card.appendChild(box);
      }
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function fundingStatus(f){
    const now = new Date();
    const start = f.start ? new Date(`${f.start}-01`) : null;
    const end = f.end ? new Date(`${f.end}-01`) : null;
    if (end && now > end) return "Completed";
    if (start && now < start) return "Upcoming";
    return "Active";
  }

  function renderFunding(body, intro){
    if (state.fundingFailed) {
      body.appendChild(el("p","state","Funding data is unavailable right now. Everything else on this page is unaffected."));
      return;
    }
    const list = state.funding || [];
    if (!list.length) return;
    const active = list.filter(f => fundingStatus(f) === "Active").length;
    intro.hidden = false; intro.textContent = `${active} active · ${list.length} total`;
    const cfg = state.site.funding || {};
    const grid = el("div","cards");
    list.slice().sort((a,b) => (b.start || "").localeCompare(a.start || "")).forEach(f => {
      const trs = tracksOf(f.tracks);
      const card = el("article","card");
      if (trs[0]) card.style.setProperty("--accent", trs[0].color);
      card.appendChild(el("div","card__bar"));
      card.appendChild(el("h3","card__name", t(f.title)));
      if (f.description) card.appendChild(bodyPara(t(f.description), cfg.bodyTruncateChars));
      const amount = (f.amount != null && f.currency)
        ? new Intl.NumberFormat(state.lang, { style:"currency", currency:f.currency, maximumFractionDigits:0 }).format(f.amount)
        : null;
      const when = [f.start, f.end].filter(Boolean).join(" – ");
      const facts = [fundingStatus(f), f.funder, amount, when, f.grantNumber].filter(Boolean).join(" · ");
      if (facts) card.appendChild(el("p","card__facts", facts));
      if (trs.length) {
        const tags = el("ul","tags");
        trs.forEach(tr => { const li = el("li","chip", t(tr.label)); li.style.borderColor = tr.color; li.style.color = tr.color; tags.appendChild(li); });
        card.appendChild(tags);
      }
      if (f.url || f.funderRor) {
        const box = el("div","card__links");
        if (f.url) { const a = el("a", null, "ORCID"); a.href = f.url; a.rel = "noopener"; box.appendChild(a); }
        if (f.funderRor) { const a = el("a", null, f.funder || "Funder"); a.href = f.funderRor; a.rel = "noopener"; box.appendChild(a); }
        card.appendChild(box);
      }
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  const LANG_FLAGS = { da:["🇩🇰","Danish"], en:["🇬🇧","English"] };
  function bookLangs(codes){
    if (!codes?.length) return null;
    const span = el("span","book__langs");
    codes.forEach(code => {
      const [flag, name] = LANG_FLAGS[code] || [code.toUpperCase(), code];
      const item = el("span", null, flag);
      item.setAttribute("role","img"); item.setAttribute("aria-label", name);
      span.appendChild(item);
    });
    return span;
  }

  function renderBooks(body){
    if (state.booksFailed) {
      body.appendChild(el("p","state","Book data is unavailable right now. Everything else on this page is unaffected."));
      return;
    }
    const list = state.books || [];
    if (!list.length) return;
    const wrap = el("div","books");
    list.forEach(b => {
      const grid = el("div","book");
      if (b.cover?.src) {
        const img = el("img","book__cover"); img.src = b.cover.src; img.alt = t(b.cover.alt); grid.appendChild(img);
      } else {
        const ph = el("div","book__nocover");
        ph.appendChild(el("span","book__nocover-label","Cover"));
        ph.appendChild(el("span","book__nocover-title", t(b.title)));
        grid.appendChild(ph);
      }
      const right = el("div");
      const h3 = el("h3","book__title"); h3.appendChild(document.createTextNode(t(b.title)));
      const langs = bookLangs(b.languages);
      if (langs) h3.appendChild(langs);
      right.appendChild(h3);
      if (b.subtitle) right.appendChild(el("p","book__sub", t(b.subtitle)));
      if (b.blurb) right.appendChild(el("p", null, t(b.blurb)));
      const facts = [b.publisher, b.year, t(b.status)].filter(Boolean).filter(v => v !== "TODO").join(" · ");
      if (facts) right.appendChild(el("p","book__facts", facts));
      const links = (b.links || []).filter(l => l.href && l.href !== "TODO");
      if (links.length) {
        const box = el("div","card__links");
        links.forEach(l => { const a = el("a", null, t(l.label)); a.href = l.href; box.appendChild(a); });
        right.appendChild(box);
      }
      grid.appendChild(right); wrap.appendChild(grid);
    });
    body.appendChild(wrap);
  }

  function renderContact(body){
    const c = state.site.contact || {};
    const box = el("div","contact");
    if (c.email && c.email !== "TODO") { const a = el("a", null, c.email); a.href = `mailto:${c.email}`; box.appendChild(a); }
    if (c.phone && c.phone !== "TODO") {
      if (c.email && c.email !== "TODO") box.appendChild(document.createTextNode(" · "));
      const a = el("a", null, c.phone); a.href = `tel:${c.phone.replace(/\s+/g,"")}`; box.appendChild(a);
    }
    box.appendChild(el("p","book__facts", [c.org, t(c.city)].filter(Boolean).join(" · ")));
    if (c.note) box.appendChild(el("p","contact__note", t(c.note)));
    body.appendChild(box);
  }

  /* ---- publications ---- */
  function renderPublications(body){
    if (state.pubsFailed) {
      body.appendChild(el("p","state","Publication data is unavailable right now. Everything else on this page is unaffected."));
      return;
    }
    const cfg = state.site.publications || {};
    const tools = el("div","pubtools");
    (cfg.filters || []).forEach(f => tools.appendChild(buildFilter(f)));
    if (cfg.search) {
      const q = document.createElement("input");
      q.type = "search"; q.className = "pubsearch"; q.dataset.filter = "q";
      q.setAttribute("aria-label", "Search title or author");
      q.addEventListener("input", () => { state.filters.q = q.value.trim().toLowerCase(); state.page = 1; paint(); });
      tools.appendChild(q);
    }
    const count = el("span","pubcount"); tools.appendChild(count);
    const list = el("ul","pubs");
    const pager = el("div","pager");
    body.append(tools, list, pager);
    if (state.pubsUpdated) {
      const d = new Date(state.pubsUpdated);
      if (!isNaN(d)) body.appendChild(el("p","stamp", `Source data last updated ${d.toISOString().slice(0,10)}`));
    }

    if (cfg.charts?.length && state.pubs.length >= (cfg.chartsMinPublications || 0)) {
      const charts = el("div","charts");
      cfg.charts.forEach(c => { const box = el("div","chartbox"); const cv = el("canvas"); cv.id = c.id; box.appendChild(cv); charts.appendChild(box); });
      body.appendChild(charts);
      requestAnimationFrame(() => cfg.charts.forEach(drawChart));
    }

    function paint(){
      const rows = filtered();
      const size = cfg.pageSize || 15;
      const pages = Math.max(1, Math.ceil(rows.length / size));
      state.page = Math.min(state.page, pages);
      count.textContent = `${rows.length}`;
      list.textContent = "";
      rows.slice((state.page-1)*size, state.page*size).forEach(p => list.appendChild(pubRow(p)));
      pager.textContent = "";
      if (pages > 1) {
        const prev = el("button", null, "←"), next = el("button", null, "→");
        prev.disabled = state.page === 1; next.disabled = state.page === pages;
        prev.addEventListener("click", () => { state.page--; paint(); });
        next.addEventListener("click", () => { state.page++; paint(); });
        pager.append(prev, el("span","pubcount", `${state.page} / ${pages}`), next);
      }
    }
    tools.addEventListener("change", (e) => {
      if (!e.target.dataset.filter) return;
      state.filters[e.target.dataset.filter] = e.target.value;
      state.page = 1; paint();
    });
    paint();
  }

  function buildFilter(kind){
    const sel = document.createElement("select");
    sel.dataset.filter = kind;
    sel.setAttribute("aria-label", kind);
    const opts = [["", kind]];
    if (kind === "year")  [...new Set(state.pubs.map(p => yearOf(p.issued)).filter(Boolean))].sort((a,b)=>b-a).forEach(y => opts.push([String(y), String(y)]));
    if (kind === "type")  [...new Set(state.pubs.map(p => p.type).filter(Boolean))].sort().forEach(v => opts.push([v, v]));
    if (kind === "track") (state.site.taxonomy?.tracks || []).forEach(tr => opts.push([tr.id, t(tr.label)]));
    opts.forEach(([v,l]) => { const o = document.createElement("option"); o.value = v; o.textContent = l; sel.appendChild(o); });
    return sel;
  }

  function filtered(){
    const f = state.filters;
    return state.pubs
      .filter(p => !f.year  || String(yearOf(p.issued)) === f.year)
      .filter(p => !f.type  || p.type === f.type)
      .filter(p => !f.track || (p.tracks || []).includes(f.track))
      .filter(p => !f.q || haystack(p).includes(f.q))
      .sort((a,b) => (yearOf(b.issued) || 0) - (yearOf(a.issued) || 0));
  }

  function haystack(p){
    return [p.title, ...(p.author || []).map(a => `${a.given || ""} ${a.family || ""}`), p["container-title"], p.publisher]
      .filter(Boolean).join(" ").toLowerCase();
  }

  function pubRow(p){
    const li = el("li","pub");
    li.appendChild(el("div","pub__year", String(yearOf(p.issued) ?? "")));
    const main = el("div");
    const title = el("p","pub__title", p.title || "");
    if (p.featured) title.appendChild(el("span","star","★"));
    main.appendChild(title);
    const authors = (p.author || []).map(a => [a.given, a.family].filter(Boolean).join(" ")).join(", ");
    if (authors) main.appendChild(el("p","pub__authors", authors));
    const meta = el("div","pub__meta");
    tracksOf(p.tracks).forEach(tr => { const c = el("span","chip", t(tr.label)); c.style.borderColor = tr.color; c.style.color = tr.color; meta.appendChild(c); });
    if (p.DOI) { const a = el("a","pub__doi", p.DOI); a.href = p.URL || `https://doi.org/${p.DOI}`; a.rel = "noopener"; meta.appendChild(a); }
    main.appendChild(meta); li.appendChild(main);
    return li;
  }

  function drawChart(cfg){
    const cv = document.getElementById(cfg.id);
    if (!cv || typeof Chart === "undefined") return;
    const font = { family:"IBM Plex Mono", size:11 };
    let labels = [], values = [], colors = [];

    if (cfg.of === "year") {
      const by = new Map();
      state.pubs.forEach(p => { const y = yearOf(p.issued); if (y) by.set(y, (by.get(y)||0)+1); });
      labels = [...by.keys()].sort((a,b)=>a-b).map(String);
      values = labels.map(y => by.get(+y));
      colors = labels.map(() => "#16181d");
    } else if (cfg.of === "track") {
      const by = new Map();
      state.pubs.forEach(p => (p.tracks || []).forEach(id => { if (state.tracks.has(id)) by.set(id, (by.get(id)||0)+1); }));
      labels = [...by.keys()].map(id => t(state.tracks.get(id).label));
      values = [...by.values()];
      colors = [...by.keys()].map(id => state.tracks.get(id).color);
    }

    state.charts.push(new Chart(cv, {
      type: cfg.kind,
      data: { labels, datasets:[{ data:values, backgroundColor:colors, borderWidth:0 }] },
      options: {
        responsive:true, maintainAspectRatio:false,
        animation: matchMedia("(prefers-reduced-motion: reduce)").matches ? false : undefined,
        plugins:{ legend:{ display: cfg.kind !== "bar", position:"bottom", labels:{ font, boxWidth:10, color:"#6b6f76" } } },
        scales: cfg.kind === "bar" ? {
          x:{ grid:{ display:false }, ticks:{ font, color:"#6b6f76" } },
          y:{ beginAtZero:true, ticks:{ precision:0, font, color:"#6b6f76" }, grid:{ color:"#e3e0da" } }
        } : {}
      }
    }));
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
