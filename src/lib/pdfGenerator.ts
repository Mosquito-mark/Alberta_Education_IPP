import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const generateIPP_PDF = (student: any, logs: any[], goals: any[], fullEvaluations: any[], assessments: any[] = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // --- PAGE 1: Child Information & Background ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Individualized Program Plan", pageWidth / 2, 25, { align: "center" });
  
  y = 35;
  
  // Section: Child Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Child Information", margin, y);
  y += 6;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const drawRow = (label1: string, val1: string, label2: string, val2: string, currentY: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(label1, margin, currentY);
    const label1Width = doc.getTextWidth(label1);
    doc.setFont("helvetica", "normal");
    const val1X = margin + label1Width + 2;
    const val1MaxW = (pageWidth / 2) - val1X - 5;
    const val1Lines = doc.splitTextToSize(val1 || "", val1MaxW);
    doc.text(val1Lines, val1X, currentY);
    
    doc.setFont("helvetica", "bold");
    doc.text(label2, pageWidth / 2, currentY);
    const label2Width = doc.getTextWidth(label2);
    doc.setFont("helvetica", "normal");
    const val2X = pageWidth / 2 + label2Width + 2;
    const val2MaxW = pageWidth - margin - val2X;
    const val2Lines = doc.splitTextToSize(val2 || "", val2MaxW);
    doc.text(val2Lines, val2X, currentY);

    const maxLines = Math.max(val1Lines.length, val2Lines.length);
    return currentY + (maxLines * 5) + 1;
  };

  y = drawRow("Child:", `${student.First_Name || ""} ${student.Last_Initial || ""}.`, "Age as of Sept. 1/0X:", student.Age_Sept_1 || "", y);
  y = drawRow("Date of Birth:", student.Date_of_Birth || "", "Date I.P.P. Created:", student.Date_IPP_Created || "", y);
  y = drawRow("Parents:", student.Parents_Names || "", "Phone #:", student.Phone_Number || "", y);
  y = drawRow("Address:", student.Address || "", "Eligibility Code:", student.Eligibility_Code || "", y);
  
  doc.setFont("helvetica", "bold");
  doc.text("Year of E.C.S.:", margin, y);
  const ecsLabelWidth = doc.getTextWidth("Year of E.C.S.:");
  doc.setFont("helvetica", "normal");
  const ecsX = margin + ecsLabelWidth + 2;
  const ecsLines = doc.splitTextToSize(student.Grade_Level || "", pageWidth - margin - ecsX);
  doc.text(ecsLines, ecsX, y);
  y += (ecsLines.length * 5) + 7;

  // Section: Background information: Programming context
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Background information: Programming context", margin, y);
  y += 6;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const drawSingleRow = (label: string, val: string, currentY: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, currentY);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    const valX = margin + labelWidth + 2;
    const valMaxW = pageWidth - margin - valX;
    const valLines = doc.splitTextToSize(val || "", valMaxW);
    doc.text(valLines, valX, currentY);
    return currentY + (valLines.length * 5) + 1;
  };

  const addSection = (title: string, content: string) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 25;
    }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content || "None provided.", pageWidth - margin * 2);
    
    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 25;
      }
      doc.text(lines[i], margin, y);
      y += 5;
    }
    y += 8; // Add some padding after the section
  };

  y = drawSingleRow("School/Program:", `${student.School_Name || ""} / ${student.School_Program || ""}`, y);
  y = drawSingleRow("Teacher delivering programming:", student.Teacher_Name || "", y);
  y = drawSingleRow("I.P.P. Coordinator (Certificated Teacher):", student.IPP_Coordinator || "", y);
  y = drawSingleRow("Program Administrator:", student.Program_Administrator || "", y);
  y = drawSingleRow("Additional IPP Team Members:", student.Additional_Team_Members || "", y);
  y += 6;

  y = drawSingleRow("Number of hours of centre-based programming:", student.Centre_Based_Hours || "", y);
  y = drawSingleRow("Number of sessions of family-oriented ECS programming:", student.Family_Oriented_Sessions || "", y);
  y += 6;

  addSection("Background Information: Parental input and involvement", student.Parental_Input);

  // --- PAGE 2: Strengths, Needs, Medical, Assessments ---
  doc.addPage();
  y = 25;

  addSection("Strengths", student.Strengths_Summary);
  addSection("Areas of Need", student.Areas_of_Need_Summary);
  addSection("Medical Conditions that Impact Schooling", student.Medical_Conditions);

  if (y > pageHeight - 50) {
    doc.addPage();
    y = 25;
  }
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Assessment Data (Specialized Assessment Results)", margin, y);
  y += 6;

  const assessmentData = assessments.map(a => [a.Date, a.Test_Name, a.Results]);
  if (assessmentData.length === 0) {
    assessmentData.push(["", "", "No specialized assessments recorded."]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Test', 'Results']],
    body: assessmentData,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // --- PAGE 3: Performance, Support, Accommodations ---
  doc.addPage();
  y = 25;

  let performanceText = student.Current_Performance_Narrative || fullEvaluations.map(ev => `${ev.Subject} (${ev.Grade}) - ${ev.Outcome_Code}: ${ev.Description} - [${ev.Status}]`).join("\n");
  if (!performanceText) performanceText = "No curriculum evaluations recorded.";
  addSection("Current Level of Performance and Achievement", performanceText);

  let supportText = student.Support_Services_Summary || "No coordinated support services recorded.";
  addSection("Coordinated Support Services", supportText);

  const uniqueAccommodations = Array.from(new Set(logs.filter((l: any) => l.Recommended_Assistive_Tech).map((l: any) => `${l.Recommended_Assistive_Tech} (${l.UDL_Purpose})`)));
  let accommodationsText = uniqueAccommodations.length > 0 ? uniqueAccommodations.map(a => `• ${a}`).join("\n") : "No instructional accommodations recorded.";
  addSection("Instructional Accommodations and Strategies", accommodationsText);

  // --- PAGE 4: Goals ---
  doc.addPage();
  y = 25;

  if (goals.length === 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Goal #1", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Long-term Goal: No goals defined.", margin, y);
    y += 10;
  } else {
    goals.forEach((goal: any, index: number) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 25;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Goal #${index + 1}`, margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const goalLines = doc.splitTextToSize(`Long-term Goal: ${goal.Goal_Description}`, pageWidth - margin * 2);
      for (let i = 0; i < goalLines.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 25;
        }
        doc.text(goalLines[i], margin, y);
        y += 5;
      }
      y += 4;

      const goalData = [
        ["1. " + (goal.Objective_1_Description || ""), goal.Objective_1_Assessment_Procedure || "", goal.Objective_1_Progress_Review || ""],
        ["2. " + (goal.Objective_2_Description || ""), goal.Objective_2_Assessment_Procedure || "", goal.Objective_2_Progress_Review || ""],
        ["3. " + (goal.Objective_3_Description || ""), goal.Objective_3_Assessment_Procedure || "", goal.Objective_3_Progress_Review || ""]
      ];

      autoTable(doc, {
        startY: y,
        head: [['Short-term Objectives', 'Assessment Procedures', 'Progress Review']],
        body: goalData,
        theme: 'grid',
        headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 3 },
        margin: { left: margin, right: margin }
      });
      y = (doc as any).lastAutoTable.finalY + 5;

      if (y > pageHeight - 20) {
        doc.addPage();
        y = 25;
      }
      doc.setFont("helvetica", "bold");
      doc.text("Accommodations and strategies to support this goal", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const accLines = doc.splitTextToSize(goal.Goal_Accommodations_Strategies || (goal.Core_Subject_Area ? `Subject Area: ${goal.Core_Subject_Area}` : "None specified."), pageWidth - margin * 2);
      for (let i = 0; i < accLines.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 25;
        }
        doc.text(accLines[i], margin, y);
        y += 5;
      }
      y += 5;
    });
  }

  // --- PAGE 5: Transition, Summary, Signatures ---
  doc.addPage();
  y = 25;

  addSection("Planning for Transition", student.Transition_Plan_Details);
  addSection("Year-end Summary", student.Year_End_Summary);

  if (y > pageHeight - 80) {
    doc.addPage();
    y = 25;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Signatures", margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("I understand and agree with the information contained in this Individualized Program Plan.", margin, y);
  y += 20;

  const drawSignatureLine = (title: string, currentY: number) => {
    doc.line(margin, currentY, margin + 80, currentY);
    doc.line(pageWidth - margin - 40, currentY, pageWidth - margin, currentY);
    doc.text(title, margin, currentY + 5);
    doc.text("Date", pageWidth - margin - 40, currentY + 5);
  };

  drawSignatureLine("Parents", y);
  y += 20;
  drawSignatureLine("IPP Coordinator (Certificated Teacher)", y);
  y += 20;
  drawSignatureLine("Teacher (if different from IPP Coordinator)", y);
  y += 20;
  drawSignatureLine("Program Administrator", y);

  // --- Date Generation ---
  const date = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yyyy = date.getFullYear();
  const mmm = monthNames[date.getMonth()];
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}_${mmm}_${dd}`;
  const headerDateStr = `${yyyy}-${mmm}-${dd}`;

  // --- Add Footers to all pages ---
  const totalPagesCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPagesCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("©Pathway Pilot 2026", margin, pageHeight - 10);
    if (i > 1) {
      doc.text(`Pathway Pilot - IPP - Student ${student.First_Name || ""} -${student.Last_Initial || ""}-${headerDateStr} page ${i}/${totalPagesCount}`, margin, 15);
    }
  }

  // --- Filename Generation ---
  
  const safeStr = (str: string) => (str || "Unknown").replace(/[\s/\\:*?"<>|]+/g, '_');
  
  const filename = `IPP_${safeStr(student.First_Name)}_${safeStr(student.Last_Initial)}_${safeStr(student.Student_ID)}_${safeStr(student.Grade_Level)}_${dateStr}-${safeStr(student.School_Name)}_${safeStr(student.Teacher_Name)}.pdf`;

  doc.save(filename);
  toast.success("Success", { description: "Detailed IPP Report generated successfully." });
};
