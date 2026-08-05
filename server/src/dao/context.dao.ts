import { contextModel } from "../dao/models/context.model.js";

class ContextDao{
   async readContext(userId:string){
    const contextDoc = await contextModel.findOne({user:userId}).lean();
    if(contextDoc) return contextDoc.description;
    else return "No Description"
   }

   async updateContext({userId , description}:{userId:string , description:string}){
    const contextDoc = await contextModel.findOneAndUpdate(
        {user:userId},
       { description},
        {upsert:true}
    );
   }
}

export const contextDao = new ContextDao();