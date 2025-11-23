type EmptyListProps = {
  message?: string;
};

export default function EmptyList({
  message = "No items yet",
}: EmptyListProps) {
  return <div>{message}</div>;
}
