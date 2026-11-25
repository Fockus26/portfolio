// Playwright check of the scroll choreography (HANDOFF § 6.1–6.3, D024–D027).
// Node 26 (it imports lib/choreography.ts with type stripping):
//   node scripts/qa/choreography.mjs [base]       base defaults to http://localhost:4301/es
// Every measurement is compared with the same functions the driver uses, 1px tolerance.
// Exits with code 1 when any check fails.
import { chromium } from "playwright";
import {
  fullRect,
  lerpRect,
  openAmount,
  revealOpacity,
  stackedInset,
  textOpacity,
  trackProgress,
  windowRadius,
} from "../../lib/choreography.ts";

const BASE = (process.argv[2] ?? "http://localhost:4301/es").replace(/\/$/, "");
const TOL = 1;
const PS = [0, 0.15, 0.35, 0.55, 0.7, 0.9, 1];
const DESKTOP = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
];
const ROOMS = ["p01", "p03", "p07", "p02", "p09"];
const STACKED = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
];

let checks = 0;
const failures = [];
function check(ok, label) {
  checks++;
  if (!ok) failures.push(label);
  return ok;
}
const near = (a, b, tol = TOL) => Math.abs(a - b) <= tol;
const fmt = (n) => (Math.round(n * 100) / 100).toString();
const log = (...parts) => console.log(...parts);

const browser = await chromium.launch();

async function open(viewport, reducedMotion = "no-preference", init) {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  if (init) await page.addInitScript(init);
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("#p01");
  await page.evaluate(() => document.fonts.ready);
  // Hydrated: with motion the light layer takes over after the entrance moment
  if (reducedMotion === "no-preference")
    await page.waitForFunction(() =>
      document.documentElement.hasAttribute("data-light-layer"),
    );
  else await page.waitForTimeout(1200);
  await page.waitForTimeout(200);
  return { context, page };
}

// Scrolls without smooth behavior or snap, waits two frames, reads one room
async function sampleRoom(page, id, ps) {
  return page.evaluate(
    async ({ id, ps }) => {
      const root = document.documentElement;
      root.style.scrollSnapType = "none";
      root.style.scrollBehavior = "auto";
      const frames = () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      const track = document.getElementById(id);
      const stage = track.querySelector(".room-stage");
      const slot = track.querySelector("[data-room-slot]");
      const figure = slot.querySelector("figure");
      const screen = figure.querySelector("[data-window-screen]");
      const texts = [...track.querySelectorAll("[data-room-text]")];
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
      await frames();
      const travel = track.offsetHeight - stage.offsetHeight;
      const stageBox = stage.getBoundingClientRect();
      const out = {
        format: slot.dataset.roomSlot,
        isStatic: track.hasAttribute("data-room-static"),
        position: getComputedStyle(stage).position,
        top,
        travel,
        header: Number.parseFloat(getComputedStyle(stage).paddingTop),
        width: track.clientWidth,
        left: track.getBoundingClientRect().left - stageBox.left,
        viewport: window.innerHeight,
        samples: [],
      };
      for (const p of ps) {
        window.scrollTo(0, top + p * travel);
        await frames();
        const s = stage.getBoundingClientRect();
        const f = figure.getBoundingClientRect();
        const style = getComputedStyle(figure);
        out.samples.push({
          p,
          scrollY: window.scrollY,
          rect: {
            left: f.left - s.left,
            top: f.top - s.top,
            width: f.width,
            height: f.height,
          },
          viewTop: f.top,
          inlinePosition: figure.style.position,
          background: style.backgroundColor,
          radius: Number.parseFloat(getComputedStyle(screen).borderTopLeftRadius),
          zIndex: style.zIndex,
          texts: texts.map((block) => {
            const cs = getComputedStyle(block);
            return {
              opacity: Number(cs.opacity),
              visibility: cs.visibility,
              inert: block.inert,
            };
          }),
          hscroll: root.scrollWidth - root.clientWidth,
        });
      }
      root.style.scrollSnapType = "";
      root.style.scrollBehavior = "";
      return out;
    },
    { id, ps },
  );
}

