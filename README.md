# Philadelphia Museum of Art GraphQL API

https://pma.now.sh/

## What is this?

This is the data released by the Philadelphia Art Museum for their [hackathon](https://github.com/philamuseum/hackathon) with some additional features
- Wrapped in a GraphQL API
- Images processed with [Google Cloud Vision](https://cloud.google.com/vision/)

## Examples

[All the objects in the same gallery as Object 209018](https://pma.now.sh/?query=%7B%0A%20%20object(id%3A%20209018)%20%7B%0A%20%20%20%20id%0A%20%20%20%20gallery%20%7B%0A%20%20%20%20%20%20number%0A%20%20%20%20%20%20objects%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)

[Every object tagged by Google Cloud Vision with "teapot"](https://pma.now.sh/?query=%7B%0A%20%20tag(description%3A%20%22teapot%22)%20%7B%0A%20%20%20%20objects%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)

## Why?

The original dataset is just one big array. I wanted to be able to access the data in different ways and also augment with new data. Originally this project started out as just slicing the data in different ways to see what was there. You can see that effort still in `/data` where I rollup some fields across the entire data set. Later it seemed that a GraphQL API would be beneficial so I added that too.

## Caveats

### No database

There is no database. All operations are run in memory on plain JS objects. Be careful with your query complexity as it will directly correlate with CPU time.

### Performance

Similar to above, but the dataset is currently filtered in some very naive ways. Please be careful with your query complexity

### Missing fields

I have not implemented all fields or paths through the graph in the original dataset. Please file issues or open a PR if there is something you would like me to prioritize.

## Contributing

Please submit issues and PRs!

### Local Development

First run `yarn` to install all dependencies

`yarn start` - Start API locally
`yarn start:watch` - Start API locally with file watch enabled
`yarn process` - Script that generates the files in `/data` from `/data/raw.json`
`yarn cloud-vision` - Processes all images through google cloud vision api and save to `/data/cloud-vision.json`. Takes about 10 minutes. Images are served from S3.
`yarn lint`- lints the entire project
