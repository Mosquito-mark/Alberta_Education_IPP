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
    School_Name: student.School_Name || "",
    School_Board: student.School_Board || "",
    Principal_Name: student.Principal_Name || "",
    Support_Services_Summary: student.Support_Services_Summary || "",
    Current_Performance_Narrative: student.Current_Performance_Narrative || "",
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
      <Card className="border-t-8 border-t-goa-sky shadow-md rounded-none">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30 rounded-none">
          <CardTitle className="text-primary font-bold uppercase text-xs tracking-widest">IPP Context & Admin</CardTitle>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-primary/30 text-primary font-bold hover:bg-primary/5 rounded-none uppercase tracking-widest text-[10px]" aria-label="Edit Individual Program Plan administrative details">
                <Edit2 className="w-3.5 h-3.5 mr-2" aria-hidden="true" /> Edit IPP Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary tracking-tight">Edit IPP Administrative Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-[10px] font-bold uppercase tracking-widest text-primary">Date of Birth</Label>
                  <Input id="dob" type="date" value={profileForm.Date_of_Birth} onChange={(e) => setProfileForm({ ...profileForm, Date_of_Birth: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Student date of birth" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility" className="text-[10px] font-bold uppercase tracking-widest text-primary">Eligibility Code</Label>
                  <Input id="eligibility" placeholder="e.g. Code 42" value={profileForm.Eligibility_Code} onChange={(e) => setProfileForm({ ...profileForm, Eligibility_Code: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Student eligibility code" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parents" className="text-[10px] font-bold uppercase tracking-widest text-primary">Parents/Guardians</Label>
                  <Input id="parents" placeholder="Names" value={profileForm.Parents_Names} onChange={(e) => setProfileForm({ ...profileForm, Parents_Names: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Parent or guardian names" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-primary">Phone Number</Label>
                  <Input id="phone" placeholder="Contact Number" value={profileForm.Phone_Number} onChange={(e) => setProfileForm({ ...profileForm, Phone_Number: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Contact phone number" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-widest text-primary">Address</Label>
                  <Input id="address" placeholder="Full Address" value={profileForm.Address} onChange={(e) => setProfileForm({ ...profileForm, Address: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Student residential address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipp-created" className="text-[10px] font-bold uppercase tracking-widest text-primary">Date IPP Created</Label>
                  <Input id="ipp-created" type="date" value={profileForm.Date_IPP_Created} onChange={(e) => setProfileForm({ ...profileForm, Date_IPP_Created: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Date the IPP was initially created" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher" className="text-[10px] font-bold uppercase tracking-widest text-primary">Teacher Name</Label>
                  <Input id="teacher" placeholder="Teacher" value={profileForm.Teacher_Name} onChange={(e) => setProfileForm({ ...profileForm, Teacher_Name: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Assigned teacher name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordinator" className="text-[10px] font-bold uppercase tracking-widest text-primary">IPP Coordinator</Label>
                  <Input id="coordinator" placeholder="Coordinator" value={profileForm.IPP_Coordinator} onChange={(e) => setProfileForm({ ...profileForm, IPP_Coordinator: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="IPP coordinator name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin" className="text-[10px] font-bold uppercase tracking-widest text-primary">Program Administrator</Label>
                  <Input id="admin" placeholder="Administrator" value={profileForm.Program_Administrator} onChange={(e) => setProfileForm({ ...profileForm, Program_Administrator: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Program administrator name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-name" className="text-[10px] font-bold uppercase tracking-widest text-primary">School Name</Label>
                  <Input id="school-name" placeholder="School Name" value={profileForm.School_Name} onChange={(e) => setProfileForm({ ...profileForm, School_Name: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="School Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-board" className="text-[10px] font-bold uppercase tracking-widest text-primary">School Board</Label>
                  <Input id="school-board" placeholder="School Board" value={profileForm.School_Board} onChange={(e) => setProfileForm({ ...profileForm, School_Board: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="School Board" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal-name" className="text-[10px] font-bold uppercase tracking-widest text-primary">Principal Name</Label>
                  <Input id="principal-name" placeholder="Principal Name" value={profileForm.Principal_Name} onChange={(e) => setProfileForm({ ...profileForm, Principal_Name: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Principal Name" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="medical" className="text-[10px] font-bold uppercase tracking-widest text-primary">Medical Conditions</Label>
                  <Textarea id="medical" placeholder="List any medical conditions..." value={profileForm.Medical_Conditions} onChange={(e) => setProfileForm({ ...profileForm, Medical_Conditions: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Relevant medical conditions" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="parental-input" className="text-[10px] font-bold uppercase tracking-widest text-primary">Parental Input</Label>
                  <Textarea id="parental-input" placeholder="Summary of parental input..." value={profileForm.Parental_Input} onChange={(e) => setProfileForm({ ...profileForm, Parental_Input: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Summary of input from parents or guardians" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="transition" className="text-[10px] font-bold uppercase tracking-widest text-primary">Transition Plan Details</Label>
                  <Textarea id="transition" placeholder="Detailed transition planning..." value={profileForm.Transition_Plan_Details} onChange={(e) => setProfileForm({ ...profileForm, Transition_Plan_Details: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Details for the student's transition plan" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="support-services" className="text-[10px] font-bold uppercase tracking-widest text-primary">Coordinated Support Services</Label>
                  <Textarea id="support-services" placeholder="Speech-Language, OT, PT, etc..." value={profileForm.Support_Services_Summary} onChange={(e) => setProfileForm({ ...profileForm, Support_Services_Summary: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Coordinated Support Services" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="performance-narrative" className="text-[10px] font-bold uppercase tracking-widest text-primary">Current Performance Narrative</Label>
                  <Textarea id="performance-narrative" placeholder="Narrative summary of current performance..." value={profileForm.Current_Performance_Narrative} onChange={(e) => setProfileForm({ ...profileForm, Current_Performance_Narrative: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Current Performance Narrative" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateProfile} className="bg-goa-sky text-white font-bold uppercase tracking-widest rounded-none hover:bg-goa-sky/90" aria-label="Save all administrative details to the IPP">Save IPP Details</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">DOB</Label>
              <p className="font-bold text-foreground">{student.Date_of_Birth || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Eligibility</Label>
              <p className="font-bold text-foreground">{student.Eligibility_Code || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Teacher</Label>
              <p className="font-bold text-foreground">{student.Teacher_Name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">IPP Created</Label>
              <p className="font-bold text-foreground">{student.Date_IPP_Created || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">School</Label>
              <p className="font-bold text-foreground">{student.School_Name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Board</Label>
              <p className="font-bold text-foreground">{student.School_Board || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Principal</Label>
              <p className="font-bold text-foreground">{student.Principal_Name || "Not set"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Coordinated Support Services</Label>
              <p className="text-sm text-foreground whitespace-pre-wrap">{student.Support_Services_Summary || "Not set"}</p>
            </div>
            <div>
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Current Performance Narrative</Label>
              <p className="text-sm text-foreground whitespace-pre-wrap">{student.Current_Performance_Narrative || "Not set"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-primary font-bold text-[10px] uppercase tracking-widest">Specialized Assessments</Label>
              <Dialog open={isAddingAssessment} onOpenChange={setIsAddingAssessment}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-none" aria-label="Add a new specialized assessment record">
                    <Plus className="w-3 h-3 mr-1" aria-hidden="true" /> Add Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-none border-border">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary tracking-tight">Add Specialized Assessment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessment-date" className="text-[10px] font-bold uppercase tracking-widest text-primary">Date</Label>
                      <Input id="assessment-date" type="date" value={assessmentForm.Date} onChange={(e) => setAssessmentForm({ ...assessmentForm, Date: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Date of the assessment" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessment-name" className="text-[10px] font-bold uppercase tracking-widest text-primary">Test Name</Label>
                      <Input id="assessment-name" placeholder="e.g. WISC-V, Woodcock-Johnson" value={assessmentForm.Test_Name} onChange={(e) => setAssessmentForm({ ...assessmentForm, Test_Name: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Name of the assessment test" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessment-results" className="text-[10px] font-bold uppercase tracking-widest text-primary">Results/Summary</Label>
                      <Textarea id="assessment-results" placeholder="Key findings and scores..." value={assessmentForm.Results} onChange={(e) => setAssessmentForm({ ...assessmentForm, Results: e.target.value })} className="rounded-none border-border focus:border-goa-sky" aria-label="Summary of assessment results and findings" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAssessment} className="bg-goa-sky text-white font-bold uppercase tracking-widest rounded-none hover:bg-goa-sky/90" aria-label="Save this specialized assessment to the student's record">Add Assessment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {assessments.map((a) => (
                <div key={a.Assessment_ID} className="p-3 rounded-none bg-muted/20 border border-border space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-primary uppercase">{a.Test_Name}</span>
                    <span className="text-[10px] font-medium text-foreground">{a.Date}</span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-2">{a.Results}</p>
                </div>
              ))}
              {assessments.length === 0 && <p className="text-xs text-muted-foreground italic font-medium">No specialized assessments recorded for this student.</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
