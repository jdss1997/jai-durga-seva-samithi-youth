```javascript
// JDSS Youth — script.js
// Data
const mainLeaders = [
  'MANIKYAM SRINIVAS','ATLA RAMESH','ATLA MAHESH','ALDI GANESH','ALDI PRASHANTH','KAITHA RAMESH'
];
const subLeaders = ['KASARAPU PRANAY','PANNATI MOURYA','KASARAPU VINAY','GAJULA SHIVA','GAJULA AMAR','GAJULA RAM CHARAN'];

function renderLeaders(){
  const main = document.getElementById('main-leaders');
  mainLeaders.forEach(n=>{
    const el = document.createElement('div'); el.className='leader-card';
    el.innerHTML = `<h3>${n}</h3><div class="role">Main Leader</div>`;
    main.appendChild(el);
  });
  const sub = document.getElementById('sub-leaders');
  subLeaders.forEach(n=>{
    const el = document.createElement('div'); el.className='leader-card';
    el.innerHTML = `<h3>${n}</h3><div class="role">Sub Leader</div>`;
    sub.appendChild(el);
  });
}
renderLeaders();

// Profile handling (localStorage)
const profileKey = 'jdss_profiles_v1';
function loadProfiles(){
  const raw = localStorage.getItem(profileKey);
  return raw ? JSON.parse(raw) : {1:null,2:null};
}
function saveProfiles(data){ localStorage.setItem(profileKey, JSON.stringify(data)); renderSavedProfiles(); }

function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader(); r.onload = ()=>res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });
}

async function saveProfile(slot){
  const name = document.getElementById('name'+slot).value.trim();
  const role = document.getElementById('role'+slot).value.trim();
  const fileInput = document.getElementById('file'+slot);
  let imgData = null;
  if(fileInput.files && fileInput.files[0]){
    imgData = await readFileAsDataURL(fileInput.files[0]);
  } else {
    const avatar = document.getElementById('avatar'+slot).src;
    if(avatar) imgData = avatar;
  }
  const profiles = loadProfiles();
  profiles[slot] = {name: name || ('Profile '+slot), role: role || '', img: imgData};
  saveProfiles(profiles);
  alert('Profile '+slot+' saved locally.');
}

function clearProfile(slot){
  const profiles = loadProfiles(); profiles[slot]=null; saveProfiles(profiles);
  const avatar = document.getElementById('avatar'+slot);
  if(avatar){ avatar.style.display='none'; avatar.src=''; }
  document.getElementById('name'+slot).value=''; document.getElementById('role'+slot).value='';
}

function renderSavedProfiles(){
  const container = document.getElementById('saved-profiles'); container.innerHTML='';
  const profiles = loadProfiles();
  for(const k of ['1','2']){
    const p = profiles[k];
    const card = document.createElement('div'); card.className='profile-card';
    if(p){
      card.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${p.img || ''}" style="width:80px;height:80px;border-radius:10px;object-fit:cover" onerror="this.style.display='none'">
          <div>
            <strong>${p.name}</strong>
            <div class="small muted">${p.role}</div>
        </div>`;
    } else {
            <div style="margin-top:8px"><button class="btn ghost" onclick="editProfile(${k})">Edit</button></div>
          </div>
      card.innerHTML = `<div class="small muted">No profile saved in slot ${k}. Use the form to upload one.</div>`;
    }
    container.appendChild(card);
  }
}

function editProfile(k){
  const p = loadProfiles()[k];
  if(!p) return alert('No profile in slot '+k);
  document.getElementById('name'+k).value = p.name;
  document.getElementById('role'+k).value = p.role;
  const avatar = document.getElementById('avatar'+k);
  avatar.src = p.img || '';
  avatar.style.display = p.img ? 'block' : 'none';
  window.scrollTo({top:document.getElementById('profiles').offsetTop, behavior:'smooth'});
}

function showPreviews(){
  const f1 = document.getElementById('file1');
  f1.addEventListener('change', async ()=>{ if(f1.files && f1.files[0]){ document.getElementById('avatar1').src = await readFileAsDataURL(f1.files[0]); document.getElementById('avatar1').style.display='block'; } });
  const f2 = document.getElementById('file2');
  f2.addEventListener('change', async ()=>{ if(f2.files && f2.files[0]){ document.getElementById('avatar2').src = await readFileAsDataURL(f2.files[0]); document.getElementById('avatar2').style.display='block'; } });
}

function downloadData(){
  const data = loadProfiles();
  const blob = new Blob([JSON.stringify(data, null, 2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='jdss_profiles.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function scrollTo(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

// Initialize
(function(){
  showPreviews();
  const p = loadProfiles();
  for(const k of ['1','2']){
    if(p[k]){
      const avatar = document.getElementById('avatar'+k); avatar.src = p[k].img || ''; avatar.style.display = p[k].img ? 'block' : 'none';
      document.getElementById('name'+k).value = p[k].name || '';
      document.getElementById('role'+k).value = p[k].role || '';
    }
  }
  renderSavedProfiles();
})();
```

---
