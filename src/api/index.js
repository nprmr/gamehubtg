// src/api/index.js
import { getCategories as getCategoriesMock } from "./categories.mock";
import { getGames as getGamesMock } from "./games.mock";
import {
    getQuestionsByCategory as getQuestionsByCategoryMock,
    getQuestionsByCategories as getQuestionsByCategoriesMock,
} from "./questions.mock";

// Категории
export async function getCategories() {
    return getCategoriesMock();
}

// Игры
export async function getGames() {
    return getGamesMock();
}

// Вопросы по одной категории
export async function getQuestionsByCategory(title) {
    return getQuestionsByCategoryMock(title);
}

// Вопросы по нескольким категориям
export async function getQuestionsByCategories(titles = []) {
    return getQuestionsByCategoriesMock(titles);
}
