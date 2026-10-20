import Image from "next/image";

type Props = { name: string; width: number; height: number; className?: string; alt?: string };
export function Asset({ name, width, height, className, alt = "" }: Props) {
  return <Image src={`/images/figma/${name}`} width={width} height={height} alt={alt} className={className} />;
}
