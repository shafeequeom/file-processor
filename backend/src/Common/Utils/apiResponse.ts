import { Response } from 'express';

export const successResponse = function (res: Response, messageType: { code: string, message: string }) {
    const data = {
        status: true,
        ...messageType,
    };
    return res.status(200).json(data);
};
export const errorResponse = function (res: Response, messageType: { code: string, message: string }) {
    const data = {
        status: false,
        ...messageType,
    };
    return res.status(500).json(data);
};

export const notFoundResponse = function (res: Response, messageType: { code: string, message: string }) {
    const data = {
        status: false,
        ...messageType,
    };
    return res.status(404).json(data);
};

export const successResponseWithData = function (res: Response, messageType: { code: string, message: string }, data: any) {
    const resData = {
        status: true,
        ...messageType,
        data,
    };
    return res.status(200).json(resData);
};

export const validationErrorWithData = function (res: Response, messageType: { code: string, message: string }) {
    const resData = {
        status: false,
        ...messageType,
    };
    return res.status(400).json(resData);
};

export const unauthorizedWithData = function (res: Response, messageType: { code: string, message: string }) {
    const resData = {
        status: false,
        ...messageType,
    };
    return res.status(401).json(resData);
};

export const unauthorizedResponse = function (res: Response, message: string) {
    const data = {
        status: false,
        message,
    };
    return res.status(401).json(data);
};

export const successResponseWithPaginationData = async function (res: Response, messageType: { code: string, message: string }, data: any, pagination: any) {
    const resData = {
        status: true,
        data,
        ...messageType,
        meta: pagination,
    };
    return res.status(200).json(resData);
};