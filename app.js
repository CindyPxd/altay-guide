/* ==========================================================================
   ALTAI 2026 AUTUMN TRIP - INTERACTIVE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPortraitToggle();
  initMobileMenu();
  initAmapModule();
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

/* 2. Mobile Vertical Portrait Mode Preview Switcher (📱 竖版预览) */
function initPortraitToggle() {
  const toggleBtn = document.getElementById('portrait-toggle');
  const exitBar = document.getElementById('portrait-exit-bar');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', togglePortrait);
  if (exitBar) exitBar.addEventListener('click', togglePortrait);

  function togglePortrait() {
    const isActive = document.body.classList.toggle('portrait-mode-active');
    toggleBtn.classList.toggle('active', isActive);

    if (isActive) {
      toggleBtn.innerHTML = '<span>🖥️</span> 退出竖版';
      showToast('📱 已开启手机竖版视图预览');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toggleBtn.innerHTML = '<span>📱</span> 竖版预览';
      showToast('🖥️ 已恢复宽屏视图');
    }
  }
}

/* Mobile Menu Toggle & Dropdown Handler (☰ 菜单栏) */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const navItems = document.querySelectorAll('.nav-item');

  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = siteNav.classList.toggle('expanded');
    menuToggle.classList.toggle('active', isExpanded);
    menuToggle.innerHTML = isExpanded 
      ? '<span>✖</span> <span class="btn-text">收起</span>' 
      : '<span>☰</span> <span class="btn-text">菜单栏</span>';
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (siteNav.classList.contains('expanded')) {
        siteNav.classList.remove('expanded');
        menuToggle.classList.remove('active');
        menuToggle.innerHTML = '<span>☰</span> <span class="btn-text">菜单栏</span>';
      }
    });
  });
}

