"use client";
import { debounce } from "lodash";
import { debugPort } from "process";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<{
    result: string[];
    duration: number;
  }>();

  const fetchData = useCallback(async (input: string) => {
    if (!input) return setSearchResult(undefined);
    const start = performance.now();
    const result = await fetch(`/api/search?q=${input}`);
    const duration = performance.now() - start;
    const json = await result.json();
    setInput(json.input);
    setSearchResult({ result: json.result, duration });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 500),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(input);
  }, [debouncedFetchData, input]);

  return (
    <div className="flex min-h-screen flex-col items-center p-24 gap-4">
      <h3 className="text-2xl font-bold">
        Fast and simple search with nextjs, hono and redis
      </h3>
      <input
        className="w-full rounded-lg border-2 border-gray-300 p-2 text-lg bg-black text-white"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <p>{input}</p>
      <p>{searchResult?.result.join(", ")}</p>
    </div>
  );
}
