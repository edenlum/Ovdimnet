import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Play } from "lucide-react";

export default function ProcessHistory({ runs, selectedProcess }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "running":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      default:
        return <Play className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Runs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {runs.length > 0 ? (
            runs.map((run) => (
              <div key={run.id} className="p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(run.status)}
                    <Badge className={getStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </div>
                  {run.execution_time && (
                    <span className="text-xs text-slate-500">
                      {run.execution_time.toFixed(2)}s
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-500">
                  {new Date(run.created_date).toLocaleString()}
                </p>
                
                {run.error_message && (
                  <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
                    {run.error_message}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4 text-sm">
              No runs for this process yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}