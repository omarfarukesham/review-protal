import 'next';

declare module 'next' {
  export type PageProps<
    P = Record<string, never>,
    Q = Record<string, never>
  > = {
    params: P;
    searchParams: Q;
  };
}