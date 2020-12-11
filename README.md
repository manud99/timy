# Timy

Manage your work time locally on your computer. With Timy you have a simple app to track your activities.
Just Start, Split and Stop. Timy does the rounding and calculations.

## Process overview

- Start your work by clicking on the "Start" button.
- Whenever you finished task and skip to next, click "Split", enter a title and adjust the times when needed.
- Repeat ...
- When it's time for a break just hit "Stop". 

The app lists all your entries in a simple overview table. A main feature is that you are able to round your time entires.
Timy has a config value to set a rounding factor. All your times are rounded to the next value according to your factor.

## Getting started with docker

Install the docker image and run it on your computer with the following command:

```bash 
docker run -d --name timy-app -p 8080:80 --restart always manud99/timy
```

Open the app on [http://localhost:8080/](http://localhost:8080/)

## Setup with npm

1. Clone the repository.
2. Install all npm dependencies.
3. Build the production files.
4. Setup the SQLite database file. 
5. Start the server.
   
```bash
npm install
npm run prod
npm run setup-db
npm start
```

6. Open the app on [http://localhost:8080/](http://localhost:8080/)

## ToDos

- [ ] Develop a Chrome extension.
- [ ] Adjust config values with env vars.
- [ ] APIs to export your entries to another format/tool. I'm open for ideas ...

## Copyright

This project is licensed under the terms of the GNU GPLv3 license.
