#!/usr/bin/env node

const fs = require("fs");
const libPath = require('path');

const fileLinks = require('./lib/links.js');
const fileValidate = require('./lib/validate.js');
const fileStats = require('./lib/stats.js');
const chalk = require('chalk');
const fetch = require('node-fetch');

/* const arg = process.argv; */
const path = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];

const options = {
  validate: arg2,
  stats: arg3
}

/* console.log(arg);
   console.log(arg1);
   console.log(arg2);
   console.log(arg3); 
*/

let totalLinks = 0;

const mdLinks = (path, options) => {

  let input;
  let linksTotal;

  let promise = new Promise(function (resolve, reject) {
    const inputOk = fileLinks.checkArg(path, options.validate, options.stats);
    /* console.log(inputOk); */
    resolve(inputOk)
  });

  promise.then(function (inputOk) {
      const absoluteOk = fileLinks.pathIsAbsolute(inputOk[0]);
      input = [absoluteOk, inputOk]
      /* console.log(absoluteOk); */
      return input;
    })

    .then(function (input) {

      /* const extension = fileLinks.checkExt(absoluteOk);
      console.log(extension); */
      absoluteOk = input[0];
      inputOk = input[1];
      /* console.log(inputOk); */
      let filesDirectory;
      let countTotal;
      options = {
        validate: inputOk[1],
        stats: inputOk[2]
      }

      /* console.log(options); */
      const stat = fs.statSync(absoluteOk);

      let pathFile = [];
      let count = 0;

      if (stat.isDirectory() === true) {

        /* Análisis sobre el directorio inmediato */

        fs.readdir(absoluteOk, (err, files) => {
          files.forEach((file) => {
            if (libPath.extname(file) === '.md') {
              pathFile[count] = file;
              count++;
              mdLinks(file, options);
            }
          });

          if (count === 0) {
            console.log('En directorio ingresado no hay archivos con extensión md');
          } else {
            console.log('Total de archivos md en directorio ingresado: ' + chalk.red.bold(count));
            console.log(pathFile);
          }
          /* console.log(pathFile); */
          return count;
        });

      } else if (stat.isFile() === true) {

        if (libPath.extname(absoluteOk) === '.md') {

          /* Expresión regular para rescatar links */
          const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
          /* Expresión regular para separar texto de href */
          const singleMatch = /\[([^\[]+)\]\((.*)\)/;

          let textLinks;
          let arrLinks = [];

          let readNewFile = (absoluteOk) => {
            return new Promise((resolve, reject) => {
              fs.readFile(absoluteOk, "utf8", (error, data) => {
                if (error) return reject(new Error('No es un archivo válido'))
                resolve(data);
              });
            })
          }
          readNewFile(absoluteOk).then(data => {

              const markdown = data.toString();
              const matches = markdown.match(regexMdLinks);
              let total;
              let totalLinks;

              if (matches === null) {
                total = 0;
                console.log('No hay links en archivo md que analizar')
              } else {

                let countBroken = 0;
                total = matches.length;

                console.log(chalk.blue.bold('El archivo ' + libPath.basename(absoluteOk) + ' tiene ' + total + ' links'));

                for (let i = 0; i < matches.length; i++) {
                  textLinks = singleMatch.exec(matches[i]);
                  /* console.log(textLinks); */
                  arrLinks[i] = {
                    href: textLinks[2],
                    text: textLinks[1].slice(0, 50),
                    file: absoluteOk
                  };
                }
                console.log(arrLinks);
                /*newUnique = [...new Set(link)];
                console.log(countBroken);
                return arrLinks, countBroken;*/
                console.log(total)
                totalLinks = [arrLinks, total];
                return totalLinks;

              }
            })
            .catch(error => console.error(chalk.red(error)))


            .then(totalLinks => {
              console.log(totalLinks);

              const arrLinks2 = totalLinks[0];
              const arrTotal = totalLinks[1];
              const hrefLinks = arrLinks2[0].href;
              console.log(arrLinks2);
              console.log(hrefLinks);
              console.log(arrTotal);
              console.log(options.validate);
              let countBroken = 0;

              if (arrTotal > 0 && options.validate === true) {
               
                for (let i = 0; i < arrTotal; i++) {
                  fetch(arrLinks2[i].href)
                    .then(res => {
                      /* console.log(res.ok);
                       console.log(res.status);
                       console.log(res.statusText);
                       console.log(res.headers.raw());
                      console.log(res.headers.get('content-type'));*/
                      arrLinks2[i].status = res.status;
                      if (res.ok === true) {
                        arrLinks2[i].statusText = 'ok';
                      } else {
                        arrLinks2[i].statusText = 'fail';
                        countBroken++;
                      }
                    })
                }
              }


              /*arrLinks2.forEach((link) => {
                fetch()
                .then(res => {
                  /* console.log(res.ok);
                   console.log(res.status);
                   console.log(res.statusText);
                   /* console.log(res.headers.raw());
                    console.log(res.headers.get('content-type'));*/
              /*  arrLinks.status = res.status;
                  if (res.ok === true) {
                    arrLinks.statusText = 'ok';
                  } else {
                    arrLinks.statusText = 'fail';
                    countBroken++;
                  }
              })*/

              /*console.log(arrLinks);
              newUnique = [...new Set(link)];
              console.log(countBroken);
              return arrLinks, countBroken;*/
            })
            .catch(err => console.error(chalk.red(err)));

        } else {
          console.log(chalk.red.bold('Su archivo no es md'));
        }
      }






    })
}



/*.then(linksTotal => {
  console.log(linksTotal);
  console.log('Cantidad de archivos md encontrados en directorios: ' + linksTotal[1]);
})*/







/* if (stat.isDirectory() === true) {

 } else if (stat.isFile() === true) {

   if (extension === '.md') {

     fileLinks.readNewFile(absoluteOk)
       .then(function (res) {
         console.log(res);

         /* Rescatar links del archivo */


/*   })
  }
} else {}*/




mdLinks(path, options);
exports.mdLinks = mdLinks;
