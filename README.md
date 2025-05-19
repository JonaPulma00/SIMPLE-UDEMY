# Documentació del Projecte - Plataforma de Cursos

## Índex

1. [Descripció del Projecte](#descripció-del-projecte)
2. [Tecnologies Utilitzades](#tecnologies-utilitzades)
3. [Requisits Previs](#requisits-previs)
4. [Configuració de Google Cloud](#configuració-de-google-cloud)
   - 4.1. [Creació d'un projecte nou](#1-creació-dun-projecte-nou)
   - 4.2. [Configuració de la pantalla de consentiment OAuth](#2-configuració-de-la-pantalla-de-consentiment-oauth)
   - 4.3. [Creació de les credencials OAuth](#3-creació-de-les-credencials-oauth-client-id)
5. [Configuració de bucket S3 amb CORS](#configuració-de-bucket-s3-amb-cors-aws-academy)
   - 5.1. [Creació del bucket](#1-creació-del-bucket)
   - 5.2. [Configuració de CORS](#2-configuració-de-cors)
   - 5.3. [Verificació](#3-verificació)
6. [Procediment d'Inicialització](#procediment-dinicialització)
   - 6.1. [Configuració del Socket](#configuració-del-socket)
   - 6.2. [Configuració dels Scripts](#configuració-dels-scripts)
   - 6.3. [Configuració del Frontend](#configuració-del-frontend)
   - 6.4. [Configuració de Docker](#configuració-de-docker)
   - 6.5. [Configuració del Backend](#configuració-del-backend)
7. [Accés als Endpoints](#accés-als-endpoints)
8. [Diagrama Entitat-Relació](#diagrama-entitat-relació)
9. [Estructura de Directoris](#estructura-de-directoris)
   - 9.1. [Frontend](#frontend)
   - 9.2. [Backend](#backend)
   - 9.3. [Socket](#socket)
10. [Dependències i Funcionalitats](#dependències-i-funcionalitats)

---

## Descripció del Projecte

Plataforma per visualitzar i crear cursos (clon d'Udemy amb funcionalitats bàsiques), que inclou capacitats de streaming on els usuaris es poden connectar en un mode similar a Twitch.

## Tecnologies Utilitzades

- **Frontend**: React JS (19) + Vite
- **Backend**: FastAPI (0.115.11)
- **Socket**: Socket.IO (4.8.1)

## Requisits Previs

### Instal·lació de MySQL Workbench
Descarregueu MySQL Workbench des del lloc oficial i seleccioneu la versió corresponent al vostre sistema operatiu.

## Configuració de Google Cloud

### 1. Creació d'un projecte nou
1. Accediu a [Google Cloud Console](https://console.cloud.google.com)
2. A la part superior, cliqueu al selector de projectes i després a "Nou projecte"
3. Assigneu un nom al projecte i creeu-lo

### 2. Configuració de la pantalla de consentiment OAuth
1. Al menú lateral, aneu a: **"APIs i serveis" > "Pantalla de consentiment OAuth"**
2. Seleccioneu el tipus d'usuari:
   - **Extern**: si l'aplicació serà accessible per a qualsevol usuari amb compte de Google
3. Completeu els camps obligatoris:
   - Nom de l'aplicació
   - Correu electrònic de suport
   - (Opcional però recomanat): URL de la política de privacitat i condicions del servei
   - Dominis autoritzats (si s'utilitzen)
4. Deseu i publiqueu la pantalla de consentiment (o manteniu-la en mode de prova, que permet fins a 100 usuaris de test)

### 3. Creació de les credencials OAuth (Client ID)
1. Aneu a: **"APIs i serveis" > "Credencials"**
2. Cliqueu a "Crear credencials" > "ID de client OAuth"
3. Seleccioneu el tipus d'aplicació: **Aplicació web**
4. Completeu els camps requerits:
   - **Orígens autoritzats de JavaScript** (exemple: `http://localhost:5200` per a desenvolupament local)
5. Creeu les credencials i guardeu:
   - El **Client ID**
   - El **Client Secret**

## Configuració de bucket S3 amb CORS (AWS Academy)

### 1. Creació del bucket
1. Accediu a S3 a la consola d'AWS
2. Cliqueu a **Create bucket**
3. Assigneu un nom (exemple: `myed-project`)
4. **Regió**: seleccioneu qualsevol disponible (exemple: `us-east-1`)
5. A **Object Ownership**, seleccioneu: **Bucket owner enforced**
6. Desactiveu **"Block all public access"** (únicament per a desenvolupament)
7. Creeu el bucket

### 2. Configuració de CORS
1. Aneu a la pestanya **Permissions > CORS configuration**
2. Afegiu la següent configuració JSON:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://127.0.0.1:8000/",
      "http://localhost:5200"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 3. Verificació
Un cop configurada, ja podeu realitzar peticions GET, PUT, etc. al bucket des d'aplicacions locals.

**Nota**: No cal afegir bucket policy ni IAM mentre treballeu dins d'AWS Academy amb els permisos provisionats pel curs.

## Procediment d'Inicialització

### Configuració del Socket
1. Executeu `npm install` i creeu l'arxiu `.env` amb el següent contingut:
   ```env
   PORT=3500
   APP_URL=http://localhost:5200
   JWT_SECRET=6bc8ace84472b2b5e74eb58d7a6fcf7a79141e324c54a4257f5a550ebb882555
   ```
   
   **Important**: El secret JWT ha de coincidir amb el del backend per garantir la signatura correcta

2. Inicieu el servidor Socket:
   - Desenvolupament: `npm run dev` (amb nodemon)
   - Producció: `npm start` (amb node estàndard)
3. Atureu amb `Ctrl + C`

### Configuració dels Scripts
1. Creeu l'arxiu `.env.backup` amb:
   ```env
   DB_ROOT_PASSWORD=Patata123*
   ```
2. Configureu una tasca programada que executi l'script `backup_db.ps1`, o executeu-lo manualment amb: `.\backup_db.ps1`

### Configuració del Frontend
1. Executeu `npm install` i creeu l'arxiu `.env`:
   ```env
   VITE_APP_API_URL=http://127.0.0.1:8000/api/v1
   VITE_GOOGLE_CLIENT_ID=149066278626-1sfsa01j3ib30038mmchar8h89j64nu1.apps.googleusercontent.com
   VITE_SOCKET_SERVER_URL=http://localhost:3500
   VITE_AVATAR_URL=https://ui-avatars.com/api/
   ```
2. Inicieu el Frontend: `npm run dev`
3. Atureu amb `Ctrl + C`

### Configuració de Docker
1. Creeu l'arxiu `.env`:
   ```env
   MYSQL_ROOT_PASSWORD=Patata123*
   DB_USER=root
   DB_PASSWORD=myed123
   DB_HOST=mysql
   DB_PORT=3306
   DB_NAME=projecteDb
   ```
2. Inicieu els contenidors: `docker-compose up -d`
3. Atureu els contenidors: `docker compose down`

### Configuració del Backend
1. Creeu l'arxiu `.env` amb la configuració completa:
   ```env
   # === CONFIGURACIÓ DE BASE DE DADES ===
   DB_USER=root
   DB_PASSWORD=Patata123*
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=projecteDB

   # === CONFIGURACIÓ DE REDIS ===
   REDIS_HOST=localhost
   REDIS_PORT=6380

   # === CONFIGURACIÓ JWT ===
   SECRET_KEY=6bc8ace84472b2b5e74eb58d7a6fcf7a79141e324c54a4257f5a550ebb882555
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1200
   REFRESH_TOKEN_EXPIRE_MINUTES=604800

   # === CONFIGURACIÓ AWS ===
   AWS_ACCESS_KEY_ID=ASIATWZMDDJVST4RO73P
   AWS_SECRET_ACCESS_KEY=tFrdhYikWL/zQbjbjDI0zMuDfgde2g4ZT1HQwo+S
   AWS_SESSION_TOKEN='IQoJb3JpZ2luX2VjENb//////////wEaCXVzLXdlc3QtMiJGMEQCIADg5qI25Avb9JyWg15iMYnsMKj0eonKJ2KIsDlqkFTTAiAeYXVKMvQrRveFoEPxNRdEgAuTQVKr3LV7aUMSQkZcEyqrAgiP//////////8BEAEaDDI1NTEwNjE2MTI1OSIM2P3Was0wy6b1u8I0Kv8BrazBtZlHKH2JGNSgOcZ0FXXAv4PcQ3upGSLqN8ljagQFgCHGRWFQD7BiX3DerKd0x6YEpDPCeKU4c0sIsLbAc1mCCjn2vcmoZmfGkmhmjtsDgCTOq2q4lSsHzdw76/aUd1JyMSWyYjyqd4/ZaolY1yvWEFxLr6C4v3+dzGh6neM1SQJy5jWD2JHLvjO2QjpPMSHn+h0pivZzIOGXks+i+iRz+G3EOIHMS6OZyUPyX+gq8fSssEfZINEool8fYJ3T/B6VSaVO64YZUPBHn4q3xg5LkfbvV+Ddt2PmYsoElVLQ2u20XCEe0ImJ29a5SCWgM5P+y6S9C5YKasgJkyVSMLrhrMEGOp4BLxAMkMbLjPJRb0zAC8sQynBbQ+nL/iPlT9sKE7+KhYEFHXv4XPzJbODXjXp7Z9ecfNeySCPTSioOqdrKJpgacHQG8ZtTZNkhfMrJcMG+47JjmdYLzkwaQMTmp1CrRG+jDBGYGzeoXYRpf+9rdyAgPzZhAeRKRZx7QealPSPxA2Uc/EucFCOdPFHXUMhqiunWA7dwSApeeT6C45p8334='
   AWS_PRESIGNED_URL_EXPIRE_MINUTES=3600
   AWS_BUCKET_NAME=myed-project
   AWS_REGION=us-east-1
   ```
2. Instal·leu les dependències: `pip install -r requirements.txt`
3. Inicieu el Backend: `uvicorn app.main:app --reload`

## Accés als Endpoints

Per visualitzar i provar tots els endpoints disponibles, accediu a la documentació interactiva de Swagger afegint `/docs` a l'URL del backend.

**Exemple**: http://127.0.0.1:8000/docs

## Diagrama Entitat-Relació

*S'inclourà la imatge del diagrama corresponent*

## Estructura de Directoris

### Frontend
```
├── assets/           # Recursos estàtics
├── components/       # Components reutilitzables
├── context/          # Context de React
├── hooks/            # Hooks personalitzats
├── interceptor/      # Interceptors HTTP
├── node_modules/     # Dependències de Node.js
├── pages/            # Pàgines de l'aplicació
├── router/           # Configuració de routing
├── services/         # Serveis i API calls
├── styles/           # Arxius d'estils
├── utils/            # Utilitats compartides
├── App.css           # Estils principals
├── App.jsx           # Component principal
├── main.jsx          # Punt d'entrada
└── package-lock.json # Lockfile de NPM
```

### Backend
```
├── controllers/      # Controladors de la API
├── core/            # Configuració central
├── db/              # Models i configuració de base de dades
├── middlewares/     # Middlewares personalitzats
├── routes/          # Definició de rutes
├── schemas/         # Esquemes Pydantic
├── utils/           # Utilitats del backend
├── __pycache__/     # Cache de Python
└── main.py          # Punt d'entrada de l'aplicació
```

### Socket
```
├── config/          # Configuració del Socket
├── handlers/        # Manejadors d'esdeveniments
├── middlewares/     # Middlewares del Socket
├── node_modules/    # Dependències de Node.js
├── .env             # Variables d'entorn
├── .gitignore       # Arxius ignorats per Git
├── package-lock.json # Lockfile de NPM
├── package.json     # Configuració del projecte
└── server.js        # Servidor Socket.IO
```

## Dependències i Funcionalitats

| Dependència | Versió | Descripció |
|-------------|--------|------------|
| **fastapi** | 0.115.11 | Framework web modern per Python, optimitzat per crear APIs amb Pydantic i Starlette |
| **uvicorn** | 0.34.0 | Servidor ASGI d'alt rendiment per executar aplicacions FastAPI |
| **sqlalchemy[asyncio]** | 2.0.38 | ORM per gestionar bases de dades de forma sincrònica i asincrònica |
| **asyncmy** | 0.2.10 | Driver asíncron per MySQL, compatible amb SQLAlchemy Async |
| **python-dotenv** | 1.0.1 | Carrega variables d'entorn des d'arxius .env |
| **bcrypt** | 4.3.0 | Biblioteca per al xifratge de contrasenyes amb algoritme bcrypt |
| **pyjwt** | 2.10.1 | Implementació de JSON Web Tokens per a autenticació |
| **email-validator** | 2.2.0 | Validació d'adreces de correu electrònic |
| **redis** | 5.2.1 | Client per interactuar amb base de dades Redis en memòria |
| **boto3** | 1.28.18 | SDK oficial d'AWS per interactuar amb serveis com S3, DynamoDB |
| **slowapi** | 0.1.9 | Implementació de rate limiting per prevenir abús d'APIs |
| **limits** | 5.2.0 | Gestió i definició de límits de peticions |
| **deprecated** | 1.2.18 | Marcatge de funcions obsoletes amb avisos |
| **packaging** | 25.0 | Eines per gestió de versions i especificacions de paquets |
| **wrapt** | 1.17.2 | Utilitats per crear decoradors i gestionar funcions encapsulades |
