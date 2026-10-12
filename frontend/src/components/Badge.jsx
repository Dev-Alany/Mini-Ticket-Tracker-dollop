export function Badge({ value }) {
  const label = value.replace("_", " ");
  return <span className={`badge badge-${value}`}>{label}</span>;
  
}
