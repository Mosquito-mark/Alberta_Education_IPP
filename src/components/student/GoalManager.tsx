import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Info, Sparkles, Loader2, Target, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";

interface GoalManagerProps {
  goals: Goal[];
  newGoal: { description: string; targetDate: string; subjectArea: string };
  setNewGoal: (goal: any) => void;
  handleAddGoal: (e: React.FormEvent) => void;
  handleSuggestGoal: () => void;
  handleUpdateGoalStatus: (goalId: number, status: string) => void;
  isSuggesting: boolean;
  metadata: any;
}

export function GoalManager({
  goals,
  newGoal,
  setNewGoal,
  handleAddGoal,
  handleSuggestGoal,
  handleUpdateGoalStatus,
  isSuggesting,
  metadata
}: GoalManagerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Measurable Goals (SMART)</CardTitle>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="h-6 w-6 rounded-full"><Info className="w-4 h-4 text-muted-foreground" /></Button>} />
            <TooltipContent className="max-w-xs">
              <p><strong>SMART Goals:</strong></p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li><strong>S</strong>pecific</li>
                <li><strong>M</strong>easurable</li>
                <li><strong>A</strong>chievable</li>
                <li><strong>R</strong>elevant</li>
                <li><strong>T</strong>ime-bound</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription>Specific, achievable, relevant, and time-bound goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddGoal} className="space-y-4 border p-4 rounded-lg bg-neutral-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Goal Description</Label>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon" className="h-5 w-5 rounded-full"><Info className="w-3.5 h-3.5 text-muted-foreground" /></Button>} />
                  <TooltipContent className="max-w-xs">
                    <p><strong>SMART Goals:</strong></p>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
                      <li><strong>S</strong>pecific</li>
                      <li><strong>M</strong>easurable</li>
                      <li><strong>A</strong>chievable</li>
                      <li><strong>R</strong>elevant</li>
                      <li><strong>T</strong>ime-bound</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleSuggestGoal} 
                disabled={isSuggesting}
                className="h-8 text-xs"
              >
                {isSuggesting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                Suggest AI Goal
              </Button>
            </div>
            <Textarea 
              required 
              minLength={10}
              placeholder="E.g., By the end of the term, the student will..." 
              value={newGoal.description} 
              onChange={e => setNewGoal({...newGoal, description: e.target.value})} 
            />
            <p className="text-xs text-muted-foreground">Must be at least 10 characters.</p>
          </div>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Subject Area</Label>
              <Select 
                value={newGoal.subjectArea} 
                onValueChange={(val) => setNewGoal({...newGoal, subjectArea: val})}
              >
                <SelectTrigger render={<Button variant="outline" className="w-full justify-between" />}>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  {metadata?.subjects?.map((s: any) => (
                    <SelectItem key={s.Core_Subject_Area} value={s.Core_Subject_Area}>
                      {s.Core_Subject_Area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newGoal.targetDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" /> {newGoal.targetDate ? format(new Date(newGoal.targetDate), "PPP") : <span>Pick a date</span>}</Button>} />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newGoal.targetDate ? new Date(newGoal.targetDate) : undefined}
                    onSelect={(date) => setNewGoal({...newGoal, targetDate: date ? format(date, "yyyy-MM-dd") : ""})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Add Goal</Button>
          </div>
        </form>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No goals defined yet.
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.Goal_ID} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-medium">{goal.Goal_Description}</span>
                  <Select value={goal.Status} onValueChange={(val) => handleUpdateGoalStatus(goal.Goal_ID, val)}>
                    <SelectTrigger render={<Button variant="outline" className="w-[140px] h-8 text-xs justify-between" />}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Target Date: {goal.Target_Date}</span>
                    <span className="bg-primary/5 text-primary/70 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {goal.Core_Subject_Area || "General"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
