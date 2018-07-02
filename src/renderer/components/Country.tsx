import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class Country extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  private readonly ssl!: boolean;

  @Prop({ type: String, required: false, default: 'auto' })
  private readonly code!: string;

  @Prop({ type: Boolean, required: false, default: true })
  private readonly retina!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly local!: boolean;

  private get src() {
    // if (this.local) return require(`assets/img/${this.code}-2x.png`); // eslint-disable-line
    // return `http://${this.ssl ? 'ssl-' : ''}api.itranslateapp.com/flags/${this.code}${this.retina ? '-2x' : ''}.png`; // prettier-ignore
    return `http://${this.ssl ? 'ssl-' : ''}api.itranslateapp.com/flags/${this.code}${this.retina ? '-2x' : ''}.png`; // prettier-ignore
  }

  render() {
    return <img src={this.src} draggable={false} />;
  }
}
