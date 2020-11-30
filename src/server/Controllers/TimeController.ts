import { Request, Response, Router } from 'express';
import TimeRepository from '../Repositories/TimeRepository';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/api/v1/times', async (req: Request, res: Response) => {
    const timeEntries = await new TimeRepository().all();

    res.json({
        data: timeEntries.map((timeEntry) => timeEntry.toJson()),
    });
});

router.post(
    '/api/v1/times',
    [
        body('title').if(body('type').not().equals("0")).not().isEmpty(),
        body('type').isIn([0, 1, 2]),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const timeEntry = await new TimeRepository().create(req.body.title, req.body.type);

        res.json({
            data: timeEntry.toJson(),
        });
    },
);

router.put('/api/v1/times/:id', (req, res) => {
    res.json({
        data: {
            id: req.params.id,
            title: req.body.title,
            start: '08:45',
            duration: 15,
        },
    });
});

export default router;
