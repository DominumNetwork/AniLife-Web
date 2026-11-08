const fs = require('fs');
const path = require('path');

const TARGET_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.html'];
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage'];

function stripComments(content) {
    let result = '';
    let i = 0;
    let inString = false;
    let quoteChar = '';
    let inLineComment = false;
    let inBlockComment = false;
    let escaped = false;

    while (i < content.length) {
        let char = content[i];
        let nextChar = content[i + 1] || '';

        if (inLineComment) {
            if (char === '\n') {
                inLineComment = false;
                result += char;
            }
            i++;
            continue;
        }

        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                i += 2;
                continue;
            }
            if (char === '\n') {
                result += '\n';
            }
            i++;
            continue;
        }

        if (inString) {
            result += char;
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === quoteChar) {
                inString = false;
            }
            i++;
            continue;
        }

        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            quoteChar = char;
            result += char;
            i++;
            continue;
        }

        if (char === '/' && nextChar === '/') {
            inLineComment = true;
            i += 2;
            continue;
        }

        if (char === '/' && nextChar === '*') {
            inBlockComment = true;
            i += 2;
            continue;
        }

        if (char === '<' && content.substr(i, 4) === '<!--') {
            i += 4;
            while (i < content.length && content.substr(i, 3) !== '-->') {
                i++;
            }
            if (i < content.length) i += 3;
            continue;
        }

        result += char;
        i++;
    }

    return result;
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORE_DIRS.includes(entry.name)) {
                processDirectory(fullPath);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (TARGET_EXTENSIONS.includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const cleaned = stripComments(content);
                    if (content !== cleaned) {
                        fs.writeFileSync(fullPath, cleaned, 'utf8');
                        console.log(`[Cleaned] ${fullPath}`);
                    }
                } catch (err) {
                    console.error(`[Error] Processing ${fullPath}:`, err.message);
                }
            }
        }
    }
}

console.log('Starting comment removal across the project...');
processDirectory(process.cwd());
console.log('Done! All comments removed successfully.');
