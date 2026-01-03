![Discord](https://img.shields.io/discord/828676951023550495?color=5865F2&logo=discord&logoColor=white)
![GitHub repo size](https://img.shields.io/github/repo-size/shi-gg/mellow-web?maxAge=3600)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I3I6AFVAP)

This is the official web application for the Mellow Discord bot. It includes the home page, leaderboards, passport, profile, and server management features.

> [!WARNING]
> This project is not meant for your own use without significant modifications; breaking changes may occur.

* [Home](https://wamellow.com)
* [Invite Wamellow](https://wamellow.com/invite)
* [Documentation](https://wamellow.com/docs/index)
* [Profile](https://wamellow.com/profile)
* [Dashboard](https://wamellow.com/dashboard)

## Setup

To get started with this project, you'll need to have the following installed:

* [Node.js](https://nodejs.org/en/) (v18 or higher)
* [Bun](https://bun.sh/)

1. **Clone the repository:**
```bash
git clone https://github.com/shi-gg/mellow-web
```

2.  **Install the dependencies:**
```bash
bun install
```

3. **Create a `.env` file:**
Create a `.env` file in the root of the project and add the following environment variables:

```env
# The base URL for the web application
NEXT_PUBLIC_BASE_URL="https://wamellow.com"

# The base URL for the backend API
NEXT_PUBLIC_API="https://api.wamellow.com/v1"
API_SECRET=""

# The API URL for the Plausible analytics service
PLAUSIBLE_API="https://analytics.wamellow.com/api"

# The domain and api key for the Plausible analytics service
PLAUSIBLE_DOMAIN="wamellow.com"
PLAUSIBLE_API_KEY=""

# The client ID and token for the Discord bot
NEXT_PUBLIC_CLIENT_ID="1116414956972290119"
DISCORD_TOKEN=""

# The public key for the Turnstile captcha service
NEXT_PUBLIC_TURNSTILE_KEY=""

# A personal GitHub access token with read:repositories scope
GITHUB_TOKEN=""

# The token for the top.gg API
TOPGG_TOKEN=""

# The public key for Bluesky
BLUESKY_PUBLIC_KEY=""

# The base64 encoded imprint data
IMPRINT_BASE64=""
```

## Developing

To start the development server, run the following command:

```bash
bun dev
```

This will start the development server on `http://localhost:3000`.

## Deployment

To build and run the web application, use the following commands:

```bash
bun run build
bun start
```
or
```bash
docker compose up --build -d
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your changes.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Create a pull request.

If you need help with any of these steps, feel free to join our [Discord server](https://discord.com/invite/yYd6YKHQZH).