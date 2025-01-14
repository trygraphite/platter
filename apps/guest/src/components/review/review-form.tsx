"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@platter/ui/components/card";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import { Button } from "@platter/ui/components/button";
import { createReview } from "@/app/actions/create-review";
import { toast } from "@platter/ui/components/sonner";
import { Star } from "@platter/ui/lib/icons";

interface ReviewPageProps {
  qrId: string;
  tableId: string;
  title: string;
  description: string;
  userId: string;
}

export function ReviewPage({
  qrId,
  tableId,
  title,
  description,
  userId,
}: ReviewPageProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isHovering, setIsHovering] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createReview(
        userId,
        qrId,
        tableId,
        rating,
        comment,
      );

        console.log("Review submitted:", response);

      toast.success("Thank you for your valuable feedback!");
      router.push(`/${qrId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Unable to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <Card className="w-full max-w-md mx-auto shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-medium">Your Rating</Label>
              <div className="flex items-center justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isSubmitting}
                    onMouseEnter={() => setIsHovering(star)}
                    onMouseLeave={() => setIsHovering(0)}
                    onClick={() => setRating(star)}
                    className="transform transition-all hover:scale-110 focus:outline-none disabled:opacity-50"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (isHovering || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-medium">Your Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                placeholder="Tell us what you loved (or what we could do better)..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-6 pb-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full h-12 text-lg font-medium transition-all hover:shadow-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}