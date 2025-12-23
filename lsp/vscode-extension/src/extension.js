const vscode = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient');

let client;

function activate(context) {
    console.log('Nixi extension is now active!');
    
    // Server configuration
    const serverModule = context.asAbsolutePath('../src/server.js');
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    const serverOptions = {
        run: { module: serverModule, transport: TransportKind.stdio },
        debug: { module: serverModule, transport: TransportKind.stdio, options: debugOptions }
    };
    
    // Client configuration
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'nixi' }],
        synchronize: {
            configurationSection: 'nixi',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.nixi')
        }
    };
    
    // Create and start the client
    client = new LanguageClient('nixi', 'Nixi Language Server', serverOptions, clientOptions);
    
    context.subscriptions.push(client.start());
}

function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

module.exports = {
    activate,
    deactivate
};