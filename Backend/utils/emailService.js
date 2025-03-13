const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host:process.env.EMAIL_HOST,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use your 16-digit app password here
  }
});

exports.sendBloodRequest = async (hospitalEmail, requestDetails) => {
  try {
    const mailOptions = {
      from: {
        name: "BloodBond Emergency",
        address: process.env.EMAIL_USER
      },
      to: hospitalEmail,
      subject: `URGENT: Blood Request - ${requestDetails.bloodGroup} Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              padding: 20px;
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #d32f2f;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              border: 1px solid #ccc;
              border-radius: 0 0 8px 8px;
              padding: 20px;
            }
            .button {
              background-color: #d32f2f;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              border-radius: 4px;
            }
            .urgent {
              color: #d32f2f;
              font-weight: bold;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Emergency Blood Request</h2>
            </div>
            <div class="content">
              <p>A new emergency blood request has been received:</p>
              <ul>
                <li><strong>Patient Name:</strong> ${requestDetails.patientName}</li>
                <li><strong>Blood Group Required:</strong> ${requestDetails.bloodGroup}</li>
                <li><strong>Units Required:</strong> ${requestDetails.unitsRequired}</li>
                <li><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
              <p class="urgent">URGENT: Please respond within 30 minutes</p>
              <a href="mailto:${requestDetails.replyTo}" class="button">
                Respond to Request
              </a>
              <p style="margin-top: 20px;">
                If the button doesn't work, please reply directly to this email.
              </p>
              <p>
                Best regards,<br>
                The BloodBond Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};


