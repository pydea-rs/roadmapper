// charts.js — tiny, dependency-free SVG chart primitives for the Insights view.
//
// No external libraries (the app is offline-first and CSP-locked): everything is
// hand-built SVG. Colours are passed as CSS color strings (e.g. "var(--accent)")
// and applied through inline `style` — SVG presentation attributes don't resolve
// var(), but the style property does, so the charts stay theme-aware for free.
//
// Every chart returns a DOM node ready to append. Charts scale to their container
// via a fixed viewBox + width:100%; the caller owns height through CSS/aspect.

import { el } from "./util.js";

const NS = "http://www.w3.org/2000/svg";

/** svg("path", {d, style, class}) — createElementNS with attribute sugar. */
function s(tag, attrs) {
  const n = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "text") n.textContent = v;
    else if (k === "class") n.setAttribute("class", v);
    else n.setAttribute(k, v);
  }
  return n;
}
function title(node, text) { if (text) node.append(s("title", { text })); return node; }

const round = (n, p = 1) => { const m = 10 ** p; return Math.round(n * m) / m; };

/* ================================================================== *
 *  Multi-line chart (the burn-up flagship)
 * ================================================================== */
/**
 * lineChart({
 *   series: [{ name, color, points:[{x,y}], dashed, fill }],   // x in [0,xMax], y in [0,yMax]
 *   xMax, yMax=100, todayX, xTicks:[{x,label}], yTicks:[..],
 *   yFmt=(v)=>v+"%", xLabelFor=(ix)=>string, legend=true, height=320
 * })
 * Returns a positioned wrapper (svg + hover crosshair + tooltip).
 */
