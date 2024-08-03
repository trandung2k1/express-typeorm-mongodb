import { AppDataSource } from './data-source';
import { User } from './entity/User';
import express, { NextFunction, Request, Response } from 'express';
import colors from 'colors';
import { errorHandler, IError } from './middlewares/handlerError.middleware';
const port = 3000;
const startServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Not working transaction
    app.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            const user = new User();
            user.firstName = 'Dung';
            user.lastName = 'Tran';
            user.age = 23;
            const savedUser = await queryRunner.manager.save(User, user);
            const findUser = await queryRunner.manager.findOne(User, {
                where: {
                    firstName: 'Mai',
                },
            });
            if (findUser === null) {
                throw new IError('Không tìm thấy user', 404);
            }
            await queryRunner.commitTransaction();
            return res.json({ user: savedUser, findUser });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            next(error);
        } finally {
            await queryRunner.release();
        }
    });
    // app.use(notFound);
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
