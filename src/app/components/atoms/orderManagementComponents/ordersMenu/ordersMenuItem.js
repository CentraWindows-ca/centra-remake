export default function OrdersMenuItem(props) {
  const { onClick, selected, key } = props;

  return (
    <div
      key={key}
      className={`rounded-sm cursor-pointer transition delay-75 hover:bg-blue-100 hover:text-centraBlue py-2 pl-2 flex w-full items-center justify-between ${
        selected ? "bg-blue-100 text-centraBlue" : ""
      }`}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
}
