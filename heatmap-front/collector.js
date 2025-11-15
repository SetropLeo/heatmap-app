// ----------- Globals ----------- //

let eventBatchQueue = [];
let lastMove = 0;
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

// ----------- Event Handlers ----------- //

const onMouseMove = (e) => {
  const now = performance.now();
  if (now - lastMove > 50) {
    lastMove = now;
    eventBatchQueue.push({
      ...defaultEventData,
      type: "move",
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
    });
  }
};

const onMouseScroll = (e) => {
  eventBatchQueue.push({
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

  eventBatchQueue.push({
    ...defaultEventData,
    type: "click",
    x: e.clientX,
    y: e.clientY,
    t: Date.now(),
    target: targetLabelRaw,
  });
};

function setupEventListeners() {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("scroll", onMouseScroll);
  document.addEventListener("click", onClick);
}

// ----------- Data Sending ----------- //

const identifyUser = () => {
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

  console.log("Identifying user:", identity);
  navigator.sendBeacon(usersEndpoint, JSON.stringify(identity));
};

const sendEventBatch = () => {
  if (eventBatchQueue.length === 0) return;

  navigator.sendBeacon(eventsEndpoint, JSON.stringify(eventBatchQueue));

  eventBatchQueue = [];
};

// ----------- Initialization ----------- //
identifyUser();
setupEventListeners();
setInterval(sendEventBatch, 1500);
