import { Router } from 'express';
import TimeRepository from '../Repositories/TimeRepository';

const router = Router();

router.get('/api/v1/times', async (req, res) => {
    const timeRepository = new TimeRepository();
    const timeEntries = await timeRepository.all() as Array<TimeEntry>;

    res.json({
        data: timeEntries.map((timeEntry: TimeEntry) => {
            let start = new Date(timeEntry.start);
            return ({
                id: timeEntry.id,
                title: timeEntry.title,
                start: `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')}`,
                duration: 15,
            });
        }),
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
