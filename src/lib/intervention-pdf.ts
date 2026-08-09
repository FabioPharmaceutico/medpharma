"use client";
import { jsPDF } from "jspdf";
import { PRM_LABELS, ACCEPTANCE_LABELS, STATUS_LABELS } from "@/lib/labels";

export type InterventionPdfData = {
  id: string;
  patientRef: string;
  drugLabel: string;
  prmType: string;
  description: string;
  recommendation: string;
  doctorAcceptance: string;
  status: string;
  author?: string | null;
  createdAt: string | Date;
  notes?: { text: string; author?: string | null; createdAt: string | Date }[];
};

export function generateInterventionPdf(d: InterventionPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const M = 18;
  const W = doc.internal.pageSize.getWidth();
  let y = M;

  const line = (yy: number) => { doc.setDrawColor(200); doc.line(M, yy, W - M, yy); };
  const wrap = (label: string, value: string, opts?: { bold?: boolean }) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text(label, M, y);
    y += 5;
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal"); doc.setFontSize(10);
    const lines = doc.splitTextToSize(value || "-", W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 5 + 3;
  };

  // Header
  doc.setFillColor(9, 105, 165);
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(15);
  doc.text("Relatório de Intervenção Farmacêutica", M, 13);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text("Acompanhamento Farmacoterapêutico — Documento para anexo ao prontuário", M, 20);
  doc.setTextColor(20);
  y = 36;

  const dt = new Date(d.createdAt);
  doc.setFontSize(9); doc.setTextColor(90);
  doc.text(`Emitido em ${new Date().toLocaleString("pt-BR")}`, W - M, 33, { align: "right" });
  doc.setTextColor(20);

  wrap("Identificação do paciente (ID anônimo / LGPD)", d.patientRef);
  wrap("Data do registro", dt.toLocaleString("pt-BR"));
  line(y); y += 5;

  wrap("Medicamento envolvido", d.drugLabel);
  wrap("Tipo de PRM (Problema Relacionado a Medicamento)", PRM_LABELS[d.prmType] ?? d.prmType);
  wrap("Descrição do problema", d.description);
  wrap("Intervenção realizada", d.recommendation, { bold: true });
  line(y); y += 5;

  wrap("Aceitabilidade da intervenção", ACCEPTANCE_LABELS[d.doctorAcceptance] ?? d.doctorAcceptance);
  wrap("Status do problema", STATUS_LABELS[d.status] ?? d.status);
  if (d.author) wrap("Farmacêutico responsável", d.author);

  if (d.notes && d.notes.length) {
    line(y); y += 5;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("Evolução / notas clínicas", M, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    for (const n of d.notes) {
      const meta = `${new Date(n.createdAt).toLocaleString("pt-BR")}${n.author ? " — " + n.author : ""}`;
      doc.setTextColor(120); doc.text(meta, M, y); y += 4; doc.setTextColor(20);
      const lines = doc.splitTextToSize(n.text, W - M * 2);
      doc.text(lines, M, y); y += lines.length * 4 + 3;
    }
  }

  // Footer / signature
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(150); doc.line(M, H - 28, M + 70, H - 28);
  doc.setFontSize(8); doc.setTextColor(90);
  doc.text("Assinatura / CRF do farmacêutico", M, H - 24);
  doc.setFontSize(7);
  const disc = doc.splitTextToSize(
    "Documento gerado por sistema de apoio à decisão. Não substitui o julgamento clínico. Conteúdo sujeito à validação do farmacêutico responsável.",
    W - M * 2
  );
  doc.text(disc, M, H - 16);
  doc.setTextColor(20);

  doc.save(`intervencao-${d.patientRef}-${dt.toISOString().slice(0, 10)}.pdf`);
}
