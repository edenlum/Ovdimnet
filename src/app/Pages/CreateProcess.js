
import React, { useState } from "react";
import { Process } from "@/entities/Process";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, FileText, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

import FileUploadZone from "../Components/process/FileUploadZone.js";
import ProcessPreview from "../Components/process/ProcessPreview.js";

export default function CreateProcess() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    input_file_type: "",
    output_file_type: "",
    training_files: [],
    example_input_url: "",
    example_output_url: ""
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("uploading");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generatedRules, setGeneratedRules] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleFileUpload = async (files, type) => {
    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      
      if (type === "training") {
        setFormData(prev => ({
          ...prev,
          training_files: [
            ...prev.training_files,
            ...results.map((result, index) => ({
              name: files[index].name,
              url: result.file_url,
              type: files[index].type
            }))
          ]
        }));
      } else if (type === "example_input") {
        setFormData(prev => ({
          ...prev,
          example_input_url: results[0].file_url
        }));
      } else if (type === "example_output") {
        setFormData(prev => ({
          ...prev,
          example_output_url: results[0].file_url
        }));
      }
    } catch (error) {
      setError("Failed to upload files. Please try again.");
    }
  };

  const removeTrainingFile = (index) => {
    setFormData(prev => ({
      ...prev,
      training_files: prev.training_files.filter((_, i) => i !== index)
    }));
  };

  const generateRules = async () => {
    setIsCreating(true);
    setProgress(0);
    setError(null);
    setCurrentStep("uploading");

    try {
      // Step 1: Validate inputs
      setProgress(10);
      if (!formData.name || !formData.description || !formData.input_file_type || !formData.output_file_type) {
        throw new Error("Please fill in all required fields");
      }
      setProgress(20);

      // Step 2: Fetch training file contents
      setCurrentStep("analyzing");
      let trainingContent = "";
      if (formData.training_files.length > 0) {
        const contentPromises = formData.training_files.map(async (file) => {
          const fileResponse = await fetch(file.url);
          if (!fileResponse.ok) {
              throw new Error(`Failed to fetch training file: ${file.name}`);
          }
          const content = await fileResponse.text();
          return `\n\n--- Training File: ${file.name} ---\n${content}\n--- End of Training File: ${file.name} ---`;
        });
        const contents = await Promise.all(contentPromises);
        trainingContent = contents.join("");
      }
      setProgress(50);
      
      // Step 3: Generate rules using AI
      setCurrentStep("generating");
      const prompt = `
        Create detailed automation rules for the following process:
        
        Process Name: ${formData.name}
        Description: ${formData.description}
        Input Format: ${formData.input_file_type}
        Output Format: ${formData.output_file_type}
        
        Here is the content of the training materials:
        ${trainingContent}
        
        Please analyze the training materials and create step-by-step rules that can be used to automate this process. 
        The rules should be detailed enough that an AI system can follow them to process ${formData.input_file_type} files and generate ${formData.output_file_type} outputs.
        
        Format the response as a comprehensive rule set with:
        1. Input validation steps
        2. Processing logic
        3. Output formatting requirements
        4. Error handling procedures
        5. Quality checks
        
        Make the rules specific to the process described in the training materials.
      `;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });
      setProgress(80);
      setGeneratedRules(response);
      
      // Step 4: Save the process
      setCurrentStep("saving");
      const processData = {
        ...formData,
        rules: response,
        status: "ready"
      };

      await Process.create(processData);
      
      setProgress(100);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          input_file_type: "",
          output_file_type: "",
          training_files: [],
          example_input_url: "",
          example_output_url: ""
        });
        setGeneratedRules("");
        setSuccess(false);
        setProgress(0);
      }, 3000);

    } catch (error) {
      setError(error.message || "Failed to create process. Please try again.");
    }
    
    setIsCreating(false);
  };

  const stepMessages = {
    uploading: "Preparing files...",
    analyzing: "Analyzing training materials...",
    generating: "Generating automation rules...",
    saving: "Saving your process..."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Create New Process</h1>
          <p className="text-slate-600 text-lg">Design an intelligent automation for your workflow</p>
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
              Process created successfully! You can now run it from the "Run Process" page.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Process Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-semibold">Process Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., VISA Verification Process"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this process does and how it should work..."
                    className="mt-1 h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Input Format</Label>
                    <Select
                      value={formData.input_file_type}
                      onValueChange={(value) => handleInputChange('input_file_type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="txt">TXT</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">Output Format</Label>
                    <Select
                      value={formData.output_file_type}
                      onValueChange={(value) => handleInputChange('output_file_type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="txt">TXT</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Uploads */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Training Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploadZone
                  title="Process Documentation"
                  description="Upload files that explain how to perform this process"
                  onFileUpload={(files) => handleFileUpload(files, "training")}
                  multiple={true}
                  files={formData.training_files}
                  onRemoveFile={removeTrainingFile}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadZone
                    title="Example Input"
                    description="Sample input file"
                    onFileUpload={(files) => handleFileUpload(files, "example_input")}
                    multiple={false}
                    acceptedTypes={[formData.input_file_type].filter(Boolean)}
                    hasFile={!!formData.example_input_url}
                  />
                  
                  <FileUploadZone
                    title="Example Output"
                    description="Expected output file"
                    onFileUpload={(files) => handleFileUpload(files, "example_output")}
                    multiple={false}
                    acceptedTypes={[formData.output_file_type].filter(Boolean)}
                    hasFile={!!formData.example_output_url}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <Button
                  onClick={generateRules}
                  disabled={isCreating}
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 h-14 text-lg font-semibold"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700" />
                      {stepMessages[currentStep]}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6" />
                      Generate AI Process Rules
                    </div>
                  )}
                </Button>
                
                {isCreating && (
                  <div className="mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-blue-100 text-sm mt-2 text-center">
                      {progress}% complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div>
            <ProcessPreview 
              formData={formData}
              generatedRules={generatedRules}
              isGenerating={isCreating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
