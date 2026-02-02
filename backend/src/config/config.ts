import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: {
    HTTP : Number(process.env.PORT) || 3116,
    HTTPS : Number(process.env.PORT) || 3117
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;