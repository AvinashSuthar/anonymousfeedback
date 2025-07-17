import { resend } from "@/lib/resend";
import { VerifyCodeTemplate } from "@/emails/VerifyCodeTemplate";
import { APIResponse } from "@/types/ApiResponse";

export async function sendVerificationCodeEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<APIResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerifyCodeTemplate({ username, verifyCode }),
    });

    if (error) {
      console.log("Error sending email:", error);
      return {
        success: false,
        message: "Failed to send verification code. Please try again later.",
      };
    }
    return {
      success: true,
      message: "Verification code sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification code:", emailError);
    return {
      success: false,
      message: "Failed to send verification code. Please try again later.",
    };
  }
}
