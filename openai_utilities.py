from openai import OpenAI

def openai_query(query):
    client = OpenAI(api_key='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')

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": query}
    ]
    )
    return (completion.choices[0].message.content)