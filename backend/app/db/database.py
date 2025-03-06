import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text


load_dotenv()

DB_USER = os.getenv('DB_USER', 'default_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'default_pass')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'default_db')

if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
    raise ValueError("Missing database environment variables!")


DB_URL = f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_async_engine(DB_URL, echo=True)

SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session

async def test_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))  
            print("Successfully connected to MySQL!")
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        await engine.dispose() 

if __name__ == "__main__":
    asyncio.run(test_connection())  
