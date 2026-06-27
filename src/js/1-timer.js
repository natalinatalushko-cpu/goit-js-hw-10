import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

// на початку кнопка заблокована
startBtn.disabled = true;

// 1. Налаштування календаря
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // перевірка чи дата в майбутньому
    if (selectedDates[0] <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      return;
    }

    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(input, options);

// 2. Функція з умови - рахує час з мілісекунд
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// 3. Додає нуль попереду
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// 4. Запуск таймера по кліку
startBtn.addEventListener("click", onStartClick);

function onStartClick() {
  // блокуємо кнопку та інпут поки йде відлік
  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const ms = userSelectedDate - new Date();

    // якщо час вийшов - зупиняємо
    if (ms <= 0) {
      clearInterval(timerId);
      input.disabled = false;
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    updateTimer(convertMs(ms));
  }, 1000);
}

// оновлення розмітки таймера
function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}
