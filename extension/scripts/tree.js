const tempTree = {
    id: "root",
    name: "contextual",
    path: "/home/alok/contextual",
    mainFile: "main.md",
    children: [
      {
        id: "ai",
        name: "AI",
        path: "/home/alok/contextual/AI",
        mainFile: "main.md",
        children: [
          {
            id: "ml",
            name: "Machine-Learning",
            path: "/home/alok/contextual/AI/Machine-Learning",
            mainFile: "main.md",
            children: [
              {
                id: "nn",
                name: "Neural-Networks",
                path: "/home/alok/contextual/AI/Machine-Learning/Neural-Networks",
                mainFile: "main.md",
                children: []
              }
            ]
          },
          {
            id: "llms",
            name: "LLMs",
            path: "/home/alok/contextual/AI/LLMs",
            mainFile: "main.md",
            children: []
          }
        ]
      },
      {
        id: "systems",
        name: "Systems",
        path: "/home/alok/contextual/Systems",
        mainFile: "main.md",
        children: [
          {
            id: "os",
            name: "Operating-Systems",
            path: "/home/alok/contextual/Systems/Operating-Systems",
            mainFile: "main.md",
            children: []
          }
        ]
      }
    ]
}
  

const treeDiv = document.getElementById("tree")
// first child as there will be at least the root present
let child = document.createElement("h3")
child.innerText = tempTree.name
// child.classList.add(`hover:bg-cyan-200 pt-2`)
child.id = tempTree.path
child.classList.add("tree-node-root")

treeDiv.appendChild(child)

// fill the treee from the given data ... later api willl provide the object of tree
function addChilds(childArr,root,tab=2,styleChar = '_'){
    if (childArr.length === 0){
        return
    }
    for (child of childArr){
        let childEle = document.createElement("h3")

        // the underlines before the node in tree |__
        let cont = `|${Array(3).join(styleChar)} ${child.name}`;
        childEle.innerText = cont

        // space on the left of underlins
        childEle.style.marginLeft = `${tab * 0.5}rem`; 
        childEle.classList.add("tree-node")
        // we can get this path when the user clicks on the text
        childEle.id = child.path

        root.appendChild(childEle)
        addChilds(child.children,root,tab+2)
    }
}

addChilds(tempTree.children, treeDiv,2,'_')

// at a time only one of the nodes should be selected 
// on click the node is selected and if any other node has selected class then it is removed
treeDiv.addEventListener("click", (e) => {
  const node = e.target.closest(".tree-node, .tree-node-root")
  if (!node) return

  document.querySelectorAll(".tree-node.selected, .tree-node-root.selected")
      .forEach(el => el.classList.remove("selected"))

  node.classList.add("selected")
})