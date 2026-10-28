"""Repositórios com consultas parametrizadas e lotes atômicos."""
import sqlite3
from contextlib import closing


class SQLiteRepository:
    def __init__(self, path):
        self.path = path

    def connect(self):
        conn = sqlite3.connect(self.path, timeout=15)
        conn.row_factory = sqlite3.Row
        conn.execute('PRAGMA foreign_keys = ON')
        return conn

    async def all(self, sql, params=()):
        with closing(self.connect()) as conn:
            return [dict(row) for row in conn.execute(sql, params).fetchall()]

    async def batch(self, statements):
        with closing(self.connect()) as conn:
            with conn:
                for sql, params in statements:
                    conn.execute(sql, params)


class D1Repository:
    def __init__(self, db):
        self.db = db

    async def all(self, sql, params=()):
        result = await self.db.prepare(sql).bind(*params).all()
        return result.to_py()['results']

    async def batch(self, statements):
        from pyodide.ffi import to_js
        await self.db.batch(to_js([self.db.prepare(sql).bind(*params) for sql, params in statements]))
