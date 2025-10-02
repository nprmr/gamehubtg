// src/hooks/useSafeArea.js
import { useState, useEffect } from "react";
import { viewport } from "@telegram-apps/sdk";

export function useSafeArea() {
    const [insets, setInsets] = useState({
        top: viewport?.contentSafeAreaInsetTop() || 0,
        bottom: viewport?.contentSafeAreaInsetBottom() || 0,
        left: viewport?.contentSafeAreaInsetLeft() || 0,
        right: viewport?.contentSafeAreaInsetRight() || 0,
    });

    useEffect(() => {
        if (!viewport) return;

        // Привязываем к CSS-переменным (доступны как --tg-viewport-content-safe-area-inset-*)
        viewport.bindCssVars();

        const updateInsets = () => {
            setInsets({
                top: viewport.contentSafeAreaInsetTop(),
                bottom: viewport.contentSafeAreaInsetBottom(),
                left: viewport.contentSafeAreaInsetLeft(),
                right: viewport.contentSafeAreaInsetRight(),
            });
        };

        // сразу обновляем
        updateInsets();

        // ✅ подписка на события SDK
        viewport.on("change:contentSafeAreaInsets", updateInsets);
        return () => viewport.off("change:contentSafeAreaInsets", updateInsets);
    }, []);

    return insets;
}
