/**
 * 国际化 (i18n) - 联合国六种官方语言
 */

const I18N = {
  zh: {
    _label: "中文",
    _dir: "ltr",
    appTitle: "色觉辅助",
    testHint: "不确定自己的类型？",
    testLink: "在线色觉测试 →",
    selectType: "选择类型",
    expand: "展开",
    collapse: "收起",
    protanopia: "红色盲",
    deuteranopia: "绿色盲",
    protanomaly: "红色弱",
    deuteranomaly: "绿色弱",
    tritanopia: "蓝黄色盲",
    tritanomaly: "蓝黄色弱",
    achromatopsia: "全色盲",
    intensity: "校正强度",
    slight: "轻微",
    strong: "强烈",
    colorPreview: "颜色预览",
    red: "红",
    orange: "橙",
    yellow: "黄",
    green: "绿",
    blue: "蓝",
    purple: "紫",
    previewHint: "开启后这些颜色在网页上会更容易区分"
  },

  en: {
    _label: "English",
    _dir: "ltr",
    appTitle: "Color Vision Helper",
    testHint: "Not sure about your type?",
    testLink: "Online vision test →",
    selectType: "Select type",
    expand: "Expand",
    collapse: "Collapse",
    protanopia: "Protanopia (red-blind)",
    deuteranopia: "Deuteranopia (green-blind)",
    protanomaly: "Protanomaly (red-weak)",
    deuteranomaly: "Deuteranomaly (green-weak)",
    tritanopia: "Tritanopia (blue-yellow blind)",
    tritanomaly: "Tritanomaly (blue-yellow weak)",
    achromatopsia: "Achromatopsia (total)",
    intensity: "Correction intensity",
    slight: "Slight",
    strong: "Strong",
    colorPreview: "Color preview",
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    blue: "Blue",
    purple: "Purple",
    previewHint: "Colors on webpages will be easier to distinguish"
  },

  fr: {
    _label: "Français",
    _dir: "ltr",
    appTitle: "Aide à la vision des couleurs",
    testHint: "Pas sûr de votre type ?",
    testLink: "Test de vision en ligne →",
    selectType: "Choisir le type",
    expand: "Développer",
    collapse: "Réduire",
    protanopia: "Protanopie (rouge)",
    deuteranopia: "Deutéranopie (vert)",
    protanomaly: "Protanomalie (rouge faible)",
    deuteranomaly: "Deutéranomalie (vert faible)",
    tritanopia: "Tritanopie (bleu-jaune)",
    tritanomaly: "Tritanomalie (bleu-jaune)",
    achromatopsia: "Achromatopsie (totale)",
    intensity: "Intensité de correction",
    slight: "Légère",
    strong: "Forte",
    colorPreview: "Aperçu des couleurs",
    red: "Rouge",
    orange: "Orange",
    yellow: "Jaune",
    green: "Vert",
    blue: "Bleu",
    purple: "Violet",
    previewHint: "Les couleurs des pages web seront plus faciles à distinguer"
  },

  es: {
    _label: "Español",
    _dir: "ltr",
    appTitle: "Asistente de visión del color",
    testHint: "¿No estás seguro de tu tipo?",
    testLink: "Prueba de visión en línea →",
    selectType: "Seleccionar tipo",
    expand: "Expandir",
    collapse: "Contraer",
    protanopia: "Protanopía (rojo)",
    deuteranopia: "Deuteranopía (verde)",
    protanomaly: "Protanomalía (rojo débil)",
    deuteranomaly: "Deuteranomalía (verde débil)",
    tritanopia: "Tritanopía (azul-amarillo)",
    tritanomaly: "Tritanomalía (azul-amarillo)",
    achromatopsia: "Acromatopsia (total)",
    intensity: "Intensidad de corrección",
    slight: "Leve",
    strong: "Fuerte",
    colorPreview: "Vista previa de colores",
    red: "Rojo",
    orange: "Naranja",
    yellow: "Amarillo",
    green: "Verde",
    blue: "Azul",
    purple: "Morado",
    previewHint: "Los colores en las páginas web serán más fáciles de distinguir"
  },

  ru: {
    _label: "Русский",
    _dir: "ltr",
    appTitle: "Помощник цветового зрения",
    testHint: "Не уверены в своём типе?",
    testLink: "Онлайн-тест зрения →",
    selectType: "Выбрать тип",
    expand: "Развернуть",
    collapse: "Свернуть",
    protanopia: "Протанопия (красный)",
    deuteranopia: "Дейтеранопия (зелёный)",
    protanomaly: "Протаномалия (красн. слаб.)",
    deuteranomaly: "Дейтераномалия (зел. слаб.)",
    tritanopia: "Тританопия (сине-жёлтый)",
    tritanomaly: "Тританомалия (сине-жёлт.)",
    achromatopsia: "Ахроматопсия (полная)",
    intensity: "Интенсивность коррекции",
    slight: "Слабая",
    strong: "Сильная",
    colorPreview: "Предпросмотр цветов",
    red: "Красный",
    orange: "Оранж.",
    yellow: "Жёлтый",
    green: "Зелёный",
    blue: "Синий",
    purple: "Фиолет.",
    previewHint: "Цвета на веб-страницах станут легче различимы"
  },

  ar: {
    _label: "العربية",
    _dir: "rtl",
    appTitle: "مساعد رؤية الألوان",
    testHint: "غير متأكد من نوعك؟",
    testLink: "← اختبار رؤية عبر الإنترنت",
    selectType: "اختر النوع",
    expand: "توسيع",
    collapse: "طي",
    protanopia: "عمى الأحمر",
    deuteranopia: "عمى الأخضر",
    protanomaly: "ضعف الأحمر",
    deuteranomaly: "ضعف الأخضر",
    tritanopia: "عمى الأزرق والأصفر",
    tritanomaly: "ضعف الأزرق والأصفر",
    achromatopsia: "عمى الألوان الكلي",
    intensity: "شدة التصحيح",
    slight: "خفيف",
    strong: "قوي",
    colorPreview: "معاينة الألوان",
    red: "أحمر",
    orange: "برتقالي",
    yellow: "أصفر",
    green: "أخضر",
    blue: "أزرق",
    purple: "بنفسجي",
    previewHint: "ستكون الألوان على صفحات الويب أسهل في التمييز"
  }
};

/**
 * 应用翻译到所有带 data-i18n 属性的元素
 */
function applyLanguage(lang) {
  const strings = I18N[lang];
  if (!strings) return;

  // 更新所有 data-i18n 元素
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) {
      el.textContent = strings[key];
    }
  });

  // 更新语言标签
  const langLabel = document.getElementById("lang-label");
  if (langLabel) langLabel.textContent = strings._label;

  // 更新激活状态
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // RTL 支持 (阿拉伯语)
  document.documentElement.dir = strings._dir || "ltr";
}
