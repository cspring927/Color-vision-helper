/**
 * Color Vision Helper - Content Script
 * 
 * 两种模式：
 * 1. 校正模式 (correction) — 帮助色盲用户区分颜色
 * 2. 模拟模式 (simulation) — 让正常人体验色盲视角
 */

// ============================================================
// 校正矩阵 — 重映射颜色，让色盲用户更容易区分
// ============================================================
const CORRECTION_MATRICES = {
  protanopia: [
    0.567, 0.433, 0,     0, 0,
    0.558, 0.442, 0,     0, 0,
    0,     0.242, 0.758, 0, 0,
    0,     0,     0,     1, 0
  ],
  deuteranopia: [
    0.625, 0.375, 0,   0, 0,
    0.7,   0.3,   0,   0, 0,
    0,     0.3,   0.7, 0, 0,
    0,     0,     0,   1, 0
  ],
  protanomaly: [
    0.817, 0.183, 0,     0, 0,
    0.333, 0.667, 0,     0, 0,
    0,     0.125, 0.875, 0, 0,
    0,     0,     0,     1, 0
  ],
  deuteranomaly: [
    0.8,   0.2,   0,     0, 0,
    0.258, 0.742, 0,     0, 0,
    0,     0.142, 0.858, 0, 0,
    0,     0,     0,     1, 0
  ],
  tritanopia: [
    0.95, 0.05,  0,     0, 0,
    0,    0.433, 0.567, 0, 0,
    0,    0.475, 0.525, 0, 0,
    0,    0,     0,     1, 0
  ],
  tritanomaly: [
    0.967, 0.033, 0,     0, 0,
    0,     0.733, 0.267, 0, 0,
    0,     0.183, 0.817, 0, 0,
    0,     0,     0,     1, 0
  ],
  achromatopsia: [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0,     0,     0,     1, 0
  ]
};

// ============================================================
// 模拟矩阵 — 基于 Brettel/Viénot 算法
// 将正常色域压缩到色盲用户的感知范围，模拟他们看到的世界
// ============================================================
const SIMULATION_MATRICES = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0, 0,
    0.114503, 0.786281,  0.099216, 0, 0,
   -0.003882, -0.048116, 1.051998, 0, 0,
    0,         0,         0,       1, 0
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0, 0,
    0.280085, 0.672501,  0.047413, 0, 0,
   -0.011820, 0.042940,  0.968881, 0, 0,
    0,        0,         0,        1, 0
  ],
  protanomaly: [
    0.458064, 0.679578, -0.137642, 0, 0,
    0.092785, 0.846313,  0.060902, 0, 0,
   -0.007494, -0.016807, 1.024301, 0, 0,
    0,         0,         0,       1, 0
  ],
  deuteranomaly: [
    0.547494, 0.607765, -0.155259, 0, 0,
    0.181692, 0.781742,  0.036566, 0, 0,
   -0.010410, 0.027275,  0.983136, 0, 0,
    0,        0,         0,        1, 0
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, 0, 0,
   -0.078411,  0.930809,  0.147602, 0, 0,
    0.004733,  0.691367,  0.303900, 0, 0,
    0,         0,         0,        1, 0
  ],
  tritanomaly: [
    1.017277, 0.027029, -0.044306, 0, 0,
   -0.006113, 0.958479,  0.047634, 0, 0,
    0.006379, 0.248708,  0.744913, 0, 0,
    0,        0,         0,        1, 0
  ],
  achromatopsia: [
    0.212656, 0.715158, 0.072186, 0, 0,
    0.212656, 0.715158, 0.072186, 0, 0,
    0.212656, 0.715158, 0.072186, 0, 0,
    0,        0,        0,        1, 0
  ]
};

// ============================================================
// SVG 滤镜注入
// ============================================================

const SVG_FILTER_ID = "cvh-color-filter";
const SVG_CONTAINER_ID = "cvh-svg-container";

function injectSVGFilter(matrixValues) {
  const existing = document.getElementById(SVG_CONTAINER_ID);
  if (existing) existing.remove();

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", SVG_CONTAINER_ID);
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";

  const defs = document.createElementNS(svgNS, "defs");
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", SVG_FILTER_ID);
  filter.setAttribute("color-interpolation-filters", "linearRGB");

  const feColorMatrix = document.createElementNS(svgNS, "feColorMatrix");
  feColorMatrix.setAttribute("type", "matrix");
  feColorMatrix.setAttribute("values", matrixValues.join(" "));

  filter.appendChild(feColorMatrix);
  defs.appendChild(filter);
  svg.appendChild(defs);
  document.documentElement.appendChild(svg);
}

/**
 * 应用滤镜
 * @param {string} type - 色盲类型
 * @param {number} intensity - 强度 0-100
 * @param {string} mode - "correction" 或 "simulation"
 */
function applyFilter(type, intensity, mode) {
  if (!type || type === "none" || intensity === 0) {
    removeFilter();
    return;
  }

  const matrices = (mode === "simulation") ? SIMULATION_MATRICES : CORRECTION_MATRICES;
  const matrix = matrices[type];
  if (!matrix) return;

  const identity = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
  ];

  const factor = intensity / 100;
  const blended = matrix.map((val, i) => identity[i] + (val - identity[i]) * factor);

  injectSVGFilter(blended);
  document.documentElement.style.filter = `url(#${SVG_FILTER_ID})`;
}

function removeFilter() {
  document.documentElement.style.filter = "";
  const existing = document.getElementById(SVG_CONTAINER_ID);
  if (existing) existing.remove();
}

// ============================================================
// 消息监听 & 状态恢复
// ============================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyFilter") {
    applyFilter(message.type, message.intensity, message.mode || "correction");
    sendResponse({ success: true });
  } else if (message.action === "removeFilter") {
    removeFilter();
    sendResponse({ success: true });
  } else if (message.action === "getStatus") {
    sendResponse({ active: !!document.documentElement.style.filter });
  }
  return true;
});

chrome.storage.local.get(["filterType", "intensity", "enabled", "mode"], (data) => {
  if (data.enabled && data.filterType && data.filterType !== "none") {
    applyFilter(data.filterType, data.intensity || 80, data.mode || "correction");
  }
});
