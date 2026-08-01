import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token/refresh-token.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    Neo4jModule.forRoot({
    scheme: process.env.NEO4J_SCHEME || 'neo4j',
    host: process.env.NEO4J_HOST || "",
    port: process.env.NEO4J_PORT || "",
    username: process.env.NEO4J_USERNAME || "",
    password: process.env.NEO4J_PASSWORD || "",
    database: process.env.NEO4J_DATABASE || "",

  }),
    AuthModule,
    UserModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "1h" },
      }),],
  controllers: [AppController],
  providers: [AppService, RefreshTokenService],
})
export class AppModule {}
