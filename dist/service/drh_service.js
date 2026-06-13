"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRHService = void 0;
const static_helper_1 = require("../helper/static_helper");
const file_service_1 = require("./file_service");
const promises_1 = __importDefault(require("fs/promises"));
const moment_1 = __importDefault(require("moment"));
class DRHService {
    static async getDataPokokByNIP(client, nip) {
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "drhdetail");
            postForm.append("category", "dtpokok");
            postForm.append("id", nip);
            postForm.append("new", "false");
            postForm.append("data", "1");
            console.info(`⌛ Trying Get Data Pokok By NIP`);
            let result = await client.post(static_helper_1.StaticHelper.postDataUrl, postForm);
            if (result.data.dok.length > 0) {
                for (let item of result.data.dok) {
                    try {
                        let fileObj = await file_service_1.FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await promises_1.default.mkdir(`./result/file/${nip}/datapokok`, { recursive: true });
                        let result = await promises_1.default.writeFile(`./result/file/${nip}/datapokok/${item.niplama ?? (0, moment_1.default)().format("YYYYMMDD_HHmmss")}_${item.nmfile?.replaceAll(`\\`, "_").replaceAll("/", "_")}`, Buffer.from(fileObj));
                    }
                    catch (err) {
                        console.info(`Error Download File ${item.niplama} : ${item.nmarsip}`);
                    }
                }
            }
            return result.data;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            throw new Error(`${err}`);
        }
    }
    static async getIdentitasByNIP(client, nip) {
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "drhdetail");
            postForm.append("category", "identitas");
            postForm.append("id", nip);
            postForm.append("new", "false");
            postForm.append("data", "1");
            console.info(`⌛ Trying Get Identitas By NIP`);
            let result = await client.post(static_helper_1.StaticHelper.postDataUrl, postForm);
            if (result.data.dok.length > 0) {
                for (let item of result.data.dok) {
                    try {
                        let fileObj = await file_service_1.FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await promises_1.default.mkdir(`./result/file/${nip}/identitas`, { recursive: true });
                        let result = await promises_1.default.writeFile(`./result/file/${nip}/identitas/${item.niplama ?? (0, moment_1.default)().format("YYYYMMDD_HHmmss")}_${item.nmarsip?.trim() ?? "Arsip"}_${item.nmfile?.replaceAll(`\\`, "_").replaceAll("/", "_")}`, Buffer.from(fileObj));
                    }
                    catch (err) {
                        console.info(`Error Download File ${item.niplama} : ${item.nmarsip}, Error ${err}`);
                    }
                }
            }
            return result.data;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            throw new Error(`${err}`);
        }
    }
}
exports.DRHService = DRHService;
//# sourceMappingURL=drh_service.js.map