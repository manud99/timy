import { Request, Response, NextFunction } from 'express';

export default function (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    };
}
