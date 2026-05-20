const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "resume.json"), "utf8"));

function h(str) { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

function link(url, text) {
  return `<a href="${h(url)}" target="_blank" class="group">${h(text)}<span class="inline-block font-normal print:text-black transition duration-100 ease-in text-gray-550 group-hover:text-gray-700">↗</span></a>`;
}

function pill(text) {
  return `<li class="px-2.5 mr-1.6 mb-1.6 text-base text-gray-750 print:bg-white print:border-inset bg-gray-200">${h(text)}</li>`;
}

function bullet(text) {
  return `<li class="leading-normal text-gray-700 text-md"><span class="absolute -ml-3 sm:-ml-3.2 select-none transform -translate-y-px">›</span>${h(text)}</li>`;
}

function sectionHeader(title, url, subtitle) {
  if (url) {
    return `<header><a target="_blank" href="${h(url)}" class="cursor-pointer text-lg font-semibold text-gray-700 leading-snugish">${h(title)}<span class="inline-block font-normal print:text-black transition duration-100 ease-in text-gray-550 group-hover:text-gray-700">↗</span></a><p class="leading-normal text-md text-gray-650">${h(subtitle)}</p></header>`;
  }
  return `<header><h3 class="text-lg font-semibold text-gray-700 leading-snugish">${h(title)}</h3><p class="leading-normal text-md text-gray-650">${h(subtitle)}</p></header>`;
}

function jobBlock(job, type) {
  const title = job.url ? job.company + (job.location ? ` (${job.location})` : "") : job.name || job.company;
  const heading = sectionHeader(title, job.url || null, `${job.startDate} – ${job.endDate} | ${job.position}`);
  const highlights = job.highlights.map(bullet).join("\n");
  const stack = job.stack.length ? `<div class="mt-2 last:pb-1.5"><ul class="flex flex-wrap text-md leading-relaxed -mr-1.6 -mb-1.6">${job.stack.map(pill).join("")}</ul></div>` : "";
  return `<section class="mb-4.5 break-inside-avoid">${heading}<ul class="mt-1 leading-normal text-gray-700 text-md space-y-1">${highlights}</ul>${stack}</section>`;
}

function urlCol(urls) {
  return urls.map(u => {
    const href = u.url ? link(u.url, u.label) : h(u.label);
    return `<div class="mt-1.5 leading-normal text-gray-700 text-md">${href}</div>`;
  }).join("\n");
}

// Build URL columns: split 3 items (LinkedIn, GitHub, @hose1021) into two columns
const urlsLeft = data.basics.urls.slice(0, 2);
const urlsRight = data.basics.urls.slice(2);

const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="Senior Software Engineer">
    <meta name="keywords" content="resume,cv,${h(data.basics.name)}">
    <meta name="author" content="${h(data.basics.name)}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="build.css" rel="stylesheet">
    <title>${h(data.basics.name)} — Resume</title>
</head>

<body>
<main class="font-firago hyphens-manual">

    <!-- Page 1 -->
    <div class="mx-auto max-w-2xl bg-white p-6 xsm:p-8 page print:max-w-a4 sm:p-9 md:max-w-a4 md:h-a4 md:p-16">

        <!-- Name -->
        <header class="mb-8 items-center col-gap-md md:col-count-2 md:mb-11">
            <div class="flex items-center">
                <div class="mr-5 print:bg-black bg-gray-700 px-3 text-base font-medium leading-none text-white initials-container"
                     style="padding-bottom: 0.6875rem; padding-top: 0.6875rem;">
                    <div class="text-center initial" style="padding-bottom: 0.1875rem;">${h(data.basics.initials[0])}</div>
                    <div class="text-center initial">${h(data.basics.initials[1])}</div>
                </div>
                <div class="space-y-2">
                    <h1 class="pb-px text-2xl font-semibold text-gray-750">${h(data.basics.name)}</h1>
                    <p>${h(data.basics.label)}</p>
                </div>
            </div>
            <div class="flex items-center pr-7 space-x-4">
                <div>
                    <div class="mt-1.5 leading-normal text-gray-700 text-md">${h(data.basics.location)}</div>
                    <div class="mt-1.5 leading-normal text-gray-700 text-md">${h(data.basics.email)}</div>
                    <div class="mt-1.5 leading-normal text-gray-700 text-md">${h(data.basics.phone)}</div>
                </div>
                <div>
                    ${urlCol(urlsLeft)}
                </div>
            </div>
        </header>

        <div class="print:col-count-2 col-gap-md print:h-a4-col col-fill-auto md:col-count-2 md:h-a4-col">

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-4 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">SUMMARY</h2>
                </div>
                <p class="mt-2.1 text-md text-gray-700 leading-normal">${h(data.summary)}</p>
            </section>

            <section class="mt-8 first:mt-0">
                <div>
                    <h2 class="mb-4 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">EXPERIENCE</h2>
                    ${data.experience.map(j => jobBlock(j, "experience")).join("\n")}
                </div>
            </section>

        </div>
    </div>

    <!-- Page 2 -->
    <div class="mx-auto max-w-2xl print:bg-white p-6 xsm:p-8 page print:max-w-a4 sm:p-9 md:max-w-a4 md:max-h-a4 md:p-16">

        <div class="print:col-count-2 col-gap-md print:h-a4-col-full col-fill-auto md:col-count-2 md:max-h-a4-col-full">

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-4 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">PROJECTS</h2>
                    ${data.projects.map(p => jobBlock(p, "project")).join("\n")}
                </div>
            </section>

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-4 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">SKILLS</h2>
                    <div class="my-3.2 last:pb-1.5">
                        <ul class="flex flex-wrap text-md leading-relaxed -mr-1.6 -mb-1.6">
                            ${data.skills.map(pill).join("")}
                        </ul>
                    </div>
                </div>
            </section>

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-4 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">COURSES & CERTIFICATES</h2>
                    <section class="mb-4.5 break-inside-avoid">
                        <ul class="mt-1 leading-normal text-gray-700 text-md space-y-1">
                            ${data.certificates.map(bullet).join("\n")}
                        </ul>
                    </section>
                </div>
            </section>

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-2 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">EDUCATION</h2>
                    ${data.education.map(e => `<section class="mb-4.5 break-inside-avoid"><header><h3 class="text-lg font-semibold text-gray-700 leading-snugish">${h(e.institution)}</h3><p class="leading-normal text-md text-gray-650">${h(e.startDate)} – ${h(e.endDate)} | ${h(e.degree)}</p></header></section>`).join("\n")}
                </div>
            </section>

            <section class="mt-8 first:mt-0">
                <div class="break-inside-avoid">
                    <h2 class="mb-2 print:font-normal font-bold tracking-widest text-sm2 text-gray-550">LANGUAGES</h2>
                    <ul class="mt-1 leading-normal text-gray-700 text-md space-y-1">
                        ${data.languages.map(l => bullet(`${l.language} — ${l.level}`)).join("\n")}
                    </ul>
                </div>
            </section>

        </div>
    </div>

</main>

</body>

</html>`;

fs.writeFileSync(path.join(__dirname, "..", "docs", "index.html"), html);
console.log("Generated docs/index.html");
