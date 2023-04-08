"use client";
import { AuthProvider } from "components/AuthProvider";

export default function ReAuthPage({
  redirectOnAuth,
}: {
  redirectOnAuth?: string | null;
}) {
  return <AuthProvider redirectOnAuth={redirectOnAuth} />;
}
