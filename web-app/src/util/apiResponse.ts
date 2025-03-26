import { NextResponse } from 'next/server';

type ResponseType = {
    status: boolean,
    message: string,
    data?: any,
}

export const successResponse = function (message: string = "Success", data: any = null, statusCode: number = 200) {
    let response: ResponseType = {
        status: true,
        message: message,
    };

    if (data) {
        response.data = data;
    }
    return NextResponse.json(response, { status: statusCode });
};

export const errorResponse = function (message: string = "Success", data: any = null, statusCode: number = 400) {
    let response: ResponseType = {
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
