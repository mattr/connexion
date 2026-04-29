# Connexion

Address book managed using [pocketbase](https://pocketbase.io), and a simple 
web front-end.

## Deployment

This app is configured for Fly.io with `fly.toml`. The default configuration runs one `shared-cpu-1x` machine in Sydney (`syd`) and mounts PocketBase data at `/data`.

Before deploying, update `app`, `PUBLIC_POCKETBASE_URL`, and the volume `source` in `fly.toml` if the Fly app name is not `connexion`.

Create the app and volume in Sydney:

```sh
fly apps create connexion --region syd
fly volumes create connexion_data --region syd --size 1
```

Deploy:

```sh
fly deploy
```

The container runs:

```sh
./connexion serve --http=0.0.0.0:8080 --dir=/data
```
