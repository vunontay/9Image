import * as React from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type InputTagsProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
> & {
    value: string[];
    onChange: (newTags: string[]) => void;
    formatTag?: (tag: string) => string;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
    (
        { className, value, onChange, formatTag = (tag) => tag, ...props },
        ref
    ) => {
        const [pendingDataPoint, setPendingDataPoint] = React.useState("");

        React.useEffect(() => {
            if (pendingDataPoint.includes(",")) {
                const newDataPoints = new Set([
                    ...value,
                    ...pendingDataPoint
                        .split(",")
                        .map((chunk) => formatTag(chunk.trim())),
                ]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint("");
            }
        }, [pendingDataPoint, onChange, value, formatTag]);

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([
                    ...value,
                    formatTag(pendingDataPoint),
                ]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint("");
            }
        };

        return (
            <div
                className={cn(
                    "min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white",
                    className
                )}
            >
                {value.map((item, index) => (
                    <Badge key={index} variant="secondary">
                        {item}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-3 w-3"
                            onClick={() => {
                                onChange(value.filter((_, i) => i !== index));
                            }}
                        >
                            <XIcon className="w-3" />
                        </Button>
                    </Badge>
                ))}
                <input
                    {...props}
                    className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                    value={pendingDataPoint}
                    onChange={(e) => setPendingDataPoint(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addPendingDataPoint();
                        } else if (
                            e.key === "Backspace" &&
                            pendingDataPoint.length === 0 &&
                            value.length > 0
                        ) {
                            e.preventDefault();
                            onChange(value.slice(0, -1));
                        }
                    }}
                    ref={ref}
                />
            </div>
        );
    }
);

InputTags.displayName = "InputTags";

export { InputTags };
