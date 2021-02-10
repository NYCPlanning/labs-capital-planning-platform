# Capital Planning Platform

## Requirements
- Node 12.* or greater
- yarn 1.x or greater

## Development set up
1. Create a `.env` file at the root of the project. Paste the following:
```
  REACT_APP_MAPBOX_TOKEN=<insert_your_mapbox_token>
  REACT_APP_CARTO_USERNAME=<carto_username>
  REACT_APP_CARTO_API_KEY=<carto_token>
```
2.  Install packages and start the app
```
> yarn
> yarn start
```
3. visit [http://localhost:3000](http://localhost:3000)

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
