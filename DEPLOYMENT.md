# Guia de Implantação no Vercel - Empório Do Trigo

Este documento explica como subir o projeto no Vercel.

## Configurações no Dashboard do Vercel

Ao importar o projeto no Vercel, utilize as seguintes configurações:

1.  **Framework Preset**: Outro (ou Vite, se detectado automaticamente).
2.  **Root Directory**: `EDT`
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    Adicione as seguintes variáveis de ambiente:
    *   `VITE_SUPABASE_URL`: Sua URL do Supabase.
    *   `VITE_SUPABASE_ANON_KEY`: Sua Anon Key do Supabase.
    *   `GEMINI_API_KEY`: Sua chave do Google Gemini.

## Configurações Incluídas no Projeto

*   **`EDT/vercel.json`**: Configura o roteamento para Single Page Application (SPA), garantindo que as rotas do React Router funcionem corretamente após o deploy.

## Como fazer o Deploy

1.  Dê um `git push` com as alterações atuais.
2.  Conecte seu repositório no Vercel.
3.  Configure o diretório raiz como `EDT`.
4.  Adicione as variáveis de ambiente mencionadas acima.
5.  Clique em **Deploy**.
