import * as Sentry from '@sentry/browser';
import App, { AppInitialProps } from 'next/app';
import { Integrations } from '@sentry/apm';

if (process.env.SENTRY_DSN && process.env.SENTRY_DSN.length > 0) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            new Integrations.Tracing(),
        ],
        tracesSampleRate: 0.5,
    });
}

class MyApp extends App<AppInitialProps> {
	render() {
		const { Component, pageProps } = this.props;
		return <Component {...pageProps} />;
	}
}

export default MyApp;
