Dailyposts are a way to automatically send cute images to a discord channel at a specific time every day.
You can set up to 30 dailyposts per server. The same image type can be used multiple times, for different hours etc.
<br />
<br />

![Blåhaj and Nekos.best dailypost example](/docs-assets/dailyposts.webp?fullwidth=true)

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=dailyposts).
3. Select your server from the dashboard.
4. Navigate to the **Dailyposts** tab.
5. Click **Add Dailypost**, select an image type, runtime hours and enter a discord channel.
7. Click **Submit** and done!
<br/>

### 📸 Image types
The following types of images are available:
- `Anime` will get a random waifu.
- `Blåhaj` will get a random Blåhaj. (uses [shi-gg/transgirl](https://github.com/shi-gg/transgirl))
- `Nekos.best` will get a random neko. (uses [Nekos.best](https://nekos.best))
<br />
... and more to come!
<br />
<br />

**Note:** You cannot change the type of image after you've created the dailypost.

### 🕒 Runtime hours
The time when the dailypost should be sent. You can set up to 24 hours per day by selecting multiple times. The displayed time on the dashboard is not UTC, but the time of your browser or operating system.
<br />
<br />

**Note:** Dailyposts may be delayed by a few minutes after `HH:00`, the offset depends on your cluster id.
i.e.: If your server's cluster id is `0`, the dailypost will be sent at `HH:00`, if it's `7`, it will be sent at `HH:07`, etc.
You can find any server's cluster id either by running `/debug` in the chat or by visting [the status page](/status) and entering your server's id.

### 🏓 Pings
The role that should get notified about new uploads.
- `@everyone` will ping every member in the server.
- `@here` will ping every *currently online* member in the server.
- `@some-role` will ping everyone with that role.
<br />
<br />

**Note:** If Wamellow does not have the `Mention Everyone` permissions inside the channel, it might not be able to actually notify members with those roles.