document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');

  function checkCookie(cname) {
    return document.cookie.includes(cname);
  }

  if (checkCookie('cyberfarm')) {
    loadMenu(container);
  } else {
    loadLoginForm(container);
  }
});
