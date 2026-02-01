It's absolutely crucial for people with speech impairments like aphonia or dysphonia. It ensures inclusivity and allows everyone to participate fully, promoting accessibility and community engagement.
<br />

<iframe src="https://www.youtube.com/embed/NS5fZ1ltovE" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Install Wamellow on your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard).
3. **🎉 Done!** Use the commands `/tts voice` to talk inside voice channels.
<br />
<br />

**Chat to Speech** *(optional)*

3. Select a channel to be used in the "Text to Speech" section on the website
4. Join any voice channel in your Server (be sure Wamellow can join and talk in it).
5. **🎉 Done!** Start writing messages in the selected channel for Wamellow to speak!
<br />
<br />

To get a quick **.mp3 file** of your message, use `/tts file` in any text channel. You can also [generate Text to Speech files online](/text-to-speech).

### 📑 Usage logs
Pick a channel where any Text to Speech events from your server should be logged, mainly for moderation purposes.
<br />
<br />

**Note:** This does not log any `/tts file` command usage.

### 😷 Priority role
Pick a role that lets users override other messages that are currently being spoken. This lets users start talking right away without the "please wait..." message popping up. It's a good idea to give this role to people who are actually disabled.

### 🤚 Blacklist role
Specify a role that is restricted from using Text-to-Speech.

### 🔉 Announce user
Wamellow will announce which user is currently talking through it. If a user says "hello there", the bot will speak "Luna says: hello there"
<br />
<br />

**Note:** This feature is experimental. Please note that usernames written in languages other than the actual written message will cause the Text to Speech to fail.

### 🛒 Message queue
Queue up sent chat to speech messages, to be spoken in the order they were sent. This is useful for long conversations or when multiple users want to speak at once and will prevent any messages from being skipped and Wamellow returning an error stating that someone else's message is still being spoken.

Messages can be skipped by moderators with the `Mute Members` permission and by the user whose message is currently being spoken using the `/tts skip` command.

### 🔏 Max message length
Set a maximum length for messages to avoid spamming.
<br />
<br />

Discord Nitro members can send messages with up to 4,000 characters, while non-Nitro members can only send 2,000. This is a Discord limitation.
<br />
<br />

While this feature is free, we would be grateful if you could consider [shooting us a donation](/premium) or [voting on top.gg](/vote). Please note that messages longer than 300 characters are vote locked. Unfortunately, money and growth (sadly) don't grow on trees (money isn't exactly normal paper).

### 🤚 Blacklist users & roles
If you want to prevent certain users from using text or chat to speech, you can either use Discord's channel, integration permission system ([watch a tutorial](/disable-commands)), or configure a blacklist role in the wamellow dashboard.

## Moderation
You can use Wamellow's native **<:badge_automod:1307719909618225263> AutoMod** to block certain words or phrases for Text-to-Speech by [setting up rules on your server's Moderation tab](/profile?to=moderation).
Separate words or phrases with a comma (e.g., `dog, cat, tiger`) or a new line. For each word, use an asterisk (`*`) at the beginning, end, or both for partial matching.
<br />
<br />

Members with `Manage Server` or `Administrator` permissions will bypass AutoMod. Separate whitelisted roles and channels can also be added to bypass AutoMod in the moderation settings.
<br />
<br />

**Note:** For `/tts` commands, only Wamellow's native AutoMod can block messages. Chat-to-Speech messages can also be blocked by Discord's native AutoMod — and all other bots that rely on it —  in addition to Wamellow's own. If you're using a third-party moderation system, such as other bots, that only delete messages after they were sent, rather than blocking them directly, will not be able to block messages for Text-to-Speech.

## Avoiding Chat-to-Speech
To prevent Wamellow from speaking your messages inside of Chat to Speech channels, simply take the following actions:
- Just add some special characters at the start of your message, like `!`, `?`, `>`, `.`, `,` and so on.
- If you're not connected to any voice channels, those messages will also be ignored.
- If you want to disable it permanently, you can use `/tts set chat-to-speech`.
<br />
<br />

