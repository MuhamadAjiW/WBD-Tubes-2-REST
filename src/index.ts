import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send(`Server setup at ${port}`);
});
app.post('/testPrisma', async (req: Request, res: Response) => {
    try{
        const { name, email } = req.body;
        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Bad request' });
    }
});

app.listen(port, () => {
    console.log(`Server setup at ${port}`);
});