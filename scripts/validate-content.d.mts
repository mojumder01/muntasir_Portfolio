// Type declarations so vite.config.ts can import the content checker.
export function validateContent(): string[];
export function formatProblems(problems: string[]): string;
