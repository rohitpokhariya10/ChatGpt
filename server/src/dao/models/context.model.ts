import {Schema , type InferSchemaType , model, Types} from "mongoose"


const contextSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minLength:5,
    }
},
{
    timestamps:true,
});
export type contextDocument = InferSchemaType<typeof contextSchema> & {
    _id: Types.ObjectId;
};

export const contextModel = model("contexts" , contextSchema);