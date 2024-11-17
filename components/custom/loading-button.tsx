"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ILoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
}

const LoadingButton = ({
    children,
    isLoading = false,
    loadingText = "Loading...",
    disabled,
    ...props
}: ILoadingButtonProps) => {
    return (
        <Button disabled={isLoading || disabled} {...props}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </Button>
    );
};

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
