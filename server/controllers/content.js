// body contains path:string,content:string,note:string,source styling:{br:bool,brLine:bool,newHead:bool}

import fs from 'fs/promises'
import formatMarkdown from '../utils/mdTemplate.js';

const existingFile = async(req, res) => {
    const { path, styling, content, source, title = '', note = '' } = req.body;
    
    const finalContent = formatMarkdown(content, source, styling, title, note ) 
    console.log(finalContent)
    
    await fs.appendFile(`${path}/main.md`, finalContent)

    res.status(200).json({
        success: true,
        path
    })
}

const newFile = async(req, res) => {
    const { path, styling, content, source, title = '', note = '' } = req.body;

    try {
        await fs.mkdir(`${path}/${title}`, { recursive: false })
        await fs.appendFile(`${path}/${title}/main.md`, `# ${title}\n---\n`)
        console.log("dir created successfully")
    } catch (err) {
        console.log("unable to create dir at ", path, " :: ", err)
    }


    const finalContent = formatMarkdown( content, source, styling, title, note ) 
    console.log(finalContent)
    await fs.appendFile(`${path}/${title}/main.md`, finalContent)

    res.status(200).json({
        success: true,
        path: `${path}/${title}`
    })
}

export {existingFile, newFile}