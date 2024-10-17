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