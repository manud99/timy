import { Request, Response, NextFunction, RequestHandler } from 'express';

export default function (fn: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next)
    }
}
