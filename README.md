docker build -t stream_watcher .

docker run --restart=on-failure stream_watcher