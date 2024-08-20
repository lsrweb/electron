import { BaseIconProps } from "./BaseIconProps";

export default defineComponent({
  name: "BaseIcon",
  props: BaseIconProps,
  emits: ["click"],
  setup(props, { slots, emit }) {
    return () => (
      <div
        style={{
          color: props.color,
          backgroundColor: props.bgColor,
          width: props.size,
        }}
        class={[
          `text-[${props.size}]`,
          `p-1`,
          `rounded-[${props.borderRadius}]`,
        ]}
        // 使用 Vue 的 .stop 修饰符来阻止事件冒泡
        onClick={(event) => {
          event.stopPropagation();
          emit("click");
        }}
      >
        {slots.default?.(props)}
      </div>
    );
  },
});
