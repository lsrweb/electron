import { h } from "vue";

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
  },
  setup(props) {
    return () => (
      <ElTable
        data={props.data}
        border
        header-row-style={{ background: "#f3f3f3" }}
      >
        {props.columns.map((column) => (
          <ElTableColumn
            key={column.key}
            prop={column.key}
            label={column.label}
            sortable
          />
        ))}
      </ElTable>
    );
  },
});
