// src/api/questions.mock.js
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const POOL = {
    "Детство": [
        { text: "Я никогда не убегал из дома в детстве", category: "Детство", riveFile: "/rive/childhood.riv" },
        { text: "Я никогда не крал конфеты у родителей", category: "Детство", riveFile: "/rive/childhood.riv" },
        { text: "Я никогда не дрался во дворе", category: "Детство", riveFile: "/rive/childhood.riv" },
        { text: "Я никогда не прятался от учителей", category: "Детство", riveFile: "/rive/childhood.riv" },
        { text: "Я никогда не прогуливал уроки ради игр", category: "Детство", riveFile: "/rive/childhood.riv" },
    ],
    "Семья": [
        { text: "Я никогда не спорил с родителями", category: "Семья", riveFile: "/rive/family.riv" },
        { text: "Я никогда не скрывал от семьи плохие оценки", category: "Семья", riveFile: "/rive/family.riv" },
        { text: "Я никогда не забывал важный семейный праздник", category: "Семья", riveFile: "/rive/family.riv" },
        { text: "Я никогда не ругался с братом или сестрой", category: "Семья", riveFile: "/rive/family.riv" },
        { text: "Я никогда не прятал еду от родственников", category: "Семья", riveFile: "/rive/family.riv" },
    ],
    "Здоровье и тело": [
        { text: "Я никогда не пробовал странные диеты", category: "Здоровье и тело", riveFile: "/rive/heart.riv" },
        { text: "Я никогда не притворялся больным", category: "Здоровье и тело", riveFile: "/rive/heart.riv" },
        { text: "Я никогда не засыпал на тренировке", category: "Здоровье и тело", riveFile: "/rive/heart.riv" },
        { text: "Я никогда не боялся идти к врачу", category: "Здоровье и тело", riveFile: "/rive/heart.riv" },
        { text: "Я никогда не падал в обморок на людях", category: "Здоровье и тело", riveFile: "/rive/heart.riv" },
    ],
    "Секс и интим": [
        { text: "Я никогда не целовался с незнакомцем", category: "Секс и интим", riveFile: "/rive/sex.riv" },
        { text: "Я никогда не отправлял интимные фото", category: "Секс и интим", riveFile: "/rive/sex.riv" },
        { text: "Я никогда не был на свидании вслепую", category: "Секс и интим", riveFile: "/rive/sex.riv" },
        { text: "Я никогда не придумывал оправдания после свидания", category: "Секс и интим", riveFile: "/rive/sex.riv" },
        { text: "Я никогда не рассказывал друзьям интимные подробности", category: "Секс и интим", riveFile: "/rive/sex.riv" },
    ],
    "Фантазии и мечты": [
        { text: "Я никогда не мечтал стать супергероем", category: "Фантазии и мечты", riveFile: "/rive/dream.riv" },
        { text: "Я никогда не представлял себя знаменитым", category: "Фантазии и мечты", riveFile: "/rive/dream.riv" },
        { text: "Я никогда не мечтал переехать в другой город", category: "Фантазии и мечты", riveFile: "/rive/dream.riv" },
        { text: "Я никогда не придумывал себе воображаемого друга", category: "Фантазии и мечты", riveFile: "/rive/dream.riv" },
        { text: "Я никогда не фантазировал о будущем", category: "Фантазии и мечты", riveFile: "/rive/dream.riv" },
    ],
    "Путешествия": [
        { text: "Я никогда не засыпал в самолёте до взлёта", category: "Путешествия", riveFile: "/rive/travel.riv" },
        { text: "Я никогда не забывал паспорт в аэропорту", category: "Путешествия", riveFile: "/rive/travel.riv" },
        { text: "Я никогда не терял багаж в поездке", category: "Путешествия", riveFile: "/rive/travel.riv" },
        { text: "Я никогда не ездил автостопом", category: "Путешествия", riveFile: "/rive/travel.riv" },
        { text: "Я никогда не ел экзотическую еду в путешествии", category: "Путешествия", riveFile: "/rive/travel.riv" },
    ],
    "Отношения и свидания": [
        { text: "Я никогда не отменял свидание в последний момент", category: "Отношения и свидания", riveFile: "/rive/date.riv" },
        { text: "Я никогда не влюблялся с первого взгляда", category: "Отношения и свидания", riveFile: "/rive/date.riv" },
        { text: "Я никогда не ссорился на первом свидании", category: "Отношения и свидания", riveFile: "/rive/date.riv" },
        { text: "Я никогда не дарил странный подарок партнёру", category: "Отношения и свидания", riveFile: "/rive/date.riv" },
        { text: "Я никогда не назначал два свидания в один день", category: "Отношения и свидания", riveFile: "/rive/date.riv" },
    ],
    "Работа и учеба": [
        { text: "Я никогда не опаздывал на работу больше чем на час", category: "Работа и учеба", riveFile: "/rive/work.riv" },
        { text: "Я никогда не списывал на экзамене", category: "Работа и учеба", riveFile: "/rive/work.riv" },
        { text: "Я никогда не прятался от начальника", category: "Работа и учеба", riveFile: "/rive/work.riv" },
        { text: "Я никогда не ел за рабочим столом", category: "Работа и учеба", riveFile: "/rive/work.riv" },
        { text: "Я никогда не забывал важный дедлайн", category: "Работа и учеба", riveFile: "/rive/work.riv" },
    ],
    "Интернет и соц. сети": [
        { text: "Я никогда не сидел в телефоне ночью до утра", category: "Интернет и соц. сети", riveFile: "/rive/phone.riv" },
        { text: "Я никогда не удалял пост из-за стыда", category: "Интернет и соц. сети", riveFile: "/rive/phone.riv" },
        { text: "Я никогда не спорил в комментариях с незнакомыми людьми", category: "Интернет и соц. сети", riveFile: "/rive/phone.riv" },
        { text: "Я никогда не выкладывал фото, о котором потом пожалел", category: "Интернет и соц. сети", riveFile: "/rive/phone.riv" },
        { text: "Я никогда не создавал фейковый аккаунт", category: "Интернет и соц. сети", riveFile: "/rive/phone.riv" },
    ],
    "Игры и развлечения": [
        { text: "Я никогда не играл всю ночь без сна", category: "Игры и развлечения", riveFile: "/rive/game.riv" },
        { text: "Я никогда не тратил деньги на игры", category: "Игры и развлечения", riveFile: "/rive/game.riv" },
        { text: "Я никогда не ломал джойстик или клавиатуру", category: "Игры и развлечения", riveFile: "/rive/game.riv" },
        { text: "Я никогда не спорил в чате с игроками", category: "Игры и развлечения", riveFile: "/rive/game.riv" },
        { text: "Я никогда не проигрывал из-за невнимательности", category: "Игры и развлечения", riveFile: "/rive/game.riv" },
    ],
    "Алкогольные истории": [
        { text: "Я никогда не перепутал рюмку с чужой", category: "Алкогольные истории", riveFile: "/rive/alchohol.riv" },
        { text: "Я никогда не засыпал в такси после пьянки", category: "Алкогольные истории", riveFile: "/rive/alchohol.riv" },
        { text: "Я никогда не танцевал на барной стойке", category: "Алкогольные истории", riveFile: "/rive/alchohol.riv" },
        { text: "Я никогда не рвал в такси", category: "Алкогольные истории", riveFile: "/rive/alchohol.riv" },
        { text: "Я никогда не устраивал пьяный караоке-баттл", category: "Алкогольные истории", riveFile: "/rive/alchohol.riv" },
    ],
};

export async function getQuestionsByCategory(title) {
    await sleep(200);
    return POOL[title] || [];
}

export async function getQuestionsByCategories(titles = []) {
    await sleep(300);
    return titles.flatMap((t) => POOL[t] || []);
}
