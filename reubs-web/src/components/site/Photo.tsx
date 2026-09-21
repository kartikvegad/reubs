import Image from "next/image";

export function Photo({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const positioned = /\b(absolute|relative|fixed)\b/.test(className);

  return (
    <div className={`photo-frame ${positioned ? "" : "relative"} overflow-hidden bg-gold-soft ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : undefined}
      />
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.22em] text-maroon">{children}</p>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted">[{children}]</p>;
}
