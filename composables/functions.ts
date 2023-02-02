export interface Idata {
    id: number;
    title: string;
    href: string;
    src: string;
    region: string;
    color: number[];
}

export const baseURL = "http://localhost:3000/items/";