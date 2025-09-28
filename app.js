(function(){
// --- Drawer logic ---
const drawer = document.querySelector('.drawer');
const overlay = document.getElementById('overlay');
const openBtn = document.getElementById('openDrawer');
const closeBtn = document.getElementById('closeDrawer');


function openDrawer(){
if(!drawer) return;
drawer.classList.add('open');
overlay?.classList.add('active');
openBtn?.setAttribute('aria-expanded','true');
}
function closeDrawer(){
if(!drawer) return;
drawer.classList.remove('open');
overlay?.classList.remove('active');
openBtn?.setAttribute('aria-expanded','false');
}
openBtn?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeDrawer(); } });


// --- EmailJS init ---
// Replace with your EmailJS Public Key
if (window.emailjs) {
emailjs.init('bw7RtSGd3UFH43cJq');
} else {
console.warn('EmailJS SDK not found. Ensure the <script> tag is in onboard.html');
}


// --- Upload helper (optional) ---
// Set window.UPLOAD_ENDPOINT = 'https://your-backend.example.com/upload' in a separate config if available.
async function uploadFile(file) {
try {
if (!window.UPLOAD_ENDPOINT) return null; // no-op if backend not provided
const fd = new FormData();
fd.append('file', file);
const res = await fetch(window.UPLOAD_ENDPOINT, { method: 'POST', body: fd });
if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
const data = await res.json();
return data.url || null; // Expected: { url: 'https://...' }
} catch (err) {
console.error('Upload error:', err);
return null;
}
}


const form = document.getElementById('onboardForm');
const status = document.getElementById('formStatus');
function bytesToMB(b){ return (b/ (1024*1024)).toFixed(2); }


form?.addEventListener('submit', async (e)=>{
e.preventDefault();
if(!form) return;


const kyc = document.getElementById('kycFile')?.files?.[0] || null;
const aad = document.getElementById('aadhaarFile')?.files?.[0] || null;
const MAX = 5 * 1024 * 1024; // 5 MB


// Validate sizes; if too big, stop submission
if (kyc && kyc.size > MAX) {
status.textContent = `KYC file exceeds the 5 MB limit (got ${bytesToMB(kyc.size)} MB)`;
status.style.color = '#ef4444';
return;
}
if (aad && aad.size > MAX) {
status.textContent = `Aadhaar file exceeds the 5 MB limit (got ${bytesToMB(aad.size)} MB)`;
status.style.color = '#ef4444';
return;
}


placeholder.textContent = "This is STEVE’s test reply. (API not connected)";
    // const API_KEY = window.OPENAI_API_KEY;
    // if(!API_KEY){
    //   placeholder.textContent = 'Set OPENAI_API_KEY to chat with STEVE.';
    //   return;
    // }

    // --- inside your submit handler, replace the try/catch with this ---
// try {
//   const res = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${API_KEY}`,
//     },
//     body: JSON.stringify({
//       // gpt-3.5-turbo is sunset; use a current model:
//       model: 'gpt-4o-mini',
//       messages: [
//         { role: 'system', content: 'You are STEVE, a concise financial chatbot.' },
//         { role: 'user', content: text }
//       ]
//       // optional:
//       // temperature: 0.4,
//       // max_tokens: 500,
//     })
//   });

//   const data = await res.json();
//   console.log('STEVE raw response:', data); // <- open DevTools Console to see this

//   if (!res.ok) {
//     const msg = data?.error?.message || `HTTP ${res.status} ${res.statusText}`;
//     placeholder.textContent = `API error: ${msg}`;
//     return;
//   }

//   const reply = data.choices?.[0]?.message?.content?.trim();
//   placeholder.textContent = reply || 'Hmm, no content returned.';
// } catch (err) {
//   console.error(err);
//   placeholder.textContent = 'Network error contacting STEVE.';
// }

  });
