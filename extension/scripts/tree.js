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
child.id = tempTree.id

treeDiv.appendChild(child)

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
        // childEle.classList.add("hover:bg-cyan-200","pt-2")
        childEle.id = child.id
        
        root.appendChild(childEle)
        addChilds(child.children,root,tab+2)
    }
}

addChilds(tempTree.children, treeDiv,2,'_')
