import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, RefreshCw } from "lucide-react";

export default function FeedbackPanel({ feedback, onFeedbackChange, onImprove, isUpdating }) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          AI Improvement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-3">
            Describe what went wrong or what should be improved:
          </p>
          <Textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="The process failed because... Please notice that..."
            className="h-32"
          />
        </div>
        
        <Button
          onClick={onImprove}
          disabled={isUpdating || !feedback.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Improving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Improve with AI
            </div>
          )}
        </Button>
        
        <p className="text-xs text-slate-500">
          AI will analyze your feedback and automatically update the process rules.
        </p>
      </CardContent>
    </Card>
  );
}