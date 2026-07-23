import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Neo4jModule } from './neo4j/neo4j.module';


@Module({
  imports: [Neo4jModule.forRoot({
    scheme: 'neo4j+s',
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",

  })],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
