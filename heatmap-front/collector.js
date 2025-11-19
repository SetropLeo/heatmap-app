// ----------- Globals ----------- //

let eventBatchQueue = [];
let lastMove = 0;
let userId = null;
const anonymousId = crypto.randomUUID();
const hostName = window.location.hostname;

const defaultEventData = {
  userId: anonymousId,
  origin: hostName,
};

// ----------- Config ----------- //

const domain = "http://localhost:3000";
const eventsEndpoint = `${domain}/heatmap/events`;
const usersEndpoint = `${domain}/heatmap/identify`;

// ----------- Event Storage ----------- //

function loadEvents() {
  try {
    return JSON.parse(sessionStorage.getItem("heatmap_events") || "[]");
  } catch {
    return [];
  }
}

function saveEvents(events) {
  sessionStorage.setItem("heatmap_events", JSON.stringify(events));
}

function appendEvent(event) {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
}

// ----------- Event Handlers ----------- //

const onMouseMove = (e) => {
  const now = performance.now();
  if (now - lastMove > 50) {
    lastMove = now;

    appendEvent({
      ...defaultEventData,
      type: "move",
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
    });
  }
};

const onMouseScroll = () => {
  appendEvent({
    ...defaultEventData,
    type: "scroll",
    scrollY: window.scrollY,
    t: Date.now(),
  });
};

const onClick = (e) => {
  const targetLabelRaw = (
    e.target.innerText ||
    e.target.value ||
    e.target.id ||
    e.target.name ||
    "Unknown"
  ).trim();

  appendEvent({
    ...defaultEventData,
    type: "click",
    x: e.clientX,
    y: e.clientY,
    t: Date.now(),
    target: targetLabelRaw,
  });
};

// ----------- Data ----------- //

const getUserIdentity = () => {
  const ua = navigator.userAgent;

  const identity = {
    origin: hostName,
    userId: anonymousId,
    user_device_type:
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera Mini/i.test(ua)
        ? "mobile"
        : /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI|Silk/i.test(ua)
        ? "tablet"
        : "desktop",
  };

  return identity;
};

// ----------- Handler to Download ----------- //

const initHandlerToDownload = () => {
  document.getElementById("download-heatmap-data").onclick = () => {
    // download the data as a JSON file
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({
          user: getUserIdentity(),
          events: loadEvents(),
        })
      );

    const element = document.createElement("a");
    element.setAttribute("href", dataStr);
    element.setAttribute("download", `heatmap_data_${anonymousId}.json`);
    document.body.appendChild(element);
    element.click();
    element.remove();
  };
};

// ----------- Initialization ----------- //

const setupEventListeners = () => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("scroll", onMouseScroll);
  document.addEventListener("click", onClick);
};

function init() {
  setupEventListeners();
  initHandlerToDownload();
}

init();
