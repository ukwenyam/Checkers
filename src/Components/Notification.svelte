<script>
    export let header;
    export let icon;
    export let body;

    const notification = new Notification(header, {
        body: body,
        icon: icon,
        vibrate: [200, 100, 200]
    });
</script>