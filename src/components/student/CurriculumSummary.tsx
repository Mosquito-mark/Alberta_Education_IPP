import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Evaluation } from "@/types";

interface CurriculumSummaryProps {
  fullEvaluations: Evaluation[];
}

export function CurriculumSummary({ fullEvaluations }: CurriculumSummaryProps) {
  return (
    <Card id="curriculum-summary" className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Alberta Curriculum Alignment Summary</CardTitle>
            <CardDescription>Recorded evaluations across all subjects</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fullEvaluations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
            No curriculum outcomes have been evaluated yet.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group by Subject */}
            {Array.from(new Set(fullEvaluations.map(e => e.Subject))).map(subject => (
              <div key={subject} className="space-y-2">
                <h3 className="font-semibold text-sm text-blue-800 bg-blue-50 px-3 py-1 rounded-md inline-block">
                  {subject}
                </h3>
                <div className="grid gap-3">
                  {fullEvaluations.filter(e => e.Subject === subject).map(ev => (
                    <div key={ev.Outcome_ID} className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:border-blue-200 transition-colors">
                      <div className={cn(
                        "mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        ev.Status === "Met" ? "bg-emerald-100 text-emerald-700" :
                        ev.Status === "Exceeded" ? "bg-blue-100 text-blue-700" :
                        ev.Status === "Not Met" ? "bg-rose-100 text-rose-700" :
                        "bg-neutral-100 text-neutral-600"
                      )}>
                        {ev.Status}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-neutral-500">{ev.Outcome_Code}</span>
                          <span className="text-[10px] text-muted-foreground">({ev.Grade})</span>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {ev.Description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
