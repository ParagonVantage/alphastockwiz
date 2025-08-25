const file=e.target.files?.[0]; if(!file) return;
const text=await file.text();
const rows=parseCSV(text);
if(!rows.length){ alert('Empty or invalid CSV.'); return; }
headers=rows.shift(); parsedRows=rows;
// populate selects
els.colDate.innerHTML = headers.map((h,i)=>`<option value="${i}">${h||('Column '+(i+1))}</option>`).join('');
els.colClose.innerHTML = els.colDate.innerHTML;
const m=autoMap(headers); els.colDate.value=m.dateIdx; els.colClose.value=m.closeIdx;

els.run.addEventListener('click', ()=>{
if(!parsedRows){ alert('Please choose a CSV file first.'); return; }
const iDate=Number(els.colDate.value), iClose=Number(els.colClose.value);
const data=toSeries(parsedRows, iDate, iClose);
if(data.length<250){ alert('Need at least ~250 rows for 50/200 SMA.'); return; }
const shortP=Math.max(2, Math.floor(Number(els.smaS.value)));
const longP=Math.max(shortP+1, Math.floor(Number(els.smaL.value)));
const capital=Number(els.capital.value)||100000;
const commission=Number(els.commission.value)||0;
const slippage=Number(els.slippage.value)||0;
const res=backtest(data, shortP, longP, capital, commission, slippage);
const m=res.metrics;
const rowsHTML = [
['Total Return', fmtPct(m.totalRet), 'Final ÷ initial − 1'],
['CAGR', fmtPct(m.CAGR), '≈252 trading days/year'],
['Max Drawdown', fmtPct(m.maxDD), 'Peak‑to‑trough'],
['# Trades', res.metrics.roundTrips, 'Round‑trips'],
['Win Rate', fmtPct(m.winRate), 'Profitable trades']
].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('');
els.metrics.innerHTML=rowsHTML;
drawChart(els.chart, res.equity);
// stash latest results for export
window.__SP_LAST__ = {signals:res.signals, trades:res.trades};
});


function toCSV(arr, headers){
const esc=v=>(''+(v??'')).replace(/"/g,'""');
const lines=[headers.join(',')];
for(const row of arr){ lines.push(headers.map(h=>`"${esc(row[h])}"`).join(',')); }
return lines.join('\n');
}


els.exportSig.addEventListener('click',()=>{
const last=window.__SP_LAST__?.signals; if(!last){ alert('Run a backtest first.'); return; }
const rows=last.map(s=>({date:s.date.toISOString().slice(0,10), type:s.type, price:s.price}));
const csv=toCSV(rows, ['date','type','price']);
const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
const a=document.createElement('a'); a.href=url; a.download='signals.csv'; a.click(); URL.revokeObjectURL(url);
});


els.exportTr.addEventListener('click',()=>{
const last=window.__SP_LAST__?.trades; if(!last){ alert('Run a backtest first.'); return; }
const rows=last.map(t=>({
entryDate: t.entryDate?.toISOString().slice(0,10), entryPrice:t.entryPrice,
exitDate: t.exitDate?.toISOString().slice(0,10), exitPrice:t.exitPrice,
qty:t.qty, pnl:t.pnl
}));
const csv=toCSV(rows, ['entryDate','entryPrice','exitDate','exitPrice','qty','pnl']);
const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
const a=document.createElement('a'); a.href=url; a.download='trades.csv'; a.click(); URL.revokeObjectURL(url);
});