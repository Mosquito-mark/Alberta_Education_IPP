import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Student, SpecializedAssessment } from "@/types";

interface IPPContextManagerProps {
  student: Student;
  onUpdate: () => void;
}

export function IPPContextManager({ student, onUpdate }: IPPContextManagerProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [assessments, setAssessments] = useState<SpecializedAssessment[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);

  const [profileForm, setProfileForm] = useState({
    Date_of_Birth: student.Date_of_Birth || "",
    Eligibility_Code: student.Eligibility_Code || "",
    Parents_Names: student.Parents_Names || "",
    Phone_Number: student.Phone_Number || "",
    Address: student.Address || "",
    Age_Sept_1: student.Age_Sept_1 || "",
    Date_IPP_Created: student.Date_IPP_Created || "",
    School_Program: student.School_Program || "",
    Teacher_Name: student.Teacher_Name || "",
    IPP_Coordinator: student.IPP_Coordinator || "",
    Program_Administrator: student.Program_Administrator || "",
    Additional_Team_Members: student.Additional_Team_Members || "",
    Centre_Based_Hours: student.Centre_Based_Hours || "",
    Family_Oriented_Sessions: student.Family_Oriented_Sessions || "",
    Parental_Input: student.Parental_Input || "",
    Medical_Conditions: student.Medical_Conditions || "",
    Strengths_Summary: student.Strengths_Summary || "",
    Areas_of_Need_Summary: student.Areas_of_Need_Summary || "",
    Transition_Plan_Details: student.Transition_Plan_Details || "",
    Year_End_Summary: student.Year_End_Summary || "",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    Date: "",
    Test_Name: "",
    Results: "",
  });

  const fetchAssessments = async () => {
    setIsLoadingAssessments(true);
    try {
      const res = await fetch(`/api/students/${student.Student_ID}/assessments`);
      const data = await res.json();
      setAssessments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAssessments(false);
    }
  };

  React.useEffect(() => {
    fetchAssessments();
  }, [student.Student_ID]);

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`/api/students/${student.Student_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        toast.success("IPP Profile updated");
        setIsEditingProfile(false);
        onUpdate();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleAddAssessment = async () => {
    try {
      const res = await fetch(`/api/students/${student.Student_ID}/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentForm),
      });
      if (res.ok) {
        toast.success("Assessment added");
        setIsAddingAssessment(false);
        setAssessmentForm({ Date: "", Test_Name: "", Results: "" });
        fetchAssessments();
      } else {
        toast.error("Failed to add assessment");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-secondary shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-secondary/5">
          <CardTitle className="text-primary font-black uppercase text-sm tracking-widest">IPP Context & Admin</CardTitle>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger render={<Button variant="outline" size="sm" className="h-8 border-primary/20 text-primary font-bold hover:bg-primary/5"><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit IPP Details</Button>} />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tight">Edit IPP Administrative Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date of Birth</Label>
                  <Input type="date" value={profileForm.Date_of_Birth} onChange={(e) => setProfileForm({ ...profileForm, Date_of_Birth: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Eligibility Code</Label>
                  <Input placeholder="e.g. Code 42" value={profileForm.Eligibility_Code} onChange={(e) => setProfileForm({ ...profileForm, Eligibility_Code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parents/Guardians</Label>
                  <Input placeholder="Names" value={profileForm.Parents_Names} onChange={(e) => setProfileForm({ ...profileForm, Parents_Names: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                  <Input placeholder="Contact Number" value={profileForm.Phone_Number} onChange={(e) => setProfileForm({ ...profileForm, Phone_Number: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</Label>
                  <Input placeholder="Full Address" value={profileForm.Address} onChange={(e) => setProfileForm({ ...profileForm, Address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date IPP Created</Label>
                  <Input type="date" value={profileForm.Date_IPP_Created} onChange={(e) => setProfileForm({ ...profileForm, Date_IPP_Created: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Teacher Name</Label>
                  <Input placeholder="Teacher" value={profileForm.Teacher_Name} onChange={(e) => setProfileForm({ ...profileForm, Teacher_Name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">IPP Coordinator</Label>
                  <Input placeholder="Coordinator" value={profileForm.IPP_Coordinator} onChange={(e) => setProfileForm({ ...profileForm, IPP_Coordinator: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Program Administrator</Label>
                  <Input placeholder="Administrator" value={profileForm.Program_Administrator} onChange={(e) => setProfileForm({ ...profileForm, Program_Administrator: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medical Conditions</Label>
                  <Textarea placeholder="List any medical conditions..." value={profileForm.Medical_Conditions} onChange={(e) => setProfileForm({ ...profileForm, Medical_Conditions: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parental Input</Label>
                  <Textarea placeholder="Summary of parental input..." value={profileForm.Parental_Input} onChange={(e) => setProfileForm({ ...profileForm, Parental_Input: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transition Plan Details</Label>
                  <Textarea placeholder="Detailed transition planning..." value={profileForm.Transition_Plan_Details} onChange={(e) => setProfileForm({ ...profileForm, Transition_Plan_Details: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateProfile} className="bg-primary text-white font-black uppercase tracking-widest">Save IPP Details</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">DOB</Label>
              <p className="font-bold">{student.Date_of_Birth || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Eligibility</Label>
              <p className="font-bold">{student.Eligibility_Code || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Teacher</Label>
              <p className="font-bold">{student.Teacher_Name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">IPP Created</Label>
              <p className="font-bold">{student.Date_IPP_Created || "Not set"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Specialized Assessments</Label>
              <Dialog open={isAddingAssessment} onOpenChange={setIsAddingAssessment}>
                <DialogTrigger render={<Button variant="ghost" size="sm" className="h-6 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"><Plus className="w-3 h-3 mr-1" /> Add Assessment</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-primary uppercase tracking-tight">Add Specialized Assessment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</Label>
                      <Input type="date" value={assessmentForm.Date} onChange={(e) => setAssessmentForm({ ...assessmentForm, Date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Test Name</Label>
                      <Input placeholder="e.g. WISC-V, Woodcock-Johnson" value={assessmentForm.Test_Name} onChange={(e) => setAssessmentForm({ ...assessmentForm, Test_Name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results/Summary</Label>
                      <Textarea placeholder="Key findings and scores..." value={assessmentForm.Results} onChange={(e) => setAssessmentForm({ ...assessmentForm, Results: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAssessment} className="bg-primary text-white font-black uppercase tracking-widest">Add Assessment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {assessments.map((a) => (
                <div key={a.Assessment_ID} className="p-3 rounded bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-xs text-primary uppercase">{a.Test_Name}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">{a.Date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.Results}</p>
                </div>
              ))}
              {assessments.length === 0 && <p className="text-xs text-muted-foreground italic">No specialized assessments recorded.</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
