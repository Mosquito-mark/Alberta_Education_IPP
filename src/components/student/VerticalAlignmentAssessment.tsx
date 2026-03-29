import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vertical Alignment Assessment (UDL Framework)</CardTitle>
            <CardDescription>Evaluate student progress against core subject objectives from the UDL Framework.</CardDescription>
          </div>
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingVertical ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : verticalAlignmentOutcomes.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Expected Objective (At Grade Level)</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Below Grade Level</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Above Grade Level</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {verticalAlignmentOutcomes.map((outcome) => (
                  <tr key={outcome.Outcome_ID} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3 font-medium align-top">{outcome.Core_Subject_Area}</td>
                    <td className="p-3 align-top font-medium text-emerald-900 bg-emerald-50/30">{outcome.At_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-xs text-muted-foreground align-top">{outcome.Below_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-xs text-muted-foreground align-top">{outcome.Above_Grade_Level_Descriptor}</td>
                    <td className="p-3 text-right align-top">
                      <Select 
                        value={verticalEvaluations[outcome.Outcome_ID] || "Not Evaluated"} 
                        onValueChange={(val) => handleUpdateVerticalEvaluation(outcome.Outcome_ID, val)}
                      >
                        <SelectTrigger render={<Button variant="outline" className={cn(
                          "w-[130px] h-8 text-xs ml-auto justify-between",
                          verticalEvaluations[outcome.Outcome_ID] === "Not Met" && "text-red-600 border-red-200 bg-red-50",
                          verticalEvaluations[outcome.Outcome_ID] === "Met" && "text-emerald-600 border-emerald-200 bg-emerald-50",
                          verticalEvaluations[outcome.Outcome_ID] === "Exceeded" && "text-blue-600 border-blue-200 bg-blue-50"
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
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No vertical alignment outcomes found for this selection.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
