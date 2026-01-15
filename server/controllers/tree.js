
/* 
 
tree struct 



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

keys {
    name,
    path,
    children[]
}

*/

import directoryTree from 'directory-tree' 

const getTree = async(req,res)=>{
    try {
        const tempPath = '/home/alok/my_files/projects/contextual/codebase/extension/'
    
        const tree = directoryTree(tempPath,{
          exclude: /\.md$/i
        })
        console.log(tree)
        console.log('-------------------')
        res.json({tree})
    } catch (error) {
        console.log('-------------------')
        console.log("err occoured ::", error)
        console.log('-------------------')
    }
    
}


export default getTree
