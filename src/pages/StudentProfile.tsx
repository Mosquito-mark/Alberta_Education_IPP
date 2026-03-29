import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { generateIPP_PDF } from "@/lib/pdfGenerator";

// Modular Components
import { ProfileDetails } from "@/components/student/ProfileDetails";
import { IPPContextManager } from "@/components/student/IPPContextManager";
import { GoalManager } from "@/components/student/GoalManager";
import { CurriculumAssessment } from "@/components/student/CurriculumAssessment";
import { VerticalAlignmentAssessment } from "@/components/student/VerticalAlignmentAssessment";
import { CurriculumSummary } from "@/components/student/CurriculumSummary";
import { ObservationHistory } from "@/components/student/ObservationHistory";
import { Student, Observation, Goal, CurriculumOutcome, Evaluation, VerticalAlignmentOutcome } from "@/types";

export default function StudentProfile() {
  const { id } = useParams();
  const [data, setData] = useState<{ student: Student; logs: Observation[]; goals: Goal[] } | null>(null);
  const [newGoal, setNewGoal] = useState({ description: "", targetDate: "", subjectArea: "General" });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [curriculumOutcomes, setCurriculumOutcomes] = useState<CurriculumOutcome[]>([]);
  const [evaluations, setEvaluations] = useState<Record<number, string>>({});
  const [fullEvaluations, setFullEvaluations] = useState<Evaluation[]>([]);
  const [verticalAlignmentOutcomes, setVerticalAlignmentOutcomes] = useState<VerticalAlignmentOutcome[]>([]);
  const [verticalEvaluations, setVerticalEvaluations] = useState<Record<number, string>>({});
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);
  const [isLoadingVertical, setIsLoadingVertical] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, evsRes, verticalEvsRes, metadataRes, assessmentsRes] = await Promise.all([
        fetch(`/api/students/${id}/report`),
        fetch(`/api/students/${id}/evaluations`),
        fetch(`/api/students/${id}/vertical-evaluations`),
        fetch("/api/metadata"),
        fetch(`/api/students/${id}/assessments`)
      ]);

      const [profileData, evsData, verticalEvsData, metadataData, assessmentsData] = await Promise.all([
        profileRes.json(),
        evsRes.json(),
        verticalEvsRes.json(),
        metadataRes.json(),
        assessmentsRes.json()
      ]);

      setData(profileData);
      if (profileData.student && !selectedGrade) {
        setSelectedGrade(profileData.student.Grade_Level);
      }

      const evMap: Record<number, string> = {};
      evsData.forEach((e: any) => {
        evMap[e.Outcome_ID] = e.Status;
      });
      setEvaluations(evMap);
      setFullEvaluations(evsData);

      const vEvMap: Record<number, string> = {};
      verticalEvsData.forEach((e: any) => {
        vEvMap[e.Outcome_ID] = e.Status;
      });
      setVerticalEvaluations(vEvMap);
      
      setMetadata(metadataData);
      setAssessments(assessmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      setIsLoadingCurriculum(true);
      fetch(`/api/curriculum?subject=${encodeURIComponent(selectedSubject)}&grade=${encodeURIComponent(selectedGrade)}`)
        .then(res => res.json())
        .then(setCurriculumOutcomes)
        .finally(() => setIsLoadingCurriculum(false));
    }
  }, [selectedSubject, selectedGrade]);

  useEffect(() => {
    if (selectedGrade) {
      setIsLoadingVertical(true);
      const url = `/api/vertical-alignment?grade=${encodeURIComponent(selectedGrade)}${selectedSubject ? `&subject=${encodeURIComponent(selectedSubject)}` : ""}`;
      fetch(url)
        .then(res => res.json())
        .then(setVerticalAlignmentOutcomes)
        .finally(() => setIsLoadingVertical(false));
    }
  }, [selectedGrade, selectedSubject]);

  const handleUpdateEvaluation = async (outcomeId: number, status: string) => {
    try {
      const res = await fetch(`/api/students/${id}/evaluations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Outcome_ID: outcomeId, Status: status })
      });
      if (res.ok) {
        setEvaluations(prev => ({ ...prev, [outcomeId]: status }));
        // Refresh full evaluations for the summary/PDF
        fetch(`/api/students/${id}/evaluations`)
          .then(res => res.json())
          .then(setFullEvaluations);
        toast.success("Evaluation updated");
      } else {
        toast.error("Failed to update evaluation");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleUpdateVerticalEvaluation = async (outcomeId: number, status: string) => {
    try {
      const res = await fetch(`/api/students/${id}/vertical-evaluations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Outcome_ID: outcomeId, Status: status })
      });
      if (res.ok) {
        setVerticalEvaluations(prev => ({ ...prev, [outcomeId]: status }));
        toast.success("Vertical evaluation updated");
      } else {
        toast.error("Failed to update vertical evaluation");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.description || !newGoal.targetDate) return;
    
    if (newGoal.description.trim().length < 10) {
      toast.error("Goal description must be at least 10 characters long");
      return;
    }
    
    try {
      const res = await fetch(`/api/students/${id}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Goal_Description: newGoal.description, 
          Target_Date: newGoal.targetDate,
          Core_Subject_Area: newGoal.subjectArea
        })
      });
      if (res.ok) {
        toast.success("Goal added successfully");
        setNewGoal({ description: "", targetDate: "", subjectArea: "General" });
        fetchData();
      } else {
        toast.error("Failed to add goal");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleUpdateGoalStatus = async (goalId: number, status: string) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: status })
      });
      if (res.ok) {
        toast.success("Goal status updated");
        fetchData();
      } else {
        toast.error("Failed to update goal status");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleSuggestGoal = async () => {
    if (!data || !data.logs || data.logs.length === 0) {
      toast.error("Not enough data", { description: "Need at least one observation to suggest a goal." });
      return;
    }

    setIsSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { student, logs } = data;
      
      const prompt = `Based on the following student observations and accommodations, suggest a single, specific, measurable, achievable, relevant, and time-bound (SMART) goal for the student.
      
Student: ${student.First_Name} ${student.Last_Initial}.
Grade: ${student.Grade_Level}

Observations:
${logs.map((l: any) => `- ${l.AI_Scrubbed_Observation || l.Raw_Dictation} (Accommodation: ${l.Recommended_Assistive_Tech || 'None'})`).join('\n')}

Return ONLY the goal description text, nothing else.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      if (response.text) {
        setNewGoal(prev => ({ ...prev, description: response.text.trim() }));
        toast.success("AI Goal Suggested");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate goal");
    } finally {
      setIsSuggesting(false);
    }
  };

  if (!data) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  const { student, logs, goals = [] } = data;

  const handleGeneratePDF = () => {
    generateIPP_PDF(student, logs, goals, fullEvaluations, assessments);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-xl border shadow-sm flex items-center gap-6">
        <Button variant="ghost" size="icon" render={<Link to="/" />} className="h-12 w-12 rounded-full border border-neutral-200 hover:bg-primary/5 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Student Profile</span>
            <span className="text-muted-foreground text-sm font-medium">ID: {student.Student_ID}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">{student.First_Name} {student.Last_Initial}.</h1>
          <p className="text-muted-foreground text-lg font-medium">Grade {student.Grade_Level} • {student.School_Program || "Edmonton Public Schools"}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleGeneratePDF} size="lg" className="bg-secondary text-primary font-black hover:bg-secondary/90 shadow-sm px-8">
            <Download className="w-5 h-5 mr-2" /> Export IPP PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ProfileDetails student={student} logs={logs} goals={goals} />
          <IPPContextManager student={student} onUpdate={fetchData} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <GoalManager 
            goals={goals}
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            handleAddGoal={handleAddGoal}
            handleSuggestGoal={handleSuggestGoal}
            handleUpdateGoalStatus={handleUpdateGoalStatus}
            isSuggesting={isSuggesting}
            metadata={metadata}
          />

          <CurriculumAssessment 
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            curriculumOutcomes={curriculumOutcomes}
            evaluations={evaluations}
            handleUpdateEvaluation={handleUpdateEvaluation}
            isLoadingCurriculum={isLoadingCurriculum}
          />

          <VerticalAlignmentAssessment 
            verticalAlignmentOutcomes={verticalAlignmentOutcomes}
            verticalEvaluations={verticalEvaluations}
            handleUpdateVerticalEvaluation={handleUpdateVerticalEvaluation}
            isLoadingVertical={isLoadingVertical}
          />

          <CurriculumSummary fullEvaluations={fullEvaluations} />

          <ObservationHistory logs={logs} />
        </div>
      </div>
    </div>
  );
}
