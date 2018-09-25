# VdTooltip

The library template is adapted from `https://github.com/wjentner/typescript-lib-starter`

- creates package for both Node and Browser
- build creates 3 standard "bundle" formats:
  - main -> UMD bundle for Node and Browser
  - module -> transpiled files to ES5 + es2015 modules for tree shaking
  - es2015 -> raw files transpiled to latest ES standard ( es2017 ) ( this is useful if you wann transpile everthing or just wann ship untranspiled esNext code for evergreen browsers)
- also we provide experimantal **FESM** bundle thanks to Webpack 3 and scope hoisting -> you can find it in `lib-fesm` folder ( scope hoisting is now enabled also within UMD == smaller payload size )
- type definitions are automatically generated and shipped with your package

## Start coding jedi

`git clone git@github.com:dbvis-ukon/vd-scatterplot.git`

`cd vd-scatterplot`

Now install all dependencies

`yarn install`

Happy coding !

## Consumption of published library

`yarn add @dbvis/vd-scatterplot` or `npm install @dbvis/vd-scatterplot`

## Format and fix lint errors

`yarn ts:style:fix`

## Generate documentation

`yarn docs`

## Commit ( via commitizen )

- this is preffered way how to create convetional-changelog valid commits
- if you preffer your custom tool we provide a commit hook linter which will error out, it you provide invalid commit message
- if you are in rush and just wanna skip commit message valiation just prefix your message with `WIP: something done` ( if you do this please squash your work when you're done with proper commit message so standard-version can create Changelog and bump version of your library appropriately )

`yarn cz` - will invoke [commitizen CLI](https://github.com/commitizen/cz-cli)

### Note

#### `import()`

This starter uses latest typescript >=2.4 which adds supprot for lazy loading chunks/modules via `import()`.

Please note that if you wanna use that feature, compiler will complain because declaration generation is turned on, and currently TS
can't handle type generation with types that will be loaded in the future ( lazily )

How to solve this:

- turn of type checking and don't generate types for that lazy import: `import('./components/button') as any`
- or you can use this [temporary workaround](https://github.com/Microsoft/TypeScript/issues/16603#issuecomment-310208259)
