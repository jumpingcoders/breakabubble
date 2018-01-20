browser.runtime.onMessage.addListener((message) => {
    browser.storage.local.set(
        {
            userId: message.userId
        }
    );
});