#!/bin/bash
rm -rf dist
yarn build
cd dist
tar czvf /Users/markvasile/Code/CodeAwareness/vscode.panel.tgz .
cd ..
echo "copying files..."
scp -i ~/.ssh/caapi.pem /Users/markvasile/Code/CodeAwareness/vscode.panel.tgz ec2-user@54.176.98.28:/var/w3/vscode
echo "restarting web server..."
ssh -i ~/.ssh/caapi.pem ec2-user@54.176.98.28 'cd /var/w3/vscode; tar xzvf vscode.panel.tgz;'
echo "Deploy complete."
