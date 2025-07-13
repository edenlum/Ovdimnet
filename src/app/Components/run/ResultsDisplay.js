import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsDisplay({ currentRun, selectedProcess, onDownload, isRunning }) {
  if (!currentRun && !isRunning) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No Results Yet</h3>
          <p className="text-slate-600">Results will appear here after running a process</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="w-5 h-5 text-blue-600" />
          Process Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRunning || currentRun?.status === "running" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Processing...</h3>
            <p className="text-slate-600">Your process is being executed</p>
          </motion.div>
        ) : currentRun?.status === "completed" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-semibold text-emerald-900">Process Completed</h4>
                  <p className="text-sm text-emerald-600">
                    Executed in {currentRun.execution_time?.toFixed(2)}s
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>
            </div>

            {/* Output Preview */}
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-900">Output Preview</h5>
              <div className="p-4 bg-slate-50 rounded-lg border max-h-64 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                  {currentRun.output_content?.substring(0, 1000)}
                  {currentRun.output_content?.length > 1000 && "..."}
                </pre>
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() => onDownload(currentRun)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {selectedProcess?.output_file_type.toUpperCase()} Result
            </Button>
          </motion.div>
        ) : currentRun?.status === "failed" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Process Failed</h3>
            <p className="text-slate-600">{currentRun.error_message || "An error occurred"}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}