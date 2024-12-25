import * as Nodemailer from 'nodemailer';

interface VerificationEmailParams {
    email: string,
    code?: number,
    title?: string,
    message?: string,
    buttonText?: string
}

interface ContractEmailParams {
    email: string,
    contractId?: string,
}
// async..await is not allowed in global scope, must use a wrapper

export default async function sendEmail({ email, code, title = "Verify Email", message = "verify your email address" }: VerificationEmailParams): Promise<any> {
   

    let transporter = Nodemailer.createTransport({
        name: "Loose Application",  //www.agronigeria.ng
        host: "smtp.zoho.com",  //mail.agronigeria.ng smtp-mail.outlook.com
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.email_username, //no-reply@agronigeria.ng
            pass: process.env.email_password, //AgroNigA!!en90
        },
    });

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: process.env.email_username,
        to: `${email}`,
        subject: `${title}`,
        text: `Use this code to ${message}`,
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
        <h3>Peniga Onboarding Verification Code</h3>
        <p>A verification code is needed to continue the Onboarding process</p>
        
        <h1> ${code} </h1>

        <p> This code will expire in 30 minutes </p>
        <p style="line-height: 1.3rem;">
        Thanks <br />
        <em>The Peniga Team</em>
        </p>
    </div>
    `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            throw error;
        }
        return info.response
    });

}

export async function sendContractEmail({ email, contractId }: ContractEmailParams): Promise<any> {
   
    let transporter = Nodemailer.createTransport({
        name: "Loose Application",  //www.agronigeria.ng
        host: "smtp.zoho.com",  //mail.agronigeria.ng smtp-mail.outlook.com
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.email_username, //no-reply@agronigeria.ng
            pass: process.env.email_password, //AgroNigA!!en90
        },
    });

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: process.env.email_username,
        to: `${email}`,
        subject: `New Escrow Contract`,
        text: ``,
        html: `
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,minimum-scale=1">
        <title>Escrow Contract Notification</title>
    </head>
    
    <body
        style="background-color:#F5F6F8;font-family:-apple-system, BlinkMacSystemFont, 'segoe ui', roboto, oxygen, ubuntu, cantarell, 'fira sans', 'droid sans', 'helvetica neue', Arial, sans-serif;box-sizing:border-box;font-size:16px;">
        <div style="background-color:#fff;box-sizing:border-box;font-size:16px;">
            <h1 style="padding:40px;box-sizing:border-box;font-size:24px;color:#ffffff;background-color:#691883;margin:0;">
                Escrow Contract on Peniga</h1>
            
            <div style="box-sizing:border-box;padding:0 40px 20px;">
                <h3>Please agree to the new Escrow Contract</h3>
                <p>An escrow contract has been prepared on Peniga. Click on the link to view and agree to it</p>

                <a style="width: 300px; color: white; background-color:#691883; height: 50px; padding: 25px" href='${process.env.frontend_url}/dashboard/contracts/${contractId}'> view contract </a>

                <p> This contract will expire in 60 minutes </p>
                <p style="line-height: 1.3rem;">
                Thanks <br />
                <em>The Peniga Team</em>
                </p>
            </div>
        </div>
    </body>
    
    </html>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            throw error;
        }
        return info.response
    });

}
