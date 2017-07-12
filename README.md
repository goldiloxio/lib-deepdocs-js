<p align="center">
  <img src="./.github/deep-iceberg.png" width="150" alt="Designed by Freepik from www.flaticon.com" />
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
$ npm install deepdocs --save
```
This installs the command `deepdocs` that you can include in your `package.json` and call the build function by providing a source path.

```json
"deepdocs": "deepdocs build --path ./src"

```

## Configs
`documentation.js` allows the usage of table of contents for both markup and markdown docs. In order to do so, a `documentation.yml` file is expeceted in `docs/configs` for the markup documentation and a `docs.yml` file is expected in every folder in which the READMEs will be created.
To avoid having to copy and paste the content of each `docs.yml` into the `documentation.yml`, deepdocs runs a `ymlCompose` function which will take care of automatically run this operation, right before writing the docs.


***Example tree structure***


    .
    ├── ...
    ├── docs
    ├── configs
 	 	  ├── documentation.yml         #table of content for markup documentation
    ├── src
    │   ├── helpers
    │	 	  ├── index.js
    │	 	  ├── docs.yml				# table of content for helpers/index.js
    │	 	  ├── README.MD
    │   ├── components
    │	 	  ├── index.js
    │	 	  ├── docs.yml              # table of content for components/index.js
    │	 	  ├── README.MD
    │   └── ...                         # etc.
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
