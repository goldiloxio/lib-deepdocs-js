<p align="center">
  <img src="./.github/deep-iceberg.png" width="150" alt="Designed by Freepik from www.flaticon.com" />
</p>
<p align="center">
<strong>DEEPDOCS</strong>
</p>
<p align="center">
  Generate README files recursively at each folder layer.
</p>

* It uses `documentation.js` which supports modern JavaScript: ES5, ES2017, JSX, and [Flow](http://flowtype.org/) type annotations.
* Given an initial path, it crawls into all the subfolders and it generates README files whenever documentation comments are found.
* It can be integrated in githooks and it will take care of creating the README files while adding them in the same commit.
* It captures the content of every `docs.yml` file (used for markdown) and stores them into `documentation.yml` which is used for markup docs instead.


## Usage
Install `deepdocs` using the [npm](https://www.npmjs.com/) package manager:

```sh
$ npm install @raise/deepdocs --save-dev
```
This installs the command `deepdocs` that you can include in your `package.json` and call the build script by providing a source path.

```json
"deepdocs": "deepdocs build --path ./src"

```

## Configs
`documentation.js` allows the usage of configuration files for both markup and markdown docs. This enables the control over the order of the elements in the documentation. To do so, a `documentation.yml` file is expeceted in `docs/configs` for the markup docs and a `docs.yml` file is expected in every folder in which the READMEs will be created (markdown docs).

***Example tree structure***

    .
    ├── ...
    ├── docs
    │   ├── api
    │       └── index.html                # html documentation
    │   └── configs
    │       └── documentation.yml         # configuration files for markup documentation
    ├── src
    │   ├── helpers
    │       ├── index.js
    │       ├── docs.yml                  # configuration files for helpers/index.js
    │       ├── README.md
    │   ├── components
    │       ├── index.js
    │       ├── docs.yml                  # configuration files for components/index.js
    │       ├── README.md
    │   └── ...                           # etc.
    └── ...

## Githooks

To run `deepdocs` automatically add the following script into your githooks:

```sh
#!/bin/bash

if [ ! -f docs/configs/documentation.yml ]; then
  echo >&2 "Documentation config files need to be generated. Please run:"
  echo >&2 "npm run deepdocs"
  exit 1
fi

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
This will take care of creating the README files and add them to your current git commit/push. It looks for README files present in the current git status list and, if they are not prefixed by the delete code `D` (delete), it will seamlessly merge them into your current process.  

It also looks for the existence of `docs/configs/documentation.yml`, which is needed for the yaml compose function described above. If the file is not present it will exit the precommit.


### todo
- [ ] write test mocking `fs` module
- [ ] improve existing documentation comments
- [x] think about prefix/suffix for the name of this package (lib/script/js)
- [ ] make output readme filename configurable
- [ ] create command to remove all the README files in a specified source path
