# IDE-FORTRAN package
[![macOS Build Status](https://travis-ci.org/hansec/ide-fortran.svg?branch=master)](https://travis-ci.org/hansec/ide-fortran)
[![Dependency Status](https://david-dm.org/hansec/ide-fortran.svg)](https://david-dm.org/hansec/ide-fortran)
[![Package version](https://img.shields.io/apm/v/ide-fortran.svg)](https://atom.io/packages/ide-fortran)
[![Plugin installs](https://img.shields.io/apm/dm/ide-fortran.svg)](https://atom.io/packages/ide-fortran)

FORTRAN language support for Atom-IDE, powered by the [FORTRAN Language Server](https://github.com/hansec/fortran-language-server).

![Screen shot of IDE-FORTRAN](https://raw.githubusercontent.com/hansec/ide-fortran/master/images/screenshot.png)

## Early access

[IDE functionality in Atom](https://ide.atom.io/) is currently new and this package and
its [language server](https://github.com/hansec/fortran-language-server) are in early release states.

## Requirements
This package requires the following packages to be installed:
 * [atom-ide-ui](https://atom.io/packages/atom-ide-ui)
 * [language-fortran](https://atom.io/packages/language-fortran)

Additionally, you must have [Python](https://www.python.org/) and the
[FORTRAN Language Server](https://github.com/hansec/fortran-language-server) installed
on your system.

This package has been tested and *should* work on :apple: Mac OSX and :penguin: Linux.
Windows may work as well, but has not yet been tested.

## Features

* Auto completion
* Document outline
* Go to definition
* Hover

See [FORTRAN Language Server](https://github.com/hansec/fortran-language-server) for examples and more details.

**Note:** If you are already using the [autocomplete-fortran](https://atom.io/packages/autocomplete-fortran) package
disable it or you will see multiple copies of suggestions in auto completion.

## Configuration

See the [fortran-language-server README](https://github.com/hansec/fortran-language-server/blob/master/README.rst) for
information on project specific configuration settings.

## Bug reports
Note that most bugs observed with this package are actually related to the upstream
[fortran-language-server](https://github.com/hansec/fortran-language-server). Unless you believe the error
you observe is directly related to Atom please submit issues to the
[upstream repo](https://github.com/atom/fortran-language-server/issues/new). When filing bugs please
provide example code to reproduce the observed issue if possible.

## License
MIT License. See [the license](LICENSE.md) for more details.

--------

If you *really* like [ide-fortran](https://atom.io/packages/ide-fortran) you can <a href='https://ko-fi.com/A1085MY' target="_blank"><img height='25' style='border:0px;height:25px;' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=b' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> or a :beer: to say thanks.
