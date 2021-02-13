const fs = require('fs')
    , md = require("marked")
    , pug = require('pug')
    , yamlFrontmatter = require('yaml-front-matter')
    , yamlEditor = require('js-yaml')
    , pckStatic = require('node-static')
    , publicDir = new pckStatic.Server('./');

const config = yamlEditor.safeLoad(fs.readFileSync('config.yml', 'utf8'));
let file = fs.readFileSync(config.source, 'utf8');
file = yamlFrontmatter.loadFront(file);

const page = {
    title: file.title,
    subTitle: false,
    content: md(file.__content)
}
delete file;

const htmlRender = pug.compileFile('template.pug')(page);

fs.writeFile('index.html', htmlRender, (err) => {
    if (err) {console.error('Err.', '\x1b[0m', 'Make file : ' + err)}
    
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            publicDir.serve(request, response);
        }).resume();
    }).listen(8080);

    console.log('\x1b[34m', 'Page generated', '\x1b[0m')
    console.log('\x1b[0m', 'join http://localhost:8080/', '\x1b[0m')
});