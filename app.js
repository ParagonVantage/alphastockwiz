
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
