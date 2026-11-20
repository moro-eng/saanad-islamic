// js/prayer-times.js
const PRAYER_NAMES_AR = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

let countdownInterval = null;

export async function initCairoPrayerTimes() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  // Method 5 = الهيئة المصرية العامة للمساحة | محافظة القاهرة
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Cairo&country=Egypt&method=5`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    document.getElementById('hijri-date').textContent =
      `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ — القاهرة، مصر`;

    renderPrayerCards(timings);
    startNextPrayerCountdown(timings);
  } catch (error) {
    document.getElementById('next-prayer-title').textContent = 'تعذر تحميل مواقيت القاهرة حالياً';
  }
}

function format12Hour(time24) {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${mStr} ${period}`;
}

function renderPrayerCards(timings) {
  const grid = document.getElementById('prayers-grid');
  grid.innerHTML = '';

  Object.keys(PRAYER_NAMES_AR).forEach(key => {
    const arName = PRAYER_NAMES_AR[key];
    const formattedTime = format12Hour(timings[key]);
    const card = document.createElement('div');
    card.className = 'liquid-glass prayer-card';
    card.id = `card-${key}`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-speak', `صلاة ${arName} الساعة ${formattedTime}`);
    card.innerHTML = `
      <h3>${arName}</h3>
      <div class="time">${formattedTime}</div>
    `;
    grid.appendChild(card);
  });

  if (window.voiceEngine) window.voiceEngine.bindAutoReadElements();
}

function startNextPrayerCountdown(timings) {
  const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  function updateTimer() {
    const now = new Date();
    let nextKey = null;
    let nextDate = null;

    for (const key of mainPrayers) {
      const [h, m] = timings[key].split(':').map(Number);
      const pDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      if (pDate > now) {
        nextKey = key;
        nextDate = pDate;
        break;
      }
    }

    // لو عدّى العشاء، تبقى الصلاة القادمة فجر بكرة
    if (!nextKey) {
      nextKey = 'Fajr';
      const [h, m] = timings.Fajr.split(':').map(Number);
      nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0);
    }

    document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('active-next'));
    const activeCard = document.getElementById(`card-${nextKey}`);
    if (activeCard) activeCard.classList.add('active-next');

    const diffMs = nextDate - now;
    const hrs = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
    const mins = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
    const secs = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');

    const arName = PRAYER_NAMES_AR[nextKey];
    const bannerTitle = document.getElementById('next-prayer-title');
    bannerTitle.textContent = `الصلاة القادمة: صلاة ${arName}`;
    document.getElementById('countdown-timer').textContent = `${hrs}:${mins}:${secs}`;
    document.getElementById('next-prayer-banner').setAttribute(
      'data-speak',
      `الصلاة القادمة هي صلاة ${arName}، المتبقي عليها ${parseInt(hrs)} ساعة و ${parseInt(mins)} دقيقة`
    );
  }

  updateTimer();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateTimer, 1000);
}
