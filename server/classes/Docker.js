const fs = require('fs'),
    {
        exec
    } = require('child_process'),
    compilers = require('./compilers')

module.exports = class Docker {
    constructor(name, io, type, code) {
        this.name = name;
        this.io = io;
        this.compiler = compilers[type];
        this.commands = this.compiler.commands(name);
        this.code = code;
        this.completed = false;
    }

    run() {
        this.createFile();
        console.log(1);

        // load the docker
        this.prepare();

        // kill the docker and delete the file if it has taken longer than 10 secs to run and compile
        setTimeout(_ => {

            if (!this.completed){
               this.io.to(this.name).emit('compiling',{
                    compiling: false,
                    output: "Code Took to long to run"
                })
                this.cleanup();
            }
        }, 10000)


    }

    createFile() {
        fs.writeFile(`./server/tmp/${this.name}${this.compiler.extension}`, this.code, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }

    removeFile() {
        fs.unlink(`./server/tmp/${this.name}${this.compiler.extension}`, (err) => {
            if (err) throw err;
            console.log('FileRemoved');
        });
    }

    prepare() {
        this.setup();
    }

    setup() {
        console.log(1)
        exec(`docker run -d --name ${this.name} ${this.compiler.dockerFile}`, (err, output, err2) => {
            if (err || err2) {
                console.log('Failure setting up enviroment 1');
                console.log(err);
                console.log(err2);
                this.cleanup()
                return 'Failure setting up enviroment'
            }
            // load the test file
            exec(`docker cp ./server/tmp/${this.name}${this.compiler.extension} ${this.name}:${this.name}${this.compiler.extension}`, (err, output, err2) => {

                if (err || err2) {
                    console.log('Failure setting up enviroment 2');
                    console.log(err);
                    console.log(err2);
                    this.cleanup()
                    return 'Failure setting up enviroment'
                }
                return this.execute();
            })
        })
    }

    execute() {
        //run the test script
        exec(this.commands[0], (err, output, err2) => {
            if (err || err2) {
                'Failure setting up enviroment'
                return err || err2
                this.cleanup()
            }
            if (this.commands.length > 1) {
                this.commands = this.commands.slice(1);
                this.execute();
            } else {
                this.io.to(this.name).emit('compiling',{output, compiling: false})
                this.completed = true;
                this.cleanup()
                
                console.log(output)
                console.log(err)
                console.log(err2)
                console.log('output')
            }
        })
    }

    cleanup() {
        //delete file

        exec(`sudo docker rm -f ${this.name}`, _ => {
            this.removeFile()
        })
    }
}