import { AxiosHeaders } from "axios";

export class StaticHelper {
    static baseUrl: string = "https://simpeg.bps.go.id";
    static homeUrl: string = "https://simpeg.bps.go.id";
    static loginUrl: string = "https://simpeg.bps.go.id/data/";
    static postDataUrl: string = "https://simpeg.bps.go.id/data/controller/Request.php";
    static userAgent: string = "Tabe Min";
    static simpegHeader: {[key: string]: string} = {
        "Host": "simpeg.bps.go.id",
        "Origin": "https://simpeg.bps.go.id",
        "User-Agent": StaticHelper.userAgent,
        "Content-Type": "application/x-www-form-urlencoded"
    };
}

