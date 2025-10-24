"use client";
import { useEffect } from "react";

export default function CrashPage() {
  useEffect(() => {
    throw new Error("Forced crash: Component encountered a critical issue.");
  }, []);

  return <div>Crash test</div>;
}
