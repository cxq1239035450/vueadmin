import { VNode } from 'vue'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicAttributes {
      [attr: string]: any
    }
  }
}
declare module '*.tsx' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

