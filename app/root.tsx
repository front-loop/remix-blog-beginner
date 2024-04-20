import { NextUIProvider } from '@nextui-org/react'
import { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import stylesheet from './tailwind.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export const meta: MetaFunction = () => [{ title: 'Remix Blog' }]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export default function App() {
  return (
    <div className="grid min-h-dvh grid-cols-[1fr_min(70ch,calc(100%_-_64px))_1fr] gap-x-8 pt-20">
      <Outlet />
    </div>
  )
}
