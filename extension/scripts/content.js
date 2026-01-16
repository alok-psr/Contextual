console.log('content script loaded');

// function to get the selected text
function getContent() {
  const selected = window.getSelection().toString().trim();

  if (!selected) { 
    console.log("returning url")
    return document.URL 
  }
  console.log("returning selected");
  return selected
}

chrome.runtime.onMessage.addListener((msg)=>{
  console.log("msg from content.js :: ",msg.type);
  console.log("sending message ----------")
  if (msg.type === "GET_CONTENT"){
    const content = getContent();
    chrome.storage.local.set({content,sourceURL:document.URL})
    
    chrome.runtime.sendMessage({
      type: "FILE_CONTENT",
      content: content,
      sourceURL:  document.URL
    });
  
  }
})


