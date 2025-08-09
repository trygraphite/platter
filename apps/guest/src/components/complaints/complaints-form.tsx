"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Label } from "@platter/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { toast } from "@platter/ui/components/sonner";
import { Textarea } from "@platter/ui/components/textarea";
import { AlertTriangle } from "@platter/ui/lib/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createComplaint } from "@/app/actions/create-complaint";

interface ComplaintPageProps {
  qrId: string;
  tableId: string;
  title: string;
  description: string;
  userId: string;
}

type ComplaintCategory =
  | "FOOD"
  | "SERVICE"
  | "CLEANLINESS"
  | "WAIT_TIME"
  | "ATMOSPHERE"
  | "OTHER";

export const ComplaintPage: React.FC<ComplaintPageProps> = ({
  qrId,
  tableId,
  title,
  description,
  userId,
}) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please describe your concern before submitting");
      return;
    }
    if (!category) {
      toast.error("Please select a category for your complaint");
      return;
    }

    setIsSubmitting(true);

    try {
      await createComplaint(qrId, tableId, content, category, userId);
      toast.success(
        "We've received your complaint and will address it promptly.",
      );
      router.push(`/${qrId}`);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Unable to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <Card className="w-full max-w-md mx-auto shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-medium">
                Complaint Category
              </Label>
              <Select
                value={category}
                onValueChange={(value: ComplaintCategory) => setCategory(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOOD">Food Quality</SelectItem>
                  <SelectItem value="SERVICE">Customer Service</SelectItem>
                  <SelectItem value="CLEANLINESS">Cleanliness</SelectItem>
                  <SelectItem value="WAIT_TIME">Long Wait Times</SelectItem>
                  <SelectItem value="ATMOSPHERE">
                    Restaurant Atmosphere
                  </SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-lg font-medium">
                Describe Your Concern
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Please provide details about the issue you're experiencing..."
                className="min-h-[150px] resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-6 pb-6">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-12 text-lg font-medium transition-all hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Complaint"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
