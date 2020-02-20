/* Módulos Node.js */
const fs = require('fs');
const path = require('path');

/* Librerías */
const dirTree = require("directory-tree");
const chalk = require('chalk');

/* Chequeo de ingreso de argumentos */
const argList = ['--validate', '--stats'];
let options = {
  validate: false,
  stats: false
};
console.log(options);
console.log(path.resolve('.'));

exports.checkArg = (arg1, arg2, arg3) => {
  if ((!arg1 && !arg2 && !arg3) || (argList.includes(arg1))) {
    console.error(chalk.red.bold('\nIngrese argumento(s) válido(s):\n \nRecuerde:\n node md-links path\n node md-links path --validate\n node md-links path --stats\n node md-links path --validate --stats\n'));
    console.error(chalk.blue.bold('\nEjemplo:\n node md-links ./some/example.md\n node md-links ./some/example.md --validate\n node md-links ./some/example.md --stats\n node md-links ./some/example.md --validate --stats\n'));
    process.exit(1);
  } else if (arg2 === '--validate' && arg3 === '--stats') {
    options.validate = true;
    options.stats = true;
    if (arg1 === '.') {
      arg1 = process.cwd();
    }

  } else if (arg2 === '--validate') {
    options.validate = true;
    options.stats = false;
    if (arg1 === '.') {
      arg1 = process.cwd();
    }

  } else if (arg2 === '--stats') {
    options.validate = false;
    options.stats = true;
    if (arg1 === '.') {
      arg1 = process.cwd();
    }

  }

  return [arg1, options.validate, options.stats];
};


/* --------------------------------------------------------------------------------------------------------- */

/* Ver si ruta es absoluta o relativa y convertir a absoluta*/
/* let r = new RegExp('^(?:[a-z]+:)?//', 'i'); */


exports.pathIsAbsolute = (arg1) => {
  const checkPath = path.resolve(arg1) === path.normalize(arg1).replace(/[\/|\\]$/, '');
  let newPath;

  /*let pathTest = r.test(arg1);
    console.log(pathTest); */

  if (!checkPath) {
    newPath = path.resolve(arg1);
  } else {
    newPath = arg1;
  }
  console.log(newPath);
  return newPath;
};

/* --------------------------------------------------------------------------------------------------------- */

/* Ver si es archivo o directorio */
/* fs.lstatSync(path) entrega información del archivo */

/* exports.fileOrDirectory = (newPath) => {
  const fsLstat = fs.lstatSync(newPath);
  if (fsLstat.isFile()) return 'file';
  else if (fsLstat.isDirectory()) return 'directory';
}; */

/* --------------------------------------------------------------------------------------------------------- */

/* Obtención de extensión del archivo */
exports.checkExt = file => path.extname(file);


/* --------------------------------------------------------------------------------------------------------- */

/* Archivos .md en un directorio y su cantidad */

let pathFile = [];
let count = 0;

let filesMdDirectory = (pathDirectory) => {

  dirTree(pathDirectory, {
    extensions: /\.md$/
  }, (item, path, stats, normalizePath) => {
    console.log(item);
    pathFile[count] = item.path;
    console.log(pathFile);
    count++;
    console.log(count);

  });

  if (count === 0) {
    console.log('No hay archivos con extensión .md');
  } else {
    console.log('total archivos en directorio ' + pathDirectory + ' con extensión .md: ' + count);
    console.log(pathFile);
  }

  /*return pathFile;*/

}

exports.filesMdDirectory = filesMdDirectory;

/*filesMdDirectory('.');*/


/* --------------------------------------------------------------------------------------------------------- */

/* Lectura de archivos md*/
/* Captura de links: href, text y file */

let pathMdFile = 'README.md'

let readNewFile = (pathMdFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathMdFile, "utf8", (error, data) => {
      if (error) return reject(new Error('No es un archivo válido'))
      return resolve(data);
    });
  });
};

/* Expresión regular para rescatar links */
const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
/* Expresión regular para separar texto de href */
const singleMatch = /\[([^\[]+)\]\((.*)\)/;
let textLinks;
let arrLinks = [];

readNewFile(pathMdFile)
  .then(data => {

    console.log(data)

    const markdown = data.toString();
    const matches = markdown.match(regexMdLinks);

    for (let i = 0; i < matches.length; i++) {
      textLinks = singleMatch.exec(matches[i]);
      console.log(textLinks);
      arrLinks[i] = {
        href: textLinks[2],
        text: textLinks[1].slice(0, 50),
        file: pathMdFile,
        status:'',
        statusText: '',
      };
    }

    console.log(arrLinks);
    const total = matches.length;
    console.log(total);
    return arrLinks, total;
  })
  .then(arrLinks => {
    console.log(arrLinks);
  })
  .catch(error => console.error(chalk.red(error)));

exports.readNewFile = readNewFile;


/* --------------------------------------------------------------------------------------------------------- */

/* Validar links */


/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
