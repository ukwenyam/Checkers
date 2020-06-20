<script>
    export let header;
    export let icon;
    export let body;

    navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(header, {
            body: body,
            icon: icon,
            vibrate: [200, 100, 200, 100, 200, 100, 200]
        });
    });
</script>