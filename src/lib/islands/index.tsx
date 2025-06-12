export { Island } from "./server.js";

export { registerIslands } from "./shared.js";

// TODO: add config
// - server file paths to components on disk
// - server file paths to build folder
// - base url to served build folder

// TODO: follow up to config
// when config is implemented, registerIslands() should check if the file is included in the "server file paths to components on disk"
// when config is implemented, resolveComponentBuildPath() should use the config to resolve the build path

// TODO: should the code also work for common js? - would mean:
// - no code splitting
// - import.meta is not available
// probably impossible without import.meta

// TODO: publish to npm
// instructions: https://www.totaltypescript.com/how-to-create-an-npm-package#8-set-up-our-ci-with-github-actions
