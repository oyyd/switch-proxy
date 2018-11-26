# switch-proxy

[![npm-version](https://img.shields.io/npm/v/switch-proxy.svg?style=flat-square)](https://www.npmjs.com/package/switch-proxy) [![travis-ci](https://travis-ci.org/oyyd/switch-proxy.svg)](https://travis-ci.org/oyyd/switch-proxy)

switch-proxy(`sp`) simplifies switching proxies of your git, docker, npm, etc.

By default, switch-proxy needs a http-proxy service but you can setup one from
an existing SOCKS5 service with the `--use-socks` option.

## Installation

```
npm i -g switch-proxy
```

## Supported Tools

- git
  - You need to use `https` instead of `ssh` to utilize the http-proxy.
- npm
  - switch-proxy will set `strict-ssl=false` as well.
- apm
- vscode
  - Currently, installation from CLI is supported, i.e.
  `code --install-extension`. See [the doc](https://code.visualstudio.com/docs/setup/network) for detail.

Please submit PRs to help us support more tools.

## Usage

### ls

List http-proxy configs in the config files of target tools:

```
sp ls git
```

### ls all

List http-proxy configs in the config files of all supported tools:

```
sp ls all
```

### set

Set http-proxy config of the target tool in its config file:

```
sp set git http://127.0.0.1:8080
```

### set all

Set http-proxy config of the all tools in their config files:

```
sp set all http://127.0.0.1:8080
```

### set --use-socks

Set the configs and setup the http-proxy service from an existing SOCKS5 service:

```
sp set all http://127.0.0.1:8080 --use-socks=127.0.0.1:1080
```

### unset

Unset the http-proxy configs of related tools in their config files:

```
sp unset all
```

## Configs

Using the `--help` option to list all commands and options.

## LICENSE

MIT
