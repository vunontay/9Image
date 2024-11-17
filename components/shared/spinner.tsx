import React from "react";

interface ISpinnerProps {
    size?: "small" | "medium" | "large";
    color?: string;
}

const Spinner: React.FC<ISpinnerProps> = ({
    size = "medium",
    color = "text-blue-500",
}) => {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12",
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} ${color} animate-spin rounded-full border-t-2 border-b-2  border-current`}
            />
        </div>
    );
};

Spinner.displayName = "Spinner";
export { Spinner };
