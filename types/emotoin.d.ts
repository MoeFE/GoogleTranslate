/* eslint-disable */
declare module 'vue-emotion' {
  import Vue from 'vue';
  import { TsxComponent } from 'vue-tsx-support';
  import { Interpolation as EmotionInterpolation } from 'emotion';

  export * from 'emotion';

  export type InterpolationFn<Props = {}> = (
    props: Props
  ) => EmotionInterpolation | InterpolationFn<Props>;

  export type InterpolationTypes<Props = {}> =
    | InterpolationFn<Props>
    | EmotionInterpolation;

  export type Interpolation<Props = {}> =
    | InterpolationTypes<Props>
    | Array<InterpolationTypes<Props>>;

  export interface Options {
    string?: string;
  }

  export type ThemedProps<Props, Theme> = Props & {
    theme: Theme;
  };

  type ElementProps<
    Tag extends keyof JSX.IntrinsicElements
  > = JSX.IntrinsicElements[Tag];

  export interface StyledComponent<Props, Theme, IntrinsicProps>
    extends TsxComponent<Vue, Props & IntrinsicProps> {
    withComponent<Tag extends keyof JSX.IntrinsicElements>(
      tag: Tag
    ): StyledComponent<Props, Theme, ElementProps<Tag>>;

    withComponent(component: any): StyledComponent<Props, Theme, {}>;

    displayName: string;
    __emotion_styles: string[];
    __emotion_base: string | {};
    __emotion_real: ThemedVueEmotionInterface<Theme>;
  }

  export type ObjectStyleAttributes =
    | object
    | object[]
    | { [key: string]: ObjectStyleAttributes };

  export interface CreateStyled<Props, Theme, IntrinsicProps> {
    // overload for template string as styles
    (
      strings: TemplateStringsArray,
      ...vars: Array<Interpolation<ThemedProps<Props & IntrinsicProps, Theme>>>
    ): StyledComponent<Props, Theme, IntrinsicProps>;

    // overload for object as styles
    (
      ...styles: Array<
        | ObjectStyleAttributes
        | ((
            props: ThemedProps<Props & IntrinsicProps, Theme>
          ) => ObjectStyleAttributes)
      >
    ): StyledComponent<Props, Theme, IntrinsicProps>;
  }

  type ShorthandsFactories<Theme> = {
    [Tag in keyof JSX.IntrinsicElements]: {
      // overload for template string as styles
      <Props = {}>(
        strings: TemplateStringsArray,
        ...vars: Array<
          Interpolation<ThemedProps<Props & JSX.IntrinsicElements[Tag], Theme>>
        >
      ): StyledComponent<Props, Theme, ElementProps<Tag>>;

      // overload for object as styles
      <Props = {}>(
        ...styles: Array<
          | ObjectStyleAttributes
          | ((
              props: ThemedProps<Props & JSX.IntrinsicElements[Tag], Theme>
            ) => ObjectStyleAttributes)
        >
      ): StyledComponent<Props, Theme, ElementProps<Tag>>;
    }
  };

  export interface ThemedVueEmotionInterface<Theme>
    extends ShorthandsFactories<Theme> {
    // overload for dom tag
    <Props, Tag extends keyof JSX.IntrinsicElements>(
      tag: Tag,
      options?: Options
    ): // tslint:disable-next-line:no-unnecessary-generics
    CreateStyled<Props, Theme, ElementProps<Tag>>;

    // overload for component
    <Props, CustomProps>(
      component: any,
      options?: Options
    ): // tslint:disable-next-line:no-unnecessary-generics
    CreateStyled<Props & CustomProps, Theme, {}>;
  }

  export interface ThemedVueEmotionModule<Theme> {
    default: ThemedVueEmotionInterface<Theme>;
  }

  const styled: ThemedVueEmotionInterface<any>;
  export default styled;
}
