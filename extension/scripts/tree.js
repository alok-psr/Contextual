// const tree = {
//     id: "root",
//     name: "contextual",
//     path: "/home/alok/contextual",
//     mainFile: "main.md",
//     children: [
//       {
//         id: "ai",
//         name: "AI",
//         path: "/home/alok/contextual/AI",
//         mainFile: "main.md",
//         children: [
//           {
//             id: "ml",
//             name: "Machine-Learning",
//             path: "/home/alok/contextual/AI/Machine-Learning",
//             mainFile: "main.md",
//             children: [
//               {
//                 id: "nn",
//                 name: "Neural-Networks",
//                 path: "/home/alok/contextual/AI/Machine-Learning/Neural-Networks",
//                 mainFile: "main.md",
//                 children: []
//               }
//             ]
//           },
//           {
//             id: "llms",
//             name: "LLMs",
//             path: "/home/alok/contextual/AI/LLMs",
//             mainFile: "main.md",
//             children: []
//           }
//         ]
//       },
//       {
//         id: "systems",
//         name: "Systems",
//         path: "/home/alok/contextual/Systems",
//         mainFile: "main.md",
//         children: [
//           {
//             id: "os",
//             name: "Operating-Systems",
//             path: "/home/alok/contextual/Systems/Operating-Systems",
//             mainFile: "main.md",
//             children: []
//           }
//         ]
//       }
//     ]
// }

// import { API_URL } from "../constants.js"

const API_URL = 'http://localhost:3000/api'

const fetchTree = async () => {
    try {
        const res = await fetch(`${API_URL}/tree`)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log('Tree data:', data)
        return data.tree
    } catch (error) {
        console.error('Error fetching tree:', error)
        return null
    }
}


const treeDiv = document.getElementById("tree")

fetchTree().then(tree => {
    if (!tree) {
        console.error('Failed to load tree')
        return
    }

    // first child as there will be at least the root present
    let child = document.createElement("h3")
    child.innerText = tree.name
    child.id = tree.path
    child.classList.add("tree-node-root")

    treeDiv.appendChild(child)

    // fill the tree from the given data
    function addChilds(childArr, root, tab = 2, styleChar = '_') {
        if (childArr.length === 0) {
            return
        }
        for (child of childArr) {
            let childEle = document.createElement("h3")


            let cont = `|${Array(3).join(styleChar)} ${child.name}`;
            childEle.innerText = cont


            childEle.style.marginLeft = `${tab * 0.5}rem`;
            childEle.classList.add("tree-node")
            // we can get this path when the user clicks on the text
            childEle.id = child.path

            root.appendChild(childEle)
            addChilds(child.children, root, tab + 2)
        }
    }

    addChilds(tree.children, treeDiv, 2, '_')

    const formPath = document.getElementById("formPath")
    // Load content and selected path from storage when popup opens
    function loadFormDataFromStorage() {
        chrome.storage.local.get(['content', 'selectedPath'], (result) => {
            const formContent = document.getElementById("formContent")

            // set formcontent
            if (formContent && result.content) {
                formContent.value = result.content
            }
            
            // set formpath
            if (result.selectedPath && formPath) {
                formPath.value = result.selectedPath
                
                // Find and select the corresponding node in the tree
                const selectedNode = document.getElementById(result.selectedPath)
                if (selectedNode) {
                    // Remove previous selection
                    document.querySelectorAll(".tree-node.selected, .tree-node-root.selected")
                        .forEach(el => el.classList.remove("selected"))
                    // Add selection to this node
                    selectedNode.classList.add("selected")
                }
            }
        })
    }
    
    // Load form data when page loads
    loadFormDataFromStorage()
    
    // Also listen for storage changes (in case content is updated while popup is open)
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            if (changes.content) {
                const formContent = document.getElementById("formContent")
                if (formContent) {
                    formContent.value = changes.content.newValue || ""
                }
            }
            if (changes.selectedPath) {
                const formPath = document.getElementById("formPath")
                if (formPath) {
                    formPath.value = changes.selectedPath.newValue || ""
                }
            }
        }
    })

    // at a time only one of the nodes should be selected 
    // on click the node is selected and if any other node has selected class then it is removed
    treeDiv.addEventListener("click", (e) => {
        const node = e.target.closest(".tree-node, .tree-node-root")
        if (!node) return

        document.querySelectorAll(".tree-node.selected, .tree-node-root.selected")
            .forEach(el => el.classList.remove("selected"))
        console.log(node.id)
        chrome.storage.local.set({selectedPath:node.id})
        node.classList.add("selected")
        
        // Update path field when node is selected
        if (formPath) {
            formPath.value = node.id
            // Store selected path in storage for persistence
            chrome.storage.local.set({ selectedPath: node.id })
        }
        
        // Load content from storage (in case it was updated)
        chrome.storage.local.get(['content'], (result) => {
            const formContent = document.getElementById("formContent")
            if (formContent && result.content) {
                formContent.value = result.content
            }
        })
    })
})

// Handle form submission
document.getElementById("submit")?.addEventListener("click", (e) => {
    e.preventDefault()
    
    const form = document.getElementById("contentForm")
    if (!form) return
    
    const formData = {
        title: document.getElementById("formTitle").value,
        content: document.getElementById("formContent").value,
        path: document.getElementById("formPath").value,
        note: document.getElementById("formNote").value
    }
    
    if (!formData.content || !formData.path) {
        alert("Content and Path are required fields!")
        return
    }
    
    const breakToggle = document.getElementById("break")
    const brLineToggle = document.getElementById("breakLine")
    const newHeadToggle = document.getElementById("newHeading")
    const newNodeToggle = document.getElementById("newNode")
    const timeToggle = document.getElementById("time")
    
    const toggleData = {
        break: breakToggle.checked,
        brLine: brLineToggle.checked,
        newHead: newHeadToggle.checked,
        newNode: newNodeToggle.checked,
        time: timeToggle.checked,
    }

    chrome.runtime.sendMessage({
        type:"FORM-SUBMITTED",
        formData,
        toggleData
    }, (response) => {
        if (response && response.success) {
            console.log("Success:", response);
            alert("Content saved successfully!");
            form.reset();
        } else {
            console.error("err occoured while saving data via server:", response);
            alert("Error: " + (response?.error || "Failed to save content"));
        }
    })
    
    
    console.log("Form submitted:", formData)
    
    
})