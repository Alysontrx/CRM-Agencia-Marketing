with open('pipeline.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix broken template literals from PowerShell
content = content.replace('`ha h`', "'ha ' + hours + 'h'")
content = content.replace('`ha d`', "'ha ' + days + 'd'")

with open('pipeline.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed pipeline.js')
