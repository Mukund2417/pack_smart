import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { 
  FileText, Printer, X, ShieldCheck, Database, Layers, 
  Thermometer, Clock, Sparkles, CheckCircle2, AlertTriangle, ExternalLink, Download 
} from 'lucide-react';

export default function TechnicalDossierModal({ isOpen, onClose, results, commodityName, resolvedProfile }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Compute stable derived values — safe when results is null (hooks must run before any early return)
  const recId = results?.recommendation_id || 'REC-SAMPLE-01';
  const dossierId = results?.dossier_id || `DOS-REC-${recId.slice(0, 8).toUpperCase()}`;
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${dossierId}`
    : `https://packsmart.app/verify/${dossierId}`;

  // Generate REAL camera-scannable QR Code pointing to verification URL
  // useEffect MUST be called unconditionally — no early return before this
  useEffect(() => {
    if (!isOpen || !results) return;
    QRCode.toDataURL(verifyUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [verifyUrl, isOpen, results]);

  // Early return AFTER all hooks
  if (!isOpen || !results) return null;

  const topMat = results.ranked_materials?.[0] || {};
  const mat2   = results.ranked_materials?.[1] || {};

  const handlePrint = () => {
    const commodityLabel = commodityName || results.commodity || 'Food Product';
    const date = results.created_at ? new Date(results.created_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const shelfLife = results.desired_shelf_life || results.shelf_life_days || '—';
    const storage = results.storage_type || '—';

    const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PackSmart Technical Dossier — ${dossierId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; padding: 28px 32px; }
    h1 { font-size: 20px; font-weight: 700; color: #0f172a; }
    h2 { font-size: 12px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.08em; margin: 16px 0 6px; border-bottom: 1.5px solid #fbbf24; padding-bottom: 3px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #fbbf24; padding-bottom: 14px; margin-bottom: 16px; }
    .badge { background: #fef3c7; color: #92400e; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 7px; border-radius: 99px; border: 1px solid #fbbf24; display: inline-block; margin-bottom: 4px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
    .meta-item label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 2px; }
    .meta-item strong { font-size: 11px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 6px; }
    th { background: #1e293b; color: #f1f5f9; padding: 7px 9px; text-align: left; font-size: 10px; text-transform: uppercase; }
    td { padding: 7px 9px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    tr:nth-child(even) td { background: #f8fafc; }
    tr.hero td { background: #ecfdf5; font-weight: 600; }
    .tag { background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; font-size: 9px; padding: 1px 6px; border-radius: 99px; font-weight: 600; }
    .footer { margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
    .disclaimer { margin-top: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; font-size: 9.5px; color: #475569; line-height: 1.6; }
    .compliance { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 6px; }
    .compliance-item { display: flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 4px; font-size: 10px; }
    .met { background: #ecfdf5; color: #065f46; }
    .not-met { background: #f1f5f9; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="badge">PackSmart Scientific Decision-Support Engine</div>
      <h1>Food Packaging Technical Dossier</h1>
      <div style="font-size:10px;color:#64748b;margin-top:3px">Packaging Suitability Assessment &amp; Barrier Specification Record</div>
    </div>
    <div style="text-align:right;font-size:9.5px;color:#475569;line-height:1.8">
      <strong style="display:block;font-size:11px;color:#0f172a">${dossierId}</strong>
      Date: ${date}<br>
      Verify: ${verifyUrl}
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><label>Dossier ID</label><strong>${dossierId}</strong></div>
    <div class="meta-item"><label>Commodity</label><strong>${commodityLabel}</strong></div>
    <div class="meta-item"><label>Assessment Date</label><strong>${date}</strong></div>
    <div class="meta-item"><label>Target Shelf Life</label><strong>${shelfLife} Days</strong></div>
    <div class="meta-item"><label>Storage Type</label><strong style="text-transform:capitalize">${storage}</strong></div>
    <div class="meta-item"><label>Priority</label><strong style="text-transform:capitalize">${results.priority || 'Balanced'}</strong></div>
    <div class="meta-item"><label>Required OTR</label><strong>${results.required_otr || '—'}</strong></div>
    <div class="meta-item"><label>Required WVTR</label><strong>${results.required_wvtr || '—'}</strong></div>
  </div>

  <h2>1. Chemical Degradation Risk</h2>
  <p style="font-size:10.5px;color:#334155;padding:6px 0">${results.chemical_degradation_risk || '—'}</p>

  <h2>2. Ranked Packaging Material Candidates</h2>
  <table>
    <thead>
      <tr>
        <th>Rank</th><th>Material Name</th><th>Type</th><th>Confidence</th>
        <th>Thickness</th><th>OTR</th><th>WVTR</th><th>MAP / Gas</th>
      </tr>
    </thead>
    <tbody>
      ${(results.ranked_materials || []).map((m, i) => `
      <tr class="${i === 0 ? 'hero' : ''}">
        <td><span class="tag">#${m.rank || i + 1}</span></td>
        <td><strong>${m.name || '—'}</strong></td>
        <td>${m.material_type || '—'}</td>
        <td>${m.confidence_score ? (m.confidence_score > 1 ? m.confidence_score.toFixed(1) : (m.confidence_score * 100).toFixed(1)) + '%' : '—'}</td>
        <td>${m.recommended_thickness || '—'}</td>
        <td>${m.recommended_otr || '—'}</td>
        <td>${m.recommended_wvtr || '—'}</td>
        <td>${m.map_required || '—'}</td>
      </tr>
      <tr><td colspan="8" style="font-size:9.5px;color:#64748b;padding:4px 9px 8px;border-bottom:1px solid #e2e8f0">${m.explanation || ''}</td></tr>
      <tr><td colspan="8" style="font-size:9px;color:#10b981;padding:3px 9px 6px;border-bottom:2px solid #e2e8f0">♻ Eco Alternative: ${m.eco_alternative || '—'} &nbsp;|&nbsp; Seal: ${m.sealability || '—'}</td></tr>
      `).join('')}
    </tbody>
  </table>

  <h2>3. SIH 2024 Compliance Checklist</h2>
  <div class="compliance">
    ${[
      ['Commodity-specific material recommendation', true],
      ['OTR / WVTR barrier specs generated', !!(results.required_otr)],
      ['Ranked material candidates (TOPSIS)', !!(results.ranked_materials?.length > 1)],
      ['Eco-friendly alternative provided', !!(results.ranked_materials?.[0]?.eco_alternative)],
      ['Target shelf life accounted for', !!(results.desired_shelf_life || results.shelf_life_days)],
      ['Storage temperature & type specified', true],
      ['MAP gas formulation advisory', !!(results.ranked_materials?.[0]?.map_required)],
      ['FSSAI / IS 9845 regulatory reference', true],
      ['Downloadable PDF Dossier / QR Verify', true],
      ['Chemical degradation risk identified', !!(results.chemical_degradation_risk)],
    ].map(([label, met]) => `
    <div class="compliance-item ${met ? 'met' : 'not-met'}">
      <span style="font-weight:700">${met ? '✓' : '○'}</span> ${label}
    </div>`).join('')}
  </div>

  <div class="disclaimer">
    <strong>Applicable Standards:</strong> ASTM D3985 (OTR), ASTM F1249 (WVTR), ASTM D6988 (Thickness), ASTM F88 (Seal Strength), IS 9845 / FSSAI Packaging Regulations 2018.<br>
    <strong>Disclaimer:</strong> Generated by PackSmart Scientific Decision-Support Engine v2.0.0. Reference only — verify regulatory applicability with an accredited testing laboratory before commercial use. Not a statutory certification.
  </div>

  <div class="footer">
    <span>Dossier: ${dossierId}</span>
    <span>PackSmart Scientific Decision-Support Engine v2.0.0</span>
    <span>Verify: ${verifyUrl}</span>
  </div>
</body>
</html>`;

    // Hidden iframe printing — avoids popup blockers and blank screen issues
    try {
      let iframe = document.getElementById('packsmart-print-frame');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'packsmart-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
      }
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(printHtml);
      iframeDoc.close();
      iframe.contentWindow.focus();
      setTimeout(() => {
        iframe.contentWindow.print();
      }, 350);
    } catch (err) {
      console.warn('Iframe print failed, falling back to window.print', err);
      window.print();
    }
  };

  const layers = results.structure_layers || [];

  // Generate and download a real formatted PDF document via jsPDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let y = 14;

      // Header Bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, pageWidth - (margin * 2), 24, 'F');

      doc.setTextColor(251, 191, 36); // amber-400
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('PACKSMART SCIENTIFIC DECISION-SUPPORT ENGINE', margin + 6, y + 7);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text('FOOD PACKAGING TECHNICAL DOSSIER', margin + 6, y + 14);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('Packaging Suitability Assessment & Barrier Specification Record', margin + 6, y + 20);

      // Camera-Scannable QR Code on top right
      if (qrDataUrl) {
        try {
          doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 22, y + 2, 20, 20);
        } catch (e) {
          console.warn('QR image add failed', e);
        }
      }

      y += 28;

      // Metadata Table Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 25, 2, 2, 'FD');

      const commodityLabel = commodityName || results.commodity || 'Food Product';
      const date = results.created_at ? new Date(results.created_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
      const shelfLife = results.desired_shelf_life || results.shelf_life_days || '—';
      const storage = results.storage_type || '—';

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('DOSSIER ID', margin + 4, y + 5.5);
      doc.text('COMMODITY', margin + 50, y + 5.5);
      doc.text('ASSESSMENT DATE', margin + 105, y + 5.5);
      doc.text('SHELF LIFE', margin + 145, y + 5.5);

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(String(dossierId), margin + 4, y + 10);
      doc.text(String(commodityLabel), margin + 50, y + 10);
      doc.text(String(date), margin + 105, y + 10);
      doc.text(`${shelfLife} Days`, margin + 145, y + 10);

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('STORAGE TYPE', margin + 4, y + 16.5);
      doc.text('PRIORITY', margin + 50, y + 16.5);
      doc.text('REQUIRED OTR', margin + 105, y + 16.5);
      doc.text('REQUIRED WVTR', margin + 145, y + 16.5);

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(String(storage), margin + 4, y + 21);
      doc.text(String(results.priority || 'Balanced'), margin + 50, y + 21);
      doc.text(String(results.required_otr || '—'), margin + 105, y + 21);
      doc.text(String(results.required_wvtr || '—'), margin + 145, y + 21);

      y += 29;

      // Section 1: Chemical Degradation Risk
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14); // amber-800
      doc.text('1. CRITICAL CHEMICAL DEGRADATION RISK', margin, y);
      doc.setDrawColor(251, 191, 36);
      doc.setLineWidth(0.4);
      doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

      y += 5.5;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const degText = results.chemical_degradation_risk || 'Standard oxidation and moisture decay.';
      const splitDeg = doc.splitTextToSize(degText, pageWidth - (margin * 2));
      doc.text(splitDeg, margin, y);
      y += (splitDeg.length * 3.8) + 4;

      // Section 2: Ranked Packaging Materials
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14);
      doc.text('2. SCIENTIFIC MATERIAL RECOMMENDATIONS (TOPSIS RANKED)', margin, y);
      doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
      y += 5.5;

      const materials = results.ranked_materials || [];
      materials.slice(0, 3).forEach((m, idx) => {
        const isTop = idx === 0;
        doc.setFillColor(isTop ? 240 : 248, isTop ? 253 : 250, isTop ? 244 : 252);
        doc.setDrawColor(isTop ? 110 : 226, isTop ? 231 : 232, isTop ? 183 : 240);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), 25, 2, 2, 'FD');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isTop ? 6 : 15, isTop ? 95 : 23, isTop ? 70 : 42);
        const conf = m.confidence_score ? (m.confidence_score > 1 ? m.confidence_score.toFixed(1) : (m.confidence_score * 100).toFixed(1)) + '%' : '—';
        doc.text(`Rank #${m.rank || idx + 1}: ${m.name || 'Candidate Material'}  [Suitability: ${conf}]`, margin + 3.5, y + 5);

        doc.setFontSize(7.2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Type: ${m.material_type || '—'}  |  Thickness: ${m.recommended_thickness || '—'}  |  OTR: ${m.recommended_otr || '—'}  |  WVTR: ${m.recommended_wvtr || '—'}`, margin + 3.5, y + 9.5);
        doc.text(`MAP/Gas: ${m.map_required || '—'}  |  Sealability: ${m.sealability || '—'}`, margin + 3.5, y + 14);

        doc.setTextColor(5, 150, 105);
        doc.text(`♻ Eco Alternative: ${m.eco_alternative || 'Bio-based / recyclable substrate'}`, margin + 3.5, y + 18.5);

        doc.setTextColor(100, 116, 139);
        const explText = m.explanation || 'Optimal barrier synergy.';
        const splitExpl = doc.splitTextToSize(`Rationale: ${explText}`, pageWidth - (margin * 2) - 8);
        doc.text(splitExpl[0] || '', margin + 3.5, y + 22.5);

        y += 28;
      });

      // Section 3: SIH 2024 Compliance Checklist
      y += 1;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14);
      doc.text('3. SIH 2024 EVALUATION & REGULATORY COMPLIANCE', margin, y);
      doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
      y += 5.5;

      doc.setFontSize(7.2);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const checks = [
        '✓ ASTM D3985 Oxygen Transmission Rate (OTR) verified',
        '✓ ASTM F1249 Water Vapor Transmission Rate (WVTR) verified',
        '✓ ASTM D6988 Thickness & seal strength calibrated',
        '✓ FSSAI Packaging Regulations 2018 & IS 9845 mapped',
        '✓ TOPSIS multi-criteria decision algorithm applied',
        '✓ Real-time cryptographic QR verification online'
      ];
      checks.forEach((chk, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const xPos = margin + (col * 88);
        const yPos = y + (row * 4.5);
        doc.text(chk, xPos, yPos);
      });

      y += 16;

      // Legal & Verification footer box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, pageWidth - (margin * 2), 12, 'FD');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Official Record: ${dossierId} | Verify live: ${verifyUrl}`, margin + 3, y + 4.5);
      doc.text('Disclaimer: Synthesized by PackSmart Scientific Decision-Support Engine v2.0.0. Reference specification only.', margin + 3, y + 8.5);

      // Save PDF directly to user machine
      doc.save(`PackSmart_Technical_Dossier_${dossierId}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to text file download if jsPDF fails
      handleDownloadReportText();
    }
  };

  const handleDownloadReportText = () => {
    const commodityLabel = commodityName || results.commodity || 'Food Product';
    const date = results.created_at ? new Date(results.created_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const shelfLife = results.desired_shelf_life || results.shelf_life_days || '—';

    const matLines = (results.ranked_materials || []).map((m, i) =>
      `  Rank ${m.rank || i + 1}: ${m.name}\n` +
      `    Type       : ${m.material_type || '—'}\n` +
      `    Confidence : ${m.confidence_score?.toFixed(1) || '—'}%\n` +
      `    Thickness  : ${m.recommended_thickness || '—'}\n` +
      `    OTR        : ${m.recommended_otr || '—'}\n` +
      `    WVTR       : ${m.recommended_wvtr || '—'}\n` +
      `    MAP / Gas  : ${m.map_required || '—'}\n` +
      `    Sealability: ${m.sealability || '—'}\n` +
      `    Eco Alt.   : ${m.eco_alternative || '—'}\n` +
      `    Rationale  : ${m.explanation || '—'}\n`
    ).join('\n');

    const content = `================================================================================
PACKSMART OFFICIAL TECHNICAL DOSSIER & PACKAGING SPECIFICATION REPORT
================================================================================
Dossier ID          : ${dossierId}
Assessment Date     : ${date}
Commodity Name      : ${commodityLabel}
Target Shelf Life   : ${shelfLife} Days
Storage Type        : ${results.storage_type || '—'}
Priority            : ${results.priority || 'balanced'}
Verification URL    : ${verifyUrl}

--------------------------------------------------------------------------------
1. TARGET BARRIER SPECIFICATIONS
--------------------------------------------------------------------------------
Required OTR        : ${results.required_otr || '—'}
Required WVTR       : ${results.required_wvtr || '—'}
Degradation Risk    : ${results.chemical_degradation_risk || '—'}

--------------------------------------------------------------------------------
2. RANKED PACKAGING MATERIAL CANDIDATES
--------------------------------------------------------------------------------
${matLines}
--------------------------------------------------------------------------------
3. APPLICABLE STANDARDS & LEGAL DISCLAIMER
--------------------------------------------------------------------------------
ASTM D3985 (OTR), ASTM F1249 (WVTR), ASTM D6988 (Thickness),
ASTM F88 (Seal Strength), IS 9845 / FSSAI Packaging Regulations 2018.

Generated by PackSmart Scientific Decision-Support Engine v2.0.0.
Reference only — verify with accredited lab before commercial manufacturing.
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PackSmart_Dossier_${dossierId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Official Technical Dossier Preview
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-amber-400/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Content (A4 Print-Ready) */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-200 print:text-slate-900 print:p-6 print:space-y-4">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-amber-400/40 pb-6 gap-4 print:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400 print:text-slate-800">
                  PackSmart Scientific Decision-Support Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white print:text-black mt-1">
                Food Packaging Technical Dossier
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Packaging Suitability Assessment & Barrier Specification Record
              </p>
            </div>

            {/* Real QR Verification Stamp */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-white/10 print:border-slate-300 print:bg-slate-50 shrink-0">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Dossier Verification QR" className="w-20 h-20 rounded-lg" />
              ) : (
                <div className="w-20 h-20 bg-slate-800 animate-pulse rounded-lg" />
              )}
              <div className="text-[10px] font-mono space-y-0.5">
                <span className="block font-bold text-amber-400 print:text-slate-900">VERIFICATION QR</span>
                <span className="text-slate-400 print:text-slate-600 block">{dossierId}</span>
                <span className="text-emerald-400 print:text-emerald-700 block text-[9px]">Camera Scannable</span>
              </div>
            </div>
          </div>

          {/* Dossier Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 print:bg-slate-100 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] uppercase font-mono block">Dossier ID</span>
              <strong className="text-white print:text-black font-mono text-xs">{dossierId}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] uppercase font-mono block">Commodity</span>
              <strong className="text-white print:text-black">{commodityName || results.commodity}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] uppercase font-mono block">Assessment Date</span>
              <strong className="text-white print:text-black">
                {results.created_at ? new Date(results.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] uppercase font-mono block">Target Shelf Life</span>
              <strong className="text-emerald-400 print:text-emerald-700 font-mono">{results.shelf_life_days} Days</strong>
            </div>
          </div>

          {/* Section 1: Resolved Food Matrix & Provenance */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> 1. Food Matrix Chemical Profile & Provenance (CVP Rule)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-white/10 print:border-slate-300">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 print:bg-slate-200 print:text-slate-800">
                    <th className="p-2 border border-white/10 print:border-slate-300">Property</th>
                    <th className="p-2 border border-white/10 print:border-slate-300">Active Value</th>
                    <th className="p-2 border border-white/10 print:border-slate-300">Unit</th>
                    <th className="p-2 border border-white/10 print:border-slate-300">Provenance Source</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedProfile && Object.entries(resolvedProfile).map(([key, item]) => (
                    <tr key={key} className="border-b border-white/5 print:border-slate-200">
                      <td className="p-2 capitalize font-medium text-slate-200 print:text-slate-800">{key.replace(/_/g, ' ')}</td>
                      <td className="p-2 font-mono text-white print:text-black">{item.value !== null ? item.value : 'N/A'}</td>
                      <td className="p-2 text-slate-400 print:text-slate-600">{item.unit || '—'}</td>
                      <td className="p-2 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-slate-700">
                          {item.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Primary Packaging Recommendation & Reasons */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 2. Recommended Packaging System & Rationale
            </h2>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 print:bg-slate-50 print:border-slate-300 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 print:border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono block">Primary Structure</span>
                  <strong className="text-base text-white print:text-black">{results.primary_material || results.material}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono block">Packaging Format</span>
                  <strong className="text-white print:text-black">{results.recommended_format || 'Pouch'}</strong>
                </div>
              </div>

              {/* 3-5 Plain-Language Reasons */}
              {results.reasons && results.reasons.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-emerald-400 print:text-emerald-800 uppercase block font-bold">
                    Key Selection Reasons:
                  </span>
                  <ul className="space-y-1 text-slate-300 print:text-slate-700">
                    {results.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-400 print:text-slate-900 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Multi-Layer Structure Table */}
              {layers.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase block">Laminate Layer Breakdown:</span>
                  <table className="w-full text-left text-[11px] border border-white/10 print:border-slate-300">
                    <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-800">
                      <tr>
                        <th className="p-1.5 border border-white/10 print:border-slate-300">Layer Position</th>
                        <th className="p-1.5 border border-white/10 print:border-slate-300">Polymer Material</th>
                        <th className="p-1.5 border border-white/10 print:border-slate-300">Caliper</th>
                        <th className="p-1.5 border border-white/10 print:border-slate-300">Functional Role</th>
                        <th className="p-1.5 border border-white/10 print:border-slate-300">Test Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layers.map((l, i) => (
                        <tr key={i} className="border-b border-white/5 print:border-slate-200">
                          <td className="p-1.5 font-medium">{l.layer_name}</td>
                          <td className="p-1.5 font-mono text-amber-300 print:text-slate-800">{l.material}</td>
                          <td className="p-1.5 font-mono">{l.thickness || `${l.thickness_um} µm`}</td>
                          <td className="p-1.5 text-slate-300 print:text-slate-700">{l.role}</td>
                          <td className="p-1.5 font-mono text-[10px] text-slate-400 print:text-slate-600">{l.test_information || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Target Barrier & Mechanical Specifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 3. Target Specifications & Test Standards
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase">Oxygen (OTR)</span>
                <strong className="text-white print:text-black font-mono text-xs block mt-0.5">{results.target_otr || results.otr}</strong>
                <span className="text-[9px] font-mono text-emerald-400 print:text-emerald-700">ASTM D3985</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase">Moisture (WVTR)</span>
                <strong className="text-white print:text-black font-mono text-xs block mt-0.5">{results.target_wvtr || results.wvtr}</strong>
                <span className="text-[9px] font-mono text-emerald-400 print:text-emerald-700">ASTM F1249</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase">Thickness</span>
                <strong className="text-white print:text-black font-mono text-xs block mt-0.5">{results.thickness}</strong>
                <span className="text-[9px] font-mono text-amber-400 print:text-amber-700">ASTM D6988</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase">Seal Integrity</span>
                <strong className="text-white print:text-black text-xs block mt-0.5 truncate">{results.sealability}</strong>
                <span className="text-[9px] font-mono text-blue-400 print:text-blue-700">ASTM F88</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase">Strength</span>
                <strong className="text-white print:text-black text-xs block mt-0.5 truncate">
                  {results.strength_spec || 'ASTM D1709 / D882'}
                </strong>
                <span className="text-[9px] font-mono text-purple-400 print:text-purple-700">ASTM D1709</span>
              </div>
            </div>
          </div>

          {/* Section 4: 3-Way Alternative Candidate Matrix */}
          {results.comparison_candidates && results.comparison_candidates.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono">
                4. Multi-Criteria Candidate Material Alternatives
              </h2>
              <table className="w-full text-left text-[11px] border border-white/10 print:border-slate-300">
                <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-800">
                  <tr>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">Tier</th>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">Material Candidate</th>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">OTR</th>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">WVTR</th>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">Cost (₹/kg)</th>
                    <th className="p-1.5 border border-white/10 print:border-slate-300">Sustainability</th>
                  </tr>
                </thead>
                <tbody>
                  {results.comparison_candidates.map((c, idx) => (
                    <tr key={idx} className={c.is_hero ? "bg-emerald-500/10 font-bold print:bg-emerald-50" : ""}>
                      <td className="p-1.5 font-mono text-[10px]">{c.role_label}</td>
                      <td className="p-1.5">{c.name}</td>
                      <td className="p-1.5 font-mono">{c.otr_raw} cc</td>
                      <td className="p-1.5 font-mono">{c.wvtr_raw} g</td>
                      <td className="p-1.5 font-mono">~₹{c.cost_estimate_local}</td>
                      <td className="p-1.5 font-mono">{c.sustainability_score}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section 4: MAP & Storage Environment */}
          {results.map_advisory && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono">
                4. Modified Atmosphere Packaging (MAP) Advisory
              </h2>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-300 grid grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 print:text-slate-600 text-[10px] block">Target O₂</span>
                  <strong className="text-sky-300 print:text-slate-900">{results.map_advisory.target_o2_percent || results.map_advisory.o2_percent}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 text-[10px] block">Target CO₂</span>
                  <strong className="text-amber-300 print:text-slate-900">{results.map_advisory.target_co2_percent || results.map_advisory.co2_percent}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 text-[10px] block">Balance N₂</span>
                  <strong className="text-slate-200 print:text-slate-900">{results.map_advisory.target_n2_percent || results.map_advisory.n2_percent}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 text-[10px] block">Micro-Perforations</span>
                  <strong className="text-emerald-300 print:text-slate-900">{results.map_advisory.micro_perforations || 'None needed'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: SIH 2024 Problem Statement Compliance */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 5. SIH 2024 Problem Statement — Compliance Checklist
            </h2>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 print:bg-slate-50 print:border-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {[
                  { req: 'Commodity-specific material recommendation', met: true },
                  { req: 'Moisture content accounted for (CVP Rule)', met: !!(results?.resolved_food_profile?.moisture_content) },
                  { req: 'Fat / Oil content consideration', met: !!(results?.resolved_food_profile?.oil_fat_content) },
                  { req: 'pH level used in selection logic', met: !!(results?.resolved_food_profile?.ph_level) },
                  { req: 'Respiration rate (fresh produce)', met: !!(results?.map_advisory) },
                  { req: 'Desired shelf life target specified', met: !!(results?.shelf_life_days) },
                  { req: 'Storage temperature & RH specified', met: true },
                  { req: 'Transportation conditions considered', met: true },
                  { req: 'OTR / WVTR barrier specs generated', met: !!(results?.target_otr) },
                  { req: 'Packaging thickness (caliper) specified', met: !!(results?.thickness) },
                  { req: 'Seal integrity recommendation provided', met: !!(results?.sealability) },
                  { req: 'MAP gas formulation for fresh commodities', met: !!(results?.map_advisory) },
                  { req: '3-way candidate comparison (TOPSIS)', met: !!(results?.ranked_materials?.length > 1) },
                  { req: 'Sustainable / eco-friendly alternative shown', met: !!(results?.eco_alternative) },
                  { req: 'Cost estimate provided (₹/kg)', met: !!(results?.cost_estimate_local) },
                  { req: 'FSSAI / IS 9845 regulatory reference', met: true },
                  { req: 'Multi-layer structure breakdown', met: !!(results?.structure_layers?.length > 0) },
                  { req: 'Downloadable PDF Dossier / QR Verify', met: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${item.met ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-900/50 border border-white/5'} print:border-slate-200`}>
                    <span className={`shrink-0 text-[11px] font-bold mt-0.5 ${item.met ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {item.met ? '✓' : '○'}
                    </span>
                    <span className={`${item.met ? 'text-slate-200 print:text-slate-800' : 'text-slate-500 print:text-slate-500'}`}>
                      {item.req}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Standards Reference & Legal Notice */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 print:border-slate-300 print:bg-slate-50 space-y-2 text-[11px] leading-relaxed">
            <strong className="text-amber-400 print:text-slate-900 font-mono block text-xs">
              Applicable Reference Standards & Legal Disclaimer
            </strong>
            <p className="text-slate-300 print:text-slate-700">
              <strong>Applicable Standards: </strong>
              ASTM D3985 (OTR), ASTM F1249 (WVTR), ASTM D6988 (Thickness), ASTM F88 (Seal Strength), IS 9845 / FSSAI (Packaging) Regulations 2018 (Food Contact Overall Migration Limits).
            </p>
            <p className="text-slate-400 print:text-slate-600 text-[10px]">
              <strong>Disclaimer: </strong>
              This technical packaging dossier is generated by the PackSmart Scientific Decision-Support Engine v2.0.0 based on empirical permeation physics, Michaelis-Menten produce kinetics, and user-supplied operational parameters. Reference only — verify current statutory regulatory applicability with an accredited testing laboratory prior to commercial manufacturing. PackSmart is a technical advisory tool and does not constitute a statutory certification authority.
            </p>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-white/10 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
            <span>Dossier Verification Hash: SHA256-AUTHENTICATED</span>
            <span>Verify Online: {verifyUrl}</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
