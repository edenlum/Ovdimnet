import React, { useState, useEffect } from "react";
import { Process } from "@/entities/Process";
import { ProcessRun } from "@/entities/ProcessRun";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, MessageSquare, Code, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import ProcessEditor from "../components/edit/ProcessEditor";
import FeedbackPanel from "../components/edit/FeedbackPanel";
import ProcessHistory from "../components/edit/ProcessHistory";

export default function EditProcess() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [rules, setRules] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);

  useEffect(() => {
    loadProcesses();
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      setRules(selectedProcess.rules || "");
      loadRecentRuns();
    }
  }, [selectedProcess]);

  const loadProcesses = async () => {
    const data = await Process.list("-updated_date");
    setProcesses(data);
  };

  const loadRecentRuns = async () => {
    if (!selectedProcess) return;
    const runs = await ProcessRun.filter(
      { process_id: selectedProcess.id }, 
      "-created_date", 
      5
    );
    setRecentRuns(runs);
  };

  const handleProcessSelect = (processId) => {
    const process = processes.find(p => p.id === processId);
    setSelectedProcess(process);
    setSuccess(false);
    setError(null);
  };

  const saveRules = async () => {
    if (!selectedProcess) return;

    setIsUpdating(true);
    setError(null);

    try {
      await Process.update(selectedProcess.id, { rules });
      setSuccess(true);
      
      // Update local state
      setSelectedProcess(prev => ({ ...prev, rules }));
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError("Failed to save rules. Please try again.");
    }
    
    setIsUpdating(false);
  };

  const improveMatter = async () => {
    if (!selectedProcess || !feedback.trim()) return;

    setIsUpdating(true);
    setError(null);

    try {
      const prompt = `
        Improve the following process rules based on the user feedback:
        
        Current Rules:
        ${rules}
        
        User Feedback:
        ${feedback}
        
        Please modify the rules to address the feedback and improve the process. 
        Return the complete updated rule set.
        
        Process Context:
        - Name: ${selectedProcess.name}
        - Input: ${selectedProcess.input_file_type}
        - Output: ${selectedProcess.output_file_type}
        - Description: ${selectedProcess.description}
      `;

      const improvedRules = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setRules(improvedRules);
      setFeedback("");
      
      // Auto-save the improved rules
      await Process.update(selectedProcess.id, { rules: improvedRules });
      setSelectedProcess(prev => ({ ...prev, rules: improvedRules }));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      setError("Failed to improve rules. Please try again.");
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Edit & Debug Process</h1>
          <p className="text-slate-600 text-lg">Refine your automation rules and improve performance</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              Process rules updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Process Selection */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="w-5 h-5 text-blue-600" />
              Select Process to Edit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedProcess?.id || ""}
              onValueChange={handleProcessSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a process to edit" />
              </SelectTrigger>
              <SelectContent>
                {processes.map((process) => (
                  <SelectItem key={process.id} value={process.id}>
                    <div className="flex items-center gap-2">
                      <span>{process.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {process.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProcess && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900">{selectedProcess.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{selectedProcess.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {selectedProcess.input_file_type} → {selectedProcess.output_file_type}
                  </Badge>
                  <Badge variant="outline" className={
                    selectedProcess.status === "ready" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }>
                    {selectedProcess.status}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedProcess && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rules Editor */}
            <div className="lg:col-span-2">
              <ProcessEditor
                rules={rules}
                onRulesChange={setRules}
                onSave={saveRules}
                isUpdating={isUpdating}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FeedbackPanel
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onImprove={improveMatter}
                isUpdating={isUpdating}
              />

              <ProcessHistory
                runs={recentRuns}
                selectedProcess={selectedProcess}
              />
            </div>
          </div>
        )}

        {!selectedProcess && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-xl flex items-center justify-center">
                <Code className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Select a Process</h3>
              <p className="text-slate-600">Choose a process from the dropdown above to start editing its rules</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}