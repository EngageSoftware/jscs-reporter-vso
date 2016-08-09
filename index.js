/*eslint-env node*/

const _ = require('lodash');

function logIssue(issue) {
    const attributes = _.chain(_.toPairs(issue))
                        .map((pair) => ({ key: pair[0], value: pair[1], }))
                        .filter((pair) => pair.key !== 'message')
                        .filter((pair) => pair.value !== undefined)
                        .map((pair) => `${pair.key}=${pair.value};`)
                        .value();

    return `##vso[task.logissue ${attributes.join('')}]${issue.message}`;
}

module.exports = (results) => {
    const errorLines = _.chain(results)
                        .filter((result) => !result.isEmpty())
                        .flatMap((result) => _.chain(result.getErrorList())
                                              .map((error) => logIssue({
                                                  type: 'warning',
                                                  sourcepath: result.getFilename(),
                                                  linenumber: error.line,
                                                  columnnumber: error.column,
                                                  code: error.rule,
                                                  message: error.message,
                                              }))
                                              .value())
                        .value()
                        .join('\n');

    console.log(errorLines);
};
