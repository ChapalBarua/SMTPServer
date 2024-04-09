const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'site.torontobd.monastery@gmail.com',
      pass: emailPasscode
    }
});

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
            .then(mail => {
                let from = mail.headers.get('from').value.address[0];
                let to = mail.headers.get('to').value.address[0];
                let subject = mail.subject;
                let text = mail.text;

                const mailOptions = {
                    from: 'site.torontobd.monastery@gmail.com',
                    to: 'chapalbuet@yahoo.com',
                    subject: subject, 
                    text: `
                      from: ${from}
                      to: ${to}
                      Message: ${text}
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                     console.log('Error sending email:-'+ error);
                    } else {
                      console.log('Email sent successfully');
                    }
                });
            })
            .catch(err => {
                console.log('Error sending email:-'+ err);
            });
        });
        stream.on('end', cb);
    }
});

server.listen(25, ()=> console.log('Server Running'));
