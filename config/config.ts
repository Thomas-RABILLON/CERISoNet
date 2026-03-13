import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: {
    HTTP: Number(process.env.HTTP_PORT) || 3116,
    HTTPS: Number(process.env.HTTPS_PORT) || 3117
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  postgres: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    MDP: process.env.DB_MDP,
    PORT: Number(process.env.DB_PORT),
    DB: process.env.DB_NAME
  },
  mongo: {
    SECRET: String(process.env.SESSION_SECRET) || 'mysecret',
    HOST: process.env.MONGO_HOST,
    PORT: Number(process.env.MONGO_PORT),
    DB: process.env.MONGO_DB,
    COLLECTION: String(process.env.MONGO_COLLECTION)
  }
};

export default config;