/* @flow */
import documentation from 'documentation';
import fs from 'fs';
import path from 'path';

const command: string = 'build [input..]';
const docsYml: string = 'docs.yml';
const extensions: string[] = ['.js'];
const TEST_DIRECTORY_REGEX: RegExp = /^__.+__$/;

/**
* Given a source path, this function returns all existing sub-folders
* @function directoriesFilter
*/
const directoriesFilter: Function = (srcPath: string): Function => (
  file: string,
): boolean => fs.statSync(path.join(srcPath, file)).isDirectory();

/**
* Given a specific folder, returns all the files that have one of the
* extensions allowed.
* Current extensions: `['.js']`.
* @function filesFilter
*/
const filesFilter: Function = (srcPath: string): Function => (
  file: string,
): boolean => {
  const currentPath = path.join(srcPath, file);
  return (
    fs.statSync(currentPath).isFile() &&
    extensions.includes(path.extname(currentPath))
  );
};

/**
* Returns the complete path to a specific file.
* @function filePath
*/
const filePath: Function = (srcPath: string): Function => (
  file: string,
): string => path.join(srcPath, file);

/**
* Given a folder path, `getDirectories` returns contained
* sub-folders that are not dedicated to testing.
* @function getDirectories
* @returns array of folders names
*/
const getDirectories: Function = (srcPath: string): string[] =>
  fs
    .readdirSync(srcPath)
    .filter(directoriesFilter(srcPath))
    .filter(dir => !dir.match(TEST_DIRECTORY_REGEX));

/**
* Given a folder path, `getFiles` returns the contained files that
* satisfy the rules given by {@link filesFilter}.
* @function getFiles
*/
const getFiles: Function = (srcPath: string): string[] =>
  fs
    .readdirSync(srcPath)
    .filter(filesFilter(srcPath))
    .map(filePath(srcPath));

/**
* Returns true if the given folder contains the `docs.yml` file expected in the
* presence of documentation comments.
* @function hasConfig
*/
const hasConfig: Function = (srcPath: string): boolean =>
  fs
    .readdirSync(srcPath)
    .filter((file: string) => file === docsYml)
    .length > 0;

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
