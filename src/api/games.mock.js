import bg1 from "../assets/bg1.webp";
import bg2 from "../assets/bg2.webp";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function getGames() {
    await sleep(300);
    return [
        {
            id: "neverever",
            label: "1/4",
            title: "Я никогда НЕ",
            subtitle: "Игроки говорят «Я никогда не…», остальные отмечают, если делали это",
            players: "2+",
            categories: "14",
            bg: bg1,
        },
        {
            id: "mindbender",
            label: "2/4",
            title: "Мозголомка",
            subtitle: "Читай карточку и заставь друзей гадать – правда это, выдумка или твоя фантазия!",
            riveAnimation: "/rive/clock.riv",
            bg: bg2,
        },
    ];
}
