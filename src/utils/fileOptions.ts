import { join } from 'path';

export const mimeTypes = {
  excel: /\/(csv|xlsx|xls|spreadsheetml)$/,
  apk: /\/(vnd.android.package-archive)$/,
  exe: 'application/x-msdownload',

  json: 'application/json',
  zip: 'application/zip',
  all: 'application/*',
  images: /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/,
  txt: 'text/plain',
};

export const getFilePath = (file: Express.Multer.File) => {
  // console.log("file path ", file.path, process.env.FILE_PATH);
  // const path = process.env.FILE_PATH || "";
  // console.log(file.path.replace(path, ""));
  // return file.path.split('/')

  return file.filename;
};

export const getAbsoltesFilePath = (filePath: string | undefined) => {
  const path =
    process.env.FILE_PATH ||
    join(process.cwd(), '../', 'TMSFILES', filePath || '');
  return join(path, filePath || 'csvfile');
};
