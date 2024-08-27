interface columnTypes {
  label: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface dataTableTypes {
  columns: Array<columnTypes>;
  data: Array<any>;
}
