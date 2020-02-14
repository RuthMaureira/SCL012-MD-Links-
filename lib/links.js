/* */

const fs = require('fs');
const path = require('path');

/* Chequeo de ingreso de argumentos */

const argList = ['--validate', '--stats'];
let pathActual;
let options = {
  validate: false,
  stats: false
};
console.log(options);
console.log(path.resolve('.'));

exports.checkArg = (arg1, arg2, arg3) => {
  if ((!arg1 && !arg2 && !arg3) || (argList.includes(arg1))) {
    console.error('\nIngrese argumento(s) válido(s):\n \nRecuerde:\n node md-links path\n node md-links path --validate\n node md-links path --stats\n node md-links path --validate --stats\n');
    console.error('\nEjemplo:\n node md-links ./some/example.md\n node md-links ./some/example.md --validate\n node md-links ./some/example.md --stats\n node md-links ./some/example.md --validate --stats\n');
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
let r = new RegExp('^(?:[a-z]+:)?//', 'i');


exports.pathIsAbsolute = (arg1) => {
  const checkPath = path.resolve(arg1) === path.normalize(arg1).replace(/[\/|\\]$/, '');
  let pathTest = r.test(arg1);
  let newPath;
  console.log(pathTest);

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

exports.fileOrDirectory = (newPath) => {
  const fsLstat = fs.lstatSync(newPath);
  if (fsLstat.isFile()) return 'file';
  else if (fsLstat.isDirectory()) return 'directory';
};

exports.checkExt= file => path.extname(file);




/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
