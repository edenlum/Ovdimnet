import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export default function FileUploadZone({ 
  title, 
  description, 
  onFileUpload, 
  multiple = true,
  acceptedTypes = ["csv", "txt", "json", "pdf"],
  files = [],
  onRemoveFile,
  hasFile = false
}) {
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
      return acceptedTypes.includes(extension);
    });

    if (droppedFiles.length > 0) {
      onFileUpload(droppedFiles);
    }
  }, [acceptedTypes, onFileUpload]);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive 
            ? "border-blue-400 bg-blue-50" 
            : hasFile || files.length > 0
            ? "border-emerald-300 bg-emerald-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.map(type => `.${type}`).join(",")}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="text-center">
          {hasFile || files.length > 0 ? (
            <div className="flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          ) : (
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-slate-600" />
            </div>
          )}
          
          <p className="text-sm text-slate-600 mb-3">
            {hasFile || files.length > 0 
              ? `${files.length || 1} file(s) uploaded` 
              : "Drag & drop files here"
            }
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleBrowseClick}
            className="text-sm"
          >
            {hasFile || files.length > 0 ? "Change Files" : "Browse Files"}
          </Button>
          
          <p className="text-xs text-slate-400 mt-2">
            Supported: {acceptedTypes.join(", ").toUpperCase()}
          </p>
        </div>
      </div>

      {/* Training Files List */}
      {files.length > 0 && onRemoveFile && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(index)}
                className="h-6 w-6 text-slate-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}