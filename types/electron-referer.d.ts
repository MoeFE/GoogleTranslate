declare module 'electron-referer' {
  import { BrowserWindow } from 'electron';

  export default function(referer: string, win?: BrowserWindow): void;
}
