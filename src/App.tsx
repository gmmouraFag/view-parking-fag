import { ParkingMap } from "./ParkingMap";
import { useParking } from "./useParking";

function formatTime(value: string | null) {
  return value
    ? new Date(value).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
}

export default function App() {
  const { data, updated, loading, connected } = useParking();
  const summary = data?.summary;
  const freeAccessible =
    data?.spots.filter((s) => s.accessible && s.status === "FREE").length || 0;
  const totalAccessible = data?.spots.filter((s) => s.accessible).length || 0;
  const sectors = [...new Set(data?.spots.map((s) => s.sector) || [])].sort();
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="FAG Estacionamento">
          <span className="brand-icon">P</span>
          <span>
            <strong>FAG</strong>
            <small>ESTACIONAMENTO</small>
          </span>
        </a>
        <div className="topbar-right">
          <span>Campus · Estacionamento</span>
          <span className="local-tag">Rede local</span>
        </div>
      </header>
      <main>
        <div className="page-intro">
          <div>
            <div className="eyebrow">MOBILIDADE NO CAMPUS</div>
            <h1>
              Seu próximo lugar
              <br />
              <span>começa aqui.</span>
            </h1>
            <p>
              Veja a disponibilidade e encontre uma vaga antes de estacionar.
            </p>
          </div>
          <div className="update-info">
            <span
              className={`status-dot ${connected && data?.monitoringActive ? "live" : ""}`}
            />
            <div>
              <strong>
                {connected && data?.monitoringActive
                  ? "Monitoramento ativo"
                  : updated
                    ? "Última leitura disponível"
                    : "Aguardando primeira leitura"}
              </strong>
              <span>Atualizado às {formatTime(updated)}</span>
            </div>
          </div>
        </div>
        <section className="metrics" aria-label="Indicadores de vagas">
          <div className="metric available">
            <span className="metric-label">
              <i />
              Vagas livres
            </span>
            <strong>
              {summary?.free ?? "—"}
              <small>disponíveis agora</small>
            </strong>
            <span className="metric-bottom">Um lugar para você</span>
          </div>
          <div className="metric">
            <span className="metric-label">Vagas ocupadas</span>
            <strong>
              {summary?.occupied ?? "—"}
              <small>em utilização</small>
            </strong>
            <div className="occupancy-track">
              <span style={{ width: `${summary?.occupancyPercent ?? 0}%` }} />
            </div>
            <span className="metric-bottom">
              {summary?.occupancyPercent != null
                ? `${summary.occupancyPercent}% de ocupação das vagas conhecidas`
                : "Ocupação ainda não determinada"}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Total monitorado</span>
            <strong>
              {summary?.total ?? "—"}
              <small>vagas cadastradas</small>
            </strong>
            <span className="metric-bottom">
              {summary?.unknown ?? "—"} com estado desconhecido
            </span>
          </div>
        </section>
        <div className="content-grid">
          <div>
            {data?.spots.length ? (
              <ParkingMap spots={data.spots} />
            ) : (
              <section className="empty-state" aria-live="polite">
                <span className="empty-icon">P</span>
                <h2>
                  {loading
                    ? "Carregando estacionamento"
                    : data
                      ? "Nenhuma vaga cadastrada"
                      : "Aguardando monitoramento"}
                </h2>
                <p>
                  {data
                    ? "As vagas aparecerão após a configuração do monitoramento."
                    : "A disponibilidade será apresentada após a primeira leitura."}
                </p>
              </section>
            )}
          </div>
          <aside className="side-panel">
            <section className="sector-card">
              <span className="eyebrow">ORIENTE-SE</span>
              <h2>
                Disponibilidade
                <br />
                por setor
              </h2>
              {sectors.map((sector) => {
                const spots = data!.spots.filter((s) => s.sector === sector);
                const free = spots.filter((s) => s.status === "FREE").length;
                return (
                  <div className="sector-row" key={sector}>
                    <span className="sector-badge">{sector}</span>
                    <div>
                      <strong>Setor {sector}</strong>
                      <span>{spots.length} vagas monitoradas</span>
                    </div>
                    <strong className="sector-free">
                      {free}
                      <small>livres</small>
                    </strong>
                  </div>
                );
              })}
              {!sectors.length && (
                <p>Setores disponíveis após a primeira leitura.</p>
              )}
            </section>
            <section className="accessibility-card">
              <span className="wheelchair" aria-hidden="true">
                ♿
              </span>
              <h2>
                Um campus
                <br />
                para todos.
              </h2>
              <p>
                Vagas reservadas para pessoas com deficiência estão
                identificadas no mapa.
              </p>
              <div>
                <strong>{data ? freeAccessible : "—"}</strong>
                <span>
                  livres de {data ? totalAccessible : "—"} vagas acessíveis
                </span>
              </div>
            </section>
            <p className="side-note">
              Respeite a sinalização e as vagas reservadas.
            </p>
          </aside>
        </div>
        <footer className="page-footer">
          <span>FAG · Sistema de monitoramento de estacionamento</span>
          <span>Atualização automática a cada 15 segundos</span>
        </footer>
      </main>
    </div>
  );
}
