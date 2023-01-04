# Cosmos SDK: Validator Status Alerts API

[![GitHub license](https://img.shields.io/github/license/cheqd/validator-status?color=blue&style=flat-square)](https://github.com/cheqd/validator-status/blob/main/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/cheqd/validator-status?label=contributors%20%E2%9D%A4%EF%B8%8F&style=flat-square)](https://github.com/cheqd/validator-status/graphs/contributors)

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/cheqd/.github/dispatch.yml?label=workflows&style=flat-square)](https://github.com/cheqd/validator-status/actions/workflows/dispatch.yml) ![GitHub repo size](https://img.shields.io/github/repo-size/cheqd/validator-status?style=flat-square)

## ℹ️ Overview

Most validator status reporting software in [Cosmos SDK](https://cosmos.network/) is designed to be run *directly* by a node operator to monitor their own nodes. This typically pulls data from [the Tendermint Prometheus metrics sink](https://docs.tendermint.com/v0.34/tendermint-core/metrics.html) exposed on a node.

We wanted to build a way to monitor the status of validator nodes *globally* across the cheqd mainnet, and raise alerts in case validator nodes were losing blocks. (Validator nodes [can get jailed if they miss too many blocks](https://docs.cosmos.network/main/modules/slashing/) and their stake slashed.)

This custom API pulls data for all validator nodes from [a BigDipper block explorer](https://explorer.cheqd.io/) (e.g., [explorer.cheqd.io](https://explorer.cheqd.io/)) and repurposes/wraps [the validator condition results](https://explorer.cheqd.io/validators) into a JSON array.

The API itself can be deployed using [Cloudflare Workers](https://workers.cloudflare.com/) or compatible serverless platforms. Alerting is then achieved using Zapier (a low-code/no-code automation platform) to pipe these alerts to Slack, Discord, etc.

## 🚨 Alerting via Zapier

To simplify the task of alerting via various channels (and to keep it extensible to other channels), we take the output of our validator status API and parse it via [Zapier](https://zapier.com/). This is done as a two-stage process via two separate "Zaps".

Right now, our setup sends these details to the [cheqd Community Slack](http://cheqd.link/join-cheqd-slack) and the [cheqd Community Discord](http://cheqd.link/discord-github).

1. Our validator status API sends [a webhook call to a Zapier "Zap"](https://zapier.com/shared/d407b10516f89da18e35b97ce3ef226bca2ad741) that listens for newly-degraded validators every hour.
2. Lists of degraded validators are compiled using a Zapier "Sub-Zap" to process the data from the API into a usable format and stored in a "digest".

	```javascript
	const body = JSON.parse(inputData.VALIDATOR_CONDITION);
	var degraded = [];

	for (let k=0; k<body.length; k++) {
	degraded.push(body[k]);
	}
	return {degraded}
	```

3. "Release" any unreleased digests by using [the manual release feature in Digest by Zapier](https://zapier.com/help/create/storage-and-digests/compile-data-in-a-digest-in-zaps#release-the-content-of-the-digest).
4. If execution has proceeded to this step, use the [Zapier App for Slack](https://zapier.com/apps/slack/integrations) and [Zapier App for Discord](https://zapier.com/apps/discord/integrations) to send a message (with formatting) to designated alert channels.

You can [copy this Zap](https://zapier.com/shared/d407b10516f89da18e35b97ce3ef226bca2ad741) to configure a similar setup for other alert channels, such as [SMS by Zapier](https://zapier.com/apps/sms/integrations) or [Email by Zapier](https://zapier.com/apps/email/integrations).

## 🧑‍💻🛠 Developer Guide

### Architecture

This API was developed to work with [Cloudflare Workers](https://workers.cloudflare.com/), a serverless and highly-scalable platform.

Originally, this project was discussed as potentially being deployed using a serverless platform such as [AWS Lambda](https://aws.amazon.com/lambda/). However, [AWS Lambda has a cold-start problem](https://mikhail.io/serverless/coldstarts/aws/) if the API doesn't receive too much traffic or is only accessed infrequently. This can lead to start times ranging into single/double digit seconds, which would be considered an API timeout by many client applications.

Using Cloudflare Workers, these APIs can be served in a highly-scalable fashion and have much lower cold-start times, i.e., in the range of less than 10 milliseconds.

### Setup

The recommended method of interacting with this repository is using [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).

Dependencies can be installed using NPM or any other package manager.

```bash
npm install
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

## 🐞 Bug reports & 🤔 feature requests

If you notice anything not behaving how you expected, or would like to make a suggestion / request for a new feature, please create a [**new issue**](https://github.com/cheqd/validator-status/issues/new/choose) and let us know.

## 💬 Community

The [**cheqd Community Slack**](http://cheqd.link/join-cheqd-slack) is our primary chat channel for the open-source community, software developers, and node operators.

Please reach out to us there for discussions, help, and feedback on the project.

## 🙋 Find us elsewhere

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/cheqd) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](http://cheqd.link/discord-github) [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/follow?screen_name=cheqd_io) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](http://cheqd.link/linkedin) [![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](http://cheqd.link/join-cheqd-slack) [![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://blog.cheqd.io) [![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UCBUGvvH6t3BAYo5u41hJPzw/)
