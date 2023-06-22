import process from 'process';
import { homedir } from 'os';
import fs from 'fs';
import path from 'path';

function start() {
    const USER_NAME = process.argv.slice(2)[0].split('=').reverse()[0];
    let currentDir = homedir();
    process.stdout.write(`\nWelcome to the File Manager, ${USER_NAME}!\n`);
    process.stdout.write(`You are currently in ${currentDir}\n`);

    process.stdin.on('data', (data) => {
        const COMMAND = data.toString().trim().split(' ')[0];
        const ARGUMENTS = data.toString().trim().split(' ').slice(1);
        if (COMMAND === '.exit') process.exit();
        else {
            switch (COMMAND) {
                case 'up':
                    if (currentDir.split('\\').length > 1)
                        currentDir = currentDir.split('\\').slice(0, -1).join('\\');
                    break;
                case 'cd':
                    currentDir = path.join(currentDir, ARGUMENTS[0]);
                    break;
                case 'ls':
                    process.stdout.write('(index)\t\tName\t\tType\n');
                    fs.readdir(currentDir, { withFileTypes: true }, (err, files) => {
                        files.forEach((file, i) => {
                            process.stdout.write(`${i}\t\t${file.name}\t\t${file.isFile() ? 'file' : 'directory'}\n`);
                        });
                    });
                    break;
                default:
                    process.stdout.write('Invalid input\n');
                    break;
            }

            process.stdout.write(`You are currently in ${currentDir}\n`);
        }
    });

    process.on('SIGINT', () => process.exit());
    process.on('exit', () => process.stdout.write(`\nThank you for using File Manager, ${USER_NAME}, goodbye!\n`));
}

start();