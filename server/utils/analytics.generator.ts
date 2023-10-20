// this will simply generate last 12 months analytics

import { Document,Model, model } from "mongoose";

interface MonthData {
    month:string,
    count:number,

}

export async function generateLast12MonthDate<T extends Document>(
    // here we need to extend out document
    model:Model<T>

    // suppose we are sending our user model here




):Promise< {last12Months:MonthData[]} >{
    // last 12 month going it . if this is aug it goes to previous august
    // start our function
    // we have month data of 10mont
    const last12Months : MonthData[]=[]
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1) // here we are setting current date value

    for(let i=11;i>=0;i--){
        //  we are running the loop because we need 12 month data , thats why it goes to 11
        const endDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()-i*28); // this is end date multiply with 28 because today is 7 august i am minus it from 7 aug all not 30 count it like 28 every day its updating. we are counting our year as 28 days in a mont.

        const startDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate() - 28)

        const monthYear = endDate.toLocaleString('default',{day:"numeric",month:"short",year:"numeric"})// set up how we want

        const count = await model.countDocuments({
            createdAt:{
                $gte:startDate,
                $lt:endDate
            }
        }) // searching the data that created is gt this and lt itsh we pare pushing this data and returning last 12 months

        last12Months.push({month:monthYear,count})

    }

    return {last12Months}
}