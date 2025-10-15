//moongose is used to connect to the database and create a schema for the chat model
const mongoose=require('mongoose');

const chatModel=mongoose.Schema(
    {
        chatName:{type:String,trim:true},
        isGroupChat:{type:Boolean,default:false},
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    },{timestamps:true}
)

const Chat=mongoose.model("Chat",chatModel);
module.exports=Chat;