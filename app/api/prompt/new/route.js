import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { userId, prompt, tag ,images} = await request.json();
    if(!userId) {
        return new Response("Login required", { status: 402 });
    }
    try {
        await connectToDB();
        const newPrompt = await new Prompt({ creator: userId, prompt, tag,  });
        newPrompt.images.push(...images)
          await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}