export function lineChart(opts) {
  const {
    series = [], xMax = 1, yMax = 100, todayX = null,
    xTicks = [], yTicks = [0, 25, 50, 75, 100],
    yFmt = v => v + "%", xLabelFor = null, legend = true, height = 320, axisFont = 15,
  } = opts;

  // viewBox is 1000 wide; height in the SAME units keeps the display aspect ratio
  // (width:100%/height:auto), so the chart shows ≈`height`px tall at full width.
  // Text lives in viewBox units, so it scales with the chart: a WIDE chart (near
  // 1:1 display scale) needs a SMALL axisFont, a narrow grid chart a larger one,
  // to land at roughly the same on-screen pixel size.
  const W = 1000, H = height;
  const padL = 46, padR = 18, padT = 22, padB = 42;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const X = x => padL + (xMax > 0 ? (x / xMax) : 0) * plotW;
  const Y = y => padT + (1 - (yMax > 0 ? y / yMax : 0)) * plotH;

  const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg linechart",
    preserveAspectRatio: "none", role: "img" });
  svg.style.fontSize = axisFont + "px";

  // horizontal gridlines + y labels
  for (const yt of yTicks) {
    svg.append(s("line", { x1: padL, y1: Y(yt), x2: W - padR, y2: Y(yt), class: "grid" }));
    svg.append(s("text", { x: padL - 8, y: Y(yt) + 4, class: "axis y", "text-anchor": "end", text: yFmt(yt) }));
  }
  // x ticks (month markers)
  for (const xt of xTicks) {
    svg.append(s("line", { x1: X(xt.x), y1: padT, x2: X(xt.x), y2: H - padB, class: "grid faint" }));
    svg.append(s("text", { x: X(xt.x), y: H - padB + 22, class: "axis x", "text-anchor": "middle", text: xt.label }));
  }
  // today marker
  if (todayX != null && todayX >= 0 && todayX <= xMax) {
    svg.append(s("line", { x1: X(todayX), y1: padT - 4, x2: X(todayX), y2: H - padB, class: "today-mark" }));
    svg.append(s("text", { x: X(todayX), y: padT - 8, class: "axis today", "text-anchor": "middle", text: "Today" }));
  }

  // series (draw fills first, then lines on top)
  const pathFor = pts => pts.map((p, i) => `${i ? "L" : "M"}${round(X(p.x))} ${round(Y(p.y))}`).join(" ");
  for (const ser of series) {
    if (!ser.points || ser.points.length < 1) continue;
    if (ser.fill) {
      const base = Y(0);
      const d = pathFor(ser.points) + ` L${round(X(ser.points[ser.points.length - 1].x))} ${round(base)}`
        + ` L${round(X(ser.points[0].x))} ${round(base)} Z`;
      const area = s("path", { d, class: "area" });
      area.style.fill = ser.color; area.style.opacity = ".10";
      svg.append(area);
    }
  }
  for (const ser of series) {
    if (!ser.points || ser.points.length < 1) continue;
    const line = s("path", { d: pathFor(ser.points), class: "line" + (ser.dashed ? " dashed" : "") });
    line.style.stroke = ser.color;
    if (ser.w) line.style.strokeWidth = ser.w;
    if (ser.faint) line.style.opacity = ".55";
    svg.append(line);
    // endpoint dot (skip on faint baselines to reduce clutter)
    if (!ser.faint) {
      const last = ser.points[ser.points.length - 1];
      const dot = s("circle", { cx: X(last.x), cy: Y(last.y), r: 5, class: "endpt" });
      dot.style.fill = ser.color;
      svg.append(dot);
    }
  }

  // ---- hover crosshair + tooltip ----
  const cross = s("line", { x1: 0, y1: padT, x2: 0, y2: H - padB, class: "crosshair" });
  cross.style.opacity = "0";
  svg.append(cross);
  const hoverDots = series.map(ser => {
    const c = s("circle", { r: 5, class: "hoverdot" });
    c.style.fill = ser.color; c.style.opacity = "0";
    svg.append(c); return c;
  });
  // per-series x→y lookup for snapping
  const maps = series.map(ser => { const m = new Map(); for (const p of ser.points) m.set(p.x, p.y); return m; });

  const wrap = el("div.chart-wrap");
  wrap.append(svg);
  const tip = el("div.chart-tip"); tip.style.opacity = "0"; wrap.append(tip);

  const overlay = s("rect", { x: padL, y: padT, width: plotW, height: plotH, class: "hit", fill: "transparent" });
  svg.append(overlay);

  const hide = () => { cross.style.opacity = "0"; tip.style.opacity = "0"; hoverDots.forEach(d => d.style.opacity = "0"); };
  const move = ev => {
    const r = svg.getBoundingClientRect();
    const relX = (ev.clientX - r.left) / r.width * W;      // back to viewBox space
    let ix = Math.round(((relX - padL) / plotW) * xMax);
    ix = Math.max(0, Math.min(xMax, ix));
    cross.setAttribute("x1", X(ix)); cross.setAttribute("x2", X(ix)); cross.style.opacity = "1";
    const rows = [];
    series.forEach((ser, i) => {
      const y = maps[i].get(ix);
      if (y == null) { hoverDots[i].style.opacity = "0"; return; }
      hoverDots[i].setAttribute("cx", X(ix)); hoverDots[i].setAttribute("cy", Y(y)); hoverDots[i].style.opacity = "1";
      rows.push(`<span class="tk"><i style="background:${ser.color}"></i>${ser.name}</span><b>${yFmt(round(y))}</b>`);
    });
    const label = xLabelFor ? xLabelFor(ix) : `#${ix}`;
    tip.innerHTML = `<div class="tt-head">${label}</div><div class="tt-rows">${rows.join("")}</div>`;
    tip.style.opacity = "1";
    // position tooltip within wrap
    const px = (X(ix) / W) * r.width;
    tip.style.left = Math.min(Math.max(px, 8), r.width - 8) + "px";
    tip.style.transform = px > r.width * 0.62 ? "translate(-100%, 0)" : "translate(8px, 0)";
  };
  overlay.addEventListener("pointermove", move);
  overlay.addEventListener("pointerdown", move);
  overlay.addEventListener("pointerleave", hide);
  // touch fires no pointerleave after a tap — hide on lift/cancel so the crosshair
  // + tooltip don't stay stuck painted over the chart.
  overlay.addEventListener("pointerup", hide);
  overlay.addEventListener("pointercancel", hide);

  const out = el("div.chart-line");
  out.append(wrap);
  if (legend) out.append(chartLegend(series.map(ser => ({ name: ser.name, color: ser.color, dashed: ser.dashed }))));
  return out;
}

