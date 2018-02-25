module.exports = 
{
    node: {
        
        docker: 'node',
        extension: '.js',
        commands: function(name){
            return [`docker exec ${name} /usr/bin/nodejs ${name}`];
        },
        dockerFile: 'danvalentine/node'
    }
}