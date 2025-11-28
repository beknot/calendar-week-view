let currentDate = new Date();
const today = new Date();
let selectedDayDiv = null;

function updateMonthYearDisplay() {
  const monthYearDiv = document.getElementById('monthYear');
  monthYearDiv.textContent = `${currentDate.toLocaleString('en-US', { month: 'long' })} ${currentDate.getFullYear()}`;
}

function formatDayAndDate(day) {
  const dayOfWeek = day.toLocaleString('en-US', { weekday: 'short' }); // e.g., "Fr"
  const date = String(day.getDate()).padStart(2, '0'); // e.g., "01"
  
  // Return the day and date wrapped in separate <span> tags
  return `<span class="dd d-7">${dayOfWeek}</span><span class="dd d-30">${date}</span>`;
}

function formatDateToYYYYMMDD(day) {
  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1
  const date = String(day.getDate()).padStart(2, '0');
  return `${year}${month}${date}`;
}

function generateWeekView() {
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = ''; // Clear the previous content

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday as the first day of the week

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = formatDayAndDate(day); // Display formatted day and date with span

    // Blur and disable clicking on days older than today
    if (day < today.setHours(0, 0, 0, 0)) {
      dayDiv.classList.add('blurred');
    } else {
      dayDiv.addEventListener('click', () => {
        // Log the formatted date in yyyymmdd format
        console.log(formatDateToYYYYMMDD(day));

        // Remove 'selected' class from previously selected day
        if (selectedDayDiv) {
          selectedDayDiv.classList.remove('selected');
        }

        // Add 'selected' class to the clicked day
        dayDiv.classList.add('selected');
        selectedDayDiv = dayDiv;
      });
    }

    calendarDiv.appendChild(dayDiv);
  }

  // Disable prev button if we're in or before the current week
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());

  const startOfDisplayedWeek = new Date(currentDate);
  startOfDisplayedWeek.setDate(currentDate.getDate() - currentDate.getDay());

  document.getElementById('prevWeek').disabled = startOfDisplayedWeek <= startOfCurrentWeek;

  // Update the month and year display
  updateMonthYearDisplay();
}

function changeWeek(weeks) {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + weeks * 7); // Calculate new week date

  const startOfNewWeek = new Date(newDate);
  startOfNewWeek.setDate(newDate.getDate() - newDate.getDay());

  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());

  if (startOfNewWeek >= startOfCurrentWeek) {
    currentDate = newDate;
    generateWeekView();
  }
}

function changeMonth(months) {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  // Allow month change only if it doesn't go before the present month and year
  if (months < 0 && (currentYear === todayYear && currentMonth <= todayMonth)) {
    return; // Don't go to the previous month if it's before the current month
  }
  
  currentDate.setMonth(currentDate.getMonth() + months); // Move to the next/previous month
  generateWeekView(); // Re-generate the week view to update the calendar
}

// Event listeners for week and month navigation
document.getElementById('prevWeek').addEventListener('click', () => changeWeek(-1));
document.getElementById('nextWeek').addEventListener('click', () => changeWeek(1));

document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));

// Initial calendar view
generateWeekView();