"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
exports.getByNIP = getByNIP;
exports.main = main;
const axios_1 = __importDefault(require("axios"));
const static_helper_1 = require("./helper/static_helper");
const cheerio = __importStar(require("cheerio"));
const tough_cookie_1 = require("tough-cookie");
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const drh_service_1 = require("./service/drh_service");
const dotenv_1 = require("dotenv");
const xlsx_1 = __importDefault(require("xlsx"));
const moment_1 = __importDefault(require("moment"));
const arsip_service_1 = require("./service/arsip_service");
(0, dotenv_1.configDotenv)({
    override: true
});
async function execute(userInfo, targetNIP, opt) {
    try {
        let cookieJar = new tough_cookie_1.CookieJar();
        let client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
            jar: cookieJar
        }));
        let loginSimpegForm = new URLSearchParams();
        loginSimpegForm.append("loginSSO", "heheh");
        console.info(`⌛ Go to SSO Page`);
        let result = await client.post(static_helper_1.StaticHelper.loginUrl, loginSimpegForm, {
            headers: {
                "Host": "simpeg.bps.go.id",
                "Origin": "https://simpeg.bps.go.id",
                "User-Agent": static_helper_1.StaticHelper.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        let htmlObj = cheerio.load(result.data);
        let action = htmlObj("#kc-form-login").attr("action");
        if (!action) {
            throw new Error("Invalid HTML! There is no Form Login Found");
        }
        try {
            //Continue to Login SSO
            let loginSSOForm = new URLSearchParams();
            loginSSOForm.append("username", userInfo.username);
            loginSSOForm.append("password", userInfo.password);
            console.info(`⌛ Trying to Login SSO`);
            let postLogin = await client.post(action, loginSSOForm, {
                headers: {
                    "Host": "sso.bps.go.id",
                    "Origin": "https://sso.bps.go.id",
                    "User-Agent": static_helper_1.StaticHelper.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if (postLogin.data.includes("Invalid username or password.")) {
                console.info(`Failed Login, Invalid Username/Password`);
                return;
            }
        }
        catch (errLogin) {
            console.info(`Failed Login, ${errLogin}`);
            return;
        }
        console.info(`✅️ Success Login`);
        //first, call home
        let resultHome = await client.get(static_helper_1.StaticHelper.homeUrl);
        //then continue execute what you want get
        client.interceptors.request.use((config) => {
            return {
                ...config,
                ...static_helper_1.StaticHelper.simpegHeader
            };
        });
        let dataPokokList = [];
        let identitasList = [];
        //iterate over the targets
        for (let item of targetNIP) {
            let result = await getByNIP(client, item, opt);
            if (result.dataPokok) {
                dataPokokList.push(result.dataPokok.data.at(0));
            }
            if (result.identitas) {
                identitasList.push(result.identitas.data.at(0));
            }
        }
        let workBook = xlsx_1.default.utils.book_new();
        let dataPokokSheet = xlsx_1.default.utils.json_to_sheet(dataPokokList);
        let identitasSheet = xlsx_1.default.utils.json_to_sheet(identitasList);
        xlsx_1.default.utils.book_append_sheet(workBook, dataPokokSheet, "data_pokok");
        xlsx_1.default.utils.book_append_sheet(workBook, identitasSheet, "identitas");
        //write to file
        xlsx_1.default.writeFile(workBook, `./${(0, moment_1.default)().format("YYYYMMDD_HHmmss")}_data.xlsx`);
    }
    catch (err) {
        console.info(`Error Occurred ${err}`);
    }
    finally {
        console.info("Terminated!");
    }
}
async function getByNIP(client, targetNIP, opt) {
    try {
        let returnValue = {};
        if (opt?.getDataPokok) {
            let result = await drh_service_1.DRHService.getDataPokokByNIP(client, targetNIP);
            returnValue.dataPokok = result;
        }
        if (opt?.getIdentitas) {
            let result = await drh_service_1.DRHService.getIdentitasByNIP(client, targetNIP);
            returnValue.identitas = result;
        }
        if (opt?.getArsipAsli) {
            await arsip_service_1.ArsipService.getArsipAsliByNIP(client, targetNIP);
        }
        console.info(`Get Data ${targetNIP} Success.`);
        return returnValue;
    }
    catch (err) {
        console.info(`Failed While Get Data ${targetNIP}, Error : ${err}`);
        return {};
    }
    finally {
        console.info(`Get Data ${targetNIP} Done.`);
    }
}
async function main(userInfo, targetNIPs) {
    let cleanedNIPs = targetNIPs.trim();
    let cleanedUsername = userInfo.username.trim();
    let cleanedPassword = userInfo.password.trim();
    if ((cleanedNIPs === "") || (cleanedUsername === "") || (cleanedPassword === "")) {
        console.info(`Empty Username, Password, Or Target`);
        return;
    }
    userInfo.username = cleanedUsername;
    userInfo.password = cleanedPassword;
    let arrayNIPs = targetNIPs.split(",").map((el) => el.trim());
    await execute(userInfo, arrayNIPs, {
        getDataPokok: true,
        getIdentitas: true,
        getArsipAsli: true
    });
}
main({
    username: process.env.USERNAME ?? "",
    password: process.env.PASSWORD ?? ""
}, process.env.NIP_TARGET ?? "");
//# sourceMappingURL=main.js.map