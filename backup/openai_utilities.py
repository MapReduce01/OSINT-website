from openai import OpenAI

def openai_query(query):
    client = OpenAI(api_key='')

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": query}
    ]
    )
    return (completion.choices[0].message.content)