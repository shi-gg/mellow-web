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
    k?: string;

    defaultState: T;
    transform?: (value: T) => unknown;

    onSave?: (value: T) => void;

    manual?: boolean;
    debounceMs?: number;

    isEqual?: (a: T, b: T) => boolean;
}

export type InputProps<T> = InputOptions<T> & HTMLProps<HTMLDivElement> & {
    label: string;
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

    const { endpoint, k, onSave, transform, manual, debounceMs, defaultState, isEqual } = options;

    const defaultStateKey = JSON.stringify(defaultState);
    const [prevDefaultStateKey, setPrevDefaultStateKey] = useState(defaultStateKey);
    if (defaultStateKey !== prevDefaultStateKey) {
        setPrevDefaultStateKey(defaultStateKey);
        setValue(defaultState);
        setSavedValue(defaultState);
    }

    useEffect(() => {
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
    }, []);

    const save = useCallback(
        async (val?: T) => {
            const valueToSave = val === undefined ? value : val;
            onSave?.(valueToSave);
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
                    ? { [k.split(".")[0]]: { [k.split(".")[1]]: transform?.(valueToSave) ?? valueToSave } }
                    : { [k]: transform?.(valueToSave) ?? valueToSave }
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
        [onSave, endpoint, k, transform, value]
    );

    const update = useCallback(
        (val: T) => {
            setValue(val);

            if (manual) return;

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (debounceMs) {
                debounceRef.current = setTimeout(() => save(val), debounceMs);
            } else {
                save(val);
            }
        },
        [manual, debounceMs, save]
    );

    return {
        value,
        state,
        error,
        isDirty: isEqual ? !isEqual(value, savedValue) : value !== savedValue,
        update,
        save,
        reset: () => setValue(savedValue)
    };
}