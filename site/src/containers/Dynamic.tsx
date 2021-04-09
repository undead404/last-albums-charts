import React, { useEffect } from 'react';

export interface DynamicProperties {
  path?: string;
}

export default function Dynamic(properties: DynamicProperties): JSX.Element {
  useEffect(() => {
    console.info('Dynamic', properties.path);
  }, [properties.path]);
  return (
    <div>
      This is a dynamic page! It will not be statically exported, but is
      available at runtime
    </div>
  );
}
