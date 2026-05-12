const svg = document.getElementById("preview-svg");
const viewport = document.getElementById("viewport");
const controls = document.getElementById("controls");
const sectionList = document.getElementById("section-list");
const addSectionButton = document.getElementById("add-section");
const fitViewButton = document.getElementById("fit-view");
const exportSvgButton = document.getElementById("export-svg");
const exportPdfButton = document.getElementById("export-pdf");
const configSelect = document.getElementById("config-select");
const importConfigButton = document.getElementById("import-config");
const exportConfigButton = document.getElementById("export-config");
const configFileInput = document.getElementById("config-file");
const languageToggleButton = document.getElementById("language-toggle");
const hintCard = document.getElementById("hint-card");
const hintArrowOverlay = document.getElementById("hint-arrow-overlay");
const hintArrowLine = document.getElementById("hint-arrow-line");
const patternSize = document.getElementById("pattern-size");

const NS = "http://www.w3.org/2000/svg";
const CONFIG_STORAGE_KEY = "mutex-tech-bellow-configs-v2";
const CONFIG_FIELDS = ["wif", "hif", "wof", "hof", "wir", "hir", "wor", "hor", "woo", "odf", "odr", "frhd"];
const CONFIG_CHECKBOXES = ["enhanceMountFrame", "enableOverlap", "trimOverlapOutside"];
const BUILTIN_CONFIGS = [
  {
    id: "linhof-master-technika",
    name: "Linhof master technika",
    builtin: true,
    params: {
      wif: 95,
      hif: 83.3,
      wof: 110,
      hof: 110,
      wir: 123.7,
      hir: 125.6,
      wor: 150,
      hor: 150,
      woo: 15,
      odf: 12,
      odr: 100,
      frhd: 8,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 6, nos: 4 },
        { lhs: 10.3, nos: 19 },
      ],
    },
  },
];
const DEFAULT_CONFIG = BUILTIN_CONFIGS[0];

let userConfigs = [];
let sections = cloneSections(DEFAULT_CONFIG.params.sections);
let lastPattern = null;
let fittedViewBox = null;
let currentViewBox = null;
let dragState = null;
let currentLang = "zh";
let activeHint = null;
let hintTimer = null;
let hintTargetIndex = 0;
let hintAnimationFrame = null;
let hintAnimatedEnd = null;
let hintAnimationStart = null;

const TEXT = {
  zh: {
    config: "配置",
    importConfig: "导入 JSON",
    exportConfig: "导出 JSON",
    frontSize: "前框尺寸",
    rearSize: "后框尺寸",
    sectionConfig: "节配置",
    overlap: "粘合带",
    enhanceMountFrame: "增强粘合框",
    enableOverlap: "启用粘合带",
    trimOverlapOutside: "移除粘合带以外的额外部分",
    heightDiff: "高度差",
    livePreview: "实时矢量预览",
    fitView: "适应窗口",
    exportSvg: "导出 SVG",
    exportPdf: "导出 PDF",
    sectionLhs: (index) => `半长 LHS${index + 1}`,
    sectionNos: (index) => `节数 NOS${index + 1}`,
    deleteSection: (index) => `删除第 ${index + 1} 组皮腔节`,
    addSection: "添加一组皮腔节",
    optionLabels: {
      wif: "内宽 WIF",
      hif: "内高 HIF",
      wof: "外宽 WOF",
      hof: "外高 HOF",
      wir: "内宽 WIR",
      hir: "内高 HIR",
      wor: "外宽 WOR",
      hor: "外高 HOR",
      woo: "粘合宽 WOO",
      odf: "前边距 ODF",
      odr: "后边距 ODR",
      frhd: "高度差 FRHD",
    },
  },
  en: {
    config: "Configuration",
    importConfig: "Import JSON",
    exportConfig: "Export JSON",
    frontSize: "Front Frame",
    rearSize: "Rear Frame",
    sectionConfig: "Sections",
    overlap: "Overlap",
    enhanceMountFrame: "Enhance mounting frames",
    enableOverlap: "Enable overlap strips",
    trimOverlapOutside: "Remove parts outside overlap strips",
    heightDiff: "Height Difference",
    livePreview: "Live vector preview",
    fitView: "Fit view",
    exportSvg: "Export SVG",
    exportPdf: "Export PDF",
    sectionLhs: (index) => `Half length LHS${index + 1}`,
    sectionNos: (index) => `Section count NOS${index + 1}`,
    deleteSection: (index) => `Delete section group ${index + 1}`,
    addSection: "Add section group",
    optionLabels: {
      wif: "Inner width WIF",
      hif: "Inner height HIF",
      wof: "Outer width WOF",
      hof: "Outer height HOF",
      wir: "Inner width WIR",
      hir: "Inner height HIR",
      wor: "Outer width WOR",
      hor: "Outer height HOR",
      woo: "Overlap width WOO",
      odf: "Front offset ODF",
      odr: "Rear offset ODR",
      frhd: "Height difference FRHD",
    },
  },
};

const OPTION_HELP = {
  wif: {
    zh: "前框内宽，决定顶面前端上底宽度，并影响前框开口宽度。",
    en: "Front inner width. It controls the front/top base of the top panel and the front opening width.",
  },
  hif: {
    zh: "前框内高，决定右/左侧面前端边长度。",
    en: "Front inner height. It controls the front edge length of the side panels.",
  },
  wof: {
    zh: "前框外宽，仅用于预览中的前框外尺寸参考虚线。",
    en: "Front outer width. Used by the dashed front outer-frame reference in preview.",
  },
  hof: {
    zh: "前框外高，仅用于预览中的前框外尺寸参考虚线。",
    en: "Front outer height. Used by the dashed front outer-frame reference in preview.",
  },
  wir: {
    zh: "后框内宽，决定顶面后端下底宽度，并影响后框开口宽度。",
    en: "Rear inner width. It controls the rear/bottom base of the top panel and rear opening width.",
  },
  hir: {
    zh: "后框内高，决定右/左侧面后端边长度。",
    en: "Rear inner height. It controls the rear edge length of the side panels.",
  },
  wor: {
    zh: "后框外宽，仅用于预览中的后框外尺寸参考虚线。",
    en: "Rear outer width. Used by the dashed rear outer-frame reference in preview.",
  },
  hor: {
    zh: "后框外高，仅用于预览中的后框外尺寸参考虚线。",
    en: "Rear outer height. Used by the dashed rear outer-frame reference in preview.",
  },
  woo: {
    zh: "粘合带宽度，决定侧面粘合带两条边之间的距离。",
    en: "Overlap strip width. It controls the distance between the two overlap strip edges.",
  },
  odf: {
    zh: "粘合带前边距，在前端边上定位粘合带起点。",
    en: "Front overlap offset. It positions the overlap strip on the front edge.",
  },
  odr: {
    zh: "粘合带后边距，在后端边上定位粘合带终点。",
    en: "Rear overlap offset. It positions the overlap strip on the rear edge.",
  },
  frhd: {
    zh: "前后组高度差，用于旋转侧面上下边，使右侧面满足指定高度差。",
    en: "Front-rear height difference. It rotates side-panel bases to match the requested offset.",
  },
  enhanceMountFrame: {
    zh: "在每个前后粘合框两侧增加与相邻折角法线相关的补强边。",
    en: "Adds reinforcement edges on both sides of every mounting frame using adjacent-fold normals.",
  },
  enableOverlap: {
    zh: "控制是否生成左右侧粘合带。",
    en: "Controls whether the left and right overlap strips are generated.",
  },
  trimOverlapOutside: {
    zh: "启用后会移除粘合带外侧的多余皮腔部分。",
    en: "When enabled, removes the extra bellows area outside the overlap strips.",
  },
  sectionLhs: {
    zh: "该组皮腔节的半长，决定本组折角深度和折线间距。",
    en: "Half length of this section group. It controls fold depth and spacing.",
  },
  sectionNos: {
    zh: "该组皮腔节数量，决定本组重复折角的数量。",
    en: "Section count for this group. It controls how many repeated folds are generated.",
  },
  configSelect: {
    zh: "选择内置或导入的参数配置。",
    en: "Select a built-in or imported parameter configuration.",
  },
  importConfig: {
    zh: "导入 JSON 配置，并加入配置下拉框。",
    en: "Import a JSON configuration and add it to the selector.",
  },
  exportConfig: {
    zh: "导出当前参数配置为 JSON。",
    en: "Export the current parameter configuration as JSON.",
  },
  addSection: {
    zh: "增加一组新的皮腔节长度和数量。",
    en: "Add another bellows section group with its own length and count.",
  },
  exportSvg: {
    zh: "导出当前展开图为 SVG，不包含预览文字和参考虚线。",
    en: "Export the current pattern as SVG without preview labels or reference guides.",
  },
  exportPdf: {
    zh: "打开打印导出流程，用当前展开图生成 PDF。",
    en: "Open the print flow to export the current pattern as PDF.",
  },
  fitView: {
    zh: "将预览缩放和平移重置为完整图案视图。",
    en: "Reset preview zoom and pan to fit the whole pattern.",
  },
};

