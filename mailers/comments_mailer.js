const nodeMailer=require('../config/nodemailer');


exports.newComment =(comment) =>{
    // console.log('inside new commet  mailer',comment);
    let htmlString=nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from: 'shubham.agarwal.meg@gmail.com', // sender address
    to: comment.user.email, // list of receivers
    subject: "New comment Published", // Subject line
    // text: "Hello world?", // plain text body
    html:htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending Email',err);
            return;
        }
        console.log("Message sent",info);
        return;
    })
}