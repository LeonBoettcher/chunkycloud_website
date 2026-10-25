# ChunkyCloud Website

This is the source code of the [ChunkyCloud website](https://chunkycloud.net). It is mostly a friendly user interface for the API provided by the [ChunkyCloud server](https://github.com/ChunkyCloud/server).

## Build and run the production Docker image:

```sh
docker build -t chunkycloud-website .
docker run --rm -p 3000:3000 chunkycloud-website
```

The image runs `pnpm start` with `NODE_ENV=production` and only production
dependencies.

To use another backend, set `--build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com`
when building. Next.js embeds this public URL during the build; setting it only at
container startup will not change the browser bundle.
