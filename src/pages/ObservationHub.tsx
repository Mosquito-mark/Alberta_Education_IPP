import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { GoogleGenAI } from "@google/genai";

export default function ObservationHub() {
  const [students, setStudents] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>({});
  const [isRecording, setIsRecording] = useState(false);
  const [rawDictation, setRawDictation] = useState("");
  const [scrubbedText, setScrubbedText] = useState("");
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const [formData, setFormData] = useState({
    Student_ID: "",
    Core_Subject_Area: "",
    Outcome_Grade_Level: "",
    Evaluation_Status: "",
    Recommended_Assistive_Tech: "",
    Image: null as File | null
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/students").then(res => res.json()).then(setStudents);
    fetch("/api/metadata").then(res => res.json()).then(setMetadata);

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setRawDictation(prev => {
            const newText = prev + (prev ? " " : "") + finalTranscript.trim();
            return newText.trim();
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (formData.Student_ID && formData.Outcome_Grade_Level) {
      const student = students.find(s => s.Student_ID === formData.Student_ID);
      if (student) {
        const studentGrade = parseInt(student.Grade_Level.replace(/\D/g, '')) || 0;
        const outcomeGrade = parseInt(formData.Outcome_Grade_Level.replace(/\D/g, '')) || 0;
        if (studentGrade > 0 && outcomeGrade > 0) {
          const gap = outcomeGrade - studentGrade;
          let status = "At Grade Level";
          if (gap < 0) status = "Below Grade Level";
          if (gap > 0) status = "Above Grade Level";
          
          let recommendedTech = formData.Recommended_Assistive_Tech;
          if (gap <= -3 && formData.Core_Subject_Area === "Mathematics") {
            recommendedTech = "Manipulatives";
            toast.info("Gap Logic Applied", { description: `Modifier of ${gap} Grade Levels assigned. Recommended primary-level UDL tools.` });
          }

          setFormData(prev => ({
            ...prev,
            Evaluation_Status: status,
            Recommended_Assistive_Tech: recommendedTech
          }));
        }
      }
    }
  }, [formData.Student_ID, formData.Outcome_Grade_Level, formData.Core_Subject_Area]);
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Not Supported", { description: "Speech recognition is not supported in this browser." });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Don't clear existing dictation, allow appending
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start recording:", e);
      }
    }
  };

  const handleScrub = async () => {
    if (!rawDictation || !formData.Core_Subject_Area) {
      toast.error("Missing fields", { description: "Please provide dictation and select a subject area." });
      return;
    }
    setIsScrubbing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Raw dictation: "${rawDictation}"\nSubject Area: ${formData.Core_Subject_Area}`,
        config: {
          systemInstruction: "You are an optimistic Alberta educational assistant. Review the raw teacher dictation. Identify any negative, deficit-based language and rewrite the observation using affirmative, pedagogical, strengths-based language mapped to the selected Alberta K-12 Subject Area. Do not invent curriculum. Return ONLY the rewritten text.",
        }
      });
      
      if (response.text) {
        setScrubbedText(response.text.trim());
        toast.success("Success", { description: "Observation scrubbed successfully." });
      } else {
        toast.error("Error", { description: "Failed to scrub observation." });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error", { description: "Failed to connect to AI service." });
    } finally {
      setIsScrubbing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.Student_ID || !scrubbedText) {
      toast.error("Missing fields", { description: "Please select a student and scrub the observation first." });
      return;
    }

    const data = new FormData();
    data.append("Student_ID", formData.Student_ID);
    data.append("Raw_Dictation", rawDictation);
    data.append("AI_Scrubbed_Observation", scrubbedText);
    
    // Find Outcome_ID and Accommodation_ID based on selections
    const outcome = metadata.outcomes?.find((o: any) => o.Core_Subject_Area === formData.Core_Subject_Area);
    if (outcome) data.append("Outcome_ID", outcome.Outcome_ID.toString());

    const acc = metadata.accommodations?.find((a: any) => a.Recommended_Assistive_Tech === formData.Recommended_Assistive_Tech);
    if (acc) data.append("Accommodation_ID", acc.Accommodation_ID.toString());

    if (formData.Image) {
      data.append("image", formData.Image);
    }

    try {
      const res = await fetch("/api/observations", {
        method: "POST",
        body: data
      });
      if (res.ok) {
        toast.success("Success", { description: "Observation logged successfully." });
        setRawDictation("");
        setScrubbedText("");
        setFormData({ ...formData, Image: null });
      } else {
        toast.error("Error", { description: "Failed to save observation." });
      }
    } catch (e) {
      toast.error("Error", { description: "Network error." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Observation Hub</h1>
        <p className="text-muted-foreground text-lg">Capture strengths-based evidence in real-time • EPSB District</p>
      </div>

      <div className="bg-white border rounded-xl p-8 shadow-md space-y-6 border-t-4 border-t-primary">
        <div className="space-y-2">
          <Label className="text-primary font-bold text-xs uppercase tracking-widest">Select Student</Label>
          <Select value={formData.Student_ID} onValueChange={(v) => setFormData({...formData, Student_ID: v})}>
            <SelectTrigger className="h-12 border-primary/20 focus:ring-primary">
              <SelectValue placeholder="Choose a student..." />
            </SelectTrigger>
            <SelectContent>
              {students.map(s => (
                <SelectItem key={s.Student_ID} value={s.Student_ID}>{s.First_Name} {s.Last_Initial}. ({s.Grade_Level})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-primary font-bold text-xs uppercase tracking-widest">Raw Dictation</Label>
            <Button 
              type="button" 
              variant={isRecording ? "destructive" : "secondary"} 
              size="sm" 
              onClick={toggleRecording}
              className={`rounded-full px-4 font-bold ${!isRecording ? "bg-secondary text-primary hover:bg-secondary/80" : ""}`}
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
              {isRecording ? "Stop Dictation" : "Start Dictation"}
            </Button>
          </div>
          <Textarea 
            placeholder="E.g., He refused to write the essay again, got distracted, but finally built a timeline in Comic Life."
            value={rawDictation}
            onChange={(e) => setRawDictation(e.target.value)}
            className="min-h-[120px] font-mono text-sm bg-neutral-50 border-primary/10 focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-primary font-bold text-xs uppercase tracking-widest">Core Subject Area</Label>
            <Select value={formData.Core_Subject_Area} onValueChange={(v) => setFormData({...formData, Core_Subject_Area: v})}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {metadata.subjects?.map((s: any) => (
                  <SelectItem key={s.Core_Subject_Area} value={s.Core_Subject_Area}>{s.Core_Subject_Area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-primary font-bold text-xs uppercase tracking-widest">Outcome Grade Level</Label>
            <Select value={formData.Outcome_Grade_Level} onValueChange={(v) => setFormData({...formData, Outcome_Grade_Level: v})}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {["Gr.1", "Gr.2", "Gr.3", "Gr.4", "Gr.5", "Gr.6", "Gr.7", "Gr.8", "Gr.9"].map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-primary font-bold text-xs uppercase tracking-widest">Evaluation Status</Label>
            <Select value={formData.Evaluation_Status} onValueChange={(v) => setFormData({...formData, Evaluation_Status: v})}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {metadata.evaluationStatuses?.map((s: any) => (
                  <SelectItem key={s.Evaluation_Status} value={s.Evaluation_Status}>{s.Evaluation_Status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-primary font-bold text-xs uppercase tracking-widest">Recommended Assistive Tech (UDL Tool)</Label>
          <Select value={formData.Recommended_Assistive_Tech} onValueChange={(v) => setFormData({...formData, Recommended_Assistive_Tech: v})}>
            <SelectTrigger className="border-primary/20">
              <SelectValue placeholder="Select Tool" />
            </SelectTrigger>
            <SelectContent>
              {metadata.assistiveTechs?.map((s: any) => (
                <SelectItem key={s.Recommended_Assistive_Tech} value={s.Recommended_Assistive_Tech}>{s.Recommended_Assistive_Tech}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-primary font-bold text-xs uppercase tracking-widest">Multimedia Evidence (Optional)</Label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setFormData({...formData, Image: e.target.files?.[0] || null})} 
            />
            <Label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary/20 bg-background hover:bg-primary/5 text-primary h-12 px-4 py-2 w-full">
              <ImageIcon className="w-5 h-5 mr-2" /> 
              {formData.Image ? formData.Image.name : "Upload Photo Evidence"}
            </Label>
          </div>
        </div>

        <div className="pt-6 border-t border-primary/10">
          <Button 
            onClick={handleScrub} 
            disabled={isScrubbing || !rawDictation || !formData.Core_Subject_Area}
            className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-black uppercase tracking-widest shadow-lg"
          >
            {isScrubbing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
            AI Strengths-First Scrub
          </Button>
        </div>

        {scrubbedText && (
          <div className="space-y-4 pt-6 border-t border-primary/10 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label className="text-primary font-black text-xs uppercase tracking-widest">AI Draft (Strengths-Based)</Label>
              <Textarea 
                value={scrubbedText}
                onChange={(e) => setScrubbedText(e.target.value)}
                className="min-h-[120px] border-primary/20 focus-visible:ring-primary font-medium"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full bg-secondary text-primary font-black h-14 text-lg uppercase tracking-widest hover:bg-secondary/90 shadow-md" size="lg">
              Save Observation to IPP
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
