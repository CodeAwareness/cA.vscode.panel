/* eslint-disable quote-props,object-curly-spacing,quotes,comma-spacing,comma-dangle,key-spacing,object-property-newline */
export default {
  command: 'setup:init-data',
  data: {
    "user":{"alias":"","_id":"608d6e5e97587524d0f78093","email":"hana@peer8.com","avatar":"https://peer8.com/peer8-user.png","createdAt":"2021-05-01T15:06:06.961Z","updatedAt":"2021-05-22T04:43:50.679Z","lang":"en"},"tokens":{"access":{"token":"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDhkNmU1ZTk3NTg3NTI0ZDBmNzgwOTMiLCJpYXQiOjE2MjE3NTY1NDMsImV4cCI6MTYyMTc1ODM0MywiYXVkIjoiYXBpLnBlZXI4LmNvbSIsImlzcyI6InNlY3VyaXR5LnBlZXI4LmNvbSJ9.kHxmEMlX9WnPIr41I4naG0QhJ6FiRr4rVvzpO1WP0tkRk1DNgf-z6hdsxC4vKX_c","expires":"2021-05-23T08:25:43.233Z"},"refresh":{"token":"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDhkNmU1ZTk3NTg3NTI0ZDBmNzgwOTMiLCJpYXQiOjE2MjE3NTY1NDMsImV4cCI6MTYyNDM0ODU0MywiYXVkIjoiYXBpLnBlZXI4LmNvbSIsImlzcyI6InNlY3VyaXR5LnBlZXI4LmNvbSJ9.xu6qnZPuaaQTFbeBeKbpo8pWSHsmTVlBDf2oeteuiUIv8_KA4Ybjn_wTihOjtpZV","expires":"2021-06-22T07:55:43.233Z"}},
    colorTheme: 2,
    mode: 'share',
    invites: [
      { splitOrigin: 'https://git.peer8.com/sdf1y398498e/peer8-com', group: 'Internal Review' },
      { splitOrigin: 'https://git.peer8.com/sdf1y398498e/codeawareness-cbhuqy39rtrysgh', group: 'External Audit' },
      { splitOrigin: 'https://git.peer8.com/sdf1y398498e/codeawareness-893uhrfsdnjd019', group: 'Testers 01' },
      { splitOrigin: 'https://git.peer8.com/sdf1y398498e/codeawareness-mkouhosei', group: 'Testers 02' },
      { splitOrigin: 'https://git.peer8.com/sdf1y398498e/codeawareness-blog123', group: 'Testers 03' },
    ],
    activeProject: {
      "name": "peer8.vscode",
      "origin": "github.com:peer8/peer8.vscode",
      "root": "/Users/markvasile/Code/CodeAwareness/peer8.vscode",
      "activePath": "src/config.js",
      "cSHA": "474b04f18ed6928f4b799698a64b5f2cc43471ce",
      "branch": "feature/teams",
      "head": "474b04f18ed6928f4b799698a64b5f2cc43471ce",
      "file": {
        "_id": "64ca0c3f4210eece0a555cae",
        "file": "src/config.js",
        "repo": "64ca0c3dd086cc7c3754b3b0",
        "updatedAt": "2023-08-18T21:49:33.527Z",
        "changes": {
          "64c37649d45282f987887ac5": {
            "sha": "aa97e87e832ef6c4f5b238157ef23e222959cda5",
            "lines": [
              [ 8, -2, 3 ],
              [ 13, -2, 0 ],
              [ 19, -1, 1 ]
            ],
            "s3key": "diffs/64c37649d45282f987887ac5/github.com:peer8/peer8.vscode/src/config.js"
          },
          "64c3761cd45282f987887abe": {
            "sha": "aa97e87e832ef6c4f5b238157ef23e222959cda5",
            "lines": [
              [ 3, -1, 1 ],
              [ 8, -2, 4 ],
              [ 17, 0, 3 ],
              [ 25, -1, 1 ]
            ],
            "s3key": "diffs/64c3761cd45282f987887abe/github.com:peer8/peer8.vscode/src/config.js"
          }
        }
      },
      "branches": [
        "diffs-test",
        "feature/teams",
        "light",
        "main",
        "windows"
      ],
      "users": [
        {
          "_id": "64c3761cd45282f987887abe",
          "email": "uno@codeawareness.com",
          "createdAt": "2023-07-28T08:02:36.973Z",
          "updatedAt": "2023-08-18T21:13:32.846Z",
          "lang": "en"
        },
        {
          "_id": "64c37649d45282f987887ac5",
          "email": "mark@codeawareness.com",
          "createdAt": "2023-07-28T08:03:21.880Z",
          "updatedAt": "2023-08-15T04:57:36.859Z",
          "lang": "en"
        }
      ],
      "tree": [
        "src/config.js",
        "tags",
        "README.md"
      ],
      "hl": [ 8, 9, 10, 11, 15, 24 ],
    },
    fileContext: {
      _id: "64c37649dt5282f9g7887ac5",
      user: "84c3h649dt5382f927887ac5",
      repo: "91c37649d352a2f9g7887ac5",
      file: "README.md",
      lines: [
        { line: 2, context: [ 'security', 'communication' ]},
        { line: 8, context: [ 'performance' ]},
        { line: 12, context: [ 'performance', 'UX-tips' ]},
      ],
      updatedAt: '2023-07-28T08:03:21.880Z',
      createdAt: '2023-07-28T08:03:21.880Z',
    },
    projectContext: [
      { file: 'README.md', context: ['communication', 'performance', 'security', 'UX-tips']},
      { file: 'src/controllers/user.ctrl.ts', context: ['security', 'UX-flaky']},
    ],
  },
}
