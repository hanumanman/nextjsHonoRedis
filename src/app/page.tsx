"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<{
    result: string[];
    duration: number;
  }>();

  const fetchData = useCallback(async (input: string) => {
    if (!input) return setSearchResult(undefined);
    const result = await fetch(
      `https://fastapi.hanumanman37.workers.dev/api/search?q=${input}`
    );
    const res = await result.json();
    setSearchResult(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 200),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(input);
  }, [debouncedFetchData, input]);

  console.log(searchResult?.result);

  return (
    <main className="h-screen text-white font-bold bg-gradient-to-r from-slate-700 to-slate-800 min-h-screen ">
      <div className="flex flex-col items-center p-24 gap-4 animate-in fade-in-5 slide-in-from-bottom-2.5">
        <h3 className="text-2xl font-bold">
          Search API with NextJS, Hono and Redis
        </h3>

        <Command className="w-full rounded-lg max-w-md border-2 border-slate-500 p-2 text-lg bg-slate-900 text-white">
          <CommandInput
            placeholder="Type country name to search"
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {searchResult?.result.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : null}

            {!searchResult?.result ? null : (
              <CommandGroup heading="Results">
                {searchResult?.result.map((item, index) => (
                  <CommandItem
                    className="text-white"
                    key={item + index}
                    value={item}
                    onSelect={setInput}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {searchResult?.result.length ? (
              <p className="text-sm text-center">
                Found {searchResult?.result.length}{" "}
                {searchResult.result.length === 1 ? "result" : "results"} in{" "}
                {searchResult?.duration ? searchResult.duration.toFixed(2) : 0}{" "}
                ms
              </p>
            ) : null}
          </CommandList>
        </Command>
      </div>
    </main>
  );
}
