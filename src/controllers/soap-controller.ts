import axios from "axios";
import { SOAPRequest } from "../types/SOAPRequest";
import { Request, Response } from "express";
import { Parser } from "xml2js";

export class SOAPController{
    private soapRoute: String = "http://tugas-besar-2-wbd-soap-api-1:8080";
    private soapService: String = "http://services.wbdsoap"
    
    private getEnvelope(data: SOAPRequest): string{
        const head:string = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${this.soapService}/">
<soapenv:Header/>
<soapenv:Body>`

        let body = "";
        body += `\n<tns:${data.method}>\n`;


        if(data.args != null){
            for (const [key, value] of data.args.entries()){
                body += `<${key}>${value}</${key}>\n`
            }
        }

        body += `</tns:${data.method}>\n`


        const tail:string = `</soapenv:Body>
</soapenv:Envelope>`

        return head + body + tail;
    }

    public async sendRequest(endpoint: string, data: SOAPRequest): Promise<any>{
        return new Promise(async (resolve, reject) => {
            const soapData: string = this.getEnvelope(data);
            try{
                const response = await axios.post(this.soapRoute + endpoint, soapData, {
                    headers: {
                        'Content-Type': "text/xml;charset=UTF-8",
                        "SOAPAction": `"${this.soapService}/${data.handler}/${data.method}"`,
                        "Authorization": 'Bearer nyabun',
                    }
                })
                const parser = new Parser({ explicitArray: false });
                parser.parseString(response.data, (error, result) => {
                    if (error){
                        console.error("XML parsing error:", error);
                        console.log(result);
                        reject(error);
                    } else{
                        console.log("XML parsing success:");
                        console.log(result);
                        const responseData = result['S:Envelope']['S:Body'][`ns2:${data.method}Response`]['return'];
                        resolve(responseData);
                    }
                })
            } catch (error){
                console.error("SOAP request error:", error);
                reject(error);
            }
        })

    }


    test () {
        return async (req: Request, res: Response) => {
            const testData: SOAPRequest = {
                handler: 'SubscriptionService',
                method: 'deleteSubscriptionsOne',
                args: new Map([
                    ['user_id', '1'],
                    ['author_id', '1']
                ])
            }
            console.log(this.getEnvelope(testData));
            const response = await this.sendRequest("/api/subscribe", testData);
            console.log("Response: ", response)


        }
    }
}