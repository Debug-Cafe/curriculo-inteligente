interface Props {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ size = 20, color = 'var(--accent)' }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}