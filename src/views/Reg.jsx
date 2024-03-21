const React = require('react');

const Layout = require('./Layout');

module.exports = function Reg() {
  return (
    <Layout>
      <div className="container" id="form-flex">
        <div className="form-container">
          <h1 id="game-title">Cyber Farm</h1>
          <h2>Регистрация</h2>
          <form method="POST" action="/api/user">
            <input type="text" name="username" id="username" placeholder="Введите уникальное имя" required />
            <div className="error username-error" />
            <input type="email" name="email" id="email" placeholder="Введите свой email" required />
            <div className="error email-error" />
            <input type="password" name="password" id="password" placeholder="Придумайте пароль" required />
            <div className="error password-error" />
            <button type="submit">Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
