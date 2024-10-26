import type { NextConfig } from "next";
import classNamesMinifier from "@nimpl/classnames-minifier";

const withClassNamesMinifier = classNamesMinifier({
    prefix: "_",
});

const nextConfig: NextConfig = withClassNamesMinifier({
    /* config options here */
});

export default nextConfig;
