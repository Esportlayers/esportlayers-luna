import * as Sentry from '@sentry/react';
import App, { AppInitialProps } from 'next/app';
import Head from "next/head";

if (process.env.SENTRY_DSN && process.env.SENTRY_DSN.length > 0) {
    Sentry.init({dsn: process.env.SENTRY_DSN});
}

class MyApp extends App<AppInitialProps> {
	render() {
		const { Component, pageProps } = this.props;
		return <>
            <Head>
                <title>StreamDota Overlay Frame</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/shared/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/shared/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/shared/favicon-16x16.png" />
                <link rel="manifest" href="/shared/site.webmanifest" />
                <link rel="mask-icon" href="/shared/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/shared/favicon.ico" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="msapplication-config" content="/shared/browserconfig.xml" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <Sentry.ErrorBoundary fallback={"An error has occurred. This error was reported. Please try reloading the page!"}>
                <Component {...pageProps} />
            </Sentry.ErrorBoundary>
        </>;
	}
}

export default MyApp;
