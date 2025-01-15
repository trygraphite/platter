import { Card, CardContent, CardHeader } from "@platter/ui/components/card";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: {
    id: string;
    name: string;
  };
}

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader className="p-0">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="text-black font-semibold">₦{item.price}</span>
        </div>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </CardContent>
    </Card>
  );
}
