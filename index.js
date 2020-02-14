#!/usr/bin/env node


const links = require('./lib/links.js');

const arg = process.argv;
const arg1 = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];

console.log(arg);
console.log(arg1);
console.log(arg2);
console.log(arg3);


const inputOk = links.checkArg(arg1, arg2, arg3);
console.log(inputOk);
const absoluteOk = links.pathIsAbsolute(inputOk[0]);
console.log(absoluteOk);
const fileOrFolder = links.fileOrDirectory(absoluteOk);
console.log(fileOrFolder);

