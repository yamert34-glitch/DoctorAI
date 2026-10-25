const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navigation?.classList.toggle("is-open", !expanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const componentData = {
  core: {
    category: "APPLICATION",
    status: "IMPLEMENTED",
    statusClass: "status-implemented",
    title: "Application core",
    description:
      "The C++17 application coordinates the assessment flow, command-line options, profile lifecycle, structured intake, protocol checks, and output.",
    specs: [["LANGUAGE", "C++17"], ["BUILD", "CMake"], ["ENTRY", "NasaHunch-src/main.cpp"]],
    note: "The main entry point brings the organized application source files together in one translation unit.",
  },
  ai: {
    category: "INFERENCE",
    status: "OPTIONAL / EXPERIMENTAL",
    statusClass: "status-config",
    title: "Local AI runtime",
    description:
      "llama.cpp and ggml load a local GGUF model. Model-generated assessments are enabled through an explicit runtime option and model selection.",
    specs: [["RUNTIME", "llama.cpp · ggml"], ["FORMAT", "GGUF"], ["MODE", "--experimental-ai"]],
    note: "The configured Raspberry Pi launcher selects a Qwen2.5 0.5B model; other GGUF files can be selected for testing.",
  },
  cache: {
    category: "RETRIEVAL",
    status: "IMPLEMENTED",
    statusClass: "status-implemented",
    title: "Medical reference cache",
    description:
      "A local JSONL collection holds selected public MedlinePlus and DailyMed excerpts. During an assessment, simple keyword scoring selects possible context.",
    specs: [["FORMAT", "JSON Lines"], ["SOURCES", "MedlinePlus · DailyMed"], ["SEARCH", "Keyword matching"]],
    note: "The cache contains selected reference excerpts and uses straightforward keyword matching to find related text.",
  },
  profiles: {
    category: "LOCAL DATA",
    status: "IMPLEMENTED",
    statusClass: "status-implemented",
    title: "User profiles",
    description:
      "Local profiles hold assessment history and separately stored face templates. Assessment payloads use AES-256-GCM encryption.",
    specs: [["PAYLOAD", "AES-256-GCM"], ["IDENTITY", "OpenCV YuNet / SFace"], ["STORAGE", "Local files"]],
    note: "Assessment payloads, face templates, and encryption keys are stored separately.",
  },
  voice: {
    category: "USER INTERFACE",
    status: "CONFIGURATION-DEPENDENT",
    statusClass: "status-config",
    title: "Voice interface",
    description:
      "Configured builds can support local speech recognition in the touchscreen interface and spoken responses through local speech tools.",
    specs: [["INPUT", "Configured local speech"], ["OUTPUT", "Piper / system voice"], ["UI", "Qt 6 Widgets"]],
    note: "Speech features depend on the installed tools, voice/model files, and build configuration.",
  },
  pulse: {
    category: "HARDWARE EXPERIMENT",
    status: "SEPARATE EXPERIMENT",
    statusClass: "status-experimental",
    title: "Pulse sensor",
    description:
      "The ESP32-S3 firmware samples an analog pulse sensor and reports BPM over serial. It is a separate experiment, not the touchscreen pulse workflow.",
    specs: [["BOARD", "ESP32-S3"], ["FIRMWARE", "Arduino · PlatformIO"], ["HOST LINK", "USB serial"]],
    note: "The touchscreen application also has a separate manual pulse-count interaction.",
  },
};

const systemNodes = [...document.querySelectorAll(".system-node")];
const componentIndex = document.querySelector("#component-index");
const componentStatus = document.querySelector("#component-status");
const componentCategory = document.querySelector("#component-category");
const componentTitle = document.querySelector("#component-title");
const componentDescription = document.querySelector("#component-description");
const componentSpecs = document.querySelector("#component-specs");
const componentNote = document.querySelector("#component-note");

function selectComponent(key) {
  const component = componentData[key];
  if (!component) return;

  systemNodes.forEach((node) => {
    const selected = node.dataset.component === key;
    node.classList.toggle("is-selected", selected);
    node.setAttribute("aria-pressed", String(selected));
  });

  const index = systemNodes.findIndex((node) => node.dataset.component === key) + 1;
  if (componentIndex) componentIndex.textContent = `COMPONENT / ${String(index).padStart(2, "0")}`;
  if (componentStatus) {
    componentStatus.textContent = component.status;
    componentStatus.className = `detail-status ${component.statusClass}`;
  }
  if (componentCategory) componentCategory.textContent = component.category;
  if (componentTitle) componentTitle.textContent = component.title;
  if (componentDescription) componentDescription.textContent = component.description;
  if (componentNote) componentNote.textContent = component.note;
  if (componentSpecs) {
    componentSpecs.replaceChildren(
      ...component.specs.map(([label, value]) => {
        const row = document.createElement("div");
        const name = document.createElement("span");
        const detail = document.createElement("b");
        name.textContent = label;
        detail.textContent = value;
        row.append(name, detail);
        return row;
      }),
    );
  }
}

systemNodes.forEach((node, index) => {
  node.addEventListener("click", () => selectComponent(node.dataset.component));
  node.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const backwards = event.key === "ArrowUp" || event.key === "ArrowLeft";
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? systemNodes.length - 1
          : (index + (backwards ? -1 : 1) + systemNodes.length) % systemNodes.length;
    systemNodes[nextIndex].focus();
    selectComponent(systemNodes[nextIndex].dataset.component);
  });
});

