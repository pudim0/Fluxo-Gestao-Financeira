/* ==========================================================
   Flu$o Dashboard
   JavaScript principal
========================================================== */

/* ==========================================================
   CONFIGURAÇÕES GERAIS
========================================================== */

const formatMoney = (value) => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  });
};

/* ==========================================================
   DADOS MOCK
========================================================== */

const flowData = [
  {
    month: "Jan",
    gastos: 2650,
    receitas: 3050,
  },

  {
    month: "Fev",
    gastos: 2400,
    receitas: 2900,
  },

  {
    month: "Mar",
    gastos: 3100,
    receitas: 3850,
  },

  {
    month: "Abr",
    gastos: 2700,
    receitas: 3050,
  },

  {
    month: "Mai",
    gastos: 3300,
    receitas: 4200,
  },

  {
    month: "Jun",
    gastos: 3050,
    receitas: 4050,
  },

  {
    month: "Jul",
    gastos: 2900,
    receitas: 3200,
  },
];

const pieData = [
  {
    name: "Alimentação",
    value: 980,
    color: "#22c55e",
  },

  {
    name: "Transporte",
    value: 420,
    color: "#8b5cf6",
  },

  {
    name: "Assinaturas",
    value: 310,
    color: "#f59e0b",
  },

  {
    name: "Compras",
    value: 780,
    color: "#06b6d4",
  },

  {
    name: "Saúde",
    value: 230,
    color: "#ec4899",
  },

  {
    name: "Outros",
    value: 400,
    color: "#64748b",
  },
];

const insights = [
  {
    type: "warning",

    title: "Você gastou 34% mais com delivery este mês.",

    desc: "Se reduzir 20%, pode investir R$ 170/mês.",
  },

  {
    type: "suggestion",

    title: "Seu cartão consumiu 78% do limite.",

    desc: "Considere quitar parte da fatura agora.",
  },

  {
    type: "success",

    title: "Você economizou R$ 540 este mês.",

    desc: "Ótimo! Meta mensal atingida em 72%.",
  },
];

const transactions = [
  {
    name: "iFood",
    cat: "Alimentação",
    time: "hoje, 12h34",
    value: -68.9,
    icon: "utensils",
    color: "#22c55e",
  },

  {
    name: "Uber",
    cat: "Transporte",
    time: "hoje, 10h12",
    value: -23.5,
    icon: "car",
    color: "#8b5cf6",
  },

  {
    name: "Salário",
    cat: "Receita",
    time: "ontem",
    value: 6000,
    icon: "arrow-down-left",
    color: "#00e87a",
  },

  {
    name: "Netflix",
    cat: "Assinaturas",
    time: "ontem",
    value: -55.9,
    icon: "play",
    color: "#f59e0b",
  },

  {
    name: "Amazon",
    cat: "Compras",
    time: "seg",
    value: -189.9,
    icon: "shopping-bag",
    color: "#06b6d4",
  },

  {
    name: "Farmácia",
    cat: "Saúde",
    time: "seg",
    value: -87.4,
    icon: "heart",
    color: "#ec4899",
  },

  {
    name: "Posto Shell",
    cat: "Combustível",
    time: "dom",
    value: -220,
    icon: "fuel",
    color: "#eab308",
  },
];

const goals = [
  {
    name: "Comprar carro",
    period: "2 anos",
    current: 25200,
    target: 40000,
    pct: 63,
  },

  {
    name: "Reserva emergência",
    period: "4 meses",
    current: 14400,
    target: 18000,
    pct: 80,
  },

  {
    name: "Viagem Europa",
    period: "1 ano",
    current: 3600,
    target: 12000,
    pct: 30,
  },
];

const subscriptions = [
  {
    name: "Netflix",
    status: "active",
    value: 55.9,
    letter: "N",
  },

  {
    name: "Spotify",
    status: "active",
    value: 21.9,
    letter: "S",
  },

  {
    name: "Prime Video",
    status: "inactive",
    value: 19.9,
    letter: "P",
  },

  {
    name: "Adobe CC",
    status: "active",
    value: 98,
    letter: "A",
  },

  {
    name: "Google One",
    status: "active",
    value: 10.99,
    letter: "G",
  },
];

const forecast = [
  {
    label: "Hoje",
    value: 2500,
    type: "neutral",
  },

  {
    label: "Dia 15 · Salário",
    value: 6000,
    type: "positive",
  },

  {
    label: "Dia 18 · Aluguel",
    value: -1400,
    type: "negative",
  },

  {
    label: "Dia 22 · Cartão",
    value: -1230,
    type: "negative",
  },

  {
    label: "Saldo previsto",
    value: 5870,
    type: "final",
  },
];

const subScores = [
  {
    label: "Gastos controlados",
    value: 82,
  },

  {
    label: "Taxa de poupança",
    value: 75,
  },

  {
    label: "Nível de dívidas",
    value: 68,
  },

  {
    label: "Diversificação",
    value: 80,
  },
];

