import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { verifyCodeSchema } from "@/schema/verifyCode";
import { Status } from "@/types/statusCode";

export async function POST(request: Request): Promise<Response> {
  try {
    const { email, verifyCode } = await request.json();
    const { success, error } = verifyCodeSchema.safeParse({
      email,
      verifyCode,
    });
    if (!success) {
      return Response.json(
        {
          success: false,
          message: error.issues.map((issue) => issue.message).join(", "),
        },
        {
          status: Status.BAD_REQUEST,
        }
      );
    }

    await dbConnect();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: Status.NOT_FOUND,
        }
      );
    }
    const isCodeValid = user.verifyCode === verifyCode;

    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        {
          status: Status.UNAUTHORIZED,
        }
      );
    }
    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: Status.UNAUTHORIZED,
        }
      );
    }

    user.isVerified = true;
    user.verifyCode = " ";
    user.verifyCodeExpiry = new Date(0);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Code verified successfully",
      },
      {
        status: Status.OK,
      }
    );
  } catch (error) {
    console.error("Error Verify code ", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: Status.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
