"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArsipService = void 0;
const static_helper_1 = require("../helper/static_helper");
const file_service_1 = require("./file_service");
const promises_1 = __importDefault(require("fs/promises"));
const moment_1 = __importDefault(require("moment"));
class ArsipService {
    static async getArsipAsliByNIP(client, nip) {
        try {
            let postForm = new URLSearchParams();
            postForm.append("req", "arsip");
            postForm.append("act", "get");
            postForm.append("category", "arsasli");
            postForm.append("nip", nip);
            postForm.append("page", "1");
            postForm.append("rows", "100");
            console.info(`⌛ Trying Get Arsip Asli By NIP`);
            let result = await client.post(static_helper_1.StaticHelper.postDataUrl, postForm);
            if (result.data.rows.length > 0) {
                for (let item of result.data.rows) {
                    try {
                        let fileObj = await file_service_1.FileService.downloadFile(client, item.id);
                        //create dir first if not exists
                        let resultDir = await promises_1.default.mkdir(`./result/file/${nip}/arsip`, { recursive: true });
                        let result = await promises_1.default.writeFile(`./result/file/${nip}/arsip/${item.niplama ?? (0, moment_1.default)().format("YYYYMMDD_HHmmss")}_${item.pdfpath?.trim()?.replaceAll(`\\`, "_").replaceAll(`/`, "_") ?? "Arsip.pdf"}`, Buffer.from(fileObj));
                    }
                    catch (err) {
                        console.info(`Error Download File ${nip} : ${item.pdfpath}, Error ${err}`);
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
exports.ArsipService = ArsipService;
//# sourceMappingURL=arsip_service.js.map