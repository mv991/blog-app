import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
             clientId: process.env.GOOGLE_CLIENT_ID ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
      callbacks: {
         async session({session}) {
      const sessionUser = await User.findOne({email: session.user.email});
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({profile}) {
         try {
            await connectToDB();
            // Check if user exists
             const userExists = await User.findOne({ email: profile.email});
           // if not create new 
           if(!userExists) {
              await User.create({email:profile.email,image:profile.picture})
           }
             return true
         } catch(error) {
                 console.log("Error checking if user exists: ", error.message);
                 return false
         }
    },
       async redirect({ url, baseUrl }) {
        const redirectUrl = url.startsWith('/') ? new URL(url, baseUrl).toString() : url;
        console.log(`[next-auth] Redirecting to "${redirectUrl}" (resolved from url "${url}" and baseUrl "${baseUrl}")`);
        return redirectUrl;
    },
  }
})

export {handler as GET, handler as POST}