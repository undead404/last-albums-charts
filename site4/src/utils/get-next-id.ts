const PREFIX = `controlled-element-${import.meta.env.SSR ? 'server' : 'client'}-`;
let counter = 0;
export default function getNextId(): string {
  return `${PREFIX}${++counter}`;
}
