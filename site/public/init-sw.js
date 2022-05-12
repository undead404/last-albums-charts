if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // the sw.js will be created by workbox
    navigator.serviceWorker.register('/sw.js');
  });
}
