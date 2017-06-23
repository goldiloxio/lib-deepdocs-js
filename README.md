<p align="center">
  <img src="./.github/deep-iceberg.png" width="150" alt="Designed by Freepik from www.flaticon.com" />
</p>

<p align="center">
  Generate README files recursively at each folder layer.
</p>

* It uses `documentation.js` which supports modern JavaScript: ES5, ES2017, JSX, and [Flow](http://flowtype.org/) type annotations.
* Given an initial path, it crawls into all the subfolders and it generates README files whenever documentation comments are found.
* It can be integrated in githooks and it will take care of creating the README files while adding them in the same commit.

## Usage
Install `deepdocs` using the [npm](https://www.npmjs.com/) package manager:
```sh
$ npm install deepdocs --save
```
This installs a command called `deepdocs` that you can include in your `package.json` file and call the build function by providing a source path.

## Examples

```json
"deepdocs": "deepdocs build --path ./src"

```

To run `deepdocs` automatically add the following script into your githooks:
```sh
#!/bin/bash

npm run deepdocs

re="README"
files=`git status -s | grep "$re" | cut -c4-`
code=`git status -s | grep "$re" | cut -c1- | head -c 1`

if [ ! -z "$files" ] && [ "$code" != "D" ]
then
  `git add $files`
  echo "Adding README files"
fi
```
This will take care of creating the README files and add them to your current git commit/push. It looks for README files present in the current git status list and, if they are not prefixed by the delete code -`D`-, it will seamlessly merge them into your current process.  

## Configs
`deepdocs` allows the implementation of table of contents to better control the structure of the documentation. Since each layer is dynamic and initially unkown, by default the command will look for config files prefixed by the name of the current folder and suffixed by `Config.json`.

***Example***
If the folder that contains documentation comments is called `build`, while creating the README files `deepdocs` will also look for a file called `buildConfig.json` in the following path: `./docs/configs/`. In order to have a dedicated toc for each folder level just populate the configs folder with the expected files.


### todo
- [ ] upload package to Nexus
- [ ] write test mocking `fs` module
- [ ] improve existing documentation comments
- [x] think about prefix/suffix for the name of this package (lib/script/js)
- [ ] make output readme filename configurable
- [ ] remove all the README files in a specified source path
