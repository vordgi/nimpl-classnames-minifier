import path from 'path';
import fs from 'fs';
import type { Config } from './types/plugin';
import { CODE_VERSION } from './constants/configuration';

const readManifest = (manifestPath: string) => {
    try {
        const prevData = fs.readFileSync(manifestPath, { encoding: 'utf-8' });
        return JSON.parse(prevData) as Config & { version?: string };
    } catch {
        return {};
    }
}

const validateDist = (pluginOptions: Config, nextDistDir: string) => {
    const manifestDir = path.join(nextDistDir, 'cache/ncm-meta');
    const manifestPath = path.join(manifestDir, 'manifest.json');
    let isImpreciseDist = false;

    if (fs.existsSync(manifestPath)) {
        const prevData = readManifest(manifestPath);
        if (
            prevData.prefix !== pluginOptions.prefix
            || prevData.reservedNames?.some(name => !pluginOptions.reservedNames?.includes(name))
            || prevData.reservedNames?.length !== pluginOptions.reservedNames?.length
            || prevData.templateString !== pluginOptions.templateString
            || prevData.type !== pluginOptions.type
            || prevData.version !== CODE_VERSION
        ) {
            isImpreciseDist = true;
        }
    } else if (fs.existsSync(path.join(nextDistDir, 'package.json'))) {
        isImpreciseDist = true;
    }
    if (isImpreciseDist) {
        console.log('next-classnames-minifier: Changes found in package configuration. Cleaning the dist folder...')
        fs.rmSync(nextDistDir, { recursive: true, force: true });
    }
    if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify({ ...pluginOptions, version: CODE_VERSION }), { encoding: 'utf-8' });
}

export default validateDist;
