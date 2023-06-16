import { ConfigType, registerAs } from "@nestjs/config";
import path from "path";
import type { DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const databaseConfig = registerAs("database", () => ({
  host: process.env.DB_HOST ?? "",
  port: process.env.DB_PORT ?? 5432,
  database: process.env.DB_DATABASE ?? "",
  username: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
}));

export type DatabaseConfigType = ConfigType<typeof databaseConfig>;

export const makeConnectionConfig = (
  config: DatabaseConfigType
): DataSourceOptions => {
  return {
    type: "postgres",
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
    entities: [path.join(__dirname, "..", "**", "*.entity.{ts,js}")],
    migrations: [path.join(__dirname, "migrations/*.{j,t}s")],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
  };
};
