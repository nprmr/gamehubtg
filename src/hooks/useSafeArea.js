import { useState, useEffect } from "react";
import { viewport } from "@telegram-apps/sdk";

export function useSafeArea() {
    const [insets, setInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    useEffect(() => {
        // если нет Telegram Mini App — выходим
        if (!viewport || !viewport.safeAreaInsetTop) return;

        try {
            // bindCssVars доступен только внутри Telegram
            if (viewport.bindCssVars) {
                viewport.bindCssVars();
            }
        } catch (e) {
            console.warn("viewport.bindCssVars недоступен:", e.message);
        }

        const updateInsets = () => {
            setInsets({
                top: viewport.safeAreaInsetTop?.() || 0,
                bottom: viewport.safeAreaInsetBottom?.() || 0,
                left: viewport.safeAreaInsetLeft?.() || 0,
                right: viewport.safeAreaInsetRight?.() || 0,
            });
        };

        updateInsets();

        viewport.on?.("change:safeAreaInsets", updateInsets);
        return () => viewport.off?.("change:safeAreaInsets", updateInsets);
    }, []);

    return insets;
}
