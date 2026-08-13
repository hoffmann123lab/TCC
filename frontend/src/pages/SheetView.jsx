import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../App.css';

// 🌐 FUNÇÃO ULTRA COMPLETA DE PADRONIZAÇÃO E LIMPEZA
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

  // 7. PLACAS DE VEÍCULO (Padrão Antigo e Mercosul)
  if (colMin.includes('placa') || colMin.includes('veículo') || colMin.includes('veiculo')) {
    const limpo = texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (limpo.length === 7) {
      if (/^[A-Z]{3}\d{4}$/.test(limpo)) {
        return `${limpo.slice(0, 3)}-${limpo.slice(3)}`;
      }
      return limpo;
    }
  }

  // 8. ESTADOS (UF - Brasil)
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

  // 9. UNIDADES DE MEDIDA (PESO E DISTÂNCIA)
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

  // 13. CONFIRMAÇÃO / BOOLEANOS (Sim / Não)
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

// MODELOS PRONTOS DE TEMPLATES
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

const DEFAULT_BLANK_COLUMNS = [];
const DEFAULT_BLANK_ROWS = [];

export default function SheetView() {
  const { id } = useParams();
  const location = useLocation();

  const isTemplate = id in TEMPLATE_DATA;
  const activeTemplate = isTemplate ? TEMPLATE_DATA[id] : null;

  const sheetTitle = location.state?.title || (activeTemplate ? activeTemplate.title : 'Nova Planilha');

  const initialColumns = activeTemplate ? activeTemplate.columns : DEFAULT_BLANK_COLUMNS;
  const initialRows = activeTemplate ? activeTemplate.rows : DEFAULT_BLANK_ROWS;

  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);

  const handleAddRow = () => {
    if (columns.length === 0) {
      alert('Crie pelo menos uma coluna antes de adicionar linhas!');
      return;
    }
    const newEmptyRow = new Array(columns.length).fill('');
    setRows([...rows, newEmptyRow]);
  };

  // Adicionar Coluna
  const handleAddColumn = () => {
    const colName = prompt('Digite o nome da nova coluna:');
    if (colName) {
      setColumns([...columns, colName]);
      setRows(rows.map(row => [...row, '']));
    }
  };

  // Atualizar Célula
  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  // 🚀 Finalizar Tabela: Varrer, Padronizar, Gerar Excel no PC e Enviar para Backend
  const handleFinishTable = async () => {
    if (columns.length === 0) {
      alert('A planilha precisa ter pelo menos uma coluna antes de ser finalizada!');
      return;
    }

    // 1. Padroniza os cabeçalhos das colunas
    const colunasPadronizadas = columns.map(col => normalizarTexto(col));

    // 2. Varre TODAS as linhas e colunas aplicando a padronização automática
    const linhasPadronizadas = rows.map(row => {
      return row.map((celula, colIndex) => {
        const nomeColuna = colunasPadronizadas[colIndex] || '';
        return normalizarTexto(celula, nomeColuna);
      });
    });

    // 3. Atualiza o estado da tela com os dados limpos
    setColumns(colunasPadronizadas);
    setRows(linhasPadronizadas);

    // 4. Prepara a matriz final (Cabeçalho + Linhas Padronizadas)
    const tableData = [colunasPadronizadas, ...linhasPadronizadas];
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);

    // 📏 Ajusta automaticamente a largura de cada coluna no Excel
    const colWidths = colunasPadronizadas.map((col, colIndex) => {
      let maxLength = col ? col.length : 10;
      linhasPadronizadas.forEach(row => {
        if (row[colIndex]) {
          const cellLength = row[colIndex].toString().length;
          if (cellLength > maxLength) maxLength = cellLength;
        }
      });
      return { wch: maxLength + 4 };
    });
    worksheet['!cols'] = colWidths;

    // 5. Salva o arquivo no computador (Downloads)
    const cleanFileName = sheetTitle.replace(/[^a-zA-Z0-9-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '').trim();
    const fileName = `${cleanFileName || 'Planilha'}.xlsx`;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha');
    XLSX.writeFile(workbook, fileName);

    // 6. Envia para o Backend para emitir o alerta no terminal do servidor
    try {
      await fetch('http://localhost:5000/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sheetTitle,
          fileName: fileName,
          columns: colunasPadronizadas,
          rows: linhasPadronizadas,
        }),
      });
  } catch (error) {
    console.log('Arquivo baixado no PC, mas o servidor backend não respondeu.');
    console.error(error); // 👈 Usando a variável aqui, o sublinhado some!
  }
    alert(`🎉 Tabela finalizada com sucesso! Todos os dados foram padronizados e salvos em Downloads como "${fileName}".`);
  };

  return (
    <div className="sheet-container">
      {/* Topo / Cabeçalho */}
      <div className="sheet-header">
        <div className="sheet-title-area">
          <Link to="/" className="btn-back">← Voltar</Link>
          <h1 className="sheet-title">{sheetTitle}</h1>
        </div>

        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={handleAddColumn}>
            + Coluna
          </button>
          <button className="btn btn-secondary" onClick={handleAddRow}>
            + Linha
          </button>
          <button className="btn btn-primary btn-finish" onClick={handleFinishTable}>
            ✅ Finalizar Tabela
          </button>
        </div>
      </div>

      {/* Tabela Interativa */}
      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          {columns.length > 0 && (
            <thead>
              <tr>
                <th className="row-number">#</th>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
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
                <tr key={rowIndex}>
                  <td className="row-number">{rowIndex + 1}</td>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={cell}
                        placeholder="Preencha aqui..."
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="cell-input"
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
