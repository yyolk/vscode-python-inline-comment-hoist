// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Register the command
    let disposable = vscode.commands.registerCommand('python-inline-comment-hoist.hoistInlineComments', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fullText = document.getText();
            const updatedText = hoistInlineComments(fullText);
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), updatedText);
            vscode.workspace.applyEdit(edit);
        }
    });

	context.subscriptions.push(disposable);
}

function hoistInlineComments(code: string): string {
    // Your JavaScript function logic here from the previous example
    // Convert it to work within this TypeScript context if needed
	let lines = code.split('\n');
    let updatedLines = [];

    for (let line of lines) {
        let commentIndex = line.indexOf('#');
        if (commentIndex !== -1) {
            // Determine the indentation of the original line
            // let indentation = line.slice(0, (line.match(/^\s*/)?.[0] || '' ).length);
            let indentation = line.match(/^\s*/)?.[0] || '';
            
            let codePart = line.slice(0, commentIndex).trimEnd();
            let commentPart = line.slice(commentIndex);

            if (codePart) {
                // Add the comment on a new line with correct indentation
                updatedLines.push(`${indentation}${commentPart.trim()}`);
                // Add the code part with the same indentation as before the comment
                updatedLines.push(`${indentation}${codePart.trimStart()}`);
            } else {
                // If no code, just keep the comment line as it is
                updatedLines.push(line);
            }
        } else {
            updatedLines.push(line);
        }
    }
    return updatedLines.join('\n');
}

// This method is called when your extension is deactivated
export function deactivate() {}