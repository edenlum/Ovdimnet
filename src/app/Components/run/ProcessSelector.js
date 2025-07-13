import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";

export default function ProcessSelector({ processes, selectedProcess, onSelectProcess }) {
  const handleProcessSelect = (processId) => {
    const process = processes.find(p => p.id === processId);
    onSelectProcess(process);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="w-5 h-5 text-blue-600" />
          Select Process
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedProcess?.id || ""}
          onValueChange={handleProcessSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a process to run" />
          </SelectTrigger>
          <SelectContent>
            {processes.map((process) => (
              <SelectItem key={process.id} value={process.id}>
                <div className="flex items-center gap-2">
                  <span>{process.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {process.input_file_type} → {process.output_file_type}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProcess && (
          <div className="p-4 bg-slate-50 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-slate-900">{selectedProcess.name}</h4>
              <p className="text-sm text-slate-600 mt-1">{selectedProcess.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {selectedProcess.input_file_type.toUpperCase()} Input
              </Badge>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {selectedProcess.output_file_type.toUpperCase()} Output
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}