import { useEffect, useState } from "react";

export default function useDotLoader(active: boolean, maxDots = 3, intervalMs = 400) {
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setDotCount((prev) => (prev < maxDots ? prev + 1 : 1));
        }, intervalMs);

        return () => clearInterval(interval);
    }, [active, maxDots, intervalMs]);

    return ".".repeat(dotCount);
}
