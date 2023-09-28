import { FC } from "react";
import { BaseKey, useLogList } from "@refinedev/core";
import { ILog } from "src/interfaces/log";

type HistoryProps = {
  resource: string;
  id?: BaseKey;
};

export const History: FC<HistoryProps> = ({ resource, id }) => {
  const { isLoading, data } = useLogList<ILog[]>({
    resource,
    meta: {
      id,
    },
  });

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      <h2>History #{id}</h2>
      {data.length === 0 && <div>No history</div>}
      {data.map((item) => (
        <div key={item.id}>
          <div>Resource: {item.resource}</div>
          <div>Action: {item.action}</div>
          <div>
            Data:
            <pre>{JSON.stringify(item.data, null, 2)}</pre>
          </div>
          <div>
            Previous Data:
            <pre>{JSON.stringify(item.previousData, null, 2)}</pre>
          </div>
          <div>Timestamp: {item.timestamp}</div>
        </div>
      ))}
    </div>
  );
};
