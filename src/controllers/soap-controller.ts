import axios from "axios";
import { SOAPRequest } from "../types/SOAPRequest";
import { Request, Response } from "express";
import { Parser } from "xml2js";
import { parse } from "path";

export class SOAPController{
    private soapRoute: String = "http://localhost:8080";
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
                        "SOAPAction": `${this.soapService}/${data.handler}/${data.method}`
                    }
                })
                const parser = new Parser;
                parser.parseString(response.data, (error, result) => {
                    if (error){
                        console.error("XML parsing error:", error);
                        reject(error);
                    } else{
                        console.error("XML parsing success:");
                        const responseData = result['S:Envelope']['S:Body'][0][`ns2:${data.method}Response`][0]['return'][0];
                        console.log("Response Data:", responseData);
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
                method: 'getSubscriptionsByUser',
                args: new Map([
                    ['user_id', '1'],
                    ['filter', 'ALL']
                ])
            }
            console.log(this.getEnvelope(testData));
            const response = await this.sendRequest("/api/subscribe", testData);
            console.log("Response: ", response)


        }
    }
}