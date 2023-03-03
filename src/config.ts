export const config = {
  db: {
    type: 'postgres',
    host: "",// process.env.POSTGRES_HOST,
    port: 0, // Number(process.env.POSTGRES_PORT),
    username: "", // process.env.POSTGRES_USERNAME,
    password: "",// process.env.POSTGRES_PASSWORD,
    database: "",// process.env.POSTGRES_DATABASE,
    entities: [""],// [ 'dist/entities/**/*.entity.js' ],
    synchronize: true,
  }
}