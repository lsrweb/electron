import { BaseIconProps } from "./BaseIconProps";

export default defineComponent({
  name: "BaseIcon",
  // 组件提供一个插槽，用于接收图标的内容,该组件的作用是将图标的内容渲染到页面上,并修改默认图标的大小
  props: BaseIconProps,
  setup(props, { slots }) {
    return () => (
      <div
        style={{
          color: props.color,
        }}
        class={`size-${props.size}`}
      >
        {slots.default?.(props)}
      </div>
    );
  },
});
