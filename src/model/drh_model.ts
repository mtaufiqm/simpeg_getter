export type DataPokokDRHData = {
            "id": string;
            "niplama"?: string | null;
            "nipbaru"?: string | null;
            "gelardepan"?: string | null;
            "nama"?: string | null;
            "gelarbelakang"?: string | null;
            "alias"?: string | null;
            "tgllahir"?: string | null;
            "flagwillhr"?: number | null;
            "kdproplhr"?: string | null;
            "kdkablhr"?: string | null;
            "tempatlhr"?: string | null;
            "sex"?: string | null;
            "pensiun"?: string | null;
            "kdagama"?: string | null;
            "jmlanak"?: string | null;
            "gol"?: string | null;
            "nmwil"?: string | null;
            "stjab"?: string | null;
            "stp"?: string | null;
            "pend"?: string | null;
            "kdstkawin"?: string | null;
            "statuskawin"?: string | null;
            "nmjodoh"?: string | null;
            "nipjodoh"?: string | null;
            "kredit"?: number| null;
            "jfung"?: string | null;
            "foto"?: string | null;
            "iscpns"?: number | null;    
};
export type DataPokokDRH = {
    data: DataPokokDRHData[],
    dok: {
        id: string;
        niplama?: string | null;
        kduser?: string | null;
        kdarsip?: string | null;
        nmarsip?: string | null;
        nmfile?: string | null;
        tipe?: string | null;
    }[];
}

export type IdentitasDRHData = {
    id: string;
    niplama?: string | null;
    kpe?: string | null;
    karpeg?: string | null;
    karsu?: string | null;
    askes?: string | null;
    taspen?: string | null;
    ktp?: string | null;
    sim?: string | null;
    paspor?: string | null;
    rekening?: string | null;
    npwp?: string | null;
    kk?: string | null;
    nmuser?: string | null;    
};
export type IdentitasDRH = {
    data: IdentitasDRHData[],
    dok: {
        id: string;
        niplama?: string | null;
        kduser?: string | null;
        kdarsip?: string | null;
        nmarsip?: string | null;
        nmfile?: string | null;
        tipe?: string | null;
    }[];
}