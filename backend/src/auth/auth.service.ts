import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { SignInDto } from "src/dto/sign-in.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async validateUser(email: string, password: string) {
        const user = await this.userService.validateCredentials(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }

    async login(user: { id: string; email: string }) {
        const payload = { sub: user.id, email: user.email };
        return {
        access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signup(body: SignInDto) {
        const user = await this.userService.createUser(body)
        if(!user) return null
        const payload = {
            sub: user.id,
            email: user.email,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
