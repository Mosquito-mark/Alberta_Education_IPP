import jsPDF from "jspdf";
import { toast } from "sonner";

export const generateIPP_PDF = (student: any, logs: any[], goals: any[], fullEvaluations: any[], assessments: any[] = []) => {
  // Check compliance: Must have at least one Access or Expression accommodation
  const hasUDL = logs.some((log: any) => log.UDL_Purpose === "Access" || log.UDL_Purpose === "Expression" || log.UDL_Purpose === "Access & Expression");
  
  if (!hasUDL && logs.length > 0) {
    toast.error("Export Blocked", { description: "Zero 'Access' or 'Expression' accommodations selected. Please front-load the environment first." });
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header & Confidentiality
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Individualized Program Plan (IPP)", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text("CONFIDENTIAL DOCUMENT: For use by the Educational Support Team only.", pageWidth / 2, 26, { align: "center" });
  doc.setTextColor(0);
  
  // Student Info Block
  doc.setDrawColor(200);
  doc.line(20, 32, 190, 32);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT INFORMATION", 20, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Left Column
  doc.text(`Name: ${student.First_Name} ${student.Last_Initial}.`, 20, 50);
  doc.text(`Student ID: ${student.Student_ID}`, 20, 56);
  doc.text(`Date of Birth: ${student.Date_of_Birth || "N/A"}`, 20, 62);
  doc.text(`Eligibility Code: ${student.Eligibility_Code || "N/A"}`, 20, 68);
  doc.text(`Parents: ${student.Parents_Names || "N/A"}`, 20, 74);
  
  // Right Column
  doc.text(`Grade Level: ${student.Grade_Level}`, 110, 50);
  doc.text(`Status: ${student.Transition_Plan_Status}`, 110, 56);
  doc.text(`School/Program: ${student.School_Program || "Edmonton Public Schools"}`, 110, 62);
  doc.text(`IPP Created: ${student.Date_IPP_Created || "N/A"}`, 110, 68);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 110, 74);

  let y = 85;

  // Educational Team
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("EDUCATIONAL SUPPORT TEAM", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Teacher: ${student.Teacher_Name || "N/A"}`, 20, y);
  doc.text(`Coordinator: ${student.IPP_Coordinator || "N/A"}`, 110, y);
  y += 6;
  doc.text(`Administrator: ${student.Program_Administrator || "N/A"}`, 20, y);
  y += 10;

  // Specialized Assessments
  if (assessments.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("SPECIALIZED ASSESSMENTS", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    assessments.forEach((a) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`${a.Test_Name} (${a.Date})`, 25, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(a.Results, 160);
      doc.text(lines, 30, y);
      y += (lines.length * 5) + 4;
    });
    y += 6;
  }

  // Medical Conditions
  if (student.Medical_Conditions) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("MEDICAL CONDITIONS", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(student.Medical_Conditions, 170);
    doc.text(lines, 20, y);
    y += (lines.length * 5) + 10;
  }

  // Master Accommodation List (Cumulative)
  const uniqueAccommodations = Array.from(new Set(logs.filter((l: any) => l.Recommended_Assistive_Tech).map((l: any) => `${l.Recommended_Assistive_Tech} (${l.UDL_Purpose})`)));
  
  if (uniqueAccommodations.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("RECOMMENDED ACCOMMODATIONS & UDL SUPPORTS", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    uniqueAccommodations.forEach((acc) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${acc}`, 25, y);
      y += 6;
    });
    y += 10;
  }

  // Goals Section
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MEASURABLE GOALS (SMART)", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (goals.length === 0) {
    doc.text("No measurable goals defined yet.", 20, y);
    y += 8;
  } else {
    goals.forEach((goal: any, index: number) => {
      if (y > 260) { doc.addPage(); y = 20; }
      const goalText = `${index + 1}. [${goal.Core_Subject_Area || "General"}] ${goal.Goal_Description} (Target: ${goal.Target_Date}) - [${goal.Status}]`;
      const lines = doc.splitTextToSize(goalText, 170);
      doc.text(lines, 20, y);
      y += (lines.length * 6) + 2;
    });
  }
  y += 10;

  // Transition Plan
  if (student.Transition_Plan_Details) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TRANSITION PLANNING", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(student.Transition_Plan_Details, 170);
    doc.text(lines, 20, y);
    y += (lines.length * 5) + 10;
  }

  // Curriculum Alignment
  if (fullEvaluations.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ALBERTA CURRICULUM ALIGNMENT SUMMARY", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    fullEvaluations.forEach((ev) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const text = `${ev.Subject} (${ev.Grade}) - ${ev.Outcome_Code}: ${ev.Description} - [${ev.Status}]`;
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, 20, y);
      y += (lines.length * 5) + 2;
    });
    y += 10;
  }

  // Strengths & Observations
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("STRENGTHS-BASED OBSERVATIONS & EVIDENCE", 20, y);
  y += 8;
  doc.setFontSize(10);
  logs.forEach((log: any, index: number) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.text(`Observation ${index + 1} - ${new Date(log.Timestamp).toLocaleDateString()}`, 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(log.AI_Scrubbed_Observation || log.Raw_Dictation, 170);
    doc.text(textLines, 20, y);
    y += (textLines.length * 6) + 4;
  });

  // Signatures
  if (y > 220) { doc.addPage(); y = 20; }
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SIGNATURES & APPROVAL", 20, y);
  y += 15;
  doc.line(20, y, 80, y);
  doc.line(110, y, 170, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("Lead Teacher / Case Manager", 20, y);
  doc.text("Parent / Guardian", 110, y);
  
  y += 15;
  doc.line(20, y, 80, y);
  doc.line(110, y, 170, y);
  y += 5;
  doc.text("School Administrator", 20, y);
  doc.text("Date", 110, y);

  doc.save(`IPP_Detailed_${student.First_Name}_${student.Last_Initial}.pdf`);
  toast.success("Success", { description: "Detailed IPP Report generated successfully." });
};
