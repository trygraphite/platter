
import { Button } from "@platter/ui/components/button";
import { ExternalLink, ForkKnifeCrossedIcon, Info } from "@platter/ui/lib/icons";
import Link from "next/link";
interface ActionButtonsProps {
    reviewLink: string;
    }
export function ActionButtons({ reviewLink }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Link href="/menu">
        <Button variant="outline" size="lg" className="gap-2">
          <ForkKnifeCrossedIcon className="w-5 h-5" />
         View Menu
        </Button>
      </Link>
      <Link href="/about">
        <Button variant="secondary" size="lg" className="gap-2">
          <Info className="w-5 h-5" />
          How It Works
        </Button>
      </Link>
      {reviewLink && (
      <Link href={reviewLink} target="_blank">
        <Button size="lg" className="gap-2">
          <ExternalLink className="w-5 h-5" />
          Leave a Review
        </Button>
      </Link>
      )}
    </div>
  );
}