const alphaOf = (color) => {
  const parts = color.match(/[\d.]+/g) ?? [];
  return parts.length >= 4 ? Number(parts[3]) : 1;
};

// 1 · Window opening at >=1024, motion allowed (§ 6.1)
for (const viewport of DESKTOP) {
  const { context, page } = await open(viewport);
  const tag = `${viewport.width}×${viewport.height}`;
  for (const id of ROOMS) {
    const room = await sampleRoom(page, id, PS);
    if (room.isStatic) {
      log(`${tag} ${id}: static (taller than one viewport, D025): no track`);
      check(room.position !== "sticky", `${tag} ${id} static but sticky`);
      for (const sample of room.samples) {
        check(sample.inlinePosition === "", `${tag} ${id} static window moved`);
        check(
          sample.texts.every((t) => t.opacity === 1 && !t.inert),
          `${tag} ${id} static text hidden`,
        );
      }
      continue;
    }
    check(room.position === "sticky", `${tag} ${id} stage not sticky`);
    check(near(room.travel, viewport.height), `${tag} ${id} travel ${room.travel}`);
    const slot = room.samples[0].rect;
    const full = fullRect({
      format: room.format,
      width: room.width,
      left: room.left,
      viewport: room.viewport,
      header: room.header,
    });
    const rows = [];
    for (const sample of room.samples) {
      const p = trackProgress(sample.scrollY, room.top, room.travel);
      const t = openAmount(p);
      const want = lerpRect(slot, full, t);
      const label = `${tag} ${id} p=${sample.p}`;
      for (const key of ["left", "top", "width", "height"])
        check(
          near(sample.rect[key], want[key]),
          `${label} ${key} ${fmt(sample.rect[key])} ≠ ${fmt(want[key])}`,
        );
      check(
        near(alphaOf(sample.background), revealOpacity(t), 0.02),
        `${label} reveal ${sample.background} ≠ ${fmt(revealOpacity(t))}`,
      );
      check(
        near(sample.radius, windowRadius(t, room.format), 0.05),
        `${label} radius ${sample.radius} ≠ ${windowRadius(t, room.format)}`,
      );
      if (t > 0)
        check(sample.zIndex === "20", `${label} z-index ${sample.zIndex}`);
      const opacity = textOpacity(p);
      for (const block of sample.texts) {
        check(
          near(block.opacity, opacity, 0.01),
          `${label} text opacity ${block.opacity} ≠ ${fmt(opacity)}`,
        );
        const gone = opacity === 0;
        check(
          (block.visibility === "hidden") === gone && block.inert === gone,
          `${label} text visibility ${block.visibility} inert ${block.inert}`,
        );
      }
      check(
        sample.viewTop >= room.header - TOL,
        `${label} window top ${fmt(sample.viewTop)} above the header`,
      );
      check(sample.hscroll === 0, `${label} horizontal scroll ${sample.hscroll}`);
      rows.push(
        `p=${sample.p} t=${fmt(t)} rect=${fmt(sample.rect.left)},${fmt(sample.rect.top)} ${fmt(sample.rect.width)}×${fmt(sample.rect.height)} reveal=${fmt(alphaOf(sample.background))} r=${sample.radius} text=${fmt(sample.texts[0].opacity)}`,
      );
    }
    log(`${tag} ${id} (${room.format}) S=${fmt(slot.left)},${fmt(slot.top)} ${fmt(slot.width)}×${fmt(slot.height)} F=${fmt(full.left)},${fmt(full.top)} ${fmt(full.width)}×${fmt(full.height)}`);
    for (const row of rows) log(`  ${row}`);
  }

  // The current section is the room for its whole track (§ 6.5: the header's language link)
  if (viewport.width === 1440) {
    const current = await page.evaluate(async () => {
      const root = document.documentElement;
      root.style.scrollSnapType = "none";
      root.style.scrollBehavior = "auto";
      const wait = () => new Promise((resolve) => setTimeout(resolve, 150));
      const track = document.getElementById("p04");
      const top = track.getBoundingClientRect().top + window.scrollY;
      const travel = track.offsetHeight - track.querySelector(".room-stage").offsetHeight;
      const seen = [];
      for (const p of [0, 0.3, 0.6, 0.99]) {
        window.scrollTo(0, top + p * travel);
        await wait();
        const link = document.querySelector('header a[hreflang="en"]');
        seen.push(link?.getAttribute("href") ?? "");
      }
      root.style.scrollSnapType = "";
      root.style.scrollBehavior = "";
      return seen;
    });
    check(
      current.every((href) => href.endsWith("#p04")),
      `current section along p04: ${current.join(" ")}`,
    );
    log(`1440 current section along p04: ${current.join(" ")}`);
  }
  await context.close();
}

