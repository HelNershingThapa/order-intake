"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface SubmitSectionProps {
  loading: boolean;
  response: { id: string; apiKey: string } | null;
  onSubmit: () => void;
}

export default function SubmitSection({
  loading,
  response,
  onSubmit,
}: SubmitSectionProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Vendor"}
      </Button>

      {response && (
        <Card className="bg-green-50 border border-green-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-700 text-lg">
              Vendor Created Successfully 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Vendor ID:</span> {response.id}
            </p>
            <p>
              <span className="font-semibold">API Key:</span> {response.apiKey}
            </p>
            <p className="text-gray-600 text-xs">
              Use this API key to authenticate vendor requests.
            </p>
            <Link href="/vendor" className="mt-2 w-full">
              <Button variant="outline" size="sm" className="w-full">
                Login as Vendor
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
