import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';
import { Switch } from './Layout';

@Component
export default class Switcher extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  private readonly value!: boolean;

  private get active(): boolean {
    return this.value;
  }

  private set active(value: boolean) {
    this.$emit('input', value);
  }

  private dragging: boolean = false;

  private handleMousedown(e: Event) {
    e.stopPropagation();
    this.dragging = true;
  }

  private handleMmouseup(e: Event) {
    e.stopPropagation();
    this.dragging = false;
  }

  private handleClick() {
    this.active = !this.active;
  }

  render() {
    return (
      <Switch.Layout
        active={this.active}
        onMousedown={this.handleMousedown}
        onMouseup={this.handleMmouseup}
        onMouseout={this.handleMmouseup}
        onClick={this.handleClick}
      >
        <Switch.Handle
          active={this.active}
          dragging={this.dragging}
          onMousedown={this.handleMousedown}
          onMouseup={this.handleMmouseup}
          onMouseout={this.handleMmouseup}
        />
      </Switch.Layout>
    );
  }
}
