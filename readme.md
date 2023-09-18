- Run server locally:

  - Installing required packages:

    ~/Assessment$ npm install

    - Required installation for ffmpeg:

      apt-get install -y ffmpeg

  - Run the backend server:

    ~/Assessment$ npm start -- It will run at http://localhost:3000

    - You can send Json object with postman and test it. Example json object:

      - Post:

        {
        "url": "https://static.videezy.com/system/resources/previews/000/000/168/original/Record.mp4",
        "startTime":0,
        "duration":"1000"

        }

- Run server with docker:

  - Build docker:

    docker build -t video-trim-assessment:1.0.0 .

  - Start docker script:

    - Docker start server:

      docker run --rm -ti -p 3000:3000 --name assessment-dev video-trim-assessment:1.0.0
