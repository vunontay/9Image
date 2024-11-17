"use client";

interface ITitle {
    className?: string;
    title: string;
    as?: "h1" | "h2" | "h3" | "p";
}

const Text = ({ className = "", title, as = "p" }: ITitle) => {
    const Component = as;
    return <Component className={className}>{title}</Component>;
};

const H1 = (props: Omit<ITitle, "as">) => <Text {...props} as="h1" />;
const H2 = (props: Omit<ITitle, "as">) => <Text {...props} as="h2" />;
const H3 = (props: Omit<ITitle, "as">) => <Text {...props} as="h3" />;
const P = (props: Omit<ITitle, "as">) => <Text {...props} as="p" />;

H1.displayName = "H1";
H2.displayName = "H2";
H3.displayName = "H3";
P.displayName = "P";

export { H1, H2, H3, P, Text };
