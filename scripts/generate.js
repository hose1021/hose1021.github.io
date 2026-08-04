const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "resume.json"), "utf8"));

function h(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function externalLink(url, text) {
  return `<a class="resume-link" href="${h(url)}" target="_blank" rel="noreferrer">${h(text)} <span aria-hidden="true">↗</span></a>`;
}

function bullet(text) {
  return `<li>${h(text)}</li>`;
}

function pill(text) {
  return `<li>${h(text)}</li>`;
}

function roleCard(job) {
  const company = job.url ? externalLink(job.url, `${job.company}${job.location ? ` · ${job.location}` : ""}`) : h(`${job.company}${job.location ? ` · ${job.location}` : ""}`);
  return `<article class="resume-role">
    <header class="role-header">
      <div>
        <h3>${company}</h3>
        <p class="role-title">${h(job.position)}</p>
      </div>
      <p class="role-date">${h(job.startDate)} – ${h(job.endDate)}</p>
    </header>
    <ul class="bullet-list">${job.highlights.map(bullet).join("")}</ul>
    <ul class="tag-list">${job.stack.map(pill).join("")}</ul>
  </article>`;
}

function projectCard(project) {
  return `<article class="project-card">
    <header class="project-header">
      <h3>${h(project.name)}</h3>
      <p class="role-date">${h(project.startDate)} – ${h(project.endDate)}</p>
    </header>
    <ul class="bullet-list">${project.highlights.map(bullet).join("")}</ul>
    <ul class="tag-list">${project.stack.map(pill).join("")}</ul>
  </article>`;
}

function recommendationCard(item) {
  const author = item.profileUrl ? externalLink(item.profileUrl, item.name) : h(item.name);
  return `<article class="recommendation-card">
    <header>
      <h3>${author}</h3>
      <p>${h(item.role)}</p>
      <span>${h(item.relationship)} · ${h(item.date)}</span>
    </header>
    <a class="recommendation-link" href="https://www.linkedin.com/in/hose1021/details/recommendations/?detailScreenTabIndex=0" target="_blank" rel="noreferrer">View on LinkedIn ↗</a>
  </article>`;
}

function section(title, content, className = "") {
  return `<section class="resume-section ${className}">
    <h2>${h(title)}</h2>
    ${content}
  </section>`;
}

const contactLinks = data.basics.urls.map(item => item.url
  ? externalLink(item.url, item.label)
  : `<span>${h(item.label)}</span>`
).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="${h(data.basics.label)} with 8 years 3 months of experience in PHP, Laravel, Node.js, React, Next.js, TypeScript, REST APIs, microservices, and fintech systems.">
  <meta name="keywords" content="resume,cv,${h(data.basics.name)},PHP,Laravel,Node.js,React,Next.js,TypeScript,REST API,microservices,fintech">
  <meta name="author" content="${h(data.basics.name)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${h(data.basics.name)} — Resume</title>
  <link href="build.css" rel="stylesheet">
</head>
<body>
  <main class="resume-document">
    <div class="resume-page">
      <header class="resume-header">
        <div class="identity">
          <div class="initials" aria-hidden="true"><span>${h(data.basics.initials[0])}</span><span>${h(data.basics.initials[1])}</span></div>
          <div>
            <p class="eyebrow">SOFTWARE ENGINEERING</p>
            <h1>${h(data.basics.name)}</h1>
            <p class="headline">${h(data.basics.label)}</p>
          </div>
        </div>
        <div class="contact-block">
          <span>${h(data.basics.location)}</span>
          <a href="mailto:${h(data.basics.email)}">${h(data.basics.email)}</a>
          <a href="tel:${h(data.basics.phone.replace(/\s/g, ""))}">${h(data.basics.phone)}</a>
          <div class="contact-links">${contactLinks}</div>
        </div>
      </header>

      ${section("Profile", `<p class="summary-text">${h(data.summary)}</p>`, "profile-section")}

      <div class="metrics" aria-label="Career highlights">
        <div><strong>8+ yrs</strong><span>commercial experience</span></div>
        <div><strong>20+ APIs</strong><span>Workflow &amp; Payments</span></div>
        <div><strong>7s → 2s</strong><span>API response time</span></div>
      </div>

      ${section("Experience", `<div class="role-stack">${data.experience.slice(0, 2).map(roleCard).join("")}</div>`, "experience-section")}
    </div>

    <div class="resume-page second-page">
      ${section("Experience", `<div class="role-stack compact-roles">${data.experience.slice(2).map(roleCard).join("")}</div>`, "experience-section")}

      ${section("Selected Projects", `<div class="project-grid">${data.projects.map(projectCard).join("")}</div>`, "projects-section")}

      <div class="details-grid">
        ${section("Core Skills", `<ul class="tag-list skill-list">${data.skills.map(pill).join("")}</ul>`, "skills-section")}
        <div class="side-details">
          ${section("Languages", `<ul class="plain-list">${data.languages.map(language => `<li><strong>${h(language.language)}</strong><span>${h(language.level)}</span></li>`).join("")}</ul>`)}
          ${section("Education", `<div class="education-list">${data.education.map(item => `<div><h3>${h(item.institution)}</h3><p>${h(item.degree)}</p><span>${h(item.startDate)} – ${h(item.endDate)}</span></div>`).join("")}</div>`)}
        </div>
      </div>

      ${section("Courses & Certificates", `<ul class="bullet-list certificate-list">${data.certificates.map(bullet).join("")}</ul>`, "certificates-section")}
      <footer class="resume-footer">${h(data.basics.name)} · ${h(data.basics.email)} · ${h(data.basics.location)}</footer>
    </div>

    <div class="resume-page recommendations-page">
      <header class="recommendations-intro">
        <p class="eyebrow">PROFESSIONAL REFERENCES</p>
        <h1>Recommendations</h1>
        <p>Selected recommendations from colleagues and managers on LinkedIn.</p>
        <a class="resume-link" href="https://www.linkedin.com/in/hose1021/details/recommendations/?detailScreenTabIndex=0" target="_blank" rel="noreferrer">View recommendations on LinkedIn ↗</a>
      </header>
      <div class="recommendations-list">${data.recommendations.map(recommendationCard).join("")}</div>
      <footer class="resume-footer">${h(data.basics.name)} · Professional recommendations</footer>
    </div>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "..", "docs", "index.html"), html);
console.log("Generated docs/index.html");
