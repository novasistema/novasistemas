import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Health check endpoint for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Helper for smart fallback copy if API key is not present or network issues arise
function generateSmartFallbackCopy(name?: string, category?: string, draft?: string, style?: string) {
  const sysName = (name || 'Sistema de Gestión').trim();
  const cat = (category || 'Gestión Comercial').trim();
  const cleanDraft = (draft || '').trim();

  let copy = '';
  let tagline = `Potencia tu negocio con ${sysName}`;
  let benefits = [
    'Control de ventas y facturación en tiempo real',
    'Gestión ágil de inventario y stock crítico',
    'Acceso 100% online desde cualquier dispositivo'
  ];
  let targetAudience = `Comercios y empresas del rubro ${cat.toLowerCase()}`;

  if (style === 'compact') {
    copy = `Solución integral diseñada para ${cat.toLowerCase()}. Automatiza cobros, inventario y cuentas corrientes en una sola pantalla ágil y sin complicaciones.`;
  } else if (style === 'features') {
    copy = `${sysName} ofrece módulos avanzados para ${cat.toLowerCase()}: punto de venta (POS) ultra rápido, control preciso de existencias con alertas de faltantes, facturación electrónica y reportes de rentabilidad en tiempo real.`;
    tagline = 'Control total y reportes en tiempo real';
  } else if (style === 'professional') {
    copy = `Plataforma corporativa de alto rendimiento orientada a empresas de ${cat.toLowerCase()}. Optimiza la toma de decisiones con métricas clave de flujo de fondos, trazabilidad de clientes y máxima seguridad en tus operaciones diarias.`;
    tagline = 'Eficiencia y trazabilidad corporativa';
  } else {
    // Persuasive / Sales
    copy = `Multiplica la rentabilidad de tu negocio con ${sysName}. Olvídate de los errores de caja y la pérdida de mercadería: gestiona clientes, presupuestos y ventas con la herramienta más rápida y confiable del mercado.`;
    tagline = 'Vende más y controla todo tu negocio';
  }

  if (cleanDraft && cleanDraft.length > 5 && !cleanDraft.toLowerCase().includes('sistema')) {
    copy = `${cleanDraft}. ${copy}`;
  }

  return { copy, tagline, benefits, targetAudience };
}

