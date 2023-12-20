import { groups } from "./api";

export interface Group {
   id: string;
   name: string;
}

export async function loadAllGroups(): Promise<Group[] | undefined> {
    const res = await groups();
    if (res.status === 200) {
       return await res.json() as Group[];
    }

   return undefined;
}