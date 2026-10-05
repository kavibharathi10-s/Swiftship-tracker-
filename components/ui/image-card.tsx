import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ImageCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  href: string;
}

export default function ImageCard({
  imageSrc,
  imageAlt,
  title,
  description,
  href,
}: ImageCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative h-48">
        <Link href={href}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out hover:scale-105 p-4"
          />
        </Link>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
