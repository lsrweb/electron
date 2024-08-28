import { h } from "vue";
import Button from "../Button.vue";

export default defineComponent({
  name: "DataTable",
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    columns: {
      type: {
        type: Object,
        required: true,
      },
      required: true,
      default: () => [],
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 是否拼接操作列
    action: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["editRow", "deleteRow"],
  setup(props, { slots, emit }) {
    return () => (
      <ElTable
        data={props.data}
        border
        header-row-style={{ background: "#242425" }}
      >
        {props.columns.map((column) => (
          <ElTableColumn
            key={column.key}
            prop={column.key}
            label={column.label}
            {...column.props}
          />
        ))}

        {slots.action && !props.action ? (
          <ElTableColumn label="操作" width="180" fixed="right" align="center">
            {({ row }) => <>{slots.action({ row })}</>}
          </ElTableColumn>
        ) : (
          <ElTableColumn label="操作" width="180" fixed="right" align="center">
            {({ row }) => (
              <>
                <Button onClick={() => emit("editRow", row)}>编辑</Button>
                <Button onClick={() => emit("deleteRow", row)}>删除</Button>

                {/* 如果action 需要拼接操作列 */}
                {...slots.action && slots.action({ row })}
              </>
            )}
          </ElTableColumn>
        )}
      </ElTable>
    );
  },
});
