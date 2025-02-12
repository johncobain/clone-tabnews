import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fethcStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fethcStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

const orquestrator = {
  waitForAllServices,
};
export default orquestrator;
