import { useEffect } from "react";

/**
 * Hook that handles closure of a component when clicking outside of a "wamellow-modal" class.
 * This component must be mounted within the component that is being closed.
 */
export function ClickOutside({
    onClose
}: {
    onClose: () => void;
}) {

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent): void => {

            // @ts-expect-error -- It think's closest doesn't exist, but it does
            if (!event.target?.closest(".wamellow-modal")) {
                onClose();
            }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [onClose]);

    return <></>;
}