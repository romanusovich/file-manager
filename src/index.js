import process from 'process';
import { homedir } from 'os';

function start() {
    const USER_NAME = process.argv.slice(2)[0].split('=').reverse()[0];
    const CUURENT_DIR = homedir();
    process.stdout.write(`\nWelcome to the File Manager, ${USER_NAME}!\n`);

    process.stdin.on('data', (data) => {
        if (data.toString().trim() === '.exit') process.exit();
        else {
            
        }
    });

    process.on('SIGINT', () => process.exit());
    process.on('exit', () => process.stdout.write(`\nThank you for using File Manager, ${USER_NAME}, goodbye!\n`));
}

start();