import resend from "../lib/resend";
import { getPasswordResetHtml } from "./emailTemplate";

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  try {
    const htmlContent = getPasswordResetHtml({
      email,
      resetLink,
      companyName: "HavTalk",
      year: new Date().getFullYear(),
    });

    const response = await resend.emails.send({
      from: "HavTalk <noreply@mail.havtalk.site>",
        to: email,
        subject: "Reset Your HavTalk Password",
        html: htmlContent,
    });
    console.log("Password reset email sent successfully:", response);
    return { success: true, message: "Password reset email sent successfully." };
    } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "Failed to send password reset email." };
    }
}