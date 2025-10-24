"use client";

export default function CrashPage() {
  // This will crashes the page
  throw new Error("Forced crash: Component encountered a critical issue.");
}
