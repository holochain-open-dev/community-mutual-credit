const { spawn } = require("child_process");

if (process.argv.length < 3)
  throw new Error(
    "You need to specify as a parameter the number of nodes to bootstrap"
  );

const numNodes = process.argv[2];

const processes = [];

processes.push(
  spawn("sim2h_server", [], {
    stdio: "inherit", // Will use process .stdout, .stdin, .stderr
  })
);

processes.push(
  spawn("holochain", ["-calice-conductor-config.toml"], {
    stdio: "inherit", // Will use process .stdout, .stdin, .stderr
  })
);

for (let i = 1; i < numNodes; i++) {
  processes.push("")

  processes.push(
    spawn(
      "cp ./alice-conductor-config.toml /tmp/" + i + "-conductor-config.toml",
      [],
      {
        stdio: "inherit", // Will use process .stdout, .stdin, .stderr
      }
    )
  );

  processes.push(
    spawn("holochain", [`-c/tmp/${i}-conductor-config.toml`], {
      stdio: "inherit", // Will use process .stdout, .stdin, .stderr
    })
  );

  processes.push(
    spawn(
      `WS_INTERFACE=ws://localhost:${8888 + i} webpack-dev-server`,
      ["--mode=development", `--port=${8000 + i}`],
      {
        stdio: "inherit", // Will use process .stdout, .stdin, .stderr
      }
    )
  );
}

process.on("exit", function () {
  for (const process of processes) process.kill();
});
