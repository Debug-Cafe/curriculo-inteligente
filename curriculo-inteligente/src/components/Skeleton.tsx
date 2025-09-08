interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export default function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--border) 25%, var(--surface-alt) 50%, var(--border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function FormSkeleton({ theme }: { theme: any }) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      <Skeleton height="24px" width="200px" />
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Skeleton height="16px" width="80px" />
            <Skeleton height="40px" width="100%" />
          </div>
          <div>
            <Skeleton height="16px" width="60px" />
            <Skeleton height="40px" width="100%" />
          </div>
        </div>
        <div>
          <Skeleton height="16px" width="120px" />
          <Skeleton height="80px" width="100%" />
        </div>
      </div>
    </div>
  );
}

export function PreviewSkeleton({ theme }: { theme: any }) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '32px',
        minHeight: '600px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Skeleton height="32px" width="250px" />
        <Skeleton height="16px" width="200px" />
        <Skeleton height="16px" width="180px" />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <Skeleton height="20px" width="100px" />
          <Skeleton height="60px" width="100%" />
        </div>
        
        <div>
          <Skeleton height="20px" width="120px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="80%" />
            <Skeleton height="16px" width="90%" />
          </div>
        </div>
        
        <div>
          <Skeleton height="20px" width="80px" />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Skeleton height="24px" width="80px" borderRadius="12px" />
            <Skeleton height="24px" width="100px" borderRadius="12px" />
            <Skeleton height="24px" width="90px" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );
}