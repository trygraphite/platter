export function MenuHeader({ userDetails }: { userDetails: String }) {
  return (
    <header className="w-full bg-white shadow-sm py-6 px-4">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Our Menu for {userDetails}
        </h1>
        <p className="text-gray-600 mt-2">
          Fresh ingredients, thoughtfully prepared
        </p>
      </div>
    </header>
  );
}
