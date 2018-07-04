declare module 'v-hotkey' {
  import _Vue from 'vue';

  export default abstract class VueHotkey {
    public static install(Vue: typeof _Vue): void;
  }
}
