"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className={`pr-10 ${className}`}
                ref={ref}
                {...props}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? (
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                )}
            </Button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
