import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alberta Curriculum Alignment</CardTitle>
            <CardDescription>Track progress against grade-level outcomes.</CardDescription>
          </div>
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subject Area</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger render={<Button variant="outline" className="w-full justify-between" />}>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English Language Arts">English Language Arts</SelectItem>
                <SelectItem value="Social Studies">Social Studies</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grade Level</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger render={<Button variant="outline" className="w-full justify-between" />}>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
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
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Outcome Description</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {curriculumOutcomes.map((outcome) => (
                  <tr key={outcome.Outcome_ID} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3 font-mono text-xs align-top">{outcome.Outcome_Code}</td>
                    <td className="p-3 align-top">{outcome.Description}</td>
                    <td className="p-3 text-right align-top">
                      <Select 
                        value={evaluations[outcome.Outcome_ID] || "Not Evaluated"} 
                        onValueChange={(val) => handleUpdateEvaluation(outcome.Outcome_ID, val)}
                      >
                        <SelectTrigger render={<Button variant="outline" className={cn(
                          "w-[130px] h-8 text-xs ml-auto justify-between",
                          evaluations[outcome.Outcome_ID] === "Not Met" && "text-red-600 border-red-200 bg-red-50",
                          evaluations[outcome.Outcome_ID] === "Met" && "text-emerald-600 border-emerald-200 bg-emerald-50",
                          evaluations[outcome.Outcome_ID] === "Exceeded" && "text-blue-600 border-blue-200 bg-blue-50"
                        )} />}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No outcomes found for this selection.
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            Select a subject to view curriculum outcomes.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
