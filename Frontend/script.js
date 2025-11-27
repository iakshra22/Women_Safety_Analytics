const alerts = [];
const detectionsCount = { gesture:0, violence:0, lone:0, other:0 };
const statsCount = { total:0, men:0, women:0, sos:0 };

function updateUI(){

  document.getElementById("activeAlerts").textContent = alerts.length;
  document.getElementById("lastAlert").textContent =
    alerts[0] ? ${alerts[0].type} @ ${alerts[0].ts.toLocaleTimeString()} : "—";

 const list = document.getElementById("alertsList");
  list.innerHTML = "";

  alerts.forEach(a => {
    const el = document.createElement("div");
    el.className = alert-item;
    el.innerHTML = `
      <strong>${a.type.toUpperCase()}</strong>
      <div class="meta">${a.ts.toLocaleString()} · ${a.desc}</div>`;
    list.appendChild(el);
  });

  const recent = document.getElementById("recentDetections");
  recent.innerHTML = "";
  alerts.slice(0,6).forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${a.type}</strong> — ${a.desc}
      <div class="meta">${a.ts.toLocaleTimeString()}</div>`;
    recent.appendChild(li);
  });

  chart.data.datasets[0].data = [
    detectionsCount.gesture,
    detectionsCount.violence,
    detectionsCount.lone,
    detectionsCount.other
  ];
  chart.update();

  document.getElementById("hotspotScore").textContent =
    Math.min(100, Object.values(detectionsCount).reduce((s,v)=>s+v*3,0));

  document.getElementById("totalPeople").textContent = statsCount.total;
  document.getElementById("menCount").textContent = statsCount.men;
  document.getElementById("womenCount").textContent = statsCount.women;
  document.getElementById("sosCount").textContent = statsCount.sos;
}


const map = L.map("map",{scrollWheelZoom:false}).setView([28.7041,77.1025],12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(map);
const markers = L.layerGroup().addTo(map);

function addMapMarker(type, lat, lng, desc, ts){
  const colors = {
    gesture: "#ff8ab8",
    violence: "#ff5a7a",
    lone: "#6c5ce7",
    other: "#7bd389"
  };

  const m = L.circleMarker([lat,lng], {
    radius:9, fillOpacity:0.85,
    color:colors[type], fillColor:colors[type]
  }).addTo(markers);

  m.bindPopup(`
    <strong>${type}</strong><br>
    ${desc}<br>
    <small>${ts.toLocaleString()}</small>
  `);
}


const ctx = document.getElementById("doughnut").getContext("2d");
const chart = new Chart(ctx,{
  type:"doughnut",
  data:{
    labels:["Gesture","Violence","Lone","Other"],
    datasets:[{
      data:[0,0,0,0],
      backgroundColor:["#ff8ab8","#ff5a7a","#6c5ce7","#7bd389"]
    }]
  },
  options:{
    responsive:true,
    animation:{duration:800},
    plugins:{legend:{position:"bottom"}}
  }
});


function addAlert(type, lat, lng, desc){
  const ts = new Date();

  alerts.unshift({type, lat, lng, desc, ts});
  detectionsCount[type]++;

  statsCount.total++;
  if(type === "lone") statsCount.women++;
  else statsCount.men++;
  if(type === "gesture") statsCount.sos++;

  updateUI();
  addMapMarker(type, lat, lng, desc, ts);
}


function simulateEvent(){
  const types = ["gesture","violence","lone","other"];
  const t = types[Math.floor(Math.random() * types.length)];

  const lat = 28.6 + Math.random() * 0.2;
  const lng = 77.0 + Math.random() * 0.3;
  const desc =
    t==="gesture" ? "SOS Gesture Detected" :
    t==="violence" ? "Aggression Detected" :
    t==="lone" ? "Single Woman Detected" :
                 "Unusual Activity";

  addAlert(t, lat, lng, desc);
}


document.getElementById("exportLogs").addEventListener("click", ()=>{
  const rows = alerts.map(a =>
    ${a.type},${a.desc},${a.lat},${a.lng},${a.ts.toISOString()}
  ).join("\n");

  const blob = new Blob([type,desc,lat,lng,timestamp\n${rows}],{
    type:"text/csv"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "alerts.csv";
  a.click();

  URL.revokeObjectURL(url);
});


document.getElementById("simulateBtn").addEventListener("click", simulateEvent);

document.getElementById("clearAlerts").addEventListener("click", ()=>{
  alerts.length = 0;
  markers.clearLayers();
  Object.keys(detectionsCount).forEach(k => detectionsCount[k] = 0);
  Object.keys(statsCount).forEach(k => statsCount[k] = 0);
  updateUI();
});

document.getElementById("notifyPolice").addEventListener("click", ()=>alert("Police Notified"));
document.getElementById("notifyGuardian").addEventListener("click", ()=>alert("Guardian Notified"));
document.getElementById("markFalse").addEventListener("click", ()=>alert("Marked as False Positive"));


let aiOn = false;

document.getElementById("toggleAI").addEventListener("click",()=>{
  aiOn = !aiOn;

  document.getElementById("aiStatus").textContent = aiOn ? "Running" : "Idle";
  document.getElementById("aiStatusText").textContent = aiOn ? "Running" : "Idle";
  document.getElementById("aiDot").style.background = aiOn ? "#2ef28a" : "#6c5ce7";
  document.getElementById("toggleAI").textContent = aiOn ? "Stop AI" : "Start AI";
});


addAlert("lone",28.7041,77.1025,"Demo: Single Woman Detected");
addAlert("gesture",28.67,77.22,"Demo: SOS Gesture Recognized");

updateUI();
