import { Status } from "@/types/statusCode";
import { success } from "zod";

export async function POST(request: Request): Promise<Response> {
    try {
        const {username , verifyCode} = 




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
