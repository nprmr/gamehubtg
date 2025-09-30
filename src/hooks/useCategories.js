import { useEffect, useState } from "react";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4000/api/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Ошибка загрузки категорий:", err);
                setLoading(false);
            });
    }, []);

    return { categories, loading };
}
