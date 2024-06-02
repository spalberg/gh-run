# gh-run [![JSR](https://jsr.io/badges/@pal/gh-run)](https://jsr.io/@pal/gh-run) [![JSR Score](https://jsr.io/badges/@pal/gh-run/score)](https://jsr.io/@pal/gh-run)


This package aims to simplify the execution of deno scripts located in private repositories hosted on `github.com`.

<!--deno-fmt-ignore-start-->
> [!IMPORTANT]
> This package is currently in an alpha state and breaking changes will occur.
<!--deno-fmt-ignore-end-->

## Usage

Simply run the [jsr](https://jsr.io)-hosted version of this package and provide a script url:

```bash
deno run -A jsr:@pal/gh-run https://github.com/spalberg/gh-run/blob/main/src/examples/simple/main.ts
```

If needed, you can specify the config file to use:

```bash
deno run -A jsr:@pal/gh-run https://github.com/spalberg/gh-run/blob/main/src/complex/simple/main.ts --config https://github.com/spalberg/gh-run/blob/main/src/examples/complex/deno.json
```

### Authentication

To access private GitHub repositories an authentication token is required. This token is resolved in different ways in the following order of importance.

1. Explicit passing of the authentication token using `--token` or ` -t`. 
2. If the [GitHub CLI](https://cli.github.com/) `gh` is installed, a token is resolved using the CLI.
3. The value of the environment variable `GH_TOKEN` is used if set.

<!--deno-fmt-ignore-start-->
> [!NOTE]
> If you want to use `GH_TOKEN` while also having `gh` CLI installed, combine the direct passing of a token with the env var, i.e. `--token="$GH_TOKEN"`.
<!--deno-fmt-ignore-end-->
