export class Response<T> {
    success: boolean;
    status: number;
    message: string;
    data: T | null;

    protected constructor(
        success: boolean,
        status: number,
        message: string,
        data: T | null
    ) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Factory method for success
    static Success<T>(status: number, message: string, data: T): Response<T> {
        return new Response<T>(true, status, message, data);
    }

    // Factory method for failure
    static Failure<T>(
        status: number,
        message: string,
        data: T | null = null
    ): Response<T> {
        return new Response<T>(false, status, message, data);
    }

    // Method to handle error
    static handleError<T>(
        error: unknown,
        defaultStatus: number = 500
    ): Response<T> {
        if (error instanceof Error) {
            return Response.Failure<T>(defaultStatus, error.message);
        }
        // For unknown errors, return a generic failure response
        return Response.Failure<T>(defaultStatus, "An unknown error occurred");
    }
}
