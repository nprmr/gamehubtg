// src/api/categories.mock.js
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function getCategories() {
    await sleep(200);
    return [
        { id: 2, title: "Детство", riveFile: "/rive/childhood.riv", locked: false, adult: false },
        { id: 3, title: "Семья", riveFile: "/rive/family.riv", locked: false, adult: false },
        { id: 4, title: "Здоровье и тело", riveFile: "/rive/heart.riv", locked: false, adult: false },
        { id: 6, title: "Секс и интим", riveFile: "/rive/sex.riv", locked: true, adult: true },
        { id: 7, title: "Фантазии и мечты", riveFile: "/rive/dream.riv", locked: true, adult: false },
        { id: 8, title: "Путешествия", riveFile: "/rive/travel.riv", locked: true, adult: false },
        { id: 10, title: "Отношения и свидания", riveFile: "/rive/date.riv", locked: true, adult: false },
        { id: 11, title: "Работа и учеба", riveFile: "/rive/work.riv", locked: true, adult: false },
        { id: 13, title: "Интернет и соц. сети", riveFile: "/rive/phone.riv", locked: true, adult: false },
        { id: 14, title: "Игры и развлечения", riveFile: "/rive/game.riv", locked: true, adult: false },
        { id: 1, title: "Алкогольные истории", riveFile: "/rive/alchohol.riv", locked: false, adult: true },
    ];
}