export function chartLegend(items) {
  const lg = el("div.chart-legend");
  for (const it of items) {
    const key = el("span.lg-key" + (it.dashed ? ".dashed" : ""));
    const swatch = el("i"); swatch.style.background = it.color; if (it.dashed) swatch.style.setProperty("--c", it.color);
    key.append(swatch, el("span", { text: it.name }));
    lg.append(key);
  }
  return lg;
}

/* ================================================================== *
 *  Bar chart (daily effort, weekday productivity, punctuality)
 * ================================================================== */
/**
 * barChart({ bars:[{label,value,segments:[{value,color}],color,title,mark}],
 *   yMax, yFmt, avg, height=240, barLabelEvery=1, colorFor })
 * Stacked when segments present; a dashed avg line when `avg` given.
 */
export function barChart(opts) {
  const { bars = [], yMax: yMaxIn, yFmt = v => v, avg = null,
    height = 240, barLabelEvery = 1, gridTicks = 4, axisFont = 26 } = opts;
  const W = 1000, H = height;
  const padL = 44, padR = 12, padT = 14, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxVal = yMaxIn || Math.max(1, ...bars.map(b => b.segments
    ? b.segments.reduce((a, s2) => a + s2.value, 0) : b.value));
  const Y = v => padT + (1 - v / maxVal) * plotH;
  const n = bars.length || 1;
  const slot = plotW / n;
  const bw = Math.max(2, Math.min(slot * 0.72, 46));

  const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg barchart", preserveAspectRatio: "none", role: "img" });
  svg.style.fontSize = axisFont + "px";
  // gridlines + y labels
  for (let i = 0; i <= gridTicks; i++) {
    const v = (maxVal / gridTicks) * i;
    svg.append(s("line", { x1: padL, y1: Y(v), x2: W - padR, y2: Y(v), class: "grid" }));
    svg.append(s("text", { x: padL - 8, y: Y(v) + 4, class: "axis y", "text-anchor": "end", text: yFmt(round(v)) }));
  }
  bars.forEach((b, i) => {
    const cx = padL + slot * i + slot / 2;
    const x = cx - bw / 2;
    const segs = b.segments || [{ value: b.value, color: b.color || "var(--accent)" }];
    let acc = 0;
    for (const sg of segs) {
      if (sg.value <= 0) continue;
      const y0 = Y(acc), y1 = Y(acc + sg.value);
      const rect = s("rect", { x: round(x), y: round(y1), width: round(bw), height: round(Math.max(0, y0 - y1)),
        rx: 3, class: "bar" });
      rect.style.fill = sg.color;
      title(rect, sg.title || b.title || `${b.label}: ${yFmt(sg.value)}`);
      svg.append(rect);
      acc += sg.value;
    }
    if (barLabelEvery && i % barLabelEvery === 0) {
      svg.append(s("text", { x: cx, y: H - padB + 20, class: "axis x", "text-anchor": "middle", text: b.label }));
    }
  });
  if (avg != null && avg > 0 && avg <= maxVal) {
    svg.append(s("line", { x1: padL, y1: Y(avg), x2: W - padR, y2: Y(avg), class: "avg-line" }));
    svg.append(s("text", { x: W - padR, y: Y(avg) - 6, class: "axis avg", "text-anchor": "end", text: "avg " + yFmt(round(avg)) }));
  }
  const out = el("div.chart-bars");
  out.append(svg);
  return out;
}

/* ================================================================== *
 *  Donut (completion breakdown, category split)
 * ================================================================== */
