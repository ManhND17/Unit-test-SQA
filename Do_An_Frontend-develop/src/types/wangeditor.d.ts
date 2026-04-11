/**
 * Type definitions for @wangeditor custom elements
 */

import { SlateElement } from '@wangeditor/editor';

declare module '@wangeditor/editor' {
  interface ImageElement extends SlateElement {
    src: string;
    alt: string;
    url: string;
    href: string;
  }
}
