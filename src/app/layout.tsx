import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'
// import { Web3Provider } from '@/components/providers/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tokenized Campus Economy',
  description: 'A blockchain-powered campus token economy platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Temporarily disabled Web3Provider to fix dependency issues */}
          {/* <Web3Provider> */}
            <main className="min-h-screen bg-background">
              {children}
            </main>
          {/* </Web3Provider> */}
        </AuthProvider>
      </body>
    </html>
  )
}