// Глобальные переменные
let currentDay = 1;
let currentScore = 0;
const MAX_DAYS = 18;
const WIN_SCORE = 50;
let gameActive = true;
let canAnswer = true;
let sunInterval = null;

// Кэшируем элементы DOM один раз
const elements = {
    daySpan: document.getElementById('day'),
    scoreSpan: document.getElementById('score'),
    trustFill: document.getElementById('trustFill'),
    farmerIcon: document.getElementById('farmerIcon'),
    dialogText: document.getElementById('dialogText'),
    choicesArea: document.getElementById('choicesArea'),
    gameOverDiv: document.getElementById('gameOver'),
    gameOverMessage: document.getElementById('gameOverMessage'),
    meterContainer: document.querySelector('.meter-container'),
    celestialBody: document.getElementById('celestialBody'),
    sunLayer: document.getElementById('sunLayer'),
    moonLayer: document.getElementById('moonLayer'),
};

// Хитрые диалоги
const dialogs = [
    {
        text: "Добро пожаловать на мою ферму! Я уже стар, ищу того, кто продолжит моё дело. Что скажете?",
        choices: [
            { text: "Расскажите о ферме подробнее", score: 2 },
            { text: "Сколько стоит? Я готов купить!", score: -1 },
            { text: "Для меня честь продолжить ваше дело", score: 3 }
        ]
    },
    {
        text: "Ферма досталась мне от отца. Здесь 50 гектаров земли, коровник и курятник. Уход нужен постоянный.",
        choices: [
            { text: "Звучит много работы", score: -1 },
            { text: "Расскажите про коровник", score: 2 },
            { text: "Я привык много работать", score: 3 }
        ]
    },
    {
        text: "Прибыль небольшая, но стабильная. Главное - любить землю. Справитесь ли вы?",
        choices: [
            { text: "А какая точная цифра прибыли?", score: -1 },
            { text: "Научусь любить", score: 1 },
            { text: "Земля - это жизнь", score: 3 }
        ]
    },
    {
        text: "В прошлом году был неурожай. Много убытков понёс.",
        choices: [
            { text: "Может, продать ферму тогда?", score: -1 },
            { text: "А почему неурожай случился?", score: 2 },
            { text: "В трудные годы нужно держаться вместе", score: 3 }
        ]
    },
    {
        text: "Соседский петух постоянно будит в 4 утра. Бесит ужасно.",
        choices: [
            { text: "Надо его приструнить", score: -1 },
            { text: "Ранний подъём - это полезно", score: 2 },
            { text: "Соседям можно и уши залепить (шутка)", score: 1 }
        ]
    },
    {
        text: "Куры перестали нестись. Что делать будем?",
        choices: [
            { text: "На суп их!", score: -1 },
            { text: "Проверить корм и условия", score: 3 },
            { text: "Новых купим", score: 1 }
        ]
    },
    {
        text: "Трактор сломался, а поле пахать надо. Ваши действия?",
        choices: [
            { text: "Продам поле", score: -1 },
            { text: "Найму соседа с трактором", score: 2 },
            { text: "Лошадьми вспашем, деды так делали", score: 3 }
        ]
    },
    {
        text: "Молоко подешевело, кормить скот дорого. Что предпримем?",
        choices: [
            { text: "Сократим поголовье", score: 1 },
            { text: "Перерабатывать сами будем", score: 3 },
            { text: "Закроем ферму", score: -1 }
        ]
    },
    {
        text: "Приехала проверка из администрации. Как встретим?",
        choices: [
            { text: "Подкупом", score: -1 },
            { text: "Покажем всё как есть", score: 2 },
            { text: "Чаем напоим и пирогами", score: 3 }
        ]
    },
    {
        text: "Работник просит прибавку к зарплате. А денег лишних нет.",
        choices: [
            { text: "Уволить и найти нового", score: -1 },
            { text: "Обсудить варианты", score: 3 },
            { text: "Пообещать позже", score: 1 }
        ]
    },
    {
        text: "Сосед предлагает купить его участок. Цена хорошая, но денег в обрез.",
        choices: [
            { text: "Влезу в кредит", score: 1 },
            { text: "Предложу бартер", score: 3 },
            { text: "Откажусь, свои бы прокормить", score: 2 }
        ]
    },
    {
        text: "Урожай яблок огромный. Куда девать?",
        choices: [
            { text: "Сгниёт - перепашем", score: -1 },
            { text: "Сок и варенье сделаем", score: 3 },
            { text: "Раздам соседям", score: 2 }
        ]
    },
    {
        text: "Зима обещает быть холодной. Дрова заготовили мало.",
        choices: [
            { text: "Купим уголь", score: 2 },
            { text: "В доме скотины переночуем", score: -1 },
            { text: "В лесу нарубим", score: 1 }
        ]
    },
    {
        text: "В город приехал новый ветеринар. Говорят, хороший специалист.",
        choices: [
            { text: "Старый нас устраивает", score: 1 },
            { text: "Познакомлюсь, приглашу", score: 3 },
            { text: "Все они одинаковые", score: -1 }
        ]
    },
    {
        text: "Крыша в сарае прохудилась. Когда чинить будем?",
        choices: [
            { text: "До дождей успеем", score: 2 },
            { text: "Сейчас же займусь", score: 3 },
            { text: "Авось простоит", score: -1 }
        ]
    },
    {
        text: "Молодёжь в деревне не хочет работать на земле. Как думаете?",
        choices: [
            { text: "Их право, город манит", score: 1 },
            { text: "Нужно пример показывать", score: 3 },
            { text: "Пусть катятся", score: -1 }
        ]
    },
    {
        text: "Слышал, вы в городе живёте. Не заскучаете здесь?",
        choices: [
            { text: "Интернет проведём", score: 1 },
            { text: "Тишина и природа - счастье", score: 3 },
            { text: "Буду в город ездить", score: 2 }
        ]
    },
    {
        text: "Последний вопрос: что для вас ферма?",
        choices: [
            { text: "Бизнес и доход", score: 1 },
            { text: "Смысл жизни", score: 3 },
            { text: "Просто место жительства", score: -1 }
        ]
    }
];

