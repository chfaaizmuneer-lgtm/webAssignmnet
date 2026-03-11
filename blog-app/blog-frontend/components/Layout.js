import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Head from 'next/head';

export default function Layout({ children, title, description }) {
  const pageTitle = title ? `${title} | The Blog` : 'The Blog — Ideas Worth Sharing';
  const pageDesc  = description || 'A modern platform for writers, thinkers, and creators.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
