import { AxiosInstance } from "axios";
import { UserModel } from "./model/user_model";
import { DataPokokDRH, IdentitasDRH } from "./model/drh_model";
export type ExecuteActions = {
    getDataPokok?: boolean;
    getIdentitas?: boolean;
};
export declare function execute(userInfo: UserModel, targetNIP: string[], opt?: ExecuteActions): Promise<void>;
export declare function getByNIP(client: AxiosInstance, targetNIP: string, opt?: ExecuteActions): Promise<{
    dataPokok?: DataPokokDRH;
    identitas?: IdentitasDRH;
}>;
export declare function main(userInfo: UserModel, targetNIPs: string): Promise<void>;
//# sourceMappingURL=main.d.ts.map