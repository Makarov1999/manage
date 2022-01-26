export interface IApiResponse<T> {
    status: boolean,
    response?: T;
    error?: string;
}