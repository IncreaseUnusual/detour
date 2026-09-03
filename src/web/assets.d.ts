/** Vite serves font and image imports as URLs. */
declare module '*.woff2' {
  const url: string;
  export default url;
}
