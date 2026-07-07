/* eslint-disable @next/next/no-img-element */

export default function Emoji({
    emojiId
}: {
    emojiId: string;
}) {
    return (
        <img
            alt='emoji'
            className='rounded-md inline size-6 -my-1 mr-px relative bottom-px'
            src={`https://cdn.discordapp.com/emojis/${emojiId}.webp?size=40&quality=lossless`}
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
        />
    );
}