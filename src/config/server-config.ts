export const SERVER_PORT: number = process.env.PORT? +process.env.PORT : 8011;
export const SERVER_TOKEN: string = process.env.REST_TOKEN? process.env.REST_TOKEN : "restdulugasi";

export const SOAP_URL: string = process.env.SOAP_URL? process.env.SOAP_URL : "http://localhost:8080";
export const SOAP_TOKEN: string = process.env.SOAP_TOKEN? process.env.SOAP_TOKEN : "nyabun";
export const SOAP_SERVICE: string = process.env.SOAP_SERVICE? process.env.SOAP_SERVICE : "http://services.wbdsoap";

export const MOLI_URL: string = process.env.MOLI_URL? process.env.MOLI_URL : "http://localhost:8008";
export const MOLI_TOKEN: string = process.env.MOLI_TOKEN? process.env.MOLI_TOKEN : "phpinkm";
