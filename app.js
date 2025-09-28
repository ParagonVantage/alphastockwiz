document.addEventListener('DOMContentLoaded', () => {
  const drawer   = document.querySelector('.drawer');
  const overlay  = document.getElementById('overlay');
  const openBtn  = document.getElementById('openDrawer');
  const closeBtn = document.getElementById('closeDrawer');

  function openDrawer(){
    if(!drawer) return;
    drawer.classList.add('open');
    overlay && overlay.classList.add('active');
    openBtn && openBtn.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    if(!drawer) return;
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('active');
    openBtn && openBtn.setAttribute('aria-expanded','false');
  }

  if(!drawer)  console.error('Drawer (.drawer) not found');
  if(!openBtn) console.error('Open button (#openDrawer) not found');
  if(!closeBtn)console.error('Close button (#closeDrawer) not found');

  openBtn  && openBtn.addEventListener('click', openDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  overlay  && overlay.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeDrawer(); } });
});


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

    status.textContent = 'Uploading (if enabled) and submitting...';
    status.style.color = '#6b7280';

    // Optional uploads
    const [kycUrl, aadUrl] = await Promise.all([
      kyc ? uploadFile(kyc) : Promise.resolve(null),
      aad ? uploadFile(aad) : Promise.resolve(null)
    ]);

    // Collect fields
    const payload = {
      legalName: form.legalName.value.trim(),
      age: form.age.value.trim(),
      gender: form.gender.value,
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      address: form.address.value.trim(),
      consent: form.consent.checked ? 'Yes' : 'No',

      // Files (metadata only)
      kyc_filename: kyc ? kyc.name : '—',
      kyc_url: kycUrl || 'Not uploaded via site (check secure vault/server).',
      aadhaar_filename: aad ? aad.name : '—',
      aadhaar_url: aadUrl || 'Not uploaded via site (check secure vault/server).'
    };

    // Send via EmailJS
    try {
      const serviceId = 'service_67lgyft';
      const templateId = 'template_j3i03ye';

      if (!window.emailjs) throw new Error('EmailJS not loaded');

      await emailjs.send(serviceId, templateId, payload);

      status.textContent = '✅ Form submitted successfully! We\'ll contact you soon.';
      status.style.color = '#10b981';
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      status.textContent = '❌ Submission failed. Please try again or email us directly.';
      status.style.color = '#ef4444';
    }
  });

// --- Financial Chatbot: STEVE (unchanged, kept at page bottom) ---
(function(){
  const steveBtn = document.createElement('button');
  steveBtn.id = 'steveToggle';
  steveBtn.className = 'steve-toggle';
  steveBtn.textContent = 'Chat with STEVE';
  document.body.appendChild(steveBtn);

  const steveWindow = document.createElement('div');
  steveWindow.id = 'steveWindow';
  steveWindow.className = 'steve-window';
  steveWindow.innerHTML = `
    <div class="steve-header">STEVE</div>
    <div id="steveMessages" class="steve-messages" aria-live="polite"></div>
    <form id="steveForm" class="steve-form">
      <input id="steveInput" type="text" placeholder="Ask about markets..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(steveWindow);

  steveBtn.addEventListener('click', () => {
    steveWindow.classList.toggle('open');
  });

  const messages = steveWindow.querySelector('#steveMessages');
  function addMessage(text, from){
    const el = document.createElement('div');
    el.className = 'msg ' + from;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  addMessage("Hi, I'm STEVE. Ask me anything about finance!", 'bot');

  const formEl = steveWindow.querySelector('#steveForm');
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = steveWindow.querySelector('#steveInput');
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';

    const placeholder = document.createElement('div');
    placeholder.className = 'msg bot';
    placeholder.textContent = '...';
    messages.appendChild(placeholder);
    messages.scrollTop = messages.scrollHeight;

    // Mock reply (for testing)
    await new Promise(r => setTimeout(r, 800));
    placeholder.textContent = "This is STEVE’s test reply. (API not connected)";
  });
})();
