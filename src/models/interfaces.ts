export interface StationConf{
    id: string,
    title: string,
    file: string
}
export interface Question{
    id?: string| number;
    question: string,
    type?: "text" | "image";
    image?: "string";
    options: string[],
    correct: number;
};

export interface stationProgress{
    completedStations: string[];
    scores: { [stationId: string]: number };
}