import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" href="favicon48px.png" type="image/png" />

                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Signika:wght@400;700&display=swap" rel="stylesheet" />

                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body>
                    <Main />

                    <NextScript />
                </body>
            </Html>
        );
    }
}