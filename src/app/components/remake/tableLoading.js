import { LoadingOutlined } from "@ant-design/icons";

export const tableLoading = {
  spinning: isLoading,
  indicator: (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  ),
};
