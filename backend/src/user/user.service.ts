import { Injectable } from '@nestjs/common';
import { Record } from 'neo4j-driver';
import { User } from 'src/entity/user.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class UserService {
    users: User[] = [new User("1", "Alice"), new User("2", "Bob")];
    
    constructor(private readonly neo4jService: Neo4jService){}

    async getUserById(id: string): Promise<User|undefined> {
        const result = await this.neo4jService.read("MATCH (n:User) WHERE elementId(n)=$id RETURN elementId(n) AS id, n.name, n.email LIMIT 25;", {"id": id})
        if (result.records.length > 0){
            return result.records.map(record => {
            return new User(record.get('id'), record.get('n.name'))
        })[0]
        }
        return undefined
    }

    async getUserByName(name: string): Promise<User|undefined> {
        const result = await this.neo4jService.read("MATCH (n:User {name: $name}) RETURN elementId(n) AS id, n.name, n.email LIMIT 25;", {"name": name})
        if (result.records.length > 0){
            return result.records.map(record => {
            return new User(record.get('id'), record.get('n.name'))
        })[0]
        }
        return undefined
    }

    async getAllUsers(): Promise<User[]> {
        const result = await this.neo4jService.read("MATCH (n:User) RETURN elementId(n) AS id, n.name, n.email LIMIT 25;", {})
        const users = result.records.map(record => {
            return new User(record.get('id'), record.get('n.name'))
        })
        return users;
    }
}
