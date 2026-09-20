const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "resume.json"), "utf8"));
const icons = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "icons.json"), "utf8"));

function h(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function icon(name, className = "size-4", strokeWidth = 1.8) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${icons[name]}</svg>`;
}

function iconTile(name, className = "") {
  return `<div data-slot="icon-tile" class="flex size-6 shrink-0 items-center justify-center rounded-md border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-border/50 ring-offset-1 ring-offset-background select-none dark:ring-line [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}">${icon(name, "size-4")}</div>`;
}

function tag(text) {
  return `<span data-slot="tag" class="inline-flex items-center rounded-full border bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground dark:bg-zinc-900">${h(text)}</span>`;
}

function tagList(items, className = "flex flex-wrap gap-1.5") {
  return `<ul class="${className}">${items.map((item) => `<li class="flex">${tag(item)}</li>`).join("")}</ul>`;
}

function externalLink(url, text, className = "link") {
  return `<a class="${className}" href="${h(url)}" target="_blank" rel="noopener">${h(text)}</a>`;
}

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

function monthIndex(value) {
  const [month, year] = value.trim().split(/\s+/);
  return Number(year) * 12 + (MONTHS[month.slice(0, 3).toLowerCase()] ?? 0);
}

function formatDuration(start, end) {
  const total = monthIndex(end) - monthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} mo${months === 1 ? "" : "s"}`);
  return parts.join(" ") || "1 mo";
}

function period(start, end) {
  return `<dd class="flex items-center gap-0.5 tabular-nums"><span>${h(start)}</span><span class="font-mono">—</span><span>${h(end)}</span></dd>`;
}

function metaEntry(label, value) {
  return `<div><dt class="sr-only">${h(label)}</dt>${value}</div>`;
}

const SEPARATOR = `<div role="separator" aria-hidden="true" class="h-4 w-px shrink-0 self-center bg-border"></div>`;

function stripeDivider(className = "h-(--separator-height)") {
  return `<div class="stripe-divider ${className} w-full border-x"></div>`;
}

function panelTitleCopy(id) {
  return `<button type="button" class="copy-heading absolute top-1 ml-1 size-7 shrink-0 cursor-pointer rounded-md border-none text-muted-foreground opacity-0 transition-opacity group-hover/panel-title:opacity-100 focus-visible:opacity-100" data-heading-id="${h(id)}" aria-label="Copy link to section">${icon("link", "size-4")}</button>`;
}

function panel({ id, title, sup, description, body, className = "" }) {
  return `<section id="${h(id)}" data-slot="panel" class="screen-line-top screen-line-bottom border-x screen-line-bottom-border ${className}">
        <header data-slot="panel-header" class="screen-line-bottom px-4">
          <h2 data-slot="panel-title" class="group/panel-title relative inline-block font-heading text-3xl font-medium tracking-tight text-balance">
            <a href="#${h(id)}">${h(title)}</a>${sup ? `<sup class="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">${h(sup)}</sup>` : ""}${panelTitleCopy(id)}
          </h2>${description ? `
          <div data-slot="panel-description" class="py-4 text-base text-balance text-muted-foreground">${description}</div>` : ""}
        </header>
        <div data-slot="panel-body" class="p-4">${body}</div>
      </section>`;
}

function profileHeader() {
  return `<div class="screen-line-bottom border-x screen-line-bottom-border after:z-1">
      <div class="flex -translate-x-px items-center gap-2 px-4 pt-6 pb-1">
        <h1 class="-translate-y-px text-[2rem]/none font-medium tracking-tight">${h(data.basics.name)}</h1>
      </div>
      <div id="flip-sentences" class="relative h-12.5 overflow-hidden border-t border-line py-1 pl-4 sm:h-9">
        ${data.taglines.map((line, index) => `<p data-flip-item class="absolute inset-y-1 left-4 flex items-center text-sm text-muted-foreground transition-[opacity,transform] duration-500 ease-out" style="opacity:${index === 0 ? 1 : 0};transform:translateY(${index === 0 ? 0 : 8}px)">${h(line)}</p>`).join("")}
      </div>
    </div>`;
}

