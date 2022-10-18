#!/bin/bash
# yarn build
cd dist
tar czvf /Users/markvasile/Code/CodeAwareness/vscode.panel.tgz .
cd ..
scp -i ~/.ssh/tokyo-dev.pem ../vscode.panel.tgz ec2-user@13.114.87.226:/var/w3/vscode
ssh -i ~/.ssh/tokyo-dev.pem ec2-user@13.114.87.226 'cd /var/w3/vscode; tar xzvf vscode.panel.tgz;'
