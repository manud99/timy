import { Router } from 'express';
import TimeRepository from '../Repositories/TimeRepository';

const router = Router();

router.get('/api/v1/times', async (req, res) => {
    const timeEntries = await new TimeRepository().all();

    res.json({
        data: timeEntries.map((timeEntry) => ({
            id: timeEntry.id,
            title: timeEntry.title,
            time: timeEntry.time,
            type: timeEntry.type,
        })),
    });
});

router.post('/api/v1/times', (req, res) => {
    console.log(req.body);

    res.json({
        data: {
            id: 2,
            title: req.body.title,
            start: '08:30',
            duration: 15,
        },
    });
});

router.put('/api/v1/times/:id', (req, res) => {
    console.log(req.body, req.params);

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
