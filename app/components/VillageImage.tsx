type VillageImageProps = {
  alt: string;
  className?: string;
  src: string;
};

export default function VillageImage({ alt, className, src }: VillageImageProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={className} src={src} />;
}
