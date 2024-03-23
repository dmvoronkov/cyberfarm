document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container');
  const user = await checkSession();

  if (user) {
    loadMenu(container, user);
  } else {
    loadLoginForm(container);
  }
});
