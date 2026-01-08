/// <reference types="./wdyr" />

import React from 'react';

// Only run why-did-you-render in development mode
if (import.meta.env.DEV) {
  const whyDidYouRender = await import('@welldone-software/why-did-you-render');
  
  whyDidYouRender.default(React, {
    // Track all pure components (React.memo, PureComponent)
    trackAllPureComponents: true,
    
    // Track hooks like useState, useContext, etc.
    trackHooks: true,
    
    // Track extra hooks for performance optimization
    trackExtraHooks: [
      [React, 'useMemo'],
      [React, 'useCallback'],
    ],
    
    // Log when props/state values actually change
    logOnDifferentValues: true,
    
    // Collapse console groups for cleaner output
    collapseGroups: true,
    
    // Log the owner component hierarchy
    logOwnerReasons: true,
    
    // Include additional information in logs
    include: [/.*/],
    
    // Exclude specific components if needed
    exclude: [
      /^BrowserRouter/,
      /^Router/,
      /^Route/,
      /^Link/,
    ],
  });
}
