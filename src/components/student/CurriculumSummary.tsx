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
    <Card id="curriculum-summary" className="border-none shadow-sm bg-card rounded-none border-l-8 border-l-goa-sky">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-none" aria-hidden="true">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-primary tracking-tight">Curriculum Alignment Summary</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recorded evaluations across all subjects</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fullEvaluations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-none bg-muted/20 font-medium" role="status" aria-label="No curriculum outcomes evaluated">
            No curriculum outcomes have been evaluated yet for this student.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Group by Subject */}
            {Array.from(new Set(fullEvaluations.map(e => e.Subject))).map(subject => (
              <div key={subject} className="space-y-3" aria-label={`Subject: ${subject}`}>
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-none inline-block border border-primary/20">
                  {subject}
                </h3>
                <div className="grid gap-3">
                  {fullEvaluations.filter(e => e.Subject === subject).map(ev => (
                    <div key={ev.Outcome_ID} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-none border border-border bg-card hover:border-primary/30 transition-colors shadow-sm">
                      <div className={cn(
                        "mt-1 px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-widest whitespace-nowrap",
                        ev.Status === "Met" ? "bg-emerald-900/20 text-emerald-400 border border-emerald-900/50" :
                        ev.Status === "Exceeded" ? "bg-blue-900/20 text-blue-400 border border-blue-900/50" :
                        ev.Status === "Not Met" ? "bg-red-900/20 text-red-400 border border-red-900/50" :
                        "bg-muted text-muted-foreground border border-border"
                      )} aria-label={`Status: ${ev.Status}`}>
                        {ev.Status}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-muted px-1.5 py-0.5 rounded-none border border-border">{ev.Outcome_Code}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grade {ev.Grade}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-bold">
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
