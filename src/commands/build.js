/* @flow */
import documentation from 'documentation';
import fs from 'fs';
import path from 'path';

const command: string = 'build [input..]';

const TEST_DIRECTORY_REGEX: RegExp = /^__.+__$/;

const directoriesFilter: Function = (srcPath: string): Function => (
  file: string,
): boolean => fs.statSync(path.join(srcPath, file)).isDirectory();

/**
* Given a folder path, `getDirectories` returns contained
* sub-folders that are not dedicated to testing.
*
* @function getDirectories
* @returns array of folders names
*/
const getDirectories: Function = (srcPath: string): string[] =>
fs
.readdirSync(srcPath)
.filter(directoriesFilter(srcPath))
.filter(dir => !dir.match(TEST_DIRECTORY_REGEX));

/**
* Passes all the files contained in the folder to `documentation.js`
* which will look for comments and extract them into a README file.
* @function write
*/
const write: Function = (srcPath: string, dir: string): void => {
  const toc = `./docs/configs/${dir}Config.yml`;
  const config = fs.existsSync(`./docs/configs/${dir}Config.yml`) ? toc : {};
  const options = { config, shallow: true };
  documentation
  .build([srcPath], options)
  .then((res) => {
    if (res.length > 0) {
      documentation.formats.md(res, {}).then((output) => {
        fs.writeFileSync(`${srcPath}/README.md`, output);
      });
    }
  })
  .catch((err) => {
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
  dir: ?string = undefined,
): void | Function => {
  const directories: string[] = getDirectories(srcPath);
  if (directories !== []) {
    directories.forEach(directory =>
      init(`${srcPath}/${directory}`, directory),
    );
  }
  if (!srcPath.includes('node_modules')) {
    return write(srcPath, dir);
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
