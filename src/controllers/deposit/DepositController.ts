import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { DepositProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class DepositController {

    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown(),
        body: Joi.object({
            deposit: Joi.number().required().min(1),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers, body }: Request, res: Response): Promise<Response> {

        const { authorization } = headers;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const { deposit } = body;
        if (!deposit) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_ACCEPTABLE,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
        });

        const jwtData = jwtDecode(authorization);
        if (!jwtData) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const depositProvider = new DepositProvider();
        const balance = await depositProvider.execute(jwtData.user_id, deposit);
        if (!balance) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_ACCEPTABLE,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
        });

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: { success: true }
        });
    }
}
