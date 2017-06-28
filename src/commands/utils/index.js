import fs from 'fs';
import path from 'path';

const ymlMarkdownPath: string = 'docs.yml';
const ymlMarkupPath: string = path.join('docs', 'configs', 'documentation.yml');
const appendTag: string = '#docs';
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
export const getDirectories: Function = (srcPath: string): string[] =>
  fs
    .readdirSync(srcPath)
    .filter(directoriesFilter(srcPath))
    .filter(dir => !dir.match(TEST_DIRECTORY_REGEX));

/**
* Given a folder path, `getFiles` returns the contained files that
* satisfy the rules given by {@link filesFilter}.
* @function getFiles
*/
export const getFiles: Function = (srcPath: string): string[] =>
  fs
    .readdirSync(srcPath)
    .filter(filesFilter(srcPath))
    .map(filePath(srcPath));

/**
* Returns true if the given folder contains the `docs.yml` file expected in the
* presence of documentation comments.
* @function hasConfig
*/
export const hasConfig: Function = (srcPath: string): boolean =>
  fs
    .readdirSync(srcPath)
    .filter((file: string) => file === ymlMarkdownPath)
    .length > 0;

/**
* This function takes care of appending existing tables of content into
* the main `documentation.yml` file used for markup docs. It allows the
* usage of a main title and description and appends the content only after
* the predefined `#docs` tag.
* @function ymlCompose
*/
export const ymlCompose = (currentPath) => {
  const current = fs.readFileSync(ymlMarkupPath);
  const idxTag = current.indexOf(appendTag) + appendTag.length;

  fs.truncate(ymlMarkupPath, idxTag, () => {
    const content = fs.readFileSync(currentPath, 'utf8');
    const toc = content.replace(/\btoc:/, '');
    fs.appendFileSync(ymlMarkupPath, toc);
  });
};
