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


                    total = matches.length;

                   

                    /* Filtrar links válidos */
                    let textLinks;
                    let arrLinks = [];
                    let validLink = 0;
                    let countBreak = 0;
                                       
                    for (let i = 0; i < matches.length; i++) {
                      textLinks = singleMatch.exec(matches[i]);
                    
                      /* console.log(textLinks); */

                      let prefix = textLinks[2].substring(0, 4);
                        if (prefix == 'http') {

                          arrLinks[i] = {
                            href: textLinks[2],
                            text: textLinks[1].slice(0, 50),
                            file: absoluteOk
                          };

                          validLink++;

                          if(options.validate === true && options.stats === true){
                            
                            fetch(textLinks[2])
                              .then(res => {
                                arrLinks[i].status = res.status;

                                if (res.ok === true) arrLinks[i].statusText = 'ok';
                                else if(res.ok === false) arrLinks[i].statusText = 'fail';
                               
                                return arrLinks;
                               /* console.log(arrLinks);*/
                              })
                              .then(arrLinks => {
                                let linkBroken = arrLinks[i].statusText = 'fail';
                                if(linkBroken === 'fail'){
                                  countBreak++;
                                }

                                return countBreak;
                              })
                              .catch(error => {
                                arrLinks[i].status = 443;
                                arrLinks[i].statusText = 'fail';
                                countBreak++;
                              })

                              console.log()
                          }

                          else if(options.validate === true) {
    
                            fetch(textLinks[2])
                              .then(res => {
                                arrLinks[i].status = res.status;

                                if (res.ok === true) arrLinks[i].statusText = 'ok';
                                else if(res.ok === false) arrLinks[i].statusText = 'fail';
                               
                               /* console.log(arrLinks);*/
                              })
                              .catch(error => {
                                arrLinks[i].status = 443;
                                arrLinks[i].statusText = 'fail';
                              })
                              /*console.log(arrLinks);*/
                             
                          }


                          
                        }
   
                    }
                    /*console.log(arrLinks); */
                   /* console.log(validLink);*/

                    /*newUnique = [...new Set(link)];
                    console.log(countBroken);
                    return arrLinks, countBroken;*/
                   /* console.log(total)*/

                   /*for (let i = 0; i < matches.length; i++){
                     let itemBroken = arrLinks[i].statusText;

                     console.log(itemBroken);

                     if(itemBroken === 'fail') brokenLink++;
                   }

                   console.log(brokenLink);*/

                    console.log(chalk.blue.bold('El archivo ' + libPath.basename(absoluteOk) + ' tiene ' + total + ' links y de ellos ' + validLink + ' son válidos'));

                    totalLinks = [arrLinks, total, validLink];
                    return totalLinks;

                  }
                })
                .catch(error => console.error(chalk.red(error)))


              /*.then(totalLinks => {
                console.log(totalLinks);

                const arrLinks2 = totalLinks[0];
                const arrTotal = totalLinks[1];
                const hrefLinks = arrLinks2[0].href;
                console.log(arrLinks2);
                console.log(hrefLinks);
                console.log(arrTotal);
                console.log(options.validate);

                let countBroken = 0;
                

               /* arrLinks2.forEach(hrefLinks => {
                  fetch(hrefLinks)
                  .then(res => {
                    if (res.ok === true) {
                      .status = res.status;
                      arrLinks2[i].statusText = 'ok';
                    } else {
                      arrLinks2[i].status = res.status;
                      arrLinks2[i].statusText = 'fail';
                      countBroken++;
                    }
                  })
                })

                if (arrTotal > 0 && options.validate === true) {

                  for (let i = 0; i < arrTotal; i++) {

                    const linkAbsolute = arrLinks2[i].toString();

                      fetch(arrLinks2[i].href)
                      .then(res => {
                        /* console.log(res.ok);
                         console.log(res.status);
                         console.log(res.statusText);
                         console.log(res.headers.raw());
                        console.log(res.headers.get('content-type'));*/

              /*     if (res.ok === true) {
                          arrLinks2[i].status = res.status;
                          arrLinks2[i].statusText = 'ok';
                        } else {
                          arrLinks2[i].status = res.status;
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
              /*}
              .catch(err => console.error(chalk.red(err)));*/


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
