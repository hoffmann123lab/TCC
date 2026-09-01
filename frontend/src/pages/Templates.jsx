import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Templates.css';

export default function Templates() {
  const navigate = useNavigate();

  const templatesList = [
    {
      id: 'temp-estoque',
      title: 'Gestão de Estoque & Validade',
      category: 'Estoque',
      icon: '📦',
      featured: true,
      description: 'Acompanhe produtos, quantidades e prazos de início e fim para ter controle total do seu inventário.',
      columns: ['Produto', 'Quantidade', 'Data Início', 'Data Fim']
    },
    {
      id: 'temp-escola',
      title: 'Diário de Classe',
      category: 'Escola',
      icon: '🎓',
      description: 'Organize matérias, professores, tarefas, notas e faltas do semestre.',
      columns: ['Matéria', 'Professor', 'Conteúdo do Dia', 'Tarefa / Trabalho', 'Nota', 'Faltas']
    },
    {
      id: 'temp-financeiro',
      title: 'Controle de Gastos',
      category: 'Finanças',
      icon: '💸',
      description: 'Gerencie entradas, saídas fixas, variáveis e status de pagamentos.',
      columns: ['Descrição', 'Tipo', 'Valor (R$)', 'Data', 'Categoria', 'Status']
    },
    {
      id: 'temp-trabalho',
      title: 'Gestão de Tarefas',
      category: 'Trabalho',
      icon: '💼',
      description: 'Acompanhe demandas da equipe, prioridades, responsáveis e prazos.',
      columns: ['Tarefa', 'Prioridade', 'Responsável', 'Prazo Final', 'Status']
    },
    {
      id: 'temp-fitness',
      title: 'Treino & Nutrição',
      category: 'Saúde',
      icon: '🏋️‍♂️',
      description: 'Planeje séries, cargas, repetições e acompanhe seu consumo de calorias.',
      columns: ['Dia', 'Exercício / Refeição', 'Séries x Reps', 'Carga (kg)', 'Calorias (kcal)', 'Concluído']
    },
    {
      id: 'temp-viagem',
      title: 'Roteiro de Viagem',
      category: 'Viagens',
      icon: '✈️',
      description: 'Organize horários, atrações, transporte e orçamentos do seu passeio.',
      columns: ['Dia / Hora', 'Atração / Local', 'Cidade', 'Custo Estimado (R$)', 'Reservado?']
    },
    {
      id: 'temp-eventos',
      title: 'Planejamento de Festa',
      category: 'Eventos',
      icon: '🎉',
      description: 'Lista de convidados, confirmações de presença, orçamento e fornecedores.',
      columns: ['Item / Fornecedor', 'Responsável', 'Custo (R$)', 'Status de Pagamento', 'Confirmado?']
    },
    {
      id: 'temp-vendas',
      title: 'Pipeline de Vendas (CRM)',
      category: 'Vendas',
      icon: '📈',
      description: 'Acompanhe leads, contato inicial, propostas enviadas e fechamentos.',
      columns: ['Cliente / Empresa', 'Contato', 'Valor Potencial (R$)', 'Etapa', 'Último Contato']
    },
    {
      id: 'temp-habitos',
      title: 'Rastreador de Hábitos',
      category: 'Pessoal',
      icon: '🎯',
      description: 'Crie metas diárias e acompanhe sua consistência semana a semana.',
      columns: ['Hábito', 'Meta Diária', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    }
  ];

  const handleUseTemplate = (templateId) => {
    navigate(`/sheet/${templateId}`);
  };

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Modelos Prontos</h1>
          <p className="page-subtitle">Escolha um modelo abaixo e comece a sua planilha instantaneamente.</p>
        </div>
      </div>

      <div className="templates-grid">
        {templatesList.map((template) => (
          <div
            key={template.id}
            className={`template-card ${template.featured ? 'template-card-featured' : ''}`}
          >
            {template.featured && <span className="featured-badge">⭐ Destaque</span>}
            <div className="card-content-top">
              <div className="card-header">
                <div className="card-icon" data-category={template.category}>
                  {template.icon}
                </div>
                <div>
                  <h3 className="card-title">{template.title}</h3>
                  <span className="template-tag" data-category={template.category}>
                    {template.category}
                  </span>
                </div>
              </div>
              <p className="template-description">{template.description}</p>

              <div className="template-preview-cols">
                <strong>Colunas incluídas:</strong>
                <p>{template.columns.join(' • ')}</p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-use-template"
              onClick={() => handleUseTemplate(template.id)}
            >
              Usar este modelo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}