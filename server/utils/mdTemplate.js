export default function formatMarkdown(content, source,styling,title='', note='') {
    
    const now = new Date()

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDateTime);
    
    
    return `${styling.brLine? '- - -':''}\n${styling.newHead ? '##':'<br>'} ${title == '' ? formattedDateTime:title}  ${styling.time?`----${formattedDateTime}---- [source](${source})`:`---- [source](${source})`}\n ${content}\n<span style="color: #fdf59b;">${note}</span>\n\n${styling.brLine? '- - -':''}`
}
  