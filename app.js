const svg = document.getElementById("preview-svg");
const viewport = document.getElementById("viewport");
const controls = document.getElementById("controls");
const sectionList = document.getElementById("section-list");
const addSectionButton = document.getElementById("add-section");
const fitViewButton = document.getElementById("fit-view");
const exportSvgButton = document.getElementById("export-svg");
const exportPdfButton = document.getElementById("export-pdf");
const projectNameInput = document.getElementById("project-name");
const configSelect = document.getElementById("config-select");
const importConfigButton = document.getElementById("import-config");
const exportConfigButton = document.getElementById("export-config");
const configFileInput = document.getElementById("config-file");
const languageToggleButton = document.getElementById("language-toggle");
const contactLink = document.getElementById("contact-link");
const hintCard = document.getElementById("hint-card");
const hintArrowOverlay = document.getElementById("hint-arrow-overlay");
const hintArrowLine = document.getElementById("hint-arrow-line");
const patternSize = document.getElementById("pattern-size");
const bellowLength = document.getElementById("bellow-length");

const NS = "http://www.w3.org/2000/svg";
const CONFIG_STORAGE_KEY = "mutex-tech-bellow-configs-v2";
const CONFIG_FIELDS = ["wif", "hif", "wof", "hof", "wir", "hir", "wor", "hor", "woo", "odf", "odr", "frhd", "srd", "ribCornerRadius"];
const CONFIG_CHECKBOXES = ["enableSupportRibs", "useRectangularRibs", "useCornerlessRibs", "showBoundingBox", "rotateToBoundingBox", "enhanceMountFrame", "enableOverlap", "trimOverlapOutside"];
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
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 6, nos: 4 },
        { lhs: 10.3, nos: 19 },
      ],
    },
  },
  {
    id: "sinar-norma-4x5",
    name: "Sinar Norma 4x5",
    builtin: true,
    params: {
      wif: 98,
      hif: 99.5,
      wof: 121,
      hof: 124,
      wir: 124,
      hir: 124,
      wor: 148,
      hor: 148,
      woo: 16,
      odf: 20,
      odr: 90,
      frhd: 0,
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 12, nos: 23 },
      ],
    },
  },
  {
    id: "tachihara-hope-a",
    name: "Tachihara Hope A",
    builtin: true,
    params: {
      wif: 90,
      hif: 93,
      wof: 121,
      hof: 124,
      wir: 203,
      hir: 209,
      wor: 240,
      hor: 240,
      woo: 16,
      odf: 20,
      odr: 90,
      frhd: 0,
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 16, nos: 18 },
      ],
    },
  },
  {
    id: "toyo-810m2",
    name: "TOYO 810M2",
    builtin: true,
    params: {
      wif: 140,
      hif: 140,
      wof: 158,
      hof: 158,
      wir: 252,
      hir: 252,
      wor: 293,
      hor: 292.9,
      woo: 16,
      odf: 30,
      odr: 200,
      frhd: 0,
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 9.8, nos: 4 },
        { lhs: 14.7, nos: 30 },
      ],
    },
  },
  {
    id: "toyo-field-4-3-4-x-6-1-2",
    name: "Toyo Field 4 3/4 x 6 1/2",
    builtin: true,
    params: {
      wif: 90,
      hif: 90,
      wof: 120,
      hof: 120,
      wir: 170,
      hir: 170,
      wor: 200,
      hor: 200,
      woo: 16,
      odf: 20,
      odr: 135,
      frhd: 0,
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 11.5, nos: 18 },
      ],
    },
  },
  {
    id: "toyo-vx125",
    name: "TOYO VX125",
    builtin: true,
    params: {
      wif: 133,
      hif: 133,
      wof: 164,
      hof: 164,
      wir: 133,
      hir: 133,
      wor: 164,
      hor: 164,
      woo: 16,
      odf: 30,
      odr: 90,
      frhd: 0,
      srd: 0.5,
      ribCornerRadius: 0.5,
      enableSupportRibs: false,
      useRectangularRibs: true,
      useCornerlessRibs: false,
      showBoundingBox: false,
      rotateToBoundingBox: false,
      enhanceMountFrame: true,
      enableOverlap: true,
      trimOverlapOutside: true,
      sections: [
        { lhs: 25.5, nos: 8 },
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
let currentProjectName = DEFAULT_CONFIG.name;
let projectNameEdited = false;

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
    contactMe: "联系我",
    bellowLength: "皮腔长度",
    enableSupportRibs: "生成皮腔骨架",
    useRectangularRibs: "使用矩形骨架",
    useCornerlessRibs: "使用无角骨架",
    showBoundingBox: "寻找最小外接矩形",
    rotateToBoundingBox: "按矩形旋转",
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
      srd: "骨架边距 SRD",
      ribCornerRadius: "骨架圆角",
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
    contactMe: "Contact me",
    bellowLength: "Bellows length",
    enableSupportRibs: "Generate support ribs",
    useRectangularRibs: "Use rectangular ribs",
    useCornerlessRibs: "Use cornerless ribs",
    showBoundingBox: "Find minimum bounding rectangle",
    rotateToBoundingBox: "Rotate by rectangle",
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
      srd: "Support rib distance SRD",
      ribCornerRadius: "Rib corner radius",
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
  srd: {
    zh: "骨架与所在小梯形每条边之间的距离。",
    en: "Distance from each support rib to every edge of its source small trapezoid.",
  },
  ribCornerRadius: {
    zh: "骨架每个角的圆角半径。数值小于等于 0 时不启用圆角。",
    en: "Corner radius applied to every support rib corner. Values less than or equal to 0 disable rounding.",
  },
  enableSupportRibs: {
    zh: "在每个皮腔节的小梯形内生成黄色骨架线。",
    en: "Generates yellow support rib outlines inside each small trapezoid of the bellows.",
  },
  useRectangularRibs: {
    zh: "将每节骨架裁剪成矩形，高度保持不变，宽度等于小梯形较短底并与短底对齐。",
    en: "Clips each rib into a rectangle with the original strip height and the shorter base width aligned to that shorter base.",
  },
  useCornerlessRibs: {
    zh: "将骨架小梯形的腰绕较短底端点向内旋转 45 度，并用长底裁切多余线段。启用后优先于矩形骨架。",
    en: "Rotates each rib trapezoid leg inward by 45 degrees around the shorter-base endpoint, then trims the excess at the longer base. This overrides rectangular ribs.",
  },
  showBoundingBox: {
    zh: "计算真实展开图线条的最小外接矩形，绘制矩形并标注宽高尺寸。",
    en: "Calculates the minimum bounding rectangle for the actual pattern lines, then draws and labels its width and height.",
  },
  rotateToBoundingBox: {
    zh: "启用最小外接矩形后可用。自动旋转展开图，使矩形长边竖直、短边水平。",
    en: "Available when the minimum bounding rectangle is enabled. Rotates the pattern so the rectangle's long edge is vertical and short edge is horizontal.",
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

function positiveOffset(value) {
  return Math.abs(num(value, 0));
}

function negativeDisplayOffset(value, edgeLength, overlapWidth) {
  const leftOffset = positiveOffset(value);
  const rightVisibleOffset = Math.max(0, num(edgeLength, 0) - leftOffset - Math.max(0, num(overlapWidth, 0)));
  return rightVisibleOffset === 0 ? 0 : -round(rightVisibleOffset);
}

function storedOffsetFromSigned(value, edgeLength, overlapWidth) {
  const distance = num(value, 0);
  if (distance < 0) {
    return Math.max(0, num(edgeLength, 0) - Math.abs(distance) - Math.max(0, num(overlapWidth, 0)));
  }
  return positiveOffset(distance);
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

function rotateAround(pointValue, angle, origin = pt(0, 0)) {
  return add(origin, rotate(sub(pointValue, origin), angle));
}

function pointString(points) {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(" ");
}

function pathString(points) {
  return points.map((p, index) => `${index ? "L" : "M"} ${round(p.x)} ${round(p.y)}`).join(" ");
}

function roundedPathString(points, radius) {
  if (radius <= 0 || points.length < 4) {
    return pathString(points);
  }
  const closed = len(sub(points[0], points[points.length - 1])) < 0.001;
  if (!closed) {
    return pathString(points);
  }

  const vertices = points.slice(0, -1);
  const corners = vertices.map((vertex, index) => {
    const previous = vertices[(index + vertices.length - 1) % vertices.length];
    const next = vertices[(index + 1) % vertices.length];
    const prevVector = sub(previous, vertex);
    const nextVector = sub(next, vertex);
    const prevLength = len(prevVector);
    const nextLength = len(nextVector);
    const cornerRadius = Math.min(radius, prevLength / 2, nextLength / 2);
    if (cornerRadius <= 0.001) {
      return { vertex, inPoint: vertex, outPoint: vertex };
    }
    return {
      vertex,
      inPoint: add(vertex, mul(unit(prevVector), cornerRadius)),
      outPoint: add(vertex, mul(unit(nextVector), cornerRadius)),
    };
  });

  const commands = [`M ${round(corners[0].outPoint.x)} ${round(corners[0].outPoint.y)}`];
  for (let index = 1; index < corners.length; index += 1) {
    const corner = corners[index];
    commands.push(`L ${round(corner.inPoint.x)} ${round(corner.inPoint.y)}`);
    commands.push(`Q ${round(corner.vertex.x)} ${round(corner.vertex.y)} ${round(corner.outPoint.x)} ${round(corner.outPoint.y)}`);
  }
  const first = corners[0];
  commands.push(`L ${round(first.inPoint.x)} ${round(first.inPoint.y)}`);
  commands.push(`Q ${round(first.vertex.x)} ${round(first.vertex.y)} ${round(first.outPoint.x)} ${round(first.outPoint.y)}`);
  commands.push("Z");
  return commands.join(" ");
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
    return Array.isArray(parsed) ? dedupeUserConfigs(parsed.map(normalizeConfig).filter(Boolean)) : [];
  } catch {
    return [];
  }
}

function normalizeConfigName(name) {
  return String(name || "")
    .trim()
    .replace(/^<+/, "")
    .replace(/>+$/, "")
    .trim();
}

function dedupeUserConfigs(configs) {
  const builtinNames = new Set(BUILTIN_CONFIGS.map((config) => normalizeConfigName(config.name).toLowerCase()));
  const seenNames = new Set();
  return configs.filter((config) => {
    config.name = normalizeConfigName(config.name);
    const key = config.name.toLowerCase();
    if (!key || builtinNames.has(key) || seenNames.has(key)) {
      return false;
    }
    seenNames.add(key);
    return true;
  });
}

function saveUserConfigs() {
  try {
    userConfigs = dedupeUserConfigs(userConfigs);
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
    option.textContent = normalizeConfigName(config.name);
    configSelect.appendChild(option);
  });
  configSelect.value = selectedId;
}

function setProjectName(name, edited = false) {
  currentProjectName = edited
    ? String(name ?? "")
    : normalizeConfigName(name) || DEFAULT_CONFIG.name;
  projectNameEdited = edited;
  if (projectNameInput) {
    projectNameInput.value = currentProjectName;
  }
}

function applyConfig(config, options = {}) {
  CONFIG_FIELDS.forEach((field) => {
    const input = controls.querySelector(`[name="${field}"]`);
    if (input) {
      input.value = field === "odr"
        ? negativeDisplayOffset(config.params[field], config.params.wir, config.params.woo)
        : config.params[field];
    }
  });
  CONFIG_CHECKBOXES.forEach((field) => {
    const input = controls.querySelector(`[name="${field}"]`);
    if (input) {
      input.checked = Boolean(config.params[field]);
    }
  });
  sections = cloneSections(config.params.sections);
  if (!options.keepProjectName) {
    setProjectName(config.name, false);
  }
  renderSectionRows();
  syncBoundingBoxControls();
  renderPattern();
}

function currentConfigPayload() {
  const params = readParams();
  params.odf = positiveOffset(params.odf);
  params.odr = storedOffsetFromSigned(params.odr, params.wir, params.woo);
  return {
    version: 1,
    name: currentProjectName,
    units: "mm",
    params,
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
    odf: positiveOffset(num(params.odf, DEFAULT_CONFIG.params.odf)),
    odr: positiveOffset(num(params.odr, DEFAULT_CONFIG.params.odr)),
    frhd: num(params.frhd, DEFAULT_CONFIG.params.frhd),
    srd: Math.max(0, num(params.srd, DEFAULT_CONFIG.params.srd)),
    ribCornerRadius: Math.max(0, num(params.ribCornerRadius, DEFAULT_CONFIG.params.ribCornerRadius)),
    enableSupportRibs: bool(params.enableSupportRibs, DEFAULT_CONFIG.params.enableSupportRibs),
    useRectangularRibs: bool(params.useRectangularRibs, DEFAULT_CONFIG.params.useRectangularRibs),
    useCornerlessRibs: bool(params.useCornerlessRibs, DEFAULT_CONFIG.params.useCornerlessRibs),
    showBoundingBox: bool(params.showBoundingBox, DEFAULT_CONFIG.params.showBoundingBox),
    rotateToBoundingBox: bool(params.rotateToBoundingBox, DEFAULT_CONFIG.params.rotateToBoundingBox),
    enhanceMountFrame: bool(params.enhanceMountFrame, DEFAULT_CONFIG.params.enhanceMountFrame),
    enableOverlap: bool(params.enableOverlap, DEFAULT_CONFIG.params.enableOverlap),
    trimOverlapOutside: bool(params.trimOverlapOutside, DEFAULT_CONFIG.params.trimOverlapOutside),
    sections: cloneSections(sectionsValue.length ? sectionsValue : DEFAULT_CONFIG.params.sections),
  };
  const name = normalizeConfigName(source?.name || "Imported configuration") || "Imported configuration";

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
  const cleaned = String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || "Project";
}

function exportTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function exportFilename(projectName, fileFormat) {
  return `Mutex_BellowGenV2_${safeFilename(projectName)}_${exportTimestamp()}.${fileFormat}`;
}

function requestProjectNameForExport() {
  if (projectNameEdited) {
    const cleanedName = normalizeConfigName(currentProjectName);
    if (cleanedName) {
      currentProjectName = cleanedName;
      projectNameInput.value = currentProjectName;
      return currentProjectName;
    }
  }
  const enteredName = window.prompt?.("请输入项目名称", currentProjectName);
  if (enteredName == null) {
    return null;
  }
  setProjectName(normalizeConfigName(enteredName), true);
  return currentProjectName;
}

function findConfigByProjectName(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  return allConfigs().find((config) => config.name.toLowerCase() === normalizedName) || null;
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
  const projectNameLabel = projectNameInput.closest("label");
  if (projectNameLabel) {
    projectNameLabel.dataset.param = "configSelect";
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
  setLabelText(projectNameInput.closest("label"), currentLang === "zh" ? "项目名称" : "Project name");
  setLabelText(configSelect.closest("label"), t.config);
  projectNameInput.setAttribute("aria-label", currentLang === "zh" ? "项目名称" : "Project name");
  importConfigButton.textContent = t.importConfig;
  exportConfigButton.textContent = t.exportConfig;
  document.querySelector(".control-section:nth-of-type(1) .section-title span").textContent = t.frontSize;
  document.querySelector(".control-section:nth-of-type(2) .section-title span").textContent = t.rearSize;
  document.querySelector(".control-section:nth-of-type(3) .section-title span").textContent = t.sectionConfig;
  document.querySelector(".control-section:nth-of-type(4) .section-title span").textContent = t.overlap;
  document.querySelector(".control-section:nth-of-type(5) .section-title span").textContent = t.heightDiff;
  document.querySelector(".status-label").textContent = t.livePreview;
  fitViewButton.textContent = t.fitView;
  contactLink.textContent = t.contactMe;
  exportSvgButton.textContent = t.exportSvg;
  exportPdfButton.textContent = t.exportPdf;
  addSectionButton.setAttribute("aria-label", t.addSection);
  document.querySelector(".metric-readout span").textContent = t.bellowLength;

  Object.entries(t.optionLabels).forEach(([name, labelText]) => {
    const input = controls.querySelector(`[name="${name}"]`);
    if (input?.closest("label")) {
      setLabelText(input.closest("label"), labelText);
    }
  });

  setLabelText(controls.querySelector('[name="enableSupportRibs"]').closest("label"), t.enableSupportRibs);
  setLabelText(controls.querySelector('[name="useRectangularRibs"]').closest("label"), t.useRectangularRibs);
  setLabelText(controls.querySelector('[name="useCornerlessRibs"]').closest("label"), t.useCornerlessRibs);
  setLabelText(controls.querySelector('[name="showBoundingBox"]').closest("label"), t.showBoundingBox);
  setLabelText(controls.querySelector('[name="rotateToBoundingBox"]').closest("label"), t.rotateToBoundingBox);
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
    odf: num(data.get("odf"), 12),
    odr: num(data.get("odr"), 18),
    frhd: num(data.get("frhd"), 0),
    srd: Math.max(0, num(data.get("srd"), 0.5)),
    ribCornerRadius: Math.max(0, num(data.get("ribCornerRadius"), 0.5)),
    enableSupportRibs: Boolean(controls.querySelector('[name="enableSupportRibs"]')?.checked),
    useRectangularRibs: Boolean(controls.querySelector('[name="useRectangularRibs"]')?.checked),
    useCornerlessRibs: Boolean(controls.querySelector('[name="useCornerlessRibs"]')?.checked),
    showBoundingBox: Boolean(controls.querySelector('[name="showBoundingBox"]')?.checked),
    rotateToBoundingBox: Boolean(controls.querySelector('[name="rotateToBoundingBox"]')?.checked),
    enhanceMountFrame: Boolean(controls.querySelector('[name="enhanceMountFrame"]')?.checked),
    enableOverlap: Boolean(controls.querySelector('[name="enableOverlap"]')?.checked),
    trimOverlapOutside: Boolean(controls.querySelector('[name="trimOverlapOutside"]')?.checked),
    sections: cleanSections.length ? cleanSections : [{ lhs: 1, nos: 1 }],
  };
}

function syncBoundingBoxControls() {
  const showInput = controls.querySelector('[name="showBoundingBox"]');
  const rotateInput = controls.querySelector('[name="rotateToBoundingBox"]');
  if (!showInput || !rotateInput) {
    return;
  }
  rotateInput.disabled = !showInput.checked;
  if (!showInput.checked && rotateInput.checked) {
    rotateInput.checked = false;
  }
}

function buildTopModule(params) {
  const totalLeg = params.sections.reduce((sum, section) => sum + 2 * section.lhs * section.nos, 0);
  const halfDelta = (params.wir - params.wif) / 2;
  const minLeg = Math.abs(halfDelta) + 0.01;
  const effectiveLeg = Math.max(totalLeg, minLeg);
  const height = Math.sqrt(Math.max(0.01, effectiveLeg * effectiveLeg - halfDelta * halfDelta));
  const firstLhs = params.sections[0].lhs;
  const rearLhs = params.sections[params.sections.length - 1].lhs;

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
  shapes.push(polyline([mbl, pt(mbl.x, height + rearLhs), pt(mbr.x, height + rearLhs), mbr], "cut-line"));
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
      outerY: height + rearLhs,
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
    rearLhs,
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

function buildSupportRibsForSequences(leftSeq, rightSeq, params, options = {}) {
  if (!params.enableSupportRibs || params.srd <= 0) {
    return [];
  }
  const ribs = [];
  for (let index = 0; index < Math.min(leftSeq.length, rightSeq.length) - 1; index += 1) {
    const cell = [leftSeq[index], rightSeq[index], rightSeq[index + 1], leftSeq[index + 1]];
    const rib = params.useCornerlessRibs
      ? cornerlessRibFromCell(cell, params.srd)
      : params.useRectangularRibs
      ? rectangularRibFromCell(cell, params.srd)
      : insetPolygon(cell, params.srd);
    if (rib.length >= 4) {
      const shape = polyline([...rib, rib[0]], "support-rib");
      if (params.ribCornerRadius > 0) {
        shape.roundRadius = params.ribCornerRadius;
        shape.preservePath = true;
      }
      if (options.mirrorable != null) {
        shape.mirrorable = Boolean(options.mirrorable);
      }
      ribs.push(shape);
    }
  }
  return ribs;
}

function insetPolygon(points, distance) {
  const center = centroid(points);
  const lines = points.map((pointValue, index) => {
    const next = points[(index + 1) % points.length];
    let normal = unit(pt(-(next.y - pointValue.y), next.x - pointValue.x));
    if (dot(normal, sub(center, pointValue)) < 0) {
      normal = mul(normal, -1);
    }
    const offset = mul(normal, distance);
    return { a: add(pointValue, offset), b: add(next, offset) };
  });

  const result = [];
  for (let index = 0; index < lines.length; index += 1) {
    const previous = lines[(index + lines.length - 1) % lines.length];
    const current = lines[index];
    const intersection = lineIntersection(previous.a, previous.b, current.a, current.b);
    if (!intersection) {
      return [];
    }
    result.push(intersection);
  }
  return result.every((pointValue) => Number.isFinite(pointValue.x) && Number.isFinite(pointValue.y)) ? result : [];
}

function rectangularRibFromCell(points, distance) {
  const inset = insetPolygon(points, distance);
  if (inset.length < 4) {
    return [];
  }
  const topStart = inset[0];
  const topEnd = inset[1];
  const bottomEnd = inset[2];
  const bottomStart = inset[3];
  const topLength = len(sub(topEnd, topStart));
  const bottomLength = len(sub(bottomEnd, bottomStart));
  const useTop = topLength <= bottomLength;
  const baseStart = useTop ? topStart : bottomStart;
  const baseEnd = useTop ? topEnd : bottomEnd;
  const otherStart = useTop ? bottomStart : topStart;
  const otherEnd = useTop ? bottomEnd : topEnd;
  const baseVector = sub(baseEnd, baseStart);
  const baseUnit = unit(baseVector);
  const baseNormal = pt(-baseUnit.y, baseUnit.x);
  const baseMid = lerp(baseStart, baseEnd, 0.5);
  const otherMid = lerp(otherStart, otherEnd, 0.5);
  let heightVector = mul(baseNormal, dot(sub(otherMid, baseMid), baseNormal));
  if (len(heightVector) < 0.001) {
    heightVector = sub(otherMid, baseMid);
  }
  return [baseStart, baseEnd, add(baseEnd, heightVector), add(baseStart, heightVector)];
}

function cornerlessRibFromCell(points, distance) {
  const inset = insetPolygon(points, distance);
  if (inset.length < 4) {
    return [];
  }
  return cornerlessRibFromInset(inset);
}

function cornerlessRibFromInset(points) {
  const topStart = points[0];
  const topEnd = points[1];
  const bottomEnd = points[2];
  const bottomStart = points[3];
  const topLength = len(sub(topEnd, topStart));
  const bottomLength = len(sub(bottomEnd, bottomStart));
  const useTop = topLength <= bottomLength;
  const center = centroid(points);

  if (useTop) {
    const leftCut = rotatedLegBaseIntersection(topStart, bottomStart, bottomStart, bottomEnd, center);
    const rightCut = rotatedLegBaseIntersection(topEnd, bottomEnd, bottomStart, bottomEnd, center);
    if (!leftCut || !rightCut || len(sub(leftCut, rightCut)) < 0.001) {
      return points;
    }
    return [topStart, topEnd, rightCut, leftCut];
  }

  const leftCut = rotatedLegBaseIntersection(bottomStart, topStart, topStart, topEnd, center);
  const rightCut = rotatedLegBaseIntersection(bottomEnd, topEnd, topStart, topEnd, center);
  if (!leftCut || !rightCut || len(sub(leftCut, rightCut)) < 0.001) {
    return points;
  }
  return [leftCut, rightCut, bottomEnd, bottomStart];
}

function rotatedLegBaseIntersection(pivot, originalFar, baseStart, baseEnd, center) {
  const original = sub(originalFar, pivot);
  if (len(original) < 0.001) {
    return null;
  }
  const towardCenter = unit(sub(center, pivot));
  const candidates = [rotate(original, Math.PI / 4), rotate(original, -Math.PI / 4)]
    .sort((a, b) => dot(unit(b), towardCenter) - dot(unit(a), towardCenter));

  for (const candidate of candidates) {
    const intersection = lineIntersection(pivot, add(pivot, candidate), baseStart, baseEnd);
    if (intersection && pointOnSegment(intersection, baseStart, baseEnd)) {
      return intersection;
    }
  }
  return null;
}

function pointOnSegment(pointValue, a, b) {
  const segment = sub(b, a);
  const lengthSq = dot(segment, segment) || 1;
  const projection = dot(sub(pointValue, a), segment) / lengthSq;
  return projection >= -0.001 && projection <= 1.001;
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
  const topRibs = buildSupportRibsForSequences(top.leftSeq, top.rightSeq, params);
  shapes.push(...topRibs);
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
  shapes.push(...buildSupportRibsForSequences(
    top.leftSeq.map(toRightBottom),
    top.rightSeq.map(toRightBottom),
    params,
    { mirrorable: false },
  ));
  shapes.push(textShape("M1 底面右半", toRightBottom(pt(0, top.height / 2)).x, toRightBottom(pt(0, top.height / 2)).y, "label"));

  for (let index = 0; index < top.rightSeq.length; index += 1) {
    shapes.push(polyline([top.rightSeq[index], toRightBottom(top.leftSeq[index])], "fold-line"));
  }
  shapes.push(...buildSupportRibsForSequences(
    top.rightSeq,
    top.leftSeq.map(toRightBottom),
    params,
  ));

  const mirror = (point) => pt(-point.x, point.y);
  const mirrorShapes = shapes
    .filter((shape) => shape.mirrorable)
    .map((shape) => transformShape(shape, mirror));
  shapes.push(...mirrorShapes);
  shapes.push(textShape("LS 左侧面", -(top.pmrt.x + rsrt.x) / 2 - 20, (top.pmrt.y + top.pmrb.y) / 2, "label"));

  const toLeftBottom = (pointValue) => mirror(toRightBottom(pointValue));
  shapes.push(...buildSupportRibsForSequences(
    top.leftSeq.map(toLeftBottom),
    top.rightSeq.map(toLeftBottom),
    params,
    { mirrorable: false },
  ));
  const leftOverlap = buildOverlapBand(params, top, toLeftBottom, "left");
  const rightOverlap = buildOverlapBand(params, top, toRightBottom, "right");
  let outputShapes = shapes;
  if (params.enableOverlap && params.trimOverlapOutside) {
    const supportShapes = outputShapes.filter((shape) => shape.className === "support-rib");
    outputShapes = outputShapes.filter((shape) => shape.className !== "support-rib");
    outputShapes = clipShapesToHalfPlane(outputShapes, leftOverlap.clipLine.a, leftOverlap.clipLine.b, pt(0, top.height / 2));
    outputShapes = clipShapesToHalfPlane(outputShapes, rightOverlap.clipLine.a, rightOverlap.clipLine.b, pt(0, top.height / 2));
    outputShapes.push(...supportShapes);
  }
  if (params.enableOverlap) {
    outputShapes.push(...leftOverlap.shapes, ...rightOverlap.shapes);
  }
  outputShapes = removeDuplicateLineSegments(outputShapes);
  const boundingResult = applyBoundingBoxOptions(outputShapes, params);
  outputShapes = boundingResult.shapes;

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

  return { shapes: outputShapes, contentBox, viewBox, params, rightSide, top, guideTargets, boundingRectangle: boundingResult.boundingRectangle };
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
    wor: [toRightBottom(pt(0, top.height + top.rearLhs)), toLeftBottom(pt(0, top.height + top.rearLhs))],
    hor: [toRightBottom(pt(top.mbr.x, top.height + top.rearLhs / 2)), toLeftBottom(pt(top.mbl.x, top.height + top.rearLhs / 2))],
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
    srd: sectionTargets.flat(),
    ribCornerRadius: sectionTargets.flat(),
    enableSupportRibs: sectionTargets.flat(),
    useRectangularRibs: sectionTargets.flat(),
    useCornerlessRibs: sectionTargets.flat(),
    showBoundingBox: sectionTargets.flat(),
    rotateToBoundingBox: sectionTargets.flat(),
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
    ? pt(top.mbl.x, top.height + top.rearLhs)
    : pt(top.mbr.x, top.height + top.rearLhs));
  const rearOuterEnd = transform(useTransformedLeftVertex
    ? pt(top.mbr.x, top.height + top.rearLhs)
    : pt(top.mbl.x, top.height + top.rearLhs));
  const port = pointAtSignedDistance(topStart, topEnd, signedOverlapDistance(params.odf, params.woo));
  const porb = pointAtSignedDistance(bottomStart, bottomEnd, signedOverlapDistance(params.odr, params.woo));
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

function pointAtSignedDistance(a, b, distance) {
  if (distance < 0) {
    return pointAtDistance(b, a, Math.abs(distance));
  }
  return pointAtDistance(a, b, distance);
}

function signedOverlapDistance(value, overlapWidth) {
  const distance = num(value, 0);
  if (distance < 0) {
    return -(Math.abs(distance) + Math.max(0, num(overlapWidth, 0)));
  }
  return distance;
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
    if (shape.kind !== "polyline" || shape.preservePath) {
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

function shapePoints(shapes, options = {}) {
  const points = [];
  shapes.forEach((shape) => {
    if (options.exportOnly && (shape.previewOnly || shape.kind === "text")) {
      return;
    }
    if (shape.kind === "text") {
      points.push(pt(shape.x, shape.y));
      return;
    }
    points.push(...shape.points);
  });
  return points;
}

function convexHull(points) {
  const unique = [...new Map(points.map((pointValue) => [linePointKey(pointValue), pointValue])).values()]
    .sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
  if (unique.length <= 1) {
    return unique;
  }

  const lower = [];
  unique.forEach((pointValue) => {
    while (lower.length >= 2 && cross(sub(lower[lower.length - 1], lower[lower.length - 2]), sub(pointValue, lower[lower.length - 1])) <= 0) {
      lower.pop();
    }
    lower.push(pointValue);
  });

  const upper = [];
  [...unique].reverse().forEach((pointValue) => {
    while (upper.length >= 2 && cross(sub(upper[upper.length - 1], upper[upper.length - 2]), sub(pointValue, upper[upper.length - 1])) <= 0) {
      upper.pop();
    }
    upper.push(pointValue);
  });

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function minimumBoundingRectangle(points) {
  const hull = convexHull(points);
  if (hull.length < 2) {
    const pointValue = hull[0] || pt(0, 0);
    return {
      angle: 0,
      width: 1,
      height: 1,
      area: 1,
      center: pointValue,
      corners: [pointValue, add(pointValue, pt(1, 0)), add(pointValue, pt(1, 1)), add(pointValue, pt(0, 1)), pointValue],
    };
  }

  let best = null;
  for (let index = 0; index < hull.length; index += 1) {
    const edge = sub(hull[(index + 1) % hull.length], hull[index]);
    if (len(edge) < 0.001) {
      continue;
    }
    const angle = Math.atan2(edge.y, edge.x);
    const rotated = hull.map((pointValue) => rotate(pointValue, -angle));
    const box = boundsFromPoints(rotated);
    const area = box.width * box.height;
    if (!best || area < best.area) {
      const corners = [
        pt(box.x, box.y),
        pt(box.x + box.width, box.y),
        pt(box.x + box.width, box.y + box.height),
        pt(box.x, box.y + box.height),
      ].map((pointValue) => rotate(pointValue, angle));
      best = {
        angle,
        width: box.width,
        height: box.height,
        area,
        center: rotate(pt(box.x + box.width / 2, box.y + box.height / 2), angle),
        corners: [...corners, corners[0]],
      };
    }
  }
  return best;
}

function boundsFromPoints(points) {
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

function rotateShapesToBoundingBox(shapes, rectangle) {
  const longAngle = rectangle.width >= rectangle.height ? rectangle.angle : rectangle.angle + Math.PI / 2;
  const rotation = Math.PI / 2 - longAngle;
  return shapes.map((shape) => transformShape(shape, (pointValue) => rotateAround(pointValue, rotation, rectangle.center)));
}

function boundingBoxShapes(rectangle) {
  const widthLabel = `${round(rectangle.width)} mm`;
  const heightLabel = `${round(rectangle.height)} mm`;
  const topMid = lerp(rectangle.corners[0], rectangle.corners[1], 0.5);
  const rightMid = lerp(rectangle.corners[1], rectangle.corners[2], 0.5);
  const topNormal = mul(unit(sub(rectangle.corners[0], rectangle.center)), 8);
  const rightNormal = mul(unit(sub(rectangle.corners[2], rectangle.center)), 8);
  return [
    { ...polyline(rectangle.corners, "bounding-box"), mirrorable: false, exportText: true },
    { ...textShape(widthLabel, add(topMid, topNormal).x, add(topMid, topNormal).y, "bounding-label"), exportText: true },
    { ...textShape(heightLabel, add(rightMid, rightNormal).x, add(rightMid, rightNormal).y, "bounding-label"), exportText: true },
  ];
}

function applyBoundingBoxOptions(shapes, params) {
  let outputShapes = shapes;
  let boundingRectangle = null;
  if (params.showBoundingBox || params.rotateToBoundingBox) {
    boundingRectangle = minimumBoundingRectangle(shapePoints(outputShapes, { exportOnly: true }));
  }
  if (params.showBoundingBox && params.rotateToBoundingBox && boundingRectangle) {
    outputShapes = rotateShapesToBoundingBox(outputShapes, boundingRectangle);
    boundingRectangle = minimumBoundingRectangle(shapePoints(outputShapes, { exportOnly: true }));
  }
  if (params.showBoundingBox && boundingRectangle) {
    outputShapes = [...outputShapes, ...boundingBoxShapes(boundingRectangle)];
  }
  return { shapes: outputShapes, boundingRectangle };
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
  bellowLength.textContent = `${round(pattern.top.height)} mm`;
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
  element.setAttribute("d", shape.roundRadius > 0
    ? roundedPathString(shape.points, shape.roundRadius)
    : pathString(shape.points));
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
    .support-rib{fill:none;stroke:#c99700;stroke-width:.385;vector-effect:non-scaling-stroke}
    .bounding-box{fill:none;stroke:#dc2626;stroke-width:.75;vector-effect:non-scaling-stroke}
    .bounding-label{fill:#dc2626;font-size:5px;font-weight:700;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:#fff;stroke-width:1.4px;vector-effect:non-scaling-stroke}
  `;
}

function previewStyles() {
  return `
    .cut-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .fold-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .mount-line{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .overlap-band{fill:none;stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke}
    .support-rib{fill:none;stroke:#ffd84d;stroke-width:.49;vector-effect:non-scaling-stroke}
    .bounding-box{fill:none;stroke:#ff5a6f;stroke-width:.8;vector-effect:non-scaling-stroke}
    .reference-line{fill:none;stroke:rgba(255,255,255,.75);stroke-width:.7;stroke-dasharray:5 3;vector-effect:non-scaling-stroke}
    .grid-line{fill:none;stroke:rgba(255,255,255,.12);stroke-width:.25;vector-effect:non-scaling-stroke}
    .label{fill:#a9d8eb;font-size:4.5px;font-weight:700;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:rgba(7,21,37,.9);stroke-width:1.4px;vector-effect:non-scaling-stroke}
    .reference-label{fill:#fff;font-size:4px;font-weight:700;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:rgba(7,21,37,.9);stroke-width:1.4px;vector-effect:non-scaling-stroke}
    .bounding-label{fill:#ff98a6;font-size:5px;font-weight:800;font-family:Arial,"Microsoft YaHei",sans-serif;paint-order:stroke;stroke:rgba(7,21,37,.95);stroke-width:1.5px;vector-effect:non-scaling-stroke}
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
  const exportShapes = lastPattern.shapes.filter((shape) => !shape.previewOnly && (shape.kind !== "text" || shape.exportText));
  const boundingShapes = exportShapes.filter((shape) => shape.className === "bounding-box" || shape.className === "bounding-label");
  const mainShapes = exportShapes.filter((shape) => shape.className !== "support-rib" && shape.className !== "bounding-box" && shape.className !== "bounding-label");
  const supportShapes = exportShapes.filter((shape) => shape.className === "support-rib");
  const exportBox = paddedBounds(exportShapes);
  const mainContent = mainShapes.map((shape) => createMarkup(shape)).join("\n");
  const supportContent = supportShapes.map((shape) => createMarkup(shape)).join("\n");
  const boundingContent = boundingShapes.map((shape) => createMarkup(shape)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${round(exportBox.width)}mm" height="${round(exportBox.height)}mm" viewBox="${round(exportBox.x)} ${round(exportBox.y)} ${round(exportBox.width)} ${round(exportBox.height)}">
  <defs><style>${exportStyles()}</style></defs>
  <g id="bellow-pattern">
    ${mainContent}
  </g>
  <g id="support-ribs">
    ${supportContent}
  </g>
  <g id="minimum-bounding-rectangle">
    ${boundingContent}
  </g>
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
  const d = shape.roundRadius > 0 ? roundedPathString(shape.points, shape.roundRadius) : pathString(shape.points);
  return `<path class="${shape.className}" d="${d}" />`;
}

controls.addEventListener("input", (event) => {
  const target = event.target;
  if (target.dataset.section) {
    const index = Number.parseInt(target.dataset.section, 10);
    sections[index][target.dataset.key] = target.value;
  }
  if (target.name === "showBoundingBox") {
    syncBoundingBoxControls();
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

projectNameInput.addEventListener("focus", () => {
  projectNameInput.select();
});

projectNameInput.addEventListener("input", () => {
  setProjectName(projectNameInput.value, true);
});

projectNameInput.addEventListener("change", () => {
  const matchingConfig = findConfigByProjectName(projectNameInput.value);
  if (matchingConfig) {
    configSelect.value = matchingConfig.id;
    applyConfig(matchingConfig);
    return;
  }
  setProjectName(projectNameInput.value, true);
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
  const projectName = requestProjectNameForExport();
  if (!projectName) {
    return;
  }
  const payload = currentConfigPayload();
  download(
    exportFilename(projectName, "json"),
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
  const projectName = requestProjectNameForExport();
  if (!projectName) {
    return;
  }
  download(exportFilename(projectName, "svg"), serializeSvg(), "image/svg+xml;charset=utf-8");
});

exportPdfButton.addEventListener("click", () => {
  const projectName = requestProjectNameForExport();
  if (!projectName) {
    return;
  }
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
        <title>${escapeXml(exportFilename(projectName, "pdf"))}</title>
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
syncBoundingBoxControls();
annotateOptionControls();
updateStaticLanguage();
window.addEventListener("resize", updateActiveHint);
controls.addEventListener("scroll", updateActiveHint);
