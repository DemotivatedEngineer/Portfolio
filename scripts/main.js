const impactCopy = {
  scale: {
    title: "Distributed GST invoicing microservice",
    text:
      "Architected and built a service that processes 400K+ invoices each month, using dynamic locking and retry mechanisms to preserve sequential invoice generation per seller under high concurrency."
  },
  ai: {
    title: "Agent orchestration platform",
    text:
      "Built a multi-agent orchestrator that communicates with 8-10 specialized agents, unifies agent I/O contracts for easier frontend handling, and powers asynchronous seller intelligence workflows for ads, listings, sales, and storefront data."
  },
  ux: {
    title: "Server-side rendering migration",
    text:
      "Led a Next.js SSR migration to improve seller-facing page performance, delivering a 75% reduction in LCP and a 70% reduction in FCP for a faster user experience."
  },
  platform: {
    title: "Config-driven support agent platform",
    text:
      "Built a reusable RAG support agent platform where teams plug in MCP tools and knowledge bases to launch tenant-ready agents. The platform is currently used by 15+ tenants and reduces repeated agent setup work."
  }
};

const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const impactDetail = document.querySelector("#impactDetail");
const impactButtons = document.querySelectorAll(".impact-card");
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const copyButtons = document.querySelectorAll("[data-copy]");
const toast = document.querySelector("#toast");

function setImpact(key) {
  const item = impactCopy[key];
  impactDetail.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
  impactButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.impact === key);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("portfolioTheme", body.classList.contains("dark") ? "dark" : "light");
});

impactButtons.forEach((button) => {
  button.addEventListener("click", () => setImpact(button.dataset.impact));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.kind.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast("Email copied");
    } catch {
      showToast(button.dataset.copy);
    }
  });
});

const savedTheme = localStorage.getItem("portfolioTheme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

setImpact("scale");

const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let points = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = Array.from({ length: Math.min(72, Math.floor(width / 18)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);
  const isDark = body.classList.contains("dark");
  ctx.fillStyle = isDark ? "rgba(87, 210, 189, 0.55)" : "rgba(11, 128, 111, 0.42)";
  ctx.strokeStyle = isDark ? "rgba(157, 180, 255, 0.14)" : "rgba(35, 62, 139, 0.12)";

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < 0 || point.x > width) point.vx *= -1;
    if (point.y < 0 || point.y > height) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.globalAlpha = 1 - distance / 120;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawNetwork);
}

resizeCanvas();
drawNetwork();
window.addEventListener("resize", resizeCanvas);