function aboutPanel() {
  return `<section id="about" data-slot="panel" class="screen-line-top screen-line-bottom border-x screen-line-bottom-border">
        <header data-slot="panel-header" class="screen-line-bottom px-4">
          <h2 data-slot="panel-title" class="group/panel-title relative inline-block font-heading text-3xl font-medium tracking-tight text-balance">
            <a href="#about">About</a>${panelTitleCopy("about")}
          </h2>
        </header>
        <div data-slot="panel-body" class="p-4">
          <div class="typeset typeset-description [&_li]:ps-0.5 [&_ul]:ps-3.5"><p class="text-[0.9375rem]/6 text-balance">${h(data.summary)}</p></div>
        </div>
      </section>`;
}

function introItem({ iconName, content, trailing = "" }) {
  return `<div class="flex items-center gap-4 font-mono text-sm">${iconTile(iconName)}<p class="text-balance">${content}</p>${trailing}</div>`;
}

function overviewPanel() {
  const latest = data.experience[0];
  const rows = [
    `<div class="sm:col-span-2">${introItem({
      iconName: "briefcase-business",
      content: `Most recent role <span aria-label="at">@</span> <a class="link ml-0.5 font-medium" href="#experience">${h(latest.company)}</a>`
    })}</div>`,
    introItem({
      iconName: "map-pin",
      content: externalLink(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.basics.location)}`, data.basics.location)
    }),
    introItem({ iconName: "phone", content: externalLink(`tel:${data.basics.phone.replace(/\s/g, "")}`, data.basics.phone) }),
    `<div class="group flex items-center gap-4 font-mono text-sm">${iconTile("mail")}<p class="text-balance"><a class="link" href="mailto:${h(data.basics.email)}">${h(data.basics.email)}</a></p><button type="button" class="copy-text -translate-x-2 cursor-pointer text-muted-foreground opacity-0 transition-opacity ease-out group-hover:opacity-100 focus-visible:opacity-100" data-copy="${h(data.basics.email)}" aria-label="Copy email address">${icon("copy", "size-4")}</button></div>`,
    ...data.basics.urls.map((item) => introItem({ iconName: item.label.startsWith("GitHub") ? "github" : item.label.startsWith("Telegram") ? "send" : "linkedin", content: externalLink(item.url, item.label.split(":")[0].split(" ")[0]) }))
  ];
  return `<section id="overview" data-slot="panel" class="screen-line-top screen-line-bottom border-x screen-line-bottom-border screen-line-bottom-none">
        <h2 class="sr-only">Overview</h2>
        <div data-slot="panel-body" class="grid gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">${rows.join("")}</div>
        <div class="pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-r border-dashed border-line max-sm:hidden"></div>
      </section>`;
}

function experienceItem(job, index) {
  const positions = `<div class="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
          <div class="group/experience-position relative">
            <div class="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/experience-position:flex" aria-hidden="true">
              <span class="size-full -translate-y-2.25 rounded-bl-sm border-b border-l"></span>
            </div>
            <div>
              <div class="relative z-1 mb-1 flex items-start gap-3 text-base">
                ${iconTile(index === 0 ? "code-xml" : index === 1 ? "briefcase-business" : index === 2 ? "lightbulb" : "code-xml")}
                <h4 class="flex-1 font-medium text-balance">${h(job.position)}</h4>
              </div>
              <dl class="flex flex-wrap items-center gap-2 pl-9 text-sm text-muted-foreground">
                ${metaEntry("Employment period", period(job.startDate, job.endDate))}
                ${SEPARATOR}
                ${metaEntry("Duration", `<dd class="tabular-nums">${h(formatDuration(job.startDate, job.endDate))}</dd>`)}
              </dl>
            </div>
            <div class="typeset typeset-description pt-3 pb-1 pl-9">
              <ul>${job.highlights.map((line) => `<li>${h(line)}</li>`).join("")}</ul>
            </div>
            ${tagList(job.stack, "flex flex-wrap gap-1.5 pt-3 pl-9")}
          </div>
        </div>`;

  return `<div id="experience-${h(job.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}" class="group/experience screen-line-bottom scroll-mt-14 space-y-4 py-4">
        <div class="flex items-start gap-3 sm:items-center">
          <div class="flex size-6 shrink-0 items-center justify-center select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-5">
            ${icon(index === 0 ? "briefcase-business" : "code-xml", "size-5")}
          </div>
          <div class="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-1 pr-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 class="text-xl/6 font-medium">${job.url ? externalLink(job.url, job.company) : h(job.company)}</h3>
            <dl class="flex min-w-0 items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
              <dt class="sr-only">Location</dt>
              <dd class="truncate">${h(job.location)}</dd>
            </dl>
          </div>
        </div>
        ${positions}
      </div>`;
}

function experiencePanel() {
  return panel({
    id: "experience",
    title: "Experience",
    sup: `(${data.experience.length})`,
    description: `Roles held between ${h(data.experience[data.experience.length - 1].startDate)} and ${h(data.experience[0].endDate)}. Expand a role for the full list of delivery notes and the stack used.`,
    body: data.experience.map(experienceItem).join("")
  });
}

function developmentPanel() {
  const development = data.professionalDevelopment;
  return panel({
    id: "development",
    title: "Professional Development",
    sup: `(${development.startDate} — ${development.endDate})`,
    body: `<div class="flex items-start gap-3">
          ${iconTile("lightbulb")}
          <div class="typeset typeset-description flex-1">
            <ul>${development.highlights.map((line) => `<li>${h(line)}</li>`).join("")}</ul>
          </div>
        </div>`
  });
}

function projectItem(project) {
  return `<div class="group/project" data-state="open">
        <div class="relative flex items-center transition-[background-color] ease-out hover:bg-accent-muted">
          <div class="mx-4 flex size-6 shrink-0 items-center justify-center select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-5">${icon("code-xml", "size-5")}</div>
          <div class="flex flex-1 items-center gap-2 border-l border-dashed border-line p-4">
            <div class="flex-1">
              <h3 class="mb-1 leading-snug font-medium text-balance">${h(project.name)}</h3>
              <dl class="text-sm text-muted-foreground">
                <dt class="sr-only">Period</dt>
                ${period(project.startDate, project.endDate)}
              </dl>
            </div>
            <div class="shrink-0 text-muted-foreground">${icon("chevron-down", "size-4")}</div>
          </div>
        </div>
        <div class="overflow-hidden">
          <div class="space-y-4 border-t border-line p-4">
            <div class="typeset typeset-description">
              <ul>${project.highlights.map((line) => `<li>${h(line)}</li>`).join("")}</ul>
            </div>
            ${tagList(project.stack)}
          </div>
        </div>
      </div>`;
}

function projectsPanel() {
  return panel({
    id: "projects",
    title: "Projects",
    sup: `(${data.projects.length})`,
    body: `<div class="divide-y divide-line border-y border-line">${data.projects.map(projectItem).join("")}</div>`
  });
}

function stackPanel() {
  const rows = data.skillGroups.map((group, index) => {
    const id = `stack-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const items = group.items.split(/,\s*/).map((item) => `<li class="flex">${tag(item)}</li>`).join("");
    return `<div class="grid items-start gap-y-2 border-b border-line px-4 py-4 last:border-none sm:grid-cols-[var(--col-left-width)_1fr]">
          <div id="${h(id)}" class="text-sm/(--badge-height)">
            <span class="mr-1.5 font-mono text-muted-foreground/80 select-none" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${h(group.name)}
          </div>
          <ul aria-labelledby="${h(id)}" class="flex flex-wrap gap-1.5">${items}</ul>
        </div>`;
  }).join("");
  return `<section id="stack" data-slot="panel" class="screen-line-top screen-line-bottom border-x screen-line-bottom-border">
        <header data-slot="panel-header" class="screen-line-bottom px-4">
          <h2 data-slot="panel-title" class="group/panel-title relative inline-block font-heading text-3xl font-medium tracking-tight text-balance">
            <a href="#stack">Stack</a><sup class="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">(${data.skillGroups.length})</sup>${panelTitleCopy("stack")}
          </h2>
        </header>
        <div class="relative [--badge-height:--spacing(6)] [--col-left-width:--spacing(48)]">
          <div class="pointer-events-none absolute inset-y-0 left-(--col-left-width) -z-1 w-px border-r border-dashed border-line max-sm:hidden" aria-hidden="true"></div>
          ${rows}
        </div>
      </section>`;
}

