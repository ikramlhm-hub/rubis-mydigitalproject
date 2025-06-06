const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}); 

const sendNewsletterConfirmation = (toEmail, prenom) => {
  const mailOptions = {
    from: `"Rhéa Drinks" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Bienvenue dans la newsletter Rhéa 🌿',
    html: `
      <h2>Bonjour ${prenom} !</h2>
      <p>Merci de t’être inscrite à la newsletter de <strong>Rhéa Drinks</strong> 🌸</p>
      <p>Tu recevras désormais nos offres exclusives, conseils bien-être et nouveautés en avant-première !</p>
      <br>
      <p>Avec amour,</p>
      <p>💌 L'équipe Rhéa</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendNewsletterConfirmation };
