import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";

export function useAbortFetch<T>(fetcher: (controller: AbortController, ...props: any) => Promise<T>, ...props: any): [T | null, () => Promise<void>] {
    const abortController = new AbortController();
    const [resource, setResource] = useState<T | null | undefined>(undefined);
    const [lastFetch, setLastFetch] = useState(dayjs().unix());

    const load = async () => {
        const res = await fetcher(abortController, ...props);
        setResource(res ?? null);
        setLastFetch(dayjs().unix());
    };

    useEffect(() => {
        load();
        return () => abortController.abort;
    }, [])


    return [useMemo(() => resource, [lastFetch, resource]), load];
}