const badges = [
  {
    label: "7 dias seguidos",
    icon: "flame",
  },

  {
    label: "Primeira meta batida",
    icon: "trophy",
  },

  {
    label: "Investidor iniciante",
    icon: "trending-up",
  },

  {
    label: "Sem gastos supérfluos",
    icon: "award",
  },
];
/* ==========================================================
   RENDERIZAÇÃO DINÂMICA
========================================================== */

/* ==========================================================
   LISTA DE CATEGORIAS
========================================================== */

const categoryList = document.querySelector(".cat-list");

pieData.forEach((category) => {
  categoryList.innerHTML += `

    <div class="cat-row">

      <span 
        class="legend-dot"
        style="background:${category.color}">
      </span>


      <span class="cname">
        ${category.name}
      </span>


      <span class="cval">
        R$ ${formatMoney(category.value)}
      </span>


    </div>

  `;
});

/* ==========================================================
   IA FINANCEIRA
========================================================== */

const insightsContainer = document.querySelector(".insights-container");

const insightIcons = {
  warning: "alert-triangle",

  suggestion: "sparkles",

  success: "circle-check",
};

const insightColors = {
  warning: "#f59e0b",

  suggestion: "#8b5cf6",

  success: "#00e87a",
};

insights.forEach((insight) => {
  insightsContainer.innerHTML += `


  <div class="insight">


    <i 
      data-lucide="${insightIcons[insight.type]}"
      style="
      color:${insightColors[insight.type]}
      ">
    </i>



    <div>


      <div class="insight-title">

        ${insight.title}

      </div>



      <div class="insight-desc">

        ${insight.desc}

      </div>


    </div>


  </div>



  `;
});

/* ==========================================================
   TRANSAÇÕES
========================================================== */

const transactionsContainer = document.querySelector(".transactions-container");

transactions.forEach((transaction) => {
  transactionsContainer.innerHTML += `


<div class="tx-row">


<div 
class="tx-icon"
style="
background:${transaction.color}22
">

<i 
data-lucide="${transaction.icon}"
style="
color:${transaction.color}
">
</i>


</div>





<div>


<div class="tx-name">

${transaction.name}

</div>



<div class="tx-cat">

${transaction.cat} · ${transaction.time}

</div>


</div>






<div 
class="
tx-value 
${transaction.value > 0 ? "pos" : ""}
">


${transaction.value > 0 ? "+" : "-"}

R$ ${formatMoney(Math.abs(transaction.value))}


</div>




</div>



`;
});

/* ==========================================================
   METAS
========================================================== */

const goalsContainer = document.querySelector(".goals-container");

goals.forEach((goal) => {
  goalsContainer.innerHTML += `


<div class="goal">



<div class="goal-top">


<span class="goal-name">

${goal.name}

</span>



<span class="goal-period">

${goal.period}

</span>



</div>





<div class="goal-amounts">


<span>

R$ ${formatMoney(goal.current)}

</span>



<span>

R$ ${formatMoney(goal.target)}

</span>



</div>





<div class="bar-track">


<div 
class="bar-fill"
style="
width:${goal.pct}%
">

</div>


</div>

<div class="goal-bottom">


<span class="goal-pct">

${goal.pct}%

</span>



<span class="goal-left">

faltam R$ 
${formatMoney(goal.target - goal.current)}

</span>



</div>


</div>


`;
});

/* ==========================================================
   ASSINATURAS
========================================================== */

const subscriptionsContainer = document.querySelector(
  ".subscriptions-container",
);

let totalSubscriptions = 0;

subscriptions.forEach((subscription) => {
  totalSubscriptions += subscription.value;

  subscriptionsContainer.innerHTML += `



<div class="sub-row">



<div class="sub-avatar">

${subscription.letter}

</div>





<div>


<div class="sub-name">

${subscription.name}

</div>





<div 
class="
sub-status 
${subscription.status}
">


<span class="dot"></span>


${subscription.status === "active" ? "Usado recentemente" : "Inativo"}


</div>




</div>







<div class="sub-value">


R$ ${formatMoney(subscription.value)}



${
  subscription.status === "inactive"
    ? `
<div class="sub-cancel">
Cancelar?
</div>
`
    : ""
}



</div>






</div>



`;
});

document.querySelector(".subscription-total").innerHTML = `
Total:
R$ ${formatMoney(totalSubscriptions)}/mês
`;

/* ==========================================================
   PREVISÃO FINANCEIRA
========================================================== */

const forecastContainer = document.querySelector(".forecast-row");

forecast.forEach((item, index) => {
  forecastContainer.innerHTML += `



<div 
class="
forecast-chip 
${item.type}
">


<div class="fc-label">

${item.label}

</div>




<div 
class="
fc-value
${item.value < 0 ? "neg" : ""}
">


${item.value < 0 ? "-" : ""}

R$ ${formatMoney(Math.abs(item.value))}


</div>



</div>




${
  index < forecast.length - 1
    ? `
<i 
data-lucide="chevron-right"
class="fc-arrow">
</i>
`
    : ""
}



`;
});
/* ==========================================================
   SCORE DE SAÚDE FINANCEIRA
========================================================== */

const subscoreContainer = document.querySelector(".subscore-list");

