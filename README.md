# Love ESRI

A project to showcase how I love ESRI products by utilising their JavaScript SDK APIs. It is hosting on [loveesri.netlify.app/](https://loveesri.netlify.app/) as a single tier app.

Tech stacks:

![Tech stacks](https://skillicons.dev/icons?i=vite,ts,react,tailwindcss,css,html,docker,ubuntu,bash,npm,netlify)

## ArcGIS Javascript SDK

The ArcGIS JavaScript SDK (Software Development Kit) is a comprehensive library provided by Esri for building web applications that use geographic information system (GIS) technology.

Features introduced in this project:

1. Switching between 3D scene and 2D map views.
2. Layer controls such as 3D buildings and 2D wind flow layer.
3. Satellite locations/orbits visualisation
4. Geocoding for address searching tool
5. Routing between multiple destinations

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
