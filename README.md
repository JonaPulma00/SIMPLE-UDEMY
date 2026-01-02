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
11. [Imatges](#imatges)

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
   PORT=SOCKET_PORT
   APP_URL=FRONTEND_URL
   JWT_SECRET=SECRET_JWT
   ```
   
   **Important**: El secret JWT ha de coincidir amb el del backend per garantir la signatura correcta

2. Inicieu el servidor Socket:
   - Desenvolupament: `npm run dev` (amb nodemon)
   - Producció: `npm start` (amb node estàndard)
3. Atureu amb `Ctrl + C`

### Configuració dels Scripts
1. Creeu l'arxiu `.env.backup` amb:
   ```env
   DB_ROOT_PASSWORD=PASSWORD_ASSIGNAT
   ```
2. Configureu una tasca programada que executi l'script `backup_db.ps1`, o executeu-lo manualment amb: `.\backup_db.ps1`

### Configuració del Frontend
1. Executeu `npm install` i creeu l'arxiu `.env`:
   ```env
   VITE_APP_API_URL=URL_DE_LA_APP
   VITE_GOOGLE_CLIENT_ID=GOOGLE_ID
   VITE_SOCKET_SERVER_URL=SOCKET_URL
   VITE_AVATAR_URL=https://ui-avatars.com/api/
   ```
2. Inicieu el Frontend: `npm run dev`
3. Atureu amb `Ctrl + C`

### Configuració de Docker
1. Creeu l'arxiu `.env`:
   ```env
   MYSQL_ROOT_PASSWORD=ROOT_PASSWORD
   DB_USER=USER
   DB_PASSWORD=CONTRASENYA
   DB_HOST=HOST_ASSIGNAT
   DB_PORT=PORT_ASSIGNAT
   DB_NAME=NOM_DB
   ```
2. Inicieu els contenidors: `docker-compose up -d`
3. Atureu els contenidors: `docker compose down`

### Configuració del Backend
1. Creeu l'arxiu `.env` amb la configuració completa:
   ```env
   # === CONFIGURACIÓ DE BASE DE DADES ===
   DB_USER=USER
   DB_PASSWORD=CONTRASENYA
   DB_HOST=HOST_ASSIGNAT
   DB_PORT=PORT_ASSIGNAT
   DB_NAME=NOM_DB

   # === CONFIGURACIÓ DE REDIS ===
   REDIS_HOST=REDIS_HOST   
   REDIS_PORT=PORT ASSIGNAT

   # === CONFIGURACIÓ JWT ===
   SECRET_KEY=SECRET_KEY_JWT
   JWT_ALGORITHM=ALGORITME_DE_HASH
   ACCESS_TOKEN_EXPIRE_MINUTES=EXPIRACIÓ_ASSIGNADA
   REFRESH_TOKEN_EXPIRE_MINUTES=EXPIRACIÓ_ASSIGNADA

   # === CONFIGURACIÓ AWS ===
   AWS_ACCESS_KEY_ID=KEY
   AWS_SECRET_ACCESS_KEY=ACCESS_KEY
   AWS_SESSION_TOKEN='SESSION_TOKEN'
   AWS_PRESIGNED_URL_EXPIRE_MINUTES=EXPIRACIÓ_ASSIGNADA
   AWS_BUCKET_NAME=NOM_BUCKET_S3
   AWS_REGION=AWS_REGION
   ```
2. Instal·leu les dependències: `pip install -r requirements.txt`
3. Inicieu el Backend: `uvicorn app.main:app --reload`

## Accés als Endpoints

Per visualitzar i provar tots els endpoints disponibles, accediu a la documentació interactiva de Swagger afegint `/docs` a l'URL del backend.

**Exemple**: http://127.0.0.1:8000/docs

## Diagrama Entitat-Relació

![db diagrama](/backend/app/db/databaseDiagram.png)


## Estructura de Directoris

### Frontend
```
├── assets/           # Recursos estàtics
├── components/       # Components reutilitzables
├── context/          # Context de React
├── hooks/            # Hooks personalitzats
├── interceptor/      # Interceptors HTTP
├── pages/            # Pàgines de l'aplicació
├── router/           # Configuració de routing
├── services/         # Serveis i API calls
├── styles/           # Arxius d'estils
├── utils/            # Utilitats compartides
├── App.css           # Estils principals
├── App.jsx           # Component principal
├── main.jsx          # Punt d'entrada
└── 
```

### Backend
```
├── controllers/     # Controladors de la API
├── core/            # Configuració central
├── db/              # Models i configuració de base de dades
├── middlewares/     # Middlewares personalitzats
├── routes/          # Definició de rutes
├── schemas/         # Esquemes Pydantic
├── utils/           # Utilitats del backend
└── main.py          # Punt d'entrada de l'aplicació
```

### Socket
```
├── config/          # Configuració del Socket
├── handlers/        # Manejadors d'esdeveniments
├── middlewares/     # Middlewares del Socket
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


## Imatges

<img width="1902" height="938" alt="image" src="https://github.com/user-attachments/assets/649b1980-5401-4846-ac6e-ce10f627f789" />
<img width="1919" height="937" alt="image" src="https://github.com/user-attachments/assets/d2019fb4-b7f7-459e-97aa-8a17d9b18f1d" />
<img width="1905" height="930" alt="image" src="https://github.com/user-attachments/assets/1feeae37-0b70-4f6b-821b-d530d10bff28" />
<img width="1899" height="926" alt="image" src="https://github.com/user-attachments/assets/08a5636c-4e7b-4306-a472-d6dfcdb450cf" />
<img width="1914" height="923" alt="image" src="https://github.com/user-attachments/assets/dfeff99c-bd4f-470d-ac78-5319dbcaa1ba" />



