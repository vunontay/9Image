export const formatNumber = (value: number): string => {
    const formatter = Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 2,
    });
    return formatter.format(value);
};
