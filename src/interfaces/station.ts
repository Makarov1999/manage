import { ILocation } from "./location";
export interface IStation {
    id: number;
    type: string;
    name: string;
    location: ILocation;
    flood: number;
    floodplain: number;
}

