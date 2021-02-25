import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <script src="https://kit.fontawesome.com/7be86f846f.js" crossOrigin="anonymous"></script>

                    <link rel="shortcut icon" href="favicon48px.png" type="image/png" />

                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Signika:wght@400;700&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />

                    <NextScript />
                </body>
            </Html>
        );
    }
}