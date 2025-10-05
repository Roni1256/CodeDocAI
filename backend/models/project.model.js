import mongoose from "mongoose"

const projectSchema=new mongoose.Schema({
    project_name:{
        type:String,
        required:true,
        maxlength:30,
        trim:true
    },
    project_description:{
        type:String,
        required:false,
        maxlength:2000,
        trim:true
    },
    prompt:{
        type:String,
        required:false,
        maxlength:100,
        trim:true
    },
    files:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"File"
    }]
   
},{timestamps:true})


const fileSchema=new mongoose.Schema({
     file_name:{
        type:String,
        required:true,
        trim:true
    },
    file_type:{
        type:String,
        required:true,
        trim:true
    },
    file_content:{
        type:String,
        trim:true
    },
    output_content:{
        type:String,
        trim:true
    }
},{timestamps:true})
export const File = mongoose.model("File",fileSchema)
const Project = mongoose.model("Project",projectSchema);
export default Project;