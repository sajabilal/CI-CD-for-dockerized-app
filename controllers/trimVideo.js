const fs = require("fs");
const got = require("got");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

// Json Data can be send via client=localhost:3006 or can be send via postman.
// Trim videos send in results.
// Sample input:
const trimVideo = async (req, res) => {
  let clipDuration, startingTime;
  const url = req.body.url; //Json post url data.

  if (
    Number.isInteger(parseInt(req.body.duration)) &&
    Number.isInteger(parseInt(req.body.startTime))
  ) {
    clipDuration = parseInt(req.body.duration); //Json post duration data.
    startingTime = parseInt(req.body.startTime); //Json post startTime data.
  } else {
    return res.status(400).send({
      ErrorMessage: "Invalid Input",
    });
  }

  clipDuration = clipDuration / 1000; //ms
  startingTime = startingTime / 1000; //ms

  const timeStamp = new Date().getTime() + Math.floor(Math.random() * 10) + 1; //Generate random number for trimmed video
  const outputVideo = path.resolve("/tmp/" + timeStamp + ".mp4"); //Save trimmed file.

  const pathVideo = await downloadVideo(url);
  const durationUrlInput = await durationUrl(pathVideo);

  if (startingTime > durationUrlInput) {
    fs.unlinkSync(pathVideo);
    return res.status(400).send({
      ErrorMessage: "Invalid Input",
    });
  }

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(pathVideo)
      .inputOptions([`-ss ${startingTime}`])
      .outputOptions([`-t ${clipDuration}`])
      .videoBitrate("1000k", true)
      .output(outputVideo)
      .on("end", () => {
        resolve("Done");
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });

  fs.unlinkSync(pathVideo); // Delete downloaded videos at the end of the function.

  res.status(200).send({
    videoPath: timeStamp,
  });
};

const downloadVideo = async (url) => {
  const extension = path.extname(url);

  const pathVideo = "/tmp/" + new Date().getTime() + extension;

  const writeStream = fs.createWriteStream(pathVideo);

  return await new Promise((resolve, reject) => {
    const stream = got.stream(url);

    stream.on("data", (chunk) => {
      writeStream.write(chunk);
    });

    stream.on("end", () => {
      resolve(pathVideo);
    });
  });
};

const durationUrl = async (urlPath) => {
  return await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(urlPath, function (err, metadata) {
      const durationUrlPath = metadata.format.duration; // This function is reading duration for downloaded video.

      resolve(durationUrlPath);
    });
  });
};

module.exports = trimVideo;
