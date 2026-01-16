import directoryTree from 'directory-tree' 

// helper function keep only directories
function filterTree(node) {
    if (!node) return null
    
    if (node.type === 'file') {
        return null
    }
    
    if (node.children && node.children.length > 0) {
        node.children = node.children.map(child => filterTree(child)).filter(child => child !== null)
    }
    
    return node
}

const getTree = async(req, res) => {
    try {
        const tempPath = '/home/alok/my_files/projects/contextual/testDir/testing'
    
        const tree = directoryTree(tempPath, {
          exclude: [/\.obsidian/,/\.md/]
        })
        
        
        const foldersOnly = filterTree(tree)
        
        console.log(foldersOnly)
        console.log('-------------------')
        res.json({tree: foldersOnly})
    } catch (error) {
        console.log('-------------------')
        console.log("err occoured ::", error)
        console.log('-------------------')
        res.status(500).json({ error: 'failed to build tree' })
    }
}

export default getTree