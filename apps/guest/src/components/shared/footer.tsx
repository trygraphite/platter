import Link from "next/link";
import Container from "./container";

function Footer() {
  return (
    <footer className="bg-white h-12 relative">
      <Container>
        <div className="h-full flex items-center justify-center">
          <Link
            href="https://platterhq.com"
            className="text-sm text-muted-foreground hover:text-gray-600"
          >
            Powered by <span className="font-bold">platter</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
