import bg1 from "../assets/bg1.png";
import brainhack from "../assets/bgBrainHack.png";
import crocodile from "../assets/crocodile.png"

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function getGames() {
    await sleep(300);
    return [
        {
            id: "neverever",
            label: "1/3",
            title: "Я никогда НЕ",
            subtitle: "Игроки говорят «Я никогда не…», остальные отмечают, если делали это",
            players: "2+",
            categories: "14",
            bg: bg1,
            route: "/neverever",
            buttonText: "Начать игру",
        },
        {
            id: "brainhack",
            label: "2/3",
            title: "Мозголомка",
            players: "2+",
            categories: "40",
            subtitle: "Читай карточку и заставь друзей гадать – правда это или выдумка!",
            bg: brainhack,
            route: "/brainhack", // <— теперь активна
            buttonText: "Начать игру",
        },
        {
            id: "crocodile",
            label: "3/3",
            title: "Крокодил",
            subtitle: "Покажи слово жестами или эмоциями! Не смей произносить звуки. Победит тот, кто угадает больше всех!",
            riveAnimation: "/rive/clock.riv",
            bg: crocodile,
            buttonText: "Игра в разработке", // можно не указывать route → кнопка будет неактивна
        },
    ];
}
