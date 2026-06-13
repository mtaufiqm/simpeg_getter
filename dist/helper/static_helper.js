"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticHelper = void 0;
class StaticHelper {
    static baseUrl = "https://simpeg.bps.go.id";
    static homeUrl = "https://simpeg.bps.go.id";
    static loginUrl = "https://simpeg.bps.go.id/data/";
    static postDataUrl = "https://simpeg.bps.go.id/data/controller/Request.php";
    static userAgent = "Tabe Min";
    static simpegHeader = {
        "Host": "simpeg.bps.go.id",
        "Origin": "https://simpeg.bps.go.id",
        "User-Agent": StaticHelper.userAgent,
        "Content-Type": "application/x-www-form-urlencoded"
    };
}
exports.StaticHelper = StaticHelper;
//# sourceMappingURL=static_helper.js.map