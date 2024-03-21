const React = require('react');

module.exports = function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CyberFarm - Survive in post-apocalyptic world</title>
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/forms.css" />
        <script defer src="/js/forms.js" />
        <script defer src="/js/IsoWorld.js" />
        <script defer src="/js/application.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
