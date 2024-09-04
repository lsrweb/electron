<script setup lang="ts">
import { cn } from "@r/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Spinner from "./Spinner.vue";
const button = cva("ry-button", {
  variants: {
    variant: {
      default: "variant-default",
      destructive: "variant-destructive",
      outline: "variant-outline",
      secondary: "variant-secondary",
      ghost: "variant-ghost",
      link: "variant-link",
      tag: "variant-tag",
    },
    size: {
      sm: "size-sm",
      md: "size-md",
      lg: "size-lg",
      icon: "size-icon",
    },
    animate: {
      true: "active:scale-[0.97]",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    animate: false,
  },
});

type ButtonProps = VariantProps<typeof button>;

withDefaults(
  defineProps<{
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    animate?: ButtonProps["animate"];
    disabled?: boolean;
    icon?: string;
    loading?: boolean;
  }>(),
  {
    variant: "default",
    size: "md",
    animate: false,
    disabled: false,
    loading: false,
  }
);
</script>

<template>
  <button
    :disabled="disabled"
    :class="
      cn(
        button({
          variant,
          size,
          animate,
        })
      )
    "
    type="button"
  >
    <!-- 如果有 loading  -->
    <!-- <div>
      <div v-if="loading || disabled" class="absolute inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    </div> -->
    <component v-if="icon" :is="icon + 'Icon'" />

    <slot />
  </button>
</template>

<style scoped lang="scss">
.ry-button {
  @apply inline-flex items-center gap-1 justify-center whitespace-nowrap rounded-md text-sm font-medium transition duration-200 ease-out active:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mr-2;
  &:last-child {
    @apply mr-0;
  }

  &.variant-default {
    @apply bg-primary text-primary-foreground shadow hover:bg-primary/90;
  }

  &.variant-destructive {
    @apply bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90;
  }

  &.variant-outline {
    @apply border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground;
  }

  &.variant-secondary {
    @apply bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80;
  }

  &.variant-ghost {
    @apply hover:bg-accent hover:text-accent-foreground;
  }

  &.variant-link {
    @apply text-primary underline-offset-4 hover:underline;
  }

  &.variant-tag {
    @apply border border-primary text-primary hover:text-primary/80 hover:border-primary/80;
  }
  // size
  &.size-sm {
    @apply h-6 rounded-md px-2 text-xs;
  }

  &.size-md {
    @apply h-8 px-3 py-2 text-xs;
  }

  &.size-lg {
    @apply h-10 rounded-md px-8;
  }

  &.size-icon {
    @apply h-9 w-9;
  }

  // animate
  &.animate-true {
    @apply active:scale-[0.97];
  }

  &.animate-false {
  }

  &.animate-true {
    @apply transition-transform;
  }

  &.animate-false {
    @apply transition-none;
  }

  // icon svg
  svg {
    @apply h-4 w-4;
  }
}
</style>