export function donut(opts) {
  const { slices = [], centerTop = "", centerBottom = "", thickness = 26, size = 220 } = opts;
  const total = slices.reduce((a, s2) => a + s2.value, 0);
  const R = 100, r = R - thickness, cx = 0, cy = 0;
  const svg = s("svg", { viewBox: `-120 -120 240 240`, class: "chart-svg donut", role: "img",
    style: `max-width:${size}px` });

  if (total <= 0) {
    const ring = s("circle", { cx, cy, r: (R + r) / 2, class: "donut-empty" });
    ring.setAttribute("fill", "none"); ring.style.strokeWidth = thickness;
    svg.append(ring);
  } else {
    let a0 = -Math.PI / 2;                         // start at 12 o'clock
    for (const sl of slices) {
      if (sl.value <= 0) continue;
      const frac = sl.value / total;
      const a1 = a0 + frac * Math.PI * 2;
      const large = frac > 0.5 ? 1 : 0;
      const p = (ang, rad) => `${round(Math.cos(ang) * rad, 2)} ${round(Math.sin(ang) * rad, 2)}`;
      // full circle needs two arcs (a single 360° arc won't render)
      let d;
      if (frac >= 0.9999) {
        d = `M ${p(a0, R)} A ${R} ${R} 0 1 1 ${p(a0 + Math.PI, R)} A ${R} ${R} 0 1 1 ${p(a0, R)}`
          + ` L ${p(a0, r)} A ${r} ${r} 0 1 0 ${p(a0 + Math.PI, r)} A ${r} ${r} 0 1 0 ${p(a0, r)} Z`;
      } else {
        d = `M ${p(a0, R)} A ${R} ${R} 0 ${large} 1 ${p(a1, R)} L ${p(a1, r)} A ${r} ${r} 0 ${large} 0 ${p(a0, r)} Z`;
      }
      const seg = s("path", { d, class: "donut-seg" });
      seg.style.fill = sl.color;
      title(seg, `${sl.label}: ${sl.value} (${Math.round(frac * 100)}%)`);
      svg.append(seg);
      a0 = a1;
    }
  }
  if (centerTop) svg.append(s("text", { x: 0, y: -2, class: "donut-c-top", "text-anchor": "middle", text: centerTop }));
  if (centerBottom) svg.append(s("text", { x: 0, y: 20, class: "donut-c-bot", "text-anchor": "middle", text: centerBottom }));

  const legend = el("div.donut-legend");
  for (const sl of slices) {
    if (sl.hideZero && sl.value <= 0) continue;
    const row = el("div.dl-row");
    const sw = el("i.dl-sw"); sw.style.background = sl.color;
    row.append(sw, el("span.dl-name", { text: sl.label }),
      el("span.dl-val", { text: String(sl.value) + (total ? ` · ${Math.round((sl.value / total) * 100)}%` : "") }));
    legend.append(row);
  }
  const out = el("div.chart-donut");
  out.append(svg, legend);
  return out;
}

/* ================================================================== *
 *  Horizontal bars (objectives, per-roadmap totals) — HTML, not SVG
 * ================================================================== */
export function hbars(rows) {
  const box = el("div.hbars");
  for (const r of rows) {
    const pctv = Math.max(0, Math.min(100, r.max ? (r.value / r.max) * 100 : r.value));
    const row = el("div.hbar-row");
    const head = el("div.hbar-head");
    head.append(el("span.hbar-name", { text: r.label }));
    head.append(el("span.hbar-val", { text: r.valText != null ? r.valText : Math.round(pctv) + "%" }));
    const track = el("div.hbar-track");
    const fill = el("i.hbar-fill"); fill.style.width = pctv + "%";
    if (r.color) fill.style.background = r.color;
    track.append(fill);
    row.append(head, track);
    if (r.sub) row.append(el("div.hbar-sub", { text: r.sub }));
    box.append(row);
  }
  return box;
}