// AI Copy Generator endpoint for products and sales copy
app.post('/api/gemini/generate-copy', async (req, res) => {
  try {
    const { name, category, draftText, style } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = generateSmartFallbackCopy(name, category, draftText, style);
      return res.json({
        ...fallback,
        source: 'local-fallback'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const styleMap: Record<string, string> = {
      persuasive: 'Estilo comercial y persuasivo: enfocado en psicología de ventas para redes sociales, beneficios concretos, resolver dolores y cerrar compras.',
      features: 'Estilo técnico y de módulos: destaca funcionalidades claves (caja, inventario, facturación, alertas automáticas, reportes de rentabilidad).',
      compact: 'Estilo conciso y directo: 2 oraciones breves y contundentes, ideales para fichas rápidas y catálogos móviles.',
      professional: 'Estilo corporativo y formal: resalta orden administrativo, trazabilidad, seguridad y escalabilidad para medianas y grandes empresas.'
    };

    const styleDesc = styleMap[style] || styleMap.persuasive;

    const prompt = `
Actúa como un redactor publicitario senior (copywriter) especializado en software B2B y aplicaciones empresariales de la empresa "Nova AJ".
Tu misión es generar el copy comercial y la descripción para publicar y vender el siguiente software:

- Nombre del producto/sistema: "${name || 'Sistema de Gestión'}"
- Categoría / Rubro: "${category || 'Sistemas Empresariales'}"
- Borrador o notas existentes del usuario: "${draftText || 'Ninguno'}"
- Enfoque deseado: ${styleDesc}

Instrucciones:
1. Redacta en español (tono profesional y atractivo para clientes comerciales de Argentina y Latinoamérica).
2. Resalta problemas que resuelve (ahorro de tiempo, control de stock, orden financiero, cobros rápidos) y conveniencia (100% web, entrega inmediata).
3. Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "copy": "Texto principal de descripción (2 a 4 oraciones potentes y fluidas)",
  "tagline": "Eslogan o frase corta de impacto (máximo 8 palabras)",
  "benefits": ["Beneficio clave 1", "Beneficio clave 2", "Beneficio clave 3"],
  "targetAudience": "Público objetivo recomendado (ej: Ferreterías, corralones y distribuidoras)"
}

Responde ÚNICAMENTE con el JSON válido.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch {
      parsedData = { copy: responseText.trim() };
    }

    return res.json({
      copy: parsedData.copy || responseText.trim(),
      tagline: parsedData.tagline || '',
      benefits: parsedData.benefits || [],
      targetAudience: parsedData.targetAudience || '',
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Error generating copy with Gemini:', error);
    const { name, category, draftText, style } = req.body || {};
    const fallback = generateSmartFallbackCopy(name, category, draftText, style);
    return res.json({
      ...fallback,
      source: 'error-fallback'
    });
  }
});

// Helper for smart fallback plans
function generateSmartFallbackPlans(name?: string, category?: string, basePrice?: number) {
  const price = basePrice && basePrice > 0 ? basePrice : 25000;
  const p1 = Math.max(5000, Math.round((price * 0.7) / 1000) * 1000);
  const p2 = price;
  const p3 = Math.round((price * 1.6) / 1000) * 1000;
  const cat = (category || 'Comercios').toLowerCase();

  return [
    {
      id: 'plan-basic',
      name: 'Plan Inicial / Básico',
      price: p1,
      period: 'Pago Único' as const,
      badge: 'Económico',
      isPopular: false,
      description: `Ideal para pequeños negocios o emprendedores que inician en el rubro ${cat}.`,
      features: [
        '1 Puesto de Venta / Usuario',
        'Control de stock e inventario base',
        'Registro de ventas rápidas y clientes',
        'Emisión de comprobantes y tickets',
        'Soporte técnico estándar vía WhatsApp'
      ]
    },
    {
      id: 'plan-pro',
      name: 'Plan Pro Comercial',
      price: p2,
      period: 'Pago Único' as const,
      badge: 'Más Vendido',
      isPopular: true,
      description: `El paquete completo y más elegido para gestionar todo el rubro ${cat} sin límites.`,
      features: [
        'Hasta 3 Puestos de Venta en simultáneo',
        'Control avanzado de stock con alertas críticas',
        'Cuentas corrientes, saldos y fiados de clientes',
        'Caja diaria con apertura, cierres y balance',
        'Estadísticas y gráficos de rentabilidad mensual',
        'Instalación y puesta en marcha 1 a 1 de Nova AJ'
      ]
    },
    {
      id: 'plan-full',
      name: 'Plan Full Enterprise',
      price: p3,
      period: 'Pago Único' as const,
      badge: 'Completo',
      isPopular: false,
      description: 'Para empresas consolidadas, múltiples sucursales o franquicias con soporte 24/7.',
      features: [
        'Usuarios y puestos de venta ilimitados',
        'Multi-sucursal o gestión de múltiples depósitos',
        'Auditoría completa de cajeros y permisos avanzados',
        'Acceso al código fuente en GitHub y despliegue Vercel',
        'Capacitación a todo tu personal y soporte prioritario',
        'Adaptaciones de módulos o reportes a medida'
      ]
    }
  ];
}

// AI Plans Generator endpoint (3 planes con distintos precios y módulos)
app.post('/api/gemini/generate-plans', async (req, res) => {
  try {
    const { name, category, basePrice } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ plans: generateSmartFallbackPlans(name, category, basePrice) });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
Actúa como un experto en pricing de software empresarial de Nova AJ.
Genera 3 planes comerciales escalonados para la venta del siguiente sistema:
- Nombre: "${name || 'Sistema de Gestión'}"
- Rubro/Categoría: "${category || 'Sistemas Empresariales'}"
- Precio base sugerido: ${basePrice || 25000} ARS

Instrucciones:
1. Diseña exactamente 3 planes comerciales:
   - Plan 1 (Básico / Inicial): precio accesible (~65-75% del precio base). Módulos esenciales.
   - Plan 2 (Pro / Comercial): el plan recomendado estrella (~100% precio base). isPopular: true.
   - Plan 3 (Full / Enterprise / Multi-Sucursal): paquete completo (~150-180% precio base) con módulos avanzados y soporte prioritario.
2. Cada plan debe tener:
   - id: string
   - name: string
   - price: number (precio redondo en ARS)
   - period: "Pago Único" o "Mensual"
   - badge: string (ej: "Económico", "Más Vendido", "Empresarial")
   - isPopular: boolean (true solo en el plan 2)
   - description: string (1 oración explicativa)
   - features: array de strings (entre 4 y 6 módulos y beneficios específicos para este software)

Devuelve ÚNICAMENTE un objeto JSON con el formato:
{
  "plans": [
    ... los 3 planes ...
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText.trim());
    return res.json({ plans: parsed.plans || generateSmartFallbackPlans(name, category, basePrice) });
  } catch (err) {
    console.error('Error generating plans with Gemini:', err);
    const { name, category, basePrice } = req.body || {};
    return res.json({ plans: generateSmartFallbackPlans(name, category, basePrice) });
  }
});

const distPath = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // Dynamic import in dev mode
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nova AJ server listening on port ${PORT}`);
});
