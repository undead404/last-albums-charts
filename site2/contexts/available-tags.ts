import { createContext } from 'react';

const AvailableTagsContext = createContext<string[]>([]);

export default AvailableTagsContext;
