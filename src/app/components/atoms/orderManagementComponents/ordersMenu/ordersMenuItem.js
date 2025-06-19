import { useSelector } from "react-redux";
export default function OrdersMenuItem(props) {
  const { onClick, selected, key } = props;
  const { drawerOpen } = useSelector((state) => state.app);

  return (
    <div
      key={key}
      className={`rounded-sm cursor-pointer transition delay-75 hover:bg-blue-100 hover:text-centraBlue py-2 pl-2 flex w-full ${drawerOpen ? "justify-between" : "items-center"} ${
        selected ? "bg-blue-100 text-centraBlue" : ""
      }`}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
}
