import { writeFileSync, readFileSync, unlinkSync } from 'fs';

export const writeFile = (name: string, data: string) => {
  writeFileSync(`/tmp/${name}.txt`, data);    
}

export const readFile = (name: string) => {
  return readFileSync(`/tmp/${name}.txt`)
}

export const deleteFile = (name: string) => {
  return unlinkSync(`/tmp/${name}.txt`)
}