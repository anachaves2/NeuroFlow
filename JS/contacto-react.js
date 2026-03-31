function ContactoApp() {
  const STORAGE_KEY = "neuroflow_contacts_v1";

  const [form, setForm] = React.useState({
    nome: "",
    motivo: "Informação",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [lista, setLista] = React.useState([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setLista(raw ? JSON.parse(raw) : []);
    } catch {
      setLista([]);
    }
  }, []);

  function setField(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.email.trim()) e.email = "Email obrigatório";
    else if (!isEmail(form.email)) e.email = "Email inválido";
    if (!form.telefone.trim()) e.telefone = "Telefone obrigatório";
    if (!form.mensagem.trim() || form.mensagem.trim().length < 10) e.mensagem = "Mensagem mín. 10 caracteres";
    return e;
  }

  const errors = validar();

  function submit(ev) {
    ev.preventDefault();
    if (Object.keys(errors).length) return;

    const novo = {
      ...form,
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
    };

    const next = [novo, ...lista];
    setLista(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setForm({ nome: "", motivo: "Informação", email: "", telefone: "", mensagem: "" });
  }

  function apagar(id) {
    const next = lista.filter(x => x.id !== id);
    setLista(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="contact-react">
      <form className="card form" onSubmit={submit} noValidate>
        <h2>Contacta-nos</h2>

        <div className="grid">
          <label>
            Nome
            <input value={form.nome} onChange={e => setField("nome", e.target.value)} />
            {errors.nome && <span className="error">{errors.nome}</span>}
          </label>

          <label>
            Motivo
            <select value={form.motivo} onChange={e => setField("motivo", e.target.value)}>
              <option>Informação</option>
              <option>Suporte</option>
              <option>Feedback</option>
              <option>Outro</option>
            </select>
          </label>

          <label>
            Email
            <input value={form.email} onChange={e => setField("email", e.target.value)} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>

          <label>
            Telefone
            <input value={form.telefone} onChange={e => setField("telefone", e.target.value)} />
            {errors.telefone && <span className="error">{errors.telefone}</span>}
          </label>
        </div>

        <label>
          Mensagem
          <textarea rows="5" value={form.mensagem} onChange={e => setField("mensagem", e.target.value)} />
          {errors.mensagem && <span className="error">{errors.mensagem}</span>}
        </label>

        <div className="actions">
          <button type="submit">Guardar</button>
        </div>
      </form>

      <div className="card saved">
        <h3>Registos guardados</h3>
        {!lista.length ? (
          <p className="muted">Ainda não há registos.</p>
        ) : (
          <ul className="saved-list">
            {lista.map(s => (
              <li key={s.id} className="saved-item">
                <div>
                  <strong>{s.nome}</strong> <span className="pill">{s.motivo}</span>
                  <div className="muted small">{s.email} · {s.telefone}</div>
                  <div className="small">{s.mensagem}</div>
                </div>
                <button type="button" className="danger" onClick={() => apagar(s.id)}>Apagar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("react-contacto")).render(<ContactoApp />);
