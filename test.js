import test from 'ava';
import { stdout, } from 'test-console';
import reporter from './';

const fixture = [
    {
        getFilename: () => "C:\\js\\warnings.js",
        getErrorList: () => [
            {
                rule: "requirePaddingNewLinesAfterBlocks",
                message: "requirePaddingNewLinesAfterBlocks: Missing newline after block",
                fixed: false,
                line: 238,
                column: 9,
            },
            {
                rule: "requireDollarBeforejQueryAssignment",
                message: "requireDollarBeforejQueryAssignment: jQuery identifiers must start with a $",
                fixed: false,
                line: 47,
                column: 18,
            }, ],
        getErrorCount: () => 2,
        isEmpty: () => false,
    }, {
        getFilename: () => "C:\\js\\more-warnings.js",
        getErrorList: () => [
            {
                rule: "disallowMultipleSpaces",
                message: "disallowMultipleSpaces: at most 1 spaces required between $ and (",
                fixed: false,
                line: 31,
                column: 26,
            },
            {
                rule: "disallowSpacesInCallExpression",
                message: "disallowSpacesInCallExpression: Illegal space before opening round brace",
                fixed: false,
                line: 31,
                column: 26,
            },            {
                rule: "disallowSpacesInsideParentheses",
                message: "disallowSpacesInsideParentheses: Illegal space after opening round bracket",
                fixed: false,
                line: 31,
                column: 29,
            },
        ],
        getErrorCount: () => 3,
        isEmpty: () => false,
    }, {
        getFilename: () => "C:\\js\\good.js",
        getErrorList: () => [],
        getErrorCount: () => 0,
        isEmpty: () => true,
    },
];

test('Given no results, logs nothing', (assert) => {
    const { restore, output, } = stdout.inspect();

    const results = [];
    reporter(results);

    restore();
    assert.is(output.join('').trim(), '');
});

test('Given results with no messages, logs nothing', (assert) => {
    const { restore, output, } = stdout.inspect();

    const results = [{
        getFilename: () => 'tmp/good.js',
        getErrorList: () => [],
        getErrorCount: () => 0,
        isEmpty: () => true,
    }, {
        getFilename: () => 'tmp/good2.js',
        getErrorList: () => [],
        getErrorCount: () => 0,
        isEmpty: () => true,
    }, ];
    reporter(results)

    restore();
    assert.is(output.join('').trim(), '');
});

test('Given results with warnings, logs warnings', (assert) => {
    const { restore, output, } = stdout.inspect();

    reporter(fixture);

    restore();
    assert.regex(output.join('').trim(), /##vso\[task\.logissue type=warning/);
});

test('Given results with 5 issues, logs 5 issues in valid format', (assert) => {
    const { restore, output, } = stdout.inspect();

    reporter(fixture);

    restore();

    assert.regex(output.join('').trim(), /^(?:##vso\[task\.logissue ((?:type|sourcepath|linenumber|columnnumber|code)=[^;]+;)+\][^\n]+(?:\n|$)){4,5}$/);
    assert.regex(output.join('').trim(), /^(?:##vso\[task\.logissue ((?:type|sourcepath|linenumber|columnnumber|code)=[^;]+;)+\][^\n]+(?:\n|$)){5,6}$/);
    assert.notRegex(output.join('').trim(), /^(?:##vso\[task\.logissue ((?:type|sourcepath|linenumber|columnnumber|code)=[^;]+;)+\][^\n]+(?:\n|$)){3,4}$/);
    assert.notRegex(output.join('').trim(), /^(?:##vso\[task\.logissue ((?:type|sourcepath|linenumber|columnnumber|code)=[^;]+;)+\][^\n]+(?:\n|$)){6,7}$/);
});
