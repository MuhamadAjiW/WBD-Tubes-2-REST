import axios from "axios";
import { SERVER_TOKEN } from "../config/server-config";

export class MonolithController{
    private moliRoute;

    constructor(moliRoute: string) {
        this.moliRoute = moliRoute;
    }

    public async getRequest(endpoint: string): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const response = await axios.get(this.moliRoute + endpoint, {
                    headers: {
                        "Authorization": `Bearer ${SERVER_TOKEN}`,
                    }
                });
                resolve(response);
            } catch (error){
                console.error("Monolith request error:");
                reject(error);
            }
        })
    }

    public async sendRequest(endpoint: string, data: any): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const response = await axios.post(this.moliRoute + endpoint, data, {
                    headers: {
                        'Content-Type': "application/json;charset=UTF-8",
                        "Authorization": `Bearer ${SERVER_TOKEN}`,
                    }
                })
                resolve(response);
            } catch (error){
                console.error("Monolith request error");
                reject(error);
            }
        })
    }
}