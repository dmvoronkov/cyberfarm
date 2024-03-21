const React = require('react');

const Layout = require('./Layout');

module.exports = function Menu() {
  return (
    <Layout>
      <div className="container" id="form-flex">
        <div className="form-container">
          <h1 id="game-title">Cyber Farm</h1>
          <a className="button" id="newGameBtn" href="#">Новая игра</a>
          <a className="button" id="loadGameBtn" href="#">Загрузить игру</a>
          <a className="button" id="statsBtn" href="#">Статистика</a>
          <a className="button" id="logoutBtn" href="#">Выйти</a>
        </div>
      </div>
    </Layout>
  );
};
