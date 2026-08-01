import {Schema , Types , type InferSchemaType , model} from "mongoose";

const messageSchema = new Schema({
    conversationId:{
      type:Schema.Types.ObjectId,
      ref:"Conversation",
      index:true,
    },
   content:{
    type:String,
    require:true,
    trim:true,
   },
   role:{
    type:String,
    enum:["Ai","Human"],
    default:"Human"
   }

},{
    timestamps:true,
});

export type messageDocument = InferSchemaType<typeof messageSchema> & {
    _id: Types.ObjectId;
}
export const messageModel = model("messages" , messageSchema);