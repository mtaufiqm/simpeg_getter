import { AxiosInstance, AxiosResponse } from "axios";
import { StaticHelper } from "../helper/static_helper";
import { IdentitasDRH } from "../model/drh_model";
import { FileService } from "./file_service";
import fs from "fs/promises";
import moment from "moment";
export class DRHService {
    static async getDataPokokByNIP(client: AxiosInstance, nip: string): Promise<IdentitasDRH>{
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "drhdetail");
            postForm.append("category", "dtpokok");
            postForm.append("id", nip);
            postForm.append("new", "false");
            postForm.append("data","1");
            console.info(`⌛ Trying Get Data Pokok By NIP`);
            let result = await client.post<IdentitasDRH, AxiosResponse<IdentitasDRH>>(StaticHelper.postDataUrl, postForm);
            if(result.data.dok.length > 0){
                for(let item of result.data.dok){
                    try {
                        let fileObj = await FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await fs.mkdir(`./result/file/${nip}/datapokok`, {recursive: true});
                        let result = await fs.writeFile(`./result/file/${nip}/datapokok/${item.niplama??moment().format("YYYYMMDD_HHmmss")}_${item.nmfile?.replaceAll(`\\`,"_").replaceAll("/","_")}`, Buffer.from(fileObj));
                    } catch(err){
                        console.info(`Error Download File ${item.niplama} : ${item.nmarsip}`);
                    }
                }
            }
            return result.data;
        } catch(err){
            if(err instanceof Error){
                throw new Error(err.message);
            }
            throw new Error(`${err}`);
        }
    }
    static async getIdentitasByNIP(client: AxiosInstance, nip: string): Promise<IdentitasDRH>{
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "drhdetail");
            postForm.append("category", "identitas");
            postForm.append("id", nip);
            postForm.append("new", "false");
            postForm.append("data","1");
            console.info(`⌛ Trying Get Identitas By NIP`);
            let result = await client.post<IdentitasDRH, AxiosResponse<IdentitasDRH>>(StaticHelper.postDataUrl, postForm);
            if(result.data.dok.length > 0){
                for(let item of result.data.dok){
                    try {
                        let fileObj = await FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await fs.mkdir(`./result/file/${nip}/identitas`, {recursive: true});
                        let result = await fs.writeFile(`./result/file/${nip}/identitas/${item.niplama??moment().format("YYYYMMDD_HHmmss")}_${item.nmarsip?.trim()??"Arsip"}_${item.nmfile?.replaceAll(`\\`,"_").replaceAll("/","_")}`, Buffer.from(fileObj));
                    } catch(err){
                        console.info(`Error Download File ${item.niplama} : ${item.nmarsip}, Error ${err}`);
                    }
                }
            }
            return result.data;
        } catch(err){
            if(err instanceof Error){
                throw new Error(err.message);
            }
            throw new Error(`${err}`);
        }
    }
}