# Love ESRI

A project to showcase how I love ESRI products by utilising their JavaScript SDK APIs. It is hosting on [loveesri.netlify.app/](loveesri.netlify.app/) as single tier app.

## ArcGIS Javascript SDK

The ArcGIS JavaScript SDK (Software Development Kit) is a comprehensive library provided by Esri for building web applications that use geographic information system (GIS) technology. This project introduces switching between 3D scene and 2D map views. It also showcase the 3D visualisation of buildings and 2D wind flow layer.

Api used in this project:

1. Basemap
2. Geocoding
3. Routing

## Going into developments

In the project directory, you can either prepare below for local developments:

1. Node.js
2. Docker Desktop + wsl2 (Ubuntu recommended)

### NPM commands

Runs the app in the development mode. Open [http://localhost:3000/](http://localhost:3000/) to view it in the browser.

```
npm install
npm run dev
```

OR

```
docker-compose up --build
```

The page will reload if you make edits.
You will also see any lint errors in the console.

### Found issues in code style?

To fix all formatting and linting using `prettier`:

```
npm run style-check
npm run style-format
```

### Check if build error exists?

To see if any errors prevent production build compilation:

```
npm run build
```

### Prepare enviroment variables for app use

`VITE_CLIENT_ID`: The OAuth application client ID

`VITE_ESRI_API`: The normal api key provided when you register ArcGIS Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
