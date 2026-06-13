import { AxiosInstance, AxiosResponse } from "axios";
import { StaticHelper } from "../helper/static_helper";

export class FileService {
    static async downloadFile(client: AxiosInstance, file_id: string): Promise<ArrayBuffer>{
        //first get download link
        let postFormData = new URLSearchParams();
        postFormData.append("req", "down");
        postFormData.append("id", file_id);
        console.info(`⌛ Trying Download File ${file_id}`);
        let resultLink = await client.post<string, AxiosResponse<string>, URLSearchParams>(StaticHelper.postDataUrl, postFormData);
        //then download file
        let result = await client.get<ArrayBuffer>(`${StaticHelper.baseUrl}/data/${resultLink.data}`, {
            responseType: "arraybuffer"
        });
        return result.data;
    }
}