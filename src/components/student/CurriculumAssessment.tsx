import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CurriculumOutcome } from "@/types";

interface CurriculumAssessmentProps {
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  curriculumOutcomes: CurriculumOutcome[];
  evaluations: Record<number, string>;
  handleUpdateEvaluation: (outcomeId: number, status: string) => void;
  isLoadingCurriculum: boolean;
}

export function CurriculumAssessment({
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  curriculumOutcomes,
  evaluations,
  handleUpdateEvaluation,
  isLoadingCurriculum
}: CurriculumAssessmentProps) {
  return (
    <Card className="rounded-none border shadow-sm border-t-8 border-t-goa-sky">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-primary">Curriculum Alignment</CardTitle>
            <CardDescription className="text-foreground font-medium">Track progress against grade-level outcomes defined by educational standards.</CardDescription>
          </div>
          <BookOpen className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assessment-subject" className="text-primary font-bold text-xs uppercase tracking-widest">Subject Area</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="assessment-subject" className="w-full justify-between rounded-none border-border focus:border-goa-sky" aria-label="Select subject area for curriculum assessment">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English Language Arts">English Language Arts</SelectItem>
                <SelectItem value="Social Studies">Social Studies</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assessment-grade" className="text-primary font-bold text-xs uppercase tracking-widest">Grade Level</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger id="assessment-grade" className="w-full justify-between rounded-none border-border focus:border-goa-sky" aria-label="Select grade level for curriculum outcomes">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                {["Kindergarten", "Gr.1", "Gr.2", "Gr.3", "Gr.4", "Gr.5", "Gr.6", "Gr.7", "Gr.8", "Gr.9"].map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingCurriculum ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : curriculumOutcomes.length > 0 ? (
          <div className="border rounded-none overflow-x-auto border-border">
            <table className="w-full text-sm min-w-[600px]" aria-label="Curriculum Outcomes Table">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Code</th>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Outcome Description</th>
                  <th className="text-right p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {curriculumOutcomes.map((outcome) => (
                  <tr key={outcome.Outcome_ID} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-xs align-top text-foreground">{outcome.Outcome_Code}</td>
                    <td className="p-3 align-top text-foreground font-medium">{outcome.Description}</td>
                    <td className="p-3 text-right align-top">
                      <Select 
                        value={evaluations[outcome.Outcome_ID] || "Not Evaluated"} 
                        onValueChange={(val) => handleUpdateEvaluation(outcome.Outcome_ID, val)}
                      >
                        <SelectTrigger className={cn(
                          "w-[130px] h-8 text-[10px] font-bold uppercase tracking-widest ml-auto justify-between rounded-none",
                          evaluations[outcome.Outcome_ID] === "Not Met" && "text-red-400 border-red-900/50 bg-red-900/20",
                          evaluations[outcome.Outcome_ID] === "Met" && "text-emerald-400 border-emerald-900/50 bg-emerald-900/20",
                          evaluations[outcome.Outcome_ID] === "Exceeded" && "text-blue-400 border-blue-900/50 bg-blue-900/20",
                          (!evaluations[outcome.Outcome_ID] || evaluations[outcome.Outcome_ID] === "Not Evaluated") && "border-border"
                        )} aria-label={`Update status for outcome ${outcome.Outcome_Code}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border">
                          <SelectItem value="Not Evaluated">Not Evaluated</SelectItem>
                          <SelectItem value="Not Met">Not Met</SelectItem>
                          <SelectItem value="Met">Met</SelectItem>
                          <SelectItem value="Exceeded">Exceeded</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedSubject ? (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-none border-border">
            <p className="text-sm font-medium">No outcomes found for the selected subject and grade.</p>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-none border-border">
            <p className="text-sm font-medium">Select a subject and grade level to view curriculum outcomes.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
