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
    <Card className="md:col-span-1 border-t-4 border-t-primary shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary font-black uppercase text-sm tracking-widest">Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Status</Label>
          <p className="font-bold text-lg">{student.Transition_Plan_Status}</p>
        </div>
        {student.Date_of_Birth && (
          <div>
            <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Date of Birth</Label>
            <p className="font-bold text-lg">{student.Date_of_Birth}</p>
          </div>
        )}
        {student.Eligibility_Code && (
          <div>
            <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Eligibility</Label>
            <p className="font-bold text-lg">{student.Eligibility_Code}</p>
          </div>
        )}
        <div>
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Total Observations</Label>
          <p className="font-bold text-lg">{logs.length}</p>
        </div>
        
        <div className="pt-4 border-t border-primary/10">
          <Label className="text-primary font-bold text-[10px] uppercase tracking-widest mb-3 block">Goals per Subject Area</Label>
          <div className="space-y-3">
            {Object.entries(goalCountsBySubject).map(([area, count]) => (
              <div key={area} className="flex justify-between items-center text-sm p-2 rounded bg-neutral-50 border border-neutral-100">
                <span className="text-muted-foreground font-medium">{area}</span>
                <span className="bg-secondary text-primary px-2.5 py-0.5 rounded-full text-[10px] font-black">{count}</span>
              </div>
            ))}
            {goals.length === 0 && <p className="text-xs text-muted-foreground italic">No goals recorded.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