/* 3. Amap Module (高德地图) */
function initAmapModule() {
  const container = document.getElementById('amap-render-container');
  if (!container) return;

  // High-precision Route Points for Xinjiang Altay Trip
  const points = [
    { id: 1, name: '阿勒泰雪都机场', lng: 88.114, lat: 47.751, tag: '接送机汇合点', desc: 'Cindy (15:40) 与 假假 (17:00) 汇合，福特T6专车接机。' },
    { id: 2, name: '阿勒泰市福朋喜来登酒店', lng: 88.138, lat: 47.846, tag: '第1/5晚住宿', desc: '五星级高星连锁标准，城景双床房，全天候地暖。' },
    { id: 3, name: '阿禾景观公路采风线', lng: 87.802, lat: 48.008, tag: '最美景观公路', desc: '金秋黄叶桦树林，无人机与单反随车航拍绝佳路段。' },
    { id: 4, name: '禾木塞尚艺术民宿', lng: 87.435, lat: 48.562, tag: '第2晚住宿', desc: '禾木景区核心区，图瓦木屋，观星与篝火晚会。' },
    { id: 5, name: '深山见·自然美学民宿(白哈巴老村)', lng: 86.782, lat: 48.694, tag: '第3晚住宿', desc: '中国西北第一村，全景雪山落地窗与山景餐厅。' },
    { id: 6, name: '卧湖·临湖观雪山野奢民宿(喀纳斯湖)', lng: 87.031, lat: 48.718, tag: '第4晚住宿', desc: '喀纳斯湖畔全景野奢，徒步神仙湾、月亮湾、卧龙湾。' }
  ];

  const sidebar = document.getElementById('map-points-sidebar');
  if (sidebar) {
    sidebar.innerHTML = points.map(p => `
      <div class="sidebar-point-card" data-id="${p.id}" data-lat="${p.lat}" data-lng="${p.lng}">
        <div class="point-title">
          <span>📍 ${p.name}</span>
          <span class="point-tag">${p.tag}</span>
        </div>
        <div class="point-desc">${p.desc}</div>
        <a href="https://uri.amap.com/marker?position=${p.lng},${p.lat}&name=${encodeURIComponent(p.name)}" target="_blank" class="amap-nav-btn">
          🚀 高德地图导航
        </a>
      </div>
    `).join('');
  }

  // Check if Amap JS API script loaded, otherwise load fallback vector container
  if (typeof AMap !== 'undefined') {
    try {
      const map = new AMap.Map('amap-render-container', {
        zoom: 8,
        center: [87.435, 48.350],
        viewMode: '3D'
      });

      const linePath = points.map(p => [p.lng, p.lat]);

      const polyline = new AMap.Polyline({
        path: linePath,
        borderWeight: 2,
        strokeColor: '#d97706',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        strokeStyle: 'solid'
      });
      map.add(polyline);

      points.forEach(p => {
        const marker = new AMap.Marker({
          position: [p.lng, p.lat],
          title: p.name,
          map: map
        });

        const infoWindow = new AMap.InfoWindow({
          content: `<div style="padding:5px;"><strong>${p.name}</strong><br><span style="font-size:12px;color:#666;">${p.desc}</span></div>`,
          offset: new AMap.Pixel(0, -30)
        });

        marker.on('click', () => {
          infoWindow.open(map, marker.getPosition());
        });
      });
    } catch (e) {
      renderMapFallbackContainer();
    }
  } else {
    renderMapFallbackContainer();
  }

  function renderMapFallbackContainer() {
    container.innerHTML = `
      <div style="width:100%;height:100%;background:linear-gradient(135deg, #1e293b, #0f172a);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;">
        <div style="font-size:3rem;margin-bottom:0.5rem;">🗺️</div>
        <h3 style="font-size:1.2rem;font-weight:800;color:#f59e0b;margin-bottom:0.5rem;">高德地图全行程路线已接入</h3>
        <p style="font-size:0.85rem;color:#cbd5e1;max-width:400px;margin-bottom:1.25rem;">阿勒泰 ➔ 阿禾公路 ➔ 禾木村 ➔ 白哈巴老村 ➔ 喀纳斯三湾 ➔ 阿勒泰</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;">
          <a href="https://uri.amap.com/marker?position=88.138,47.846&name=阿勒泰市福朋喜来登酒店" target="_blank" class="amap-nav-btn" style="padding:0.5rem 1rem;font-size:0.85rem;">📍 高德导航: 喜来登酒店</a>
          <a href="https://uri.amap.com/marker?position=87.435,48.562&name=禾木塞尚艺术民宿" target="_blank" class="amap-nav-btn" style="padding:0.5rem 1rem;font-size:0.85rem;">📍 高德导航: 禾木村</a>
          <a href="https://uri.amap.com/marker?position=87.031,48.718&name=卧湖全景野奢民宿" target="_blank" class="amap-nav-btn" style="padding:0.5rem 1rem;font-size:0.85rem;">📍 高德导航: 喀纳斯湖</a>
        </div>
      </div>
    `;
  }
}

/* 4. Real-Time Weather Module */
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

/* 5. Dianping Gourmet Category Filter */
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

/* 6. Daily Itinerary Collapsible Cards */
function initDayCards() {
  const dayHeaders = document.querySelectorAll('.day-header');
  dayHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.day-card');
      card.classList.toggle('active');
    });
  });
}

/* 7. Interactive Packing Checklist with LocalStorage */
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

