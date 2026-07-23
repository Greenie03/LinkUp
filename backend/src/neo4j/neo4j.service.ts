import { Injectable, Inject } from '@nestjs/common';
import neo4j from 'neo4j-driver';
import { Result } from 'neo4j-driver';
import { NEO4J_DRIVER, NEO4J_CONFIG } from './neo4j.constants';
import { Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
    constructor(
        @Inject(NEO4J_CONFIG) private readonly config,
        @Inject(NEO4J_DRIVER) private readonly driver
    ) {}
    getReadSession(database?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j.session.READ,
        })
    }
    getWriteSession(database?: string): Session  {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j.session.WRITE,
        })
    }

    read(cypher: string, params: Record<string, any>, database?: string): Result {
    const session = this.getReadSession(database)
    return session.run(cypher, params)
    }

    write(cypher: string, params: Record<string, any>, database?: string): Result {
    const session = this.getWriteSession(database)
    return session.run(cypher, params)
    }
}
