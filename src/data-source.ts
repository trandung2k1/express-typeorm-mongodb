import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type: 'mongodb',
    database: 'express-typeorm-mongodb',
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
