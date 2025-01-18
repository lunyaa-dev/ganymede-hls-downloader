# Ganymede HLS Downloader

A simple downloader for downloading hls stream from [ganymede](https://github.com/Zibbp/ganymede).


The VODS can be downloaded on `/videos/<videoId>/download` 
So that ganymede and the downloader can be on the same domain and the user just has to append `/download` to the video url.


# Docker 

```yml
services:
  app:
    image: lunyaa/ganymede-hls-downloader
    restart: unless-stopped
    environment:
      GANYMEDE_UR: http://ganymede
      TMP_PATH: /tmp

```

`GANYMEDE_URL` must be reachable from the container
