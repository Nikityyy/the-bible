// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('[SW] Registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('[SW] Registration failed:', error);
            });
    });

    // Listen for updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}
