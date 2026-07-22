import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "404 — Page not found"
};

export default function NotFound() {
  return (
    <div className="container">
      <div className="rm-error">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>
          This page doesn't exist (or was moved). Check the URL or head back
          to the homepage.
        </p>
        <div className="rm-error-actions">
          <Button href="/">Home</Button>
          <Button href="/leaderboards" variant="secondary">Leaderboards</Button>
        </div>
      </div>
    </div>
  );
}
