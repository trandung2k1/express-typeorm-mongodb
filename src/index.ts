import { AppDataSource } from './data-source';
import { User } from './entity/User';
import express, { NextFunction, Request, Response } from 'express';
import colors from 'colors';
import { errorHandler, notFound } from './middlewares/handlerError.middleware';
const port = 3000;
const startServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            let msg: string;
            const userRepo = AppDataSource.getRepository(User);
            const user = new User();
            user.firstName = 'Dung';
            user.lastName = 'Tran';
            user.age = 23;
            const savedUser = await userRepo.save(user);
            const findUser = await userRepo.findOne({
                where: {
                    firstName: 'Mai',
                },
            });
            if (!findUser) {
                msg = 'User not found and rollback';
                await userRepo.delete(savedUser);
            }
            if (msg) {
                return res.status(400).json({ msg });
            }
            return res.status(201).json({ user });
        } catch (error) {
            next(error);
        }
    });
    app.use(notFound);
    app.use(errorHandler);
    app.listen(port, () => {
        console.log(colors.green(`Server listening on http://localhost:${port}`));
    });
};

AppDataSource.initialize()
    .then(async () => {
        console.log(colors.green('Connected DB successfully'));
        startServer();
        // Insert database
        // const user = new User()
        // user.firstName = "Timber"
        // user.lastName = "Saw"
        // user.age = 25
        // await AppDataSource.manager.save(user)
        // console.log("Saved a new user with id: " + user.id)
        // const listUser = await AppDataSource.manager.find(User);
        // console.log(listUser);
        // const users = await AppDataSource.manager.getMongoRepository(User).find();
        // console.log(users);
    })
    .catch((error) => console.log(error));
