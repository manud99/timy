import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import wrap from '../services/ExpressAsyncWrapper';
import TimeRepository from '../repositories/TimeRepository';

const router = Router();

router.get('/api/v1/times', wrap(async (req, res) => {
    const timeEntries = await new TimeRepository().all();

    res.json({
        data: timeEntries.map((timeEntry) => timeEntry.toJson()),
    });
}));

router.post(
    '/api/v1/times',
    body('title')
        .if(body('type').not().equals("0"))
        .not().isEmpty(),
    body('type')
        .isIn([0, 1, 2]),
    wrap(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const timeEntry = await new TimeRepository().create(req.body.title, req.body.type);
        res.json({
            data: timeEntry.toJson(),
        });
    }),
);

router.put('/api/v1/times/:id', wrap((req, res) => {
    res.json({
        data: {
            id: req.params.id,
            title: req.body.title,
            start: '08:45',
            duration: 15,
        },
    });
}));

router.delete('/api/v1/times/:id', wrap(async (req, res) => {
    const timeRepository = new TimeRepository();

    const timeEntry = await timeRepository.find(Number(req.params.id));
    if (!timeEntry) {
        res.status(404).send('Time entry not found.');
    }

    const result = await timeRepository.delete(timeEntry.id);

    res.json({
        status: result,
    });
}));

export default router;
