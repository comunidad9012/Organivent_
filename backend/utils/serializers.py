from bson import ObjectId

def serialize_doc(doc):
    """Convierte ObjectId y estructuras anidadas a string para JSON."""
    if not doc:
        return doc
    serialized = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):  
            serialized[k] = str(v)
        elif isinstance(v, dict):  # <-- corregido
            serialized[k] = serialize_doc(v)
        elif isinstance(v, list):
            serialized[k] = [
                serialize_doc(i) if isinstance(i, dict)
                else (str(i) if isinstance(i, ObjectId) else i)
                for i in v
            ]
        else:
            serialized[k] = v
    return serialized