function recommendationItem(item) {
  return `<figure class="group/testimonial relative flex h-full flex-col justify-between gap-4 rounded-xl bg-background p-4 inset-ring-1 inset-ring-foreground/15 transition-[background-color] ease-out hover:bg-accent-muted">
        <figcaption class="flex items-center gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] text-muted-foreground inset-ring-1 inset-ring-foreground/15">${h(item.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase())}</div>
          <div class="min-w-0">
            <div class="truncate font-medium">
              ${item.profileUrl ? `<a href="${h(item.profileUrl)}" target="_blank" rel="noopener"><span class="absolute inset-0" aria-hidden="true"></span>${h(item.name)}</a>` : h(item.name)}
            </div>
            <div class="text-sm text-muted-foreground">${h(item.role)}</div>
          </div>
          <div class="ml-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums">${h(item.date)}</div>
        </figcaption>
        <p class="text-sm text-muted-foreground">${h(item.relationship)}</p>
      </figure>`;
}

function recommendationsPanel() {
  return panel({
    id: "recommendations",
    title: "Recommendations",
    sup: `(${data.recommendations.length})`,
    description: `Received from colleagues and managers. ${externalLink("https://www.linkedin.com/in/hose1021/details/recommendations/?detailScreenTabIndex=0", "View all on LinkedIn")}`,
    body: `<div class="grid gap-2 sm:grid-cols-2">${data.recommendations.map(recommendationItem).join("")}</div>`
  });
}

