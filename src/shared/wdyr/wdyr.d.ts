import React from 'react';

declare module 'react' {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean;
  }

  interface Component<P = {}, S = {}> {
    whyDidYouRender?: boolean;
  }

  interface ExoticComponent<P = {}> {
    whyDidYouRender?: boolean;
  }
}

declare module '@welldone-software/why-did-you-render' {
  interface WhyDidYouRenderOptions {
    trackAllPureComponents?: boolean;
    trackHooks?: boolean;
    trackExtraHooks?: Array<[any, string, ...string[]]>;
    logOnDifferentValues?: boolean;
    collapseGroups?: boolean;
    logOwnerReasons?: boolean;
    include?: RegExp[];
    exclude?: RegExp[];
  }

  function whyDidYouRender(
    React: typeof import('react'),
    options?: WhyDidYouRenderOptions
  ): void;

  export default whyDidYouRender;
}