const previewScreens = {
  profile: {
    state: "PROFILE SELECT",
    title: "A familiar starting point",
    description: "Local profile selection begins the application flow.",
    eyebrow: "WELCOME · LOCAL PROFILE",
    heading: "Ready when<br />you are.",
    copy: "Select an existing profile or create a new one to begin a check-in.",
    button: "START CHECK-IN",
    after: '<div class="mock-small">THIS IS A STATIC WEBSITE PREVIEW</div>',
  },
  intake: {
    state: "STRUCTURED INTAKE",
    title: "A guided set of questions",
    description: "The application collects symptom details and relevant context.",
    eyebrow: "HEALTH CHECK-IN · QUESTION 01 / 08",
    heading: "What are you<br />feeling right now?",
    copy: "The app asks about symptoms, onset, patterns, other symptoms, and background.",
    button: "CONTINUE TO NEXT QUESTION",
    after: '<div class="mock-small">EXAMPLE INTAKE SCREEN</div>',
  },
  history: {
    state: "HEALTH CONTEXT",
    title: "Relevant context, organized",
    description: "History, medications, and measurements are captured as reported by the user.",
    eyebrow: "HEALTH CHECK-IN · BACKGROUND",
    heading: "Anything else<br />to share?",
    copy: "Relevant medical history and current medications are part of the structured intake.",
    button: "REVIEW YOUR ANSWERS",
    after: '<div class="mock-list"><span class="mock-chip">MEDICATIONS</span><span class="mock-chip">HISTORY</span><span class="mock-chip">HEART RATE</span></div>',
  },
  result: {
    state: "RESPONSE REVIEW",
    title: "A response to review",
    description: "An example of how a generated response could be presented for review.",
    eyebrow: "ASSESSMENT · RESPONSE DRAFT",
    heading: "Review the<br />response.",
    copy: "A locally generated explanation can include uncertainty and source context.",
    button: "READ RESPONSE",
    after: '<div class="mock-callout">AI-GENERATED DRAFT</div>',
  },
};

const previewTabs = [...document.querySelectorAll(".preview-tab")];
const previewPanel = document.querySelector("#preview-screen");
const previewState = document.querySelector("#preview-state");
const previewContent = document.querySelector("#preview-content");
const previewTitle = document.querySelector("#preview-title");
const previewDescription = document.querySelector("#preview-description");

function selectPreview(key) {
  const screen = previewScreens[key];
  if (!screen) return;
  previewTabs.forEach((tab) => {
    const selected = tab.dataset.screen === key;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const selectedTab = previewTabs.find((tab) => tab.dataset.screen === key);
  previewPanel?.setAttribute("aria-labelledby", selectedTab?.id ?? "");
  if (previewState) previewState.textContent = screen.state;
  if (previewTitle) previewTitle.textContent = screen.title;
  if (previewDescription) previewDescription.textContent = screen.description;
  if (previewContent) {
    previewContent.innerHTML = `
      <p class="mock-eyebrow">${screen.eyebrow}</p>
      <h3>${screen.heading}</h3>
      <p class="mock-copy">${screen.copy}</p>
      <div class="mock-button">${screen.button}<span>→</span></div>
      ${screen.after}
    `;
  }
}

previewTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectPreview(tab.dataset.screen));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? previewTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + previewTabs.length) % previewTabs.length;
    const nextTab = previewTabs[nextIndex];
    selectPreview(nextTab.dataset.screen);
    nextTab.focus();
  });
});
