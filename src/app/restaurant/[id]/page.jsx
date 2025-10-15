import Restaurant from "@/src/components/Restaurant.jsx";
import { Suspense } from "react";
import { getRestaurantById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import ReviewsList, { ReviewsListSkeleton } from "@/src/components/Reviews/ReviewsList";
import { GeminiSummary, GeminiSummarySkeleton } from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

// This is a server component, we can access URL
// parameters via Next.js and download the data
// we need for this page
export default async function Home(props) {
  const params = await props.params;
  const { serverApp, currentUser } = await getAuthenticatedAppForUser();
  const restaurant = await getRestaurantById(getFirestore(serverApp), params.id);

  return (
    <main className="main__restaurant">
      <Restaurant
        id={params.id}
        initialRestaurant={restaurant}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary restaurantId={params.id} />
        </Suspense>
      </Restaurant>
      <Suspense fallback={<ReviewsListSkeleton numReviews={restaurant.numRatings} />}>
        <ReviewsList restaurantId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
};