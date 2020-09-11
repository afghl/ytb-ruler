#!/usr/bin/env node

const parseArgs = require('minimist')

const start = () => {

  const args = parseArgs(process.argv.slice(2));
  console.log(args);
  if (!args) {
    console.log("youtube playlist url is required.");
    return;
  }

  if (true) {

  }
}

console.log("Hello world2");
start()
