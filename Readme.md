# Ganymede HLS Downloader

A simple downloader for downloading hls stream from [ganymede](https://github.com/Zibbp/ganymede).


# Docker 

```yml
services:
  app:
    image: lunyaa/ganymede-hls-downloader
    restart: unless-stopped
    environment:
      GANYMEDE_URL=<your ganymede base url>
      TMP_PATH=/tmp

```