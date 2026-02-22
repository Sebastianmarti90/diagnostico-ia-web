// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Check,
  Globe,
  Cpu,
  BarChart,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  BrainCircuit,
  X,
  Bot,
  Layers,
  Monitor,
  Info,
  AlertCircle,
  MapPin,
  RefreshCw,
  FileText,
  Palette,
  Settings,
  Users,
  CreditCard,
} from "lucide-react";

/** =========================
 * TYPES
 * ========================= */

type ChoiceValue = string;

type QuestionOption = {
  text: string;
  value?: ChoiceValue;
  points: number;
  infoTitle?: string;
  infoBody?: string;
  isRecommended?: boolean;
};

type Question = {
  id: number;
  text: string;
  subtext?: string;
  options: QuestionOption[];
};

type AnswerItem = {
  question: string;
  answer: string;
};

type PlanPrice = {
  normal: number;
  offer: number;
  discountLabel: string;
};

type Plan = {
  name: string;
  min: number;
  max: number;
  description: string;
  price: PlanPrice;
  features: string[];
  icon: React.ReactNode;
};

type ViewState = "hero" | "quiz" | "analyzing" | "result";

type ModalData = {
  title: string;
  body: string;
};

type ScopeItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

/** =========================
 * DATA
 * ========================= */

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Tienes actualmente página web?",
    options: [
      {
        text: "No, empiezo desde cero",
        points: 1,
        infoTitle: "¿Qué significa: Empiezo desde cero?",
        infoBody:
          "No tienes un dominio registrado ni servicio de hosting activo en este momento.\n\nComenzaremos la construcción de tu identidad digital desde los cimientos.",
      },
      {
        text: "Sí, pero muy básica",
        points: 2,
        infoTitle: "¿Qué significa: Muy básica?",
        infoBody:
          "Tienes un sitio web funcional pero con un diseño antiguo, poca información o que no se adapta bien a celulares.",
      },
      {
        text: "Sí, corporativa estándar",
        points: 3,
        infoTitle: "¿Qué significa: Corporativa estándar?",
        infoBody:
          "Cuentas con un sitio profesional que describe tu empresa, pero funciona únicamente como un folleto digital o tarjeta de presentación.",
      },
      {
        text: "Sí, pero no convierte visitas",
        points: 4,
        infoTitle: "¿Qué significa: No convierte?",
        infoBody:
          "Tu página web recibe tráfico (visitas), pero los usuarios abandonan el sitio sin contactarte, dejar sus datos o realizar una compra.",
      },
    ],
  },
  {
    id: 2,
    text: "¿Cuál es tu objetivo principal?",
    options: [
      {
        text: "Solo presencia digital",
        points: 1,
        infoTitle: "¿Qué significa: Solo presencia?",
        infoBody:
          "Tu prioridad es existir en internet para que cuando alguien busque tu nombre o empresa en Google, pueda encontrarte y validar tu existencia.",
      },
      {
        text: "Posicionamiento profesional",
        points: 2,
        infoTitle: "¿Qué significa: Posicionamiento profesional?",
        infoBody:
          "Buscas proyectar alta autoridad, credibilidad y destacar frente a tus competidores directos con una imagen premium.",
      },
      {
        text: "Captación de clientes",
        points: 3,
        infoTitle: "¿Qué significa: Captación de clientes?",
        infoBody:
          "El objetivo principal de la web es ser una herramienta de ventas activa, diseñada específicamente para capturar leads (prospectos) y generar reuniones o ventas.",
      },
      {
        text: "Automatización y escalabilidad",
        points: 4,
        infoTitle: "¿Qué significa: Automatización?",
        infoBody:
          "Buscas delegar el trabajo manual a la web: calificación de clientes, agendamiento automático, seguimiento por email y conexión con CRM.",
      },
    ],
  },
  {
    id: 3,
    text: "¿Ofreces planes o servicios estructurados?",
    options: [
      {
        text: "No, aún estoy definiendo",
        points: 1,
        infoTitle: "¿Qué significa: Aún definiendo?",
        infoBody:
          "Tus servicios son completamente a medida, no tienes precios estandarizados y cada propuesta varía según el cliente.",
      },
      {
        text: "Sí, pocos servicios",
        points: 2,
        infoTitle: "¿Qué significa: Pocos servicios?",
        infoBody:
          "Ofreces entre 1 y 3 servicios principales o asesorías que ya tienes claros y estructurados para ofrecer al público.",
      },
      {
        text: "Sí, planes bien definidos",
        points: 3,
        infoTitle: "¿Qué significa: Planes definidos?",
        infoBody:
          "Tienes paquetes de servicios claros (ej. Básico, Pro, Premium) con características y promesas de valor establecidas.",
      },
      {
        text: "Sí, ecosistema de productos",
        points: 4,
        infoTitle: "¿Qué significa: Ecosistema?",
        infoBody:
          "Vendes múltiples servicios, consultorías, cursos o productos digitales que se complementan entre sí (upsells, cross-sells).",
      },
    ],
  },
  {
    id: 4,
    text: "¿Quieres integrar automatización o IA?",
    options: [
      {
        text: "No por ahora",
        points: 1,
        infoTitle: "¿Qué significa: No por ahora?",
        infoBody:
          "Prefieres mantener un control manual sobre tus prospectos y ventas, enfocándote en el contacto directo humano.",
      },
      {
        text: "Tal vez en el futuro",
        points: 2,
        infoTitle: "¿Qué significa: En el futuro?",
        infoBody:
          "Te interesa la tecnología, pero prefieres establecer una base sólida y tradicional antes de añadir complejidad técnica.",
      },
      {
        text: "Sí, automatización básica",
        points: 3,
        infoTitle: "¿Qué significa: Automatización básica?",
        infoBody:
          "Quieres respuestas automáticas inmediatas (correos de bienvenida), notificaciones a tu equipo y registro automático en bases de datos.",
      },
      {
        text: "Sí, integración IA avanzada",
        points: 4,
        infoTitle: "¿Qué significa: IA Avanzada?",
        infoBody:
          "Buscas implementar agentes de IA (chatbots inteligentes), pre-calificación automática de leads y personalización de la experiencia del usuario.",
      },
    ],
  },
  {
    id: 5,
    text: "¿Qué nivel de crecimiento proyectas a corto plazo?",
    options: [
      {
        text: "Marca personal emergente",
        points: 1,
        infoTitle: "¿Qué significa: Marca emergente?",
        infoBody:
          "Estás dando tus primeros pasos serios en digital y buscas establecer tu nombre como profesional independiente.",
      },
      {
        text: "Profesional consolidado",
        points: 2,
        infoTitle: "¿Qué significa: Profesional consolidado?",
        infoBody:
          "Ya tienes una cartera de clientes activa y buscas mejorar tu posicionamiento para cobrar más por tus servicios.",
      },
      {
        text: "Consultor estratégico",
        points: 3,
        infoTitle: "¿Qué significa: Consultor estratégico?",
        infoBody:
          "Te posicionas como experto en tu industria, vendes servicios o tickets de alto valor (High Ticket) y necesitas máxima credibilidad.",
      },
      {
        text: "Infraestructura digital masiva",
        points: 4,
        infoTitle: "¿Qué significa: Infraestructura masiva?",
        infoBody:
          "Planeas escalar agresivamente usando publicidad pagada, lanzamientos o embudos para atender a cientos o miles de usuarios.",
      },
    ],
  },
  {
    id: 6,
    text: "¿Qué tipo de solución necesitas?",
    subtext:
      "Elige la opción que más se parece a tu caso. Puedes abrir '¿Qué significa?' en cada una.",
    options: [
      {
        text: "Web simple (solo información)",
        points: 1,
        infoTitle: "¿Qué significa: Web simple?",
        infoBody:
          "Es una página para mostrar quién eres, qué haces y cómo contactarte.\n\nIdeal si no necesitas login, pagos ni automatizaciones.\n\nEjemplo: landing de servicios + botón WhatsApp.",
      },
      {
        text: "Web con formularios y WhatsApp",
        points: 2,
        infoTitle: "¿Qué significa: Web con formularios y WhatsApp?",
        infoBody:
          "Incluye formularios que capturan datos (nombre, correo, mensaje) y redirección a WhatsApp.\n\nIdeal para generar leads sin CRM complejo.\n\nEjemplo: “Solicitar cotización” + envío a tu correo/WhatsApp.",
      },
      {
        text: "Web + integraciones (CRM/Email/Analytics)",
        points: 3,
        infoTitle: "¿Qué significa: Web + integraciones?",
        infoBody:
          "Conecta tu web con herramientas para automatizar seguimiento.\n\nIdeal si quieres medir conversiones y nutrir contactos.\n\nEjemplo: formulario → CRM → email automático → reporte.",
      },
      {
        text: "Infra completa (embudos + automatización + IA)",
        points: 4,
        infoTitle: "¿Qué significa: Infra completa?",
        infoBody:
          "Estructura avanzada para vender y escalar con procesos automáticos.\n\nIncluye embudos, analítica, integraciones y asistente IA.\n\nEjemplo: lead magnet → emails → agenda → chatbot → dashboard.",
      },
    ],
  },
  {
    id: 7,
    text: "¿Cómo quieres manejar pruebas y cambios?",
    subtext: "Esto define si habrá entornos separados para probar antes de publicar.",
    options: [
      {
        text: "No, publico directo (solo PROD)",
        points: 1,
        infoTitle: "¿Qué significa: Solo PROD?",
        infoBody:
          "Todo se cambia directo en la web final.\n\nMás rápido, pero con más riesgo si hay cambios frecuentes.\n\nRecomendado para sitios simples.",
      },
      {
        text: "Sí, DEV + PROD (pruebo antes de publicar)",
        points: 2,
        infoTitle: "¿Qué significa: DEV + PROD?",
        infoBody:
          "DEV es un “borrador” para probar sin afectar la web real.\n\nLuego se publica a PROD cuando está listo.\n\nRecomendado para integraciones o cambios frecuentes.",
      },
      {
        text: "Sí, DEV + QA + PROD (pruebas formales)",
        points: 3,
        infoTitle: "¿Qué significa: DEV + QA + PROD?",
        infoBody:
          "QA es un entorno de pruebas controladas (revisión final).\n\nÚtil cuando hay equipo, procesos, o necesidad de validar.\n\nRecomendado para proyectos medianos/grandes.",
      },
      {
        text: "Sí, y despliegue continuo (CI/CD)",
        points: 4,
        infoTitle: "¿Qué significa: CI/CD?",
        infoBody:
          "Publicación automatizada por pipeline: menos errores humanos.\n\nIdeal para proyectos con actualizaciones constantes.\n\nRecomendado para infra avanzada/IA.",
      },
    ],
  },
  {
    id: 8,
    text: "¿Qué nivel de acompañamiento estratégico necesitas?",
    subtext:
      "Este acompañamiento es adicional al plan base contratado. No modifica el alcance técnico inicial.",
    options: [
      {
        text: "No, solo entrega final",
        points: 1,
        infoTitle: "¿Qué incluye: Entrega final?",
        infoBody:
          "Se entrega la web completamente funcional según el plan contratado.\nIncluye:\n\n• Publicación en producción\n• Validación técnica final\n• Entrega de accesos\n\nNo incluye soporte posterior.\nNo es acumulable.\nCualquier mejora posterior se cotiza como servicio independiente.",
      },
      {
        text: "Sí, 1 sesión de onboarding",
        points: 2,
        infoTitle: "¿Qué incluye: 1 sesión de onboarding?",
        infoBody:
          "Incluye una sesión estratégica posterior al lanzamiento.\nIncluye:\n\n• Cómo editar textos e imágenes\n• Gestión básica de formularios\n• Resolución de dudas operativas\n\nDuración aproximada: 45–60 minutos.\nNo cambia el plan contratado.\nNo es acumulable.\nNo incluye rediseños ni nuevas funcionalidades.",
      },
      {
        text: "Sí, 2–3 sesiones + revisión estratégica",
        points: 3,
        infoTitle: "¿Qué incluye: 2–3 sesiones estratégicas?",
        infoBody:
          "Incluye acompañamiento posterior al lanzamiento.\nIncluye:\n\n• Optimización inicial de conversión\n• Ajustes estratégicos menores\n• Revisión de métricas básicas\n• Resolución de dudas operativas\n\nNo cambia el plan contratado.\nNo es acumulable.\nNo contempla ampliación de alcance ni nuevas secciones.",
      },
      {
        text: "⭐ Sí, soporte mensual (partner)",
        points: 4,
        isRecommended: true,
        infoTitle: "¿Qué incluye: Soporte mensual (partner)?",
        infoBody:
          "Servicio mensual de continuidad estratégica.\nIncluye por mes:\n\n• Mejoras evolutivas menores\n• Optimización de conversión\n• Ajustes estratégicos\n• Soporte prioritario\n• Revisión mensual de rendimiento\n\nNo cambia el plan base.\nNo es acumulable entre meses.\nNo incluye rediseño completo ni desarrollo de nuevas funcionalidades estructurales.",
      },
    ],
  },
  {
    id: 9,
    text: "¿Qué tan documentado lo necesitas?",
    options: [
      {
        text: "Básica (accesos + guía simple)",
        points: 1,
        infoTitle: "¿Qué significa: Básica?",
        infoBody: "Accesos + pasos básicos para editar.",
      },
      {
        text: "Manual de administración",
        points: 2,
        infoTitle: "¿Qué significa: Manual admin?",
        infoBody: "Guía completa para gestionar contenido, formularios, SEO básico.",
      },
      {
        text: "Documentación técnica + handoff",
        points: 3,
        infoTitle: "¿Qué significa: Técnica + handoff?",
        infoBody: "Integraciones, flujos, accesos, configuración, traspaso ordenado.",
      },
      {
        text: "Doc completa + diagramas + runbook",
        points: 4,
        infoTitle: "¿Qué significa: Completa + runbook?",
        infoBody: "Diagramas + operación + contingencias + procedimiento de mantenimiento.",
      },
    ],
  },
  {
    id: 10,
    text: "¿Tienes línea gráfica / branding?",
    options: [
      {
        text: "No tengo nada aún",
        points: 1,
        infoTitle: "¿Qué significa: No tengo nada?",
        infoBody:
          "No cuentas con un logo definido ni una paleta de colores. Trabajaremos con una estética limpia desde cero.",
      },
      {
        text: "Tengo logo y colores",
        points: 2,
        infoTitle: "¿Qué significa: Logo y colores?",
        infoBody:
          "Cuentas con un logotipo y colores corporativos básicos que usaremos como punto de partida para el diseño.",
      },
      {
        text: "Tengo brandbook básico",
        points: 3,
        infoTitle: "¿Qué significa: Brandbook básico?",
        infoBody:
          "Posees un manual de marca con usos correctos del logo, tipografías corporativas y paleta cromática definida.",
      },
      {
        text: "Tengo brandbook completo",
        points: 4,
        infoTitle: "¿Qué significa: Brandbook completo?",
        infoBody:
          "Cuentas con lineamientos estrictos, manual de identidad extenso, tono de voz y recursos gráficos avanzados.",
      },
    ],
  },
];

