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
      type: Array,
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
          // <ElTableColumn
          //   key={column.key}
          //   prop={column.key}
          //   label={column.label}
          //   {...column.props}
          // />
          // type = link | button | text
          <ElTableColumn
            key={column.key}
            prop={column.key}
            label={column.label}
            {...column.props}
          >
            {({ row }) => {
              if (column.type === "link") {
                return (
                  <a
                    href={column.link(row)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {column[row[column.key]]}
                  </a>
                );
              }
              if (column.type === "button") {
                return (
                  <Button onClick={() => column.button(row)}>
                    {column[row[column.key]]}
                  </Button>
                );
              }
              return column[row[column.key]];
            }}
          </ElTableColumn>
        ))}

        {slots.action && !props.action ? (
          <ElTableColumn label="操作" fixed="right" align="center">
            {({ row }) => <>{slots.action({ row })}</>}
          </ElTableColumn>
        ) : (
          <ElTableColumn label="操作" fixed="right" align="center">
            {({ row }) => (
              <>
                <Button onClick={() => emit("editRow", row)}>编辑</Button>
                <Button onClick={() => emit("deleteRow", row)}>删除</Button>

                <div class={"ml-2 inline-flex"}>
                  {...slots.action && slots.action({ row })}
                </div>
              </>
            )}
          </ElTableColumn>
        )}
      </ElTable>
    );
  },
});
