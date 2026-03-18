# 📘 Documentazione API con Swagger (OpenAPI)

Questa guida spiega come implementare la documentazione automatica per il progetto. Grazie a **Swagger**, avrai una pagina web interattiva (su `/api-docs`) dove il frontend può consultare gli endpoint e testare le chiamate.

---

## 1. Installazione
Esegui il comando nel terminale:

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

---

## 2. Configurazione (`src/config/swagger.ts`)
Definisci i metadati della tua API e i percorsi dei file da scansionare.

```typescript
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social App API',
      version: '1.0.0',
      description: 'Documentazione ufficiale degli endpoint Post e Video',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Punta ai file dove scriverai i commenti @openapi
  apis: ['./src/modules/**/*.router.ts', './src/modules/**/*.controller.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
```

---

## 3. Montaggio in `app.ts`
Collega la UI al server Express.

```typescript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

## 4. Esempio di Documentazione
Aggiungi questo blocco sopra le rotte nei tuoi router:

```typescript
/**
 * @openapi
 * /api/v1/post/{contentId}/comments:
 * post:
 * summary: Crea un nuovo commento
 * tags: [Comments]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: contentId
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * text:
 * type: string
 * responses:
 * 201:
 * description: Creato
 */
postRouter.post('/:contentId/comments', commentController.create(EntityType.POST));
```

---

## 5. Vantaggi per il Frontend 🚀
* **Test Real-time:** Bottone "Try it out" per chiamate immediate.
* **Contratti ID:** Chiarezza totale su `contentId` vs `commentId`.
* **Auto-Typing:** Possibilità di generare interfacce TypeScript automaticamente.