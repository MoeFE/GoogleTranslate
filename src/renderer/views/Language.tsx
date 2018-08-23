import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Inject } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import styled, { css } from 'vue-emotion';
import anime from 'animejs';
import { languages, IDialects, ILanguage } from 'assets/languages';
import Layout, { Main, Close } from 'components/Layout';
import Header from 'components/Header';
import Input from 'components/Input';
import Country from 'components/Country';
import Select, { Optgroup, Option } from 'components/Select';
import { resize } from '@/utils';
import { IState } from '../store';

// #region stylesheet
const header = css`
  .right {
    position: static !important;
    right: 0 !important;
  }
`;

const Search = styled.div`
  align-self: flex-start;
  background: #f7fafb;
  border-bottom: 1px solid #d7dce0;
  margin-bottom: 10px;
  width: calc(100% - 2px);
`;

const SearchForm = styled.form`
  position: relative;
  padding: 10px 20px;
  &:before {
    content: '\\e60d';
    font-family: icon;
    font-size: 22px;
    color: #aaaeb3;
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translate3d(0, -50%, 0);
  }
  input {
    padding-left: 40px;
  }
`;

const Languages = styled.div`
  flex: 1;
  width: 100%;
  overflow: scroll;
  box-sizing: border-box;
`;
// #endregion

@Component({ name: 'Language' })
export default class Language extends Vue {
  public readonly $refs!: {
    input: Input;
    select: Select;
    search: HTMLDivElement;
    languages: HTMLDivElement;
  };

  @Inject()
  private readonly localeProvider!: any;
  @State('recentlyUsed')
  private readonly recentlyUsed!: IDialects;
  @Mutation('save')
  private readonly setState!: (payload: IState) => void;

  private kw: string = '';
  private lang: string = '';

  private get recentlyUsedLanguage() {
    const { type } = this.$route.query;
    return this.recentlyUsed.filter(
      item => (type === 'target' ? item.key !== 'auto' : true),
    );
  }

  private get allLanguages() {
    const regex = new RegExp(this.kw, 'i');
    const { type } = this.$route.query;
    const langs = ([] as IDialects)
      .concat(
        ...languages.map(x => x.dialects.map(v => ({ ...v, asr: x.key }))),
      )
      .filter((item) => {
        const isMatch =
          regex.test(this.localeProvider.languages[item.key]) ||
          regex.test(item.localized_name) ||
          regex.test(item.key);
        return type === 'target' ? isMatch && item.key !== 'auto' : isMatch;
      });
    const index = langs.findIndex(x => x.key === 'auto');
    if (index > -1) {
      const auto = langs[index];
      langs.splice(index, 1);
      langs.unshift(auto);
    }
    return langs;
  }

  @Watch('kw')
  private async handleChangeKeyWord() {
    await this.$nextTick();
    const selectHeight = [...this.$refs.select.$el.children]
      .map(el => el.clientHeight)
      .reduce((prev, next) => prev + next);
    const mainHeight = selectHeight <= 19 ? 34 : selectHeight + 5;
    const innerHeight = Math.min(530, 130 + mainHeight);
    if (innerHeight !== window.innerHeight) {
      resize(window.innerWidth, innerHeight);
    }
  }

  @Watch('allLanguages', { immediate: true })
  private async handleChangeLanguages() {
    await this.$nextTick();
    const { country } = this.$route.query;
    const { select } = this.$refs;
    const option =
      select.options.find(
        x => (JSON.parse(x.value) as ILanguage).key === country,
      ) || select.options[0];
    this.lang = option.value;
    select.selectedOptionId = option._uid; // eslint-disable-line no-underscore-dangle
  }

  private handleClose() {
    this.$router.push('/');
  }

  private handleSelected(value: string) {
    const { type } = this.$route.query;
    const lang: ILanguage = JSON.parse(value);
    const index = this.recentlyUsed.findIndex(x => x.key === lang.key);
    if (index > -1) this.recentlyUsed.splice(index, 1);
    this.recentlyUsed.unshift(lang);
    this.setState({ recentlyUsed: this.recentlyUsed });
    this.$router.push({
      path: '/',
      query: {
        type,
        key: lang.asr,
        country: lang.key,
      },
    });
  }

  private async handleBlur() {
    await this.$nextTick();
    const { input } = this.$refs;
    if (input) input.$el.focus();
  }

  mounted() {
    resize(window.innerWidth, 530);
    anime({
      targets: [this.$refs.search, this.$refs.languages],
      translateY: 0,
      translateZ: 0,
    });
    this.handleBlur();
  }

  render() {
    const { allLanguages } = this;
    const { languages } = this.localeProvider; // eslint-disable-line
    const { country } = this.$route.query;

    return (
      <Layout>
        <Header class={header}>
          <Close slot="right" onClick={this.handleClose}>
            关闭
          </Close>
        </Header>
        <Main>
          <Search
            ref="search"
            style={{ transform: 'translateY(-40px) translateZ(0)' }}
          >
            <SearchForm>
              <Input
                ref="input"
                type="search"
                placeholder="搜索语言"
                v-model={this.kw}
                onBlur={this.handleBlur}
                autofocus
              />
            </SearchForm>
          </Search>
          <Languages
            ref="languages"
            style={{ transform: 'translateY(40px) translateZ(0)' }}
          >
            <Select
              ref="select"
              key={this.kw}
              v-model={this.lang}
              onSelected={this.handleSelected}
            >
              {!this.kw ? (
                <Optgroup label="最近使用">
                  {this.recentlyUsedLanguage.map(item => (
                    <Option
                      ref="option"
                      key={item.key}
                      value={JSON.stringify(item)}
                      active={item.key === country}
                      inverse={item.key === 'auto'}
                    >
                      <Country code={item.key} />
                      {languages[item.key] || item.localized_name}
                    </Option>
                  ))}
                </Optgroup>
              ) : null}
              <Optgroup
                label={this.kw ? `${allLanguages.length} 个语言` : '所有语言'}
              >
                {allLanguages.map(item => (
                  <Option
                    ref="option"
                    key={item.key}
                    value={JSON.stringify(item)}
                    active={item.key === country}
                    inverse={item.key === 'auto'}
                  >
                    <Country code={item.key} />
                    {languages[item.key] || item.localized_name}
                  </Option>
                ))}
              </Optgroup>
            </Select>
          </Languages>
        </Main>
      </Layout>
    );
  }
}
