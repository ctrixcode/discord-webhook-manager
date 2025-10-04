const fs = require('fs');
const path = require('path');

function extractModule(filePath) {
  // Extracts the module name from the file name, e.g., contactRequest.routes.test.ts -> ContactRequest
  const fileName = path.basename(filePath);
  const match = fileName.match(/([a-zA-Z0-9]+)\./);
  if (match) {
    // Capitalize first letter
    return match[1].charAt(0).toUpperCase() + match[1].slice(1);
  }
  return '';
}

class QAReporter {
  constructor(globalConfig, options) {
    this.tester = (options && options.tester) || 'QA';
    this.outputFile = (options && options.outputFile) || 'qa-test-log.csv';
  }

  onRunComplete(contexts, results) {
    const date = new Date().toISOString().split('T')[0];
    const header = [
      'Test ID',
      'Module',
      'Route / Function',
      'Type',
      'Expected',
      'Actual',
      'Status',
      'Tester',
      'Date',
      'Notes',
    ];
    const rows = [header.join(',')];

    let testCounter = 1;
    results.testResults.forEach(suite => {
      const module = extractModule(suite.testFilePath);
      const type = suite.testFilePath.includes('/integration/')
        ? 'Integration'
        : 'Unit';
      suite.testResults.forEach(test => {
        const testId = `TC_${String(testCounter).padStart(3, '0')}`;
        const routeOrFunction = `${test.title}`.trim();
        const expected = '';
        const actual =
          test.status === 'passed'
            ? 'As expected'
            : test.failureMessages.join(' | ') || 'Failed';
        const status = test.status === 'passed' ? '✅' : '❌';
        const notes = test.status === 'passed' ? '' : actual;
        rows.push(
          [
            testId,
            module,
            routeOrFunction,
            type,
            expected,
            actual.replace(/\n/g, ' '),
            status,
            this.tester,
            date,
            notes.replace(/\n/g, ' '),
          ]
            .map(v => `"${v}"`)
            .join(',')
        );
        testCounter++;
      });
    });

    fs.writeFileSync(this.outputFile, rows.join('\n'));
    console.log(`\nQA test log written to ${this.outputFile}`);
  }
}

module.exports = QAReporter;