subScores.forEach((score) => {
  subscoreContainer.innerHTML += `


<div class="subscore-row">


<div class="subscore-top">


<span>
${score.label}
</span>


<span>
${score.value}
</span>


</div>




<div class="subscore-track">


<div 
class="subscore-fill"
style="
width:${score.value}%
">

</div>


</div>



</div>



`;
});

/* ==========================================================
   GAMIFICAÇÃO - CONQUISTAS
========================================================== */

const badgesContainer = document.querySelector(".badges-grid");

badges.forEach((badge) => {
  badgesContainer.innerHTML += `


<div class="badge">


<div class="badge-icon">


<i 
data-lucide="${badge.icon}">
</i>


</div>



<div class="badge-label">

${badge.label}

</div>



</div>


`;
});

/* ==========================================================
   MENU MOBILE
========================================================== */

const sidebar = document.querySelector(".sidebar");

const hamburger = document.querySelector(".hamburger");

const closeMobile = document.querySelector(".close-mobile");

const overlay = document.querySelector(".overlay");

hamburger.addEventListener("click", () => {
  sidebar.classList.add("open");

  overlay.classList.add("active");
});

closeMobile.addEventListener("click", () => {
  sidebar.classList.remove("open");

  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");

  overlay.classList.remove("active");
});

/* ==========================================================
   BOTÃO IA
========================================================== */

const iaButton = document.querySelector(".ask-ia-btn");

iaButton.addEventListener("click", () => {
  alert(
    "Olá Isaac! 🤖\n\nAnalisei seus gastos. Posso ajudar com economia, investimentos e metas.",
  );
});

/* ==========================================================
   CHART - FLUXO FINANCEIRO
========================================================== */

const flowCanvas = document.getElementById("flowChart");

new Chart(flowCanvas, {
  type: "line",

  data: {
    labels: flowData.map((item) => item.month),

    datasets: [
      {
        label: "Receitas",

        data: flowData.map((item) => item.receitas),

        borderColor: "#8b6bf0",

        backgroundColor: "rgba(139,107,240,0.2)",

        fill: true,

        tension: 0.4,

        borderWidth: 2,
      },

      {
        label: "Gastos",

        data: flowData.map((item) => item.gastos),

        borderColor: "#00e87a",

        backgroundColor: "rgba(0,232,122,0.2)",

        fill: true,

        tension: 0.4,

        borderWidth: 2,
      },
    ],
  },

  options: {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#5b6478",
        },
      },

      y: {
        grid: {
          color: "rgba(255,255,255,.05)",
        },

        ticks: {
          color: "#5b6478",

          callback: function (value) {
            return value / 1000 + "k";
          },
        },
      },
    },
  },
});

/* ==========================================================
   CHART - CATEGORIAS (DONUT)
========================================================== */

const categoryCanvas = document.getElementById("categoryChart");

new Chart(categoryCanvas, {
  type: "doughnut",

  data: {
    labels: pieData.map((item) => item.name),

    datasets: [
      {
        data: pieData.map((item) => item.value),

        backgroundColor: pieData.map((item) => item.color),

        borderWidth: 0,
      },
    ],
  },

  options: {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "65%",

    plugins: {
      legend: {
        display: false,
      },
    },
  },
});
/* ==========================================================
   SCORE CIRCULAR LATERAL
========================================================== */

const scoreProgress = document.querySelector(".score-progress");

const scoreValue = 78;

const scoreRadius = 18;

const scoreCircumference = 2 * Math.PI * scoreRadius;

scoreProgress.style.strokeDasharray = `
${(scoreValue / 100) * scoreCircumference}
${scoreCircumference}
`;

/* ==========================================================
   SCORE DE SAÚDE FINANCEIRA
========================================================== */

const healthProgress = document.querySelector(".health-progress");

const healthScore = 78;

const healthRadius = 54;

const healthCircumference = 2 * Math.PI * healthRadius;

healthProgress.style.strokeDasharray = `
${(healthScore / 100) * healthCircumference}
${healthCircumference}
`;

/* ==========================================================
   ANIMAÇÃO DOS CARDS
========================================================== */

const cards = document.querySelectorAll(".metric-card, .panel");

cards.forEach((card, index) => {
  card.style.opacity = "0";

  card.style.transform = "translateY(15px)";

  setTimeout(
    () => {
      card.style.transition = "opacity .5s ease, transform .5s ease";

      card.style.opacity = "1";

      card.style.transform = "translateY(0)";
    },

    index * 60,
  );
});

/* ==========================================================
   HOVER DOS CARDS
========================================================== */

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-3px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

/* ==========================================================
   ATUALIZAÇÃO DO MENU ATIVO
========================================================== */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => {
      nav.classList.remove("active");
    });

    item.classList.add("active");
  });
});

/* ==========================================================
   TOOLTIP SIMPLES PARA BOTÃO IA
========================================================== */

iaButton.title = "Receba sugestões personalizadas usando IA";

/* ==========================================================
   INICIALIZAÇÃO DOS ÍCONES
========================================================== */

lucide.createIcons();

/* ==========================================================
   LOG DE SUCESSO
========================================================== */

console.log("💚 Flu$o Dashboard carregado com sucesso!");
