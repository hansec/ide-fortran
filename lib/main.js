const cp = require('child_process')
const shellEnv = require("shell-env")
const {AutoLanguageClient} = require('atom-languageclient')

class FortranLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.fortran.free', 'source.fortran.fixed' ] }
  getLanguageName () { return 'Fortran' }
  getServerName () { return 'fortls' }

  async startServerProcess (projectPath) {
    if (atom.config.get("ide-fortran.debug")) {
      atom.notifications.addInfo("IDE-FORTRAN: Starting fortls")
    }
    let args = []
    if (!atom.config.get("ide-fortran.include_symbol_mem")) {
      args.push("--symbol_skip_mem")
    }
    if (atom.config.get("ide-fortran.incremental_sync")) {
      args.push("--incrmental_sync")
    }
    const env = await shellEnv()
    const childProcess = cp.spawn(atom.config.get("ide-fortran.fortlsPath"), args,
    {
      cwd: projectPath,
      env: env
    })
    childProcess.on("error", err =>
      atom.notifications.addError(
        "Unable to start the FORTRAN language server.",
        {
          dismissable: true,
          buttons: [
            {
              text: "Install Instructions",
              onDidClick: () =>
                atom.workspace.open("atom://config/packages/ide-fortran")
            }
          ],
          description:
            "This can occur if you do not have Python installed or if it is not in your path.\n\n Also, make sure to install `fortls` by running:\n```\npip install fortran-language-server\n```"
        }
      )
    )
    childProcess.on('exit', exitCode => {
        if (exitCode == 0 || exitCode == null) {
          if (atom.config.get("ide-fortran.debug")) {
            atom.notifications.addInfo("IDE-FORTRAN: Stopping fortls")
          }
        } else {
          atom.notifications.addError('IDE-FORTRAN language server stopped unexpectedly.', {
            dismissable: true,
            description: this.processStdErr != null ? `<code>${this.processStdErr}</code>` : `Exit code ${exitCode}`
          })
        }
      })
    if (atom.config.get("ide-fortran.debug")) {
      childProcess.stderr.on('data', (data) => {
        console.log(`SERVER(fortls)-stderr: ${data}`);
      })
    }
    return childProcess
  }
}

module.exports = new FortranLanguageClient()
