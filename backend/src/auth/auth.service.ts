import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { SignInDto } from "src/dto/sign-in.dto";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";

@Injectable()
export class AuthService {
    private crypto = require('crypto');
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ){}

    async validateUser(email: string, password: string) {
        const user = await this.userService.validateCredentials(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }

    async login(user: { id: string; email: string }) {
        return await this.refreshTokenService.newToken(user)
    }

    async signup(body: SignInDto) {
        const user = await this.userService.createUser(body)
        if(!user) return null
        return await this.refreshTokenService.newToken({
            id: user.id, 
            email: user.email
        })
    }

    async refresh(refresh_token: string) {
    const hashedToken = await this.crypto
                    .createHash("sha256")
                    .update(refresh_token)
                    .digest("hex");
    return await this.refreshTokenService.refreshToken(hashedToken)
    }
}