function educationPanel() {
  const items = data.education.map((item, index) => `<div id="education-${index + 1}" class="screen-line-bottom scroll-mt-14 p-4 last:screen-line-bottom-none">
        <div class="group/education-item relative before:absolute before:left-3 before:h-full before:w-px before:bg-border">
          <div class="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/education-item:flex" aria-hidden="true">
            <span class="size-full -translate-y-2.25 rounded-bl-sm border-b border-l"></span>
          </div>
          <div>
            <div class="relative z-1 mb-1 flex items-start gap-3 text-base">
              ${iconTile("graduation-cap")}
              <h3 class="flex-1 font-medium text-balance">${h(item.institution)}</h3>
            </div>
            <dl class="flex flex-wrap items-center gap-2 pl-9 text-sm text-muted-foreground">
              ${metaEntry("Study period", period(item.startDate, item.endDate))}
              ${SEPARATOR}
              ${metaEntry("Degree", `<dd>${h(item.degree)}</dd>`)}
            </dl>
          </div>
        </div>
      </div>`).join("");
  return panel({ id: "education", title: "Education", sup: `(${data.education.length})`, body: `<div class="-m-4">${items}</div>` });
}

function languagesPanel() {
  const rows = data.languages.map((language, index) => `<div class="grid items-start gap-y-2 border-b border-line px-4 py-4 last:border-none sm:grid-cols-[var(--col-left-width)_1fr]">
        <div class="text-sm/(--badge-height)"><span class="mr-1.5 font-mono text-muted-foreground/80 select-none" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${h(language.language)}</div>
        <div class="text-sm text-muted-foreground">${h(language.level)}</div>
      </div>`).join("");
  return `<section id="languages" data-slot="panel" class="screen-line-top screen-line-bottom border-x screen-line-bottom-border">
        <header data-slot="panel-header" class="screen-line-bottom px-4">
          <h2 data-slot="panel-title" class="group/panel-title relative inline-block font-heading text-3xl font-medium tracking-tight text-balance">
            <a href="#languages">Languages</a>${panelTitleCopy("languages")}
          </h2>
        </header>
        <div class="relative [--badge-height:--spacing(6)] [--col-left-width:--spacing(48)]">
          <div class="pointer-events-none absolute inset-y-0 left-(--col-left-width) -z-1 w-px border-r border-dashed border-line max-sm:hidden" aria-hidden="true"></div>
          ${rows}
        </div>
      </section>`;
}

