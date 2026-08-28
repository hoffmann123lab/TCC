import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../App.css';

// 🌐 FUNÇÃO DE PADRONIZAÇÃO E LIMPEZA
function normalizarTexto(valor, nomeColuna = '') {
  if (valor === null || valor === undefined) return '';

  let texto = String(valor).trim().replace(/\s+/g, ' ');
  if (!texto) return '';

  const textoMin = texto.toLowerCase();
  const colMin = nomeColuna.toLowerCase();

  // 1. DINHEIRO / VALORES (R$)
  if (colMin.includes('valor') || colMin.includes('custo') || colMin.includes('preço') || colMin.includes('preco') || colMin.includes('orcamento') || colMin.includes('orçamento') || colMin.includes('salário') || colMin.includes('salario')) {
    let limpo = texto.replace('R$', '').replace(/\s/g, '');
    if (limpo.includes(',') && limpo.includes('.')) {
      limpo = limpo.replace('.', '').replace(',', '.');
    } else if (limpo.includes(',')) {
      limpo = limpo.replace(',', '.');
    }
    const numero = parseFloat(limpo);
    if (!isNaN(numero)) {
      return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
  }

  // 2. PORCENTAGEM (%)
  if (colMin.includes('%') || colMin.includes('porcentagem') || colMin.includes('taxa') || colMin.includes('desconto') || colMin.includes('juros')) {
    let limpo = texto.replace('%', '').replace(',', '.').trim();
    const numero = parseFloat(limpo);
    if (!isNaN(numero)) {
      return `${numero}%`;
    }
  }

  // 3. DATAS (DD/MM/AAAA)
  if (colMin.includes('data') || colMin.includes('prazo') || colMin.includes('nascimento') || colMin.includes('vencimento')) {
    const apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length === 8) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }
  }

  // 4. HORAS (HH:MM)
  if (colMin.includes('hora') || colMin.includes('horário') || colMin.includes('horario')) {
    const apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length === 4) {
      return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2, 4)}`;
    }
  }

  // 5. CPF / CNPJ / CEP
  if (colMin.includes('cpf')) {
    const num = texto.replace(/\D/g, '');
    if (num.length === 11) {
      return `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6, 9)}-${num.slice(9)}`;
    }
  }

  if (colMin.includes('cnpj')) {
    const num = texto.replace(/\D/g, '');
    if (num.length === 14) {
      return `${num.slice(0, 2)}.${num.slice(2, 5)}.${num.slice(5, 8)}/${num.slice(8, 12)}-${num.slice(12)}`;
    }
  }

  if (colMin.includes('cep')) {
    const num = texto.replace(/\D/g, '');
    if (num.length === 8) {
      return `${num.slice(0, 5)}-${num.slice(5)}`;
    }
  }

  // 6. TELEFONE / WHATSAPP
  if (colMin.includes('tel') || colMin.includes('telefone') || colMin.includes('celular') || colMin.includes('whatsapp') || colMin.includes('contato')) {
    const num = texto.replace(/\D/g, '');
    if (num.length === 11) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length === 10) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
    }
  }

  // 7. PLACAS DE VEÍCULO
  if (colMin.includes('placa') || colMin.includes('veículo') || colMin.includes('veiculo')) {
    const limpo = texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (limpo.length === 7) {
      if (/^[A-Z]{3}\d{4}$/.test(limpo)) {
        return `${limpo.slice(0, 3)}-${limpo.slice(3)}`;
      }
      return limpo;
    }
  }

  // 8. ESTADOS (UF)
  if (colMin.includes('uf') || colMin.includes('estado')) {
    const ufs = {
      'acre': 'AC', 'alagoas': 'AL', 'amapa': 'AP', 'amapá': 'AP', 'amazonas': 'AM',
      'bahia': 'BA', 'ceara': 'CE', 'ceará': 'CE', 'distrito federal': 'DF', 'espirito santo': 'ES',
      'espírito santo': 'ES', 'goias': 'GO', 'goiás': 'GO', 'maranhao': 'MA', 'maranhão': 'MA',
      'mato grosso': 'MT', 'mato grosso do sul': 'MS', 'minas gerais': 'MG', 'para': 'PA',
      'pará': 'PA', 'paraiba': 'PB', 'paraíba': 'PB', 'parana': 'PR', 'paraná': 'PR',
      'pernambuco': 'PE', 'piaui': 'PI', 'piauí': 'PI', 'rio de janeiro': 'RJ',
      'rio grande do norte': 'RN', 'rio grande do sul': 'RS', 'rondonia': 'RO', 'rondônia': 'RO',
      'roraima': 'RR', 'santa catarina': 'SC', 'sao paulo': 'SP', 'são paulo': 'SP',
      'sergipe': 'SE', 'tocantins': 'TO'
    };
    if (ufs[textoMin]) return ufs[textoMin];
    if (texto.length === 2) return texto.toUpperCase();
  }

  // 9. UNIDADES DE MEDIDA
  if (colMin.includes('peso') || colMin.includes('massa')) {
    const num = parseFloat(texto.replace(',', '.'));
    if (!isNaN(num)) return `${num} kg`;
  }

  // 10. TAMANHO DE ROUPA
  if (colMin.includes('tamanho')) {
    if (['p', 'm', 'g', 'gg', 'xg', 'xxg', 'pp'].includes(textoMin)) {
      return textoMin.toUpperCase();
    }
  }

  // 11. STATUS DE TAREFA / PROJETO / CRM
  if (colMin.includes('status') || colMin.includes('etapa') || colMin.includes('fase') || colMin.includes('situacao') || colMin.includes('situação')) {
    if (['fazer', 'a fazer', 'pendente', 'todo', 'aberto'].includes(textoMin)) return 'A Fazer';
    if (['fazendo', 'em andamento', 'andamento', 'execucao', 'execução', 'doing'].includes(textoMin)) return 'Em Andamento';
    if (['pronto', 'feito', 'concluido', 'concluído', 'done', 'ok', 'finalizado', 'pago'].includes(textoMin)) return 'Concluído';
    if (['cancelado', 'recusado', 'lost', 'perdido'].includes(textoMin)) return 'Cancelado';
  }

  // 12. GÊNERO / SEXO
  if (colMin.includes('gênero') || colMin.includes('genero') || colMin.includes('sexo')) {
    if (['m', 'mas', 'masc', 'masculino'].includes(textoMin)) return 'Masculino';
    if (['f', 'fem', 'feminino'].includes(textoMin)) return 'Feminino';
    if (['outro', 'outros', 'nb', 'nao-binario', 'não-binário'].includes(textoMin)) return 'Outro';
  }

  // 13. CONFIRMAÇÃO / BOOLEANOS
  if (colMin.includes('reservado') || colMin.includes('confirmado') || colMin.includes('pago') || colMin.includes('concluído') || colMin.includes('ativo')) {
    if (['s', 'sim', 'y', 'yes', 'true', 'v', 'verdadeiro', '1', 'ok'].includes(textoMin)) return 'Sim';
    if (['n', 'nao', 'não', 'no', 'false', 'f', 'falso', '0'].includes(textoMin)) return 'Não';
  }

  // 14. PRIORIDADE
  if (colMin.includes('prioridade') || colMin.includes('urgência') || colMin.includes('urgencia')) {
    if (['alta', 'alto', 'urgent', 'urgente', 'max', 'máxima', '3'].includes(textoMin)) return 'Alta';
    if (['media', 'médio', 'medio', 'med', 'normal', '2'].includes(textoMin)) return 'Média';
    if (['baixa', 'baixo', 'low', 'mínima', '1'].includes(textoMin)) return 'Baixa';
  }

  // 15. DIAS DA SEMANA
  if (colMin.includes('dia') || colMin.includes('semana')) {
    if (['seg', 'segunda', 'segunda-feira'].includes(textoMin)) return 'Segunda-feira';
    if (['ter', 'terca', 'terça', 'terça-feira'].includes(textoMin)) return 'Terça-feira';
    if (['qua', 'quarta', 'quarta-feira'].includes(textoMin)) return 'Quarta-feira';
    if (['qui', 'quinta', 'quinta-feira'].includes(textoMin)) return 'Quinta-feira';
    if (['sex', 'sexta', 'sexta-feira'].includes(textoMin)) return 'Sexta-feira';
    if (['sab', 'sabado', 'sábado'].includes(textoMin)) return 'Sábado';
    if (['dom', 'domingo'].includes(textoMin)) return 'Domingo';
  }

  // 16. E-MAIL
  if (colMin.includes('email') || colMin.includes('e-mail')) {
    if (texto.includes('@')) {
      return textoMin;
    }
  }

  // 17. FORMATAÇÃO INTELIGENTE DE NOMES PRÓPRIOS / TEXTO GERAL
  const excecoes = ['de', 'da', 'do', 'dos', 'das', 'e'];
  return texto
    .toLowerCase()
    .split(' ')
    .map((palavra, index) => {
      if (index > 0 && excecoes.includes(palavra)) return palavra;
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

// TEMPLATES PRONTOS
const TEMPLATE_DATA = {
  'temp-escola': {
    title: '🎓 Diário de Classe',
    columns: ['Matéria', 'Professor', 'Conteúdo do Dia', 'Tarefa / Trabalho', 'Nota', 'Faltas'],
    rows: [['', '', '', '', '', '']]
  },
  'temp-financeiro': {
    title: '💸 Controle de Gastos',
    columns: ['Descrição', 'Tipo', 'Valor (R$)', 'Data', 'Categoria', 'Status'],
    rows: [['', '', '', '', '', '']]
  },
  'temp-trabalho': {
    title: '💼 Gestão de Tarefas',
    columns: ['Tarefa', 'Prioridade', 'Responsável', 'Prazo Final', 'Status'],
    rows: [['', '', '', '', '']]
  },
  'temp-fitness': {
    title: '🏋️‍♂️ Treino & Nutrição',
    columns: ['Dia', 'Exercício / Refeição', 'Séries x Reps', 'Carga (kg)', 'Calorias (kcal)', 'Concluído'],
    rows: [['', '', '', '', '', '']]
  },
  'temp-viagem': {
    title: '✈️ Roteiro de Viagem',
    columns: ['Dia / Hora', 'Atração / Local', 'Cidade', 'Custo Estimado (R$)', 'Reservado?'],
    rows: [['', '', '', '', '']]
  },
  'temp-eventos': {
    title: '🎉 Planejamento de Festa',
    columns: ['Item / Fornecedor', 'Responsável', 'Custo (R$)', 'Status de Pagamento', 'Confirmado?'],
    rows: [['', '', '', '', '']]
  },
  'temp-vendas': {
    title: '📈 Pipeline de Vendas (CRM)',
    columns: ['Cliente / Empresa', 'Contato', 'Valor Potencial (R$)', 'Etapa', 'Último Contato'],
    rows: [['', '', '', '', '']]
  },
  'temp-habitos': {
    title: '🎯 Rastreador de Hábitos',
    columns: ['Hábito', 'Meta Diária', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    rows: [['', '', '', '', '', '', '', '', '']]
  }
};

const formatInitialColumns = (cols) => cols.map((col) => typeof col === 'object' && col !== null ? col : { id: crypto.randomUUID(), name: String(col) });

const formatInitialRows = (rows) =>
  rows.map((row) => {
    let cellsArray = [];
    if (Array.isArray(row)) {
      cellsArray = row;
    } else if (row && typeof row === 'object' && Array.isArray(row.cells)) {
      cellsArray = row.cells;
    } else if (row && typeof row === 'object') {
      cellsArray = Object.values(row);
    }

    return {
      id: crypto.randomUUID(),
      cells: cellsArray.map((cell) =>
        typeof cell === 'object' && cell !== null
          ? { value: cell.value || '', comment: cell.comment || '' }
          : { value: cell || '', comment: '' }
      )
    };
  });

export default function SheetView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isTemplate = id in TEMPLATE_DATA;
  const activeTemplate = isTemplate ? TEMPLATE_DATA[id] : null;

  const defaultTitle = location.state?.title || (activeTemplate ? activeTemplate.title : 'Nova Planilha');

  const [sheetTitle, setSheetTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(''); // 📝 ESTADO PARA OBSERVAÇÕES/EXPLICAÇÕES DO GERENTE
  const [columns, setColumns] = useState(activeTemplate ? formatInitialColumns(activeTemplate.columns) : []);
  const [rows, setRows] = useState(activeTemplate ? formatInitialRows(activeTemplate.rows) : []);
  const [isSaving, setIsSaving] = useState(false);

  // Estados dos Modais
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');

  // Estado para Modal de Comentário da Célula
  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    rowId: null,
    colIndex: null,
    text: ''
  });

  // Estado para Alertas e Confirmações
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null
  });

  const showAlert = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: null
    });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (id && !isTemplate) {
      fetch(`http://localhost:5000/api/sheets/${id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.title) setSheetTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.columns) setColumns(formatInitialColumns(data.columns));
            if (data.rows) setRows(formatInitialRows(data.rows));
          }
        })
        .catch((err) => console.error('Erro ao buscar planilha existente:', err));
    }
  }, [id, isTemplate]);

  const handleAddRow = () => {
    if (columns.length === 0) {
      showAlert('Atenção', 'Crie pelo menos uma coluna antes de adicionar linhas!');
      return;
    }
    const newRow = {
      id: crypto.randomUUID(),
      cells: new Array(columns.length).fill(null).map(() => ({ value: '', comment: '' }))
    };
    setRows(prev => [...prev, newRow]);
  };

  const handleAddColumn = () => {
    setNewColName('');
    setIsColModalOpen(true);
  };

  const handleConfirmAddColumn = (e) => {
    e.preventDefault();
    const nameToUse = newColName.trim() || `Coluna ${columns.length + 1}`;

    setColumns(prev => [...prev, { id: crypto.randomUUID(), name: nameToUse }]);
    setRows(prev => prev.map(row => ({ ...row, cells: [...row.cells, { value: '', comment: '' }] })));
    setIsColModalOpen(false);
  };

  const handleColumnNameChange = (colId, newName) => {
    setColumns(prev => prev.map(col => col.id === colId ? { ...col, name: newName } : col));
  };

  const handleRemoveColumn = (colIndex) => {
    showConfirm(
      'Remover Coluna',
      'Tem certeza de que deseja remover esta coluna? Todos os dados contidos nela serão apagados.',
      () => {
        setColumns(prev => prev.filter((_, idx) => idx !== colIndex));
        setRows(prev => prev.map(row => ({
          ...row,
          cells: row.cells.filter((_, idx) => idx !== colIndex)
        })));
      }
    );
  };

  const handleRemoveRow = (rowId) => {
    setRows(prev => prev.filter(row => row.id !== rowId));
  };

  const handleCellChange = (rowId, colIndex, value) => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedCells = [...row.cells];
        updatedCells[colIndex] = { ...updatedCells[colIndex], value };
        return { ...row, cells: updatedCells };
      }
      return row;
    }));
  };

  const handleOpenCommentModal = (rowId, colIndex, currentComment) => {
    setCommentModal({
      isOpen: true,
      rowId,
      colIndex,
      text: currentComment || ''
    });
  };

  const handleSaveComment = (e) => {
    e.preventDefault();
    const { rowId, colIndex, text } = commentModal;

    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedCells = [...row.cells];
        updatedCells[colIndex] = { ...updatedCells[colIndex], comment: text.trim() };
        return { ...row, cells: updatedCells };
      }
      return row;
    }));

    setCommentModal({ isOpen: false, rowId: null, colIndex: null, text: '' });
  };

  const handleFinishTable = async () => {
    if (columns.length === 0) {
      showAlert('Atenção', 'A planilha precisa ter pelo menos uma coluna antes de ser finalizada!');
      return;
    }

    setIsSaving(true);

    const colunasPadronizadasNames = columns.map(col => normalizarTexto(typeof col === 'object' ? col.name : col));

    const linhasPadronizadasValues = rows.map(row => {
      return row.cells.map((celula, colIndex) => {
        const nomeColuna = colunasPadronizadasNames[colIndex] || '';
        return {
          value: normalizarTexto(celula.value, nomeColuna),
          comment: celula.comment || ''
        };
      });
    });

    // 1. Gera o Download .xlsx
    const rawData = [
      colunasPadronizadasNames,
      ...linhasPadronizadasValues.map(row => row.map(cell => cell.value))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rawData);

    linhasPadronizadasValues.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.comment) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: cell.value || '' };
          }
          worksheet[cellAddress].c = [{ t: cell.comment, a: 'Usuário' }];
        }
      });
    });

    const colWidths = colunasPadronizadasNames.map((col, colIndex) => {
      let maxLength = col ? col.length : 10;
      linhasPadronizadasValues.forEach(row => {
        const val = row[colIndex]?.value;
        if (val) {
          const cellLength = val.toString().length;
          if (cellLength > maxLength) maxLength = cellLength;
        }
      });
      return { wch: maxLength + 4 };
    });
    worksheet['!cols'] = colWidths;

    const cleanFileName = sheetTitle.replace(/[^a-zA-Z0-9-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '').trim();
    const fileName = `${cleanFileName || 'Planilha'}.xlsx`;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha');

    XLSX.writeFile(workbook, fileName);

    // 2. Salva na API / Banco de Dados
    try {
      const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
      const loggedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = loggedUser?._id || loggedUser?.id;

      if (!userId) {
        showAlert('Atenção', 'Planilha baixada, mas faça login para salvá-la no banco de dados.');
        setIsSaving(false);
        return;
      }

      const payload = {
        title: sheetTitle,
        description: description, // 📌 Campo retido para explicação do gerente
        fileName: fileName,
        columns: colunasPadronizadasNames,
        rows: linhasPadronizadasValues,
        userId: userId
      };

      const isEditingExisting = id && !isTemplate;
      const url = isEditingExisting ? `http://localhost:5000/api/sheets/${id}` : 'http://localhost:5000/api/sheets';
      const method = isEditingExisting ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showAlert('Sucesso! 🎉', `Planilha salva com sucesso e baixada como "${fileName}".`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Resposta de erro do servidor:', response.status, errorData);
        showAlert('Erro ao Salvar', `Ocorreu uma falha no servidor. (Status ${response.status})`);
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      showAlert('Erro de Conexão', 'Planilha baixada, mas o servidor backend está fora do ar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sheet-container">
      <div className="sheet-header">
        <div className="sheet-title-area" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ← Voltar
          </button>

          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            placeholder="Nome da planilha..."
            style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#0f172a',
              border: '1px solid transparent',
              borderRadius: '6px',
              padding: '0.3rem 0.6rem',
              backgroundColor: '#f8fafc',
              outline: 'none',
              transition: 'all 0.2s ease',
              minWidth: '250px'
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#2563eb';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = 'transparent';
            }}
          />
        </div>

        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={handleAddColumn}>
            + Coluna
          </button>
          <button className="btn btn-secondary" onClick={handleAddRow}>
            + Linha
          </button>
          <button className="btn btn-primary btn-finish" onClick={handleFinishTable} disabled={isSaving}>
            {isSaving ? '⏳ Salvando...' : '✅ Finalizar Tabela'}
          </button>
        </div>
      </div>

      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          {columns.length > 0 && (
            <thead>
              <tr>
                <th className="row-number" style={{ width: '60px', textAlign: 'center' }}>#</th>
                {columns.map((col, index) => (
                  <th key={col.id || index} style={{ padding: '0.3rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input
                        type="text"
                        value={typeof col === 'object' ? col.name : col}
                        onChange={(e) => handleColumnNameChange(col.id, e.target.value)}
                        placeholder={`Coluna ${index + 1}`}
                        style={{
                          fontWeight: 'bold',
                          border: '1px solid transparent',
                          backgroundColor: 'transparent',
                          width: '100%',
                          outline: 'none',
                          fontSize: '0.9rem',
                          color: '#0f172a',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#2563eb';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.borderColor = 'transparent';
                        }}
                      />
                      <button
                        onClick={() => handleRemoveColumn(index)}
                        title="Excluir Coluna"
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          opacity: 0.6,
                          fontSize: '0.75rem',
                          padding: '0 0.2rem'
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {columns.length === 0 ? (
              <tr>
                <td style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                    Esta planilha está totalmente vazia.
                  </p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Comece criando a sua primeira coluna!
                  </p>
                  <button className="btn btn-primary" onClick={handleAddColumn}>
                    + Adicionar Primeira Coluna
                  </button>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: '#64748b' }}
                >
                  <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                    Suas colunas já foram criadas! Agora adicione a primeira linha.
                  </p>
                  <button className="btn btn-primary" onClick={handleAddRow}>
                    + Adicionar Primeira Linha
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  <td className="row-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem', padding: '0.5rem 0.4rem' }}>
                    <span>{rowIndex + 1}</span>
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      title="Excluir Linha"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        opacity: 0.5,
                        padding: 0
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                  {row.cells.map((cell, colIndex) => (
                    <td key={colIndex} style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <input
                          type="text"
                          value={cell.value}
                          placeholder="Preencha aqui..."
                          onChange={(e) => handleCellChange(row.id, colIndex, e.target.value)}
                          className="cell-input"
                          style={{ paddingRight: '26px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenCommentModal(row.id, colIndex, cell.comment)}
                          title={cell.comment ? `Comentário: ${cell.comment}` : 'Adicionar comentário'}
                          style={{
                            position: 'absolute',
                            right: '6px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            opacity: cell.comment ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                          }}
                        >
                          💬
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📝 ÁREA DE EXPLICAÇÃO DA PLANILHA PARA O GERENTE */}
      <div style={{ marginTop: '2rem', backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📝 Observação / Explicação para o Gerente
        </h3>
        <p style={{ margin: '0 0 0.75rem 0', color: '#64748b', fontSize: '0.85rem' }}>
          Escreva uma breve explicação ou contextualização dos dados contidos nesta planilha.
        </p>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Esta planilha detalha os custos de infraestrutura do setor no mês vigente..."
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            outline: 'none',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* MODAIS */}
      {isColModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem' }}>Nova Coluna</h3>
            <form onSubmit={handleConfirmAddColumn}>
              <input type="text" autoFocus value={newColName} onChange={(e) => setNewColName(e.target.value)} placeholder={`Ex: Coluna ${columns.length + 1}`} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsColModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>Criar Coluna</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {commentModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem' }}>💬 Comentário da Célula</h3>
            <form onSubmit={handleSaveComment}>
              <textarea autoFocus rows={4} value={commentModal.text} onChange={(e) => setCommentModal(prev => ({ ...prev, text: e.target.value }))} placeholder="Comentário..." style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '1.25rem', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setCommentModal({ isOpen: false, rowId: null, colIndex: null, text: '' })} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>Salvar Comentário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem' }}>{modalConfig.title}</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#475569', fontSize: '0.95rem' }}>{modalConfig.message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              {modalConfig.type === 'confirm' && (
                <button onClick={closeModal} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer' }}>Cancelar</button>
              )}
              <button onClick={() => { if (modalConfig.onConfirm) modalConfig.onConfirm(); closeModal(); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: modalConfig.type === 'confirm' ? '#dc2626' : '#2563eb', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>
                {modalConfig.type === 'confirm' ? 'Confirmar' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}