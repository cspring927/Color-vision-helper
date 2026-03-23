/**
 * Color Vision Helper - Content Script
 * 
 * 使用 SVG 滤镜对网页颜色进行校正，帮助色盲/色弱用户区分颜色。
 * 
 * 原理：通过 CSS filter 引用 SVG feColorMatrix，
 * 对整个页面的颜色进行矩阵变换。
 * 不同的色盲类型使用不同的校正矩阵。
 */

// ============================================================
// 色彩校正矩阵
// 基于 Brettel/Viénot 算法的简化版本
// 每个矩阵将难以区分的颜色映射到更容易区分的色域
// ============================================================
const CORRECTION_MATRICES = {
  // 红色盲 (Protanopia) - 缺少红色感受器
  // 将红色信息增强并偏移到可感知的通道
  protanopia: {
    name: "红色盲 (Protanopia)",
    matrix: [
      0.567, 0.433, 0,     0, 0,
      0.558, 0.442, 0,     0, 0,
      0,     0.242, 0.758, 0, 0,
      0,     0,     0,     1, 0
    ]
  },

  // 绿色盲 (Deuteranopia) - 缺少绿色感受器
  deuteranopia: {
    name: "绿色盲 (Deuteranopia)",
    matrix: [
      0.625, 0.375, 0,   0, 0,
      0.7,   0.3,   0,   0, 0,
      0,     0.3,   0.7, 0, 0,
      0,     0,     0,   1, 0
    ]
  },

  // 红色弱 (Protanomaly) - 红色感受器异常
  protanomaly: {
    name: "红色弱 (Protanomaly)",
    matrix: [
      0.817, 0.183, 0,     0, 0,
      0.333, 0.667, 0,     0, 0,
      0,     0.125, 0.875, 0, 0,
      0,     0,     0,     1, 0
    ]
  },

  // 绿色弱 (Deuteranomaly) - 绿色感受器异常（最常见）
  deuteranomaly: {
    name: "绿色弱 (Deuteranomaly)",
    matrix: [
      0.8,   0.2,   0,     0, 0,
      0.258, 0.742, 0,     0, 0,
      0,     0.142, 0.858, 0, 0,
      0,     0,     0,     1, 0
    ]
  },

  // 蓝黄色盲 (Tritanopia) - 缺少蓝色感受器
  tritanopia: {
    name: "蓝黄色盲 (Tritanopia)",
    matrix: [
      0.95, 0.05,  0,     0, 0,
      0,    0.433, 0.567, 0, 0,
      0,    0.475, 0.525, 0, 0,
      0,    0,     0,     1, 0
    ]
  },

  // 蓝黄色弱 (Tritanomaly)
  tritanomaly: {
    name: "蓝黄色弱 (Tritanomaly)",
    matrix: [
      0.967, 0.033, 0,     0, 0,
      0,     0.733, 0.267, 0, 0,
      0,     0.183, 0.817, 0, 0,
      0,     0,     0,     1, 0
    ]
  },

  // 全色盲 (Achromatopsia) - 增强亮度对比
  achromatopsia: {
    name: "全色盲 (Achromatopsia)",
    matrix: [
      0.299, 0.587, 0.114, 0, 0,
      0.299, 0.587, 0.114, 0, 0,
      0.299, 0.587, 0.114, 0, 0,
      0,     0,     0,     1, 0
    ]
  }
};

// ============================================================
// SVG 滤镜注入
// ============================================================

const SVG_FILTER_ID = "cvh-color-filter";
const SVG_CONTAINER_ID = "cvh-svg-container";

/**
 * 创建或更新 SVG 滤镜元素
 */
function injectSVGFilter(matrixValues) {
  // 移除已有的
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
 * 应用滤镜到页面
 */
function applyFilter(type, intensity) {
  if (!type || type === "none" || intensity === 0) {
    removeFilter();
    return;
  }

  const correction = CORRECTION_MATRICES[type];
  if (!correction) return;

  // 根据强度混合原始矩阵和校正矩阵
  // identity matrix (无变化)
  const identity = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
  ];

  const factor = intensity / 100;
  const blended = correction.matrix.map((val, i) => {
    return identity[i] + (val - identity[i]) * factor;
  });

  injectSVGFilter(blended);
  document.documentElement.style.filter = `url(#${SVG_FILTER_ID})`;
}

/**
 * 移除滤镜
 */
function removeFilter() {
  document.documentElement.style.filter = "";
  const existing = document.getElementById(SVG_CONTAINER_ID);
  if (existing) existing.remove();
}

// ============================================================
// 消息监听 & 状态恢复
// ============================================================

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyFilter") {
    applyFilter(message.type, message.intensity);
    sendResponse({ success: true });
  } else if (message.action === "removeFilter") {
    removeFilter();
    sendResponse({ success: true });
  } else if (message.action === "getStatus") {
    sendResponse({ active: !!document.documentElement.style.filter });
  }
  return true;
});

// 页面加载时恢复上次的设置
chrome.storage.local.get(["filterType", "intensity", "enabled"], (data) => {
  if (data.enabled && data.filterType && data.filterType !== "none") {
    applyFilter(data.filterType, data.intensity || 80);
  }
});
