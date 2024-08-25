import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <footer className="mt-10 bg-primary py-1 text-primary-foreground">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold">Eudaimonia</h1>
        </Link>
        <p>
          Made with 💻 by{" "}
          <Link
            target="_blank"
            className="inline-flex items-center justify-between gap-1 font-bold"
            href="https://magedibrahim.vercel.app/"
          >
            <span className="underline">Maged Ibrahim</span>
            <Image
              src="/maged.ico"
              alt="Maged Ibrahim"
              width={30}
              height={30}
              className="inline"
            />
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
