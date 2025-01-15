"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@platter/ui/components/card";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import { Button } from "@platter/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { toast } from "@platter/ui/components/sonner";
import { AlertTriangle } from "@platter/ui/lib/icons";
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

export function ComplaintPage({
  qrId,
  tableId,
  title,
  description,
  userId,
}: ComplaintPageProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
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
    try {
      await createComplaint(qrId, tableId, content, category, userId);
      toast.success(
        "We've received your complaint and will address it promptly.",
      );
      router.push(`/${qrId}`);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Unable to submit complaint. Please try again.");
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
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-6 pb-6">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-12 text-lg font-medium transition-all hover:shadow-lg"
          >
            Submit Complaint
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
