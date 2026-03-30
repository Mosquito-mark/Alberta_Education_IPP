import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerticalAlignmentOutcome } from "@/types";

interface VerticalAlignmentAssessmentProps {
  verticalAlignmentOutcomes: VerticalAlignmentOutcome[];
  verticalEvaluations: Record<number, string>;
  handleUpdateVerticalEvaluation: (outcomeId: number, status: string) => void;
  isLoadingVertical: boolean;
}

export function VerticalAlignmentAssessment({
  verticalAlignmentOutcomes,
  verticalEvaluations,
  handleUpdateVerticalEvaluation,
  isLoadingVertical
}: VerticalAlignmentAssessmentProps) {
  return (
    <Card className="rounded-none border shadow-sm border-t-8 border-t-goa-sky">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-primary">Vertical Alignment Assessment (UDL Framework)</CardTitle>
            <CardDescription className="text-foreground font-medium">Evaluate student progress against core subject objectives from the Provincial UDL Framework.</CardDescription>
          </div>
          <TrendingUp className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingVertical ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : verticalAlignmentOutcomes.length > 0 ? (
          <div className="border rounded-none overflow-x-auto border-border">
            <table className="w-full text-sm min-w-[800px]" aria-label="Vertical Alignment Assessment Table">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Subject</th>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Expected Objective (At Grade Level)</th>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Below Grade Level</th>
                  <th className="text-left p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Above Grade Level</th>
                  <th className="text-right p-3 font-bold text-primary uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {verticalAlignmentOutcomes.map((outcome) => (
                  <tr key={outcome.Outcome_ID} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold align-top text-primary uppercase text-[10px] tracking-widest">{outcome.Core_Subject_Area}</td>
                    <td className="p-3 align-top font-bold text-foreground bg-primary/5">{outcome.At_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-xs text-foreground align-top font-medium italic">{outcome.Below_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-xs text-foreground align-top font-medium italic">{outcome.Above_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-right align-top">
                      <Select 
                        value={verticalEvaluations[outcome.Outcome_ID] || "Not Evaluated"} 
                        onValueChange={(val) => handleUpdateVerticalEvaluation(outcome.Outcome_ID, val)}
                      >
                        <SelectTrigger className={cn(
                          "w-[130px] h-8 text-[10px] font-bold uppercase tracking-widest ml-auto justify-between rounded-none",
                          verticalEvaluations[outcome.Outcome_ID] === "Not Met" && "text-red-400 border-red-900/50 bg-red-900/20",
                          verticalEvaluations[outcome.Outcome_ID] === "Met" && "text-emerald-400 border-emerald-900/50 bg-emerald-900/20",
                          verticalEvaluations[outcome.Outcome_ID] === "Exceeded" && "text-blue-400 border-blue-900/50 bg-blue-900/20",
                          (!verticalEvaluations[outcome.Outcome_ID] || verticalEvaluations[outcome.Outcome_ID] === "Not Evaluated") && "border-border"
                        )} aria-label={`Update vertical status for ${outcome.Core_Subject_Area}`}>
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
        ) : (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-none border-border">
            <p className="text-sm font-medium">No vertical alignment outcomes found for the current selection.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
