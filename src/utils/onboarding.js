export function hasOnboarded() {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    return localStorage.getItem(`onboarded_${userId}`) === "true";
}

export function setOnboarded() {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    localStorage.setItem(`onboarded_${userId}`, "true");
}
