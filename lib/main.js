/* --------------------------------------------------------------------------------------------
 * Copyright (c) Chris Hansen. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const cp = require('child_process')
const https = require('https')
const {AutoLanguageClient} = require('atom-languageclient')

async function checkVersion() {
  function compareSymantic(ver, rec_ver) {
    for (var index = 0; index < rec_ver.length; ++index) {
      if (parseInt(ver[index]) < parseInt(rec_ver[index])) {
        return true
      } else if (parseInt(ver[index]) > parseInt(rec_ver[index])) {
        return false
      }
    }
    return false
  }
  async function checkVersionLocal(rec_ver_str="0.7.1") {
    const childProcess = cp.spawn(atom.config.get("ide-fortran.fortlsPath"), ["--version"])
    childProcess.stdout.on('data', (data) => {
      let ver_str = data.toString().trim()
      if (compareSymantic(ver_str.split("."), rec_ver_str.split("."))) {
        atom.notifications.addWarning(`IDE-FORTRAN: A newer version (${rec_ver_str}) of "fortls" is available.`,
        {
          dismissable: true,
          buttons: [{
            text: "Disable warning",
            onDidClick: () => atom.workspace.open("atom://config/packages/ide-fortran")
          }],
          description: "Please update `fortran-language-server` on your system. You may disable this warning in settings."
        })
      }
    })
  }
  https.get('https://pypi.org/pypi/fortran-language-server/json', (resp) => {
    let data = ''
    // A chunk of data has been recieved
    resp.on('data', (chunk) => { data += chunk } )
    // The whole response has been received, check version
    resp.on('end', () => {
      try {
        let package_data = JSON.parse(data)
        checkVersionLocal(package_data.info.version)
      } catch (e) {
        checkVersionLocal()
      }
    })
  }).on("error", (err) => { checkVersionLocal() } )
}

class FortranLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.fortran.free', 'source.fortran.fixed' ] }
  getLanguageName () { return 'Fortran' }
  getServerName () { return 'fortls' }

  constructor(serializedState) {
    super(serializedState)
    if (atom.config.get("ide-fortran.displayVerWarning")) { checkVersion() }
  }

  async startServerProcess (projectPath) {
    if (atom.config.get("ide-fortran.debug")) { atom.notifications.addInfo("IDE-FORTRAN: Starting fortls") }
    let args = []
    if (!atom.config.get("ide-fortran.include_symbol_mem")) { args.push("--symbol_skip_mem") }
    if (atom.config.get("ide-fortran.incremental_sync")) { args.push("--incrmental_sync") }
    if (!atom.config.get("ide-fortran.autocomplete_no_prefix")) { args.push("--autocomplete_no_prefix") }
    if (atom.config.get("ide-fortran.lowercase_intrinsics")) { args.push("--lowercase_intrinsics") }
    if (atom.config.get("ide-fortran.use_signature_help")) { args.push("--use_signature_help") }
    if (atom.config.get("ide-fortran.variable_hover")) { args.push("--variable_hover") }
    const childProcess = cp.spawn(atom.config.get("ide-fortran.fortlsPath"), args,
    {
      cwd: projectPath
    })
    childProcess.on("error", err =>
      atom.notifications.addError("Unable to start the FORTRAN language server.",
      {
        dismissable: true,
        buttons: [{
          text: "Install Instructions",
          onDidClick: () => atom.workspace.open("atom://config/packages/ide-fortran")
        }],
        description: "This can occur if you do not have Python installed or if it is not in your path.\n\n Also, make sure to install `fortls` by running:\n```\npip install fortran-language-server\n```"
      })
    )
    childProcess.on('exit', exitCode => {
      if (exitCode == 0 || exitCode == null) {
        if (atom.config.get("ide-fortran.debug")) { atom.notifications.addInfo("IDE-FORTRAN: Stopping fortls") }
      } else {
        atom.notifications.addError('IDE-FORTRAN: language server stopped unexpectedly.',
        {
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
