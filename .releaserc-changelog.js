/* eslint no-undef: 0 */
module.exports = {
  branches: ['main', 'release/*'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        generateNotesCmd: [
          "printf '${nextRelease.notes}' | cat - CHANGELOG.md  > temp",
          'mv temp CHANGELOG.md',
          'git add CHANGELOG.md',
          "echo 'auto updated CHANGELOG for release ${nextRelease.version}\n please validate the content before committing to the git repository'",
          "echo 'To Create a new release branch, use command bellow\ngit checkout -b release/${nextRelease.version}'",
        ].join(' && '), // got this workaround from https://github.com/semantic-release/exec/issues/110#issuecomment-1356849764
      },
    ],
  ],
};
