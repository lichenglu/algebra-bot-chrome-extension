chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        appState: {
            enableChatbot: true
        }
    })
})