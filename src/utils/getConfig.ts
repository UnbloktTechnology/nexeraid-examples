import config from "../config/config.json";

const getConfig = () => {
  const env = process.env.NEXT_PUBLIC_ENVIROMENT ?? "production";
  // @ts-ignore
  return config[env.toLowerCase()];
};

export { getConfig };
