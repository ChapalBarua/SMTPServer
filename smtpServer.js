const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const server = new SMTPServer({
    allowInsecureAuth: true,
    authOptional: true,
    onConnect(session, cb){
        console.log(`onConnect`, session.id)
        cb() // accepts the connection
    },
    onMailFrom(address, session, cb) {
        console.log(`onMailFrom`, address.address, session.id);
        cb();
    },
    onRcptTo(address, session, cb){
        console.log(`onRcptTo`, address.address, session.id);
        cb();
    },
    onData(stream, session, cb){
        stream.on('data', (data)=>{
            
            simpleParser(data)
            .then(parsed => {
                console.log(parsed);
            })
            .catch(err => {
                console.log(error);
            });
            //console.log(`onData ${data.toString()}`);
        });
        stream.on('end', cb);
    }
});

server.listen(25, ()=> console.log('Server Running'));
