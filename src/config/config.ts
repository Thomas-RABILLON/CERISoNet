import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: {
    HTTP : Number(process.env.HTTP_PORT) || 3116,
    HTTPS : Number(process.env.HTTPS_PORT) || 3117
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  postgres: {
    HOST : process.env.DB_HOST,
    USER : process.env.DB_USER,
    MDP : process.env.DB_MDP,
    PORT : Number(process.env.DB_PORT),
    DB : process.env.DB_NAME
  }
};

export default config;