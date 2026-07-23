import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class UserService {
    users: User[] = [new User("1", "Alice"), new User("2", "Bob")];
    
    constructor(private readonly neo4jService: Neo4jService){}

    getUserById(id: string): User|undefined {
        return this.users.find((u) => {return u.getId() === id});
    }

    getAllUsers(): User[] {
        return this.users;
    }
}
