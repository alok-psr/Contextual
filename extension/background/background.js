console.log("service worker loaded");


// keybindings listener
chrome.commands.onCommand.addListener(async (command) => {
    console.log("=== COMMAND FIRED ===", command);
    
    if(command === 'process-content'){
        console.log("process-content shortcut pressed");
        try {
            const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
            if(!tab.id){
                console.log("no tab id found");
                return;
            }
            chrome.tabs.sendMessage(tab.id, {
                type:"GET_CONTENT"
            });
        } catch (error) {
            console.error("Error in process-content:", error);
        }
    }

    if (command === "process-popup"){
        console.log("process-popup action received");
        try {
            const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
            
            if(tab.id){
                chrome.tabs.sendMessage(tab.id, {
                    type:"GET_CONTENT"
                });
            }
            
            // opening popup .. gave err so put a timeout to wait for it to open fully
            setTimeout(() => {
                chrome.action.openPopup().catch(error => {
                    console.log("Error opening popup (may be expected):", error.message);
                });
            }, 150);
        } catch (error) {
            console.log("err occ when opening popup ::", error);
        }
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed/reloaded, reason:", details.reason);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("message received:", msg.type);
    
    if (msg.type === "FORM-SUBMITTED"){
        chrome.storage.local.get(["content", "sourceURL"], (result) => {
            handleLocalSave(msg.formData, msg.toggleData, result.content, result.sourceURL);
        });
    }
    
    return true;
});

const handleLocalSave = async(formData, toggleData, content, url) => {
    console.log("content:: ", content, "url :: ", url);
    try {
        const response = await fetch(`http://localhost:3000/api/content${toggleData.newNode ? '/new':'/'}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: formData.title,
                note: formData.note,
                path: formData.path,
                content: content,
                source: url,
                "styling": {
                    "br": toggleData.break,
                    "newHead": toggleData.newHead,
                    "brLine": toggleData.brLine,
                    "time": toggleData.time
                }
            })
        });
        
        const data = await response.json();
        console.log('Success adding data locally:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};