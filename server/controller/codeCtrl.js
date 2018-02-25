const Docker = require('../classes/Docker')
module.exports = {
    run: (req, res)=>{
        const { code, name, type} = req.body;
        const myDocker = new Docker(name, res, type, code);
        console.log(code, name, type)
        myDocker.run()
    },
    new: (req, res) => {
        
    }
}