function num(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return !["false", "0", "off", "no"].includes(value.toLowerCase());
  }
  if (value == null) {
    return fallback;
  }
  return Boolean(value);
}

function pt(x, y) {
  return { x, y };
}

function add(a, b) {
  return pt(a.x + b.x, a.y + b.y);
}

function sub(a, b) {
  return pt(a.x - b.x, a.y - b.y);
}

function mul(a, scale) {
  return pt(a.x * scale, a.y * scale);
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function cross(a, b) {
  return a.x * b.y - a.y * b.x;
}

function len(a) {
  return Math.hypot(a.x, a.y);
}

function unit(a) {
  const length = len(a) || 1;
  return pt(a.x / length, a.y / length);
}

function lerp(a, b, t) {
  return pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
}

function rotate(v, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return pt(v.x * c - v.y * s, v.x * s + v.y * c);
}

function pointString(points) {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(" ");
}

function pathString(points) {
  return points.map((p, index) => `${index ? "L" : "M"} ${round(p.x)} ${round(p.y)}`).join(" ");
}

function round(value) {
  return Number.parseFloat(value.toFixed(3));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cloneSections(sourceSections) {
  return sourceSections.map((section) => ({
    lhs: num(section.lhs, 1),
    nos: Math.max(1, Math.round(num(section.nos, 1))),
  }));
}

function loadUserConfigs() {
  try {
    const raw = window.localStorage?.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeConfig).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveUserConfigs() {
  try {
    window.localStorage?.setItem(CONFIG_STORAGE_KEY, JSON.stringify(userConfigs));
  } catch {
    // Local storage can be unavailable in private browsing or file sandbox contexts.
  }
}

function allConfigs() {
  return [...BUILTIN_CONFIGS, ...userConfigs];
}

function renderConfigOptions(selectedId = DEFAULT_CONFIG.id) {
  configSelect.innerHTML = "";
  allConfigs().forEach((config) => {
    const option = document.createElement("option");
    option.value = config.id;
    option.textContent = config.builtin ? `<${config.name}>` : config.name;
    configSelect.appendChild(option);
  });
  configSelect.value = selectedId;
}

function applyConfig(config) {
  CONFIG_FIELDS.forEach((field) => {
    const input = controls.querySelector(`[name="${field}"]`);
    if (input) {
      input.value = config.params[field];
    }
  });
  CONFIG_CHECKBOXES.forEach((field) => {
    const input = controls.querySelector(`[name="${field}"]`);
    if (input) {
      input.checked = Boolean(config.params[field]);
    }
  });
  sections = cloneSections(config.params.sections);
  renderSectionRows();
  renderPattern();
}

function currentConfigPayload() {
  const selected = allConfigs().find((config) => config.id === configSelect.value) || DEFAULT_CONFIG;
  return {
    version: 1,
    name: selected.name,
    units: "mm",
    params: readParams(),
  };
}

function normalizeConfig(source) {
  const params = source?.params || source;
  if (!params || typeof params !== "object") {
    return null;
  }

  const sectionsValue = Array.isArray(params.sections) ? params.sections : [];
  const normalized = {
    wif: Math.max(1, num(params.wif, DEFAULT_CONFIG.params.wif)),
    hif: Math.max(1, num(params.hif, DEFAULT_CONFIG.params.hif)),
    wof: Math.max(1, num(params.wof, DEFAULT_CONFIG.params.wof)),
    hof: Math.max(1, num(params.hof, DEFAULT_CONFIG.params.hof)),
    wir: Math.max(1, num(params.wir, DEFAULT_CONFIG.params.wir)),
    hir: Math.max(1, num(params.hir, DEFAULT_CONFIG.params.hir)),
    wor: Math.max(1, num(params.wor, DEFAULT_CONFIG.params.wor)),
    hor: Math.max(1, num(params.hor, DEFAULT_CONFIG.params.hor)),
    woo: Math.max(0, num(params.woo, DEFAULT_CONFIG.params.woo)),
    odf: Math.max(0, num(params.odf, DEFAULT_CONFIG.params.odf)),
    odr: Math.max(0, num(params.odr, DEFAULT_CONFIG.params.odr)),
    frhd: num(params.frhd, DEFAULT_CONFIG.params.frhd),
    enhanceMountFrame: bool(params.enhanceMountFrame, DEFAULT_CONFIG.params.enhanceMountFrame),
    enableOverlap: bool(params.enableOverlap, DEFAULT_CONFIG.params.enableOverlap),
    trimOverlapOutside: bool(params.trimOverlapOutside, DEFAULT_CONFIG.params.trimOverlapOutside),
    sections: cloneSections(sectionsValue.length ? sectionsValue : DEFAULT_CONFIG.params.sections),
  };
  const name = String(source?.name || "Imported configuration").trim() || "Imported configuration";

  return {
    id: source?.id && !BUILTIN_CONFIGS.some((config) => config.id === source.id)
      ? String(source.id)
      : uniqueConfigId(name),
    name,
    params: normalized,
  };
}

function uniqueConfigId(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "config";
  const existing = new Set(allConfigs().map((config) => config.id));
  let candidate = base;
  let index = 2;
  while (existing.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

function safeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bellow-config";
}

function setLabelText(label, text) {
  if (!label) {
    return;
  }
  if (label.classList?.contains?.("toggle-field")) {
    const span = label.querySelector("span");
    if (span) {
      span.textContent = text;
    }
    [...label.childNodes]
      .filter((node) => node.nodeType === 3)
      .forEach((node) => {
        node.nodeValue = "";
      });
    return;
  }
  if (!label.childNodes || !label.prepend) {
    label.textContent = text;
    return;
  }
  const textNode = [...label.childNodes].find((node) => node.nodeType === 3);
  if (textNode) {
    textNode.nodeValue = text;
  } else {
    label.prepend(document.createTextNode(text));
  }
}

function renderSectionRows() {
  sectionList.innerHTML = "";
  sections.forEach((section, index) => {
    const row = document.createElement("div");
    row.className = "section-row";
    row.innerHTML = `
      <label data-param="sectionLhs" data-section="${index}">${TEXT[currentLang].sectionLhs(index)}<input data-section="${index}" data-key="lhs" type="number" min="0.1" step="0.1" value="${section.lhs}" /></label>
      <label data-param="sectionNos" data-section="${index}">${TEXT[currentLang].sectionNos(index)}<input data-section="${index}" data-key="nos" type="number" min="1" step="1" value="${section.nos}" /></label>
      <button class="delete-section" type="button" data-remove="${index}" aria-label="${TEXT[currentLang].deleteSection(index)}">×</button>
    `;
    sectionList.appendChild(row);
  });
  annotateOptionControls();
}

function annotateOptionControls() {
  controls.querySelectorAll("input").forEach((input) => {
    const label = input.closest("label");
    if (!label) {
      return;
    }
    if (input.dataset.section != null) {
      label.dataset.param = input.dataset.key === "lhs" ? "sectionLhs" : "sectionNos";
      label.dataset.section = input.dataset.section;
      return;
    }
    label.dataset.param = input.name;
    delete label.dataset.section;
  });
  const configLabel = configSelect.closest("label");
  if (configLabel) {
    configLabel.dataset.param = "configSelect";
  }
  importConfigButton.dataset.hint = "importConfig";
  exportConfigButton.dataset.hint = "exportConfig";
  addSectionButton.dataset.hint = "addSection";
  exportSvgButton.dataset.hint = "exportSvg";
  exportPdfButton.dataset.hint = "exportPdf";
  fitViewButton.dataset.hint = "fitView";
}

function updateStaticLanguage() {
  const t = TEXT[currentLang];
  if (document.documentElement) {
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  }
  setLabelText(configSelect.closest("label"), t.config);
  importConfigButton.textContent = t.importConfig;
  exportConfigButton.textContent = t.exportConfig;
  document.querySelector(".control-section:nth-of-type(1) .section-title span").textContent = t.frontSize;
  document.querySelector(".control-section:nth-of-type(2) .section-title span").textContent = t.rearSize;
  document.querySelector(".control-section:nth-of-type(3) .section-title span").textContent = t.sectionConfig;
  document.querySelector(".control-section:nth-of-type(4) .section-title span").textContent = t.overlap;
  document.querySelector(".control-section:nth-of-type(5) .section-title span").textContent = t.heightDiff;
  document.querySelector(".status-label").textContent = t.livePreview;
  fitViewButton.textContent = t.fitView;
  exportSvgButton.textContent = t.exportSvg;
  exportPdfButton.textContent = t.exportPdf;
  addSectionButton.setAttribute("aria-label", t.addSection);

  Object.entries(t.optionLabels).forEach(([name, labelText]) => {
    const input = controls.querySelector(`[name="${name}"]`);
    if (input?.closest("label")) {
      setLabelText(input.closest("label"), labelText);
    }
  });

  setLabelText(controls.querySelector('[name="enhanceMountFrame"]').closest("label"), t.enhanceMountFrame);
  setLabelText(controls.querySelector('[name="enableOverlap"]').closest("label"), t.enableOverlap);
  setLabelText(controls.querySelector('[name="trimOverlapOutside"]').closest("label"), t.trimOverlapOutside);
  renderSectionRows();
  annotateOptionControls();
  if (activeHint) {
    showHint(activeHint.element);
  }
}

function hintContent(key) {
  return OPTION_HELP[key]?.[currentLang] || "";
}

function readParams() {
  const data = new FormData(controls);
  const cleanSections = sections
    .map((section) => ({
      lhs: Math.max(0.1, num(section.lhs, 1)),
      nos: Math.max(1, Math.round(num(section.nos, 1))),
    }))
    .filter((section) => section.lhs > 0 && section.nos > 0);

  return {
    wif: Math.max(1, num(data.get("wif"), 120)),
    hif: Math.max(1, num(data.get("hif"), 90)),
    wof: Math.max(1, num(data.get("wof"), 140)),
    hof: Math.max(1, num(data.get("hof"), 110)),
    wir: Math.max(1, num(data.get("wir"), 170)),
    hir: Math.max(1, num(data.get("hir"), 130)),
    wor: Math.max(1, num(data.get("wor"), 195)),
    hor: Math.max(1, num(data.get("hor"), 155)),
    woo: Math.max(0, num(data.get("woo"), 14)),
    odf: Math.max(0, num(data.get("odf"), 12)),
    odr: Math.max(0, num(data.get("odr"), 18)),
    frhd: num(data.get("frhd"), 0),
    enhanceMountFrame: Boolean(controls.querySelector('[name="enhanceMountFrame"]')?.checked),
    enableOverlap: Boolean(controls.querySelector('[name="enableOverlap"]')?.checked),
    trimOverlapOutside: Boolean(controls.querySelector('[name="trimOverlapOutside"]')?.checked),
    sections: cleanSections.length ? cleanSections : [{ lhs: 1, nos: 1 }],
  };
}

function buildTopModule(params) {
  const totalLeg = params.sections.reduce((sum, section) => sum + 2 * section.lhs * section.nos, 0);
  const halfDelta = (params.wir - params.wif) / 2;
  const minLeg = Math.abs(halfDelta) + 0.01;
  const effectiveLeg = Math.max(totalLeg, minLeg);
  const height = Math.sqrt(Math.max(0.01, effectiveLeg * effectiveLeg - halfDelta * halfDelta));
  const firstLhs = params.sections[0].lhs;
  const maxLhs = Math.max(...params.sections.map((section) => section.lhs));

  const mtl = pt(-params.wif / 2, 0);
  const mtr = pt(params.wif / 2, 0);
  const mbl = pt(-params.wir / 2, height);
  const mbr = pt(params.wir / 2, height);
  const center = pt(0, height / 2);

  const leftSeq = buildFoldSequence(mtl, mbl, params.sections, center);
  const rightSeq = buildFoldSequence(mtr, mbr, params.sections, center);
  const foldCount = leftSeq.length;

  const shapes = [];
  shapes.push(polyline([mtl, pt(mtl.x, -firstLhs), pt(mtr.x, -firstLhs), mtr], "cut-line"));
  shapes.push(polyline([mbl, pt(mbl.x, height + maxLhs), pt(mbr.x, height + maxLhs), mbr], "cut-line"));
  if (params.enhanceMountFrame) {
    shapes.push(...buildMountFrameEnhancements({
      leftCorner: mtl,
      rightCorner: mtr,
      outerY: -firstLhs,
      leftAdjacent: leftSeq[1],
      rightAdjacent: rightSeq[1],
    }));
    shapes.push(...buildMountFrameEnhancements({
      leftCorner: mbl,
      rightCorner: mbr,
      outerY: height + maxLhs,
      leftAdjacent: leftSeq[leftSeq.length - 2],
      rightAdjacent: rightSeq[rightSeq.length - 2],
    }));
  }
  shapes.push(polyline(leftSeq, "cut-line"));
  shapes.push(polyline(rightSeq, "cut-line"));

  for (let index = 0; index < foldCount; index += 1) {
    shapes.push(polyline([leftSeq[index], rightSeq[index]], "fold-line"));
  }

  const frontFrameHeight = Math.max(0, (params.hof - params.hif) / 2);
  const rearFrameHeight = Math.max(0, (params.hor - params.hir) / 2);
  if (frontFrameHeight > 0 || params.wof !== params.wif) {
    shapes.push(referencePolyline([
      pt(-params.wof / 2, -frontFrameHeight),
      pt(params.wof / 2, -frontFrameHeight),
      pt(params.wof / 2, 0),
      pt(-params.wof / 2, 0),
      pt(-params.wof / 2, -frontFrameHeight),
    ]));
    shapes.push(referenceText("前框外尺寸参考 WOF/HOF", 0, -frontFrameHeight - 4, { sourceOnly: true }));
  }
  if (rearFrameHeight > 0 || params.wor !== params.wir) {
    shapes.push(referencePolyline([
      pt(-params.wor / 2, height),
      pt(params.wor / 2, height),
      pt(params.wor / 2, height + rearFrameHeight),
      pt(-params.wor / 2, height + rearFrameHeight),
      pt(-params.wor / 2, height),
    ]));
    shapes.push(referenceText("后框外尺寸参考 WOR/HOR", 0, height + rearFrameHeight + 8, { sourceOnly: true }));
  }

  shapes.push(textShape("M 顶面", 0, height / 2, "label"));

  return {
    shapes,
    totalLeg,
    height,
    firstLhs,
    maxLhs,
    mtl,
    mtr,
    mbl,
    mbr,
    mlTop: pt(0, 0),
    mlBottom: pt(0, height),
    leftSeq,
    rightSeq,
    pmlt: leftSeq[1] || mtl,
    pmlb: leftSeq[leftSeq.length - 2] || mbl,
    pmrt: rightSeq[1] || mtr,
    pmrb: rightSeq[rightSeq.length - 2] || mbr,
  };
}

function buildFoldSequence(start, end, sectionsData, center) {
  const side = sub(end, start);
  const sideLength = len(side) || 1;
  const seq = [start];
  let normalA = unit(pt(-side.y, side.x));
  const mid = lerp(start, end, 0.5);
  if (dot(normalA, sub(center, mid)) > 0) {
    normalA = mul(normalA, -1);
  }

  let distance = 0;
  sectionsData.forEach((section) => {
    for (let index = 0; index < section.nos; index += 1) {
      const nextDistance = distance + 2 * section.lhs;
      const a = lerp(start, end, clamp(distance / sideLength, 0, 1));
      const b = lerp(start, end, clamp(nextDistance / sideLength, 0, 1));
      const apex = add(lerp(a, b, 0.5), mul(normalA, section.lhs));
      seq.push(apex, b);
      distance = nextDistance;
    }
  });
  return seq;
}

function buildMountFrameEnhancements({ leftCorner, rightCorner, outerY, leftAdjacent, rightAdjacent }) {
  const outerLeft = pt(leftCorner.x, outerY);
  const outerRight = pt(rightCorner.x, outerY);
  const leftIntersection = normalOuterIntersection(leftCorner, leftAdjacent, outerY);
  const rightIntersection = normalOuterIntersection(rightCorner, rightAdjacent, outerY);
  const shapes = [];

  if (leftIntersection) {
    shapes.push(polyline([leftCorner, leftIntersection], "cut-line"));
    shapes.push(polyline([outerLeft, leftIntersection], "cut-line"));
  }
  if (rightIntersection) {
    shapes.push(polyline([rightCorner, rightIntersection], "cut-line"));
    shapes.push(polyline([outerRight, rightIntersection], "cut-line"));
  }
  return shapes;
}

function normalOuterIntersection(corner, adjacent, outerY) {
  if (!adjacent) {
    return null;
  }
  const adjacentEdge = sub(adjacent, corner);
  if (len(adjacentEdge) < 0.001) {
    return null;
  }
  const normal = pt(-adjacentEdge.y, adjacentEdge.x);
  const intersection = lineIntersection(corner, add(corner, normal), pt(corner.x - 10000, outerY), pt(corner.x + 10000, outerY));
  if (!intersection || len(sub(intersection, corner)) < 0.001) {
    return null;
  }
  return intersection;
}

function buildPattern(params) {
  const top = buildTopModule(params);
  const shapes = top.shapes.filter((shape) => !shape.sourceOnly);
  const rightSide = buildRightSide(params, top);
  const { rsrt, rsrb } = rightSide;

  shapes.push(polyline([top.pmrt, rsrt], "cut-line"));
  shapes.push(polyline([top.pmrb, rsrb], "cut-line"));
  shapes.push(textShape("RS 右侧面", (top.pmrt.x + rsrt.x) / 2 + 4, (top.pmrt.y + top.pmrb.y) / 2, "label"));

  const toRightBottom = segmentTransform(top.pmlt, top.pmlb, rsrt, rsrb);
  const rightBottomShapes = top.shapes
    .filter((shape) => shape.kind !== "text" || shape.copyToBottom)
    .map((shape) => ({ ...transformShape(shape, toRightBottom), sourceOnly: false }));
  shapes.push(...rightBottomShapes);
  shapes.push(textShape("M1 底面右半", toRightBottom(pt(0, top.height / 2)).x, toRightBottom(pt(0, top.height / 2)).y, "label"));

  for (let index = 0; index < top.rightSeq.length; index += 1) {
    shapes.push(polyline([top.rightSeq[index], toRightBottom(top.leftSeq[index])], "fold-line"));
  }

  const mirror = (point) => pt(-point.x, point.y);
  const mirrorShapes = shapes
    .filter((shape) => shape.mirrorable)
    .map((shape) => transformShape(shape, mirror));
  shapes.push(...mirrorShapes);
  shapes.push(textShape("LS 左侧面", -(top.pmrt.x + rsrt.x) / 2 - 20, (top.pmrt.y + top.pmrb.y) / 2, "label"));

  const toLeftBottom = (pointValue) => mirror(toRightBottom(pointValue));
  const leftOverlap = buildOverlapBand(params, top, toLeftBottom, "left");
  const rightOverlap = buildOverlapBand(params, top, toRightBottom, "right");
  let outputShapes = shapes;
  if (params.enableOverlap && params.trimOverlapOutside) {
    outputShapes = clipShapesToHalfPlane(outputShapes, leftOverlap.clipLine.a, leftOverlap.clipLine.b, pt(0, top.height / 2));
    outputShapes = clipShapesToHalfPlane(outputShapes, rightOverlap.clipLine.a, rightOverlap.clipLine.b, pt(0, top.height / 2));
  }
  if (params.enableOverlap) {
    outputShapes.push(...leftOverlap.shapes, ...rightOverlap.shapes);
  }
  outputShapes = removeDuplicateLineSegments(outputShapes);

  const contentBox = getBounds(outputShapes);
  const padX = Math.max(contentBox.width * 0.1, 10);
  const padY = Math.max(contentBox.height * 0.1, 10);
  const viewBox = {
    x: contentBox.x - padX,
    y: contentBox.y - padY,
    width: contentBox.width + padX * 2,
    height: contentBox.height + padY * 2,
  };

  const guideTargets = buildGuideTargets(params, top, rightSide, toRightBottom, toLeftBottom, leftOverlap, rightOverlap);

  return { shapes: outputShapes, contentBox, viewBox, params, rightSide, top, guideTargets };
}

function buildGuideTargets(params, top, rightSide, toRightBottom, toLeftBottom, leftOverlap, rightOverlap) {
  const mirror = (pointValue) => pt(-pointValue.x, pointValue.y);
  const sectionTargets = params.sections.map((section, index) => {
    const beforeCount = params.sections.slice(0, index).reduce((sum, item) => sum + item.nos, 0);
    const startIndex = beforeCount * 2;
    const endIndex = startIndex + section.nos * 2;
    const points = [];
    for (let cursor = startIndex; cursor <= Math.min(endIndex, top.leftSeq.length - 1); cursor += 1) {
      points.push(lerp(top.leftSeq[cursor], top.rightSeq[cursor], 0.5));
    }
    return points.length ? points : [pt(0, top.height / 2)];
  });

  const rightFront = lerp(top.pmrt, rightSide.rsrt, 0.5);
  const rightRear = lerp(top.pmrb, rightSide.rsrb, 0.5);
  const leftFront = mirror(rightFront);
  const leftRear = mirror(rightRear);
  const rightBandMid = centroid(rightOverlap.band.points);
  const leftBandMid = centroid(leftOverlap.band.points);

  return {
    wif: [lerp(top.mtl, top.mtr, 0.5), toRightBottom(lerp(top.mtl, top.mtr, 0.5)), toLeftBottom(lerp(top.mtl, top.mtr, 0.5))],
    wir: [lerp(top.mbl, top.mbr, 0.5), toRightBottom(lerp(top.mbl, top.mbr, 0.5)), toLeftBottom(lerp(top.mbl, top.mbr, 0.5))],
    hif: [rightFront, leftFront],
    hir: [rightRear, leftRear],
    wof: [toRightBottom(pt(0, -top.firstLhs)), toLeftBottom(pt(0, -top.firstLhs))],
    hof: [toRightBottom(pt(top.mtr.x, -top.firstLhs / 2)), toLeftBottom(pt(top.mtl.x, -top.firstLhs / 2))],
    wor: [toRightBottom(pt(0, top.height + top.maxLhs)), toLeftBottom(pt(0, top.height + top.maxLhs))],
    hor: [toRightBottom(pt(top.mbr.x, top.height + top.maxLhs / 2)), toLeftBottom(pt(top.mbl.x, top.height + top.maxLhs / 2))],
    woo: [leftBandMid, rightBandMid],
    odf: [leftOverlap.front, rightOverlap.front],
    odr: [leftOverlap.rear, rightOverlap.rear],
    frhd: [rightFront, rightRear, leftFront, leftRear],
    enhanceMountFrame: [
      top.mtl,
      top.mtr,
      top.mbl,
      top.mbr,
      toRightBottom(top.mtl),
      toRightBottom(top.mtr),
      toRightBottom(top.mbl),
      toRightBottom(top.mbr),
      toLeftBottom(top.mtl),
      toLeftBottom(top.mtr),
      toLeftBottom(top.mbl),
      toLeftBottom(top.mbr),
    ],
    enableOverlap: [leftBandMid, rightBandMid],
    trimOverlapOutside: [leftOverlap.clipLine.a, rightOverlap.clipLine.a],
    sectionTargets,
  };
}

function centroid(points) {
  const total = points.reduce((sum, pointValue) => add(sum, pointValue), pt(0, 0));
  return mul(total, 1 / Math.max(points.length, 1));
}

function buildRightSide(params, top) {
  const leftTop = top.pmrt;
  const leftBottom = top.pmrb;
  const leftDelta = sub(leftBottom, leftTop);
  const leftLength = len(leftDelta);
  const baseLengthDelta = (params.hir - params.hif) / 2;
  const targetProjection = params.frhd - baseLengthDelta;
  const baseDir = solveBaseDirection(leftDelta, targetProjection);
  const rsrt = add(leftTop, mul(baseDir, params.hif));
  const rsrb = add(leftBottom, mul(baseDir, params.hir));

  return {
    baseDir,
    rsrt,
    rsrb,
    midpointProjection: dot(sub(lerp(leftBottom, rsrb, 0.5), lerp(leftTop, rsrt, 0.5)), baseDir),
    leftLength,
  };
}

function solveBaseDirection(leftDelta, targetProjection) {
  const length = len(leftDelta);
  if (length < 0.001) {
    return pt(1, 0);
  }

  const projection = clamp(targetProjection / length, -1, 1);
  const perpendicular = Math.sqrt(Math.max(0, 1 - projection * projection));
  const along = unit(leftDelta);
  const normal = pt(along.y, -along.x);
  const candidateA = add(mul(along, projection), mul(normal, perpendicular));
  const candidateB = add(mul(along, projection), mul(normal, -perpendicular));
  const rightFacing = [candidateA, candidateB].filter((candidate) => candidate.x >= -0.001);
  const candidates = rightFacing.length ? rightFacing : [candidateA, candidateB];

  return unit(candidates.sort((a, b) => Math.abs(a.y) - Math.abs(b.y))[0]);
}

function segmentTransform(sourceA, sourceB, targetA, targetB) {
  const s = sub(sourceB, sourceA);
  const t = sub(targetB, targetA);
  const denom = dot(s, s) || 1;
  const kr = dot(t, s) / denom;
  const ki = (t.y * s.x - t.x * s.y) / denom;

  return (pointValue) => {
    const local = sub(pointValue, sourceA);
    return pt(
      targetA.x + kr * local.x - ki * local.y,
      targetA.y + ki * local.x + kr * local.y,
    );
  };
}

function lineIntersection(a, b, c, d) {
  const r = sub(b, a);
  const s = sub(d, c);
  const denominator = cross(r, s);
  if (Math.abs(denominator) < 0.000001) {
    return null;
  }
  const t = cross(sub(c, a), s) / denominator;
  return add(a, mul(r, t));
}

function isInsideHalfPlane(pointValue, a, b, keepPoint) {
  const edge = sub(b, a);
  const keepSide = cross(edge, sub(keepPoint, a));
  const side = cross(edge, sub(pointValue, a));
  return keepSide >= 0 ? side >= -0.000001 : side <= 0.000001;
}

function pushDistinct(points, pointValue) {
  const previous = points[points.length - 1];
  if (!previous || len(sub(previous, pointValue)) > 0.0001) {
    points.push(pointValue);
  }
}

function clipPolylinePoints(points, a, b, keepPoint) {
  const segments = [];
  let current = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const startInside = isInsideHalfPlane(start, a, b, keepPoint);
    const endInside = isInsideHalfPlane(end, a, b, keepPoint);
    const intersection = lineIntersection(start, end, a, b);

    if (startInside && current.length === 0) {
      pushDistinct(current, start);
    }
    if (startInside && endInside) {
      pushDistinct(current, end);
    } else if (startInside && !endInside) {
      if (intersection) {
        pushDistinct(current, intersection);
      }
      if (current.length > 1) {
        segments.push(current);
      }
      current = [];
    } else if (!startInside && endInside) {
      current = [];
      if (intersection) {
        pushDistinct(current, intersection);
      }
      pushDistinct(current, end);
    }
  }

  if (current.length > 1) {
    segments.push(current);
  }
  return segments;
}

function clipPolygonPoints(points, a, b, keepPoint) {
  const clipped = [];
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const previous = points[(index + points.length - 1) % points.length];
    const currentInside = isInsideHalfPlane(current, a, b, keepPoint);
    const previousInside = isInsideHalfPlane(previous, a, b, keepPoint);
    const intersection = lineIntersection(previous, current, a, b);

    if (currentInside) {
      if (!previousInside && intersection) {
        pushDistinct(clipped, intersection);
      }
      pushDistinct(clipped, current);
    } else if (previousInside && intersection) {
      pushDistinct(clipped, intersection);
    }
  }
  return clipped;
}

function clipShapesToHalfPlane(shapes, a, b, keepPoint) {
  const clipped = [];
  shapes.forEach((shape) => {
    if (shape.kind === "text") {
      if (shape.previewOnly) {
        clipped.push(shape);
        return;
      }
      if (isInsideHalfPlane(pt(shape.x, shape.y), a, b, keepPoint)) {
        clipped.push(shape);
      }
      return;
    }
    if (shape.kind === "polygon") {
      const points = clipPolygonPoints(shape.points, a, b, keepPoint);
      if (points.length >= 3) {
        clipped.push({ ...shape, points });
      }
      return;
    }
    const segments = clipPolylinePoints(shape.points, a, b, keepPoint);
    segments.forEach((points) => clipped.push({ ...shape, points }));
  });
  return clipped;
}

function buildOverlapBand(params, top, transform, side) {
  const useTransformedLeftVertex = side === "right";
  const topStart = transform(useTransformedLeftVertex ? top.mtl : top.mtr);
  const topEnd = transform(useTransformedLeftVertex ? top.mtr : top.mtl);
  const bottomStart = transform(useTransformedLeftVertex ? top.mbl : top.mbr);
  const bottomEnd = transform(useTransformedLeftVertex ? top.mbr : top.mbl);
  const frontOuterStart = transform(useTransformedLeftVertex
    ? pt(top.mtl.x, -top.firstLhs)
    : pt(top.mtr.x, -top.firstLhs));
  const frontOuterEnd = transform(useTransformedLeftVertex
    ? pt(top.mtr.x, -top.firstLhs)
    : pt(top.mtl.x, -top.firstLhs));
  const rearOuterStart = transform(useTransformedLeftVertex
    ? pt(top.mbl.x, top.height + top.maxLhs)
    : pt(top.mbr.x, top.height + top.maxLhs));
  const rearOuterEnd = transform(useTransformedLeftVertex
    ? pt(top.mbr.x, top.height + top.maxLhs)
    : pt(top.mbl.x, top.height + top.maxLhs));
  const port = pointAtDistance(topStart, topEnd, params.odf);
  const porb = pointAtDistance(bottomStart, bottomEnd, params.odr);
  const line = sub(porb, port);
  const direction = unit(line);
  let normal = unit(pt(line.y, -line.x));
  if (normal.x < 0) {
    normal = mul(normal, -1);
  }
  const offset = mul(normal, params.woo);
  const lineAStart = add(port, mul(direction, -1000));
  const lineAEnd = add(porb, mul(direction, 1000));
  const lineBStart = add(lineAStart, offset);
  const lineBEnd = add(lineAEnd, offset);
  const frontA = lineIntersection(lineAStart, lineAEnd, frontOuterStart, frontOuterEnd) || port;
  const rearA = lineIntersection(lineAStart, lineAEnd, rearOuterStart, rearOuterEnd) || porb;
  const frontB = lineIntersection(lineBStart, lineBEnd, frontOuterStart, frontOuterEnd) || add(port, offset);
  const rearB = lineIntersection(lineBStart, lineBEnd, rearOuterStart, rearOuterEnd) || add(porb, offset);
  const band = polygon([frontA, rearA, rearB, frontB], "overlap-band");
  band.mirrorable = false;
  const labelPoint = lerp(lerp(frontA, rearA, 0.5), lerp(frontB, rearB, 0.5), 0.5);
  const label = textShape(side === "right" ? "右侧粘合带" : "左侧粘合带", labelPoint.x, labelPoint.y, "label");
  const centerLine = polyline([frontA, rearA], "mount-line");
  centerLine.mirrorable = false;
  return {
    shapes: [band, centerLine, label],
    band,
    front: lerp(frontA, frontB, 0.5),
    rear: lerp(rearA, rearB, 0.5),
    clipLine: side === "right"
      ? { a: frontB, b: rearB }
      : { a: frontA, b: rearA },
  };
}

function pointAtDistance(a, b, distance) {
  const length = len(sub(b, a)) || 1;
  return lerp(a, b, clamp(distance / length, 0, 1));
}

function polyline(points, className) {
  return { kind: "polyline", className, points, mirrorable: true };
}

function linePointKey(pointValue) {
  return `${round(pointValue.x * 1000)}:${round(pointValue.y * 1000)}`;
}

function lineSegmentKey(a, b) {
  const start = linePointKey(a);
  const end = linePointKey(b);
  return start < end ? `${start}|${end}` : `${end}|${start}`;
}

function removeDuplicateLineSegments(shapes) {
  const seen = new Set();
  const deduped = [];

  shapes.forEach((shape) => {
    if (shape.kind !== "polyline") {
      deduped.push(shape);
      return;
    }

    for (let index = 0; index < shape.points.length - 1; index += 1) {
      const start = shape.points[index];
      const end = shape.points[index + 1];
      if (len(sub(start, end)) < 0.0001) {
        continue;
      }
      const key = lineSegmentDedupKey(shape, start, end);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push({ ...shape, points: [start, end] });
    }
  });

  return deduped;
}

function lineSegmentDedupKey(shape, start, end) {
  if (shape.className === "cut-line") {
    return `${shape.className}:${lineSegmentKey(start, end)}`;
  }
  return lineSegmentKey(start, end);
}

function referencePolyline(points) {
  return { kind: "polyline", className: "reference-line", points, mirrorable: true, previewOnly: true };
}

function polygon(points, className) {
  return { kind: "polygon", className, points, mirrorable: true };
}

function textShape(value, x, y, className) {
  return { kind: "text", className, value, x, y, mirrorable: false };
}

function referenceText(value, x, y, options = {}) {
  return {
    kind: "text",
    className: "reference-label",
    value,
    x,
    y,
    mirrorable: true,
    previewOnly: true,
    copyToBottom: true,
    sourceOnly: Boolean(options.sourceOnly),
  };
}

function transformShape(shape, transform) {
  if (shape.kind === "text") {
    const next = transform(pt(shape.x, shape.y));
    return { ...shape, x: next.x, y: next.y };
  }
  return { ...shape, points: shape.points.map(transform) };
}

function getBounds(shapes) {
  const points = [];
  shapes.forEach((shape) => {
    if (shape.kind === "text") {
      points.push(pt(shape.x, shape.y));
      return;
    }
    points.push(...shape.points);
  });

  const xs = points.map((pointValue) => pointValue.x);
  const ys = points.map((pointValue) => pointValue.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function renderPattern(keepView = false) {
  const pattern = buildPattern(readParams());
  lastPattern = pattern;
  fittedViewBox = pattern.viewBox;
  if (!keepView || !currentViewBox) {
    currentViewBox = { ...fittedViewBox };
  }

  renderSvg(pattern, currentViewBox);
  patternSize.textContent = `${round(pattern.contentBox.width)} × ${round(pattern.contentBox.height)} mm`;
  if (activeHint) {
    activeHint.targets = hintTargetsForElement(activeHint.element);
    hintTargetIndex %= Math.max(activeHint.targets.length, 1);
  }
  updateActiveHint();
}

function renderSvg(pattern, viewBox) {
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const defs = document.createElementNS(NS, "defs");
  const style = document.createElementNS(NS, "style");
  style.textContent = previewStyles();
  defs.appendChild(style);
  svg.appendChild(defs);

  const grid = document.createElementNS(NS, "g");
  grid.setAttribute("opacity", "0.35");
  appendGrid(grid, pattern.viewBox);
  svg.appendChild(grid);

  const group = document.createElementNS(NS, "g");
  const previewShapes = resolveTextOverlaps(pattern.shapes);
  previewShapes.forEach((shape) => {
    group.appendChild(createSvgElement(shape));
  });
  svg.appendChild(group);
}

function labelBox(shape) {
  const fontSize = shape.className === "reference-label" ? 4 : 4.5;
  const width = [...shape.value].reduce((sum, char) => sum + (char.charCodeAt(0) > 255 ? fontSize : fontSize * 0.58), 0);
  const height = fontSize * 1.45;
  return {
    x: shape.x - width / 2,
    y: shape.y - height,
    width,
    height,
  };
}

function boxesOverlap(a, b) {
  const gap = 1.5;
  return !(
    a.x + a.width + gap < b.x
    || b.x + b.width + gap < a.x
    || a.y + a.height + gap < b.y
    || b.y + b.height + gap < a.y
  );
}

function resolveTextOverlaps(shapes) {
  const occupied = [];
  const offsets = [
    pt(0, 0),
    pt(0, -8),
    pt(0, 8),
    pt(0, -16),
    pt(0, 16),
    pt(14, 0),
    pt(-14, 0),
    pt(14, -8),
    pt(-14, -8),
    pt(14, 8),
    pt(-14, 8),
    pt(0, -24),
    pt(0, 24),
  ];

  return shapes.flatMap((shape) => {
    if (shape.kind !== "text") {
      return [shape];
    }

    for (const offset of offsets) {
      const candidate = { ...shape, x: shape.x + offset.x, y: shape.y + offset.y };
      const box = labelBox(candidate);
      if (!occupied.some((placed) => boxesOverlap(box, placed))) {
        occupied.push(box);
        return [candidate];
      }
    }
    return [];
  });
}

function appendGrid(group, box) {
  const step = 10;
  const startX = Math.floor(box.x / step) * step;
  const endX = Math.ceil((box.x + box.width) / step) * step;
  const startY = Math.floor(box.y / step) * step;
  const endY = Math.ceil((box.y + box.height) / step) * step;

  for (let x = startX; x <= endX; x += step) {
    group.appendChild(svgLine(pt(x, startY), pt(x, endY), "grid-line"));
  }
  for (let y = startY; y <= endY; y += step) {
    group.appendChild(svgLine(pt(startX, y), pt(endX, y), "grid-line"));
  }
}

function createSvgElement(shape) {
  if (shape.kind === "polygon") {
    const element = document.createElementNS(NS, "polygon");
    element.setAttribute("points", pointString(shape.points));
    element.setAttribute("class", shape.className);
    return element;
  }
  if (shape.kind === "text") {
    const element = document.createElementNS(NS, "text");
    element.setAttribute("x", round(shape.x));
    element.setAttribute("y", round(shape.y));
    element.setAttribute("class", shape.className);
    element.setAttribute("text-anchor", "middle");
    element.textContent = shape.value;
    return element;
  }
  const element = document.createElementNS(NS, "path");
  element.setAttribute("d", pathString(shape.points));
  element.setAttribute("class", shape.className);
  return element;
}

function svgLine(a, b, className) {
  const element = document.createElementNS(NS, "path");
  element.setAttribute("d", pathString([a, b]));
  element.setAttribute("class", className);
  return element;
}

function exportStyles() {
  return `
    .cut-line{fill:none;stroke:#111827;stroke-width:.55;vector-effect:non-scaling-stroke}
    .fold-line{fill:none;stroke:#111827;stroke-width:.55;vector-effect:non-scaling-stroke}
    .mount-line{fill:none;stroke:#111827;stroke-width:.55;vector-effect:non-scaling-stroke}
    .overlap-band{fill:none;stroke:#111827;stroke-width:.55;vector-effect:non-scaling-stroke}
  `;
}

function previewStyles() {
  return `
    .cut-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .fold-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .mount-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .overlap-band{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .reference-line{fill:none;stroke:rgba(255,255,255,.75);stroke-width:.7;stroke-dasharray:5 3;vector-effect:non-scaling-stroke}
    .grid-line{fill:none;stroke:rgba(255,255,255,.12);stroke-width:.25;vector-effect:non-scaling-stroke}
    .label{fill:#a9d8eb;font-size:4.5px;font-weight:700;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:rgba(7,21,37,.9);stroke-width:1.4px;vector-effect:non-scaling-stroke}
    .reference-label{fill:#fff;font-size:4px;font-weight:700;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:rgba(7,21,37,.9);stroke-width:1.4px;vector-effect:non-scaling-stroke}
  `;
}

function applyViewBox() {
  if (!currentViewBox) {
    return;
  }
  svg.setAttribute("viewBox", `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`);
  updateActiveHint();
}

function clientToSvg(event) {
  const metrics = svgViewportMetrics();
  const x = currentViewBox.x + ((event.clientX - metrics.left) / metrics.width) * currentViewBox.width;
  const y = currentViewBox.y + ((event.clientY - metrics.top) / metrics.height) * currentViewBox.height;
  return pt(x, y);
}

function svgViewportMetrics() {
  const rect = svg.getBoundingClientRect();
  const scale = Math.min(rect.width / currentViewBox.width, rect.height / currentViewBox.height);
  const width = currentViewBox.width * scale;
  const height = currentViewBox.height * scale;
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

function svgPointToClient(pointValue) {
  const metrics = svgViewportMetrics();
  return pt(
    metrics.left + ((pointValue.x - currentViewBox.x) / currentViewBox.width) * metrics.width,
    metrics.top + ((pointValue.y - currentViewBox.y) / currentViewBox.height) * metrics.height,
  );
}

function controlAnchor(element) {
  const rect = element.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();
  const fromLeft = rect.left > viewportRect.left;
  return pt(fromLeft ? rect.left : rect.right, rect.top + rect.height / 2);
}

function patternCenterTarget() {
  if (!lastPattern) {
    return [];
  }
  return [pt(lastPattern.contentBox.x + lastPattern.contentBox.width / 2, lastPattern.contentBox.y + lastPattern.contentBox.height / 2)];
}

function hintTargetsForElement(element) {
  if (!lastPattern?.guideTargets) {
    return [];
  }
  const key = element.dataset.param || element.dataset.hint;
  if (key === "sectionLhs" || key === "sectionNos") {
    const index = Number.parseInt(element.dataset.section, 10);
    return lastPattern.guideTargets.sectionTargets[index] || patternCenterTarget();
  }
  return lastPattern.guideTargets[key] || patternCenterTarget();
}

function hintTitleForElement(element) {
  const key = element.dataset.param || element.dataset.hint;
  if (key === "sectionLhs" || key === "sectionNos") {
    const index = Number.parseInt(element.dataset.section, 10);
    return key === "sectionLhs" ? TEXT[currentLang].sectionLhs(index) : TEXT[currentLang].sectionNos(index);
  }
  if (TEXT[currentLang].optionLabels[key]) {
    return TEXT[currentLang].optionLabels[key];
  }
  if (key === "configSelect") {
    return TEXT[currentLang].config;
  }
  if (key === "importConfig") {
    return TEXT[currentLang].importConfig;
  }
  if (key === "exportConfig") {
    return TEXT[currentLang].exportConfig;
  }
  if (key === "addSection") {
    return TEXT[currentLang].addSection;
  }
  if (key === "exportSvg") {
    return TEXT[currentLang].exportSvg;
  }
  if (key === "exportPdf") {
    return TEXT[currentLang].exportPdf;
  }
  if (key === "fitView") {
    return TEXT[currentLang].fitView;
  }
  return element.textContent.trim();
}

function showHint(element) {
  const key = element.dataset.param || element.dataset.hint;
  const title = hintTitleForElement(element);
  const description = hintContent(key);
  const targets = hintTargetsForElement(element);

  activeHint = { element, targets };
  hintTargetIndex = Math.min(hintTargetIndex, Math.max(targets.length - 1, 0));
  hintAnimatedEnd = targets.length ? svgPointToClient(targets[hintTargetIndex]) : null;
  hintAnimationStart = null;
  hintCard.innerHTML = `<strong>${escapeXml(title)}</strong>${escapeXml(description)}`;
  hintCard.classList.add("active");
  if (targets.length) {
    hintArrowOverlay.classList.add("active");
  }
  updateActiveHint();

  window.clearInterval(hintTimer);
  if (targets.length > 1) {
    hintTimer = window.setInterval(() => {
      moveHintToTarget((hintTargetIndex + 1) % activeHint.targets.length);
    }, 1500);
  }
}

function hideHint() {
  activeHint = null;
  window.clearInterval(hintTimer);
  window.cancelAnimationFrame?.(hintAnimationFrame);
  hintTimer = null;
  hintAnimationFrame = null;
  hintAnimatedEnd = null;
  hintAnimationStart = null;
  hintCard.classList.remove("active");
  hintArrowOverlay.classList.remove("active");
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function moveHintToTarget(nextIndex) {
  if (!activeHint?.targets.length) {
    return;
  }
  const from = hintAnimatedEnd || svgPointToClient(activeHint.targets[hintTargetIndex % activeHint.targets.length]);
  const to = svgPointToClient(activeHint.targets[nextIndex]);
  hintTargetIndex = nextIndex;
  hintAnimationStart = performance.now();
  window.cancelAnimationFrame?.(hintAnimationFrame);

  const animate = (time) => {
    if (!activeHint || !hintAnimationStart) {
      return;
    }
    const progress = clamp((time - hintAnimationStart) / 900, 0, 1);
    const eased = easeInOutCubic(progress);
    hintAnimatedEnd = lerp(from, to, eased);
    updateActiveHint(false);
    if (progress < 1) {
      hintAnimationFrame = requestHintFrame(animate);
    } else {
      hintAnimatedEnd = to;
      hintAnimationStart = null;
      hintAnimationFrame = null;
      updateActiveHint(false);
    }
  };

  hintAnimationFrame = requestHintFrame(animate);
}

function requestHintFrame(callback) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return window.setTimeout(() => callback(performance.now()), 16);
}

function updateActiveHint(syncEnd = true) {
  if (!activeHint) {
    return;
  }
  const rect = activeHint.element.getBoundingClientRect();
  hintCard.style.left = `${Math.min(window.innerWidth - 296, Math.max(8, rect.right + 12))}px`;
  hintCard.style.top = `${Math.min(window.innerHeight - 92, Math.max(8, rect.top))}px`;

  const targets = activeHint.targets;
  if (!targets.length) {
    hintArrowOverlay.classList.remove("active");
    return;
  }
  const start = controlAnchor(activeHint.element);
  if (syncEnd || !hintAnimatedEnd) {
    hintAnimatedEnd = svgPointToClient(targets[hintTargetIndex % targets.length]);
  }
  const end = hintAnimatedEnd;
  hintArrowLine.setAttribute("x1", round(start.x));
  hintArrowLine.setAttribute("y1", round(start.y));
  hintArrowLine.setAttribute("x2", round(end.x));
  hintArrowLine.setAttribute("y2", round(end.y));
  hintArrowOverlay.classList.add("active");
}

function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function serializeSvg() {
  if (!lastPattern) {
    return "";
  }
  const exportShapes = lastPattern.shapes.filter((shape) => !shape.previewOnly && shape.kind !== "text");
  const exportBox = paddedBounds(exportShapes);
  const content = exportShapes.map((shape) => createMarkup(shape)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${round(exportBox.width)}mm" height="${round(exportBox.height)}mm" viewBox="${round(exportBox.x)} ${round(exportBox.y)} ${round(exportBox.width)} ${round(exportBox.height)}">
  <defs><style>${exportStyles()}</style></defs>
  ${content}
</svg>`;
}

function paddedBounds(shapes) {
  const box = getBounds(shapes);
  const padX = Math.max(box.width * 0.1, 10);
  const padY = Math.max(box.height * 0.1, 10);
  return {
    x: box.x - padX,
    y: box.y - padY,
    width: box.width + padX * 2,
    height: box.height + padY * 2,
  };
}

function createMarkup(shape) {
  if (shape.kind === "polygon") {
    return `<polygon class="${shape.className}" points="${pointString(shape.points)}" />`;
  }
  if (shape.kind === "text") {
    return `<text class="${shape.className}" x="${round(shape.x)}" y="${round(shape.y)}" text-anchor="middle">${escapeXml(shape.value)}</text>`;
  }
  return `<path class="${shape.className}" d="${pathString(shape.points)}" />`;
}

controls.addEventListener("input", (event) => {
  const target = event.target;
  if (target.dataset.section) {
    const index = Number.parseInt(target.dataset.section, 10);
    sections[index][target.dataset.key] = target.value;
  }
  renderPattern(true);
});

document.addEventListener("mouseover", (event) => {
  const element = event.target.closest?.("[data-param], [data-hint]");
  if (!element || activeHint?.element === element) {
    return;
  }
  showHint(element);
});

document.addEventListener("mouseout", (event) => {
  const element = event.target.closest?.("[data-param], [data-hint]");
  if (!element || element.contains(event.relatedTarget)) {
    return;
  }
  hideHint();
});

document.addEventListener("focusin", (event) => {
  const element = event.target.closest?.("[data-param], [data-hint]");
  if (element) {
    showHint(element);
  }
});

document.addEventListener("focusout", (event) => {
  const element = event.target.closest?.("[data-param], [data-hint]");
  if (element && !element.contains(event.relatedTarget)) {
    hideHint();
  }
});

languageToggleButton.addEventListener("click", () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  updateStaticLanguage();
});

configSelect.addEventListener("change", () => {
  const config = allConfigs().find((item) => item.id === configSelect.value) || DEFAULT_CONFIG;
  applyConfig(config);
});

importConfigButton.addEventListener("click", () => {
  configFileInput.click();
});

configFileInput.addEventListener("change", () => {
  const file = configFileInput.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = normalizeConfig(JSON.parse(String(reader.result || "")));
      if (!imported) {
        throw new Error("Invalid config");
      }
      userConfigs.push(imported);
      saveUserConfigs();
      renderConfigOptions(imported.id);
      applyConfig(imported);
    } catch {
      window.alert?.("配置 JSON 无法识别，请检查文件格式。");
    } finally {
      configFileInput.value = "";
    }
  });
  reader.readAsText(file);
});

exportConfigButton.addEventListener("click", () => {
  const payload = currentConfigPayload();
  download(
    `${safeFilename(payload.name)}.json`,
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8",
  );
});

sectionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) {
    return;
  }
  const index = Number.parseInt(button.dataset.remove, 10);
  if (sections.length > 1) {
    sections.splice(index, 1);
    renderSectionRows();
    renderPattern();
  }
});

addSectionButton.addEventListener("click", () => {
  const previous = sections[sections.length - 1] || { lhs: 10, nos: 1 };
  sections.push({ lhs: previous.lhs, nos: 1 });
  renderSectionRows();
  renderPattern();
});

fitViewButton.addEventListener("click", () => {
  currentViewBox = { ...fittedViewBox };
  applyViewBox();
});

viewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  const cursor = clientToSvg(event);
  const factor = event.deltaY < 0 ? 0.9 : 1.1;
  const nextWidth = clamp(currentViewBox.width * factor, fittedViewBox.width * 0.08, fittedViewBox.width * 20);
  const nextHeight = clamp(currentViewBox.height * factor, fittedViewBox.height * 0.08, fittedViewBox.height * 20);
  const sx = (cursor.x - currentViewBox.x) / currentViewBox.width;
  const sy = (cursor.y - currentViewBox.y) / currentViewBox.height;
  currentViewBox = {
    x: cursor.x - nextWidth * sx,
    y: cursor.y - nextHeight * sy,
    width: nextWidth,
    height: nextHeight,
  };
  applyViewBox();
}, { passive: false });

viewport.addEventListener("pointerdown", (event) => {
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add("dragging");
  dragState = {
    x: event.clientX,
    y: event.clientY,
    box: { ...currentViewBox },
  };
});

viewport.addEventListener("pointermove", (event) => {
  if (!dragState) {
    return;
  }
  const rect = viewport.getBoundingClientRect();
  const dx = ((event.clientX - dragState.x) / rect.width) * dragState.box.width;
  const dy = ((event.clientY - dragState.y) / rect.height) * dragState.box.height;
  currentViewBox = {
    ...dragState.box,
    x: dragState.box.x - dx,
    y: dragState.box.y - dy,
  };
  applyViewBox();
});

viewport.addEventListener("pointerup", (event) => {
  viewport.releasePointerCapture(event.pointerId);
  viewport.classList.remove("dragging");
  dragState = null;
});

viewport.addEventListener("pointercancel", () => {
  viewport.classList.remove("dragging");
  dragState = null;
});

exportSvgButton.addEventListener("click", () => {
  download("mutex-tech-bellow-generator-v2.svg", serializeSvg(), "image/svg+xml;charset=utf-8");
});

exportPdfButton.addEventListener("click", () => {
  const svgText = serializeSvg();
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.write(`
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <title>MUTEX TECH Bellow Generator V2 PDF</title>
        <style>
          @page { size: auto; margin: 8mm; }
          body { margin: 0; background: #fff; }
          svg { display: block; width: 100%; height: auto; }
        </style>
      </head>
      <body>${svgText}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
});

userConfigs = loadUserConfigs();
renderConfigOptions(DEFAULT_CONFIG.id);
applyConfig(DEFAULT_CONFIG);
annotateOptionControls();
updateStaticLanguage();
window.addEventListener("resize", updateActiveHint);
controls.addEventListener("scroll", updateActiveHint);
