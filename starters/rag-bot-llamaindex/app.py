from fastapi import FastAPI
from observability import init_observability

try:
    from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
except Exception:
    VectorStoreIndex = None
    SimpleDirectoryReader = None

app = FastAPI(title="LlamaIndex RAG")
init_observability("rag-bot-llamaindex", fastapi_app=app)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/query")
def query(q: str):
    if VectorStoreIndex is None:
        return {"answer": "Install llama-index to run this starter"}
    # Example-only; replace with persistent index
    docs = SimpleDirectoryReader("./data").load_data()
    idx = VectorStoreIndex.from_documents(docs)
    eng = idx.as_query_engine()
    ans = eng.query(q)
    return {"answer": str(ans)}
