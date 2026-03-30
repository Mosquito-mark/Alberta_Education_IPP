import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileText, ExternalLink, Sparkles } from "lucide-react";
import { Observation } from "@/types";

interface ObservationHistoryProps {
  logs: Observation[];
}

export function ObservationHistory({ logs }: ObservationHistoryProps) {
  return (
    <Card className="rounded-none border-l-8 border-l-goa-sky shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary tracking-tight">Observation History</CardTitle>
        <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Strengths-based evidence and UDL accommodations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-none bg-muted/10 font-medium" role="status" aria-label="No observations logged">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden="true" />
            No observations logged yet for this student.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.Log_ID} className="border-l-4 border-goa-sky/30 pl-4 py-2 space-y-3 bg-muted/20 rounded-none">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(log.Timestamp).toLocaleString()}
                  </span>
                  {log.Core_Subject_Area && (
                    <span className="mt-1.5 inline-flex items-center rounded-none border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary w-fit">
                      {log.Core_Subject_Area}
                    </span>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest gap-1.5 text-primary border-primary/20 hover:bg-primary/5 rounded-none" aria-label={`View detailed record for observation on ${new Date(log.Timestamp).toLocaleDateString()}`}>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" /> Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-none border-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-primary tracking-tight">Observation Detail</DialogTitle>
                      <DialogDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Logged on {new Date(log.Timestamp).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject Area</Label>
                          <div className="font-bold text-primary uppercase text-[10px] tracking-widest">{log.Core_Subject_Area || "N/A"}</div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Outcome Grade</Label>
                          <div className="font-bold text-primary uppercase text-[10px] tracking-widest">{log.Enrolled_Grade_Level || "N/A"}</div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Scrubbed Observation (Strengths-Based)</Label>
                        <div className="p-5 bg-emerald-900/20 border border-emerald-900/30 rounded-none text-sm leading-relaxed italic text-emerald-200 shadow-sm font-medium">
                          "{log.AI_Scrubbed_Observation || "No scrubbed text available."}"
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Raw Dictation</Label>
                        <div className="p-5 bg-muted/30 border border-border rounded-none text-sm text-foreground leading-relaxed font-medium">
                          {log.Raw_Dictation}
                        </div>
                      </div>

                      {log.Recommended_Assistive_Tech && (
                        <div className="space-y-2.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">UDL Accommodation</Label>
                          <div className="p-4 bg-primary/5 border border-primary/10 rounded-none flex items-center gap-4 shadow-sm">
                            <div className="bg-primary/10 p-2.5 rounded-none" aria-hidden="true">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-primary text-sm uppercase tracking-tight">{log.Recommended_Assistive_Tech}</div>
                              <div className="text-xs text-primary font-bold uppercase tracking-widest">{log.UDL_Purpose}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {log.Image_Path && (
                        <div className="space-y-2.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evidence Image</Label>
                          <div className="border border-border rounded-none overflow-hidden bg-muted aspect-video flex items-center justify-center shadow-inner">
                            <img 
                              src={`/${log.Image_Path}`} 
                              alt={`Visual evidence for observation logged on ${new Date(log.Timestamp).toLocaleDateString()}`} 
                              className="max-h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm leading-relaxed text-foreground font-bold">
                {log.AI_Scrubbed_Observation || log.Raw_Dictation}
              </p>
              {log.Recommended_Assistive_Tech && (
                <div className="bg-primary/10 text-primary text-[10px] px-3 py-1.5 rounded-none font-bold uppercase tracking-widest inline-block border border-primary/20 shadow-sm">
                  UDL Tool: {log.Recommended_Assistive_Tech}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
