import { LoaderFunctionArgs } from "react-router-dom";
import { user } from "./api";

export interface Profile {
   id: string;
   displayName: string;
   username: string;
   description: string; 
   admin: boolean;
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Profile | undefined> {
   if (params.username) {
      const res = await user(params.username)
      if (res.status === 200) {
         return await res.json() as Profile;
      }
   }

   return undefined;
}