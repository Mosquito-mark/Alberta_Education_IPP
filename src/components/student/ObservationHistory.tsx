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
    <Card>
      <CardHeader>
        <CardTitle>Observation History</CardTitle>
        <CardDescription>Strengths-based evidence and UDL accommodations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
            No observations logged yet.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.Log_ID} className="border-l-2 border-primary pl-4 py-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(log.Timestamp).toLocaleString()}
                  </span>
                  {log.Core_Subject_Area && (
                    <span className="mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-neutral-100 w-fit">
                      {log.Core_Subject_Area}
                    </span>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger render={<Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/5"><ExternalLink className="w-3 h-3" /> View Details</Button>} />
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Observation Detail</DialogTitle>
                      <DialogDescription>
                        Logged on {new Date(log.Timestamp).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject Area</Label>
                          <div className="font-medium">{log.Core_Subject_Area || "N/A"}</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Outcome Grade</Label>
                          <div className="font-medium">{log.Enrolled_Grade_Level || "N/A"}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AI Scrubbed Observation (Strengths-Based)</Label>
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg text-sm leading-relaxed italic">
                          "{log.AI_Scrubbed_Observation || "No scrubbed text available."}"
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Raw Dictation</Label>
                        <div className="p-4 bg-neutral-50 border rounded-lg text-sm text-muted-foreground">
                          {log.Raw_Dictation}
                        </div>
                      </div>

                      {log.Recommended_Assistive_Tech && (
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">UDL Accommodation</Label>
                          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-indigo-900 text-sm">{log.Recommended_Assistive_Tech}</div>
                              <div className="text-xs text-indigo-700">{log.UDL_Purpose}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {log.Image_Path && (
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Evidence Image</Label>
                          <div className="border rounded-lg overflow-hidden bg-neutral-100 aspect-video flex items-center justify-center">
                            <img 
                              src={`/${log.Image_Path}`} 
                              alt="Observation evidence" 
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
              <p className="text-sm leading-relaxed">
                {log.AI_Scrubbed_Observation || log.Raw_Dictation}
              </p>
              {log.Recommended_Assistive_Tech && (
                <div className="bg-indigo-50 text-indigo-700 text-xs px-3 py-2 rounded-md font-medium inline-block">
                  UDL Tool: {log.Recommended_Assistive_Tech} ({log.UDL_Purpose})
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
