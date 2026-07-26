import { Module } from '@nestjs/common';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { Neo4jService } from "src/neo4j/neo4j.service";
import { UserService } from './user.service';
import { NEO4J_DRIVER, NEO4J_CONFIG } from '../neo4j/neo4j.constants';

@Module({
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
