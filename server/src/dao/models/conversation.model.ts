import {Schema , type InferSchemaType , model  , Types} from "mongoose";

const conversationSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
        index:true,
    }

},{
    timestamps: true
});

export type conversationDocument = InferSchemaType<typeof conversationSchema> & {
    _id: Types.ObjectId;
}
export const conversationModel = model("Conversation" , conversationSchema);