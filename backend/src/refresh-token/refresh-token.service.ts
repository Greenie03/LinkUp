import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly jwtService: JwtService
    ){}

    async getUserFromRefreshToken(refresh_token: string) {
        const result = await this.neo4jService.write(
            "MATCH (u:User)<-[]-(t:RefreshToken) WHERE t.token=$token RETURN elementId(u) AS id, u.email AS email;", 
            {
                "token": refresh_token
            }
        )
        if (result.records.length > 0){
                    return result.records.map(record => {
                    return {
                        id: record.get('id'),
                        email: record.get('email')
                    }
                })[0]
                }
                return null
    }

    async store(id: string, refreshToken: string, expiresAt: Date) {
        const result = await this.neo4jService.write(
            "MATCH (u:User) WHERE elementId(u)=$id MERGE (t:RefreshToken)-[:belongs_to]->(u) SET t.token=$token, t.expiresAt=$expiresAt RETURN t.token AS token, t.expiresAt AS expiresAt;", 
            {
                "id": id,
                "token": refreshToken,
                "expiresAt": expiresAt.toDateString()
            }
        )
        if (result.records.length > 0){
                    return result.records.map(record => {
                    return {
                        refresh_token: record.get('token'),
                        expiresAt: record.get('expiresAt')
                    }
                })[0]
                }
                return null
    }

    async isValid(refreshToken: string): Promise<boolean> {
        const result = await this.neo4jService.write(
                    "MATCH (t:RefreshToken) WHERE t.token = $token RETURN t", {"token": refreshToken}
                )
                const record = result.records[0];
                if (!record) {
                    return false;
                }
                return true;
    }

    async newToken(user: {id, email}){
        const crypto = require('crypto');
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: "15m",
                })
            const refreshToken = crypto.randomBytes(32).toString("hex");
            const hashedRefreshToken = await crypto
                    .createHash("sha256")
                    .update(refreshToken)
                    .digest("hex");
            this.store(
                user.id, 
                hashedRefreshToken,
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            )
        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async refreshToken(refreshToken: string) {
        const isValid = await this.isValid(refreshToken)
        const user = await this.getUserFromRefreshToken(refreshToken)
        if(user && isValid){
            const payload = {id: user.id, email: user.email}
            return await this.newToken(payload)
        }
        throw new UnauthorizedException("Invalid refresh token");
    }

}

