import express, { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs, { existsSync, mkdirSync } from 'fs';
import path, { dirname } from 'path';
import 'dotenv/config'

const app = express();
const port = 3000;

const ganymedeUrl = process.env.GANYMEDE_URL;
const tmpPath = process.env.TMP_PATH || './tmp';



// Function to download and convert HLS to MP4
const convertHLSToMP4 = (hlsUrl: string, outputFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(hlsUrl)
      .output(outputFilePath)
      .format('mp4')
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
};

// Endpoint to download HLS stream as MP4
app.get('/videos/:uuid/download', async (req: Request, res: Response) => {

  const { uuid } = req.params;

  const fetchRes = await fetch(`${ganymedeUrl}/api/v1/vod/${uuid}?with_channel=true`)
  const json = await fetchRes.json()

  if(!json.success) {
    res.status(404).send('Stream not found');
  }

  const streamData = json.data

  const hlsUrl = `${ganymedeUrl}${streamData.video_path}`

  const outputFilePath = path.join(tmpPath, `${uuid}-${Math.floor(Math.random() * 1000000)}.mp4`);
  
  if(!existsSync(dirname(outputFilePath)))
    mkdirSync(dirname(outputFilePath))

  try {
    await convertHLSToMP4(hlsUrl, outputFilePath);

    const channelName = streamData.edges.channel.display_name
    const date = new Date(streamData.streamed_at).toISOString().substring(0, 10)
    const title = streamData.title.replace(/[^a-zA-Z0-9]/g, '_')

    res.download(outputFilePath, `${channelName}-${date}-${title}.mp4`, (err) => {
      if (err) {
        res.status(500).send('Error downloading the file');
      }
      fs.unlinkSync(outputFilePath); // Delete the file after download
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).send('Error converting HLS to MP4');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
