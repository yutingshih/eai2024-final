# eai2024-final
Final Project of EAI 2024 Fall

# Quick start

In `eai2024-final` directory, run `make` to install Python virtual environment and necessary packages.
It will also build the bundle of the Reactjs frontend.

To activate the debug server/ui in two terminals respectively, run:

```shell
$ make debug-server
$ make debug-ui
```

**Note**: The UI compilation might be **SLOW** and take some time (10 ~ 15s, depend on your computer).

To activate the production mode, run:

```shell
$ make serve
```

To stop the production mode, run:

```shell
$ make serve-terminate
```

The UI bundling takes some time too, however, since it is done, the reloading will be rapid.

The webpage can be seen at http://127.0.0.1:3000
