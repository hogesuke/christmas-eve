import Canvas from './Canvas';

window.addEventListener('DOMContentLoaded', async () => {
  const canvas = new Canvas();

  await canvas.loadAssets();

  canvas.init();
  canvas.render();

  const mainElement = document.getElementById('main');
  mainElement.classList.add('hide');
});