function siteFooter() {
  const social = [
    ["github", "GitHub profile", data.basics.urls.find((item) => item.label.startsWith("GitHub"))?.url],
    ["linkedin", "LinkedIn profile", data.basics.urls.find((item) => item.label.startsWith("LinkedIn"))?.url],
    ["send", "Telegram", data.basics.urls.find((item) => item.label.startsWith("Telegram"))?.url]
  ].map(([name, label, url]) => `<a class="flex items-center text-muted-foreground transition-[color] hover:text-foreground" href="${h(url)}" target="_blank" rel="noopener" aria-label="${h(label)}">${icon(name, "size-4")}</a>`)
    .join(`<div class="flex h-11 w-px bg-line"></div>`);

  return `<footer class="max-w-screen overflow-x-clip px-2">
      <div class="mx-auto border-x border-line md:max-w-3xl">
        <div class="screen-line-top screen-line-bottom">
          <div class="stripe-divider h-12"></div>
        </div>

        <div class="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div class="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">${social}</div>
        </div>
      </div>
      <div class="h-(--fade-bottom-height)"></div>
    </footer>`;
}

const navItems = [
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["stack", "Stack"],
  ["recommendations", "Recommendations"],
  ["education", "Education"]
].map(([id, label]) => `<a class="text-sm font-medium tracking-wide text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground" href="#${id}">${label}</a>`).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="${h(data.basics.label)}. ${h(data.summary)}">
  <meta name="keywords" content="resume,cv,${h(data.basics.name)},PHP,Laravel,Node.js,TypeScript,REST API,microservices,fintech">
  <meta name="author" content="${h(data.basics.name)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">
  <title>${h(data.basics.name)} — ${h(data.basics.label)}</title>
  <link href="build.css" rel="stylesheet">
  <script>
    (function () {
      var stored = localStorage.getItem("theme");
      var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(dark ? "dark" : "light");
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    })();
  </script>
