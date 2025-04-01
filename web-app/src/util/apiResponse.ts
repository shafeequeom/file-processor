import { NextResponse } from 'next/server';

type ResponseType<T> = {
    status: boolean,
    message: string,
    data?: T,
}

export const successResponse = function <T>(message: string = "Success", data: T | null = null, statusCode: number = 200) {
    const response: ResponseType<T> = {
        status: true,
        message: message,
    };

    if (data) {
        response.data = data;
    }
    return NextResponse.json(response, { status: statusCode });
};

export const errorResponse = function <T>(message: string = "Success", data: T | null = null, statusCode: number = 400) {
    const response: ResponseType<T> = {
        status: false,
        message: message,
    };

    if (data) {
        response.data = data;
    }

    return NextResponse.json(response, { status: statusCode });
};

export const notFoundResponse = function (msg?: string) {
    const data = {
        status: false,
        message: msg ? msg : "Not Found",
    };

    return NextResponse.json(data, { status: 404 });
};
