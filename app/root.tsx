import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { ProgressBar } from "./components/layout/progress-bar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    ENV: {
      WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || "6281234567890",
      CONTACT_EMAIL: process.env.CONTACT_EMAIL || "bonggxz@example.com",
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        <ProgressBar />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV || {})}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Error | BonggXz</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-500 mb-4">Oops!</h1>
            <p className="text-xl text-zinc-400">Something went wrong.</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
