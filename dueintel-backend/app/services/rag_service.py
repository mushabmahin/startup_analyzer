import os
import chromadb
from chromadb.utils import embedding_functions
import re
import uuid

# Ephemeral client resets for every analysis run to avoid state leakage and save disk space
client = chromadb.EphemeralClient()

# Set up BGE Small embedding function using sentence-transformers
# ChromaDB will download and load this model on first use
bge_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="BAAI/bge-small-en-v1.5"
)

def chunk_text(text: str, chunk_size: int = 600, overlap: int = 150):
    """
    Split text into chunks of chunk_size characters with overlap.
    """
    # Clean up excess whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def build_rag_context(text: str):
    """
    1. Chunk the extracted PDF text.
    2. Add chunks to an ephemeral ChromaDB collection.
    3. Query for key VC topics.
    4. Compile retrieved context for the LLM.
    """
    chunks = chunk_text(text)
    if not chunks:
        return ""
    
    # Create a unique collection name for this run
    collection_name = f"startup_{uuid.uuid4().hex[:8]}"
    
    collection = client.create_collection(
        name=collection_name,
        embedding_function=bge_ef
    )
    
    # Add documents to collection
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    collection.add(
        documents=chunks,
        ids=ids
    )
    
    # Define query topics for startup due diligence
    queries = {
        "profile": "startup name, founding team, industry sector, business type",
        "problem": "problem statement, customer pain point, industry challenges",
        "solution": "product description, core solution, features, technology, value proposition",
        "market": "target market size, total addressable market TAM SAM SOM, market opportunity",
        "revenue": "revenue model, pricing strategy, how the company makes money, business model",
        "strengths": "key strengths, technical moat, competitive advantage, unique differentiators",
        "risks": "financial risks, operational risks, competition, legal challenges, weaknesses",
        "metrics": "current revenue, ARR, sales cycle, gross margins, traction, pilot programs"
    }
    
    context_parts = []
    
    for topic, query_str in queries.items():
        # Query ChromaDB for the 3 most relevant chunks
        results = collection.query(
            query_texts=[query_str],
            n_results=min(3, len(chunks))
        )
        
        retrieved_docs = results.get("documents", [[]])[0]
        context_block = "\n".join(retrieved_docs)
        
        context_parts.append(f"[{topic.upper()} DETAILS]\n{context_block}")
    
    # Delete the collection after querying to free memory
    client.delete_collection(name=collection_name)
    
    return "\n\n".join(context_parts)
