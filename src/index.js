import process from 'process';
import * as os from 'os';
import fs from 'fs';
import path from 'path';

function start() {
    const USER_NAME = process.argv.slice(2)[0].split('=').reverse()[0];
    let currentDir = os.homedir();
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
                    process.stdout.write(`You are currently in ${currentDir}\n`);
                    break;
                case 'cd':
                    if (ARGUMENTS.length < 1) process.stdout.write('Operation failed\n');
                    else {
                        const NEW_PATH = path.join(currentDir, ARGUMENTS[0]);
                        fs.stat(NEW_PATH, (err, stats) => {
                            if (err || stats.isFile()) process.stdout.write('Operation failed\n');
                            else currentDir = NEW_PATH;
                            process.stdout.write(`You are currently in ${currentDir}\n`);
                        });
                    }
                    break;
                case 'ls':
                    fs.readdir(currentDir, { withFileTypes: true }, (err, files) => {
                        if (err) process.stdout.write('Operation failed\n');
                        else {
                            process.stdout.write('(index)\t\tName\t\tType\n');
                            files.sort((a, b) => (a.isFile() - b.isFile() || a.name - b.name));
                            files.forEach((file, i) => {
                                process.stdout.write(`${i}\t\t${file.name}\t\t${file.isFile() ? 'file' : 'directory'}\n`);
                            });
                            process.stdout.write(`You are currently in ${currentDir}\n`);
                        }
                    });
                    break;
                case 'cat':
                    if (ARGUMENTS.length < 1) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_PATH = path.join(currentDir, ARGUMENTS.join(' '));
                        fs.stat(FILE_PATH, (err, stats) => {
                            if (err || !stats.isFile()) process.stdout.write('Operation failed\n');
                            else {
                                const READ_STREAM = fs.createReadStream(FILE_PATH);
                                READ_STREAM.on('data', (chunk) => {
                                    process.stdout.write(`${chunk.toString()}\n`);
                                });
                                READ_STREAM.on('end', () => {
                                    process.stdout.write(`You are currently in ${currentDir}\n`);
                                });
                            }
                        });
                    }
                    break;
                case 'add':
                    if (ARGUMENTS.length < 1) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_PATH = path.join(currentDir, ARGUMENTS[0]);
                        fs.writeFile(FILE_PATH, '', (err) => {
                            if (err) process.stdout.write('Operation failed\n');
                            else process.stdout.write(`You are currently in ${currentDir}\n`);
                        })
                    }
                    break;
                case 'rn':
                    if (ARGUMENTS.length < 2) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_NAME = path.join(currentDir, ARGUMENTS[0]);
                        const NEW_FILE_NAME = path.join(currentDir, ARGUMENTS[1]);
                        fs.rename(FILE_NAME, NEW_FILE_NAME, (err) => {
                            if (err) process.stdout.write('Operation failed\n');
                            else process.stdout.write(`You are currently in ${currentDir}\n`);
                        });
                    }
                    break;
                case 'cp':
                    if (ARGUMENTS.length < 2) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_PATH = path.join(currentDir, ARGUMENTS[0]);
                        const NEW_FILE_PATH = path.join(currentDir, ARGUMENTS[1]);
                        fs.stat(FILE_PATH, (err, stats) => {
                            if (err || !stats.isFile()) process.stdout.write('Operation failed\n');
                            else {
                                const READ_STREAM = fs.createReadStream(FILE_PATH);
                                const WRITE_STREAM = fs.createWriteStream(NEW_FILE_PATH);
                                READ_STREAM.pipe(WRITE_STREAM);
                                READ_STREAM.on('end', () => {
                                    process.stdout.write(`You are currently in ${currentDir}\n`);
                                });
                            }
                        });
                    }
                    break;
                case 'mv':
                    if (ARGUMENTS.length < 2) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_PATH = path.join(currentDir, ARGUMENTS[0]);
                        const NEW_FILE_PATH = path.join(currentDir, ARGUMENTS[1]);
                        fs.stat(FILE_PATH, (err, stats) => {
                            if (err || !stats.isFile()) process.stdout.write('Operation failed\n');
                            else {
                                const READ_STREAM = fs.createReadStream(FILE_PATH);
                                const WRITE_STREAM = fs.createWriteStream(NEW_FILE_PATH);
                                READ_STREAM.pipe(WRITE_STREAM);
                                READ_STREAM.on('end', () => {
                                    fs.unlink(FILE_PATH, (err) => {
                                        if (err) process.stdout.write('Operation failed\n');
                                        else process.stdout.write(`You are currently in ${currentDir}\n`);
                                    });
                                });
                            }
                        });
                    }
                    break;
                case 'rm':
                    if (ARGUMENTS.length < 1) process.stdout.write('Operation failed\n');
                    else {
                        const FILE_PATH = path.join(currentDir, ARGUMENTS[0]);
                        fs.unlink(FILE_PATH, (err) => {
                            if (err) process.stdout.write('Operation failed\n');
                            else process.stdout.write(`You are currently in ${currentDir}\n`);
                        });
                    }
                    break;
                case 'os':
                    if (ARGUMENTS.length < 1) process.stdout.write('Operation failed\n');
                    else {
                        switch (ARGUMENTS[0]) {
                            case '--EOL':
                                process.stdout.write(os.EOL);
                                break;
                            case '--cpus':
                                process.stdout.write(`Cores: ${os.cpus().length}\n`);
                                os.cpus().forEach((cpu, i) => {
                                    process.stdout.write(`${i}: Model: ${cpu.model}; GHz: ${cpu.speed};\n`);
                                });
                                break;
                            case '--homedir':
                                process.stdout.write(`${os.homedir()}\n`);
                                break;
                            case '--username':
                                process.stdout.write(`${os.userInfo().username}\n`);
                                break;
                            case '--architecture':
                                process.stdout.write(`${os.arch()}\n`);
                                break;
                        }
                    }
                    break;
                default:
                    process.stdout.write('Invalid input\n');
                    break;
            }
        }
    });

    process.on('SIGINT', () => process.exit());
    process.on('exit', () => process.stdout.write(`\nThank you for using File Manager, ${USER_NAME}, goodbye!\n`));
}

start();