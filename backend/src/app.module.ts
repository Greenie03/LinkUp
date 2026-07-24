import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';


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

  })],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
