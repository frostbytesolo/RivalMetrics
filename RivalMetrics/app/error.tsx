"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RivalMetrics] Unhandled error:", error);
  }, [error]);

  return (
    <div className="container">
      <div className="rm-error">
        <h1>500</h1>
        <h2>Something went wrong</h2>
        <p>
          An unexpected error occurred. Our team has been notified.
          Try reloading the page.
        </p>
        <div className="rm-error-actions">
          <Button onClick={() => reset()}>Try again</Button>
          <Button href="/" variant="secondary">Go home</Button>
        </div>
      </div>
    </div>
  );
}