const formatCLP = (n: number): string =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

const PLANS: Record<"BASE" | "CORPORATIVO" | "INFRAESTRUCTURA" | "IA", Plan> = {
  BASE: {
    name: "PLAN BASE 🥉",
    min: 0,
    max: 16,
    description:
      "Landing Profesional. Ideal para comenzar tu presencia digital con claridad y estética.",
    price: { normal: 490000, offer: 390000, discountLabel: "-20%" },
    features: [
      "Dominio + Hosting (12+ meses)",
      "Diseño Estratégico",
      "Estructura Básica",
      "Certificado SSL",
    ],
    icon: <Globe className="w-12 h-12 text-cyan-400" />,
  },
  CORPORATIVO: {
    name: "PLAN CORPORATIVO 🥈",
    min: 17,
    max: 24,
    description:
      "Sitio de Autoridad. Ideal para posicionamiento profesional y validación de marca.",
    price: { normal: 1090000, offer: 890000, discountLabel: "-18%" },
    features: ["Arquitectura Clara", "Estructura de Servicios", "Captación Inicial", "Blog / Noticias"],
    icon: <Shield className="w-12 h-12 text-cyan-400" />,
  },
  INFRAESTRUCTURA: {
    name: "PLAN INFRAESTRUCTURA 🥇",
    min: 25,
    max: 32,
    description: "Web Avanzada. Ideal para crecimiento estratégico y embudos de venta.",
    price: { normal: 1790000, offer: 1490000, discountLabel: "-17%" },
    features: ["Automatización Básica", "Arquitectura de Conversión", "Integración CRM", "Analítica Avanzada"],
    icon: <Cpu className="w-12 h-12 text-cyan-400" />,
  },
  IA: {
    name: "PLAN IA INTEGRADA 🏆",
    min: 33,
    max: 40,
    description: "Web Inteligente. Infraestructura digital completa con IA y escalabilidad total.",
    price: { normal: 2990000, offer: 2490000, discountLabel: "-17%" },
    features: ["Integración IA Avanzada", "Chatbots Entrenados", "Automatización Total", "Dashboard Personalizado"],
    icon: <BrainCircuit className="w-12 h-12 text-cyan-400" />,
  },
};

