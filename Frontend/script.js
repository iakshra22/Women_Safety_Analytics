const alerts = [];
const detectionsCount = { gesture:0, violence:0, lone:0, other:0 };

function addAlert(type, lat, lng, desc){
  const ts = new Date();
  alerts.unshift({ type, lat, lng, desc, ts });
  updateUI();
  addMapMarker(type, lat, lng, desc, ts);
}

function updateUI(){
  document.getElementById('activeAlerts').textContent = alerts.length;
  document.getElementById('lastAlert').textContent = alerts[0] ? 
    alerts[0].type + ' @ ' + alerts[0].ts.toLocaleTimeString() : '—';
  
  const list = document.getElementById('alertsList');
  list.innerHTML = '';
  alerts.forEach(a => {
    const el = document.createElement('div');
    el.className = 'alert';
    el.innerHTML = `<strong>${a.type.toUpperCase()}</strong>
                    <div class='meta'>${a.ts.toLocaleString()} · ${a.desc}</div>`;
    list.appendChild(el);
  });
}

// 🌍 Map (Leaflet)
const map = L.map('map').setView([28.7041, 77.1025], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);
const markers = L.layerGroup().addTo(map);

function addMapMarker(type, lat, lng, desc, ts){
  const m = L.circleMarker([lat, lng], { radius:8, fillOpacity:0.8, color:'#e83e8c' }).addTo(markers);
  m.bindPopup(`<strong>${type}</strong><br>${desc}<br><small>${ts.toLocaleString()}</small>`);
}

// 📊 Chart.js
const ctx = document.getElementById('doughnut').getContext('2d');
const chart = new Chart(ctx, {
  type: 'doughnut',
  data: { labels: ['Gesture', 'Violence', 'Lone', 'Other'],
    datasets: [{ data: [0,0,0,0],
      backgroundColor: ['#ff8ab8','#ff5a7a','#6c5ce7','#7bd389'] }]
  },
  options: { responsive:true }
});

function simulateEvent(){
  const types = ['gesture','violence','lone','other'];
  const t = types[Math.floor(Math.random()*types.length)];
  const lat = 28.6 + Math.random()*0.2;
  const lng = 77.0 + Math.random()*0.3;
  const desc = (t==='gesture') ? 'SOS gesture detected' :
               (t==='violence') ? 'Aggressive movement detected' :
               (t==='lone') ? 'Single female detected' : 'Unusual activity';
  addAlert(t, lat, lng, desc);
}

// 🎛️ Button Actions
document.getElementById('simulateBtn').addEventListener('click', simulateEvent);
document.getElementById('clearAlerts').addEventListener('click', () => { alerts.length = 0; markers.clearLayers(); updateUI(); });
document.getElementById('notifyPolice').addEventListener('click', () => alert('Police notified (simulation)'));
document.getElementById('notifyGuardian').addEventListener('click', () => alert('Guardian notified (simulation)'));
document.getElementById('markFalse').addEventListener('click', () => alert('Marked as false positive'));

// 🧠 Initial Demo Alerts
addAlert('lone', 28.7041, 77.1025, 'Demo: lone woman detected');
addAlert('gesture', 28.67, 77.22, 'Demo: SOS gesture recognized');