**Note:** Any of those methods only apply to you and your own messages, and not to anyone else using chat to speech.
If you want to disable it for everyone, [read the setup section of these docs](#setup).

## Voice filters
Filters are a way to tamper with the voices when using Wamellow in VCs, they can be toggled using `/tts set filter` by VC moderators with the `Mute Members` permission.
This setting applies to anyone currently using Wamellow in the VC, all filters will be removed once Wamellow leaves.
Some filters can be enabled and used at the same time. Pitch and Speed may not be used with other filters. Choosing a filter may override the pitch and speed settings.
<br />
<br />

All currently available filters:
- `Vaporwave`
- `Nightcore`
- `Rotation`
- `Tremolo`
- `Vibrato`
- `LowPass`
- `Pitch` (customizable between 0% and 100%; default 50%)
- `Speed` (customizable between 1% and 100%; default 50%)
<br />
<br />

To change the volume of the TTS or mute it entirely for yourself,
- **(desktop)** Right-click Wamellow, and set the "User Volume" slider.
- **(mobile)** Open Wamellows' profile, and set the "Volume" slider.

![how to change the volume of Wamellow TTS](/docs-assets/tts-volume.webp)

## Voices
You can change your default language and voice either by running `/tts set speaker` or by [setting it on the dashboard](/profile/text-to-speech).
<br />
<br />

You can also change the voice on a per-message basis by setting the `voice` option when using `/tts file` or `/tts voice`, i.e.: `/tts voice text:Hello World voice:en_female_samc`. This can also be combined with the auto translate flag.

### 🌎 Auto Translate
Automatically translate messages from any language to match your current voice's language for free.

* **For Commands**: Set the `translate` option to `yes` (i.e.: `/tts voice text:Hallo Welt translate:yes`)
* **For Chat to Speech**: Append `-tr` to the end of your message (i.e.: `Hallo Welt -tr`)

### <:YA_PepeStare:832631300132438046> List of Available Voices

<table>
    <thead>
        <tr>
            <th width="220">Language</th>
            <th>Name</th>
            <th width="181">Preview</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>🇺🇸 English (us)</td><td>Jessie <strong>(TikTok, default until September 2025)</strong></td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_001.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Joey</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_006.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Professor</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_007.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Scientist</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_009.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Confidence</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_010.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Emotional</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_emotional.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Empathetic <strong>(default)</strong></td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_samc.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Serious</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_cody.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Narration</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_narration.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Funny</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_funny.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Alfred</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_jarvis.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Narration Santa</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_santa_narration.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Bae</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_betty.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Beauty Guru</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_makeup.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Bestie</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_richgirl.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Cupid</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_cupid.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Debutante</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_shenna.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Grandma</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_grandma.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Lord Cringe</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_ukneighbor.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Wizard</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_wizard.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Marty</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_trevor.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Mr. Meticulous</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_ukbutler.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Santa</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_santa.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Santa (w/ effect)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_santa_effect.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Jomboy</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_jomboy.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Ashmagic</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_ashmagic.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Olantekkers</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_olantekkers.mp3" /></td></tr>
        <tr><td>🇺🇸 English (us)</td><td>Varsity</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_pansino.mp3" /></td></tr>
        <tr><td>🇬🇧 English (uk)</td><td>Narrator</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_uk_001.mp3" /></td></tr>
        <tr><td>🇬🇧 English (uk)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_uk_003.mp3" /></td></tr>
        <tr><td>🇦🇺 English (au)</td><td>Metro</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_au_001.mp3" /></td></tr>
        <tr><td>🇦🇺 English (au)</td><td>Smooth</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_au_002.mp3" /></td></tr>
        <tr><td>🇫🇷 French (fr)</td><td>Male 1</td><td><audio controls src="https://r2.wamellow.com/tts-preview/fr_001.mp3" /></td></tr>
        <tr><td>🇫🇷 French (fr)</td><td>Male 2</td><td><audio controls src="https://r2.wamellow.com/tts-preview/fr_002.mp3" /></td></tr>
        <tr><td>🇩🇪 German (de)</td><td>Female</td><td><audio controls src="https://r2.wamellow.com/tts-preview/de_001.mp3" /></td></tr>
        <tr><td>🇩🇪 German (de)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/de_002.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (es)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_002.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (es)</td><td>Julio</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_male_m3.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (es)</td><td>Alejandra</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_female_f6.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (es)</td><td>Mariana</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_female_fp1.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (mx)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_mx_002.mp3" /></td></tr>
        <tr><td>🇪🇸 Spanish (mx)</td><td>Super Mamá</td><td><audio controls src="https://r2.wamellow.com/tts-preview/es_mx_female_supermom.mp3" /></td></tr>
        <tr><td>🇧🇷 Portuguese (br)</td><td>Female</td><td><audio controls src="https://r2.wamellow.com/tts-preview/br_003.mp3" /></td></tr>
        <tr><td>🇧🇷 Portuguese (br)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/br_005.mp3" /></td></tr>
        <tr><td>🇵🇹 Portuguese (pt)</td><td>Lhays Macedo</td><td><audio controls src="https://r2.wamellow.com/tts-preview/pt_female_lhays.mp3" /></td></tr>
        <tr><td>🇵🇹 Portuguese (pt)</td><td>Laizza</td><td><audio controls src="https://r2.wamellow.com/tts-preview/pt_female_laizza.mp3" /></td></tr>
        <tr><td>🇵🇹 Portuguese (pt)</td><td>Galvão Bueno</td><td><audio controls src="https://r2.wamellow.com/tts-preview/pt_male_bueno.mp3" /></td></tr>
        <tr><td>🇮🇩 Indonesian (id)</td><td>Female</td><td><audio controls src="https://r2.wamellow.com/tts-preview/id_001.mp3" /></td></tr>
        <tr><td>🇮🇩 Indonesian (id)</td><td>Darma</td><td><audio controls src="https://r2.wamellow.com/tts-preview/id_male_darma.mp3" /></td></tr>
        <tr><td>🇮🇩 Indonesian (id)</td><td>Icha</td><td><audio controls src="https://r2.wamellow.com/tts-preview/id_female_icha.mp3" /></td></tr>
        <tr><td>🇮🇩 Indonesian (id)</td><td>Putra</td><td><audio controls src="https://r2.wamellow.com/tts-preview/id_male_putra.mp3" /></td></tr>
        <tr><td>🇮🇹 Italian (it)</td><td>male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/it_male_m18.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Female 1</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_001.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Female 2</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_003.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Female 3</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_005.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Male</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_006.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Fujicochan</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_fujicochan.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Hasegawariona</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_hasegawariona.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Keiichinakano</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_keiichinakano.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Oomaeaika</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_oomaeaika.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Morisuke</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_osada.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Matsuo</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_matsuo.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Machikoriiita</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_machikoriiita.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Matsudake</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_matsudake.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Shuichiro</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_shuichiro.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Maruyama Rei</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_rei.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Hikakin</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_male_hikakin.mp3" /></td></tr>
        <tr><td>🇯🇵 Japanese (jp)</td><td>Yagi Saki</td><td><audio controls src="https://r2.wamellow.com/tts-preview/jp_female_yagishaki.mp3" /></td></tr>
        <tr><td>🇰🇷 Korean (kr)</td><td>Female</td><td><audio controls src="https://r2.wamellow.com/tts-preview/kr_003.mp3" /></td></tr>
        <tr><td>🇰🇷 Korean (kr)</td><td>Male 1</td><td><audio controls src="https://r2.wamellow.com/tts-preview/kr_002.mp3" /></td></tr>
        <tr><td>🇰🇷 Korean (kr)</td><td>Male 2</td><td><audio controls src="https://r2.wamellow.com/tts-preview/kr_004.mp3" /></td></tr>
        <tr><td>🇺🇸 English (scream)</td><td>Ghostface</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_ghostface.mp3" /></td></tr>
        <tr><td>🇺🇸 English (star wars)</td><td>Chewbacca</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_chewbacca.mp3" /></td></tr>
        <tr><td>🇺🇸 English (star wars)</td><td>C3PO</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_c3po.mp3" /></td></tr>
        <tr><td>🇺🇸 English (star wars)</td><td>Stormtrooper</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_stormtrooper.mp3" /></td></tr>
        <tr><td>🇺🇸 English (lilo & stitch)</td><td>Stitch</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_stitch.mp3" /></td></tr>
        <tr><td>🇺🇸 English (GotG)</td><td>Rocket</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_us_rocket.mp3" /></td></tr>
        <tr><td>🇺🇸 English (disney)</td><td>Madame Leota</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_madam_leota.mp3" /></td></tr>
        <tr><td>🇺🇸 English (deadpool)</td><td>Mr. GoodGuy</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_deadpool.mp3" /></td></tr>
        <tr><td>🇺🇸 English (grinch)</td><td>Trickster</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_grinch.mp3" /></td></tr>
        <tr><td>🇺🇸 English (disney)</td><td>Ghost Host</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_ghosthost.mp3" /></td></tr>
        <tr><td>🇺🇸 English (disney)</td><td>Pirate</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_pirate.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Alto (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_f08_salut_damour.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Warmy Breeze (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_f08_warmy_breeze.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Glorious (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_ht_f08_glorious.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Dramatic (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_ht_f08_wonderful_world.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Tenor (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_m03_lobby.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Sunshine Soon (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_m03_sunshine_soon.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Chipmunk (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_sing_funny_it_goes_up.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>It Goes Up (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_m2_xhxs_m03_silly.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Caroler (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_sing_deep_jingle.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Classic Electric (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_m03_classical.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Cozy (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_m2_xhxs_m03_christmas.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Halloween (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_ht_f08_halloween.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>NYE 2023 (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_ht_f08_newyear.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Thanksgiving (Male)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_male_sing_funny_thanksgiving.mp3" /></td></tr>
        <tr><td>🇺🇸 English (singing)</td><td>Pop Lullaby (Female)</td><td><audio controls src="https://r2.wamellow.com/tts-preview/en_female_f08_twinkle.mp3" /></td></tr>
    </tbody>
</table>

## Server nodes & regions
For optimal latency and performance when using Text to Speech in voice channels, Wamellow has multiple server nodes in different regions.
A list of available nodes and regions can be found [on the status page](/status).
<br />
<br />

If the voice channel's *Region Override* is set to `Automatic`, it will default to a node with the lowest resource usage.
If an override is set, it will use the selected region, or one closest to it, if available.

## Troubleshooting
If Wamellow joins the voice channel but doesn't speak, check that it has the `Connect` and `Speak` permissions in the channel settings. If it does, [please report the issue to us](/support).
<br />
<br />

If Wamellow says that someone else's message is still being spoken, but it's not talking, use `/tts stop`.
You can also use this or `/tts skip` to stop any message that is currently being spoken (i.e.: because of spam).