const TIMELINE_STEPS: string[] = [
  "Diagnóstico IA completado",
  "Análisis de Arquitectura",
  "Propuesta de Diseño",
  "Desarrollo Frontend",
  "Integración de Contenido",
  "Lanzamiento Oficial 🚀",
];

const getScopeData = (planName: string): ScopeItem[] => {
  if (planName.includes("BASE")) {
    return [
      { icon: <Layers size={16} className="text-purple-300" />, title: "Arquitectura / Infra", desc: "Web simple (sin backend). 1 landing optimizada + secciones clave." },
      { icon: <Monitor size={16} className="text-blue-300" />, title: "Ambientes", desc: "1 ambiente (Producción)." },
      { icon: <Shield size={16} className="text-green-300" />, title: "Seguridad base", desc: "SSL + configuración básica + buenas prácticas." },
      { icon: <Users size={16} className="text-cyan-300" />, title: "Asesoría", desc: "1 sesión de onboarding (45 min) + checklist de publicación." },
      { icon: <FileText size={16} className="text-amber-300" />, title: "Documentación", desc: "Guía simple (1–2 páginas) + accesos + cómo editar textos/imagenes." },
      { icon: <Palette size={16} className="text-pink-300" />, title: "Línea gráfica", desc: "Aplicación de estilo base (colores + tipografía + componentes)." },
      { icon: <Bot size={16} className="text-indigo-300" />, title: "IA y agentes", desc: "No incluido (opcional como add-on)." },
    ];
  }
  if (planName.includes("CORPORATIVO")) {
    return [
      { icon: <Layers size={16} className="text-purple-300" />, title: "Arquitectura / Infra", desc: "Sitio multipágina (5–7 secciones) + formularios + WhatsApp." },
      { icon: <Monitor size={16} className="text-blue-300" />, title: "Ambientes", desc: "Producción + (opcional DEV si el cliente lo pide)." },
      { icon: <Shield size={16} className="text-green-300" />, title: "Seguridad base", desc: "SSL + hardening básico + backups iniciales." },
      { icon: <Users size={16} className="text-cyan-300" />, title: "Asesoría", desc: "2 sesiones (onboarding + revisión final) + guía de publicación." },
      { icon: <FileText size={16} className="text-amber-300" />, title: "Documentación", desc: "Manual de administración (cómo editar, publicar, formularios, SEO básico)." },
      { icon: <Palette size={16} className="text-pink-300" />, title: "Línea gráfica", desc: "Mini brand-kit (paleta, tipografías, estilos de botones/tarjetas)." },
      { icon: <Bot size={16} className="text-indigo-300" />, title: "IA y agentes", desc: "Automatización básica (respuesta de contacto / routing) según factibilidad." },
    ];
  }
  if (planName.includes("INFRAESTRUCTURA")) {
    return [
      { icon: <Layers size={16} className="text-purple-300" />, title: "Arquitectura / Infra", desc: "Web + backend liviano + integraciones (CRM/Email) + analítica." },
      { icon: <Monitor size={16} className="text-blue-300" />, title: "Ambientes", desc: "DEV + PROD (QA opcional)." },
      { icon: <Shield size={16} className="text-green-300" />, title: "Seguridad base", desc: "SSL + roles/accesos + políticas + backups + monitoreo básico." },
      { icon: <Users size={16} className="text-cyan-300" />, title: "Asesoría", desc: "3 sesiones (onboarding + integración + lanzamiento) + soporte 7 días post go-live." },
      { icon: <FileText size={16} className="text-amber-300" />, title: "Documentación", desc: "Doc técnica + handoff (accesos, integraciones, flujos, endpoints si aplica)." },
      { icon: <Palette size={16} className="text-pink-300" />, title: "Línea gráfica", desc: "Brandbook ligero aplicado (componentes UI consistentes + guía visual)." },
      { icon: <Bot size={16} className="text-indigo-300" />, title: "IA y agentes", desc: "IA aplicada a flujos (precalificación, FAQ, automatización de leads) según plan." },
    ];
  }
  return [
    { icon: <Layers size={16} className="text-purple-300" />, title: "Arquitectura / Infra", desc: "Infra completa: embudos + automatización + CRM + dashboards." },
    { icon: <Monitor size={16} className="text-blue-300" />, title: "Ambientes", desc: "DEV + QA + PROD + pipeline (CI/CD) si aplica." },
    { icon: <Shield size={16} className="text-green-300" />, title: "Seguridad base", desc: "SSL + hardening + auditoría básica + monitoreo + backups programados." },
    { icon: <Users size={16} className="text-cyan-300" />, title: "Asesoría", desc: "Acompañamiento tipo partner (sesiones + mesa de trabajo por sprints)." },
    { icon: <FileText size={16} className="text-amber-300" />, title: "Documentación", desc: "Doc completa + diagramas + runbook (operación y contingencia)." },
    { icon: <Palette size={16} className="text-pink-300" />, title: "Línea gráfica", desc: "Sistema visual completo (design system básico + variantes + plantillas)." },
    { icon: <Bot size={16} className="text-indigo-300" />, title: "IA y agentes", desc: "Chatbot entrenado + agentes por tareas + automatización avanzada." },
  ];
};

