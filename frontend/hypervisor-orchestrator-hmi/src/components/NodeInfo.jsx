import { GetNodeInfo } from "../functions/getNodeInfo.jsx"
export const NodeInfo = (props) => {
  const { node, loading, error } = GetNodeInfo(props.nodeIp);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.text}</p>;
  const node_attr = Object.keys(node);
return (
    <ul>
      {node_attr.map((key) => (
        <li key={key}>
          {key}: {String(node[key])}
        </li>
      ))}
    </ul>
  );
}

export default NodeInfo;
