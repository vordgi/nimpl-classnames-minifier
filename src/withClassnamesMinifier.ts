/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Configuration } from "webpack";
import type { Config } from "classnames-minifier/dist/lib/types/plugin";
import ClassnamesMinifier from "classnames-minifier";
import injectConfig from "./lib/injectConfig";
import path from "path";

type PluginOptions = Omit<Config, "cacheDir" | "distDir"> & { disabled?: boolean };

let classnamesMinifier: ClassnamesMinifier;

const withClassnameMinifier = (pluginOptions: PluginOptions = {}) => {
    return (nextConfig: any = {}) => {
        if (pluginOptions.disabled) return nextConfig;

        if (!classnamesMinifier) {
            const distDir = nextConfig?.distDir || ".next";
            const distDirAbsolute = path.join(process.cwd(), distDir);
            const cacheDir = path.join(distDirAbsolute, "cache/ncm");
            classnamesMinifier = new ClassnamesMinifier({
                prefix: pluginOptions.prefix,
                reservedNames: pluginOptions.reservedNames,
                distDir: distDirAbsolute,
                cacheDir,
            });
        }

        return {
            ...nextConfig,
            webpack: (config: Configuration, options: any) => {
                injectConfig({ classnamesMinifier }, config.module?.rules);

                if (typeof nextConfig.webpack === "function") {
                    return nextConfig.webpack(config, options);
                }

                return config;
            },
        };
    };
};

export default withClassnameMinifier;
