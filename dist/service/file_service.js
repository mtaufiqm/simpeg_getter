"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const static_helper_1 = require("../helper/static_helper");
class FileService {
    static async downloadFile(client, file_id) {
        //first get download link
        let postFormData = new URLSearchParams();
        postFormData.append("req", "down");
        postFormData.append("id", file_id);
        console.info(`⌛ Trying Download File ${file_id}`);
        let resultLink = await client.post(static_helper_1.StaticHelper.postDataUrl, postFormData);
        //then download file
        let result = await client.get(`${static_helper_1.StaticHelper.baseUrl}/data/${resultLink.data}`, {
            responseType: "arraybuffer"
        });
        return result.data;
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file_service.js.map