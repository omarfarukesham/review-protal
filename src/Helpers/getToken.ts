'use server'
import { cookies } from "next/headers";

const getToken = async()=>{
    const token = (await cookies()).get("accessToken")?.value as string;
    return token
  }

  export default getToken; 