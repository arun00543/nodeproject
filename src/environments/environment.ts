// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl:"https://demo.xyloinc.com/test-tm-api"
  // apiUrl:"http://106.51.152.163:9004/tm"
  //  apiUrl:"http://localhost:9004/tm"
// apiUrl:"http://127.0.0.1:34909/tm"  // Kubernetes port
  // apiUrl:"http://192.168.0.112:9004/tm"
  //  apiUrl:"http://localhost:9004/tm"  // pmo
    // apiUrl:"http://192.168.29.121:9004/tm"   // praveen
  // apiUrl:"http://192.168.29.221:9004/tm"  // deepak
      // apiUrl:"http://localhost:9044/tm"
};
