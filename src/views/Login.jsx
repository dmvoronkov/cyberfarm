const React = require('react');

const Layout = require('./Layout');

module.exports = function Login() {
  return (
    <Layout>
      <div className="container" id="form-flex">
        <div className="form-container">
          <h1 id="game-title">Cyber Farm</h1>
          <h2>Вход в аккаунт</h2>
          <form method="POST" action="/api/user/login">
            <input type="text" name="username" id="username" placeholder="Введите имя пользователя" required />
            <div className="error username-error" />
            <input type="password" name="password" id="password" placeholder="Введите пароль" required />
            <div className="error password-error" />
            <button type="submit">Войти</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
