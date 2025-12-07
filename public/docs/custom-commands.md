Wamellow's custom command feature is a great way to address repetitive questions and topics. You can also create a custom command (or tag) that will always appear at the bottom of a channel as a sticky message.

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=custom-commands).
3. Select your server from the dashboard.
4. Navigate to the **Custom Commands** tab.
5. Click **Create** and enter a name* for that command.
7. Click **Submit** and done!

*The name must be unique and must only contain letters, numbers, underscores, or hyphens. If a name is prefixed with a slash (`/`), wamellow will create a slash command.

### ✏️ Custom message & embed
You can create a tag with a **fully customizable message and embed for free**, making it easy to design custom messages and commands.

### 🔐 Permissions
You can select the permissions required for a user to use the custom command. You can select any of Discord's existing permissions, such as "Administrator" or "Manage Channels."

## Sticky message
To turn a custom command into a sticky message, add `[tag:name]` to the channel's topic. In this case, "name" represents the name of the custom command. For example, if your custom command is named "suggestions", the string to add to the topic would be `[tag:suggestions]`.
<br />
<br />

The default timeout for sticky messages is five seconds. This represents the amount of time that the message waits for new messages to be posted before resending to avoid spam. You can adjust the timeout duration from one to 30 seconds by adding a colon and a number (`:10`) after the name. For example, to set the timeout to ten seconds, use `[tag:suggestions:10]`.