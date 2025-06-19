import { Response,Request } from "express";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const generateAvatar = asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = await req.body;
    
    const API_TOKEN = process.env.CF_API_TOKEN;
    if (!API_TOKEN) {
      throw new ApiError(500, "API token is not configured on the server");
    }
    
    const accountId = process.env.CF_ACCOUNT_ID;
    if (!accountId) {
        throw new ApiError(500, "Account ID is not configured on the server");
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `API request failed with status ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('image')) {
      // If the response is an image, return it as a base64 data URL
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:${contentType};base64,${base64Image}`;
      
      return res.status(201).json({ success: true, result: { image: dataUrl } });
    } else if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(201).json(data);
    } else {
        throw new ApiError(500, `Unexpected content type: ${contentType}`);
    }
})


