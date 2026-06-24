import { ScreenMessage } from "@/components/screen-message";

export default function NotFound() {
    return (
        <ScreenMessage
            title="Sadly, this page can not be found.."
            description="Seems like you got a little lost here?"
        />
    );
}