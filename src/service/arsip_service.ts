import { AxiosInstance, AxiosResponse } from "axios";
import { ArsipAsli } from "../model/arsip_model";
import { StaticHelper } from "../helper/static_helper";
import { FileService } from "./file_service";
import fs from "fs/promises";
import moment from "moment";
export class ArsipService {
    static async getArsipAsliByNIP(client: AxiosInstance, nip: string): Promise<ArsipAsli>{
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "arsip");
            postForm.append("act","get");
            postForm.append("category", "arsasli");
            postForm.append("nip", nip);
            postForm.append("page", "1");
            postForm.append("rows","100");
            console.info(`⌛ Trying Get Arsip Asli By NIP`);
            let result = await client.post<ArsipAsli, AxiosResponse<ArsipAsli>>(StaticHelper.postDataUrl, postForm);
            if(result.data.rows.length > 0){
                for(let item of result.data.rows){
                    try {
                        let fileObj = await FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await fs.mkdir(`./result/file/${nip}/arsip`, {recursive: true});
                        let result = await fs.writeFile(`./result/file/${nip}/arsip/${item.niplama??moment().format("YYYYMMDD_HHmmss")}_${item.pdfpath?.trim()?.replaceAll(`\\`,"_").replaceAll(`/`,"_")??"Arsip.pdf"}`, Buffer.from(fileObj));
                    } catch(err){
                        console.info(`Error Download File ${nip} : ${item.pdfpath}, Error ${err}`);
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