import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameSchema } from "@/schema/usernameSchema";
import { Status } from "@/types/statusCode";

export async function GET(
  request: Request,
  response: Response
): Promise<Response> {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const queryParams = {
      username: url.searchParams.get("username"),
    };
    const { success, data, error } =
      await usernameSchema.safeParse(queryParams);
    if (error) {
      return Response.json(
        {
          success: false,
          message: error.issues.map((err) => err.message).join(","),
        },
        {
          status: Status.BAD_REQUEST,
        }
      );
    }
    // Check if username already exists in the database

    const existingUser = await UserModel.findOne({
      username: data,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: Status.CONFLICT,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is available",
      },
      { status: Status.OK }
    );
  } catch (error) {
    console.error("Error Checking username", error);
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