/** =========================
 * GEMINI MOCK
 * ========================= */

const generateGeminiContent = async (prompt: string): Promise<string> => {
  // En Vercel, deja apiKey vacío y usará mock
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const getMockResponse = (p: string): string => {
    const promptText = p.toLowerCase();

    if (promptText.includes("acciones tácticas")) {
      return JSON.stringify({
        analysis:
          "Tu perfil indica una necesidad crítica de escalabilidad. Este plan optimiza conversión y prepara base sólida.",
        actions: ["Definir User Persona", "Estructurar Servicios", "Configurar Analytics"],
      });
    }

    if (promptText.includes("mapa de conversión") || promptText.includes("sitemap")) {
      return (
        "ESTRUCTURA DE ALTA CONVERSIÓN:\n" +
        "1. Home: Propuesta de valor + prueba social.\n" +
        "2. Soluciones: Páginas por servicio.\n" +
        "3. Casos de Éxito: Evidencia de resultados.\n" +
        "4. Sobre Nosotros: Autoridad.\n" +
        "5. Agendar/Comprar: Calendario o checkout.\n\n" +
        "💡 Beneficio (Cliente): Elimina dudas y guía al usuario a la acción.\n" +
        "⚡ Beneficio (Equipo): Reduce iteraciones con estructura probada."
      );
    }

    if (promptText.includes("copy que cierra") || promptText.includes("redactor creativo")) {
      return (
        "ESTRATEGIA DE COPYWRITING:\n\n" +
        "TITULAR:\n\"Transforma tu Presencia Digital en un Activo Rentable.\"\n\n" +
        "SUBTÍTULO:\n\"Implementa infraestructura web que convierte.\"\n\n" +
        "CTA:\n\"Quiero Escalar Ahora\""
      );
    }

    if (promptText.includes("impacto en resultados") || promptText.includes("retorno de inversión")) {
      return (
        "ANÁLISIS DE OPORTUNIDAD:\n" +
        "- Más confianza → más leads.\n" +
        "- Automatización → ahorro de tiempo.\n" +
        "- Ventas 24/7 → mejor ROI."
      );
    }

    if (promptText.includes("checklist de alcance")) {
      return (
        "ALCANCE SUGERIDO:\n" +
        "- Arquitectura: Frontend + integraciones.\n" +
        "- Ambientes: DEV/PROD según plan.\n" +
        "- Asesoría: sesiones según plan.\n" +
        "- Documentación: guía o handoff.\n" +
        "- Línea gráfica: aplicación de brand."
      );
    }

    if (promptText.includes("propuesta tipo \"sandwich\"")) {
      return (
        "PROPUESTA:\n" +
        "1) Beneficios: velocidad, diseño premium, medición.\n" +
        "2) Inversión: oferta vigente.\n" +
        "3) Beneficios hoy: soporte inicial, estructura lista."
      );
    }

    if (promptText.includes("visualizador web")) {
      return JSON.stringify({
        slogan: "Liderando la Innovación Digital",
        services: ["Consultoría Estratégica", "Desarrollo a Medida", "Transformación Digital"],
      });
    }

    return "Procesando respuesta estratégica...";
  };

  // Sin API KEY: usa mock
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 400));
    return getMockResponse(prompt);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data: unknown = await response.json();
    const anyData = data as any;
    return anyData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return getMockResponse(prompt);
  }
};

