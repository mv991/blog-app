import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request,{params}) => {
    try {
        await connectToDB();
        const prompt= await Prompt.findById(params.id).populate("creator");
        if(!prompt) {
          return new Response("Prompt not found", { status: 404 })
        }
        return new Response(JSON.stringify(prompt), { status: 200 })
    }catch(e) {
         return new Response("Failed to fetch all prompts", { status: 500 })
    }
}

export const PATCH = async (request,{params}) => {
    const {prompt,tag,images} = await request.json();
    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id);
        if(!prompt) {
          return new Response("Prompt not found", { status: 404 })
        }
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        // await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
       await Prompt.findByIdAndUpdate(params.id,{images:images},{new:true})
        console.log(existingPrompt)
    //  await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt), { status: 200 })
    }catch(e) {
         return new Response("Failed to edit the prompt", { status: 500 })
    }
}

export const DELETE = async (request,{params}) => {
    try {
        await connectToDB();
        await Prompt.findByIdAndDelete(params.id);
        return new Response("Prompt Deleted", { status: 200 })
    }catch(e) {
         return new Response("Failed to Delete prompt", { status: 500 })
    }
}