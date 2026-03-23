/**
 * Color Vision Helper - Popup Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const mainToggle = document.getElementById("main-toggle");
  const intensitySlider = document.getElementById("intensity-slider");
  const intensityDisplay = document.getElementById("intensity-display");
  const typeButtons = document.querySelectorAll(".type-grid .type-btn");
  const expandBtn = document.getElementById("expand-types");
  const expandLabel = document.getElementById("expand-label");
  const typeGrid = document.getElementById("type-grid");
  const langBtn = document.getElementById("lang-btn");
  const langMenu = document.getElementById("lang-menu");
  const langOptions = document.querySelectorAll(".lang-option");

  let currentType = "deuteranopia";
  let currentIntensity = 80;
  let enabled = false;
  let gridExpanded = false;
  let currentLang = "zh";

  // ============================================================
  // 初始化
  // ============================================================
  chrome.storage.local.get(
    ["filterType", "intensity", "enabled", "gridExpanded", "lang"],
    (data) => {
      if (data.filterType) currentType = data.filterType;
      if (data.intensity !== undefined) currentIntensity = data.intensity;
      if (data.enabled !== undefined) enabled = data.enabled;
      if (data.gridExpanded !== undefined) gridExpanded = data.gridExpanded;
      if (data.lang) currentLang = data.lang;

      mainToggle.checked = enabled;
      intensitySlider.value = currentIntensity;
      intensityDisplay.textContent = currentIntensity + "%";
      updateActiveButton(currentType);
      updateDisabledState();
      updateGridState();
      applyLanguage(currentLang);
    }
  );

  // ============================================================
  // 总开关
  // ============================================================
  mainToggle.addEventListener("change", () => {
    enabled = mainToggle.checked;
    updateDisabledState();
    saveAndApply();
  });

  // ============================================================
  // 语言切换
  // ============================================================
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });

  // 点击菜单外部关闭
  document.addEventListener("click", (e) => {
    if (!langMenu.contains(e.target) && e.target !== langBtn) {
      langMenu.classList.remove("open");
    }
  });

  langOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      applyLanguage(currentLang);
      langMenu.classList.remove("open");
      updateGridState(); // 刷新展开/收起文字
      chrome.storage.local.set({ lang: currentLang });
    });
  });

  // ============================================================
  // 展开/收起
  // ============================================================
  expandBtn.addEventListener("click", () => {
    gridExpanded = !gridExpanded;
    updateGridState();
    chrome.storage.local.set({ gridExpanded });
  });

  // ============================================================
  // 精确类型选择
  // ============================================================
  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentType = btn.dataset.type;
      updateActiveButton(currentType);
      saveAndApply();
    });
  });

  // ============================================================
  // 强度滑块
  // ============================================================
  intensitySlider.addEventListener("input", () => {
    currentIntensity = parseInt(intensitySlider.value);
    intensityDisplay.textContent = currentIntensity + "%";
  });

  intensitySlider.addEventListener("change", () => {
    currentIntensity = parseInt(intensitySlider.value);
    saveAndApply();
  });

  // ============================================================
  // 工具函数
  // ============================================================

  function updateActiveButton(type) {
    typeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });
  }

  function updateDisabledState() {
    document.body.classList.toggle("disabled", !enabled);
  }

  function updateGridState() {
    typeGrid.classList.toggle("collapsed", !gridExpanded);
    const strings = I18N[currentLang] || I18N.zh;
    if (gridExpanded) {
      expandLabel.textContent = strings.collapse;
      expandBtn.lastChild.textContent = " ▴";
    } else {
      expandLabel.textContent = strings.expand;
      expandBtn.lastChild.textContent = " ▾";
    }
  }

  function saveAndApply() {
    chrome.storage.local.set({
      filterType: currentType,
      intensity: currentIntensity,
      enabled: enabled,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      const message = enabled
        ? { action: "applyFilter", type: currentType, intensity: currentIntensity }
        : { action: "removeFilter" };
      chrome.tabs.sendMessage(tabs[0].id, message).catch(() => {});
    });
  }
});
