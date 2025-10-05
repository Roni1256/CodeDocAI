import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "codingdocumentation.ai@gmail.com",
    pass: "lzqz ahgi hsrr nvzs",
  },
});
export async function transportMail(email,username,verificationCode) {
  
    try {
    await transporter.sendMail({
      from: "codingdocumentation.ai@gmail.com",
      to: email,
      subject: "Your Verification Code",
      html: `<p>Hello <b>${username}</b>,</p>
             <p>Your verification code is:</p>
             <h2>${verificationCode}</h2>
             <p>This code will expire in 10 minutes.</p>`,
    });
  } catch (error) {
    console.log(error.message);
  }
}