// Эмодзи для реакций
const reactionEmojis = {
    '-1': '😠',
    '1': '😐',
    '2': '😐',
    '3': '😊'
};

// Очистка таймеров
function clearAllTimers() {
    if (sunInterval) {
        clearInterval(sunInterval);
        sunInterval = null;
    }
}

// Обновление отображения
function updateDisplay() {
    elements.daySpan.textContent = currentDay;
    elements.scoreSpan.textContent = currentScore;

    let displayScore = Math.max(0, currentScore);
    let percentage = (displayScore / WIN_SCORE) * 100;
    elements.trustFill.style.width = Math.min(percentage, 100) + '%';

    const containerWidth = elements.meterContainer.offsetWidth - 40;
    let farmerPos = (displayScore / WIN_SCORE) * containerWidth;
    farmerPos = Math.max(0, Math.min(farmerPos, containerWidth));
    elements.farmerIcon.style.left = farmerPos + 'px';

    const progress = (currentScore / WIN_SCORE) * 100;
    if      (progress >= 90) elements.farmerIcon.textContent = '👨‍🌾🤝';
    else if (progress >= 60) elements.farmerIcon.textContent = '👨‍🌾😊';
    else if (progress >= 30) elements.farmerIcon.textContent = '👨‍🌾😐';
    else if (progress >= 0)  elements.farmerIcon.textContent = '👨‍🌾😠';
    else                     elements.farmerIcon.textContent = '👨‍🌾💢';
}

// Показ реакции
function showReaction(score) {
    const old = document.querySelector('.reaction-emoji');
    if (old) old.remove();

    const reaction = document.createElement('div');
    reaction.className = 'reaction-emoji';
    reaction.textContent = reactionEmojis[score] || '😐';
    document.querySelector('.dialog-area').appendChild(reaction);

    setTimeout(() => reaction.remove(), 2000);
}

