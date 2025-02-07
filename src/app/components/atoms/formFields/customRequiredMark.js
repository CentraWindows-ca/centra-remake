export const customRequiredMark = (label, { required }) => (
  <>
    {label}
    {required ? <div style={{ color: "red" }}>*</div> : null}
  </>
);
