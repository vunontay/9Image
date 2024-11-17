import { useEffect, useRef, useState } from "react";

const useInView = () => {
    const [inView, setInView] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver((entries) => {
            setInView(entries[0].isIntersecting);
        });
        if (element) {
            observer.observe(element);
        }
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return { ref, inView, setInView };
};

export default useInView;
