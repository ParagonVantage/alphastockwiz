// /assets/js/tools.js
const $ = (sel, root = document) => root.querySelector(sel);

const number = v => {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const s = (''+v).trim().replace(/,/g,'');
  return s.endsWith('%') ? parseFloat(s)/100 : parseFloat(s);
};

/* -------- Position Sizing -------- */
(() => {
  const run = () => {
    const capital = number($('#ps-capital')?.value);
    const riskPct = number($('#ps-risk')?.value);
    const entry   = number($('#ps-entry')?.value);
    const stop    = number($('#ps-stop')?.value);
    const lot     = Math.max(0, Math.floor(number($('#ps-lot')?.value)));

    if (!capital || !riskPct || !entry || !stop || stop >= entry) {
      $('#ps-out').innerHTML = `<tr><td data-label="Qty">—</td><td data-label="Max Loss">—</td><td data-label="R:R at Target">Check inputs</td></tr>`;
      return;
    }
    const perShareRisk = entry - stop;
    const riskBudget   = capital * (riskPct/100);
    let qty = Math.floor(riskBudget / perShareRisk);
    if (lot > 0) qty = Math.floor(qty / lot) * lot;
    const maxLoss = qty * perShareRisk;

    $('#ps-out').innerHTML = `
      <tr>
        <td data-label="Qty">${qty.toLocaleString('en-IN')}</td>
        <td data-label="Max Loss">₹ ${maxLoss.toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
        <td data-label="R:R at Target">
          <input type="number" id="ps-target" step="0.01" placeholder="Target price (₹)" class="input mt-1" />
          <div id="ps-rr" class="muted mt-1">—</div>
        </td>
      </tr>
    `;

    const targetInput = $('#ps-target');
    const updateRR = () => {
      const target = number(targetInput.value);
      if (!target || target <= entry) { $('#ps-rr').textContent = '—'; return; }
      const rewardPerShare = target - entry;
      const rr = rewardPerShare / perShareRisk;
      $('#ps-rr').textContent = `R:R ≈ ${rr.toFixed(2)} (Reward ₹ ${(rewardPerShare*qty).toFixed(2)})`;
    };
    targetInput?.addEventListener('input', updateRR);
  };
  $('#ps-run')?.addEventListener('click', run);
})();

/* -------- SIP / Step-Up -------- */
(() => {
  const run = () => {
    const m = number($('#sip-amount')?.value);
    const r = number($('#sip-rate')?.value) / 100; // annual
    const y = Math.max(1, Math.floor(number($('#sip-years')?.value)));
    const step = number($('#sip-step')?.value) / 100;

    if (!m || r < 0 || !y) { $('#sip-out').textContent = 'Check inputs'; return; }

    // monthly compounding
    const i = r / 12;
    let balance = 0;
    let monthly = m;

    for (let year = 1; year <= y; year++) {
      for (let k = 0; k < 12; k++) {
        balance = balance * (1 + i) + monthly;
      }
      monthly = monthly * (1 + step); // step-up at year-end
    }

    const invested = m * 12 * y * (step ? ( (1 - Math.pow(1+step, y)) / (1 - (1+step)) )/y : 1 ); // rough invested estimate
    $('#sip-out').innerHTML = `
      <div class="card mt-1">
        <div class="small">Final Corpus (approx)</div>
        <div class="h3">₹ ${balance.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
        <div class="muted small mt-1">Total Invested ≈ ₹ ${invested.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
      </div>`;
  };
  $('#sip-run')?.addEventListener('click', run);
})();

/* -------- Charges (Indicative) -------- */
(() => {
  const run = () => {
    const t     = number($('#chg-turnover')?.value);
    const stt   = number($('#chg-stt')?.value) / 100;
    const stamp = number($('#chg-stamp')?.value) / 100;
    const gst   = number($('#chg-gst')?.value) / 100;

    if (!t) { $('#chg-out').textContent = 'Enter turnover'; return; }

    // Brokerage: accept absolute (₹) or %
    const brokerRaw = $('#chg-broker')?.value?.trim();
    let brokerage = 0;
    if (brokerRaw) {
      if (/%$/.test(brokerRaw)) brokerage = t * (number(brokerRaw)/100);
      else brokerage = number(brokerRaw);
    }

    const sttAmt   = t * stt;
    const stampAmt = t * stamp;
    const exchTxn  = t * 0.0000325; // small placeholder you can adjust
    const sebi     = t * 0.000001;  // placeholder
    const subTotal = brokerage + sttAmt + stampAmt + exchTxn + sebi;
    const gstAmt   = (brokerage + exchTxn + sebi) * gst; // GST typically on charges, not on STT/stamp
    const total    = subTotal + gstAmt;

    $('#chg-out').innerHTML = `
      <div class="table-wrap mt-1">
        <table class="table">
          <tbody>
            <tr><td data-label="Brokerage">Brokerage</td><td>₹ ${brokerage.toFixed(2)}</td></tr>
            <tr><td data-label="STT">STT</td><td>₹ ${sttAmt.toFixed(2)}</td></tr>
            <tr><td data-label="Stamp Duty">Stamp Duty</td><td>₹ ${stampAmt.toFixed(2)}</td></tr>
            <tr><td data-label="Exchange Txn">Exchange Txn</td><td>₹ ${exchTxn.toFixed(2)}</td></tr>
            <tr><td data-label="SEBI">SEBI</td><td>₹ ${sebi.toFixed(2)}</td></tr>
            <tr><td data-label="GST">GST on charges</td><td>₹ ${gstAmt.toFixed(2)}</td></tr>
            <tr><th>Total Estimated Charges</th><th>₹ ${total.toFixed(2)}</th></tr>
          </tbody>
        </table>
      </div>`;
  };
  $('#chg-run')?.addEventListener('click', run);
})();

/* -------- Holidays (static JSON → render) -------- */
(async () => {
  try {
    const res = await fetch('/data/holidays.json'); // create once a year by hand
    if (!res.ok) throw 0;
    const items = await res.json();
    const rows = items.map(x => `
      <div class="card mt-1">
        <div class="cluster">
          <strong>${x.date}</strong><span class="badge">${x.market || 'Equities'}</span>
        </div>
        <div class="muted small mt-1">${x.reason}</div>
      </div>`).join('');
    $('#hol-out').innerHTML = rows || '<div class="muted">No holidays loaded yet.</div>';
  } catch {
    $('#hol-out').innerHTML = '<div class="muted">Add <code>/data/holidays.json</code> to show holidays.</div>';
  }
})();
