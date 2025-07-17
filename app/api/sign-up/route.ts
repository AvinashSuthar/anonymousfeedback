import { sendVerificationCodeEmail } from "@/helper/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { signUpSchema } from "@/schema/signUpSchema";
import { Status } from "@/types/statusCode";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> {
  try {
    const { username, email, password } = await request.json();
    const { success, error } = signUpSchema.safeParse({
      username,
      email,
      password,
    });
    if (!success) {
      return Response.json(
        {
          success: false,
          message: error.issues.map((err) => err.message).join(", "),
        },
        {
          status: Status.BAD_REQUEST,
        }
      );
    }
    await dbConnect();
    const existingUserVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: Status.BAD_REQUEST,
        }
      );
    }
    const verifyCode = Math.floor(Math.random() * 9000000 + 100000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: Status.BAD_REQUEST,
          }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.username = username;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
        await existingUserByEmail.save();
      }
    } else {
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        username,
        verifyCode,
        verifyCodeExpiry,
        isAcceptingMessage: true,
        isVerified: false,
        message: [],
      });
    }

    /// send verifciact email
    const emailResponse = await sendVerificationCodeEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: Status.INTERNAL_SERVER_ERROR,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "User created successfully. Please check your email for the verification code.",
      },
      {
        status: Status.CREATED,
      }
    );
  } catch (error) {
    console.error("Error in sign-up route:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: Status.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
