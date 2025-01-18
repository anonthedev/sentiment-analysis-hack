import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

export function ReviewList({ reviews, product_id }: any) {
  console.log(reviews)
  return (
    <div className="py-6 grid grid-cols-2 gap-4 items-center">
      {reviews[0].objects.map((review: any) => (
        <Link 
          className="max-w-prose transition-transform duration-200 hover:scale-102" 
          key={review.review_id} 
          href={`/reviews/${product_id}/${review.review_id}`}
        >
          <Card className="hover:shadow-lg transition-all duration-200 hover:bg-muted/50 border-2">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-4">
                  <p
                    className="text-lg font-medium leading-relaxed text-foreground/90 line-clamp-3"
                    title={review.review}
                  >
                    {review.review}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      {review.review_by}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            {/* <CardContent className="pt-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <p className="text-sm">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>
            </CardContent> */}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default ReviewList;