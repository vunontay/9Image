"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface ISuccessDisplayProps {
    message: string | null;
    title?: string;
}

const SuccessDisplay = ({
    message,
    title = "Success",
}: ISuccessDisplayProps) => {
    if (!message) return null;

    return (
        <Alert className="bg-green-50 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="font-bold text-green-700">
                {title}
            </AlertTitle>
            <AlertDescription className="text-green-600">
                {message}
            </AlertDescription>
        </Alert>
    );
};

SuccessDisplay.displayName = "SuccessDisplay";
export { SuccessDisplay };
