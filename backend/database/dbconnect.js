import mongoose from "mongoose";

export default async function connectDB(){
   await mongoose.connect(process.env.MONGODB_CLIENT_URI)
   .then((res)=>{
    console.log("Database connected successfully");
   })
   .catch((error)=>{
    console.log("Error connecting to Database:",error);
    
   })
}