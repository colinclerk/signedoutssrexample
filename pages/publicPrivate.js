import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <meta name="test" content="test" />
      </Head>
      This page should SSR when signed out.
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      guaranteedSignedOut: !ctx.req.cookies.__session,
    },
  };
}
