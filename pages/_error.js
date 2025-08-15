export default function ErrorPage(){return null}
ErrorPage.getInitialProps=({res,err})=>({statusCode:res?.statusCode||err?.statusCode||404});
