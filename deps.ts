// Relative import path error if these two come from "imports" in deno.json file when importing as a module in another project, that's why we're using URL imports instead.

export * as elmish from 'https://deno.land/x/elmish@v0.0.4/mod.ts';
export * as preact from 'preact';
export * as hooks from 'https://esm.sh/stable/preact@10.13.1/denonext/hooks.js';
