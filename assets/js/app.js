
function mapsLink(lat,lng){return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
function routeLink(stops){return 'https://www.google.com/maps/dir/'+stops.map(s=>encodeURIComponent(s[1]+','+s[2])).join('/')}
function pillClass(t){return t==='required'?'required':t==='driver'?'driver':t==='included'?'included':'none'}
function initMap(id,stops,all=false){
  const el=document.getElementById(id);
  if(!el || typeof L==='undefined'){
    if(el) el.innerHTML='<div class="map-error">המפה לא נטענה. רעננו את העמוד או פתחו את מסלול Google Maps.</div>';
    return;
  }
  const valid=(stops||[]).filter(s=>Array.isArray(s)&&Number.isFinite(Number(s[1]))&&Number.isFinite(Number(s[2])));
  if(!valid.length){el.innerHTML='<div class="map-error">אין נקודות מפה זמינות ליום זה.</div>';return;}
  const map=L.map(id,{scrollWheelZoom:false,zoomControl:true,preferCanvas:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);
  const coords=valid.map(s=>[Number(s[1]),Number(s[2])]);
  coords.forEach((c,i)=>{
    const icon=L.divIcon({className:'leaflet-div-icon',html:`<div class="numbered-marker">${i+1}</div>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-18]});
    const marker=L.marker(c,{icon}).addTo(map);
    marker.bindPopup(`<b>${i+1}. ${valid[i][0]}</b><br>${valid[i][3]||''}`);
  });
  if(coords.length>1){L.polyline(coords,{color:'#ee7b30',weight:5,opacity:.9}).addTo(map);}
  if(coords.length===1) map.setView(coords[0],12);
  else map.fitBounds(L.latLngBounds(coords),{padding:[35,35],maxZoom:13});
  setTimeout(()=>map.invalidateSize(true),100);
  window.addEventListener('resize',()=>map.invalidateSize(false));
  return map;
}