/** =========================
 * APP
 * ========================= */

export default function App() {
  const [view, setView] = useState<ViewState>("hero");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [recommendedPlan, setRecommendedPlan] = useState<Plan | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [aiActions, setAiActions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false); // ✅ faltaba

  const calculatePlan = (finalScore: number): Plan => {
    if (finalScore <= PLANS.BASE.max) return PLANS.BASE;
    if (finalScore <= PLANS.CORPORATIVO.max) return PLANS.CORPORATIVO;
    if (finalScore <= PLANS.INFRAESTRUCTURA.max) return PLANS.INFRAESTRUCTURA;
    return PLANS.IA;
  };

  const handleReset = (): void => {
    setView("hero");
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setRecommendedPlan(null);
    setAiAnalysis("");
    setAiActions([]);
    setIsAiLoading(false);
  };

  const handleAnswer = (points: number, answerText: string): void => {
    const newScore = score + points;
    setScore(newScore);

    const newAnswers: AnswerItem[] = [
      ...answers,
      { question: QUESTIONS[currentQuestion].text, answer: answerText },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      void finishQuiz(newScore, newAnswers);
    }
  };

  const finishQuiz = async (
    finalScore: number,
    finalAnswers: AnswerItem[]
  ): Promise<void> => {
    const plan = calculatePlan(finalScore);
    setRecommendedPlan(plan);
    setView("analyzing");
    setIsAiLoading(true);

    try {
      const userProfile = finalAnswers
        .map((a) => `- ${a.question}: ${a.answer}`)
        .join("\n");

      const prompt = `
Actúa como un arquitecto de soluciones digitales experto en "Infraestructura Web".
Analiza el siguiente perfil de cliente:
${userProfile}

El plan recomendado es: ${plan.name}.

Tarea:
1. Escribe un análisis breve (máximo 50 palabras) y personalizado con un tono futurista y profesional.
2. Genera 3 "Acciones Tácticas Inmediatas" (max 6 palabras cada una).

Formato de respuesta (JSON puro sin markdown):
{
  "analysis": "Texto del análisis aquí...",
  "actions": ["Acción 1", "Acción 2", "Acción 3"]
}
`.trim();

      const resultText = await generateGeminiContent(prompt);

      let analysisData: { analysis: string; actions: string[] } = {
        analysis: plan.description,
        actions: ["Definir estructura", "Seleccionar Hosting", "Diseño UI/UX"],
      };

      if (resultText) {
        try {
          const cleanText = resultText.replace(/```json|```/g, "").trim();
          if (cleanText.startsWith("{")) {
            analysisData = JSON.parse(cleanText) as {
              analysis: string;
              actions: string[];
            };
          } else {
            analysisData.analysis = cleanText.slice(0, 150) + "...";
          }
        } catch {
          analysisData.analysis = resultText;
        }
      }

      setAiAnalysis(analysisData.analysis);
      setAiActions(Array.isArray(analysisData.actions) ? analysisData.actions : []);
    } catch {
      setAiAnalysis(plan.description);
      setAiActions(["Contactar soporte", "Revisar requisitos", "Planificar inicio"]);
    } finally {
      setTimeout(() => {
        setIsAiLoading(false);
        setView("result");
      }, 900);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], x: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/20 blur-[100px] rounded-full mix-blend-screen"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Laser */}
        <motion.div
          className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_rgba(34,211,238,0.8)] z-0 pointer-events-none"
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-purple-500/40 z-0 pointer-events-none"
          initial={{ top: "110%" }}
          animate={{ top: "-10%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <HeroSection key="hero" onStart={() => setView("quiz")} />
          )}

          {view === "quiz" && (
            <QuizSection
              key="quiz"
              question={QUESTIONS[currentQuestion]}
              currentStep={currentQuestion + 1}
              totalSteps={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          )}

          {view === "analyzing" && (
            <AnalyzingSection key="analyzing" isLoading={isAiLoading} />
          )}

          {view === "result" && recommendedPlan && (
            <ResultSection
              key="result"
              plan={recommendedPlan}
              score={score}
              aiAnalysis={aiAnalysis}
              aiActions={aiActions}
              answers={answers}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** =========================
 * SECTIONS
 * ========================= */

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="text-center max-w-5xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      >
        <Sparkles size={14} className="animate-pulse" /> Inteligencia Artificial
        Generativa Integrada
      </motion.div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-white leading-[1.1]">
        Diagnóstico IA para <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-text-shimmer bg-[length:200%_auto]">
          Infraestructura Web
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
        Tu visión no cabe en una plantilla estándar. Nuestra{" "}
        <strong className="text-cyan-200 font-normal">IA</strong> decodifica el
        ADN de tu negocio para construir la infraestructura digital que{" "}
        <strong className="text-white">vende, conecta y escala</strong> por ti.
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6,182,212,0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/20"
        type="button"
      >
        <span className="relative z-10 flex items-center gap-3 tracking-wide">
          INICIAR ANÁLISIS{" "}
          <ChevronRight
            size={22}
            className="group-hover:translate-x-1 transition-transform"
          />
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.button>
    </motion.div>
  );
}

function AnalyzingSection({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 border border-cyan-500/20 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.div
          className="absolute inset-4 border border-purple-500/20 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        />
        <motion.div
          className="w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-purple-600/10 rounded-full backdrop-blur-md border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          <Cpu className="text-cyan-400" size={40} />
        </motion.div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 mb-4 animate-pulse tracking-tight">
        Descodificando tu ADN Digital...
      </h2>
      <p className="text-slate-400 text-lg">
        {isLoading
          ? "Analizando patrones de mercado para estructurar tu éxito."
          : "Finalizando análisis..."}
      </p>
    </motion.div>
  );
}

function QuizSection({
  question,
  currentStep,
  totalSteps,
  onAnswer,
}: {
  question: Question;
  currentStep: number;
  totalSteps: number;
  onAnswer: (points: number, answerText: string) => void;
}) {
  const progress = (currentStep / totalSteps) * 100;
  const [modalData, setModalData] = useState<ModalData | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-2xl relative"
    >
      <div className="mb-8 w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      <div className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <span className="text-cyan-500 font-mono text-xs tracking-[0.2em] mb-4 block uppercase flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          Recolección de Datos {String(currentStep).padStart(2, "0")}/
          {String(totalSteps).padStart(2, "0")}
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
          {question.text}
        </h2>
        {question.subtext ? (
          <p className="text-sm text-slate-400 mb-8">{question.subtext}</p>
        ) : (
          <div className="mb-8" />
        )}

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {question.options.map((option, idx) => {
            const isRecommended = Boolean(option.isRecommended);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-stretch gap-2 ${
                  isRecommended ? "mt-4" : ""
                }`}
              >
                {isRecommended && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-3 left-6 px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest rounded-t-md z-20"
                  >
                    RECOMENDADO
                  </motion.div>
                )}

                <button
                  onClick={() => onAnswer(option.points, option.text)}
                  className={`w-full text-left p-6 rounded-2xl border bg-slate-800/30 transition-all duration-300 group flex items-center justify-between ${
                    isRecommended
                      ? "border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                      : "border-white/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:bg-cyan-900/20 hover:border-cyan-500/40"
                  }`}
                  type="button"
                >
                  <span
                    className={`text-lg font-medium transition-colors ${
                      isRecommended
                        ? "text-[#D4AF37]"
                        : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {option.text}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      isRecommended
                        ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                        : "border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20"
                    }`}
                  >
                    <ChevronRight
                      size={16}
                      className={
                        isRecommended
                          ? "text-[#D4AF37]"
                          : "text-slate-500 group-hover:text-cyan-400"
                      }
                    />
                  </div>
                </button>

                {option.infoBody && option.infoTitle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalData({
                        title: option.infoTitle!,
                        body: option.infoBody!,
                      });
                    }}
                    className="p-4 rounded-2xl border border-white/5 bg-slate-800/30 hover:bg-slate-700/50 text-[#D4AF37] hover:text-yellow-300 hover:shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center shrink-0"
                    title="¿Qué significa?"
                    type="button"
                  >
                    <Info size={20} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {modalData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalData(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setModalData(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 pr-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-[#D4AF37] shrink-0">
                  <Info size={20} />
                </div>
                {modalData.title}
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {modalData.body}
              </div>
              <button
                onClick={() => setModalData(null)}
                className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                type="button"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** =========================
 * RESULT SECTION + SUBCOMPONENTS
 * ========================= */

const ScopeBlock = ({ plan }: { plan: Plan }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const scopeItems = getScopeData(plan.name);
  const visibleItems = expanded ? scopeItems : scopeItems.slice(0, 3);

  return (
    <div className="mb-10 p-6 md:p-8 bg-slate-800/30 rounded-[2rem] border border-slate-700/50 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <Settings size={24} className="text-cyan-400" /> Alcance incluido
            (metodología / infra)
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Lo que recibes y cómo se implementa tu {plan.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200 transition-all">
        {visibleItems.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/40 border border-white/5"
          >
            <div className="mt-0.5 shrink-0 p-2 bg-slate-800/80 rounded-lg">
              {item.icon}
            </div>
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1">
                {item.title}
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {scopeItems.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 mx-auto flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors py-2 px-6 rounded-full border border-cyan-500/30 hover:bg-cyan-500/10"
          type="button"
        >
          {expanded ? "Ocultar detalle" : "Ver detalle completo"}
          <ChevronRight
            size={14}
            className={`transform transition-transform ${
              expanded ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>
      )}
    </div>
  );
};

function ResultSection({
  plan,
  score,
  aiAnalysis,
  aiActions,
  answers,
  onReset,
}: {
  plan: Plan;
  score: number;
  aiAnalysis: string;
  aiActions: string[];
  answers: AnswerItem[];
  onReset: () => void;
}) {
  const whatsappNumber = "56967616474";
  const extras = answers.map((a) => `• ${a.question}: ${a.answer}`).join("\n");
  const message = `Hola, realicé el Diagnóstico IA.
Resultado: ${plan.name} (Puntaje: ${score})
Oferta: ${formatCLP(plan.price.offer)} + IVA

Respuestas clave:
${extras}

Tengo algunas dudas y me gustaría más información.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start"
    >
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/20 rounded-[2rem] p-8 md:p-10 relative overflow-visible group shadow-[0_0_60px_rgba(6,182,212,0.1)] backdrop-blur-xl"
      >
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-b-[2rem]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles size={12} /> Diagnóstico Generativo
            </span>

            <button
              onClick={onReset}
              className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-medium transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
              type="button"
            >
              <RefreshCw size={12} /> Volver a analizar
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-white/5">
            <div className="flex-grow">
              <h2 className="text-xl text-slate-400 mb-2 font-light">
                Infraestructura recomendada:
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 leading-tight">
                {plan.name}
              </h3>
            </div>

            <div className="relative group shrink-0 w-full md:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center min-w-[220px]">
                <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full mb-2 shadow-lg shadow-amber-500/50 uppercase tracking-widest">
                  AHORRAS {plan.price.discountLabel}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-slate-500 line-through decoration-red-500/50">
                    {formatCLP(plan.price.normal)}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                    {formatCLP(plan.price.offer)}
                  </span>
                  <span className="text-[10px] text-amber-200/70 font-bold mt-1 uppercase tracking-widest">
                    + IVA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 rounded-2xl border border-white/10">
            <h4 className="text-cyan-300 text-sm font-bold mb-3 flex items-center gap-2">
              <BrainCircuit size={16} /> ANÁLISIS ESTRATÉGICO IA
            </h4>
            <p className="text-slate-200 text-lg leading-relaxed font-light italic">
              "{aiAnalysis || plan.description}"
            </p>
          </div>

          <ScopeBlock plan={plan} />

          <div className="space-y-6 mb-10">
            <h4 className="text-white font-semibold flex items-center gap-3 text-lg">
              <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                <BarChart size={18} className="text-cyan-400" />
              </div>
              Acciones Tácticas Sugeridas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiActions.length > 0
                ? aiActions.map((action, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-cyan-100 text-center flex items-center justify-center font-medium"
                    >
                      {action}
                    </div>
                  ))
                : plan.features.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-cyan-100 text-center"
                    >
                      {f}
                    </div>
                  ))}
            </div>
          </div>

          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-400 font-bold text-xs uppercase mb-1">
                Nota Importante sobre Hosting y Dominio
              </h4>
              <p className="text-amber-200/80 text-xs leading-relaxed">
                Los servicios de <strong>Hosting</strong> y{" "}
                <strong>Dominio</strong> son costos independientes al diseño web.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="#"
              className="flex-1 relative group overflow-hidden bg-gradient-to-r from-[#009EE3] to-[#007eb5] text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,158,227,0.4)] hover:shadow-[0_0_30px_rgba(0,158,227,0.6)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <CreditCard size={20} className="relative z-10" />
              <span className="relative z-10">PAGAR CON MERCADOPAGO</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 relative group overflow-hidden bg-slate-800 hover:bg-slate-700 border border-[#25D366]/30 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/10 hover:border-[#25D366]/60 flex items-center justify-center gap-2"
            >
              <Send size={20} className="text-[#25D366]" />
              <span>DUDAS Y MÁS INFO</span>
            </a>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 h-full">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md flex-grow flex flex-col justify-between"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Smartphone size={20} className="text-purple-400" />
            Roadmap de Implementación
          </h3>

          <div className="relative pl-4 space-y-8 flex-grow">
            <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-800">
              <motion.div
                className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent"
                initial={{ height: "0%" }}
                animate={{ height: "20%" }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>

            {TIMELINE_STEPS.map((step, index) => (
              <TimelineItem
                key={index}
                index={index}
                text={step}
                isCurrent={index === 0}
              />
            ))}
          </div>
        </motion.div>

        <AiChatBot planName={plan.name} userAnswers={answers} plans={PLANS} />
      </div>
    </motion.div>
  );
}

function TimelineItem({
  index,
  text,
  isCurrent,
}: {
  index: number;
  text: string;
  isCurrent: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      className="relative flex items-center gap-4 z-10"
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 backdrop-blur-xl shadow-lg shrink-0 transition-all duration-500 relative ${
          isCurrent
            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110"
            : "bg-slate-900/80 border-slate-700 text-slate-500"
        }`}
      >
        {isCurrent ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <span className="text-xs font-mono font-bold">{index + 1}</span>
        )}
      </div>

      <div
        className={`text-sm transition-colors duration-300 flex items-center gap-3 ${
          isCurrent
            ? "text-white font-medium drop-shadow-md"
            : "text-slate-500"
        }`}
      >
        {text}
        {isCurrent && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1 bg-cyan-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-cyan-900/50 animate-pulse whitespace-nowrap"
          >
            <MapPin size={10} /> ESTÁS AQUÍ
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function AiChatBot({
  planName,
  userAnswers,
  plans,
}: {
  planName: string;
  userAnswers: AnswerItem[];
  plans: Record<string, Plan>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{ role: "ai" | "user"; text: string }>
  >([
    {
      role: "ai",
      text: `Hola, soy tu Consultor Virtual. ¿Tienes dudas sobre el ${planName} o te gustaría comparar con otros planes?`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const context = `Respuestas previas: ${userAnswers
      .map((a) => a.answer)
      .join(", ")}.`;
    const plansInfo = JSON.stringify(plans);

    const prompt = `
Eres el Consultor IA Senior de esta agencia de desarrollo web.
Tu misión: responder dudas y cerrar la venta con ética y claridad.

INFO DE PLANES (JSON):
${plansInfo}

CONTEXTO DEL CLIENTE:
- Plan recomendado: ${planName}
- ${context}

PREGUNTA DEL USUARIO:
"${input}"

REGLAS:
1) Responde siempre (máx 90 palabras).
2) Si preguntan por arquitectura: explica simple.
3) Si preguntan por ambientes: DEV/QA/PROD según complejidad.
4) Precios: usa offer + IVA.
5) Cierre: invita a cotizar y agendar.
`.trim();

    const replyText = await generateGeminiContent(prompt);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: replyText || "Lo siento, tuve un error de conexión." },
    ]);
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-between shadow-lg shadow-purple-900/20 group"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-sm">¿Dudas sobre tu plan?</p>
            <p className="text-purple-200 text-xs">Consulta a la IA experta</p>
          </div>
        </div>
        <ChevronRight className="text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden flex flex-col h-[350px] shadow-2xl"
    >
      <div className="p-4 bg-purple-900/20 border-b border-purple-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm font-bold text-white">Consultor IA</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
          type="button"
        >
          <X size={18} />
        </button>
      </div>

      <div
        className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-950/50"
        ref={scrollRef}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-xs sm:text-sm ${
                m.role === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-xl rounded-bl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 border-t border-purple-500/20 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void handleSend()}
          placeholder="Escribe tu duda..."
          className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          onClick={() => void handleSend()}
          disabled={isTyping}
          className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors disabled:opacity-50"
          type="button"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
}