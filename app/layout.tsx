import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { EventProvider } from '@/lib/event-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planora - Unified Event Management Hub',
  description: 'Complete event management solution for organizers, attendees, and sponsors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <EventProvider>
          {children}
        </EventProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(){
                if(!window.UnicornStudio){
                  window.UnicornStudio={isInitialized:!1};
                  var i=document.createElement("script");
                  i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.31/dist/unicornStudio.umd.js";
                  i.onload=function(){
                    if(!window.UnicornStudio.isInitialized){
                      UnicornStudio.init();
                      window.UnicornStudio.isInitialized=true;
                    }
                  };
                  (document.head || document.body).appendChild(i);
                }
              }();
            `,
          }}
        />
      </body>
    </html>
  )
}

