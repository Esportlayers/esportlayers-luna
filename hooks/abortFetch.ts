import { useState, useEffect } from "react";

export function useAbortFetch<T>(fetcher: (controller: AbortController, ...props: any) => Promise<T>, ...props: any): [T | null, () => Promise<void>] {
    const abortController = new AbortController();
    const [resource, setResource] = useState<T | null | undefined>(undefined);

    const load = async () => {
        const res = await fetcher(abortController, ...props);
        setResource(res ?? null);
    };

    useEffect(() => {
        load();
        return () => abortController.abort;
    }, [])


    return [resource, load];
}