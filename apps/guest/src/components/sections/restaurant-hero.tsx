import Image from 'next/image'

interface RestaurantHeroProps {
  name: string
  description: string | null
}
export default function RestaurantHero({ name, description }: RestaurantHeroProps) {
  return (
    <section className="relative h-96 md:h-[500px] lg:h-[550px] xl:h-[650px] 2xl:h-[750px]">
      <Image
        src="/restaurant.jpg"
        alt="gourmet delight"
        fill
        className="brightness-50 object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
          <p className="text-xl text-gray-200">{description}</p>
        </div>
      </div>
    </section>
  )
}
