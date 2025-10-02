import { useState, useEffect } from "react";

export function useSafeArea() {
    const tg = window.Telegram?.WebApp;
    const viewport = tg?.viewport;

    const [insets, setInsets] = useState({
        top: viewport?.contentSafeAreaInsetTop?.() || 0,
        bottom: viewport?.contentSafeAreaInsetBottom?.() || 0,
        left: viewport?.contentSafeAreaInsetLeft?.() || 0,
        right: viewport?.contentSafeAreaInsetRight?.() || 0,
    });

    useEffect(() => {
        if (!viewport) return;

        // подписка на событие content_safe_area_changed
        const listener = () => {
            setInsets({
                top: viewport.contentSafeAreaInsetTop(),
                bottom: viewport.contentSafeAreaInsetBottom(),
                left: viewport.contentSafeAreaInsetLeft(),
                right: viewport.contentSafeAreaInsetRight(),
            });
        };

        viewport.onEvent("content_safe_area_changed", listener);
        return () => viewport.offEvent("content_safe_area_changed", listener);
    }, [viewport]);

    return insets;
}
