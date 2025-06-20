export default function UploadIcon(props) {
  const { onClick, color } = props;

  return (
    <i
      className={`fa-solid fa-cloud-arrow-up hover:cursor-pointer pr-1 hover:text-blue-400 ${
        color ?? ""
      }`}
      onClick={onClick}
    />
  );
}
