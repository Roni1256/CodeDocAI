import mongoose from "mongoose";

const chatSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    
    chats:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserChat"
        },
        ai:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"AIChat"
        }
    }]
})

const userChatSchema=new mongoose.Schema({
    context:{
        type:String
    },
    file_name:{
        type:String
    },
    AIChatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AIChat"
    }
    
},{timestamps:true})

export const UserChat= mongoose.model("UserChat",userChatSchema)

const aiChatSchema=new mongoose.Schema({
    context:{
        type:String
    },
     file_name:{
        type:String
    },
    UserChatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserChat"
    }
})

export const AIChat=mongoose.model("AIChat",aiChatSchema)

const Chat=mongoose.model("Chats",chatSchema)
export default Chat