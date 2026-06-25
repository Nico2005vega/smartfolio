// src/components/ui/Skeleton.tsx
export function Sk({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s ease-in-out infinite",
        borderRadius: 10,
        ...style,
      }}
    />
  );
}
export const SkStyle = `@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;