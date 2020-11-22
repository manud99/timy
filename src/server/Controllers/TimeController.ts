import { Router } from 'express';
import TimeRepository from '../Repositories/TimeRepository';

const router = Router();

router.get('/api/v1/times', (req, res) => {
    res.json({
        data: [
            {
                id: 1,
                title: 'Reading emails',
                start: '08:15',
                duration: 15,
            },
        ],
    });
});

router.post('/api/v1/times', (req, res) => {
    console.log(req.body);

    res.json({
        data: {
            id: 2,
            title: req.params.title,
            start: '08:30',
            duration: 15,
        }
    });
});

export default router;
