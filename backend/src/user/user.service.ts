import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {
    users: User[] = [new User("1", "Alice"), new User("2", "Bob")];

    getUserById(id: string): User|undefined {
        return this.users.find((u) => {return u.getId() === id});
    }

    getAllUsers(): User[] {
        return this.users;
    }
}
