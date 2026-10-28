"""Regenera seed SQL determinístico a partir do catálogo fictício do PIT I."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
products = json.loads((root / 'database' / 'catalog.json').read_text(encoding='utf-8'))


def quote(value):
    return str(value) if isinstance(value, (int, float)) else "'" + value.replace("'", "''") + "'"


rows = ['-- Dados fictícios para demonstração acadêmica. Não altera produtos já existentes.']
ingredients = sorted({ingredient for product in products for ingredient in product['ingredients']})
ingredient_ids = {name: i + 1 for i, name in enumerate(ingredients)}
for name, identifier in ingredient_ids.items():
    rows.append('INSERT OR IGNORE INTO ingredients VALUES (' + str(identifier) + ',' + quote(name) + ');')
for product in products:
    values = [product['id'], product['name'], round(product['price'] * 100), product['description'], product['image'], product['category'], product['rating'], product['reviews']]
    rows.append('INSERT OR IGNORE INTO products VALUES (' + ','.join(map(quote, values)) + ');')
    for position, name in enumerate(product['ingredients']):
        rows.append('INSERT OR IGNORE INTO product_ingredients VALUES (' + ','.join(map(str, (product['id'], ingredient_ids[name], position))) + ');')
(root / 'database' / '002_seed.sql').write_text('\n'.join(rows) + '\n', encoding='utf-8')
print('Seed SQL gerado com', len(products), 'produtos.')