// Анимация солнца (10 секунд на день)
function startSun() {
    clearAllTimers();

    const startTime = Date.now();
    const dayDuration = 10000; // 10 секунд

    sunInterval = setInterval(() => {
        if (!gameActive) {
            clearAllTimers();
            return;
        }

        const elapsed = Date.now() - startTime;
        let sunPos = Math.min((elapsed / dayDuration) * 100, 100);

        const container = document.querySelector('.sun-container');
        const maxLeft = container.offsetWidth - elements.celestialBody.offsetWidth;
        const left = (sunPos / 100) * maxLeft;
        elements.celestialBody.style.left = Math.min(left, maxLeft) + 'px';

        if (sunPos < 70) {
            elements.sunLayer.style.opacity = 1;
            elements.moonLayer.style.opacity = 0;
        } else if (sunPos < 85) {
            let p = (sunPos - 70) / 15;
            elements.sunLayer.style.opacity = 1 - p;
            elements.moonLayer.style.opacity = p;
        } else {
            elements.sunLayer.style.opacity = 0;
            elements.moonLayer.style.opacity = 1;
        }

        if (sunPos >= 100) {
            clearAllTimers();
            endDay();
        }
    }, 40);
}

// Создание кнопок выбора
function createButtons() {
    elements.choicesArea.innerHTML = '';
    canAnswer = true;

    const dialogIndex = (currentDay - 1) % dialogs.length;
    const dialog = dialogs[dialogIndex];
    elements.dialogText.textContent = dialog.text;

    dialog.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => {
            if (!gameActive || !canAnswer) return;
            canAnswer = false;

            currentScore += choice.score;
            updateDisplay();
            showReaction(choice.score);

            if (choice.score === 3) {
                elements.dialogText.textContent = "✨ Старик широко улыбается! Ему очень нравится ваш ответ!";
            } else if (choice.score === 2) {
                elements.dialogText.textContent = "👴 Старик кивает. Неплохой ответ.";
            } else if (choice.score === 1) {
                elements.dialogText.textContent = "🤔 Старик задумался. Приемлемо.";
            } else if (choice.score === -1) {
                elements.dialogText.textContent = "😒 Старик хмурится. Ответ ему не понравился...";
            }

            document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

            clearAllTimers();

            setTimeout(() => {
                if (gameActive) endDay();
            }, 1400);
        };
        elements.choicesArea.appendChild(btn);
    });
}

// Завершение дня
function endDay() {
    clearAllTimers();

    if (canAnswer && gameActive) {
        currentScore -= 1;
        elements.dialogText.textContent = "😠 Старик ждал ответа, но вы промолчали... Он разочарован.";
        updateDisplay();
    }

    currentDay++;
    updateDisplay();

    if (currentDay > MAX_DAYS) {
        endGame('lose');
        return;
    }

    if (currentScore >= WIN_SCORE) {
        endGame('win');
        return;
    }

    setTimeout(() => {
        if (gameActive) {
            createButtons();
            startSun();
        }
    }, 900);
}

// Конец игры
function endGame(result) {
    gameActive = false;
    clearAllTimers();

    if (result === 'win' || currentScore >= WIN_SCORE) {
        elements.gameOverMessage.innerHTML = "🎉 СДЕЛКА! 🎉<br><br>Старик пожимает вам руку! Ферма ваша!";
    } else {
        elements.gameOverMessage.innerHTML = "😔 Старик разочарован...<br><br>Дни прошли, и он продал ферму другому.";
    }

    elements.gameOverDiv.style.display = 'block';
}

// Старт игры
function startGame() {
    clearAllTimers();
    gameActive = true;
    currentDay = 1;
    currentScore = 0;
    canAnswer = true;

    if (elements.gameOverDiv) {
        elements.gameOverDiv.style.display = 'none';
    }

    updateDisplay();
    createButtons();
    startSun();
}

// Запуск при загрузке страницы
window.onload = startGame;