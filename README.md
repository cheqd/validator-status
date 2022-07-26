# Cosmos SDK: Validator Status Alerts API

## ℹ️ Overview

Most validator status reporting software in [Cosmos SDK](https://cosmos.network/) is designed to be run *directly* by a node operator to monitor their own nodes. This typically pulls data from [the Tendermint Prometheus metrics sink](https://docs.tendermint.com/master/nodes/metrics.html) exposed on a node.

We wanted to build a way to monitor the status of validator nodes *globally* across the cheqd mainnet, and raise alerts in case validator nodes were losing blocks. (Validator nodes [can get jailed if they miss too many blocks](https://docs.cosmos.network/main/modules/slashing/) and their stake slashed.)

This custom API pulls data for all validator nodes from [a BigDipper block explorer](https://explorer.cheqd.io/) (e.g., [explorer.cheqd.io](https://explorer.cheqd.io/)) and repurposes/wraps [the validator condition results](https://explorer.cheqd.io/validators) into a JSON array.

The API itself can be deployed using [Cloudflare Workers](https://workers.cloudflare.com/) or compatible serverless platforms. Alerting is then achieved using Zapier (a low-code/no-code automation platform) to pipe these alerts to Slack, Discord, etc.

## 🧑‍💻🛠 Developer Guide

### Architecture

This API was developed to work with [Cloudflare Workers](https://workers.cloudflare.com/), a serverless and highly-scalable platform.

Originally, this project was discussed as potentially being deployed using a serverless platform such as [AWS Lambda](https://aws.amazon.com/lambda/). However, [AWS Lambda has a cold-start problem](https://mikhail.io/serverless/coldstarts/aws/) if the API doesn't receive too much traffic or is only accessed infrequently. This can lead to start times ranging into single/double digit seconds, which would be considered an API timeout by many client applications.

Using Cloudflare Workers, these APIs can be served in a highly-scalable fashion and have much lower cold-start times, i.e., in the range of less than 10 milliseconds.

### Setup

The recommended method of interacting with this repository is using [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).

Dependencies can be installed using Yarn or any other package manager.

```bash
yarn install
```

While our deployment uses Cloudflare Wrangler, the application itself could be modified to run on other platforms with some refactoring.

### Configuration

Wrangler CLI uses [`wrangler.toml` for configuring](https://developers.cloudflare.com/workers/wrangler/configuration/) the application. If you're using this for your own purposes, you will need to replace values for `account_id`, `route`, etc. for the application to work correctly along with your own [Cloudflare API tokens](https://developers.cloudflare.com/api/tokens/create).

Crucially, you must provide a publicly-accessible BigDipper GraphQL endpoint using the environment variable `GRAPHQL_API` in the `wrangler.toml` file.

### Local Development

Wrangler CLI can serve a preview where the code and KV pairs are served from Cloudflare. This also automatically executes a build to be able to serve up the app.

```bash
wrangler dev
```

This option will bind itself to the `preview_id` KV namespace binding (if defined).

Wrangler CLI also allows a degree of local development by running the web framework locally, but this option still relies on Cloudflare backend for aspects such as Cloudflare Workers KV.

```bash
wrangler dev --local
```

If you want *completely* standalone local development, this can achieved using an emulator framework like [Miniflare](https://miniflare.dev/).

### Deploy

Modify the required variables in `wrangler.toml` for [publishing to Cloudflare Workers](https://developers.cloudflare.com/workers/wrangler/commands/) and execute the following command to execute a build and production deployment.

```bash
wrangler publish
```

Other environments can be targetted (if defined in `wrangler.toml`) by specifying the `--env` flag:

```bash
wrangler publish --env staging
```

CI/CD deployments can be achieved using the [`wrangler` Github Action](https://github.com/cloudflare/wrangler-action). The [`deploy.yml` Github Action in this repo](https://github.com/cheqd/validator-status/blob/main/.github/workflows/deploy.yml) provides an example of this can be achieved in practice.
