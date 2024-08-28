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
          props.textSize,
          props.textAlign,
          `p-1`,
          props.borderRadius,
          "hover:!bg-[#42b983] hover:!text-white",
          "cursor-pointer inline-flex mr-2 last:mr-0",
        ]}
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
