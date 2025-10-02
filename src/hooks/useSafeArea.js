// src/hooks/useSafeArea.js
import { useState, useEffect } from "react";
import { viewport } from "@telegram-apps/sdk";

export function useSafeArea() {
    const getInsets = () => ({
        safe: {
            top: viewport?.safeAreaInsetTop() || 0,
            bottom: viewport?.safeAreaInsetBottom() || 0,
            left: viewport?.safeAreaInsetLeft() || 0,
            right: viewport?.safeAreaInsetRight() || 0,
        },
        content: {
            top: viewport?.contentSafeAreaInsetTop() || 0,
            bottom: viewport?.contentSafeAreaInsetBottom() || 0,
            left: viewport?.contentSafeAreaInsetLeft() || 0,
            right: viewport?.contentSafeAreaInsetRight() || 0,
        },
    });

    const [insets, setInsets] = useState(getInsets);

    useEffect(() => {
        if (!viewport) return;

        // проброс CSS-переменных
        viewport.bindCssVars();

        const updateInsets = () => setInsets(getInsets());

        updateInsets();

        viewport.on("change:safeAreaInsets", updateInsets);
        viewport.on("change:contentSafeAreaInsets", updateInsets);

        return () => {
            viewport.off("change:safeAreaInsets", updateInsets);
            viewport.off("change:contentSafeAreaInsets", updateInsets);
        };
    }, []);

    return insets;
}
