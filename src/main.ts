import axios, { AxiosInstance } from "axios";
import { StaticHelper } from "./helper/static_helper";
import * as cheerio from "cheerio";
import { UserModel } from "./model/user_model";
import {CookieJar} from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { DRHService } from "./service/drh_service";
import { configDotenv } from "dotenv";
import { DataPokokDRH, DataPokokDRHData, IdentitasDRH, IdentitasDRHData } from "./model/drh_model";
import xlsx, { Sheet, WorkBook } from "xlsx";
import fs from "fs/promises"; 
import moment from "moment";
import { ArsipService } from "./service/arsip_service";

configDotenv({
    override: true
});

export type ExecuteActions = {
    getDataPokok?: boolean;
    getIdentitas?: boolean;
    getArsipAsli?: boolean;
};
export async function execute(userInfo: UserModel, targetNIP: string[], opt?: ExecuteActions): Promise<void> {
    try {
        let cookieJar = new CookieJar();
        let client = wrapper(axios.create({
            jar: cookieJar
        }));
        let loginSimpegForm = new URLSearchParams();
        loginSimpegForm.append("loginSSO","heheh");
        console.info(`⌛ Go to SSO Page`);
        let result = await client.post(StaticHelper.loginUrl, loginSimpegForm, {
            headers: {
                "Host": "simpeg.bps.go.id",
                "Origin": "https://simpeg.bps.go.id",
                "User-Agent": StaticHelper.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        let htmlObj = cheerio.load(result.data);
        let action = htmlObj("#kc-form-login").attr("action");
        if(!action){
            throw new Error("Invalid HTML! There is no Form Login Found");
        }
        try {
            //Continue to Login SSO
            let loginSSOForm = new URLSearchParams();
            loginSSOForm.append("username", userInfo.username);
            loginSSOForm.append("password", userInfo.password);
            console.info(`⌛ Trying to Login SSO`);
            let postLogin = await client.post(action, loginSSOForm, {
                headers: {
                    "Host": "sso.bps.go.id",
                    "Origin": "https://sso.bps.go.id",
                    "User-Agent": StaticHelper.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if((postLogin.data as string).includes("Invalid username or password.")){
                console.info(`Failed Login, Invalid Username/Password`);
                return;
            }
        } catch(errLogin){
            console.info(`Failed Login, ${errLogin}`);
            return;
        }
        console.info(`✅️ Success Login`);
        //first, call home
        let resultHome = await client.get(StaticHelper.homeUrl);
        //then continue execute what you want get
        client.interceptors.request.use((config) => {
            return {
                ...config,
                ...StaticHelper.simpegHeader
            };
        });
        let dataPokokList:  DataPokokDRHData[] = [];
        let identitasList: IdentitasDRHData[] = [];
        //iterate over the targets
        for(let item of targetNIP){
            let result = await getByNIP(client, item, opt);
            if(result.dataPokok){
                dataPokokList.push(result.dataPokok.data.at(0)!);
            }
            if(result.identitas){
                identitasList.push(result.identitas.data.at(0)!);
            }
        }
        let workBook: WorkBook = xlsx.utils.book_new();
        let dataPokokSheet: Sheet = xlsx.utils.json_to_sheet(dataPokokList);
        let identitasSheet: Sheet = xlsx.utils.json_to_sheet(identitasList);
        xlsx.utils.book_append_sheet(workBook, dataPokokSheet, "data_pokok");
        xlsx.utils.book_append_sheet(workBook, identitasSheet, "identitas");
        //write to file
        xlsx.writeFile(workBook,`./${moment().format("YYYYMMDD_HHmmss")}_data.xlsx`);
    } catch(err) {
        console.info(`Error Occurred ${err}`);
    } finally {
        console.info("Terminated!");
    }
}

export async function getByNIP(client: AxiosInstance, targetNIP: string, opt?: ExecuteActions): Promise<{
    dataPokok?: DataPokokDRH;
    identitas?: IdentitasDRH;
}> {
    try {
        let returnValue: {
            dataPokok?: DataPokokDRH;
            identitas?: IdentitasDRH;
        } = {};
        if(opt?.getDataPokok){
            let result = await DRHService.getDataPokokByNIP(client, targetNIP);
            returnValue.dataPokok = result;
        }
        if(opt?.getIdentitas){
            let result = await DRHService.getIdentitasByNIP(client, targetNIP);
            returnValue.identitas = result;
        }
        if(opt?.getArsipAsli){
            await ArsipService.getArsipAsliByNIP(client, targetNIP);
        }
        console.info(`Get Data ${targetNIP} Success.`);
        return returnValue;
    } catch(err){
        console.info(`Failed While Get Data ${targetNIP}, Error : ${err}`);
        return {};
    } finally {
        console.info(`Get Data ${targetNIP} Done.`);
    }
}

export async function main(userInfo: UserModel, targetNIPs: string): Promise<void>{
    let cleanedNIPs: string = targetNIPs.trim();
    let cleanedUsername: string = userInfo.username.trim();
    let cleanedPassword: string = userInfo.password.trim();
    if((cleanedNIPs === "" ) || (cleanedUsername === "") || (cleanedPassword === "")){
        console.info(`Empty Username, Password, Or Target`);
        return;
    }
    userInfo.username = cleanedUsername;
    userInfo.password = cleanedPassword;
    let arrayNIPs: string[] = targetNIPs.split(",").map((el: string): string => el.trim());
    
    await execute(userInfo, arrayNIPs, {
        getDataPokok: true,
        getIdentitas: true,
        getArsipAsli: true
    });
}

main({
    username: process.env.USERNAME??"",
    password: process.env.PASSWORD??""
}, process.env.NIP_TARGET??"");