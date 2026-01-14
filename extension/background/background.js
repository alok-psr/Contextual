console.log("service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});



chrome.commands.onCommand.addListener(async ( command )=>{
    if(command === 'process-content'){
        console.log("shortcut pressed")

        const [tab] =await chrome.tabs.query({active:true,currentWindow:true})
        console.log("tab url :: " ,tab.url)
        if(!tab.id){
            console.log("no tab id found");
            return
        }
        chrome.tabs.sendMessage(tab.id,{
            type:"GET_CONTENT"
        })
    }
})

chrome.runtime.onMessage.addListener((msg)=>{
    if (msg.type==="FILE_CONTENT"){
        console.log(msg.content)
        // send the content to local server which will then add it to the respective node .md file
    }
})