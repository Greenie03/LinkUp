import { Injectable } from '@nestjs/common';
import { Record } from 'neo4j-driver';
import { User } from 'src/entity/user.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import * as bcrypt from "bcrypt";
import { SignInDto } from 'src/dto/sign-in.dto';

@Injectable()
export class UserService {
    
    constructor(private readonly neo4jService: Neo4jService){}

    async createUser(signInDto: SignInDto): Promise<any> {
        const hash = await bcrypt.hash(signInDto.password, 10)
        const result = await this.neo4jService.write(
            "MERGE (n:User{name: $name, email: $email, hash: $hash}) RETURN elementId(n) AS id, n.name AS name, n.email AS email;", 
            {"name": signInDto.name, "email": signInDto.email,"hash": hash}
        )
        const record = result.records[0];
        if (!record) {
            return null;
        }

        return new User(
            record.get("id"),
            record.get("name"),
            record.get("email"),
        );
    }

    async getUserById(id: string): Promise<User|null> {
        const result = await this.neo4jService.read(
            "MATCH (n:User) WHERE elementId(n)=$id RETURN elementId(n) AS id, n.name AS name, n.email AS email LIMIT 25;", 
            {"id": id}
        )
        const record = result.records[0];

        if (!record) {
            return null;
        }

        return new User(
            record.get("id"),
            record.get("name"),
            record.get("email"),
        );
    }

    async search(q: string): Promise<User[]> {
        const result = await this.neo4jService.read("MATCH (n:User) WHERE n.name =~ $q RETURN elementId(n) AS id, n.name, n.email LIMIT 25;", {"q": '(?i).*'+q+'.*'})
        const users = result.records.map(record => {
            return new User(record.get('id'), record.get('n.name'), record.get('n.email'))
        })
        return users
    }

    async getUserByName(name: string): Promise<User|null> {
        const result = await this.neo4jService.read("MATCH (n:User {name: $name}) RETURN elementId(n) AS id, n.name AS name, n.email AS email LIMIT 25;", {"name": name})
        const record = result.records[0];

        if (!record) {
            return null;
        }

        return new User(
            record.get("id"),
            record.get("name"),
            record.get("email"),
        );
    }

    async getAllUsers(): Promise<User[]> {
        const result = await this.neo4jService.read("MATCH (n:User) RETURN elementId(n) AS id, n.name, n.email LIMIT 25;", {})
        const users = result.records.map(record => {
            return new User(record.get('id'), record.get('n.name'), record.get('n.email'))
        })
        return users;
    }

    async findByEmail(email: string) {
        const result = await this.neo4jService.read("MATCH (n:User {email: $email}) RETURN elementId(n) AS id, n.name AS name, n.email AS email, n.hash AS hash LIMIT 25;", {"email": email})
        const record = result.records[0]

        if(!record){
            return null
        }

        return {
            "infos": new User(record.get('id'), record.get('name'), record.get('email')),
            "hash": record.get('hash')
        }

    }

    async validateCredentials(email: string, password: string) {
        const user = await this.findByEmail(email);
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.hash);
        return ok ? user.infos : null;
    }
}
