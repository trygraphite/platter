import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@platter/ui/components/dialog";
import { Button } from "@platter/ui/components/button";
import { Textarea } from "@platter/ui/components/textarea";
// import { createReview } from "@/actions/create-review";
import { toast } from "@platter/ui/components/sonner";
import { Star } from "@platter/ui/lib/icons";
import { createReview } from "@/app/actions/create-review";
// import { useRouter } from 'next/router';
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrId: string;
  tableId: string;
  userId: string;
}

export function ReviewModal({ isOpen, onClose, qrId, tableId, userId }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter()
  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide both a rating and a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(userId, qrId, tableId, rating, comment);
      onClose();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            We'd love to hear about your experience. Please leave a rating and a
            comment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
