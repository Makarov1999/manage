export interface IMeasure {
    id: number;
    postId: number;
    paramCode: number;
    date: number;
    waterLevel: number;
    description: string;
    airTemp: number;
    atmospherePressure: number;
    windSpeed: number;
    snowThickness: number;
    rainfall: number;
    isRestored: boolean;
}