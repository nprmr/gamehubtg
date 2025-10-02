// src/hooks/useSafeArea.js
import { useState, useEffect } from "react";
import { viewport } from "@telegram-apps/sdk";

export function useSafeArea() {
    const getInsets = () => ({
        top: viewport?.safeAreaInsetTop?.() || 0,
        bottom: viewport?.safeAreaInsetBottom?.() || 0,
        left: viewport?.safeAreaInsetLeft?.() || 0,
        right: viewport?.safeAreaInsetRight?.() || 0,
    });

    const [insets, setInsets] = useState(getInsets);
    const [isTelegram, setIsTelegram] = useState(false);

    useEffect(() => {
        if (!viewport?.isSupported) {
            setIsTelegram(false);
            return;
        }

        setIsTelegram(true);

        try {
            viewport.bindCssVars();
        } catch (e) {
            console.warn("bindCssVars недоступен вне Mini App", e);
        }

        const updateInsets = () => setInsets(getInsets());
        updateInsets();

        viewport.on("change:safeAreaInsets", updateInsets);
        return () => viewport.off("change:safeAreaInsets", updateInsets);
    }, []);

    return { ...insets, isTelegram };
}
