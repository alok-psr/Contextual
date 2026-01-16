console.log("service worker loaded");

function getRegisteredKeybindings() {
    chrome.commands.getAll((commands) => {
        console.log("=== REGISTERED KEYBINDINGS ===");
        if (commands.length === 0) {
            console.warn("no commands registered!");
            return;
        }
        
        commands.forEach(cmd => {
            const shortcut = cmd.shortcut || "Not set";
            const name = cmd.name || "Unknown";
            const description = cmd.description || "";
            
            console.log(`Command: ${name}`);
            console.log(`  Shortcut: ${shortcut}`);
            console.log(`  Description: ${description}`);
            
            if (!cmd.shortcut) {
                console.log(` No shortcut assigned to "${name}"`);
            }
        });
        console.log("==============================");
    });
}
getRegisteredKeybindings();


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
    
    if (msg.type === "FILE_CONTENT"){
        console.log("FILE_CONTENT received:", msg.content);
        
        
        chrome.storage.local.set({ content: msg.content });
        
        const sourceURL = sender.tab ? sender.tab.url : null;
        if (sourceURL) {
            chrome.storage.local.set({ sourceURL: sourceURL });
        }
        chrome.storage.local.get(["selectedPath"], (result) => {
            if (result.selectedPath) {
                console.log("Auto-saving to previously selected node:", result.selectedPath);
                

                handleAutoSave({
                    path: result.selectedPath,
                    content: msg.content,
                    source: msg.sourceURL
                });
            } else {
                console.log("no previously selected node found");
            }
        });
        
    }
    
    if (msg.type === "FORM-SUBMITTED"){
        chrome.storage.local.get(["content", "sourceURL"], (result) => {
            handleLocalSave(msg.formData, msg.toggleData, result.content, result.sourceURL);
        });
    }
    
    return true;
});

// Function to auto-save content to previously selected node
const handleAutoSave = async({ path, content, source }) => {
    console.log("Auto-saving content to:", path);
    
    try {
        
        const styling = {
            br: false,
            brLine: false,
            newHead: false,
            time: false
        };
        
        const response = await fetch(`http://localhost:3000/api/content/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: path,
                content: content,
                source: source || '',
                title: '',
                note: '',
                styling: styling
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Content auto-saved successfully:', data);
    } catch (error) {
        console.log("err occ when auto saving :: ",error)
    }
};

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