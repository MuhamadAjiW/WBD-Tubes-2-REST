import { App } from "./app";

if (require.main === module){
    const app = new App;
    app.run();
    console.log(process.env.REDIS_PORT)
}