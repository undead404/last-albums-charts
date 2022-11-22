import * as usehooks from 'usehooks-ts';

const { useWindowSize } = usehooks;
const MOBILE_WIDTH_LIMIT = 1024;
const DEFAULT_WINDOW_WIDTH = 1800;

export default function useIsMobile() {
  const windowWidth = useWindowSize()?.width || DEFAULT_WINDOW_WIDTH;
  return windowWidth <= MOBILE_WIDTH_LIMIT;
}
