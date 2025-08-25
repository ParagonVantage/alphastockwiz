const $ = (s, r=document) => r.querySelector(s);
const surchargePct = parseNum($('#cg-surcharge'))/100;
surcharge = isFinite(surchargePct) && surchargePct>0 ? basicTax * surchargePct : 0;
const applyCess = $('#cg-apply-cess').checked;
cess = applyCess ? (basicTax + surcharge) * 0.04 : 0;
const totalTax = Math.max(0, basicTax + surcharge + cess);


// Rule note / warnings
const post = sellD >= D_CHANGE;
let note = post ? 'Using post‑23 Jul 2024 rules.' : 'Sale is before 23 Jul 2024: legacy rules apply.';
if(asset==='other' && classif==='LTCG' && !post) note += ' This calculator does not compute indexation.';
$('#cg-rule-note').textContent = note;


// Render
const rows = [
['Full Value of Consideration', fmtINR(fullValue), 'Sell price × qty'],
['Cost of Acquisition', fmtINR(cost), 'Buy price × qty'],
['Expenses on Transfer', fmtINR(exp), 'Exclude STT'],
['Capital Gain', fmtINR(gain), 'Loss shows as negative'],
['Classification', classif, `${daysBetween(buyD, sellD)} days`],
['Taxable LTCG after Equity Exemption', asset==='equity'&&classif==='LTCG'? fmtINR(taxableGain): '—', asset==='equity'&&classif==='LTCG'? `Exemption applied: ${fmtINR(equityExemptionApplied)}`:'Only for equity LTCG'],
['Applicable Rate', r.label, ''],
['Basic Tax', rate!=null? fmtINR(basicTax): '—', ''],
['Surcharge', surcharge? fmtINR(surcharge): '—', 'Optional (enter %)'],
['Health & Edu Cess (4%)', cess? fmtINR(cess): '—', 'On tax + surcharge'],
['Total Tax Payable', fmtINR(totalTax), '']
];
$('#cg-out').innerHTML = rows.map(([a,b,c])=>`<tr><td>${a}</td><td data-label="Amount">${b}</td><td class="text-muted" data-label="Notes">${c||''}</td></tr>`).join('');



// Wire buttons and dynamic hints
$('#cg-run')?.addEventListener('click', run);
$('#cg-reset')?.addEventListener('click', ()=>{ $('#cg-form').reset(); $('#cg-out').innerHTML=''; $('#cg-rule-note').textContent=''; });


function toggleSlabField(){
const isOther = $('#cg-asset').value==='other';
$('#cg-slab').parentElement.style.display = isOther ? '' : 'none';
}
function toggleExemptionField(){
const asset = $('#cg-asset').value; const buyD = new Date($('#cg-buy-date').value); const sellD = new Date($('#cg-sell-date').value);
const show = asset==='equity';
$('#cg-exemption-used').parentElement.style.display = show ? '' : 'none';
if(show && sellD.toString()!=='Invalid Date'){
const lim = exemptionEquityLTCG(sellD);
$('#cg-exemption-used').parentElement.querySelector('label .note');
}
}


['change','input'].forEach(evt=>{
$('#cg-asset').addEventListener(evt, ()=>{ toggleSlabField(); });
$('#cg-sell-date').addEventListener(evt, ()=>{ toggleExemptionField(); });
});


toggleSlabField();