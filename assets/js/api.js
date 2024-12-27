// Set up an interval to simulate activity every 10 minutes
setInterval(() => {
    // Scroll the page down by 1 pixel and back up
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
}, 600000); // 600000 ms = 10 minutes
