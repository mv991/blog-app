import mongoose from "mongoose";

let isConnected  = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery",true);
    if(isConnected) {
        console.log("MongoDb is already connected");
        return;
    }

    try {
      await mongoose.connect(process.env.MONGO_URL, {
       dbName: "share-prompt",
        useNewUrlParser:true,
        useUnifiedTopology:true,
      })
      isConnected = true;
      console.log("MongoDb connected")
    } catch (error) {
        console.log(error);
    }
}
