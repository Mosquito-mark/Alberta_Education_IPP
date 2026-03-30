import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Student, Observation, Goal } from "@/types";

interface ProfileDetailsProps {
  student: Student;
  logs: Observation[];
  goals: Goal[];
}

export function ProfileDetails({ student, logs, goals }: ProfileDetailsProps) {
  const goalCountsBySubject = React.useMemo(() => {
    const counts: Record<string, number> = {};
    goals.forEach((g) => {
      const area = g.Core_Subject_Area || "General";
      counts[area] = (counts[area] || 0) + 1;
    });
    return counts;
  }, [goals]);

  return (
    <Card className="md:col-span-1 border-t-8 border-t-goa-sky shadow-md rounded-none">
      <CardHeader className="bg-muted/30 rounded-none">
        <CardTitle className="text-primary font-bold uppercase text-xs tracking-widest">Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div aria-label="Current transition plan status">
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Status</Label>
          <p className="font-bold text-xl text-foreground">{student.Transition_Plan_Status}</p>
        </div>
        {student.Date_of_Birth && (
          <div aria-label="Student date of birth">
            <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Date of Birth</Label>
            <p className="font-bold text-xl text-foreground">{student.Date_of_Birth}</p>
          </div>
        )}
        {student.Eligibility_Code && (
          <div aria-label="Student eligibility code">
            <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Eligibility</Label>
            <p className="font-bold text-xl text-foreground">{student.Eligibility_Code}</p>
          </div>
        )}
        <div aria-label="Total number of observations logged">
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Total Observations</Label>
          <p className="font-bold text-xl text-foreground">{logs.length}</p>
        </div>
        
        <div className="pt-4 border-t border-border">
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest mb-4 block">Goals per Subject Area</Label>
          <div className="space-y-3">
            {Object.entries(goalCountsBySubject).map(([area, count]) => (
              <div key={area} className="flex justify-between items-center text-sm p-3 rounded-none bg-muted/20 border border-border shadow-sm" aria-label={`${count} goals in ${area}`}>
                <span className="text-foreground font-bold uppercase text-[10px] tracking-wider">{area}</span>
                <span className="bg-goa-prairie text-goa-stone-dark px-3 py-1 rounded-none text-[10px] font-bold border border-border">{count}</span>
              </div>
            ))}
            {goals.length === 0 && <p className="text-xs text-muted-foreground italic font-medium" role="status">No goals recorded for this student.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
