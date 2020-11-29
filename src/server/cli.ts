import { Argv } from "yargs";
import InitModule from './cli/init';

const yargs = require('yargs/yargs')

const argv = (yargs(process.argv.slice(2)) as Argv)
    .command(InitModule)
    .argv;
