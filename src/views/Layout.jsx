const React = require('react');

module.exports = function Layout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CyberFarm 1.0.0 Возроди землю после катастрофы</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/forms.css" />
        <script defer src="/js/Plant.js" />
        <script defer src="/js/Plot.js" />
        <script defer src="/js/IsoWorld.js" />
        <script defer src="/js/functions.js" />
        <script defer src="/js/application.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