</head>
<body>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-sm">Skip to content</a>

  <div class="group/layout relative isolate">
    <header class="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div class="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x screen-line-bottom-border screen-line-top-border pr-2 pl-4 after:z-1 sm:gap-4 md:max-w-3xl">
        <a href="#top" aria-label="Home">
          <span class="flex h-6 shrink-0 items-center gap-1 font-mono text-sm tracking-tight">
            <span class="flex size-6 items-center justify-center border border-line bg-muted text-[11px] text-muted-foreground">${h(data.basics.initials[0])}</span>
            <span class="flex size-6 items-center justify-center border border-line bg-muted text-[11px] text-muted-foreground">${h(data.basics.initials[1])}</span>
          </span>
        </a>

        <div class="flex-1"></div>

        <nav class="flex items-center gap-4 max-sm:hidden" data-nav aria-label="Sections">${navItems}</nav>

        <div class="flex items-center">
          <div role="separator" aria-orientation="vertical" class="mr-2 h-5 w-px shrink-0 self-center bg-border max-sm:hidden"></div>
          <button type="button" id="theme-toggle" class="relative inline-flex size-8 cursor-pointer touch-manipulation items-center justify-center rounded-md border-none text-foreground transition-colors hover:bg-accent" aria-label="Toggle mode">
            <span class="absolute size-12 pointer-fine:hidden" aria-hidden="true"></span>
            <span class="hidden [html.dark_&]:block" aria-hidden="true">${icon("moon", "size-4")}</span>
            <span class="hidden [html.light_&]:block" aria-hidden="true">${icon("sun", "size-4")}</span>
          </button>
        </div>
      </div>
    </header>

    <main id="main" class="max-w-screen overflow-x-clip px-2">
      <div id="top" class="mx-auto md:max-w-3xl [--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
        ${profileHeader()}
        ${stripeDivider()}
        ${aboutPanel()}
        ${stripeDivider()}
        ${overviewPanel()}
        ${stripeDivider()}
        ${experiencePanel()}
        ${stripeDivider()}
        ${developmentPanel()}
        ${stripeDivider()}
        ${projectsPanel()}
        ${stripeDivider()}
        ${stackPanel()}
        ${stripeDivider()}
        ${recommendationsPanel()}
        ${stripeDivider()}
        ${educationPanel()}
        ${stripeDivider()}
        ${languagesPanel()}
      </div>
    </main>

    ${siteFooter()}
  </div>

  <div class="pointer-events-none fixed inset-x-0 bottom-0 z-50">
    <div class="h-(--fade-bottom-height) bg-linear-to-b from-transparent to-background"></div>
    <div class="bg-background pb-[env(safe-area-inset-bottom,0)]"></div>
  </div>

  <script>
    (function () {
      var root = document.documentElement;

      /* Theme toggle, hotkey D, and the theme-color meta tag. */
      var toggle = document.getElementById("theme-toggle");
      function applyTheme(dark) {
        root.classList.toggle("dark", dark);
        root.classList.toggle("light", !dark);
        root.style.colorScheme = dark ? "dark" : "light";
        localStorage.setItem("theme", dark ? "dark" : "light");
      }
      toggle.addEventListener("click", function () {
        applyTheme(!root.classList.contains("dark"));
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "d" && event.key !== "D") return;
        var tag = (event.target.tagName || "").toLowerCase();
        if (event.metaKey || event.ctrlKey || event.altKey || tag === "input" || tag === "textarea") return;
        event.preventDefault();
        applyTheme(!root.classList.contains("dark"));
      });

      /* Rotating taglines in the profile header. */
      var items = document.querySelectorAll("[data-flip-item]");
      if (items.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var current = 0;
        setInterval(function () {
          var previous = items[current];
          current = (current + 1) % items.length;
          var next = items[current];
          previous.style.opacity = "0";
          previous.style.transform = "translateY(-8px)";
          next.style.opacity = "1";
          next.style.transform = "translateY(0)";
        }, 4000);
      }

      /* Active section in the header nav. */
      var nav = document.querySelector("[data-nav]");
      var sections = ["experience", "projects", "stack", "recommendations", "education"]
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);
      if (nav && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            nav.querySelectorAll("a").forEach(function (link) {
              if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "page");
              else link.removeAttribute("aria-current");
            });
          });
        }, { rootMargin: "-20% 0px -70% 0px" });
        sections.forEach(function (section) { observer.observe(section); });
      }

      /* Copy a link to a section, and the email address. */
      function copy(text, button) {
        if (button.dataset.busy) return;
        navigator.clipboard.writeText(text).then(function () {
          button.dataset.busy = "1";
          button.dataset.markup = button.innerHTML;
          button.classList.add("w-auto", "px-1", "font-mono", "text-[10px]");
          button.textContent = "copied";
          setTimeout(function () {
            button.innerHTML = button.dataset.markup;
            button.classList.remove("w-auto", "px-1", "font-mono", "text-[10px]");
            delete button.dataset.busy;
          }, 1200);
        });
      }
      document.querySelectorAll(".copy-heading").forEach(function (button) {
        button.addEventListener("click", function () {
          copy(location.origin + location.pathname + "#" + button.dataset.headingId, button);
        });
      });
      document.querySelectorAll(".copy-text").forEach(function (button) {
        button.addEventListener("click", function () { copy(button.dataset.copy, button); });
      });
    })();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "..", "docs", "index.html"), html);
console.log("Generated docs/index.html");
