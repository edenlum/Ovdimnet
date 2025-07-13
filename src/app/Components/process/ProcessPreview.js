import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProcessPreview({ formData, generatedRules, isGenerating }) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-fit sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Eye className="w-5 h-5 text-blue-600" />
          Process Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Overview */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Overview</h4>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-1">
              {formData.name || "Process Name"}
            </h5>
            <p className="text-sm text-slate-600">
              {formData.description || "Process description will appear here..."}
            </p>
          </div>
        </div>

        {/* File Flow */}
        {formData.input_file_type && formData.output_file_type && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">File Flow</h4>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {formData.input_file_type.toUpperCase()} Input
              </Badge>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {formData.output_file_type.toUpperCase()} Output
              </Badge>
            </div>
          </div>
        )}

        {/* Training Materials */}
        {formData.training_files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Training Materials</h4>
            <div className="space-y-2">
              {formData.training_files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Rules */}
        <AnimatePresence>
          {(generatedRules || isGenerating) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                Generated Rules
                {isGenerating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                )}
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg max-h-64 overflow-y-auto">
                {isGenerating ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                  </div>
                ) : (
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                    {generatedRules}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <Badge 
              variant={generatedRules ? "default" : "secondary"}
              className={generatedRules ? "bg-emerald-100 text-emerald-800" : ""}
            >
              {isGenerating ? "Generating..." : generatedRules ? "Ready" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}