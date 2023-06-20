/* eslint-disable quote-props,object-curly-spacing,quotes,comma-spacing,comma-dangle,key-spacing,object-property-newline */
export default {
  command: 'initWithData',
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
      "origin": "peer8/peer8.vscode",
      "root": "/Users/markvasile/Code/CodeAwareness/peer8.vscode",
      "changes": {
        "README.md": {},
        "src/config.js": {
          "users": [
            {
              "_id": "646d4bcb4177c25ce07eba16",
              "email": "hana@codeawareness.com",
              "createdAt": "2023-05-23T23:27:07.897Z",
              "updatedAt": "2023-05-24T01:00:57.861Z",
              "lang": "en"
            },
            {
              "_id": "646d4bef4177c25ce07eba1d",
              "email": "mark@codeawareness.com",
              "createdAt": "2023-05-23T23:27:43.514Z",
              "updatedAt": "2023-06-08T07:21:35.720Z",
              "lang": "en"
            }
          ],
          "file": {
            "_id": "646d4bcdb1b2e58afe4542dd",
            "file": "src/config.js",
            "repo": "646d4bcc4177c25ce07eba1b",
            "updatedAt": "2023-05-28T06:56:04.750Z",
            "changes": {
              "646d4bcb4177c25ce07eba16": {
                "sha": "474b04f18ed6928f4b799698a64b5f2cc43471ce",
                "lines": [
                  0,
                  2,
                  10,
                  14,
                  18,
                  35
                ],
                "s3key": "diffs/646d4bcb4177c25ce07eba16/peer8/peer8.vscode/src/config.js",
                "diffs": [
                  {
                    "range": {
                      "line": 0,
                      "len": 0,
                      "content": [
                        "// Something"
                      ]
                    },
                    "replaceLen": 1
                  },
                  {
                    "range": {
                      "line": 2,
                      "len": 0,
                      "content": [
                        "// We're using nginx on port 8886 to coordinate between API, Local Service, editor panel, etc."
                      ]
                    },
                    "replaceLen": 1
                  },
                  {
                    "range": {
                      "line": 10,
                      "len": 0,
                      "content": [
                        ""
                      ]
                    },
                    "replaceLen": 1
                  },
                  {
                    "range": {
                      "line": 14,
                      "len": 1,
                      "content": [
                        "// TODO: The maximum number of commit SHAs to compare from HEAD down",
                        "const MAX_NR_OF_SHA_TO_COMPARE = 5 // should probably be something like 200 commits"
                      ]
                    },
                    "replaceLen": 2
                  },
                  {
                    "range": {
                      "line": 18,
                      "len": 1,
                      "content": [
                        "const LOG_LEVEL = process.env.LOG_LEVEL || 'debug' // one of ['verbose', 'debug', 'error']"
                      ]
                    },
                    "replaceLen": 1
                  },
                  {
                    "range": {
                      "line": 35,
                      "len": 1,
                      "content": []
                    },
                    "replaceLen": 0
                  }
                ]
              },
              "646d4bef4177c25ce07eba1d": {
                "sha": "474b04f18ed6928f4b799698a64b5f2cc43471ce",
                "lines": [
                  18,
                  35
                ],
                "s3key": "diffs/646d4bef4177c25ce07eba1d/peer8/peer8.vscode/src/config.js",
                "diffs": [
                  {
                    "range": {
                      "line": 18,
                      "len": 1,
                      "content": [
                        "const LOG_LEVEL = process.env.LOG_LEVEL || 'debug' // one of ['verbose', 'debug', 'error']"
                      ]
                    },
                    "replaceLen": 1
                  },
                  {
                    "range": {
                      "line": 35,
                      "len": 1,
                      "content": []
                    },
                    "replaceLen": 0
                  }
                ]
              }
            }
          },
          "alines": [
            0,
            2,
            10,
            14,
            18,
            35
          ]
        },
        "src/extension.js": {},
        "tags": {}
      },
      "peers": {
        "646d4bcb4177c25ce07eba16": {
          "_id": "646d4bcb4177c25ce07eba16",
          "email": "hana@codeawareness.com",
          "createdAt": "2023-05-23T23:27:07.897Z",
          "updatedAt": "2023-05-24T01:00:57.861Z",
          "lang": "en"
        }
      },
      "activePath": "/Users/markvasile/Code/CodeAwareness/peer8.vscode/src/config.js",
      "branch": "feature/teams",
      "branches": [
        "feature/teams",
        "light",
        "main",
        "windows"
      ],
      "head": "474b04f18ed6928f4b799698a64b5f2cc43471ce",
      "cSHA": "474b04f18ed6928f4b799698a64b5f2cc43471ce"
    },
  },
}
