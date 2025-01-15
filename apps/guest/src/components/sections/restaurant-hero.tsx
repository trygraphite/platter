import Image from "next/image";

interface RestaurantHeroProps {
  name: string;
  description: string | null;
  logo?: string | null;
}

export function RestaurantHero({
  name,
  description,
  logo,
}: RestaurantHeroProps) {
  return (
    <div className="relative">
      <div className="relative w-[300px] h-[300px] mb-4 rounded-lg overflow-hidden border-2">
        <Image
          src={logo || "/restaurant.jpg"}
          alt={`${name} Logo`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400">
          {name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mt-4">
          {description || "Experience our seamless digital service"}
        </p>
      </div>
    </div>
  );
}
