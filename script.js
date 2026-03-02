// Глобальные переменные
let currentDay = 1;
let currentScore = 0;
const MAX_DAYS = 18;        // 18 дней
const WIN_SCORE = 50;       // нужно 50 баллов
let gameActive = true;
let canAnswer = true;
let sunInterval = null;
let dayEndTimeout = null;

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

// Элементы DOM
const celestialBody = document.getElementById('celestialBody');
const sunLayer = document.getElementById('sunLayer');
const moonLayer = document.getElementById('moonLayer');
const daySpan = document.getElementById('day');
const scoreSpan = document.getElementById('score');
const trustFill = document.getElementById('trustFill');
const farmerIcon = document.getElementById('farmerIcon');
const dialogText = document.getElementById('dialogText');
const choicesArea = document.getElementById('choicesArea');
const gameOverDiv = document.getElementById('gameOver');
const gameOverMessage = document.getElementById('gameOverMessage');

// Очистка всех таймеров
function clearAllTimers() {
    if (sunInterval) {
        clearInterval(sunInterval);
        sunInterval = null;
    }
    if (dayEndTimeout) {
        clearTimeout(dayEndTimeout);
        dayEndTimeout = null;
    }
}

// Обновление отображения
function updateDisplay() {
    if (daySpan) daySpan.textContent = currentDay;
    if (scoreSpan) scoreSpan.textContent = currentScore;
    
    // Обновляем текст с максимальными днями
    const dayCounter = document.querySelector('.day-counter');
    if (dayCounter) {
        dayCounter.innerHTML = `День: <span id="day">${currentDay}</span>/${MAX_DAYS}`;
    }
    
    // Шкала доверия
    let displayScore = Math.max(0, currentScore);
    let percentage = (displayScore / WIN_SCORE) * 100;
    if (trustFill) {
        trustFill.style.width = Math.min(percentage, 100) + '%';
    }
    
    // Позиция фермера
    const meterContainer = document.querySelector('.meter-container');
    if (meterContainer && farmerIcon) {
        const containerWidth = meterContainer.offsetWidth - 40;
        let farmerPos = (displayScore / WIN_SCORE) * containerWidth;
        farmerPos = Math.max(0, Math.min(farmerPos, containerWidth));
        farmerIcon.style.left = farmerPos + 'px';
    }
    
    // Выражение лица фермера
    if (farmerIcon) {
        const progress = (currentScore / WIN_SCORE) * 100;
        if (progress >= 90) farmerIcon.textContent = '👨‍🌾🤝';
        else if (progress >= 60) farmerIcon.textContent = '👨‍🌾😊';
        else if (progress >= 30) farmerIcon.textContent = '👨‍🌾😐';
        else if (progress >= 0) farmerIcon.textContent = '👨‍🌾😠';
        else farmerIcon.textContent = '👨‍🌾💢';
    }
    
    // Проверка победы
    if (currentScore >= WIN_SCORE) {
        endGame('win');
    }
}

// Показ реакции
function showReaction(score) {
    const oldReaction = document.querySelector('.reaction-emoji');
    if (oldReaction) oldReaction.remove();
    
    const reaction = document.createElement('div');
    reaction.className = 'reaction-emoji';
    reaction.textContent = reactionEmojis[score.toString()] || '😐';
    document.querySelector('.dialog-area').appendChild(reaction);
    
    setTimeout(() => {
        if (reaction.parentNode) reaction.remove();
    }, 2000);
}

