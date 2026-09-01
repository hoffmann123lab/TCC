import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../App.css';
import './SheetView.css';

function normalizarTexto(valor, nomeColuna = '') {
  if (valor === null || valor === undefined) return '';

  let texto = String(valor).trim().replace(/\s+/g, ' ');
  if (!texto) return '';

  const textoMin = texto.toLowerCase();
  const colMin = nomeColuna.toLowerCase();

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

  if (colMin.includes('%') || colMin.includes('porcentagem') || colMin.includes('taxa') || colMin.includes('desconto') || colMin.includes('juros')) {
    let limpo = texto.replace('%', '').replace(',', '.').trim();
    const numero = parseFloat(limpo);
    if (!isNaN(numero)) {
      return `${numero}%`;
    }
  }

  if (colMin.includes('data') || colMin.includes('prazo') || colMin.includes('nascimento') || colMin.includes('vencimento')) {
    const apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length === 8) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }
  }

  if (colMin.includes('hora') || colMin.includes('horário') || colMin.includes('horario')) {
    const apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length === 4) {
      return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2, 4)}`;
    }
  }

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

  if (colMin.includes('tel') || colMin.includes('telefone') || colMin.includes('celular') || colMin.includes('whatsapp') || colMin.includes('contato')) {
    const num = texto.replace(/\D/g, '');
    if (num.length === 11) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length === 10) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
    }
  }

  if (colMin.includes('placa') || colMin.includes('veículo') || colMin.includes('veiculo')) {
    const limpo = texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (limpo.length === 7) {
      if (/^[A-Z]{3}\d{4}$/.test(limpo)) {
        return `${limpo.slice(0, 3)}-${limpo.slice(3)}`;
      }
      return limpo;
    }
  }

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

  if (colMin.includes('peso') || colMin.includes('massa')) {
    const num = parseFloat(texto.replace(',', '.'));
    if (!isNaN(num)) return `${num} kg`;
  }

  if (colMin.includes('tamanho')) {
    if (['p', 'm', 'g', 'gg', 'xg', 'xxg', 'pp'].includes(textoMin)) {
      return textoMin.toUpperCase();
    }
  }

  if (colMin.includes('status') || colMin.includes('etapa') || colMin.includes('fase') || colMin.includes('situacao') || colMin.includes('situação')) {
    if (['fazer', 'a fazer', 'pendente', 'todo', 'aberto'].includes(textoMin)) return 'A Fazer';
    if (['fazendo', 'em andamento', 'andamento', 'execucao', 'execução', 'doing'].includes(textoMin)) return 'Em Andamento';
    if (['pronto', 'feito', 'concluido', 'concluído', 'done', 'ok', 'finalizado', 'pago'].includes(textoMin)) return 'Concluído';
    if (['cancelado', 'recusado', 'lost', 'perdido'].includes(textoMin)) return 'Cancelado';
  }

  if (colMin.includes('gênero') || colMin.includes('genero') || colMin.includes('sexo')) {
    if (['m', 'mas', 'masc', 'masculino'].includes(textoMin)) return 'Masculino';
    if (['f', 'fem', 'feminino'].includes(textoMin)) return 'Feminino';
    if (['outro', 'outros', 'nb', 'nao-binario', 'não-binário'].includes(textoMin)) return 'Outro';
  }

  if (colMin.includes('reservado') || colMin.includes('confirmado') || colMin.includes('pago') || colMin.includes('concluído') || colMin.includes('ativo')) {
    if (['s', 'sim', 'y', 'yes', 'true', 'v', 'verdadeiro', '1', 'ok'].includes(textoMin)) return 'Sim';
    if (['n', 'nao', 'não', 'no', 'false', 'f', 'falso', '0'].includes(textoMin)) return 'Não';
  }

  if (colMin.includes('prioridade') || colMin.includes('urgência') || colMin.includes('urgencia')) {
    if (['alta', 'alto', 'urgent', 'urgente', 'max', 'máxima', '3'].includes(textoMin)) return 'Alta';
    if (['media', 'médio', 'medio', 'med', 'normal', '2'].includes(textoMin)) return 'Média';
    if (['baixa', 'baixo', 'low', 'mínima', '1'].includes(textoMin)) return 'Baixa';
  }

  if (colMin.includes('dia') || colMin.includes('semana')) {
    if (['seg', 'segunda', 'segunda-feira'].includes(textoMin)) return 'Segunda-feira';
    if (['ter', 'terca', 'terça', 'terça-feira'].includes(textoMin)) return 'Terça-feira';
    if (['qua', 'quarta', 'quarta-feira'].includes(textoMin)) return 'Quarta-feira';
    if (['qui', 'quinta', 'quinta-feira'].includes(textoMin)) return 'Quinta-feira';
    if (['sex', 'sexta', 'sexta-feira'].includes(textoMin)) return 'Sexta-feira';
    if (['sab', 'sabado', 'sábado'].includes(textoMin)) return 'Sábado';
    if (['dom', 'domingo'].includes(textoMin)) return 'Domingo';
  }

  if (colMin.includes('email') || colMin.includes('e-mail')) {
    if (texto.includes('@')) {
      return textoMin;
    }
  }

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
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState(activeTemplate ? formatInitialColumns(activeTemplate.columns) : []);
  const [rows, setRows] = useState(activeTemplate ? formatInitialRows(activeTemplate.rows) : []);
  const [isSaving, setIsSaving] = useState(false);

  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');

  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    rowId: null,
    colIndex: null,
    text: ''
  });

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
        description: description,
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
        <div className="sheet-title-area">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Voltar
          </button>

          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            placeholder="Nome da planilha..."
            className="sheet-title-input"
          />
        </div>

        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={handleAddColumn}>
            + Coluna
          </button>
          <button className="btn btn-secondary" onClick={handleAddRow}>
            + Linha
          </button>
          <button className="btn btn-primary" onClick={handleFinishTable} disabled={isSaving}>
            {isSaving ? '⏳ Salvando...' : '✅ Finalizar Tabela'}
          </button>
        </div>
      </div>

      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          {columns.length > 0 && (
            <thead>
              <tr>
                <th className="row-number">#</th>
                {columns.map((col, index) => (
                  <th key={col.id || index}>
                    <div className="column-header-container">
                      <input
                        type="text"
                        value={typeof col === 'object' ? col.name : col}
                        onChange={(e) => handleColumnNameChange(col.id, e.target.value)}
                        placeholder={`Coluna ${index + 1}`}
                        className="column-header-input"
                      />
                      <button
                        onClick={() => handleRemoveColumn(index)}
                        title="Excluir Coluna"
                        className="btn-icon"
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
                <td className="empty-state">
                  <p className="empty-state-title">
                    Esta planilha está totalmente vazia.
                  </p>
                  <p className="description-text">
                    Comece criando a sua primeira coluna!
                  </p>
                  <button className="btn btn-primary" onClick={handleAddColumn}>
                    + Adicionar Primeira Coluna
                  </button>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-state">
                  <p className="description-text">
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
                  <td className="row-number">
                    <span>{rowIndex + 1}</span>
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      title="Excluir Linha"
                      className="btn-icon"
                    >
                      🗑️
                    </button>
                  </td>
                  {row.cells.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <div className="cell-container">
                        <input
                          type="text"
                          value={cell.value}
                          placeholder="Preencha aqui..."
                          onChange={(e) => handleCellChange(row.id, colIndex, e.target.value)}
                          className="cell-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenCommentModal(row.id, colIndex, cell.comment)}
                          title={cell.comment ? `Comentário: ${cell.comment}` : 'Adicionar comentário'}
                          className="btn-comment"
                          style={{ opacity: cell.comment ? 1 : 0.3 }}
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

      <div className="description-section">
        <h3 className="description-title">
          📝 Observação / Explicação para o Gerente
        </h3>
        <p className="description-text">
          Escreva uma breve explicação ou contextualização dos dados contidos nesta planilha.
        </p>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Esta planilha detalha os custos de infraestrutura do setor no mês vigente..."
          className="description-textarea"
        />
      </div>

      {isColModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Nova Coluna</h3>
            <form onSubmit={handleConfirmAddColumn}>
              <input
                type="text"
                autoFocus
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder={`Ex: Coluna ${columns.length + 1}`}
                className="modal-input"
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsColModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Coluna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {commentModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">💬 Comentário da Célula</h3>
            <form onSubmit={handleSaveComment}>
              <textarea
                autoFocus
                rows={4}
                value={commentModal.text}
                onChange={(e) => setCommentModal(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Comentário..."
                className="modal-input"
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCommentModal({ isOpen: false, rowId: null, colIndex: null, text: '' })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Comentário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">{modalConfig.title}</h3>
            <p className="description-text">{modalConfig.message}</p>
            <div className="modal-actions">
              {modalConfig.type === 'confirm' && (
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
              )}
              <button
                className={`btn ${modalConfig.type === 'confirm' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => {
                  if (modalConfig.onConfirm) modalConfig.onConfirm();
                  closeModal();
                }}
              >
                {modalConfig.type === 'confirm' ? 'Confirmar' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}