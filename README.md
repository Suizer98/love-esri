# Love ESRI

A project to showcase how I love ESRI products by utilising their JavaScript SDK APIs. It is hosting on [loveesri.netlify.app/](https://loveesri.netlify.app/) as a single tier app.

Tech stacks:

![Tech stacks](https://skillicons.dev/icons?i=vite,ts,react,tailwindcss,css,html,docker,ubuntu,bash,npm,netlify)

## ArcGIS Javascript SDK

### Description

The ArcGIS JavaScript SDK (Software Development Kit) is a comprehensive library provided by Esri for building web applications that use geographic information system (GIS) technology. Below are the features introduced in this project.

### Map Tab:

1. Switching between 3D scene and 2D map views
2. Layer controls such as 3D buildings and 2D wind flow layer
3. Satellite visualisation
4. Geocoding for address searching tool
5. Routing between multiple destinations

### Playground Tab:

1. Adding points on map for user preferences and fun
2. Visualising time series MEO satellite positions and its orbit pattern from RINEX navigation file. (Although I am using mocked data here)

### Disclaimer regarding the free usage limitations

Only free tier location services are available at the moment and their usage are limited. You are encouraged to login using your own account, the default user is only to ease demostration purpose and it can be removed anytime soon.

## Local developments

In the project directory, make sure you have one of these installed:

1. Node.js (Windows/MacOS)
2. Docker Desktop + wsl2 (Ubuntu recommended)

### NPM commands

Runs the app in the development mode. Open [http://localhost:3001/](http://localhost:3001/) to view it in the browser.

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

### Typing issues message

The `Vite Checker` is constantly checking if any typing issues exist in
our TypeScript codes by prompting messages in runtime.

### Found issues in code style?

To fix all formatting and linting using `prettier`:

```
npm run style-check
npm run style-format
docker exec -it love-esri-love-esri-1 npm run style-format

```

### Check if build error exists?

To see if any errors prevent production build compilation:

```
npm run build
```

### Prepare enviroment variables for app use

`VITE_CLIENT_ID`: The OAuth application client ID

`VITE_CLIENT_SECRET`: The secret key to be used together with `VITE_CLIENT_ID`

`VITE_ESRI_API`: The normal api key provided when you register ArcGIS Developer

### WebGL issue causing 3D Scene not loading

`Your WebGL implementation doesn't seem to support hardware accelerated rendering. Check your browser settings or if your GPU is in a blocklist.`

For Chrome:

1. Go to chrome://flags/.
2. Search for "WebGL".
3. Enable WebGL-related flags if they are disabled.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
