# Code Awareness - VSCode web panel

This is the Code Awareness web panel for the Visual Studio Code editor. It is the UX that allows you to interact with peers.
This panel is intended to be loaded by the VSCode Code Awareness extension.
We're using Svelte JS here, to keep a minimal footprint ontop of VSCode, as well as to avoid future issues with large framework runtimes and the custom Electron base of VSCode.

## Getting Started

### Installation

1. Clone the repo, install the dependencies.

```bash
yarn
```

### Development Run

```
yarn dev
```

### Test

NOTE: Tests don't yet work. We're currently working on porting tests from an older version of this project.
```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

### Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix
```

## Dev Notes

This webview panel communicates with VSCode via VSCode IPC (webview.postMessage). Direct communication with the local service is not possible, so all such requests must be proxies through the IPC.
