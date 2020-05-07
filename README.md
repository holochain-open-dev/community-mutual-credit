# Holochain Community mutual-credit

## Developer setup

1. Clone this repository.
2. Initialize the submodules:

```bash
git submodule init
git submodule update
```

3. Go into nix-shell: `nix-shell`.
4. Go into the ui folder: `cd ui`.
5. Run `npm install`.
6. Start the holochain conductors and sim2h_server: `npm run hc:start`.
7. Open another terminal and go to the ui folder as well.
8. Run `npm start`.
9. If you want another agent, open another terminal and from the ui folder run `npm run start:bob`.