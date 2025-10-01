export async function getCategories() {
    const res = await fetch("http://localhost:4000/api/categories");
    if (!res.ok) throw new Error("Network error");
    return res.json();
}
