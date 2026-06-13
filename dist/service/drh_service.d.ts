import { AxiosInstance } from "axios";
import { IdentitasDRH } from "../model/drh_model";
export declare class DRHService {
    static getDataPokokByNIP(client: AxiosInstance, nip: string): Promise<IdentitasDRH>;
    static getIdentitasByNIP(client: AxiosInstance, nip: string): Promise<IdentitasDRH>;
}
//# sourceMappingURL=drh_service.d.ts.map