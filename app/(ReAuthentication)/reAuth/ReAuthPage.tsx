"use client";
import { AuthProvider } from "appComponents/AuthProvider";

export default function ReAuthPage({
  redirectOnAuth,
}: {
  redirectOnAuth?: string | null;
}) {
  return <AuthProvider redirectOnAuth={redirectOnAuth} />;
}