// 2 · Reduced motion at >=1024: one viewport per room, no sticky, window in its slot
for (const viewport of DESKTOP) {
  const { context, page } = await open(viewport, "reduce");
  const tag = `${viewport.width}×${viewport.height} reduce`;
  const heights = [];
  for (const id of ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09"]) {
    const room = await sampleRoom(page, id, [0, 0.5, 1]);
    const height = await page.evaluate(
      (id) => document.getElementById(id).offsetHeight,
      id,
    );
    heights.push(`${id}=${height}`);
    check(room.position !== "sticky", `${tag} ${id} sticky`);
    check(room.travel === 0, `${tag} ${id} has a track (${room.travel})`);
    check(height >= viewport.height - TOL, `${tag} ${id} shorter than a viewport`);
    for (const sample of room.samples) {
      check(sample.inlinePosition === "", `${tag} ${id} window moved`);
      check(
        sample.texts.every((t) => t.opacity === 1 && t.visibility === "visible"),
        `${tag} ${id} text not visible`,
      );
    }
  }
  log(`${tag}: ${heights.join(" ")}`);
  await context.close();
}

// 3 · 1280×600: rooms that do not fit stay static; nothing clipped, every link reachable
{
  const viewport = { width: 1280, height: 600 };
  const { context, page } = await open(viewport);
  const rooms = await page.evaluate(() =>
    [...document.querySelectorAll(".room-track")].map((track) => {
      const box = track.getBoundingClientRect();
      const parts = [
        ...track.querySelectorAll("[data-room-text], [data-room-slot] figure"),
      ];
      const clipped = parts.filter((part) => {
        const r = part.getBoundingClientRect();
        return r.top < box.top - 1 || r.bottom > box.bottom + 1;
      }).length;
      return {
        id: track.id,
        isStatic: track.hasAttribute("data-room-static"),
        clipped,
      };
    }),
  );
  for (const room of rooms) check(room.clipped === 0, `1280×600 ${room.id} clipped`);
  log(
    `1280×600: ${rooms.map((r) => `${r.id}:${r.isStatic ? "static" : "track"}`).join(" ")}`,
  );
  // Tab through every link of the rooms: each one visible, in the viewport, not inert
  const links = await page.evaluate(
    () => document.querySelectorAll(".room-track a").length,
  );
  await page.evaluate(() => {
    const first = document.querySelector(".room-track a");
    first.focus();
  });
  let reached = 0;
  for (let i = 0; i < links; i++) {
    await page.waitForTimeout(450);
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      const r = el.getBoundingClientRect();
      const block = el.closest("[data-room-text]");
      return {
        inRoom: Boolean(el.closest(".room-track")),
        visible:
          r.top >= -1 &&
          r.bottom <= window.innerHeight + 1 &&
          (!block ||
            (Number(getComputedStyle(block).opacity) === 1 && !block.inert)),
        label: el.getAttribute("aria-label") ?? el.textContent,
      };
    });
    if (!state.inRoom) break;
    reached++;
    check(state.visible, `1280×600 link not visible: ${state.label}`);
    await page.keyboard.press("Tab");
  }
  check(reached === links, `1280×600 reached ${reached}/${links} links`);
  log(`1280×600 links reached by Tab: ${reached}/${links}`);
  await context.close();
}

