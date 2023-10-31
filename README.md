# Code Awareness - VSCode web panel

This is the Code Awareness web panel for the Visual Studio Code editor. It is the UX that allows you to interact with peers.
This panel is intended to be loaded by the VSCode Code Awareness extension.
We're using Svelte JS here, to keep a minimal footprint ontop of VSCode, as well as to avoid future issues with large framework runtimes and the custom Electron base of VSCode.

## Getting Started

### Installation

You don't need to install this to run your VSCode extension. The VSCode web panel is available online, and maintained by us here at Code Awareness.

### Development

Prerequisite: `npx office-addin-dev-certs install` to get https on localhost. After installation, restart nginx. The certificate is only valid for one month by default. Also, on latest MacOS / Chrome it doesn't seem to be working at all.

To start developing and customizing this web panel, just run `yarn dev` and have fun. When you change the code, you'll need to refresh VSCode (with the Developer Tools open hit CTRL + R or CMD + R on a Mac).

To develop slightly faster, we tried running the web panel in a browser. This is a bit difficult as most functions require VSCode API, but it's a good idea to work on UX elements in the browser using mocked data. An experimental `debug.ts` is available for that purpose. The idea is that we should be able to show the panel in any state, upon refresh. The debug mock data is being loaded in the `main.ts` when a browser is detected.

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
