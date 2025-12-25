"use client";

import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import createEmotionCache from "@/lib/emotionCache";
import { useState } from "react";

export default function EmotionRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cache] = useState(() => {
        const cache = createEmotionCache();
        cache.compat = true;
        return cache;
    });

    useServerInsertedHTML(() => (
        <style
            data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(" "),
            }}
        />
    ));

    return <CacheProvider value={cache}>{children}</CacheProvider>;
}
