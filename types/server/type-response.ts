export type TResponseSuccess<T> = {
    status: number;
    message: string;
    data: T;
};