// 4 · Stacked clip below 1024 (§ 6.2), motion allowed and reduced
for (const reducedMotion of ["no-preference", "reduce"]) {
  for (const viewport of STACKED) {
    const { context, page } = await open(viewport, reducedMotion);
    const tag = `${viewport.width}×${viewport.height}${reducedMotion === "reduce" ? " reduce" : ""}`;
    const samples = await page.evaluate(async () => {
      const root = document.documentElement;
      root.style.scrollBehavior = "auto";
      const frames = () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      const out = [];
      for (const figure of document.querySelectorAll(
        ".room-track [data-room-slot] figure",
      )) {
        const id = figure.closest(".room-track").id;
        for (const at of [1.02, 0.9, 0.725, 0.55, 0.3]) {
          const box = figure.getBoundingClientRect();
          const center = box.top + window.scrollY + box.height / 2;
          window.scrollTo(0, center - at * window.innerHeight);
          await frames();
          const now = figure.getBoundingClientRect();
          out.push({
            id,
            at,
            center: now.top + now.height / 2,
            viewport: window.innerHeight,
            clip: getComputedStyle(figure).clipPath,
            hscroll: root.scrollWidth - root.clientWidth,
          });
        }
      }
      root.style.scrollBehavior = "";
      return out;
    });
    const seen = [];
    for (const sample of samples) {
      const match = sample.clip.match(/inset\(([\d.]+)%/);
      const inset = sample.clip === "none" ? 0 : match ? Number(match[1]) : Number.NaN;
      const want =
        reducedMotion === "reduce"
          ? 0
          : stackedInset(sample.center, sample.viewport) * 100;
      check(
        near(inset, want, 0.2),
        `${tag} ${sample.id} at ${sample.at}: clip ${sample.clip} ≠ ${fmt(want)}%`,
      );
      check(sample.hscroll === 0, `${tag} ${sample.id} horizontal scroll`);
      if (sample.id === "p01") seen.push(`${sample.at}:${fmt(inset)}%`);
    }
    log(`${tag} p01 clip by center position: ${seen.join(" ")}`);
    await context.close();
  }
}

// 4b · No horizontal scroll at 320 anywhere on the page
{
  const { context, page } = await open({ width: 320, height: 700 });
  const worst = await page.evaluate(async () => {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    let max = 0;
    for (let y = 0; y < root.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      max = Math.max(max, root.scrollWidth - root.clientWidth);
    }
    return max;
  });
  check(worst === 0, `320: horizontal scroll ${worst}`);
  log(`320×700: widest horizontal overflow ${worst}px`);
  await context.close();
}

// 5 · The entrance moment on load (§ 6.3): sampled every frame from the first one
const sampler = () => {
  const samples = [];
  window.__entrance = samples;
  const started = performance.now();
  function read(band) {
    if (!band) return null;
    const cs = getComputedStyle(band);
    const shown = cs.display !== "none" && cs.visibility === "visible";
    return { shown, opacity: Number(cs.opacity), x: band.getBoundingClientRect().left };
  }
  function tick() {
    const staticBand = document.querySelector(".entrance-band");
    if (staticBand) {
      samples.push({
        at: performance.now() - started,
        static: read(staticBand),
        // The layer's wrapper, not <html>, which carries the same attribute once it runs
        layer: read(document.querySelector("div[data-light-layer] > .light-band")),
        items: [...document.querySelectorAll(".entrance-items > *")].map((item) =>
          Number(getComputedStyle(item).opacity),
        ),
      });
    }
    if (performance.now() - started < 2500) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
};

for (const reducedMotion of ["no-preference", "reduce"]) {
  const viewport = { width: 1440, height: 900 };
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  await page.addInitScript(sampler);
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(2600);
  const samples = await page.evaluate(() => window.__entrance);
  const tag = `entrance${reducedMotion === "reduce" ? " reduce" : ""}`;
  const first = samples[0];
  if (reducedMotion === "reduce") {
    check(
      first.static.shown && first.static.opacity === 1,
      `${tag}: band not final on the first frame`,
    );
    check(first.items.every((o) => o === 1), `${tag}: text not visible on the first frame`);
    log(`${tag}: first frame band opacity ${first.static.opacity}, items ${first.items.join(",")}`);
  } else {
    let lastX = Number.POSITIVE_INFINITY;
    let lastOpacity = 0;
    let handover = -1;
    const reachedAt = [-1, -1, -1, -1];
    samples.forEach((sample, index) => {
      const visible = [sample.static, sample.layer].filter((b) => b?.shown);
      check(visible.length === 1, `${tag} frame ${index}: ${visible.length} bands visible`);
      const band = visible[0];
      if (band) {
        check(band.x <= lastX + TOL, `${tag} frame ${index}: x went back ${fmt(lastX)} → ${fmt(band.x)}`);
        check(band.opacity >= lastOpacity - 0.001, `${tag} frame ${index}: opacity went back`);
        lastX = Math.min(lastX, band.x);
        lastOpacity = Math.max(lastOpacity, band.opacity);
        if (handover < 0 && band === sample.layer) handover = sample.at;
      }
      sample.items.forEach((o, i) => {
        if (reachedAt[i] < 0 && o >= 0.999) reachedAt[i] = sample.at;
      });
    });
    check(reachedAt.every((at) => at >= 0), `${tag}: an item never reached opacity 1`);
    check(
      reachedAt.every((at, i) => i === 0 || at >= reachedAt[i - 1]),
      `${tag}: items out of order ${reachedAt.map(fmt).join(",")}`,
    );
    check(handover >= 0, `${tag}: the fixed layer never took over`);
    log(
      `${tag}: ${samples.length} frames, first band opacity ${fmt(first.static.opacity)} x ${fmt(first.static.x)}, final x ${fmt(lastX)}, layer took over at ${fmt(handover)}ms, items at 1: ${reachedAt.map(fmt).join(" / ")}ms`,
    );
  }
  await context.close();
}

// 6 · Keyboard path, anchors and the wheel against proximity snap (1440×900)
{
  const { context, page } = await open({ width: 1440, height: 900 });
  const focusState = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      const block = el?.closest("[data-room-text]");
      const r = el.getBoundingClientRect();
      return {
        room: el.closest(".room-track")?.id ?? el.tagName,
        visible:
          r.top >= -1 &&
          r.bottom <= window.innerHeight + 1 &&
          (!block ||
            (Number(getComputedStyle(block).opacity) === 1 &&
              !block.inert &&
              getComputedStyle(block).visibility === "visible")),
      };
    });
  for (let n = 1; n <= 8; n++) {
    const id = `p0${n}`;
    const next = `p0${n + 1}`;
    await page.evaluate((id) => {
      document.getElementById(id).scrollIntoView({ behavior: "instant" });
      const links = document.querySelectorAll(`#${id} a`);
      links[links.length - 1].focus();
    }, id);
    await page.waitForTimeout(500);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(900);
    const forward = await focusState();
    check(
      forward.room === next && forward.visible,
      `Tab from ${id} landed on ${forward.room} visible=${forward.visible}`,
    );
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(900);
    const back = await focusState();
    check(
      back.room === id && back.visible,
      `Shift+Tab from ${next} landed on ${back.room} visible=${back.visible}`,
    );
  }
  log("keyboard: Tab / Shift+Tab between rooms 01–09 checked");

  // A focused link whose text leaves never keeps the focus
  const blurred = await page.evaluate(async () => {
    const root = document.documentElement;
    root.style.scrollSnapType = "none";
    root.style.scrollBehavior = "auto";
    const track = document.getElementById("p05");
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    track.querySelector("a").focus();
    window.scrollTo(0, top + 0.5 * window.innerHeight);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const el = document.activeElement;
    root.style.scrollSnapType = "";
    root.style.scrollBehavior = "";
    return { tag: el.tagName, inert: Boolean(el.closest("[inert]")) };
  });
  check(!blurred.inert, `focus stayed on inert text (${blurred.tag})`);
  log(`focus when its text leaves: ${blurred.tag}, inert=${blurred.inert}`);

  // Anchors: "Ver proyectos" and the FloorNav land at the track's start, text visible
  for (const [selector, id] of [
    ['#inicio a.btn-secondary, #inicio a[href="#p01"]', "p01"],
    ['#inicio nav a[href="#p05"]', "p05"],
    ['#inicio nav a[href="#p09"]', "p09"],
  ]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.locator(selector).first().click();
    await page.waitForTimeout(1800);
    const landed = await page.evaluate((id) => {
      const track = document.getElementById(id);
      const text = track.querySelector("[data-room-text]");
      return {
        offset: track.getBoundingClientRect().top,
        opacity: Number(getComputedStyle(text).opacity),
        focus: document.activeElement?.id ?? document.activeElement?.tagName,
      };
    }, id);
    check(
      near(landed.offset, 0, 2) && landed.opacity === 1 && landed.focus === `${id}-title`,
      `anchor ${id}: offset ${fmt(landed.offset)} opacity ${landed.opacity} focus ${landed.focus}`,
    );
    log(`anchor #${id}: track top at ${fmt(landed.offset)}px, text ${landed.opacity}, focus ${landed.focus}`);
  }

  // A real wheel halfway through a track: proximity snap must not pull it back
  for (const [id, distance] of [
    ["p03", 450],
    ["p03", 300],
    ["p03", 600],
  ]) {
    const top = await page.evaluate((id) => {
      const track = document.getElementById(id);
      const y = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "instant" });
      return y;
    }, id);
    await page.waitForTimeout(600);
    await page.mouse.move(700, 450);
    for (let moved = 0; moved < distance; moved += 100)
      await page.mouse.wheel(0, Math.min(100, distance - moved));
    await page.waitForTimeout(1500);
    const y = await page.evaluate(() => window.scrollY);
    const offset = y - top;
    check(
      Math.abs(offset - distance) <= 40,
      `wheel ${distance}px into ${id} rested at ${fmt(offset)}px`,
    );
    log(`wheel ${distance}px into ${id}: rests at ${fmt(offset)}px (p ${fmt(offset / 900)})`);
  }

  // Space, PageDown, arrows, Home and End scroll natively
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.activeElement?.blur();
  });
  await page.waitForTimeout(400);
  const keys = [];
  for (const key of ["Space", "PageDown", "ArrowDown", "ArrowUp", "End", "Home"]) {
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press(key);
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => window.scrollY);
    const max = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    const ok =
      key === "Home"
        ? after === 0
        : key === "End"
          ? near(after, max, 2)
          : key === "ArrowUp"
            ? after < before
            : after > before;
    check(ok, `${key}: ${before} → ${after}`);
    keys.push(`${key} ${fmt(before)}→${fmt(after)}`);
  }
  log(`keys: ${keys.join(" · ")}`);
  await context.close();
}

await browser.close();
log(`\n${checks - failures.length}/${checks} checks passed`);
if (failures.length > 0) {
  log(`${failures.length} failed:`);
  for (const failure of failures.slice(0, 60)) log(`  ✗ ${failure}`);
  process.exit(1);
}
