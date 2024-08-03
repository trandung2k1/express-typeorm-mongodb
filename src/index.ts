import { AppDataSource } from './data-source';
import { User } from './entity/User';

AppDataSource.initialize()
    .then(async () => {
        // Insert database
        // const user = new User()
        // user.firstName = "Timber"
        // user.lastName = "Saw"
        // user.age = 25
        // await AppDataSource.manager.save(user)
        // console.log("Saved a new user with id: " + user.id)

        const listUser = await AppDataSource.manager.find(User);
        console.log(listUser);

        const users = await AppDataSource.manager.getMongoRepository(User).find();
        console.log(users);
    })
    .catch((error) => console.log(error));
