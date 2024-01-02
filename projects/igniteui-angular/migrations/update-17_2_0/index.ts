import type {
    Rule,
    SchematicContext,
    Tree
} from '@angular-devkit/schematics';
import { UpdateChanges } from '../common/UpdateChanges';

const version = '17.2.0';

export default (): Rule => async (host: Tree, context: SchematicContext) => {
    context.logger.info(`Applying migration for Ignite UI for Angular to version ${version}`);

    const update = new UpdateChanges(__dirname, host, context);

    const IG_COLORS = [
        'primary-',
        'primary-A',
        'secondary-',
        'secondary-A',
        'gray-',
        'surface-',
        'surface-A',
        'info-',
        'info-A',
        'success-',
        'success-A',
        'warn-',
        'warn-A',
        'error-',
        'error-A'
    ];

    const hslaColor = 'hsla\\(var\\(--ig-attr(\\d)00\\)\\)';

    for (const entryPath of update.sassFiles) {
        let content = host.read(entryPath).toString();
        IG_COLORS.forEach(color => {
            let prop = hslaColor.replace('attr', color);
            const regex = new RegExp(prop, 'g');
            if (regex.test(content)) {
                let newColor = prop.replace(/hsla\\\(var\\\(--ig-/g, 'var\(--ig-');
                newColor = newColor.replace('(\\d)', '$1');
                newColor = newColor.replace('\\)\\)', ')');
                content = content.replace(regex, newColor);
                host.overwrite(entryPath, content);
            }
        });
    }
};
