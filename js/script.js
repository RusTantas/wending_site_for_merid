(function () {
  // GOOGLE SHEETS URL — ВАШ URL ОТ APPS SCRIPT
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwWR3rgX4R9eA_fE51GjxzXf42-CTXv1uKRE4h5-U8WdJze0FCBhCGJvvCmvSuZNkw6/exec';
  
  // НАСТРОЙКИ ДОСТУПА К АДМИН-ПАНЕЛИ
  const ADMIN_USER = 'DARIY';
  const ADMIN_PASS = 'SASHA';
  const ADMIN_TABLE_URL = 'https://docs.google.com/spreadsheets/d/1ocJX13fy9TZxosVoTIxS5e2ssUqpPxSducE7xH9d_ak/edit?gid=0#gid=0';

  // === 1. ОТПРАВКА В GOOGLE ТАБЛИЦЫ ===
async function sendToGoogleSheets(formData) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',  // ← это решает проблему CORS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    // При mode: 'no-cors' мы не можем получить ответ,
    // поэтому просто считаем, что всё успешно
    return { success: true };
  } catch (error) {
    console.error('Ошибка отправки:', error);
    return { success: false, error: error };
  }
}

  // === 2. ТАЙМЕР ===
  function initCountdown() {
    const target = new Date('2026-06-21T15:30:00').getTime();
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');

    if (!daysEl) return;

    function update() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minsEl.textContent = '0';
        secsEl.textContent = '0';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minsEl.textContent = mins;
      secsEl.textContent = secs;
    }

    update();
    setInterval(update, 1000);
  }

  // === 3. ПРОКРУТКА ПО СТРЕЛКЕ ===
  function initScrollHint() {
    const scrollHint = document.querySelector('.arrow');
    if (!scrollHint) return;
    
    scrollHint.addEventListener('click', function(e) {
      e.preventDefault();
      const nextSection = document.querySelector('.weekday');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // === 4. МОДАЛЬНОЕ ОКНО АДМИНКИ ===
  function showAdminLoginModal() {
    const overlay = document.createElement('div');
    overlay.id = 'admin-modal-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.85); display: flex; align-items: center;
      justify-content: center; z-index: 2000;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white; padding: 35px 25px; border-radius: 30px;
      text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      max-width: 350px; width: 90%; font-family: 'Cormorant-Regular', serif;
    `;
    modal.innerHTML = `
      <h3 style="margin: 0 0 25px 0; font-size: 32px; color: #4d3e2a;">Вход в панель</h3>
      <input type="text" id="admin-login-username" placeholder="Логин" style="
        display: block; width: 100%; padding: 12px; margin: 15px 0;
        border: 1px solid #cbc5af; border-radius: 15px; font-size: 18px;
        box-sizing: border-box;
      ">
      <input type="password" id="admin-login-password" placeholder="Пароль" style="
        display: block; width: 100%; padding: 12px; margin: 15px 0 25px;
        border: 1px solid #cbc5af; border-radius: 15px; font-size: 18px;
        box-sizing: border-box;
      ">
      <div id="admin-login-error" style="color: #d33; margin-bottom: 15px; font-size: 16px;"></div>
      <button id="admin-login-submit" style="
        background: #c6c1a8; border: none; padding: 10px 25px;
        border-radius: 40px; font-size: 22px; cursor: pointer; width: 100%;
      ">Войти</button>
      <button id="admin-login-close" style="
        background: transparent; border: none; margin-top: 20px;
        font-size: 18px; cursor: pointer; color: #888; width: 100%;
      ">Отмена</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const submitBtn = modal.querySelector('#admin-login-submit');
    const closeBtn = modal.querySelector('#admin-login-close');
    const errorDiv = modal.querySelector('#admin-login-error');
    const usernameInput = modal.querySelector('#admin-login-username');
    const passwordInput = modal.querySelector('#admin-login-password');

    const checkCredentials = () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        window.open(ADMIN_TABLE_URL, '_blank');
        document.body.removeChild(overlay);
      } else {
        errorDiv.textContent = '❌ Неверный логин или пароль';
      }
    };

    submitBtn.addEventListener('click', checkCredentials);
    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
    
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkCredentials();
    });
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkCredentials();
    });
  }

  // === 5. ФОРМА RSVP (ГЛАВНАЯ) ===
  function initForm() {
    const form = document.getElementById('guest-form');
    const message = document.getElementById('form-message');
    const attendanceNo = document.getElementById('attendance-no');
    const wishesGroup = document.getElementById('wishes-group');

    if (!form) return;

    // Показываем/скрываем пожелания
    if (attendanceNo && wishesGroup) {
      const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
      attendanceRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          wishesGroup.style.display = attendanceNo.checked ? 'block' : 'none';
        });
      });
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();  // ← ЭТО ГЛАВНОЕ — НЕ ДАЁТ ОБНОВИТЬСЯ СТРАНИЦЕ
      
      console.log('Форма отправлена');

      // Собираем данные
      const fullname = document.getElementById('guest-fullname').value.trim();
      const persons = parseInt(document.getElementById('guest-persons').value, 10) || 1;
      const attendanceInput = form.querySelector('input[name="attendance"]:checked');
      const transportCheckboxes = form.querySelectorAll('input[name="transport"]:checked');
      const drinkCheckboxes = form.querySelectorAll('input[name="drinks"]:checked');
      const wishes = document.getElementById('guest-wishes') ? document.getElementById('guest-wishes').value.trim() : '';
      
      const attendance = attendanceInput ? attendanceInput.value : '';
      const transport = Array.from(transportCheckboxes).map(cb => cb.value).join(', ');
      const drinks = Array.from(drinkCheckboxes).map(cb => cb.value).join(', ');

      // Валидация
      if (!fullname) {
        showMessage('Пожалуйста, укажите ваше имя', 'error');
        return;
      }
      if (!attendance) {
        showMessage('Пожалуйста, укажите, сможете ли вы присутствовать', 'error');
        return;
      }
      if (attendance === 'no' && !wishes) {
        showMessage('Пожалуйста, напишите пожелания молодожёнам 🤍', 'error');
        return;
      }

      // Формируем объект
      const guest = {
        fullname: fullname,
        persons: persons,
        attendance: attendance,
        transport: transport || '',
        drinks: drinks || '',
        wishes: wishes || ''
      };

      console.log('Отправляем в Google:', guest);

      // Отправляем
      const result = await sendToGoogleSheets(guest);

      if (result.success) {
        if (attendance === 'yes') {
          showMessage('Спасибо! Ваш ответ сохранен. Ждем встречи! 🎉', 'success');
        } else {
          showMessage('Спасибо за пожелания! 🤍', 'success');
        }
        form.reset();
        if (wishesGroup) wishesGroup.style.display = 'none';
      } else {
        showMessage('Ошибка! Попробуйте ещё раз.', 'error');
      }
    });

    function showMessage(text, type) {
      if (!message) return;
      message.textContent = text;
      message.className = 'form-message form-message--' + type;
      setTimeout(function() {
        message.className = 'form-message';
      }, 5000);
    }
  }

  // === 6. АДМИН-КНОПКА ===
  function initAdminButton() {
    const adminBtn = document.getElementById('admin-access-btn');
    if (adminBtn) {
      adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showAdminLoginModal();
      });
    }
  }

  // === 7. ЗАПУСК ===
  document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initForm();
    initScrollHint();
    initAdminButton();
  });
})();