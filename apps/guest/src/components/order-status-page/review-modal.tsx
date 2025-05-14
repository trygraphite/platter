// components/order/review-modal.tsx
"use client";

import { useState } from "react";
import { Star } from "@platter/ui/lib/icons";
import { Button } from "@platter/ui/components/button";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@platter/ui/components/dialog";
import { toast } from "@platter/ui/components/sonner";
import { orderReview } from "@/app/actions/order-review";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrId: string;
  tableId: string;
  userId: string;
  orderId: string;
}

export function ReviewModal({ isOpen, onClose, qrId, tableId, userId, orderId }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the server action to create the review
      const result = await orderReview(
        userId,
        qrId,
        tableId,
        rating,
        comment
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit review');
      }
      
      toast.success("Review submitted", {
        description: "Thank you for your feedback!",
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Error", {
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSkip = () => {
    // Simply close the modal when user skips
    onClose();
  };
  
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={starValue}
          type="button"
          onClick={() => setRating(starValue)}
          className={`text-xl focus:outline-none ${
            starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          aria-label={`Rate ${starValue} stars`}
        >
          <Star className={`h-8 w-8 ${starValue <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'}`} />
        </button>
      );
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md px-4">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">How was your meal?</DialogTitle>
        </DialogHeader>
        <div className="pt-1 pb-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex justify-center space-x-1">
                {renderStars()}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Leave a comment (optional)</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Tell us about your experience..."
                  className="min-h-[100px]"
                  value={comment}
                  onChange={handleCommentChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}