import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Info, Sparkles, Loader2, Target, Plus, CalendarIcon, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";

interface GoalManagerProps {
  goals: Goal[];
  newGoal: { 
    description: string; 
    targetDate: string; 
    subjectArea: string;
    obj1Desc?: string;
    obj1Assess?: string;
    obj1Prog?: string;
    obj2Desc?: string;
    obj2Assess?: string;
    obj2Prog?: string;
    obj3Desc?: string;
    obj3Assess?: string;
    obj3Prog?: string;
    accommodations?: string;
  };
  setNewGoal: (goal: any) => void;
  handleAddGoal: (e: React.FormEvent) => void;
  handleSuggestGoal: () => void;
  handleSuggestObjectives: () => void;
  handleUpdateGoalStatus: (goalId: number, status: string) => void;
  handleEditGoal: (goalId: number, updatedGoal: any) => void;
  isSuggesting: boolean;
  isSuggestingObjectives: boolean;
  metadata: any;
}

export function GoalManager({
  goals,
  newGoal,
  setNewGoal,
  handleAddGoal,
  handleSuggestGoal,
  handleSuggestObjectives,
  handleUpdateGoalStatus,
  handleEditGoal,
  isSuggesting,
  isSuggestingObjectives,
  metadata
}: GoalManagerProps) {
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);
  const [editGoalForm, setEditGoalForm] = React.useState<any>({});

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditGoalForm({
      Goal_Description: goal.Goal_Description || "",
      Target_Date: goal.Target_Date || "",
      Core_Subject_Area: goal.Core_Subject_Area || "General",
      Status: goal.Status || "Not Started",
      Objective_1_Description: goal.Objective_1_Description || "",
      Objective_1_Assessment_Procedure: goal.Objective_1_Assessment_Procedure || "",
      Objective_1_Progress_Review: goal.Objective_1_Progress_Review || "",
      Objective_2_Description: goal.Objective_2_Description || "",
      Objective_2_Assessment_Procedure: goal.Objective_2_Assessment_Procedure || "",
      Objective_2_Progress_Review: goal.Objective_2_Progress_Review || "",
      Objective_3_Description: goal.Objective_3_Description || "",
      Objective_3_Assessment_Procedure: goal.Objective_3_Assessment_Procedure || "",
      Objective_3_Progress_Review: goal.Objective_3_Progress_Review || "",
      Goal_Accommodations_Strategies: goal.Goal_Accommodations_Strategies || ""
    });
  };

  const submitEditGoal = () => {
    if (editingGoal) {
      handleEditGoal(editingGoal.Goal_ID, editGoalForm);
      setEditingGoal(null);
    }
  };

  return (
    <Card className="rounded-none border shadow-sm border-t-8 border-t-goa-sky">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold text-primary">Measurable Goals (SMART)</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" aria-label="Information about SMART goals">
                <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs rounded-none border-border">
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
        <CardDescription className="text-foreground font-medium">Specific, achievable, relevant, and time-bound goals for the Individual Program Plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddGoal} className="space-y-4 border p-4 rounded-none bg-muted/30 border-border">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="goal-description" className="text-primary font-bold text-xs uppercase tracking-widest">Goal Description</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-none" aria-label="SMART goal criteria details">
                      <Info className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs rounded-none border-border">
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
                className="h-8 text-[10px] uppercase tracking-widest font-bold rounded-none border-primary/30 text-primary hover:bg-primary/5"
                aria-label="Use AI to suggest a SMART goal based on student observations"
              >
                {isSuggesting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                Suggest AI Goal
              </Button>
            </div>
            <Textarea 
              id="goal-description"
              required 
              minLength={10}
              placeholder="E.g., By the end of the term, the student will..." 
              value={newGoal.description} 
              onChange={e => setNewGoal({...newGoal, description: e.target.value})} 
              className="rounded-none border-border focus:border-goa-sky"
              aria-describedby="goal-help"
            />
            <p id="goal-help" className="text-[10px] text-muted-foreground font-medium">Must be at least 10 characters. Describe a specific, measurable outcome.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <Label htmlFor="goal-subject" className="text-primary font-bold text-xs uppercase tracking-widest">Subject Area</Label>
              <Select 
                value={newGoal.subjectArea} 
                onValueChange={(val) => setNewGoal({...newGoal, subjectArea: val})}
              >
                <SelectTrigger id="goal-subject" className="w-full justify-between rounded-none border-border focus:border-goa-sky" aria-label="Select subject area for this goal">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border">
                  <SelectItem value="General">General</SelectItem>
                  {metadata?.subjects?.map((s: any) => (
                    <SelectItem key={s.Core_Subject_Area} value={s.Core_Subject_Area}>
                      {s.Core_Subject_Area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1 w-full">
              <Label htmlFor="goal-date" className="text-primary font-bold text-xs uppercase tracking-widest">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="goal-date" variant="outline" className={cn("w-full justify-start text-left font-normal rounded-none border-border focus:border-goa-sky", !newGoal.targetDate && "text-muted-foreground")} aria-label="Select target date for goal completion">
                    <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" /> {newGoal.targetDate ? format(new Date(newGoal.targetDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={newGoal.targetDate ? new Date(newGoal.targetDate) : undefined}
                    onSelect={(date) => setNewGoal({...newGoal, targetDate: date ? format(date, "yyyy-MM-dd") : ""})}
                    initialFocus
                    className="rounded-none"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Short-Term Objectives</h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleSuggestObjectives} 
                disabled={isSuggestingObjectives || !newGoal.description || !newGoal.subjectArea || !newGoal.targetDate}
                className="h-8 text-[10px] uppercase tracking-widest font-bold rounded-none border-primary/30 text-primary hover:bg-primary/5"
                aria-label="Use AI to suggest short-term objectives based on the goal description"
              >
                {isSuggestingObjectives ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                Suggest Objectives
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-primary">Objective 1</Label>
                <Input placeholder="Description" value={newGoal.obj1Desc || ""} onChange={e => setNewGoal({...newGoal, obj1Desc: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Assessment Procedure" value={newGoal.obj1Assess || ""} onChange={e => setNewGoal({...newGoal, obj1Assess: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Progress Review" value={newGoal.obj1Prog || ""} onChange={e => setNewGoal({...newGoal, obj1Prog: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-primary">Objective 2</Label>
                <Input placeholder="Description" value={newGoal.obj2Desc || ""} onChange={e => setNewGoal({...newGoal, obj2Desc: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Assessment Procedure" value={newGoal.obj2Assess || ""} onChange={e => setNewGoal({...newGoal, obj2Assess: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Progress Review" value={newGoal.obj2Prog || ""} onChange={e => setNewGoal({...newGoal, obj2Prog: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-primary">Objective 3</Label>
                <Input placeholder="Description" value={newGoal.obj3Desc || ""} onChange={e => setNewGoal({...newGoal, obj3Desc: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Assessment Procedure" value={newGoal.obj3Assess || ""} onChange={e => setNewGoal({...newGoal, obj3Assess: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
                <Input placeholder="Progress Review" value={newGoal.obj3Prog || ""} onChange={e => setNewGoal({...newGoal, obj3Prog: e.target.value})} className="rounded-none border-border focus:border-goa-sky text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4 mt-4">
            <Label htmlFor="goal-accommodations" className="text-primary font-bold text-xs uppercase tracking-widest">Accommodations & Strategies</Label>
            <Textarea 
              id="goal-accommodations"
              placeholder="Accommodations and strategies to support this goal..." 
              value={newGoal.accommodations || ""} 
              onChange={e => setNewGoal({...newGoal, accommodations: e.target.value})} 
              className="rounded-none border-border focus:border-goa-sky"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-goa-sky hover:bg-goa-sky/90 text-white rounded-none w-full md:w-auto font-bold uppercase tracking-widest text-xs h-10" aria-label="Add this goal to the student's plan">
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" /> Add Goal
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-none border-border">
              <Target className="w-10 h-10 mx-auto mb-2 opacity-20" aria-hidden="true" />
              <p className="text-sm font-medium">No goals defined yet for this student.</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.Goal_ID} className="border rounded-none p-4 space-y-2 border-border hover:border-primary/30 transition-colors bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                    <span className="font-bold text-foreground">{goal.Goal_Description}</span>
                    <Badge 
                      variant={goal.Status === "Completed" ? "completed" : goal.Status === "In Progress" ? "in-progress" : "not-started"} 
                      className="rounded-none uppercase tracking-widest text-[10px] mt-0.5 w-fit"
                    >
                      {goal.Status || "Not Started"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={goal.Status} onValueChange={(val) => handleUpdateGoalStatus(goal.Goal_ID, val)}>
                      <SelectTrigger className="w-[140px] h-8 text-[10px] font-bold uppercase tracking-widest justify-between rounded-none border-border focus:border-goa-sky" aria-label={`Update status for goal: ${goal.Goal_Description}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border">
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-border text-muted-foreground hover:text-foreground" onClick={() => openEditModal(goal)} aria-label={`Edit goal: ${goal.Goal_Description}`}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-medium">
                      <CalendarIcon className="w-3 h-3" aria-hidden="true" />
                      Target: {goal.Target_Date}
                    </span>
                    <span className="bg-goa-sky/10 text-primary px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider border border-goa-sky/20">
                      {goal.Core_Subject_Area || "General"}
                    </span>
                  </div>
                </div>
                
                {(goal.Objective_1_Description || goal.Objective_2_Description || goal.Objective_3_Description) && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">Short-Term Objectives</h5>
                    <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
                      {goal.Objective_1_Description && <li>{goal.Objective_1_Description}</li>}
                      {goal.Objective_2_Description && <li>{goal.Objective_2_Description}</li>}
                      {goal.Objective_3_Description && <li>{goal.Objective_3_Description}</li>}
                    </ul>
                  </div>
                )}
                
                {goal.Goal_Accommodations_Strategies && (
                  <div className="mt-2 space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">Accommodations & Strategies</h5>
                    <p className="text-xs text-muted-foreground">{goal.Goal_Accommodations_Strategies}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-none border-t-8 border-t-goa-sky max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-goal-desc" className="text-xs font-bold uppercase tracking-widest text-primary">Goal Description</Label>
              <Textarea 
                id="edit-goal-desc"
                value={editGoalForm.Goal_Description || ""}
                onChange={(e) => setEditGoalForm({...editGoalForm, Goal_Description: e.target.value})}
                className="rounded-none border-border focus:border-goa-sky"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject" className="text-xs font-bold uppercase tracking-widest text-primary">Subject Area</Label>
                <Select value={editGoalForm.Core_Subject_Area} onValueChange={(v) => setEditGoalForm({...editGoalForm, Core_Subject_Area: v})}>
                  <SelectTrigger id="edit-subject" className="rounded-none border-border focus:border-goa-sky">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border">
                    {metadata.subjects?.map((s: any) => (
                      <SelectItem key={s.Core_Subject_Area} value={s.Core_Subject_Area}>{s.Core_Subject_Area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-target-date" className="text-xs font-bold uppercase tracking-widest text-primary">Target Date</Label>
                <Input 
                  id="edit-target-date"
                  type="date" 
                  value={editGoalForm.Target_Date || ""}
                  onChange={(e) => setEditGoalForm({...editGoalForm, Target_Date: e.target.value})}
                  className="rounded-none border-border focus:border-goa-sky"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-sm font-bold text-primary">Short-Term Objectives</h4>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2 p-4 bg-muted/30 border border-border">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Objective {num}</Label>
                  <Input 
                    placeholder="Description" 
                    value={editGoalForm[`Objective_${num}_Description`] || ""}
                    onChange={(e) => setEditGoalForm({...editGoalForm, [`Objective_${num}_Description`]: e.target.value})}
                    className="rounded-none border-border focus:border-goa-sky text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Assessment Procedure" 
                      value={editGoalForm[`Objective_${num}_Assessment_Procedure`] || ""}
                      onChange={(e) => setEditGoalForm({...editGoalForm, [`Objective_${num}_Assessment_Procedure`]: e.target.value})}
                      className="rounded-none border-border focus:border-goa-sky text-xs"
                    />
                    <Input 
                      type="date"
                      placeholder="Review Date" 
                      value={editGoalForm[`Objective_${num}_Progress_Review`] || ""}
                      onChange={(e) => setEditGoalForm({...editGoalForm, [`Objective_${num}_Progress_Review`]: e.target.value})}
                      className="rounded-none border-border focus:border-goa-sky text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="edit-accommodations" className="text-xs font-bold uppercase tracking-widest text-primary">Accommodations & Strategies</Label>
              <Textarea 
                id="edit-accommodations"
                value={editGoalForm.Goal_Accommodations_Strategies || ""}
                onChange={(e) => setEditGoalForm({...editGoalForm, Goal_Accommodations_Strategies: e.target.value})}
                className="rounded-none border-border focus:border-goa-sky"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingGoal(null)} className="rounded-none uppercase tracking-widest text-xs font-bold">Cancel</Button>
              <Button onClick={submitEditGoal} className="bg-goa-sky hover:bg-goa-sky/90 text-white rounded-none uppercase tracking-widest text-xs font-bold">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
