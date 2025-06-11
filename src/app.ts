import 'reflect-metadata';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { PostgresDatabase } from './data';
import { envs } from './config';

async function main() {
    const postgres = new PostgresDatabase({
        host: envs.DATABASE_HOST,
        port: envs.DATABASE_PORT,
        username: envs.DATABASE_USERNAME,
        password: envs.DATABASE_PASSWORD,
        database: envs.DATABASE_NAME,
    });

    await postgres.connect();

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    await server.start();

}

main();
