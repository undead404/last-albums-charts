const PREFIX = `controlled-element-${
  import.meta.env.SSR ? 'server' : 'client'
}-`;
let counter = 0;
export default function getNextId(): string {
  counter += 1;
  return `${PREFIX}${counter}`;
}
