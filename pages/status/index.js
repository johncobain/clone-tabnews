import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <Status />
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function Status() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });
  let icon = "🟡";

  const hasError = !isLoading && error;
  const hasData = !isLoading && data;

  if (hasError) {
    icon = "🔴";
  } else if (hasData) {
    icon = "🟢";
  }

  return (
    <>
      <h1>Status {icon}</h1>
      {isLoading && "Carregando..."}
      {error && "Erro ao carregar dados"}
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  const hasError = !isLoading && error;
  const hasData = !isLoading && data;

  return <>{hasData && !hasError && <div>Última atualização: {updatedAtText}</div>}</>;
}

function DatabaseStatus() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>Conexões Abertas: {data.dependencies.database.opened_connections}</div>
        <div>Conexões Máximas: {data.dependencies.database.max_connections}</div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      {error && "Erro ao carregar dados"}
      {!error && databaseStatusInformation}
    </>
  );
}
