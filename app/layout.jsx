import '@fontsource-variable/syne';
import '@fontsource-variable/inter';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '../styles/main.scss';
import Site from '@/components/Site';

export const metadata = {
  title: 'Sourabh Soni — Software Engineer',
  description: 'Portfolio of Sourabh Soni, a software engineer building reliable web applications with PHP, Laravel and Python.',
  openGraph: { title: 'Sourabh Soni — Software Engineer', description: 'Selected work, experience and contact.', type: 'website' },
};
export const viewport = { themeColor: '#05070d', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><Site>{children}</Site></body>
    </html>
  );
}
