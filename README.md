# Timy

Manage your work time locally with Time. Timy is a single-page application (SPA) that enables you to easily track your activities. It runs locally on your computer and uses a cloud calendar that allows you to manage your records on multiple devices. Timy is small, responsive and useful for personal usage.

## Setup

To install this project you must have a Google Account and Node 18 (current LTS) or newer on your machine.

1. Clone the repository using Git `git clone git@github.com:manud99/timy.git` or download and extract the [Zip folder](https://github.com/manud99/timy/archive/refs/heads/master.zip).
2. Run in your shell:
    ```shell
    cp .env.local.example .env.local
    ```
3. Go to the [Google API Console](https://console.developers.google.com/project). Click **Create project**, enter a name, and click **Create**.
4. Open this page [Google Calendar API](https://console.cloud.google.com/apis/api/calendar-json.googleapis.com) and click **Enable**.
5. On the [Credentials](https://console.cloud.google.com/apis/credentials) page click on **Create Credentials** and **Create OAuth client ID**.
6. As *Application Type* select **Web application** and enter an appropriate *Name*.
7. Under *Authorised JavaScript origins* click on **Add URI** and enter the address you want Timy to run on - default is `http://localhost:5173`. Do the same in the *Authorised redirect URIs* section.
8. Click on **Create**.
9.  Copy the *Client ID* and paste it in [.env.local](.env.local) after the key `VITE_GOOGLE_CLIENT_ID`.
10. Start the Vite server with
    ```shell
    npm run dev
    ```
11. Open the app on [http://localhost:5173](http://localhost:5173).

## Contributing

If you have questions or discover a bug please report by creating an issue. PRs are always welcome.

## Development

For development we recommend using [VS Code](https://code.visualstudio.com/) with [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) and [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) extensions.

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## License

Timy is open-sourced software licensed under the MIT license. See [LICENSE.txt](LICENSE.txt).

## Credits

Template is adapted from: https://github.com/estevanmaito/windmill-dashboard
