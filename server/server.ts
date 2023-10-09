import { app } from "./app";
require('dotenv').config()





// create our server
app.listen(process.env.PORT,()=>{
    console.log(`server is connected with ${process.env.PORT}`);
    
} )