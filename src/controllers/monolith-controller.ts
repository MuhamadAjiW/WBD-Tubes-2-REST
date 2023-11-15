import axios from "axios";

export class MonolithController{
    private moliRoute: String = "http://tugas-besar-2-wbd-php-web-1:80";

    public async getRequest(endpoint: string): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const response = await axios.get(this.moliRoute + endpoint, {
                    headers: {
                        "Authorization": 'Bearer nyabun',
                    }
                });
                resolve(response);
            } catch (error){
                console.error("Monolith request error:", error);
                reject(error);
            }
        })
    }
}