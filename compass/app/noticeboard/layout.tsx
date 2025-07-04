import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticeboard',
};


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className={`antialiased relative min-h-screen p-2`}>
            {children}
        </div>
  );
}