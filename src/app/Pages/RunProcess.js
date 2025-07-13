
import React, { useState, useEffect } from "react";
import { Process } from "@/entities/Process";
import { ProcessRun } from "@/entities/ProcessRun";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Play, Download, FileText, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProcessSelector from "../Components/run/ProcessSelector.js";
import FileUploadArea from "../Components/run/FileUploadArea.js";
import ResultsDisplay from "../Components/run/ResultsDisplay.js";

export default function RunProcess() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [inputFile, setInputFile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRun, setCurrentRun] = useState(null);
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProcesses();
    loadRuns();
  }, []);

  const loadProcesses = async () => {
    const data = await Process.filter({ status: "ready" }, "-created_date");
    setProcesses(data);
  };

  const loadRuns = async () => {
    const data = await ProcessRun.list("-created_date", 10);
    setRuns(data);
  };

  const handleFileUpload = async (files) => {
    try {
      const file = files[0];
      const { file_url } = await UploadFile({ file });
      setInputFile({ name: file.name, url: file_url, type: file.type });
      setError(null);
    } catch (error) {
      setError("Failed to upload file. Please try again.");
    }
  };

  const runProcess = async () => {
    if (!selectedProcess || !inputFile) return;

    setIsRunning(true);
    setProgress(0);
    setError(null);

    try {
      // Create run record
      const runData = {
        process_id: selectedProcess.id,
        input_file_url: inputFile.url,
        status: "running"
      };
      
      const newRun = await ProcessRun.create(runData);
      setCurrentRun(newRun);
      
      // Fetch input file content
      setProgress(25);
      const fileResponse = await fetch(inputFile.url);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch input file: ${fileResponse.statusText}`);
      }
      const fileContent = await fileResponse.text();
      setProgress(40);

      // Execute process using AI
      const prompt = `
        Execute the following process rules on the provided input data:
        
        Process: ${selectedProcess.name}
        Rules: ${selectedProcess.rules}
        
        Input file format: ${selectedProcess.input_file_type}
        Expected output format: ${selectedProcess.output_file_type}

        --- INPUT DATA ---
        ${fileContent}
        --- END OF INPUT DATA ---
        
        Please process the input data according to the rules and generate the output in the specified format.
        Return only the processed output content, properly formatted as ${selectedProcess.output_file_type}.
      `;

      setProgress(50);

      const startTime = Date.now();
      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      const executionTime = (Date.now() - startTime) / 1000;
      setProgress(75);

      // Create output file
      const outputBlob = new Blob([result], { 
        type: selectedProcess.output_file_type === 'json' ? 'application/json' : 'text/plain'
      });
      const outputFile = new File([outputBlob], `processed_${inputFile.name}`, {
        type: outputBlob.type
      });

      const { file_url: outputUrl } = await UploadFile({ file: outputFile });
      setProgress(90);

      // Update run with results
      await ProcessRun.update(newRun.id, {
        output_file_url: outputUrl,
        output_content: result,
        status: "completed",
        execution_time: executionTime
      });

      setProgress(100);
      setCurrentRun({
        ...newRun,
        output_file_url: outputUrl,
        output_content: result,
        status: "completed",
        execution_time: executionTime
      });

      // Refresh runs list
      loadRuns();

    } catch (error) {
      setError("Failed to execute process. Please try again.");
      if (currentRun) {
        await ProcessRun.update(currentRun.id, {
          status: "failed",
          error_message: error.message
        });
      }
    }
    
    setIsRunning(false);
  };

  const downloadResult = (run) => {
    if (!run.output_content) return;

    const blob = new Blob([run.output_content], { 
      type: selectedProcess?.output_file_type === 'json' ? 'application/json' : 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `result_${Date.now()}.${selectedProcess?.output_file_type || 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Run Process</h1>
          <p className="text-slate-600 text-lg">Execute your automated processes with intelligent AI</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Process Execution */}
          <div className="space-y-6">
            <ProcessSelector
              processes={processes}
              selectedProcess={selectedProcess}
              onSelectProcess={setSelectedProcess}
            />

            {selectedProcess && (
              <FileUploadArea
                expectedType={selectedProcess.input_file_type}
                inputFile={inputFile}
                onFileUpload={handleFileUpload}
                onRemoveFile={() => setInputFile(null)}
              />
            )}

            {selectedProcess && inputFile && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <Button
                    onClick={runProcess}
                    disabled={isRunning}
                    className="w-full bg-white text-emerald-700 hover:bg-emerald-50 h-14 text-lg font-semibold"
                  >
                    {isRunning ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-700" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Play className="w-6 h-6" />
                        Execute Process
                      </div>
                    )}
                  </Button>
                  
                  {isRunning && (
                    <div className="mt-4">
                      <Progress value={progress} className="h-2" />
                      <p className="text-emerald-100 text-sm mt-2 text-center">
                        {progress}% complete
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results & History */}
          <div className="space-y-6">
            <ResultsDisplay
              currentRun={currentRun}
              selectedProcess={selectedProcess}
              onDownload={downloadResult}
              isRunning={isRunning}
            />

            {/* Recent Runs */}
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
                    runs.slice(0, 5).map((run, index) => {
                      const process = processes.find(p => p.id === run.process_id);
                      return (
                        <motion.div
                          key={run.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            {run.status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : run.status === "failed" ? (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                            )}
                            <div>
                              <p className="font-medium text-sm text-slate-900">
                                {process?.name || "Unknown Process"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(run.created_date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {run.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadResult(run)}
                              className="h-8 w-8"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-center py-4">No runs yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
