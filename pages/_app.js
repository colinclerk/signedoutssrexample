import "../styles/globals.css";
import React from "react";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  ClerkLoaded,
} from "@clerk/clerk-react";
import { useRouter } from "next/router";

// Dummy components
const ApolloProviderWrapper = ({ children }) => <>{children}</>;
const ApolloProviderUnauthedWrapper = ({ children }) => <>{children}</>;
const RedirectToAuth = (props) => <RedirectToSignIn {...props} />;

// Add this helper to ensure <SignedOutSSR> stops rendering
// if Clerk loads and discovers the user is actually signed in
const SSRHelper = ({ setClerkLoaded }) => {
  React.useEffect(() => {
    setClerkLoaded(true);
  }, []);
  return null;
};
const SignedOutSSR = ({ guaranteedSignedOut, children }) => {
  const [clerkLoaded, setClerkLoaded] = React.useState(false);
  if (guaranteedSignedOut && (typeof window === "undefined" || !clerkLoaded)) {
    return (
      <>
        {children}
        <ClerkLoaded>
          <SSRHelper setClerkLoaded={setClerkLoaded} />
        </ClerkLoaded>
      </>
    );
  } else {
    return <SignedOut>{children}</SignedOut>;
  }
};

// Old SignedOutSSR
// const SignedOutSSR = ({ guaranteedSignedOut, children }) => {
//   if (guaranteedSignedOut) {
//     return <>{children}</>;
//   } else {
//     return <SignedOut>{children}</SignedOut>;
//   }
// };

/**
 * List pages you want to be publicly accessible, or leave empty if
 * every page requires authentication. Use this naming strategy:
 *  "/"              for pages/index.js
 *  "/foo"           for pages/foo/index.js
 *  "/foo/bar"       for pages/foo/bar.js
 *  "/foo/[...bar]"  for pages/foo/[...bar].js
 */
const privatePages = [];
const publicAndPrivatePages = ["/publicPrivate"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Dummy - remove this
  const WrappedComponent = Component;

  /**
   * If the current route is listed as public, render it directly.
   * Otherwise, use Clerk to require authentication.
   */
  return (
    <ClerkProvider
      frontendApi="clerk.b1mvy.zxnpf.lcl.dev"
      navigate={(to) => router.push(to)}
    >
      {privatePages.includes(router.pathname) ? (
        <>
          <SignedIn>
            <ApolloProviderWrapper>
              <WrappedComponent {...pageProps} />
            </ApolloProviderWrapper>
          </SignedIn>
          <SignedOut>
            <RedirectToAuth returnTo={router.asPath} />
          </SignedOut>
        </>
      ) : publicAndPrivatePages.includes(router.pathname) ? (
        <>
          <SignedIn>
            <ApolloProviderWrapper>
              <WrappedComponent {...pageProps} />
            </ApolloProviderWrapper>
          </SignedIn>
          <SignedOutSSR guaranteedSignedOut={pageProps.guaranteedSignedOut}>
            <ApolloProviderUnauthedWrapper>
              <WrappedComponent {...pageProps} />
            </ApolloProviderUnauthedWrapper>
          </SignedOutSSR>
        </>
      ) : (
        <div className="font-sans">
          <Component {...pageProps} />
        </div>
      )}
    </ClerkProvider>
  );
}

export default MyApp;
