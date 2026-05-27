export const OTPVerification = ({ otp }) => {
  return `
    <div style="font-family: Arial; padding:20px">
      <h2>Email Verification</h2>

      <p>Your verification code is:</p>

      <div style="
        font-size:30px;
        font-weight:bold;
        padding:10px;
        letter-spacing:5px;
        border:1px solid #ddd;
        width:max-content;
      ">
        ${otp}
      </div>

      <p>This OTP will expire in 5 minutes.</p>

      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;
};