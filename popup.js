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
  const modeTabs = document.querySelectorAll(".mode-tab");
  const modeDesc = document.getElementById("mode-desc");

  let currentType = "deuteranopia";
  let currentIntensity = 80;
  let enabled = false;
  let gridExpanded = false;
  let currentLang = "zh";
  let currentMode = "correction";

  // ============================================================
  // 初始化
  // ============================================================
  chrome.storage.local.get(
    ["filterType", "intensity", "enabled", "gridExpanded", "lang", "mode"],
    (data) => {
      if (data.filterType) currentType = data.filterType;
      if (data.intensity !== undefined) currentIntensity = data.intensity;
      if (data.enabled !== undefined) enabled = data.enabled;
      if (data.gridExpanded !== undefined) gridExpanded = data.gridExpanded;
      if (data.lang) currentLang = data.lang;
      if (data.mode) currentMode = data.mode;

      mainToggle.checked = enabled;
      intensitySlider.value = currentIntensity;
      intensityDisplay.textContent = currentIntensity + "%";
      updateActiveButton(currentType);
      updateDisabledState();
      updateGridState();
      updateModeUI();
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
  // 模式切换
  // ============================================================
  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.dataset.mode;
      updateModeUI();
      saveAndApply();
    });
  });

  // ============================================================
  // 语言切换
  // ============================================================
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });

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
      updateGridState();
      updateModeDesc();
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

  function updateModeUI() {
    modeTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === currentMode);
    });
    updateModeDesc();
    chrome.storage.local.set({ mode: currentMode });
  }

  function updateModeDesc() {
    const strings = I18N[currentLang] || I18N.zh;
    const key = (currentMode === "simulation") ? "simulationDesc" : "correctionDesc";
    modeDesc.textContent = strings[key];
    modeDesc.setAttribute("data-i18n", key);
  }

  function saveAndApply() {
    chrome.storage.local.set({
      filterType: currentType,
      intensity: currentIntensity,
      enabled: enabled,
      mode: currentMode,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      const message = enabled
        ? { action: "applyFilter", type: currentType, intensity: currentIntensity, mode: currentMode }
        : { action: "removeFilter" };
      chrome.tabs.sendMessage(tabs[0].id, message).catch(() => {});
    });
  }
});
