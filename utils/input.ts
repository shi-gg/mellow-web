import type { ApiError } from "@/typings";
import type { HTMLProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export enum InputState {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface InputOptions<T> {
    endpoint?: string;
    /** @deprecated Use `endpoint` instead. Kept for backward compatibility. */
    url?: string;
    k?: string;
    /** @deprecated Use `k` instead. Kept for backward compatibility. */
    dataName?: string;

    defaultState: T;
    transform?: (value: T) => unknown;

    onSave?: (value: T) => void;

    manual?: boolean;
    debounceMs?: number;
}

export type InputProps<T> = InputOptions<T> & HTMLProps<HTMLDivElement> & {
    label?: string;
    description?: string;
    disabled?: boolean;
};

export function useInput<T>(options: InputOptions<T>) {
    const [value, setValue] = useState<T>(options.defaultState);
    const [savedValue, setSavedValue] = useState<T>(options.defaultState);
    const [state, setState] = useState<InputState>(InputState.Idle);
    const [error, setError] = useState<string | null>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const endpoint = options.endpoint || options.url;
    const k = options.k || options.dataName;

    const defaultStateKey = JSON.stringify(options.defaultState);
    useEffect(() => {
        setValue(options.defaultState);
        setSavedValue(options.defaultState);

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [defaultStateKey]);

    const save = useCallback(
        async (val?: T) => {
            const valueToSave = val === undefined ? value : val;
            options.onSave?.(valueToSave);
            setSavedValue(valueToSave);

            if (!endpoint || !k) return;

            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }

            setState(InputState.Loading);
            setError(null);

            const res = await fetch(process.env.NEXT_PUBLIC_API + endpoint, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(k.includes(".")
                    ? { [k.split(".")[0]]: { [k.split(".")[1]]: options.transform?.(valueToSave) ?? valueToSave } }
                    : { [k]: options.transform?.(valueToSave) ?? valueToSave }
                )
            })
                .catch((error) => String(error));

            if (typeof res === "string" || !res.ok) {
                setState(InputState.Idle);

                if (typeof res === "string") {
                    setError(res);
                } else {
                    const data = await res
                        .json()
                        .catch(() => null) as ApiError | null;

                    setError(data?.message || "Unknown error");
                }

                return;
            }

            setState(InputState.Success);
            timeout.current = setTimeout(() => setState(InputState.Idle), 1_000 * 8);
        },
        [options.onSave, endpoint, k, options.transform, value]
    );

    const update = useCallback(
        (val: T) => {
            setValue(val);

            if (options.manual) return;

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (options.debounceMs) {
                debounceRef.current = setTimeout(() => save(val), options.debounceMs);
            } else {
                save(val);
            }
        },
        [options.manual, options.debounceMs, save]
    );

    return {
        value,
        state,
        error,
        isDirty: value !== savedValue,
        update,
        save,
        reset: () => setValue(savedValue)
    };
}