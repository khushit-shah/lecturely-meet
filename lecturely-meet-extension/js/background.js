let contextMenus = {};

contextMenus.createLecturelyMeet = chrome.contextMenus.create({
        "title": "Lecturely-Meet",
        "contexts": ["editable"]
    },
    function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    }
);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);

function contextMenuHandler(info, tab) {
    if (info.menuItemId === contextMenus.createLecturelyMeet) {
        tab.executeScript({
            file: 'js/client.js'
        });
    }
}