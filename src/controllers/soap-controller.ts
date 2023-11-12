import axios from "axios";
import { SOAPRequest } from "../types/SOAPRequest";
import { Request, Response } from "express";

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

    public async sendRequest(endpoint: string, data: SOAPRequest){

        const soapData: string = this.getEnvelope(data);
        try{
            const response = await axios.post(this.soapRoute + endpoint, soapData, {
                headers: {
                    'Content-Type': "text/xml;charset=UTF-8",
                    "SOAPAction": `${this.soapService}/${data.handler}/${data.method}`
                }
            })
            return response.data;
        } catch (error){
            console.error("SOAP request error:", error);
        }
    }

    test () {
        return async (req: Request, res: Response) => {
            const testData: SOAPRequest = {
                handler: 'TestService',
                method: 'hello',
                args: new Map([
                    ['message', 'Some message']
                ])
            }
            console.log(this.getEnvelope(testData));
            const response = await this.sendRequest("/api/test", testData);
            console.log("Response: ", response)
        }
    }
}