function loadMenu(container) {
  container.innerHTML = '';
  container.className = 'container neon-bg';
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  formContainer.innerHTML = `
    <h1 id="game-title">Cyber Farm</h1>
    <h2>Главное меню</h2>
    <a class="button" id="newGameBtn" href="#">Новая игра</a>
    <a class="button" id="loadGameBtn" href="#">Загрузить игру</a>
    <a class="button" id="logoutBtn" href="#">Выйти</a>`;
  container.appendChild(formContainer);

  const newGameBtn = formContainer.querySelector('#newGameBtn');
  const loadGameBtn = formContainer.querySelector('#loadGameBtn');
  const logoutBtn = formContainer.querySelector('#logoutBtn');

  newGameBtn.addEventListener('click', (event) => {
    event.preventDefault();
    startGame(container);
  });

  loadGameBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await loadAllUserSaves(container);
  });

  logoutBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      loadLoginForm(container);
    } catch (error) {
      console.log(error);
    }
  });
}

async function getRandomImage() {
  try {
    const response = await fetch('https://source.unsplash.com/random/?cyberpunk');
    return response.url;
  } catch (error) {
    console.log(error);
  }
}

async function loadAllUserSaves(container) {
  try {
    const response = await fetch('/api/save/all');
    const savesArray = await response.json();
    container.innerHTML = '';
    container.className = 'container neon-bg';
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
          <h1 id="game-title">Cyber Farm</h1>
          <h2>Сохраненные игры</h2>`;
    const image = await getRandomImage();
    const allSavesDiv = document.createElement('div');
    allSavesDiv.className = 'all-saves';
    const savesDivs = savesArray.map((save) => {
      const saveDiv = document.createElement('div');
      saveDiv.className = 'save-div';
      saveDiv.id = save.id;
      saveDiv.innerHTML = `
      <div class="image"><img src="${image}" alt="cyberpunk" /></div>
      <div class="info">
        <h3>${new Date(save.updatedAt).toLocaleString('ru-RU', { timeZone: 'UTC' })}</h3>
        <p>Собранный урожай: <span class="digits">${save.harvested}</span>/<span class="digits">${save.required_harvest}</span></p>
        <p>Уровень энергии: <span class="digits">${save.energy}</span></p>
        <br />
        <a href="#" class="loadGameLink">Загрузить</a> <a href="#" class="deleteSaveLink">Удалить</a>
      </div>`;
      return saveDiv;
    });

    savesDivs.forEach((div) => allSavesDiv.appendChild(div));
    formContainer.appendChild(allSavesDiv);
    const formFooter = document.createElement('div');
    formFooter.className = 'form-footer';
    const backLink = document.createElement('a');
    backLink.id = 'back-link';
    backLink.href = '#';
    backLink.innerText = 'Назад в главное меню';
    formFooter.appendChild(backLink);
    formContainer.appendChild(formFooter);
    container.appendChild(formContainer);
    getRandomImage();

    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      loadMenu(container);
    });

    allSavesDiv.addEventListener('click', async (event) => {
      if (event.target.classList.contains('loadGameLink')) {
        event.preventDefault();
        const saveId = Number(event.target.closest('.save-div').id);
        const save = savesArray.find((el) => el.id === saveId);
        startGame(container, save);
      }
      if (event.target.classList.contains('deleteSaveLink')) {
        event.preventDefault();
        const saveDiv = event.target.closest('.save-div');
        const response = await fetch('/api/save', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: Number(saveDiv.id) }),
        });
        const result = await response.json();
        saveDiv.remove();
        console.log(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function loadRegisterForm(container) {
  container.innerHTML = '';
  container.className = 'container neon-bg';
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  const registerForm = document.createElement('form');
  registerForm.id = 'register-form';
  registerForm.method = 'POST';
  registerForm.action = '/api/user';
  registerForm.innerHTML = `
    <input type="text" name="username" id="username" placeholder="Введите уникальное имя" required />
    <div class="error username-error"></div>
    <input type="email" name="email" id="email" placeholder="Введите свой email" required />
    <div class="error email-error"></div>
    <input type="password" name="password" id="password" placeholder="Придумайте пароль" required />
    <div class="error password-error"></div>
    <button type="submit">Зарегистрироваться</button>`;
  formContainer.innerHTML = `
          <h1 id="game-title">Cyber Farm</h1>
          <h2>Регистрация</h2>`;
  formContainer.appendChild(registerForm);
  const formFooter = document.createElement('div');
  formFooter.className = 'form-footer';
  const loginLink = document.createElement('a');
  loginLink.id = 'login-link';
  loginLink.href = '#';
  loginLink.innerText = 'Войти';
  formFooter.innerHTML = 'Уже есть аккаунт? ';
  formFooter.appendChild(loginLink);
  formContainer.appendChild(formFooter);
  container.appendChild(formContainer);

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadLoginForm(container);
  });
  container.appendChild(formContainer);

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(registerForm);
    const inputs = Object.fromEntries(data);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      const result = await response.json();
      const errorDivs = registerForm.querySelectorAll('.error');
      let errorDiv;
      if (result.status === '422') {
        if (result.error === 'Users_username_key') {
          errorDiv = registerForm.querySelector('.username-error');
          errorDivs.forEach((el) => el.innerText = '');
          errorDiv.innerText = result.message;
        }
        if (result.error === 'Users_email_key') {
          errorDiv = registerForm.querySelector('.email-error');
          errorDivs.forEach((el) => el.innerText = '');
          errorDiv.innerText = result.message;
        }
      }
      if (result.status === '201') {
        loadMenu(container);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function loadLoginForm(container) {
  container.innerHTML = '';
  container.className = 'container neon-bg';
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  const loginForm = document.createElement('form');
  loginForm.id = 'login-form';
  loginForm.method = 'POST';
  loginForm.action = '/api/user/login';
  loginForm.innerHTML = `
    <input type="text" name="username" id="username" placeholder="Введите имя пользователя" required />
    <div class="error username-error"></div>
    <input type="password" name="password" id="password" placeholder="Введите пароль" required />
    <div class="error password-error"></div>
    <button type="submit">Войти</button>`;
  formContainer.innerHTML = `
          <h1 id="game-title">Cyber Farm</h1>
          <h2>Вход в аккаунт</h2>`;
  formContainer.appendChild(loginForm);
  const formFooter = document.createElement('div');
  formFooter.className = 'form-footer';
  const registerLink = document.createElement('a');
  registerLink.id = 'register-link';
  registerLink.href = '#';
  registerLink.innerText = 'Зарегистрироваться';
  formFooter.innerHTML = 'Впервые здесь? ';
  formFooter.appendChild(registerLink);
  formContainer.appendChild(formFooter);
  container.appendChild(formContainer);

  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadRegisterForm(container);
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const inputs = Object.fromEntries(data);
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      const result = await response.json();
      const errorDivs = loginForm.querySelectorAll('.error');
      let errorDiv;
      if (result.status === '404') {
        errorDiv = loginForm.querySelector('.username-error');
        errorDivs.forEach((el) => el.innerText = '');
        errorDiv.innerText = result.message;
      }
      if (result.status === '403' || result.status === '500') {
        errorDiv = loginForm.querySelector('.password-error');
        errorDivs.forEach((el) => el.innerText = '');
        errorDiv.innerText = result.message;
      }
      if (result.status === '200') {
        loadMenu(container);
      }
    } catch (error) {
      console.log(error);
    }
  });
}
