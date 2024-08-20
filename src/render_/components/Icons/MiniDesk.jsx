import { defineComponent } from "vue";
import Base from "./Base";

export default defineComponent({
  name: "BlowUp",
  render() {
    return (
      <Base>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 20.247 6-16.5"
          />
        </svg>
      </Base>
    );
  },
});
