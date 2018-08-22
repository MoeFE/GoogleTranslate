import fs from 'fs';
import path from 'path';

import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Provide, Watch } from 'vue-property-decorator';

export interface LocaleProviderProps {
  locale?: string;
}

@Component
export default class LocaleProvider extends Vue.Component<LocaleProviderProps> {
  public languages = {};
  public localizable = {};

  @Prop({ type: String, required: false, default: 'zh-CN' })
  private readonly locale!: string;

  @Provide()
  private get localeProvider() {
    return this;
  }

  @Watch('locale', { immediate: true })
  private async handleChangeLocale() {
    const exists = fs.existsSync(path.join(__static, `i18n/${this.locale}`));
    const locale = exists ? this.locale : 'zh-CN';
    const filename = path.join(__static, `/i18n/${locale}/languages.json`);
    this.languages = JSON.parse(fs.readFileSync(filename).toString());
  }

  render() {
    return <div id="app">{this.$slots.default}</div>;
  }
}
