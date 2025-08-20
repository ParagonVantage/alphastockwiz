
(function(){
  const drawer = document.querySelector('.drawer');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('openDrawer');
  const closeBtn = document.getElementById('closeDrawer');

  function openDrawer(){
    drawer.classList.add('open');
    overlay.classList.add('active');
    openBtn.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    openBtn.setAttribute('aria-expanded','false');
  }
  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ closeDrawer(); }
  });

  // Onboard form handling
  const form = document.getElementById('onboardForm');
  const status = document.getElementById('formStatus');
  function bytesToMB(b){ return (b/ (1024*1024)).toFixed(2); }
  form?.addEventListener('submit', (e)=>{
  const status = document.getElementById('formStatus');
  const kyc = document.getElementById('kycFile').files[0];
  const aad = document.getElementById('aadhaarFile').files[0];
  const MAX = 5 * 1024 * 1024; // 5 MB

  // Validate sizes; if too big, stop submission
  if (kyc && kyc.size > MAX) {
    e.preventDefault();
    status.textContent = 'KYC file exceeds the 5 MB limit.';
    status.style.color = '#ef4444';
    return;
  }
  if (aad && aad.size > MAX) {
    e.preventDefault();
    status.textContent = 'Aadhaar file exceeds the 5 MB limit.';
    status.style.color = '#ef4444';
    return;
  }

  // Let the form submit normally to Formspree
  status.textContent = 'Submitting...';
  status.style.color = '#6b7280';
});
})();
// --- Financial Chatbot: STEVE ---
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
  await new Promise(r => setTimeout(r, 800)); // fake delay
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
