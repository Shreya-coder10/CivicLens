import React from "react";

function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>
      <p>We are sorry, an unexpected error occurred.</p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