// Запуск солнца (10 секунд)
function startSun() {
    clearAllTimers();
    
    let sunPos = 0;
    const startTime = Date.now();
    const dayDuration = 10000; // 10 секунд
    
    // Анимация солнца
    sunInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(sunInterval);
            return;
        }
        
        const elapsed = Date.now() - startTime;
        sunPos = Math.min((elapsed / dayDuration) * 100, 100);
        
        // Движение
        const container = document.querySelector('.sun-container');
        if (!container || !celestialBody) return;
        
        const maxLeft = container.offsetWidth - celestialBody.offsetWidth;
        const left = (sunPos / 100) * maxLeft;
        celestialBody.style.left = Math.min(left, maxLeft) + 'px';
        
        // Превращение в луну
        if (sunLayer && moonLayer) {
            if (sunPos < 70) {
                sunLayer.style.opacity = 1;
                moonLayer.style.opacity = 0;
            } else if (sunPos < 85) {
                let progress = (sunPos - 70) / 15;
                sunLayer.style.opacity = 1 - progress;
                moonLayer.style.opacity = progress;
            } else {
                sunLayer.style.opacity = 0;
                moonLayer.style.opacity = 1;
            }
        }
        
        // Конец дня
        if (sunPos >= 100) {
            clearInterval(sunInterval);
            sunInterval = null;
            if (gameActive) {
                endDay();
            }
        }
    }, 50);
    
    // Резервный таймер
    dayEndTimeout = setTimeout(() => {
        if (gameActive && sunInterval) {
            clearInterval(sunInterval);
            sunInterval = null;
            endDay();
        }
    }, dayDuration + 100);
}

// Создание кнопок
function createButtons() {
    if (!choicesArea || !dialogText) return;
    
    choicesArea.innerHTML = '';
    canAnswer = true;
    
    // Выбираем диалог по текущему дню (зацикливаем если дней больше чем диалогов)
    const dialogIndex = (currentDay - 1) % dialogs.length;
    const dialog = dialogs[dialogIndex];
    dialogText.textContent = dialog.text;
    
    // Создаем кнопки для каждого варианта ответа
    dialog.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => {
            if (!gameActive || !canAnswer) return;
            
            // Начисляем баллы
            currentScore += choice.score;
            canAnswer = false;
            
            // Обновляем интерфейс
            updateDisplay();
            showReaction(choice.score);
            
            // Блокируем кнопки
            document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
            
            // Показываем реакцию старика
            if (choice.score === 3) {
                dialogText.textContent = "✨ Старик широко улыбается! Ему очень нравится ваш ответ!";
            } else if (choice.score === 2) {
                dialogText.textContent = "👴 Старик кивает. Неплохой ответ.";
            } else if (choice.score === 1) {
                dialogText.textContent = "🤔 Старик задумался. Приемлемо.";
            } else if (choice.score === -1) {
                dialogText.textContent = "😒 Старик хмурится. Ответ ему не понравился...";
            }
            
            // Останавливаем солнце и завершаем день
            clearAllTimers();
            
            setTimeout(() => {
                if (gameActive) {
                    endDay();
                }
            }, 1500);
        };
        btn.disabled = false;
        choicesArea.appendChild(btn);
    });
}

// Конец дня
function endDay() {
    clearAllTimers();
    
    // Штраф за молчание
    if (canAnswer && gameActive) {
        currentScore -= 1;
        dialogText.textContent = "😠 Старик ждал ответа, но вы промолчали... Он разочарован.";
        updateDisplay();
    }
    
    // Следующий день
    currentDay++;
    updateDisplay();
    
    // Проверка на конец игры
    if (currentDay > MAX_DAYS) {
        endGame('lose');
        return;
    }
    
    // Запускаем следующий день через 2 секунды
    setTimeout(() => {
        if (gameActive) {
            createButtons();
            startSun();
        }
    }, 2000);
}

// Конец игры
function endGame(result) {
    gameActive = false;
    clearAllTimers();
    
    if (gameOverMessage && gameOverDiv) {
        if (result === 'win' || currentScore >= WIN_SCORE) {
            gameOverMessage.innerHTML = "🎉 СДЕЛКА! 🎉<br><br>Старик пожимает вам руку! Ферма ваша!";
        } else {
            gameOverMessage.innerHTML = "😔 Старик разочарован...<br><br>Дни прошли, и он продал ферму другому.";
        }
        
        gameOverDiv.style.display = 'block';
    }
}

// Старт игры
function startGame() {
    clearAllTimers();
    
    gameActive = true;
    currentDay = 1;
    currentScore = 0;
    canAnswer = true;
    
    // Скрываем окно окончания игры если оно было показано
    if (gameOverDiv) {
        gameOverDiv.style.display = 'none';
    }
    
    // Обновляем отображение
    updateDisplay();
    
    // Создаем кнопки и запускаем солнце
    createButtons();
    startSun();
}

// Запуск игры при загрузке страницы
window.onload = startGame;