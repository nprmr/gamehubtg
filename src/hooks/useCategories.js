// src/hooks/useCategories.js
import { useEffect, useState } from "react";
import { getCategories } from "../api";

export function useCategories() {
    const [categories, setCategories] = useState([]);  // ← массив по умолчанию
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getCategories();    // ← НИКАКИХ fetch тут
                if (alive) setCategories(Array.isArray(res) ? res : []);
            } catch (e) {
                console.error("Ошибка загрузки категорий:", e);
                if (alive) {
                    setError(e);
                    setCategories([]);                  // чтобы UI не падал
                }
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    return { categories, loading, error };
}
