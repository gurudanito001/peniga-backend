import dotenv from "dotenv";

// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  environment: string | undefined;
  SERVER_PORT: number | undefined;
  DATABASE_URL: string | undefined;
  ACCESS_TOKEN_EXPIRY: number | undefined;
  SECRET: string | undefined;
  cloudinary_cloud_name: string | undefined;
  cloudinary_api_key: string | undefined;
  cloudinary_api_secret: string | undefined;
  email_username: string | undefined;
  email_password: string | undefined;
}

interface Config {
  environment: string
  DATABASE_URL: string;
  SECRET: string;
  SERVER_PORT: number;
  ACCESS_TOKEN_EXPIRY: number;
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  cloudinary_api_secret: string;
  email_username: string | undefined;
  email_password: string | undefined;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    environment: process.env.environment,
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET: process.env.SECRET,
    SERVER_PORT: Number(process.env.SERVER_PORT),
    ACCESS_TOKEN_EXPIRY: Number(process.env.ACCESS_TOKEN_EXPIRY),
    cloudinary_cloud_name: process.env.cloudinary_cloud_name,
    cloudinary_api_key: process.env.cloudinary_api_key,
    cloudinary_api_secret: process.env.cloudinary_api_secret,
    email_username: process.env.email_username,
    email_password: process.env.email_password,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