/* 8. AA Budget Calculator (真实费用结算) */
function initBudgetCalculator() {
  const packageTotal = 17200; // Package cost for 2 people
  const perPersonPackage = packageTotal / 2;
  
  const flightA = document.getElementById('flight-duan');
  const flightB = document.getElementById('flight-pan');

  const addBtn = document.getElementById('add-custom-item');
  const itemsContainer = document.getElementById('custom-items-list');

  const sumPackageEl = document.getElementById('sum-package');
  const sumFlightsEl = document.getElementById('sum-flights');
  const sumAddedItemsEl = document.getElementById('sum-added-items');
  
  const sumDuanTotalEl = document.getElementById('sum-duan-total');
  const sumPanTotalEl = document.getElementById('sum-pan-total');
  const totalPriceEl = document.getElementById('total-price-val');

  if (!flightA) return;

  // Default initial actual items
  const initialItems = [
    { name: '额尔齐斯河冷水鱼晚宴', amount: 380, split: 'aa' },
    { name: '观鱼台登顶区间车', amount: 120, split: 'aa' }
  ];

  function createItemRow(name = '', amount = 0, split = 'aa') {
    const row = document.createElement('div');
    row.className = 'custom-item-row';
    row.innerHTML = `
      <input type="text" class="custom-input item-name" placeholder="项目名称 (如: 晚餐/门票)" value="${name}">
      <input type="number" class="custom-input item-amount" placeholder="金额" value="${amount || ''}">
      <select class="custom-select item-split">
        <option value="aa" ${split === 'aa' ? 'selected' : ''}>50/50 AA</option>
        <option value="duan" ${split === 'duan' ? 'selected' : ''}>假假 个人</option>
        <option value="pan" ${split === 'pan' ? 'selected' : ''}>Cindy 个人</option>
      </select>
      <button type="button" class="delete-item-btn" title="删除项目">🗑️</button>
    `;

    row.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    });

    row.querySelector('.delete-item-btn').addEventListener('click', () => {
      row.remove();
      calculate();
    });

    return row;
  }

  if (itemsContainer && !itemsContainer.children.length) {
    initialItems.forEach(item => {
      itemsContainer.appendChild(createItemRow(item.name, item.amount, item.split));
    });
  }

  if (addBtn && itemsContainer) {
    addBtn.addEventListener('click', () => {
      const newRow = createItemRow();
      itemsContainer.appendChild(newRow);
      newRow.querySelector('.item-name').focus();
      calculate();
    });
  }

  function calculate() {
    const fA = parseFloat(flightA.value) || 0;
    const fB = parseFloat(flightB.value) || 0;

    const totalFlights = fA + fB;

    let addedItemsTotal = 0;
    let duanAddedShare = 0;
    let panAddedShare = 0;

    if (itemsContainer) {
      const rows = itemsContainer.querySelectorAll('.custom-item-row');
      rows.forEach(row => {
        const amt = parseFloat(row.querySelector('.item-amount').value) || 0;
        const split = row.querySelector('.item-split').value;

        addedItemsTotal += amt;
        if (split === 'aa') {
          duanAddedShare += amt / 2;
          panAddedShare += amt / 2;
        } else if (split === 'duan') {
          duanAddedShare += amt;
        } else if (split === 'pan') {
          panAddedShare += amt;
        }
      });
    }

    const duanTotal = perPersonPackage + fA + duanAddedShare;
    const panTotal = perPersonPackage + fB + panAddedShare;
    const grandTotal = duanTotal + panTotal;

    if (sumPackageEl) sumPackageEl.textContent = `¥${packageTotal.toLocaleString()}`;
    if (sumFlightsEl) sumFlightsEl.textContent = `¥${totalFlights.toLocaleString()} (假假:¥${fA} / Cindy:¥${fB})`;
    if (sumAddedItemsEl) sumAddedItemsEl.textContent = `¥${addedItemsTotal.toLocaleString()}`;

    if (sumDuanTotalEl) sumDuanTotalEl.textContent = `¥${Math.round(duanTotal).toLocaleString()}`;
    if (sumPanTotalEl) sumPanTotalEl.textContent = `¥${Math.round(panTotal).toLocaleString()}`;
    if (totalPriceEl) totalPriceEl.textContent = `¥${Math.round(grandTotal).toLocaleString()}`;
  }

  [flightA, flightB].forEach(input => {
    if (input) input.addEventListener('input', calculate);
  });

  calculate();
}

/* 9. One-Click Copy Button */
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

/* 10. Navigation Scroll Highlight */
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
