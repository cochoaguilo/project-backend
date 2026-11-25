import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Imports prefixed with src/ (e.g. src/utils/x) only resolve when the build rewrites tsconfig
// paths (nest build does). Plain tsc builds, such as Vercel's, keep them as-is
// and the app crashes on boot with "Cannot find module 'src/...'".
const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('source imports', () => {
  it('use relative paths, never the src/ prefix', () => {
    const offenders = sourceFiles(__dirname).filter((file) =>
      file !== __filename &&
      /from\s+['"]src\//.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
