import { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';

const FOLDER_PATH = './my-data-webhook';

export const writeFile = (name: string, data: string) => {
  createFolderIfNotExists();
  writeFileSync(`${FOLDER_PATH}/${name.toLowerCase()}.txt`, data);
}

export const readFile = (name: string) => {
  return readFileSync(`${FOLDER_PATH}/${name.toLowerCase()}.txt`)
}

export const deleteFile = (name: string) => {
  return unlinkSync(`${FOLDER_PATH}/${name.toLowerCase()}.txt`)
}

const createFolderIfNotExists = () => {
  if (!existsSync(FOLDER_PATH)) {
    mkdirSync(FOLDER_PATH, { recursive: true });
  }
}