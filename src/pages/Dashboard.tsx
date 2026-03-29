import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Plus, Users, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl border shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Roster Management</h1>
          <p className="text-muted-foreground text-lg">Division 2 Classroom • Edmonton Public Schools District</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={handleExportCSV} disabled={isExporting || students.length === 0} className="border-primary text-primary hover:bg-primary/5">
            {isExporting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
            Bulk Export
          </Button>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5"><Plus className="w-5 h-5 mr-2" /> Add Student</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input required value={newStudent.Student_ID} onChange={e => setNewStudent({...newStudent, Student_ID: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input required value={newStudent.First_Name} onChange={e => setNewStudent({...newStudent, First_Name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Initial</Label>
                    <Input required maxLength={1} value={newStudent.Last_Initial} onChange={e => setNewStudent({...newStudent, Last_Initial: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Input required placeholder="Gr.6" value={newStudent.Grade_Level} onChange={e => setNewStudent({...newStudent, Grade_Level: e.target.value})} />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Save Student</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div>
            <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileUpload} />
            <Label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-primary font-bold hover:bg-secondary/90 h-11 px-6 py-2">
              <Upload className="w-5 h-5 mr-2" /> Import CSV
            </Label>
          </div>
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-primary font-bold uppercase text-xs tracking-wider">Student ID</TableHead>
              <TableHead className="text-primary font-bold uppercase text-xs tracking-wider">Name</TableHead>
              <TableHead className="text-primary font-bold uppercase text-xs tracking-wider">Grade</TableHead>
              <TableHead className="text-primary font-bold uppercase text-xs tracking-wider">Status</TableHead>
              <TableHead className="text-right text-primary font-bold uppercase text-xs tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No students found. Add one or import a CSV.
                </TableCell>
              </TableRow>
            ) : (
              students.map(s => (
                <TableRow key={s.Student_ID}>
                  <TableCell className="font-mono text-xs">{s.Student_ID}</TableCell>
                  <TableCell className="font-medium">{s.First_Name} {s.Last_Initial}.</TableCell>
                  <TableCell>{s.Grade_Level}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {s.Transition_Plan_Status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" render={<Link to={`/student/${s.Student_ID}`} />}>
                      View IPP
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
