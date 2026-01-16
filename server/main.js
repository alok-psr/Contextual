import { app,PORT } from "./app.js";


try {
    app.listen(PORT,()=>{
        console.log("server works at PORT ",PORT)
    })
} catch (err) {
    console.log("unable to start server ::" ,err)
}