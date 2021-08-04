Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app).

## Prérequis

1. Installer [https://nodejs.org/en/download/](node)
2. Avoir un IDE (VSCode si possible), et installer les plugins suivants :
   - **Obligatoires** :
     1. ESLint : vérifie la syntaxe, et highlight s’il y a des problèmes (exemple, ‘debugger’ non supprimé)
     2. Prettier - Code Formatter : formatte le code automatiquement à la sauvegarde du fichier
   - _Recommandés_ :
     1. ES7 React/Redux/React-Native/JS snippets : permet de générer facilement du code grâce à des snippets (CTRL+MAJ+P -> ES7 snippets)
     2. HTML CSS Support : apporte de nombreuses aides à l’autocompletion pour le html, et donc Reac
   - _Optionnels_ :
     1. Bracket Pair Colorizer : highlight les { … } alignés d’une couleur unique
     2. Gitlens : permet d’annoter la ligne sélectionnée et d’indiquer le commit lié

## Premiers pas

1. Cloner le projet

2. Effectuer la commande `npm install`, qui va installer les dépendances spécifiées dans le `package.json` du projet.

On peut dès à présent lancer l'application. c.f. Scripts disponibles, `npm run start-dev`.

## Scripts disponibles

A la source du projet, vous pouvez exécuter les commandes suivantes :

### `start-dev`

This commands should be used whenever **you modify the `.env` file**, in addition to **the first time you're starting the app in developments**. In other cases, you can simply run `npm start`.

It calls `generate-env` command, and simply starts the application.

### `generate-env`

It generates the `env-config.js` file, which is imported in `index.html`, and which contains all the environment variables. This file will allow _dynamic builds_ (1 build for multiple environments).

c.f. https://github.com/kunokdev/cra-runtime-environment-variables.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `lint:fix`

Fixes all the fixable issues inside all js, jsx, ts, tsx files of the project.
This command is run inside husky precommit hook, in order to commit clean code everytime.
It will also display the errors (e.g. 'debugger') to avoid to commit issues.

### `generate-all`

This command generates all `./api-generated` interfaces. These files contains all the functions extracted from `X.json`, which is the api-docs documentation of the microservice `X`.

First of all, it _downloads_ all the `api-docs/*.json` of the microservice tag specified in the `./api-docs/condif/downloadApiDocs.js` :

```js
const backendList = ["customers", "bookmarks"];

...

process.env.API_BASE_URL + microServiceName + "/v0/api-docs"
```

We might need to change the base URL accordingly to the environment.

This command uses react-restful plugin.
We also use the flag `--config` which points to the `api-docs/config/restful-react.config.js`, which iterates over files `./api-docs/*json` and makes the following transformations to the json :

1. Replaces `["*/*"]` by `["application/json]` [TO DELETE when api makes it alone]
2. Adds the operation in front of the operationId if it isn't already present or not the same (e.g. `searchProductUsingGET` -> `getSearchProductUsingGET` ; `getProductUsingPUT` in `getPutProductUsingPUT`)
3. Suppresses _UsingGET_, _UsingPOST_, ... from function names
   Finally, it generates a `.tsx` file from the properly formatted json.

### `postgenerate-all`

This prettier's the files which have just been generated by the `generate-all` command.

### `translate`

This command creates or update the .json translation files inside /public/translations, which is used inside the application, from the translations-config/template.json. `X.json` refers to `/public/translations/X.json` in the following explanations :

- If a property of `template.json` doesn't exist in the `X.json` (file of the locale X), it creates it in `X.json` ;
- If a property of `/public/translations/X.json` exist in the `template.json`, it deletes it from `X.json` ;
- If a property exists in both `template.json` and `X.json`, it ignores it.

**So, the proccess to add translations is to add it in the `template.json`, then run `npm run translate`**

### `test-i`

This commands launches cypress, which is used to make integration tests.
it is based on the `cypress.json` file, which contains the default environment variables (which can be overriden by the flag `--env` ; e.g. _cypress open --env kc_login=overridenLogin_).

Integration tests should be written under `cypress/integration/*.spec.js`, the commmands in `cypress/support/commands.js`.

The documentation is really great : https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell.

## Deployment

You can easily deploy this project with 3 pipelineS.
The pipelines should do the following commands :

1.  PIPELINE BUILD

> First we manage the generation of the build

```
git pull repo
npm i
npm run test
npm run build
```

> Then we manage docker image :

```docker
docker build -t test-front .
docker run -p 3000:80 -e API_BASE_URL=https://int.api.pomona-fr.grp -e KEYCLOAK_CLIENT_ID=react-docker-app -e KEYCLOAK_REALM=interne -e KEYCLOAK_URL=http://recssoapp1:8080/auth/ test-front
```

> The application should now be running on `THE_DOCKER_IP:3000`, and you should be directly redirected to `KEYCLOAK_URL`.

_N.B._ :

- `API_BASE_URL` is the base url of the microservices
- `KEYCLOAK_CLIENT_ID` is the client_id inside keycloak
- `KEYCLOAK_REALM` is the realm of keycloak
- `KEYCLOAK_URL` is the url of the keycloak

Very useful link for the docker deployment with dynamic environment variables : https://github.com/kunokdev/cra-runtime-environment-variables.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
