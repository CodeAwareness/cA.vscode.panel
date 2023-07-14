#!/bin/bash
rm -rf dist
yarn build
cd dist
tar czvf /Users/markvasile/Code/CodeAwareness/vscode.panel.tgz .
cd ..
scp -i ~/.ssh/micro-usa.pem ../vscode.panel.tgz ec2-user@3.101.56.197:/var/w3/vscode
ssh -i ~/.ssh/micro-usa.pem ec2-user@3.101.56.197 'cd /var/w3/vscode; tar xzvf vscode.panel.tgz;'
