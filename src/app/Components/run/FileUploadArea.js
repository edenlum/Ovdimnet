import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export default function FileUploadArea({ expectedType, inputFile, onFileUpload, onRemoveFile }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === expectedType;
    });

    if (droppedFiles.length > 0) {
      onFileUpload(droppedFiles);
    }
  }, [expectedType, onFileUpload]);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === expectedType;
    });

    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload Input File
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inputFile ? (
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">{inputFile.name}</p>
                <p className="text-sm text-emerald-600">Ready to process</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemoveFile}
              className="text-emerald-600 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={`.${expectedType}`}
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              
              <h4 className="font-semibold text-slate-900 mb-2">
                Upload {expectedType.toUpperCase()} File
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Drag & drop your input file here
              </p>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseClick}
              >
                Browse Files
              </Button>
              
              <p className="text-xs text-slate-400 mt-3">
                Only {expectedType.toUpperCase()} files are supported
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}