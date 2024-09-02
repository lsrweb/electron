import { h } from "vue";
import Button from "../Button.vue";
import { ElLoading } from "element-plus";
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
      default: false,
    },
    actionProps: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["editRow", "deleteRow", "clickRow"],
  setup(props, { slots, emit }) {
    onMounted(() => {
      const loadingInstance = ElLoading.service({
        target: ".data-table__container",
      });

      watch(
        () => props.data,
        () => {
          loadingInstance.close();
        }
      );
    });

    return () => (
      <div class={"data-table__container"}>
        <ElTable
          data={props.data}
          border
          v-slots={{
            empty: () => (
              <div class="text-center py-4">
                <p class="text-gray-400">暂无数据</p>
              </div>
            ),
          }}
        >
          {props.columns.map((column) => (
            // <ElTableColumn
            //   key={column.key}
            //   prop={column.key}
            //   label={column.label}
            //   {...column.props}
            // />
            // type = link | button | text

            <ElTableColumn key={column.key} prop={column.key} label={column.label} headerAlign="center" align="center" {...column.props}>
              {({ row }) => {
                if (slots[column.key]) {
                  return slots[column.key]({ row });
                }
                if (column.type === "link") {
                  return (
                    <a href={column.link(row)} target="_blank" rel="noopener noreferrer">
                      {row[column.key] || "--"}
                    </a>
                  );
                }
                if (column.type === "button") {
                  return (
                    <>
                      <Button onClick={() => [column.buttonClick && column.buttonClick(row), emit("clickRow", row)]} {...column.buttonProps}>
                        {row[column.key] || "--"}
                      </Button>
                    </>
                  );
                }

                return column[row[column.key]] || row[column.key] || "--";
              }}
            </ElTableColumn>
          ))}

          {slots.action && !props.action ? (
            <ElTableColumn label="操作" fixed="right" align="center" {...props.actionProps}>
              {({ row }) => <>{slots.action({ row })}</>}
            </ElTableColumn>
          ) : (
            <ElTableColumn label="操作" fixed="right" align="center" {...props.actionProps}>
              {({ row }) => (
                <>
                  <Button onClick={() => emit("editRow", row)}>编辑</Button>
                  <Button onClick={() => emit("deleteRow", row)}>删除</Button>

                  <div class={"inline-flex"}>{slots.action && { ...slots.action } && slots.action({ row })}</div>
                </>
              )}
            </ElTableColumn>
          )}
        </ElTable>
      </div>
    );
  },
});
