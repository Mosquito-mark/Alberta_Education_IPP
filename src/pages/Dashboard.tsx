import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Plus, Users, Download, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/students/export");
      if (!res.ok) throw new Error("Failed to fetch export data");
      const data = await res.json();
      
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ipp_bulk_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Success", { description: "Bulk IPP export completed." });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error", { description: "Failed to export student data." });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const mappedStudents = results.data.map((row: any) => ({
            Student_ID: row["Student ID"],
            First_Name: row["First Name"],
            Last_Initial: row["Last Initial"],
            Grade_Level: row["Enrolled Grade Level"]
          })).filter((s) => s.Student_ID);

          const res = await fetch("/api/students/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students: mappedStudents })
          });
          if (res.ok) {
            toast.success("Success", { description: "Students imported successfully." });
            fetchStudents();
          } else {
            toast.error("Error", { description: "Failed to import students." });
          }
        }
      });
    }
  };

  const [newStudent, setNewStudent] = useState({ Student_ID: "", First_Name: "", Last_Initial: "", Grade_Level: "" });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent)
    });
    if (res.ok) {
      toast.success("Success", { description: "Student added successfully." });
      setNewStudent({ Student_ID: "", First_Name: "", Last_Initial: "", Grade_Level: "" });
      fetchStudents();
    } else {
      toast.error("Error", { description: "Failed to add student." });
    }
  };

  const getObservationStatus = (dateString: string | null) => {
    if (!dateString) return { label: "None", className: "bg-goa-stone-light/10 text-goa-stone-mid border-goa-stone-light/30" };
    
    const date = new Date(dateString);
    const days = Math.abs(differenceInDays(new Date(), date));
    
    if (days <= 7) return { label: format(date, 'MMM d, yyyy'), className: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (days <= 14) return { label: format(date, 'MMM d, yyyy'), className: "bg-amber-100 text-amber-800 border-amber-200" };
    if (days <= 30) return { label: format(date, 'MMM d, yyyy'), className: "bg-rose-100 text-rose-800 border-rose-200" };
    return { label: format(date, 'MMM d, yyyy'), className: "bg-red-200 text-red-900 border-red-300" };
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-none border-l-8 border-l-goa-sky border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-goa-sky-text">Student Profile Portal</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleExportCSV} 
            disabled={isExporting || students.length === 0} 
            className="border-goa-sky text-goa-sky-text hover:bg-goa-sky/5 font-bold uppercase tracking-widest rounded-none"
            aria-label="Export all student data to CSV"
          >
            {isExporting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
            Bulk Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-goa-sky text-goa-sky-text hover:bg-goa-sky/5 font-bold uppercase tracking-widest rounded-none"
                aria-label="Open dialog to add a new student manually"
              >
                <Plus className="w-5 h-5 mr-2" aria-hidden="true" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-none border-t-8 border-t-goa-sky">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-goa-sky-text tracking-tight">Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id" className="font-bold text-[10px] uppercase tracking-widest text-goa-sky-text">Student ID</Label>
                  <Input 
                    id="student-id"
                    required 
                    value={newStudent.Student_ID} 
                    onChange={e => setNewStudent({...newStudent, Student_ID: e.target.value})} 
                    placeholder="Enter unique student identifier"
                    aria-describedby="student-id-help"
                    className="rounded-none border-goa-stone-light focus-visible:ring-goa-sky"
                  />
                  <p id="student-id-help" className="text-[10px] text-goa-stone-mid">Unique identifier assigned by the school board.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="font-bold text-[10px] uppercase tracking-widest text-goa-sky-text">First Name</Label>
                    <Input 
                      id="first-name"
                      required 
                      value={newStudent.First_Name} 
                      onChange={e => setNewStudent({...newStudent, First_Name: e.target.value})} 
                      placeholder="e.g. John"
                      className="rounded-none border-goa-stone-light focus-visible:ring-goa-sky"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-initial" className="font-bold text-[10px] uppercase tracking-widest text-goa-sky-text">Last Initial</Label>
                    <Input 
                      id="last-initial"
                      required 
                      maxLength={1} 
                      value={newStudent.Last_Initial} 
                      onChange={e => setNewStudent({...newStudent, Last_Initial: e.target.value})} 
                      placeholder="e.g. D"
                      className="rounded-none border-goa-stone-light focus-visible:ring-goa-sky"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade-level" className="font-bold text-[10px] uppercase tracking-widest text-goa-sky-text">Grade Level</Label>
                  <Input 
                    id="grade-level"
                    required 
                    placeholder="e.g. Gr.6" 
                    value={newStudent.Grade_Level} 
                    onChange={e => setNewStudent({...newStudent, Grade_Level: e.target.value})} 
                    className="rounded-none border-goa-stone-light focus-visible:ring-goa-sky"
                  />
                </div>
                <Button type="submit" className="w-full bg-goa-sky hover:bg-goa-sky/90 text-white font-bold uppercase tracking-widest py-6 rounded-none shadow-md">Save Student Record</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div>
            <input 
              type="file" 
              id="csv-upload" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
              aria-label="Upload student roster CSV file"
            />
            <Label 
              htmlFor="csv-upload" 
              className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-goa-prairie text-goa-stone-dark hover:bg-goa-prairie/90 h-11 px-6 py-2 border border-goa-stone-light shadow-sm uppercase tracking-widest"
              title="Upload a CSV file to import multiple students at once"
            >
              <Upload className="w-5 h-5 mr-2" aria-hidden="true" /> Import CSV
            </Label>
          </div>
        </div>
      </div>

      <div className="border rounded-none bg-white overflow-hidden shadow-sm overflow-x-auto">
        <Table aria-label="Student Roster Table" className="min-w-[800px]">
          <TableHeader className="bg-goa-stone-light/20 border-b-2 border-goa-sky/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">Student ID</TableHead>
              <TableHead className="text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">Full Name</TableHead>
              <TableHead className="text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">Grade</TableHead>
              <TableHead className="text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">Last Observation</TableHead>
              <TableHead className="text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">IPP Status</TableHead>
              <TableHead className="text-right text-goa-sky-text font-bold uppercase text-[10px] tracking-widest py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-goa-stone-mid">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-10" aria-hidden="true" />
                  <p className="text-xl font-bold text-goa-sky/40">No students currently in roster.</p>
                  <p className="text-sm mt-1">Add a student or import a CSV to get started with IPP management.</p>
                </TableCell>
              </TableRow>
            ) : (
              students.map(s => (
                <TableRow key={s.Student_ID} className="hover:bg-goa-stone-light/5 transition-colors border-b border-goa-stone-light/30">
                  <TableCell className="font-mono text-xs font-bold text-goa-sky/70">{s.Student_ID}</TableCell>
                  <TableCell className="font-bold text-base text-goa-stone-dark">{s.First_Name} {s.Last_Initial}.</TableCell>
                  <TableCell className="text-sm font-medium text-goa-stone-mid">{s.Grade_Level}</TableCell>
                  <TableCell>
                    {(() => {
                      const status = getObservationStatus(s.Last_Observation_Date);
                      return (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                          status.className
                        )}>
                          <Calendar className="w-3 h-3" />
                          {status.label}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-none border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-goa-sky/10 bg-goa-sky/5 text-goa-sky-text">
                      {s.Transition_Plan_Status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-goa-sky-text font-bold hover:bg-goa-sky/5 rounded-none uppercase text-[10px] tracking-widest" asChild nativeButton={false}>
                      <Link to={`/student/${s.Student_ID}`} aria-label={`View Individual Program Plan for ${s.First_Name} ${s.Last_Initial}.`}>
                        View IPP
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
