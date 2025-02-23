# Platter

Menu management system for restaurants.

## Structure

platter is a monorepo with the following structure:

- `packages/*` - Contains all internally shared packages within apps.
- `apps/*` - All applications that make up the system.
- Site - Contains the landing page of the app

## Tools

- [pnpm](https://pnpm.io/)
- [biome](https://biomejs.dev/)
- [turbo](https://turbo.build/repo/)
- [Github actions](https://docs.github.com/actions)

## Setup

1. Install pnpm: `npm install -g pnpm`
2. Run `pnpm install` to install all dependencies.

## Development

1. Run `pnpm dev` to start the development server (this starts all workspace apps by default) to run specific apps run the app name + dev e.g `pnpm admin:dev`.

2. To install specific dependencies for a workspace app `cd` into the app `cd apps/web` then run `pnpm add <package-name>` to install it as an app dependency.

3. To install specific dependencies for a package `cd` into the package `cd packages/email` then run `pnpm add <package-name>` to install it as a package dependency.

4. To run a command in a workspace app `cd` into the app `cd apps/web` then run `pnpm <command>` to run the command.

## Build

1. Run `pnpm build` to build all workspace apps. 

by Ibrahim 
