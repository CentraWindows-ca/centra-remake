export default function OrderHeaderCard(props) {
  const { label = "" } = props;
  return (
    <div
      className="bg-slate-200 rounded text-sm"
      style={{ color: "var(--centrablue)" }}
    >
      <i className="fa-regular fa-rectangle-list pr-2 pl-1 align-sub"></i>
      <span className="pr-1 align-sub">{label}</span>
    </div>
  );
}
