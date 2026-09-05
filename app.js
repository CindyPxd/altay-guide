/* ==========================================================================
   ALTAI 2026 AUTUMN TRIP - INTERACTIVE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initWeatherModule();
  initFoodFilter();
  initDayCards();
  initChecklist();
  initBudgetCalculator();
  initCopyButtons();
  initNavScroll();
});

/* 1. Countdown Timer */
function initCountdown() {
  const targetDate = new Date('2026-09-25T14:00:00+08:00').getTime();
  
  const daysEl = document.getElementById('days-val');
  const hoursEl = document.getElementById('hours-val');
  const minsEl = document.getElementById('mins-val');
  const secsEl = document.getElementById('secs-val');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 2. Real-Time Weather Module */
function initWeatherModule() {
  const refreshBtn = document.getElementById('refresh-weather');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '🔄 更新中...';

    setTimeout(() => {
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = '🔄 刷新最新气象';
      showToast('☁️ 已刷新阿勒泰·禾木·喀纳斯最新实时气象数据！');
    }, 800);
  });
}

/* 3. Dianping Gourmet Category Filter */
function initFoodFilter() {
  const filterBtns = document.querySelectorAll('.food-filter-btn');
  const foodCards = document.querySelectorAll('.restaurant-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      foodCards.forEach(card => {
        const cardLoc = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardLoc === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. Daily Itinerary Collapsible Cards */
function initDayCards() {
  const dayHeaders = document.querySelectorAll('.day-header');
  dayHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.day-card');
      card.classList.toggle('active');
    });
  });
}

/* 5. Interactive Packing Checklist with LocalStorage */
function initChecklist() {
  const checkItems = document.querySelectorAll('.check-item');
  const progressFill = document.querySelector('.progress-fill');
  const counterEl = document.getElementById('checklist-counter');
  
  if (!checkItems.length) return;

  // Load saved state
  const savedState = JSON.parse(localStorage.getItem('altai_checklist_state') || '{}');

  checkItems.forEach((item, index) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const itemId = `check_item_${index}`;

    if (savedState[itemId]) {
      checkbox.checked = true;
      item.classList.add('checked');
    }

    item.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      
      if (checkbox.checked) {
        item.classList.add('checked');
        savedState[itemId] = true;
      } else {
        item.classList.remove('checked');
        delete savedState[itemId];
      }

      localStorage.setItem('altai_checklist_state', JSON.stringify(savedState));
      updateChecklistProgress();
    });
  });

  function updateChecklistProgress() {
    const total = checkItems.length;
    const checkedCount = document.querySelectorAll('.check-item.checked').length;
    const pct = Math.round((checkedCount / total) * 100);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (counterEl) counterEl.textContent = `${checkedCount} / ${total} (${pct}%)`;
  }

  updateChecklistProgress();
}

/* 6. AA Budget Calculator */
function initBudgetCalculator() {
  const packageTotal = 17200; // Package cost for 2 people
  
  const flightA = document.getElementById('flight-duan');
  const flightB = document.getElementById('flight-pan');
  const extraCostInput = document.getElementById('extra-expenses');

  const sumPackageEl = document.getElementById('sum-package');
  const sumPerPackageEl = document.getElementById('sum-per-package');
  const sumFlightsEl = document.getElementById('sum-flights');
  const sumExtraEl = document.getElementById('sum-extra');
  const totalPriceEl = document.getElementById('total-price-val');
  const perPersonPriceEl = document.getElementById('per-person-val');

  if (!flightA) return;

  function calculate() {
    const fA = parseFloat(flightA.value) || 0;
    const fB = parseFloat(flightB.value) || 0;
    const extra = parseFloat(extraCostInput.value) || 0;

    const totalFlights = fA + fB;
    const grandTotal = packageTotal + totalFlights + extra;
    const perPersonTotal = grandTotal / 2;

    if (sumPackageEl) sumPackageEl.textContent = `¥${packageTotal.toLocaleString()}`;
    if (sumPerPackageEl) sumPerPackageEl.textContent = `¥${(packageTotal / 2).toLocaleString()}`;
    if (sumFlightsEl) sumFlightsEl.textContent = `¥${totalFlights.toLocaleString()} (假假:¥${fA} / Cindy:¥${fB})`;
    if (sumExtraEl) sumExtraEl.textContent = `¥${extra.toLocaleString()}`;
    if (totalPriceEl) totalPriceEl.textContent = `¥${grandTotal.toLocaleString()}`;
    if (perPersonPriceEl) perPersonPriceEl.textContent = `¥${Math.round(perPersonTotal).toLocaleString()}`;
  }

  [flightA, flightB, extraCostInput].forEach(input => {
    if (input) input.addEventListener('input', calculate);
  });

  calculate();
}

/* 7. One-Click Copy Button */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`已复制: "${textToCopy}"`);
      }).catch(err => {
        showToast('复制失败，请手动选择');
      });
    });
  });
}

/* 8. Navigation Scroll Highlight */
function initNavScroll() {
  const sections = document.querySelectorAll('.section-block');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Helper Toast Notice */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
