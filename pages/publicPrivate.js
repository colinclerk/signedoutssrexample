import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <meta name="test" content="test" />
      </Head>
      This page should SSR
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      guaranteedSignedOut: !ctx.req.cookies.ajs_user_id,
    },
  };
}
