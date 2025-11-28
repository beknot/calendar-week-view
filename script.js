let currentDate = new Date();
const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let selectedDayDiv = null;

function updateMonthYearDisplay() {
  const monthYearDiv = document.getElementById('monthYear');
  monthYearDiv.textContent =
    `${currentDate.toLocaleString('en-US', { month: 'long' })} ${currentDate.getFullYear()}`;
}

function formatDayAndDate(day) {
  const dayOfWeek = day.toLocaleString('en-US', { weekday: 'short' });
  const date = String(day.getDate()).padStart(2, '0');
  return `<span>${dayOfWeek}</span><span>${date}</span>`;
}

function formatDateToYYYYMMDD(day) {
  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, '0');
  const date = String(day.getDate()).padStart(2, '0');
  return `${year}${month}${date}`;
}

function generateWeekView() {
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = formatDayAndDate(day);

    // Correct comparison using todayStart
    if (day < todayStart) {
      dayDiv.classList.add('blurred');
    } else {
      dayDiv.addEventListener('click', () => {
        console.log(formatDateToYYYYMMDD(day));

        if (selectedDayDiv) {
          selectedDayDiv.classList.remove('selected');
        }

        dayDiv.classList.add('selected');
        selectedDayDiv = dayDiv;
      });
    }

    calendarDiv.appendChild(dayDiv);
  }

  const startOfCurrentWeek = new Date(todayStart);
  startOfCurrentWeek.setDate(todayStart.getDate() - todayStart.getDay());

  const startOfDisplayedWeek = new Date(currentDate);
  startOfDisplayedWeek.setDate(currentDate.getDate() - currentDate.getDay());

  document.getElementById('prevWeek').disabled =
    startOfDisplayedWeek <= startOfCurrentWeek;

  updateMonthYearDisplay();
}

function changeWeek(weeks) {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + weeks * 7);

  const startOfNewWeek = new Date(newDate);
  startOfNewWeek.setDate(newDate.getDate() - newDate.getDay());

  const startOfCurrentWeek = new Date(todayStart);
  startOfCurrentWeek.setDate(todayStart.getDate() - todayStart.getDay());

  if (startOfNewWeek >= startOfCurrentWeek) {
    currentDate = newDate;
    generateWeekView();
  }
}

function changeMonth(months) {
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  if (months < 0 && currentYear === todayYear && currentMonth <= todayMonth) {
    return;
  }

  currentDate.setMonth(currentDate.getMonth() + months);
  generateWeekView();
}

document.getElementById('prevWeek').addEventListener('click', () => changeWeek(-1));
document.getElementById('nextWeek').addEventListener('click', () => changeWeek(1));

document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));

generateWeekView();