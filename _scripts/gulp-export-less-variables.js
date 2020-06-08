const gutil = require('gulp-util');
const through = require('through2');
const lessToJs = require('less-vars-to-js');
const File = require('vinyl');
const path = require('path');

const disclaimer = `
// -----------------------------------------
//             Autogenerated
//           DO NOT EDIT BY HAND
// -----------------------------------------
`.trim();

function createLessExports(variables) {
    const exportContent = Object.keys(variables)
        .map((variable) => `  ${variable}: @${variable};`)
        .join('\n');

    return `${disclaimer}\n:export {\n${exportContent}\n}`;
}

function createDTSExports(variables) {
    const variablesDefinition = Object.keys(variables)
        .map((variable) => `        '${variable}': string;`)
        .join('\n');
    const variablesConst = `    const variables: {\n${variablesDefinition}\n    };`;
    return `${disclaimer}\ndeclare module 'nav-frontend-core' {\n${variablesConst}\n    export default variables;\n}`;
}

function createFile(dir, filename, content) {
    return new File({
        base: dir,
        path: path.join(dir, filename),
        contents: Buffer.from(content)
    });
}

function plugin(file, env, callback) {
    if (file.isNull()) {
        this.push(file);
        // do nothing if no contents
        return callback();
    }

    if (file.isStream()) {
        this.emit('error', new gutil.PluginError('addVariablesExport', 'Streaming not supported'));
        return callback();
    }

    if (file.isBuffer()) {
        const pathinfo = path.parse(file.path);
        const content = Buffer.from(file.contents)
            .toString()
            .trim();

        const variables = lessToJs(content, { stripPrefix: true });
        const lessExport = createLessExports(variables);
        const dtsExport = createDTSExports(variables);
        const lessExportFile = createFile(pathinfo.dir, `${pathinfo.name}-exports.less`, lessExport);
        const dtsExportFile = createFile(pathinfo.dir, `${pathinfo.name}.d.ts`, dtsExport);

        this.push(lessExportFile);
        this.push(dtsExportFile);
        return callback();
    }

    throw new Error(`Unhandled filetype: ${file.path}`);
}

module.exports = function addVariablesExport() {
    return through.obj(plugin);
};
