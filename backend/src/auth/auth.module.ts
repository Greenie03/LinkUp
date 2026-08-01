import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '1h',
          },
        }),
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService, RefreshTokenService],
})
export class AuthModule {}