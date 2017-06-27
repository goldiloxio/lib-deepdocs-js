/* @flow */
import documentation from 'documentation';
import fs from 'fs';
import path from 'path';
import { getDirectories, getFiles, hasConfig } from './utils';

const command: string = 'build [input..]';

/**
* Passes all the files contained in the folder to `documentation.js`
* which will look for comments and extract them into a README file.
* @function write
*/
const write: Function = (srcPath: string): void => {
  const config: ?string = hasConfig(srcPath)
    ? path.join(srcPath, 'docs.yml')
    : undefined;
  const options = { config, shallow: true };
  const containedFiles = getFiles(srcPath);

  documentation
    .build(containedFiles, options)
    .then((res: string) => {
      if (res.length && !hasConfig(srcPath)) {
        throw new Error(`Please include table of content for ${srcPath}`);
      } else if (res.length) {
        documentation.formats.md(res, {}).then((output: string) => {
          const file = path.join(srcPath, 'README.md');
          fs.writeFileSync(file, output);
        });
      }
    })
    .catch((err: string) => {
      console.log('before', err); // eslint-disable-line no-console
      throw err;
    });
};

/**
* Given a path, the `init` function looks for the existence of sub-folders
* and keep calling itself until it reaches a layer containing no more folders.
* For each layer calls the {@link #write} function which will take care of creating the
* README file.
* @function init
*/
const init: Function = (
  srcPath: string,
): void | Function => {
  const directories: string[] = getDirectories(srcPath);
  if (directories.length) {
    directories.forEach((directory: string) => {
      const dirPath = path.join(srcPath, directory);
      return init(dirPath);
    });
  }
  if (!srcPath.includes('node_modules')) {
    return write(srcPath);
  }
  return undefined;
};

/**
* This function handles the command line input and looks for the custom
* path. If not included it throws an error, otherwise it inits the process.
* @function handler
*/
const handler: Function = (argv: Object): void => {
  const srcPath = argv ? argv.path || argv.p : undefined;
  if (!srcPath) {
    throw new Error('Please provide source path for deepdocs');
  }
  init(srcPath);
};

export default {
  handler,
  command,
};
